import { React, useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';

const Delivery = () => {

    const [costDelivery, setCostDelivery] = useState(1);
    const { form, changed } = useForm({});
    const token = localStorage.getItem("token");

    const crear = async (e) => {
        e.preventDefault();

        const c_body = {
            zona: form.zona,
            cost_delivery: costDelivery
        }

        const requestRegist = await fetch(Global.url + 'delivery/register', {
            method: 'POST',
            body: JSON.stringify(c_body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataRegist = await requestRegist.json();

        if (dataRegist.status == 'success') {

        } else {
            console.log('error');
        }
    }




    return (
        <div className='orden__crear'>

            <section className='crear__content detmenu__section'>
                <form className='crear__orden' onSubmit={evento => crear(evento)}>

                    <div className='content__field--menu'>
                        <input type="text" name='zona' id='zona' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                        <label htmlFor="zona" className='input__label'>Zona</label>
                    </div>

                    <div className="user__label--select">
                        <label htmlFor="cost_delivery" className='label__form'>Costo de delivery</label>
                        <select name="cost_delivery" className="user__input--orden" onChange={evento => setCostDelivery(evento.target.value)}>
                            {
                                [...Array(10).keys()].map(index => (
                                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                                ))
                            }
                        </select>
                    </div>

                    <input type="submit" className="user__button" value="Crear" />


                </form>
            </section>

        </div>
    )
}

export default Delivery