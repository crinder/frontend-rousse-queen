import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import { useLocation, useNavigate } from 'react-router-dom';

const Pagar = () => {

    const [paymement, setPaymement] = useState(1);
    const [metodo, setMetodo] = useState([]);
    const [saved, setSaved] = useState("");
    const [mostrar, setMostrar] = useState(true);
    const navigate = useNavigate();

    const [montoUs, setMontoUs] = useState(0);
    const [vueltoUs, setVueltoUs] = useState(0);
    const [vueltoBs, setVueltoBs] = useState(0);
    const [vueltoUs1, setVueltoUs1] = useState(0);
    const [recibidoUS, setRecibido] = useState(0);
    const [recibidoBS, setRecibidoBS] = useState(0);
    const [tasa, setTasa] = useState(0);
    const [numrefere, setNumrefere] = useState('');

    const location = useLocation();
    const token = localStorage.getItem("token");
    let idOrden = location.state.idOrden;

    useEffect(() => {
        if (idOrden) {
            devuelveTasa();
        } else {
            navigate('/rousse/home');
        }
    }, [idOrden, navigate]);

    useEffect(() => {
        devuelveOrden();
        devuelveMetodos();
    }, [tasa]);

    useEffect(() => {

        if (idOrden) {
            paymement2();
        }
    }, [recibidoUS, recibidoBS, idOrden]);

    useEffect(() => {
        if (idOrden) {
            paymement3();
        }
    }, [vueltoUs]);

    /*pagos*/

    const changedRecibidoUs = (event) => {

        let recibe = event.target.value;
        recibe = recibe.replace(/[^\d]/g, '');

        setRecibido(recibe);

    }

    const devuelveOrden = async () => {

        const request = await fetch(Global.url + 'orden/list-detail/' + idOrden, {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setMontoUs(data.ordens.total);
        } else {
            console.log('error');
        }
    }

    const paymement2 = () => {

        if (paymement == 2) {

            let total_us = recibidoUS - montoUs;
            setVueltoUs(total_us);

            let resto = parseInt(total_us) + parseInt(montoUs);

            let dif = parseInt(recibidoUS) - parseInt(montoUs);

            if (vueltoUs > dif) {
                setVueltoBs(0)
            }

        } else if (paymement == 3 || paymement == 4) {

            let total;
            let recibido = parseInt(recibidoUS);

            total = recibido - montoUs;

            let resto = montoUs - recibido;

            console.log(total);
            console.log(resto);

            total = total + resto;


            if (isNaN(total)) {
                setVueltoUs1(0);
            } else {
                setRecibidoBS(resto * tasa);
                setVueltoUs1(total);
            }

        } else if (paymement == 1) {

            setRecibidoBS(montoUs * tasa);
        }

    }

    const paymement3 = () => {

        if (paymement == 2) {

            let total = recibidoUS - montoUs;

            console.log(total);

            if (vueltoUs >= total) {
                setVueltoUs(total);
                setVueltoBs(0);
            } else {

                let sumaVuelto = parseInt(recibidoUS) - parseInt(montoUs);

                if (parseInt(sumaVuelto) != parseInt(vueltoUs)) {
                    let totbs = total - vueltoUs;
                    totbs = totbs * tasa;
                    setVueltoBs(totbs);
                }

            }
        }
    }

    const changedVueltoUs = (event) => {

        let newVueltoUs = event.target.value;
        newVueltoUs = newVueltoUs.replace(/[^\d]/g, '');
        setVueltoUs(newVueltoUs);
        setVueltoBs(0);
    }

    const changedRecibidoBs = (event) => {

        const newReciboBS = event.target.value;

    }

    /* fin pagos */

    const changeMethod = (event) => {

        setRecibidoBS(0);
        setRecibido(0);
        setVueltoBs(0);
        setVueltoUs(0);
        setPaymement(event.target.value);
    }


    const devuelveMetodos = async () => {

        let c_body = {
            group: "metodo_pago"
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
            setSaved("success");
            setMetodo(dataPago.findStored);
            setRecibidoBS(1);
        } else {
            setSaved("error");
        }
    }

    const formatNumber = (number) => {
        const numericValue = number.replace(/[^0-9]/g, '');
        let formattedValue = '';
        for (let i = numericValue.length - 1; i >= 0; i--) {
            formattedValue = numericValue[i] + formattedValue;
            if ((numericValue.length - i) % 4 === 0 && i !== 0) {
                formattedValue = ',' + formattedValue;
            }
        }
        return formattedValue;
    }

    const changedNumrefere = (e) => {
        e.target.value = formatNumber(e.target.value);
        setNumrefere(e.target.value);

    }

    const validaMontos = () => {

        let message = 1;

        let recibido = recibidoUS - vueltoUs;
        let recibeBS = recibidoBS - vueltoBs;
        let vueltobol = vueltoBs / tasa;
        let vueltos = vueltobol + vueltoUs;
        let totalRecibido = recibido + recibeBS;

        if (paymement == 2) {

            if (vueltos > recibidoUS) {
                message = 'Vuelto no puede ser mayor al recibido';
            }

            if (vueltos > montoUs) {
                message = 'Vuelto no puede ser mayor al total...';
            }

            if (recibidoUS < montoUs) {
                message = 'El monto recibido no puede ser menor al total...';
            }

            if (recibido < montoUs) {
                message = 'El monto recibido no puede ser menor al total';
            }
        } else if (paymement == 1) {

            if (recibeBS < montoUs) {
                message = 'El monto recibido no puede ser menor al total';
            }

        } else if (paymement == 3 || paymement == 4) {

            if (totalRecibido < montoUs) {
                message = 'El monto recibido no puede ser menor al total';
            }

            if (vueltos > montoUs) {
                message = "El vuelto no puede ser mayor al total"
            }

        }

        return message;

    }

    /*Cobrar */

    const cobrar = async (event) => {
        event.preventDefault();

        //crear objeto

        const message = await validaMontos();

        if (message != 1) {
            console.log(message);
            return
        }



        let c_body = {
            paymement_method: paymement,
            rate: tasa,
            total: montoUs,
            total_local: montoUs * tasa,
            total_money: montoUs,
            received_local: recibidoBS,
            received_money: recibidoUS,
            change_local: vueltoBs,
            change_money: vueltoUs,
            numrefere: numrefere,
            status: 2 // pagada
        }

        const requestSave = await fetch(Global.url + 'orden/update/' + idOrden, {
            method: 'POST',
            body: JSON.stringify(c_body),
            headers: {
                "Content-type": "application/json",
                "authorization": token
            }
        });

        const dataSaved = await requestSave.json();

        if (dataSaved.status == "success") {
            let valor = 2; //pagar

            navigate('/rousse/success', { state: { valor } });

        } else {
            console.log('error');
            let valor = 3; //pagar

            navigate('/rousse/success', { state: { valor } });
        }
    }

    const devuelveTasa = async () => {

        const request = await fetch(Global.url + 'operation/list/', {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            setTasa(data.cajaStored.rate);
        } else {
            console.log('error');
        }

    }

    return (
        <div className='orden__crear '>
            {mostrar &&

                <section className=''>

                    <form className='orden__det' onSubmit={cobrar}>

                        <div className='pagar__span'>
                            <span className='title__color title__pagar'>Total a Pagar: {montoUs}$</span>

                        </div>

                        <div className='pagar__span'>
                            <span className='title__color title__pagar'>Tasa: {tasa}BS</span>
                        </div>

                        <div className='content__field'>
                            <label className="user__label--orden" htmlFor="paymement_method">Metodo de pago</label>
                            <select name="orderType" className="user__input--orden" onChange={changeMethod}>
                                {metodo.length > 0 && metodo.map(metod => {

                                    if (metod.code != 5 && metod.code != 6) {
                                        return (
                                            <option value={metod.code} key={metod.code}>{metod.descrip}</option>
                                        )
                                    }

                                })}
                            </select>
                        </div>

                        {paymement == 2 && (
                            <section className='method__pago'>

                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido</label>
                                    <input type="text" name='received_money' id='received_money' className='input__form' onChange={changedRecibidoUs} value={recibidoUS} required />
                                </div>

                                <div className='content__field'>

                                    <label htmlFor="received_money" className='label__form'>Vuelto US</label>
                                    <input type="text" name='change_money' id='change_money' className='input__form' onChange={changedVueltoUs} value={vueltoUs} required />

                                </div>

                                <div className='content__field'>

                                    <label htmlFor="received_money" className='label__form'>Vuelto BS</label>
                                    <input type="text" name='change_local' id='change_local' className='input__form' readOnly value={vueltoBs} />

                                </div>

                            </section>
                        )}

                        {paymement == 1 && (
                            <section className='method__pago'>
                                <div className='content__field'>
                                    <label htmlFor="total_local" className='label__form'>Monto Bs.</label>
                                    <input type="text" name='total_local' id='total_local' className='input__form' readOnly value={recibidoBS} />
                                </div>
                                <div className='content__field'>
                                    <label htmlFor="numrefere" className='label__form'>Número de referencia</label>
                                    <input type="text" name='numrefere' id='numrefere' className='input__form' onChange={e => changedNumrefere(e)} required />
                                </div>
                            </section>
                        )}

                        {paymement == 3 && (
                            <section className='method__pago'>
                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido $</label>
                                    <input type="text" name='received_money' id='received_money' className='input__form' onChange={changedRecibidoUs} value={recibidoUS} required />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido BS</label>
                                    <input type="text" name='received_local' id='received_local' className='input__form' onChange={changedRecibidoBs} required value={recibidoBS} readOnly />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Vuelto $</label>
                                    <input type="text" name='change_local' id='change_local' className='input__form' onChange={changedVueltoUs} value={vueltoUs1} required />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="numrefere" className='label__form'>Referencia</label>
                                    <input type="text" name='numrefere' id='numrefere' className='input__form' onChange={e => changedNumrefere(e)} required />
                                </div>

                            </section>
                        )}

                        {paymement == 4 && (
                            <section className='method__pago'>
                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido US</label>
                                    <input type="text" name='received_money' id='received_money' className='input__form' onChange={changedRecibidoUs} required />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido BS</label>
                                    <input type="text" name='received_local' id='received_local' className='input__form' onChange={changedRecibidoBs} required />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Vuelto US</label>
                                    <input type="text" name='change_local' id='change_local' className='input__form' onChange={changedVueltoUs} value={vueltoUs1} required />
                                </div>
                            </section>
                        )}

                        {paymement == 5 && (
                            <section className='method__pago'>
                                <div className='content__field'>
                                    <label htmlFor="received_local" className='label__form'>Recibido BS</label>
                                    <input type="text" name='received_local' id='received_local' className='input__form' />
                                </div>

                                <div className='content__field'>

                                    <label htmlFor="abono_local" className='label__form'>Abono BS</label>
                                    <input type="text" name='abono_local' id='abono_local' className='input__form' />
                                </div>
                            </section>
                        )}

                        {paymement == 6 && (
                            <section className='method__pago'>
                                <div className='content__field'>
                                    <label htmlFor="received_money" className='label__form'>Recibido US</label>
                                    <input type="text" name='received_money' id='received_money' className='input__form' />
                                </div>

                                <div className='content__field'>
                                    <label htmlFor="abono_money" className='label__form'>Abono US</label>
                                    <input type="text" name='abono_money' id='abono_money' className='input__form' />
                                </div>
                            </section>
                        )}

                        <div className='button__pagar'>
                            <input type="submit" className="user__button" value='Cobrar' />
                        </div>
                    </form>

                </section>
            }

        </div>
    )
}

export default Pagar