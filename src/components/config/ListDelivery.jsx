import { React, useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import { IconDelete } from '../Util/Iconos';

const ListDelivery = () => {

    const token = localStorage.getItem("token");
    const [lista, setLista] = useState([]);

    useEffect(() => {
        listar();
    }, []);

    const listar = async () => {
        let sucursal = 1;

        const request = await fetch(Global.url + 'delivery/list_all', {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }

        });

        const data = await request.json();

        if (data.status == "success") {
            setLista(data.deliveryList);

        }
    }

    const EliminarDelivery = async (id) => {

        const requestEliminar = await fetch(Global.url + 'delivery/delete/' + id, {
            method: "DELETE",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataElimnar = await requestEliminar.json();

        if (dataElimnar.status == 'success') {
            listar();
        }

    }

    return (
        <div className='orden__crear'>
            <section className='crear__content detmenu__section'>
                <header className=''>
                    <span className='title__color--title'>Lista de delivery</span>
                </header>

                {lista && lista.map(delivery => {
                    return (
                        <section className="card__delivery" key={delivery._id} >
                            <div className='delivery__content'>
                                <span className='delivery__span'>{delivery.zona}</span>
                                <span className='delivery__span'>{delivery.cost_delivery}$</span>
                                <span className='delivery__span icon--hover' onClick={() => EliminarDelivery(delivery._id)}><IconDelete  /></span>
                            </div>


                        </section>

                    )
                })

                }


            </section>
        </div>
    )
}

export default ListDelivery