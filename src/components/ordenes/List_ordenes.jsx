import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconView } from '../Util/Iconos';
import moment from 'moment';

const List_ordenes = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const idcaja = localStorage.getItem("idcaja");
    const [ordens, setOrdens] = useState([]);
    const [ordensPro, setOrdensPro] = useState([]);
    const [idsParaEliminar, setIdsParaEliminar] = useState([]);
    const tipo_orden = {
        1: 'En mesa',
        2: 'Fiado sin abono',
        3: 'Mas tarde',
        4: 'Delivery'
    }

    const toggleEliminar = (id) => {
        if (idsParaEliminar.includes(id)) {
            setIdsParaEliminar(idsParaEliminar.filter((idParaEliminar) => idParaEliminar !== id));
        } else {
            setIdsParaEliminar([...idsParaEliminar, id]);
        }
    };

    const clickPagar = (idOrden, total) => {
        navigate('/rousse/pagar', { state: { idOrden, total } });
    }

    const eliminar = async (idOrden) => {

        const requestDel = await fetch(Global.url + 'orden/delete-orden/' + idOrden, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });

        const dataDel = await requestDel.json();


        fecthOrden();

    }

    useEffect(() => {
    
        fecthOrden();
    }, []);

    const fecthOrden = async () => {

        const ordenpen = await devuelveOrdenes('P'); // busco las pendiente
        console.log('pendientes...', ordenpen);
        setOrdens(ordenpen);
        const ordenPro = await devuelveOrdenes('S'); // busco las procesada
        console.log('Procesada..', ordenPro);
        setOrdensPro(ordenPro);
    }

    const devuelveOrdenes = async (ind) => {

        let body = {
            status: 0,
            id_caja: idcaja
        }

        if (ind == 'P') {
            body.status = 1;
            setOrdens({});
        } else {
            body.status = 2;
            setOrdensPro({});
        }


        const request = await fetch(Global.url + 'orden/listOrdenes', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "authorization": token,
                "box": idcaja
            }
        });

        let data = await request.json();

        if (data.status == 'success') {

            if (ind == 'P') {
                return data.ordens;
            } else {
                return data.ordens;
            }

        }

        console.log(data.ordens);

    }

    const detailOrden = (id) => {
        navigate('/rousse/detalles-ordenes', { state: { idOrden: id } });
    }

    return (
        <div className='orden__crear'>
            <span className='title__color title__pagar'>Ordenes pendientes del dia</span>

            <section className='list__ordens'>

                {ordens && ordens.length > 0 && ordens.map((list, index) => {
                    return (
                        <section key={index} className='ordens__group'>

                            <article className='group__article' onClick={() => clickPagar(list._id, list.total)}>
                                <ul className='detalle__pedidos'>
                                    <li className='list__detalles'><span className='tittle__span'>Nombre:</span> <span>{list.name}</span></li>
                                    <li className='list__detalles'><span className='tittle__span'>Tipo : </span>  <span>{tipo_orden[list.orderType]}</span></li>
                                    <li className='list__detalles'><span className='tittle__span'>Total : </span><span>{list.total}</span></li>
                                    <li className='list__detalles'><span className='tittle__span'>#</span><span>{list.num_orden}</span></li>  
                                </ul>

                                <div className='orden__pedido pedidos_ordenes'>
                                    {list.items && list.items.map((item, index) => {
                                        return (
                                            <div key={index} className='orden__pedidos'>
                                                <span className='item__menu'>{item.description} cantidad: {item.quantity}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                            </article>

                            <div className="form-check form-switch icons_pedido">
                                <div>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Eliminar?</label>
                                    <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault${index}`} onChange={() => toggleEliminar(list._id)} />
                                </div>

                                <div>
                                <IconView />
                                    <span className="form-check-label"  onClick={ () => detailOrden(list._id) } >Detalle pedido</span>
                                </div>

                            </div>

                            {idsParaEliminar.includes(list._id) && (
                                <FontAwesomeIcon icon={faTrash} className='menu__icon--select list__icon' onClick={() => eliminar(list._id)} />
                            )}
                        </section>
                    )
                })}
            </section>


            <span className='title__color title__pagar'>Ordenes procesadas del dia</span>

            <section className='list__ordens'>

                {ordensPro && ordensPro.length > 0 && ordensPro.map((list, index) => {
                    return (
                        <section key={index} className='ordens__group'>

                            <article className='group__article' onClick={() => clickPagar(list._id, list.total)}>
                                <span>Nombre: {list.name}</span>
                                <span>Tipo : {list.orderType}</span>
                                <span>Total : {list.total}</span>
                                <div className='orden__pedido'>
                                    Pedido:
                                </div>
                                {list.items && list.items.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <span className='item__menu'>{item.description}</span>
                                            <p className='item__menu'> cantidad: {item.quantity}</p>
                                        </div>
                                    )
                                })}
                            </article>

                        </section>
                    )
                })}
            </section>
        </div>
    )
}

export default List_ordenes