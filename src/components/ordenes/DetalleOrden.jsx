import { React, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Global from '../../helpers/Global';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';


const DetalleOrden = () => {

    const location = useLocation();
    let idOrden = location.state.idOrden;
    let token = localStorage.getItem("token");
    const [orden, setOrden] = useState();
    const [menu, setMenu] = useState();
    const [extras, setExtras] = useState();
    const [qingredientes, setQingredientes] = useState([]);
    const [aingredientes, setAingredientes] = useState();
    const [descripDelivery, setDescripDelivery] = useState();
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [id_orden, setId_orden] = useState();
    const [observation, setObservation] = useState({});
    const [textAreaValues, setTextAreaValues] = useState({});
    const [adicional, setAdicional] = useState();
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
    const [hamburguesaSelected, setHamburguesaSelected] = useState();
    const [maxCantidadHamburguesa, setMaxCantidadHamburguesa] = useState(0);
    const [selectedHamburguesa, setSelectedHamburguesa] = useState([]);
    const [qingredientesHamburguesa, setQingredientesHamburguesa] = useState([]);
    const [eIngredienteHamburguesa, setEIngredienteHamburguesa] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [cursorPos, setCursorPos] = useState({ start: 0, end: 0 });
    const [arrayAlitas, setArrayAlitas] = useState([]);
    const [tipoAlitas, setTipoAlitas] = useState(['Full picantes', 'Medio picantes', 'Poco picantes','Broster','Naturales']);
    const [selectedAlitas, setSelectedAlitas] = useState([]);



    const Seccion = ({ key, indexQ, id_menu, setObservation, observation, cursorPos, setCursorPos }) => {
        const textareaRef = useRef(null);


        const handleTextAreaChange = (itemKey, innerArrayIndex, event) => {
            const { value, selectionStart, selectionEnd } = event.target;

            setCursorPos(prev => ({
                ...prev,
                [`${itemKey}-${innerArrayIndex}`]: { start: selectionStart, end: selectionEnd }
            }));

            setObservation(prevValues => {
                const newValues = { ...prevValues };
                if (!newValues[itemKey]) {
                    newValues[itemKey] = {};
                }
                newValues[itemKey][innerArrayIndex] = value;

                return newValues;
            });
        };

        useEffect(() => {
            if (textareaRef.current && cursorPos[`${indexQ}-${id_menu}`]) {
                const { start, end } = cursorPos[`${indexQ}-${id_menu}`];
                textareaRef.current.setSelectionRange(start, end);
                textareaRef.current.focus();
            }
        }, [cursorPos, indexQ, id_menu]);

        return (
            <div>
                <div className='observacion__ingredientes'>
                    <div className='modal__subtitle centrar'>
                        <span className='subtitle__modal'>Observaciones</span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        className='ingredientes__input'
                        onChange={(event) => handleTextAreaChange(indexQ, id_menu, event)}
                        placeholder='Ingrese las observaciones'
                        value={observation?.[indexQ]?.[id_menu] || ""}
                        id={`textarea-${indexQ}-${id_menu}`}
                    />
                </div>

            </div>
        );
    };

    useEffect(() => {
        console.log(selectedAlitas);
    }, [selectedAlitas]);


    const handleClose = () => setShow(false);

    const handleShow = (item) => {

        const cantidad = {
            [item.id_menu._id]: item.id_menu.cantidad_hamburguesa
        }

        setId_orden(item._id);

        setMaxCantidadHamburguesa(cantidad);
        setSelectedItem(item);
        setShow(true);
    }

    const actualizarA = async (e, id_menu) => {
        e.preventDefault();

        let id_det_orden = id_orden;

        let body = {
            id_menu: id_menu,
            observacion: observation,
            qingre: qingredientes,
            qingredientes: eIngredienteHamburguesa,
            hamburguesa: selectedHamburguesa,
            alitas: selectedAlitas
        }

        const request = await fetch(Global.url + 'det-orden/update/' + id_det_orden, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": 'application/json',
                "authorization": token
            }
        });

        //limpiarEstados();

        //handleClose();

    }

    const limpiarEstados = () => {
        setObservation({});
        setQingredientes([]);
        setAingredientes([]);
        setSelectedHamburguesa([]);
        setEIngredienteHamburguesa([]);
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
            setOrden(data.detalle);
            setTotal(data.ordens.total);

            let array_alas = [];

            data.detalle.map(item => {

                item.id_menu.alitas == 'S' ? array_alas.push(item.id_menu._id) : null;
            });

            setArrayAlitas(array_alas);


            //setCantidadHamburguesa(data.ordens[0].items[0].cantidad_hamburguesa);
        } else {
            console.log('error');
        }
    }

    const devuelveDethamburguesa = async (elemento) => {

        const c_body = {
            id: elemento
        }

        const request = await fetch(Global.url + 'det-menu/ingredientesHamburguesa/', {
            method: "POST",
            body: JSON.stringify(c_body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {

            console.log(data.listas);

            setQingredientesHamburguesa(data.listas);

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
        setMdelivery(0);

        if (tipo == 1) {
            setNombre('En mesa');
        } else {
            setNombre('');
        }

    }

    useEffect(() => {
        if (ordenType == 4 || ordenType != 1 && changeCheck) {
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

            const delivery = data.deliveryList.map(delivery => {
                return {
                    value: delivery._id,
                    label: delivery.zona + ' ' + delivery.cost_delivery + '$'
                }
            });


            setDescripDelivery(data.deliveryList);
            setListDelivery(delivery);
        }
    }

    const changedDelivery = (options) => {

        setIdDelivery(options)
        const coste = descripDelivery.find(delivery => delivery._id == options.value);
        setMdelivery(coste.cost_delivery);

    }

    const buscarDetMenu = async () => {

        let idMenus = [];
        orden.map(item => {
            idMenus.push(item.id_menu._id);
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

            let hamburguesas = data.listas.map(item => {
                return item.hamburguesaSelected;
            });

            setMenu(listArticle);
            setExtras(listExtra);
            setHamburguesaSelected(hamburguesas);


        } else {
            console.log('error');
        }
    }

    useEffect(() => {
        buscarOrden(idOrden);
    }, []);

    useEffect(() => {
        if (orden) {
            devuelveTipo();
            buscarDetMenu();
        }
    }, [orden]);

    useEffect(() => {
        console.log(eIngredienteHamburguesa);
    }, [eIngredienteHamburguesa]);

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

    useEffect(() => {
        //console.log(checkedItems);
    }, [checkedItems]);


    useEffect(() => {
        updateTextArea();
    }, [checkedItems]);

    const updateTextArea = () => {
        const newTextAreaValues = {}; // Reiniciar los valores del textarea

        for (const itemKey in checkedItems) {
            newTextAreaValues[itemKey] = newTextAreaValues[itemKey] || {}; // Inicializar el objeto para este item

            for (const innerArrayIndex in checkedItems[itemKey]) {
                let itemText = "";
                for (const elementId in checkedItems[itemKey][innerArrayIndex]) {
                    if (checkedItems[itemKey][innerArrayIndex][elementId].checked) {
                        itemText += `Sin ${checkedItems[itemKey][innerArrayIndex][elementId].name}`;
                    }
                }
                newTextAreaValues[itemKey][innerArrayIndex] = itemText; // Guardar el texto para este textarea
            }
        }

        setTextAreaValues(newTextAreaValues);
    };

    const quitarIngredientes = (evento, id, menu, indexQ) => {


        const isChecked = evento.target.checked;

        setQingredientes(prevState => {
            const updatedState = { ...prevState };

            if (!prevState[menu]) updatedState[menu] = [];
            if (!prevState[menu]?.[indexQ]) updatedState[menu][indexQ] = [];

            if (isChecked) {
                updatedState[menu][indexQ].push(id);

            } else {
                updatedState[menu][indexQ] = updatedState[menu][indexQ].filter(item => item != id);

            }

            return updatedState;
        });
    }

    useEffect(() => {
        console.log(qingredientes)
    }, [qingredientes]);


    const actualizaDetalle = async () => {

        let body = {
            name: nombre,
            total: total + parseInt(mdelivery),
            orderType: ordenType,
        };

        if (ordenType == 4) {
            const id_del = descripDelivery.find(delivery => delivery._id == idDelivery.value);

            body.delivery = id_del;
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

                if (checkPago) {
        
                    navigate('/rousse/pagar', { state: { idOrden } });
        
                } else {
                    let valor = 1;
                    navigate('/rousse/success', { state: { valor } });
        
                }
            }
        }
    }

    const actualizarOrden = async (e) => {
        e.preventDefault();
        actualizaDetalle();
    }

    useEffect(() => {
        console.log(eIngredienteHamburguesa);
    }, [eIngredienteHamburguesa]);

    const handleCheckboxIngredientes = (evento, indexQ, index, idmenu, id_article) => {

        const idHamburguesa = evento.target.value;
        const isChecked = evento.target.checked;

        setEIngredienteHamburguesa(prevState => {
            const updatedState = { ...prevState };

            if (!prevState[idmenu]) updatedState[idmenu] = [];
            if (!prevState[idmenu]?.[indexQ]) updatedState[idmenu][indexQ] = [];

            if (isChecked) {
                updatedState[idmenu][indexQ].push(id_article);

            } else {
                updatedState[idmenu][indexQ] = updatedState[idmenu][indexQ].filter(item => item != id_article);
            }

            return updatedState;
        });
    };

    const handleAlitas = (evento, indexQ,idmenu) => {    
        const isChecked = evento.target.checked;   
        const alas = evento.target.value;
        
        setSelectedAlitas(prevState => {
            const updatedState = { ...prevState };

            if (!prevState[idmenu]) updatedState[idmenu] = [];
            if (!prevState[idmenu]?.[indexQ]) updatedState[idmenu][indexQ] = [];

            if (isChecked) {
                updatedState[idmenu][indexQ].push(alas);

            } else {
                updatedState[idmenu][indexQ] = updatedState[idmenu][indexQ].filter(item => item != alas);
            }

            return updatedState;
        });
       
    }

    const handleCheckboxChange = (evento, items, index, idmenu) => {
        const idHamburguesa = evento.target.value;
        const isChecked = evento.target.checked;

        setSelectedHamburguesa(prevState => {
            const updatedState = { ...prevState };

            if (!prevState[idmenu]) updatedState[idmenu] = [];
            if (!prevState[idmenu]?.[items]) updatedState[idmenu][items] = [];

            if (isChecked) {
                updatedState[idmenu][items].push(idHamburguesa);
                if (updatedState[idmenu][items].length > maxCantidadHamburguesa[idmenu]) {
                    updatedState[idmenu][items].pop(); // Eliminar la última hamburguesa agregada
                    console.log(`No puedes seleccionar más de ${maxCantidadHamburguesa[idmenu]} hamburguesas`);
                    evento.target.checked = false;
                }
            } else {
                updatedState[idmenu][items] = updatedState[idmenu][items].filter(item => item != idHamburguesa);

                if (eIngredienteHamburguesa[idmenu]?.[items].length > 0) {
                    setEIngredienteHamburguesa(prevMap => {
                        const updatedMap = { ...prevMap };
                        delete updatedMap[idmenu][items];
                        return updatedMap;
                    });
                }


            }

            return updatedState;
        });
    };

    return (
        <div className='orden__crear orden__detalle orden--ampliar'>
            <div className="form-check form-switch totales">
                <span>Total: {total}</span>

                {(mdelivery > 0 && ordenType != 1) &&
                    <span>Total con delivery: {total + parseInt(mdelivery)}</span>
                }

            </div>

            <section className='crear__content detmenu__section '>

                <form className='crear__orden' onSubmit={evento => actualizarOrden(evento)}>

                    <div className='sections__menu'>
                        {orden && orden.map(item => {

                            return (
                                <section key={item._id} className='detalle__menu detalle__menu--detalle'>
                                    <Button variant="primary" onClick={() => handleShow(item)} className='button__detalle title__color--subtitle'>
                                        <span className=''>{item.id_menu.description} </span>
                                    </Button>
                                </section>
                            )

                        })

                        }
                    </div>

                    {selectedItem && (
                        <Modal show={show} onRequestClose={() => { }} // Evita el cierre con Esc
                            shouldCloseOnOverlayClick={false} // Evita el cierre al hacer clic fuera 
                        >

                            <Modal.Header closeButton className='modal__detalle'>
                                <Modal.Title className='modal__detalle'>{selectedItem.id_menu.description} cantidad: {selectedItem.quantity}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className='modal__detalle'>
                                {[...Array(selectedItem.quantity).keys()].map(indexQ => (
                                    <div>
                                        {menu && menu.map(q_ing => {
                                            return (
                                                <div key={q_ing._id} className='detalle__menu detalle__menu--detalle modal__ingredientes'>
                                                    {q_ing.map && q_ing.map(ing => {
                                                        if (ing.idmenu == selectedItem.id_menu._id) {
                                                            return (
                                                                <div key={ing._id} className='ingredientes__detalle'>
                                                                    <span className='title__subtitle--subtitle center'>
                                                                        <input type="checkbox"
                                                                            className='checkbox__ingredientes'
                                                                            onChange={(evento) => quitarIngredientes(evento, ing._id, selectedItem.id_menu._id, indexQ)}
                                                                            checked={qingredientes[selectedItem.id_menu._id]?.[indexQ]?.includes(ing._id) || false}
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

                                        {hamburguesaSelected && hamburguesaSelected.map((hambur, index2) => {
                                            return (
                                                <div key={hambur._id} className='detalle__menu detalle__menu--detalle modal__ingredientes'>

                                                    {hambur.map && hambur.map((hamburguesa, index) => {
                                                        if (hamburguesa.idmenu == selectedItem.id_menu._id) {
                                                            return (
                                                                <div key={hamburguesa._id} className='ingredientes__detalle'>
                                                                    <span className='title__subtitle--subtitle center'>
                                                                        <input type="checkbox" className='checkbox__ingredientes'
                                                                            onChange={(evento) => handleCheckboxChange(evento, indexQ, index, selectedItem.id_menu._id)}
                                                                            value={hamburguesa._id}
                                                                            checked={selectedHamburguesa[selectedItem.id_menu._id]?.[indexQ]?.includes(hamburguesa._id) || false}
                                                                        />
                                                                        {hamburguesa.description}

                                                                    </span>

                                                                </div>


                                                            )
                                                        }
                                                    })}

                                                    {hambur.map && hambur.map((hamburguesa, index) => {
                                                        if (hamburguesa.idmenu == selectedItem.id_menu._id && selectedHamburguesa[selectedItem.id_menu._id]?.[indexQ]?.includes(hamburguesa._id)) {
                                                            return (
                                                                <div key={hamburguesa._id} className='section__ingredientes'>
                                                                    <span className='title__subtitle--subtitle centrar'> Quitar ingredientes </span>

                                                                    {
                                                                        hamburguesa.id_hamburguesa &&
                                                                        <div className='ingredientes__adicional'>
                                                                            {hamburguesa.id_hamburguesa.map(hamb => {
                                                                                return (
                                                                                    <div className=''>
                                                                                        <input type="checkbox" className='checkbox__ingredientes-adicionales'
                                                                                            onChange={(evento) => handleCheckboxIngredientes(evento, indexQ, index, selectedItem.id_menu._id, hamb.id_article._id)}
                                                                                            value={hamburguesa._id}
                                                                                            checked={eIngredienteHamburguesa[selectedItem.id_menu._id]?.[indexQ]?.includes(hamb.id_article._id) || false}
                                                                                        />
                                                                                        <span className='ingredientes-adicionales--descripcion'>{hamb.id_article.name_article}</span>

                                                                                    </div>
                                                                                )
                                                                            })}

                                                                        </div>
                                                                    }

                                                                </div>


                                                            )
                                                        }
                                                    })}

                                                </div>
                                            )

                                        })}

                                        <Seccion key={indexQ} indexQ={indexQ} id_menu={selectedItem.id_menu._id} setObservation={setObservation} observation={observation} cursorPos={cursorPos} setCursorPos={setCursorPos} />
                                       
                                        {arrayAlitas.includes(selectedItem.id_menu._id) &&
                                            <div className='alitas__container'>
                                                <label className='alitas__label'>Alitas</label>
                                                {tipoAlitas.map((alita, index) => {
                                                    return (
                                                        <div className='alitas__item' key={index}>
                                                            <input type="checkbox" name='alitas' id='alitas' value={alita} 
                                                            checked={selectedAlitas[selectedItem.id_menu._id]?.[indexQ]?.includes(alita) || false}
                                                            onChange={(e) => handleAlitas(e,indexQ, selectedItem.id_menu._id)} />
                                                            <label htmlFor="alitas">{alita}</label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }
                                    </div>

                                ))}


                            </Modal.Body>
                            <Modal.Footer className='modal__detalle'>
                                <Button onClick={handleClose} className='modal__detalle modal__button'>
                                    Cerrar
                                </Button>
                                <Button className='modal__detalle modal__button' onClick={evento => actualizarA(evento, selectedItem.id_menu._id)}>
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
                            {(changeCheck && ordenType != 1) &&

                                <Select name="delivery" className="user__input--orden"
                                    onChange={changedDelivery}
                                    options={listDelivery}
                                    isSearchable={true}
                                    value={idDelivery}
                                >

                                </Select>

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