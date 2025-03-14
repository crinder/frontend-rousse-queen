import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';

const Movimientos = () => {

    const token = localStorage.getItem('token');
    const idcaja = localStorage.getItem('idcaja');
    const [ordenesF, setOrdenesF] = useState({});
    const [credit, setCredit] = useState(0);
    const [others, setOthers] = useState({});
    const [debit, setDebit] = useState(0);
    const [capital, setCapital] = useState(0);
    const [forma, setForma] = useState({});
    const [noPagada, setNoPagada] = useState(0);
    const [cuenta, setCuenta] = useState({});
    const [otrosPagosBS, setOtrosPagosBS] = useState(0);
    const [otrosPagosUS, setOtrosPagosUS] = useState(0);
    const [totalesBS, setTotalesBS] = useState(0);
    const [totalesUS, setTotalesUS] = useState(0);


    useEffect(() => {
        Ordenes();
    }, [])


    const Ordenes = async () => {

        const requestOrden = await fetch(Global.url + 'orden/listAll', {
            method: 'GET',
            headers: {
                "authorization": token,
                "Content-Type": "application/json",
                "box": idcaja
            }
        });

        const Ordendata = await requestOrden.json();

        if (Ordendata.status == 'success') {
            setOrdenesF(Ordendata.ordens);

            let credito = 0;
            let dif = 0;

            Ordendata.ordens.forEach(ordenes => {

                let idOrden = ordenes.id_orden;

                console.log('paso 1...', idOrden);



                ordenes.orden.forEach(orden => {
                    credito += orden.total;
                    console.log('paso 2 credito...', credito);
                    
                    dif += orden.total;

                });
            });

            console.log('paso 3 credito...', dif);

            setNoPagada(dif);

            let pagos = {};
            let totalBS = 0;
            let totalUS = 0;

            Ordendata.ordens.map(ordenes => {

                let idOrden = ordenes.id_orden;

                if (idOrden) {
                    let pago = idOrden.paymement_method;
                    let total = idOrden.total;


                    if (!pagos[pago]) {
                        pagos[pago] = {
                            total: 0,
                            bolivares: 0,
                            divisas: 0,
                            code: pago
                        };
                    }

                    pagos[pago].total += total;
                    pagos[pago].bolivares += idOrden.received_local;
                    pagos[pago].divisas += idOrden.received_money;
                    totalBS += idOrden.received_local;
                    totalUS += idOrden.received_money;

                }
            });

            setCuenta(pagos);

            const requestOthers = await fetch(Global.url + 'others/find_payment', {
                method: 'GET',
                headers: {
                    "authorization": token,
                    "box": idcaja,
                    "Content-Type": "application/json"
                }
            });

            const dataOthers = await requestOthers.json();

            if (dataOthers.status == 'success') {
                setOthers(dataOthers.findStore);

            };

            let debito = 0;
            let capital = 0;
            let PagosBS = 0;
            let PagosUS = 0;

            dataOthers.findStore.map(cred => {

                if (cred.pago.code != 5) {
                    debito += cred.total;
                    PagosBS += cred.total_local;
                    PagosUS += cred.total_money;
                } else {
                    capital += cred.total;
                }


            });

            credito += capital;

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

            if (dataPago.status == 'success') {
                setForma(dataPago.findStored);
                console.log(dataPago.findStored);
            }

            totalBS += PagosBS;
            totalUS += PagosUS;

            setTotalesBS(totalBS);
            setTotalesUS(totalUS);
            setOtrosPagosBS(PagosBS);
            setOtrosPagosUS(PagosUS);
            setDebit(debito);
            setCapital(capital)
            setCredit(credito);
        }
    }


    return (
        <div className='orden__crear'>
            <table className='table__movimientos'>
                <thead className='movimientos__head'>
                    <tr className='movimientos__tr'>
                        <th className='movimientos__th'>Concepto</th>
                        <th className='movimientos__th'>Crédito</th>
                        <th className='movimientos__th'>Débito</th>
                    </tr>
                </thead>
                <tbody>

                    {ordenesF && Array.isArray(ordenesF) && ordenesF.map(ordenes => {
                        return (
                            ordenes.orden && Array.isArray(ordenes.orden) && ordenes.orden.map((orden, index) => {
                                return (
                                    <tr key={index}>
                                        <td>Orden: {orden.name}</td>
                                        <td>{orden.total}</td>
                                        <td>0</td>
                                    </tr>
                                )
                            })
                        )
                    })}

                    {others.length > 0 && others.map(other => {

                        return (
                            <tr key={other._id}>
                                <td>Otros pago: {other.pago.descrip}</td>
                                <td>{other.pago.code == 5 ? other.total : 0}</td>
                                <td>{other.pago.code != 5 ? other.total : 0}</td>
                            </tr>
                        )
                    })

                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td>Totales:</td>
                        <td>{credit}</td>
                        <td>{debit}</td>
                    </tr>
                </tfoot>
            </table>

            <table className='table__movimientos'>
                <thead className='movimientos__head'>
                    <tr className='movimientos__tr'>
                        <th className='movimientos__th'>Forma de pago</th>
                        <th className='movimientos__th'>Bolivares</th>
                        <th className='movimientos__th'>Divisas</th>
                    </tr>
                </thead>
                <tbody>

                    {forma.length > 0 && forma.map(pago => {
                        let pagoObj = cuenta[pago.code];
                        if (pagoObj) {
                            return (
                                <tr key={pago._id}>
                                    <td>{pago.descrip}</td>
                                    <td>{pagoObj.bolivares}</td>
                                    <td>{pagoObj.divisas}</td>
                                </tr>
                            )
                        }
                    })}

                    <tr>
                        <td>Ordenes no pagadas: </td>
                        <td>0</td>
                        <td>{noPagada}</td>
                    </tr>

                    <tr>
                        <td>Otros pagos</td>
                        <td>{otrosPagosBS}</td>
                        <td>{otrosPagosUS}</td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <td>Totales:</td>
                        <td>{totalesBS}</td>
                        <td>{totalesUS}</td>
                    </tr>
                </tfoot>
            </table>

        </div>
    )
}

export default Movimientos