import { React, useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import Message from '../Util/Message';
import { useNavigate } from 'react-router-dom';

const Delivery = () => {

    const [costDelivery, setCostDelivery] = useState(1);
    const { form, changed } = useForm({});
    const token = localStorage.getItem("token");
    const [message, setMessage] = useState();
    const [variant, setVariant] = useState();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

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
            setMessage('Zona guardada');
            setVariant('Correcto');

        } else {
            setMessage('Error guardando zona '+dataRegist.message);
            setVariant('Error');
        }

        handleAlert();
    }

    const handleAlert = () => {
        setShowAlert(true); 
        setTimeout(() => {
            setShowAlert(false);
            setMessage('');
            setVariant('');
        }, 5000);
    }   



    return (
        <div className='orden__crear'>
            <Message showAlert={showAlert} tipo={variant} message={message} />
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
                <input className="user__button" value="Lista delivery" onClick={() => navigate('/rousse/list-deliveries')} />
            </section>

        </div>
    )
}

export default Delivery