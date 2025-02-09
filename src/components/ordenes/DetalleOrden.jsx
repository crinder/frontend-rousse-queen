import { React, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Global from '../../helpers/Global';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const DetalleOrden = () => {

    const location = useLocation();
    let idOrden = location.state.idOrden;
    let token = localStorage.getItem("token");
    const [orden, setOrden] = useState();
    const [menu, setMenu] = useState();
    const [extras, setExtras] = useState();
    const [qingredientes, setQingredientes] = useState();
    const [aingredientes, setAingredientes] = useState();
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [numitem, setNumitem] = useState(1);
    const [observation, setObservation] = useState();
    const [adicional, setAdicional] = useState();
    const [Q_checbox, setQ_checbox] = useState(false);
    const [A_checbox, setA_checbox] = useState(false);
    const [checkPago, setCheckPago] = useState(false);
    const [tiporden, setTiporden] = useState({});
    const [ordenType, setOrdenType] = useState(1);
    const [deliv, setDeliv] = useState('');
    const [changeCheck, useChangeCheck] = useState(false);
    const [nombre, setNombre] = useState('En mesa');
    const [mdelivery, setMdelivery] = useState(0);
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [listDelivery, setListDelivery] = useState('');
    const [idDelivery, setIdDelivery] = useState('');


    const handleClose = () => setShow(false);
    const handleShow = (item) => {
        setSelectedItem(item);
        setShow(true);
    }

    const actualizarA = async (e, id_menu) => {
        e.preventDefault();

        let body = {
            id_menu: id_menu,
            observacion: observation,
            qingredientes: qingredientes,
            aingredientes: aingredientes
        }

        setAdicional({
            ...adicional,
            [id_menu]: body
        });

        handleClose();

    }

    const buscarOrden = async (id) => {
        const request = await fetch(Global.url + 'orden/list-detail/' + idOrden, {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setOrden(data.ordens);
            setTotal(data.ordens[0].total);
        } else {
            console.log('error');
        }
    }


    const nombreCli = (event) => {

        let c_nombre = event.target.value;

        c_nombre = c_nombre.replace(/\d/g, '');

        setNombre(c_nombre);

    }

    const tipoOrden = (event) => {

        const tipo = event.target.value;

        setOrdenType(tipo);

        if (tipo == 1) {
            setNombre('En mesa');
        } else {
            setNombre('');
        }


    }

    useEffect(() => {
        if (ordenType == 4) {
            devuelveListDelivery();
        }

    }, [ordenType]);

    const devuelveListDelivery = async () => {

        const request = await fetch(Global.url + 'delivery/list_all', {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setListDelivery(data.deliveryList);
        }
    }

    const changedDelivery = (id) => {

        console.log(id);

        const coste = listDelivery.find(delivery => delivery._id == id);

        setMdelivery(coste.cost_delivery);
        setIdDelivery(id);


    }

    const buscarDetMenu = async () => {

        let idMenus = [];
        orden.map(item => {
            item.items.map(item => {
                idMenus.push(item.id_menu);
            })
        });

        let body = {
            idmenu: idMenus
        }

        const request = await fetch(Global.url + 'det-menu/listarArticulos', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {

            let listArticle = data.listas.map(item => {
                return item.listArticle;
            });

            let listExtra = data.listas.map(item => {
                return item.listExtra;
            });

            setMenu(listArticle);
            setExtras(listExtra);

        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        buscarOrden(idOrden);
    }, []);

    useEffect(() => {
        devuelveTipo();
        buscarDetMenu();
    }, [orden]);

    const devuelveTipo = async () => {

        let c_body = {
            group: "tipo_orden"
        }


        const requestPago = await fetch(Global.url + 'descripcion/filter', {

            method: "POST",
            body: JSON.stringify(c_body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }

        });

        const dataPago = await requestPago.json();

        if (dataPago.status == "success") {
            setTiporden(dataPago.findStored);

        }

    }

    const quitarIngredientes = (evento, id, menu, description) => {

        let opc = evento.target.checked ? 'S' : 'N';

        if (aingredientes && aingredientes.hasOwnProperty(id)) {

            alert('No puedes quitar ' + description + ' porque esta como un extra');
            setQ_checbox({
                ...Q_checbox,
                [id]: false
            });

        } else {
            setQingredientes({
                ...qingredientes,
                [id]: {
                    id_menu: menu,
                    opc: opc,
                    id_article: id,
                    item: numitem,
                    description: description
                }
            });

            setQ_checbox({
                ...Q_checbox,
                [id]: true
            });
        }


    }

    const addIngredientes = (evento, id, menu, description) => {
        let opc = evento.target.checked ? 'S' : 'N';

        if (qingredientes && qingredientes.hasOwnProperty(id)) {

            alert('No puedes agregar ' + description + ' porque esta marcado para quitar');
            setA_checbox({
                ...A_checbox,
                [id]: false
            });

        } else {
            setAingredientes({
                ...aingredientes,
                [id]: {
                    id_menu: menu,
                    opc: opc,
                    id_article: id,
                    item: numitem,
                    description: description
                }
            });

            setA_checbox({
                ...A_checbox,
                [id]: true
            });
        }

    }

    const actualizzaObservacion = (id) => (evento) => {
        setObservation({
            ...observation,
            [id]: evento.target.value
        });
    }

    const actualizaDetalle = async () => {

        let body = {
            name: nombre,
            total: total + parseInt(mdelivery),
            orderType: ordenType,
        };

        if (ordenType == 4) {
            body.delivery = idDelivery;
            body.cost_delivery = mdelivery;
        } else {
            body.cost_delivery = 0;
        }

        if (body) {

            const request = await fetch(Global.url + 'orden/update/' + idOrden, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": 'application/json',
                    "authorization": token
                }
            });


            const data = await request.json();

            if (data.status == "success") {
                console.log('success');

                let body = adicional;

                if (body) {

                    const request = await fetch(Global.url + 'orden/update-adicional/' + idOrden, {
                        method: "POST",
                        body: JSON.stringify(body),
                        headers: {
                            "Content-type": 'application/json',
                            "authorization": token
                        }
                    });


                    const data = await request.json();

                    if (data.status == "success") {

                    }

                }

                /*if (checkPago) {
                    let idOrden = 'valor';
        
                    navigate('/rousse/pagar', { state: { idOrden } });
        
                } else {
                    let valor = 1;
                    navigate('/rousse/success', { state: { valor } });
        
                }*/
            }

        }

    }

    const actualizarOrden = async (e) => {

        e.preventDefault();

        actualizaDetalle();



    }



    return (
        <div className='orden__crear orden__detalle'>

            <section className='crear__content detmenu__section'>
                <form className='crear__orden' onSubmit={evento => actualizarOrden(evento)}>



                    {orden && orden.map(item => {
                        return (
                            <div className='ordenes__container'>
                                {item.items.map(item => {
                                    return (
                                        <section key={item._id} className='detalle__menu detalle__menu--detalle'>
                                            <Button variant="primary" onClick={() => handleShow(item)} className='button__detalle'>
                                                <span className='title__color--subtitle'>{item.description} </span>
                                            </Button>

                                        </section>
                                    )
                                }
                                )}
                                <div className='total__sticky'>
                                    <span className='title__color--subtitle '>Total: {total}$</span>
                                </div>

                            </div>
                        )
                    })}

                    {selectedItem && (
                        <Modal show={show} onHide={handleClose} >
                            <Modal.Header closeButton className='modal__detalle'>
                                <Modal.Title className='modal__detalle'>{selectedItem.description} cantidad: {selectedItem.quantity}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='modal__detalle'>

                                <div className='modal__title'>
                                    <div className='modal__select'>
                                        <select className='select__cantidad' defaultValue={selectedItem.quantity} onChange={evento => (setNumitem(evento.target.value))}>
                                            {[...Array(selectedItem.quantity).keys()].map(index => (
                                                <option key={index + 1} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='modal__subtitle'>
                                        <span className='subtitle__modal'>Quitar ingredientes?</span>
                                    </div>
                                </div>



                                {menu && menu.map(q_ing => {
                                    return (
                                        <div key={q_ing._id} className='detalle__menu detalle__menu--detalle modal__ingredientes'>
                                            {q_ing.map && q_ing.map(ing => {
                                                if (ing.idmenu == selectedItem.id_menu) {
                                                    return (
                                                        <div key={ing._id} className='ingredientes__detalle'>
                                                            <span className='title__subtitle--subtitle center'>
                                                                <input type="checkbox" checked={Q_checbox[ing._id] || false}
                                                                    className='checkbox__ingredientes'
                                                                    onChange={(evento) => quitarIngredientes(evento, ing._id, selectedItem.id_menu, ing.name_article)}
                                                                />
                                                                {ing.name_article}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    )
                                })}

                                <div className='modal__subtitle centrar'>
                                    <span className='subtitle__modal'>Añadir ingredientes?</span>
                                </div>

                                {extras && extras.map(a_ing => {

                                    return (
                                        <div key={a_ing._id} className='detalle__menu detalle__menu--detalle modal__ingredientes'>
                                            {a_ing.map && a_ing.map(ing => {
                                                if (ing.idmenu == selectedItem.id_menu) {
                                                    return (
                                                        <div key={ing._id} className='ingredientes__detalle'>
                                                            <span className='title__subtitle--subtitle center'>
                                                                <input
                                                                    className='checkbox__ingredientes'
                                                                    type="checkbox"
                                                                    checked={A_checbox[ing._id] || false}
                                                                    onChange={(evento) => addIngredientes(evento, ing._id, selectedItem.id_menu, ing.name_article)}
                                                                />
                                                                {ing.name_article}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            })
                                            }

                                        </div>
                                    )
                                }
                                )}

                                <div className='observacion__ingredientes'>
                                    <div className='modal__subtitle centrar'>
                                        <span className='subtitle__modal'>Observaciones</span>
                                    </div>

                                    <textarea className='ingredientes__input' placeholder='Ingrese las observaciones' onChange={actualizzaObservacion(selectedItem.id_menu)}></textarea>
                                </div>

                                <div className='modal__ingredientes--adicional'>

                                    {qingredientes && Object.values(qingredientes).map(q_ing => {


                                        if (q_ing.id_menu == selectedItem.id_menu) {
                                            return (
                                                <div className='ingredientes__adicional'>

                                                    <span>{q_ing.item}</span> <span>{selectedItem.description} sin {q_ing.description}</span> </div>
                                            )
                                        }

                                    })}

                                    {aingredientes && Object.values(aingredientes).map(a_ing => {

                                        if (a_ing.id_menu == selectedItem.id_menu) {
                                            return (
                                                <div className='ingredientes__adicional'>

                                                    <span>{a_ing.item}</span> <span>{selectedItem.description} sin {a_ing.description}</span> </div>

                                            )
                                        }

                                    })}

                                </div>




                            </Modal.Body>
                            <Modal.Footer className='modal__detalle'>
                                <Button onClick={handleClose} className='modal__detalle modal__button'>
                                    Cerrar
                                </Button>
                                <Button className='modal__detalle modal__button' onClick={evento => actualizarA(evento, selectedItem.id_menu)}>
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}

                    <div className='container__detalle'>

                        <div className='detalle__section'>
                            <label className="user__label--orden" htmlFor="user">Tipo de orden</label>
                            <select name="orderType" className="user__input--orden select__tipo" onChange={tipoOrden}>

                                {tiporden.length > 0 && tiporden.map(orden => {
                                    return (
                                        <option value={orden.code} key={orden.code}>{orden.descrip}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className='detalle__section content__field--menu'>

                            <input type="text" name='name' id='name' className='input__form--menu input__control' placeholder=' ' onChange={nombreCli} required value={nombre} />
                            <label htmlFor="user" className='input__label '>Nombre</label>
                        </div>

                        <div className='detalle__section'>
                            {(ordenType != 1 && ordenType != 4) &&
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={e => useChangeCheck(e.target.checked)} checked={changeCheck} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Delivery?</label>
                                </div>
                            }

                        </div>

                        <div className='detalle__section'>
                            {(changeCheck && ordenType != 1 || ordenType == 4) &&

                                <select name="delivery" className="user__input--orden" onChange={evento => changedDelivery(evento.target.value)}>
                                    {listDelivery && listDelivery.map(delivery => {
                                        return (
                                            <option key={delivery._id} value={delivery._id}>{delivery.zona + ' ' + delivery.cost_delivery + '$'}</option>
                                        )
                                    })}
                                </select>

                            }
                        </div>

                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={e => setCheckPago(e.target.checked)} checked={checkPago} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Pago inmediato?</label>
                        </div>

                    </div>




                    <input type="submit" className="user__button" value="Confirmar" />

                </form>
            </section>
        </div >
    )
}

export default DetalleOrden