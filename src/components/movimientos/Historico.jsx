import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';

const Historico = () => {

    const token = localStorage.getItem('token');
    const [ordens, setOrdens] = useState([]);
 
    useEffect(() => {
        devuelveOrdenes();
    }, []);

    const devuelveOrdenes = async () => {
        setOrdens({});

        const request = await fetch(Global.url + 'orden/listOrdenes', {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "authorization": token
            }
        });

        let data = await request.json();

        if (data.status == 'success') {
            setOrdens(data.ordens);
        }

        console.log(data.ordens);

    }


  return (
    <div className='orden__crear'>
            <span className='title__color title__pagar'>Historico de ordenes</span>

            <section className='list__ordens'>

                {ordens && ordens.length > 0 && ordens.map((list, index) => {
                    return (
                        <section key={index} className='ordens__group'>

                            <article className='group__article'>
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

export default Historico