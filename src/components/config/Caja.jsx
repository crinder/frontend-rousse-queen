import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';

const Caja = () => {

    const [activa, setActiva] = useState();
    const [changeCheck, setChangeCheck] = useState(false);
    const token = localStorage.getItem('token');
    const [rate, setRate] = useState(0);
    const [caja,setCaja] = useState();


    const validaCaja = async () => {

        const checkbox = await fetch(Global.url + 'operation/check-box', {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        })


        const requestBox = await checkbox.json();

        if (requestBox.status == 'success') {
            setActiva(requestBox.c_caja);

            let caja = requestBox.c_caja;

            caja.map(caj => {
                setRate(caj.rate);
                setCaja(caj._id);
            });

        } else {

        }

    }

    const manejarCambio = (evento) => {
        setChangeCheck(evento.target.checked);
    }

    const cambioTasa = (evento) => {
        let tasa = evento.target.value;
        setRate(tasa);  // Actualiza el estado con el nuevo valor
        console.log('cambio tasa...', tasa);
    }

    const actualizaTasa = async() =>{

        const idcaja = caja;
        let tasaBS = {
            rate: rate
        };

        const requestUpdate = await fetch (Global.url+'operation/update-box/'+idcaja,{
            method: 'PUT',
            body: JSON.stringify(tasaBS),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataUpdate = await requestUpdate.json();

        if(dataUpdate == 'success'){
            console.log('tasa actualizada');
        }

    }

    const cerrarCaja = async () => {

        const idcaja = caja;

        const requestClose = await fetch(Global.url+'operation/close-box/'+idcaja,{
            method: 'PUT',
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataClose = await requestClose.json();

        if(dataClose.status == "success"){
            console.log('caja cerrada');
            setActiva(false);
            localStorage.removeItem('idcaja')
        }
    }

    const abrirCaja = async () =>{

        const tasa = rate;

        if(tasa == 0 ||  isNaN(tasa)){

            alert('Error debe ingresar una tasa valida');
            setRate(0);
            return
        }

        const body = {
            rate: rate
        }

        const requestOpen = await fetch (Global.url+'operation/open-box',{
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }

        });


        const dataOpen = await requestOpen.json();

        if(dataOpen.status == 'success'){
            setActiva(false);
            console.log('guarda tasa');
            localStorage.setItem('rate',rate);
            localStorage.setItem('idcaja',dataOpen.boxSaved._id);
        }

    }

    useEffect(() => {

        validaCaja();
    }, []);

    return (
        <div className='div__caja'>

            <section className='caja__content'>

                <div className='form-check form__check--div'>
                    <label className="user__label--orden" htmlFor="rate">Tasa</label>
                    <input type="text" className="user__input--orden" name="rate" placeholder='indique una tasa' value={rate} onChange={cambioTasa} />
                </div>

                {!activa &&
                    <input type="submit" className="user__button" value="Abrir caja" onClick={() => abrirCaja()}/>
                }

                {activa &&

                    <section className='cerrar__caja'>
                        <span className='title__color '>La caja se encuentra abierta</span>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={manejarCambio} />
                        </div>

                        {!changeCheck &&

                            <section className='cerrar__caja'>
                                <input type="submit" className="user__button" value="Actualizar tasa" onClick={() => actualizaTasa()}/>
                            </section>

                        }

                        {changeCheck &&
                            <section className='cerrar__caja'>
                                <div><span className='title__color '>Recuerde antes de cerrar la caja validar todos los pagos</span></div>
                                <input type="submit" className="user__button" value="Cerrar caja" onClick={() => cerrarCaja()}/>
                            </section>
                        }
                    </section>
                }


            </section>
        </div>
    )
}

export default Caja