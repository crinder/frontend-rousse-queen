import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import Multiselect from 'multiselect-react-dropdown';

const OtrosPagos = () => {

    const token = localStorage.getItem('token');
    const idcaja = localStorage.getItem('token');
    const [opciones, setOpciones] = useState([]);
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [total, setTotal] = useState();
    const [totalMoney, setTotalMoney] = useState(total);
    const [totalLocal, setTotalLocal] = useState(0);

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

        if(isNaN(totalBS)){
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
            total_money: totalMoney
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

                <div className='content__field--menu pago__tercero--div' >
                    <input type="text" name='total' pattern="[0-9]*" id='total' className='input__form--menu input__detmenu pago_tercero--input' placeholder=' ' required onChange={totalPagar} />
                    <label htmlFor="total" className='label__form--detmenu'>Total</label>
                </div>

                <div className='content__field--menu pago__tercero--div'>

                    <input type="text" name='total_money' pattern="[0-9]*" id='total_money' className='input__form--menu input__detmenu pago_tercero--input' placeholder=' ' required value={totalMoney} onChange={e => setTotalMoney(e.target.value)} />
                    <label htmlFor="total_local" className='label__form--detmenu'>Total US</label>
                </div>
                <div className='content__field--menu pago__tercero--div'>
                    <input type="text" name='total_local' pattern="[0-9]*" id='total_local' className='input__form--menu input__detmenu pago_tercero--input' placeholder=' ' readOnly value={totalLocal} />
                    <label htmlFor="total_local" className='label__form--detmenu'>Total BS</label>
                </div>
                <input type="submit" className="user__button" value="Pagar" />
            </form>
        </div>
    )
}

export default OtrosPagos