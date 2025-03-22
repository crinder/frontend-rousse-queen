import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import moment from 'moment';

const Detalles = ({id_caja}) => {
    const token = localStorage.getItem('token');
    const tasa = localStorage.getItem('rate');
    const [noPagada, setNoPagada] = useState(0);
    const [otrosPagosBS, setOtrosPagosBS] = useState(0);
    const [otrosPagosUS, setOtrosPagosUS] = useState(0);
    const [pagos, setPagos] = useState([]);
    const [totalesBS, setTotalesBS] = useState(0);
    const [totalesUS, setTotalesUS] = useState(0);
    const [totalPagoMov, setTotalPagoMov] = useState(0);
    const [delivery, setDelivery] = useState(0);
    const [totalCreditoBs, setTotalCreditoBs] = useState(0);
    const [totalCredito, setTotalCredito] = useState(0);
    const [pendiente, setPendiente] = useState(0);
    const [success, setSuccess] = useState(false);
    const [bsDivisas, setBsDivisas] = useState(0);
    const [datosordenes, setDatosOrdenes] = useState([]);
    const tipo_orden = {
        1: 'En mesa',
        2: 'Fiado sin abono',
        3: 'Mas tarde',
        4: 'Delivery'
    }
    const paymement_method = {
        0: 'Pendiente',
        1: 'Pago movil',
        2: 'Efectivo divisas',
        3: 'Pago movil y divisas',
        4: 'BS y divisas',
        5: 'Abono',
        6: 'Abono divisas'
    }
    const c_status = {
        1: 'Pendiente',
        2: 'Procesada',
        3: 'Pago',
        4: 'Cancelado'
    }


    useEffect(() => {
        Ordenes();
    }, []);

    const Ordenes = async () => {

        let body = {
            id_caja: id_caja,
            ind: 'S'
        }

        const requestOrden = await fetch(Global.url + 'orden/listAll', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
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
            setDatosOrdenes(Ordendata.data);
            setPagos(Ordendata.otrosPagos);
            setSuccess(true);

        }
    }


    return (
        <div className='orden__crear detalle__caja'>

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

            {datosordenes && datosordenes.length > 0 &&

                <div>
                    <span>Listado de pedidos</span>

                    <table className='table__movimientos'>

                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>#</th>
                                <th className='movimientos__th'>Forma de pago</th>
                                <th className='movimientos__th'>Nombre</th>
                                <th className='movimientos__th'>Orden</th>
                                <th className='movimientos__th'>Pedido</th>
                                <th className='movimientos__th'>Estado</th>
                                <th className='movimientos__th'>Fecha</th>
                                <th className='movimientos__th'>Delivery</th>
                                <th className='movimientos__th'>Total</th>
                            </tr>
                        </thead>
                        <tbody>


                            {datosordenes && datosordenes.length > 0 && datosordenes.map(orden => {
                                return (
                                    <tr>
                                        <td>{orden.num_orden}</td>
                                        <td>{paymement_method[orden.paymement_method]}</td>
                                        <td>{orden.name}</td>
                                        <td>{tipo_orden[orden.orderType]}</td>
                                        <td>{orden.items && orden.items.length > 0 && orden.items.map(item => item.description).join(', ')}</td>
                                        <td>{c_status[orden.status]}</td>
                                        <td>{moment(orden.create_at).format('DD-MM-YYYY HH:mm:ss')}</td>
                                        <td>{orden.domicilio && orden.domicilio.length > 0 ? orden.domicilio.map(item => item.zona + ' ' + item.cost_delivery + '$').join(', ') : '-'}</td>
                                        <td>{orden.total}</td>
                                    </tr>

                                )

                            }

                            )
                            }
                        </tbody>
                    </table>
                </div>
            }
            {pagos && pagos.length > 0 &&

                <div>
                    <span>Listado de pagos</span>

                    <table className='table__movimientos'>

                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>Pago</th>
                                <th className='movimientos__th'>Total</th>
                                <th className='movimientos__th'>Total $</th>
                                <th className='movimientos__th'>total BS</th>
                                <th className='movimientos__th'>observacion</th>
                            </tr>
                        </thead>
                        <tbody>


                            {pagos && pagos.length > 0 && pagos.map(pag => {
                                return (
                                    <tr>
                                        <td>{pag.pago.descrip}</td>
                                        <td>{pag.total}</td>
                                        <td>{pag.total_money}</td>
                                        <td>{pag.total_local}</td>
                                        <td>{pag.observacion}</td>
                                    </tr>

                                )

                            }

                            )
                            }
                        </tbody>
                    </table>
                </div>
            }

        </div >
    )
}

export default Detalles