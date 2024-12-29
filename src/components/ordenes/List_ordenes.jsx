import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



const List_ordenes = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [ordens, setOrdens] = useState([]);
    const [ordensPro, setOrdensPro] = useState([]);
    const [idsParaEliminar, setIdsParaEliminar] = useState([]);
    const [saved,setSaved] = useState(false);
  
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
        

        const requestDel = await fetch(Global.url+'orden/delete-orden/'+idOrden,{
            method: 'DELETE',
            headers:{
                "Content-Type": "application/json",
                "authorization": token
            }
        });

        const dataDel = await requestDel.json();


        devuelveOrdenes();

    }

    useEffect(() => {
        const fecthOrden = async () =>  {

            const ordenpen = await devuelveOrdenes('P'); // busco las pendiente
            console.log('pendientes...',ordenpen);
            setOrdens(ordenpen);
            const ordenPro = await devuelveOrdenes('S'); // busco las procesada
            console.log('Procesada..',ordenPro);
            setOrdensPro(ordenPro);
        }

        fecthOrden();
    }, []);

    const devuelveOrdenes = async (ind) => {
        

        let body = {
            status: 0
        }

        if(ind == 'P'){
            body.status = 1;
            setOrdens({});
        }else{
            body.status = 2;
            setOrdensPro({});
        }
        

        const request = await fetch(Global.url + 'orden/listOrdenes', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "authorization": token
            }
        });

        let data = await request.json();

        if (data.status == 'success') {
            
            if(ind == 'P'){
                return data.ordens;
            }else{
                return data.ordens;
            }
           
        }

        console.log(data.ordens);

    }

    return (
        <div className='orden__crear'>
            <span className='title__color title__pagar'>Ordenes pendientes del dia</span>

            <section className='list__ordens'>

                {ordens && ordens.length > 0 && ordens.map((list, index) => {
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

                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault${index}`} onChange={() => toggleEliminar(list._id)} />
                                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Eliminar?</label>
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