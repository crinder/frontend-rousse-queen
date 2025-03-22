import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import Multiselect from 'multiselect-react-dropdown';

const OtrosPagos = () => {

    const token = localStorage.getItem('token');
    const idcaja = localStorage.getItem('idcaja');
    const tasa = localStorage.getItem('rate');
    const [opciones, setOpciones] = useState([]);
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [total, setTotal] = useState();
    const [totalMoney, setTotalMoney] = useState(total);
    const [totalLocal, setTotalLocal] = useState(0);
    const [observation, setObservation] = useState();  

    useEffect(() => {
        devuelvePagos();
    }, []);

    useEffect(() => {
        setTotalMoney(total);
    }, [total]);

    useEffect(() => {

        if (totalMoney > 31 && (totalMoney < 48 || totalMoney > 57)) {
            setTotalMoney(total);
        }


        if (totalMoney > total) {
            setTotalMoney(total);
        }

        let totalBS = total - totalMoney;

        if (isNaN(totalBS)) {
            totalBS = 0;
        }

        setTotalLocal(totalBS);

    }, [totalMoney]);

    const devuelvePagos = async () => {

        let body = {
            group: 'otros_pagos'
        }

        const requestData = await fetch(Global.url + 'descripcion/filter', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const DataRequest = await requestData.json();

        if (DataRequest.status == 'success') {
            setOpciones(DataRequest.findStored);
        }

    }

    const onSelect = async (selectedList, selectedItem) => {

        setOpcionesSeleccionadas(selectedList);
    }

    const onRemove = (selectedList, removedItem) => {

        setOpcionesSeleccionadas(selectedList);

    }

    const totalPagar = (evento) => {
        setTotal(evento.target.value);
    }

    const addCuenta = async (e) => {
        e.preventDefault();

        console.log(total);
        console.log(totalMoney);

        if (total <= 0 || totalMoney <= 0 || total <= '') {
            console.log('El monto total no puede ser 0');
        }

        if (!opcionesSeleccionadas || opcionesSeleccionadas == '') {
            console.log('array vacio');
        }

        let datos = [];


        opcionesSeleccionadas.map(opc => {

            let opcion = opc._id;

            datos.push(opcion);
        });

        let body = {
            pago: datos,
            total: total,
            total_local: totalLocal,
            total_money: totalMoney,
            observacion: observation
        }

        console.log(body);

        const requestSave = await fetch(Global.url + 'others/register', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "box": idcaja,
                "Content-Type": "application/json"
            }
        });

        const dataSave = await requestSave.json();

        if (dataSave.status == 'success') {
            console.log('guardado');
        }
    }

    const transforDivisa = (total) => {

        let totalBS = 0;

        if (isNaN(total)) {
            totalBS = 0;
        }else{
            totalBS = total * tasa;
        }

        setTotalLocal(totalBS);
    }

    return (
        <div className='orden__crear'>
            <form className='crear__orden pagos__tercero' onSubmit={addCuenta}>

                <div className="user__label--select">

                    <Multiselect
                        options={opciones} // Opciones para mostrar en el dropdown
                        selectedValues={opcionesSeleccionadas} // Valores preseleccionados
                        onSelect={onSelect} // Función que se activará al seleccionar un elemento
                        onRemove={onRemove} // Función que se activará al eliminar un elemento
                        displayValue="descrip" // Propiedad del objeto a mostrar en el dropdown
                    />

                </div>

                <div className='content__field--menu'>
                    <input type="text" name='total_general' id='total_general' className='input__form--menu input__control' placeholder=' ' onChange={e => setTotal( e.target.value)} required />
                    <label htmlFor="total_general" className='input__label'>Total</label>
                </div>

                <div className='content__field--menu'>
                    <input type="text" name='total_us' id='total_us' className='input__form--menu input__control' placeholder=' ' onChange={e => setTotalMoney( e.target.value)}  />
                    <label htmlFor="total_us" className='input__label'>Divisas</label>
                </div>

                <div className='content__field--menu'>
                    <input type="text" name='total_bs' id='total_bs' className='input__form--menu input__control' placeholder=' ' onChange={e => setTotalLocal( e.target.value)} />
                    <label htmlFor="total_bs" className='input__label'>Bs.</label>
                </div>

                <div className='content__field--menu'>
                    <textarea type="text" name='observation' id='observation' className='input__form--menu input__control' placeholder=' ' onChange={e => setObservation( e.target.value)} />
                    <label htmlFor="observation" className='input__label'>Observacion</label>
                </div>
                
                <input type="submit" className="user__button" value="Pagar" />
            </form>
        </div>
    )
}

export default OtrosPagos