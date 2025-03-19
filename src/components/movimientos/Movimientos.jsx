import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';

const Movimientos = () => {

    const token = localStorage.getItem('token');
    const idcaja = localStorage.getItem('idcaja');
    const tasa = localStorage.getItem('rate');
    const [noPagada, setNoPagada] = useState(0);
    const [otrosPagosBS, setOtrosPagosBS] = useState(0);
    const [otrosPagosUS, setOtrosPagosUS] = useState(0);
    const [totalesBS, setTotalesBS] = useState(0);
    const [totalesUS, setTotalesUS] = useState(0);
    const [totalPagoMov, setTotalPagoMov] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [totalCreditoBs, setTotalCreditoBs] = useState(0);
    const [totalCredito, setTotalCredito] = useState(0);
    const [pendiente, setPendiente] = useState(0);
    const [success, setSuccess] = useState(false);
    const [bsDivisas, setBsDivisas] = useState(0);



    useEffect(() => {
        Ordenes();
    }, []);




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

            let totalBs = Ordendata.pagadoBs.reduce((acc, pago) => acc + pago.received_local, 0);
            let totalUS = Ordendata.pagadoUS.reduce((acc, pago) => acc + pago.received_money, 0);
            let totalPagoMov = Ordendata.pagoMovil.reduce((acc, pago) => acc + pago.received_local, 0);
            let totalDelivery = Ordendata.delivery.reduce((acc, pago) => acc + parseFloat(pago.cost_delivery), 0);
            let total_pagos = Ordendata.otrosPagos.reduce((acc, pago) => acc + pago.total, 0);
            let ordenPendiente = Ordendata.pediente.reduce((acc, pago) => acc + pago.total, 0);
            let total_bs = parseFloat(totalBs) + parseFloat(totalPagoMov);
            let total_divisas = parseFloat(totalUS) + parseFloat(ordenPendiente);
            let total_bs_divisas = total_bs / tasa;

            setOtrosPagosUS(total_pagos);
            setTotalPagoMov(totalPagoMov);
            setDelivery(totalDelivery);
            setTotalesBS(totalBs);
            setTotalesUS(totalUS);
            setPendiente(ordenPendiente);
            setTotalCreditoBs(total_bs);
            setTotalCredito(total_divisas);
            setBsDivisas(total_bs_divisas);
            setSuccess(true);
            
        }
    }


    return (
        <div className='orden__crear'>

            {success &&

                <div className='div__movimientos'>
                    <table className='table__movimientos'>
                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>Forma de pago</th>
                                <th className='movimientos__th'>Bolivares</th>
                                <th className='movimientos__th'>Divisas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Pendientes: </td>
                                <td>-</td>
                                <td>{pendiente}</td>
                            </tr>

                            <tr>
                                <td>Divisas</td>
                                <td>-</td>
                                <td>{totalesUS}</td>
                            </tr>

                            <tr>
                                <td>Pago movil: </td>
                                <td>{totalPagoMov}</td>
                                <td>-</td>
                            </tr>

                            <tr>
                                <td>bs efectivo: </td>
                                <td>{noPagada}</td>
                                <td>-</td>
                            </tr>

                        </tbody>

                        <tfoot>

                            <tr>
                                <td>subTotal :</td>
                                <td>{totalCreditoBs}</td>
                                <td>{totalCredito}</td>
                            </tr>

                            <tr>
                                <td>Bs = divisas:</td>
                                <td>{bsDivisas}</td>
                                <td>{totalCredito}</td>
                            </tr>

                            <tr>
                                <td>Total:</td>
                                <td></td>
                                <td>{totalCredito + bsDivisas}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <table className='table__movimientos'>
                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>Concepto</th>
                                <th className='movimientos__th'>Bolivares</th>
                                <th className='movimientos__th'>Divisas</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>Otros pagos</td>
                                <td>{otrosPagosBS}</td>
                                <td>{otrosPagosUS}</td>
                            </tr>

                            <tr>
                                <td>Delivery</td>
                                <td>0</td>
                                <td>{delivery}</td>
                            </tr>

                        </tbody>
                    </table>

                    <table className='table__movimientos'>
                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>Balance</th>
                                <th className='movimientos__th'>Ingreso</th>
                                <th className='movimientos__th'>Egreso</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>Total ingreso</td>
                                <td>{totalCredito + bsDivisas}</td>
                                <td>-</td>
                            </tr>

                            <tr>
                                <td>Total egreso</td>
                                <td>-</td>
                                <td>{otrosPagosUS}</td>
                            </tr>

                            <tr>
                                <td>Total delivery</td>
                                <td>-</td>
                                <td>{delivery}</td>
                            </tr>

                            <tr>
                                <td>Total general</td>
                                <td>{(totalCredito + bsDivisas) - otrosPagosUS - delivery}</td>
                            </tr>

                        </tbody>
                    </table>

                </div>


            }

        </div>
    )
}

export default Movimientos