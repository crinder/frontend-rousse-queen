import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { useNavigate } from 'react-router-dom';

const Historico = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [ordens, setOrdens] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [pagos, setPagos] = useState([]);

    const [datosAgrupados, setDatosAgrupados] = useState({});
    const [datosPagos, setDatosPagos] = useState({});

    useEffect(() => {
        let grupos = [];
        ordens.map(ordenes => {
            ordenes.orden.map(caja => {

                {
                    caja.orden.map(item => {

                        if (!grupos[item.id_caja]) {
                            grupos[item.id_caja] = {
                                total: 0,
                                id_caja: item.id_caja,
                                delivery: 0
                            };
                        }

                        grupos[item.id_caja].total += item.total;
                        grupos[item.id_caja].delivery += parseInt(item.cost_delivery);


                    });
                }

            });

            grupos = Object.values(grupos);

            setDatosAgrupados(grupos);
        })


    }, [ordens]);

    useEffect(() => {
        let grupos = {};
        pagos.map(ordenes => {
            ordenes.pagos.map(caja => {
                {
                    caja.pagos.map(item => {
                        if (item.id_caja) {

                            if (!grupos[item.id_caja]) {
                                grupos[item.id_caja] = {
                                    total: 0,
                                    id_caja: item.id_caja
                                };
                            }
                            grupos[item.id_caja].total += item.total;
                        }

                    });
                }

            });

            grupos = Object.values(grupos);
            setDatosPagos(grupos);
        })


    }, [pagos]);

    const getData = async (e) => {

        console.log('paso por aqui');

        e.preventDefault();

        let body;

        let fecInicio = moment(startDate);
        fecInicio = fecInicio.format("DD/MM/YYYY");

        console.log(fecInicio);

        let fecFin = moment(endDate);
        fecFin = fecFin.format("DD/MM/YYYY");

        if (fecFin && fecInicio) {
            body = {
                inicio: fecInicio,
                fin: fecFin
            };

            const request = await fetch(Global.url + "orden/listar-ordenes-caja", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    authorization: token,
                },
            });

            const data = await request.json();

            const requestPagos = await fetch(Global.url + "others/list", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    authorization: token,
                },
            });

            const dataPagos = await requestPagos.json();

            if (dataPagos.status == 'success') {

                console.log(dataPagos.pagos);
                setPagos(dataPagos.pago);
            }

            if (data.status == 'success') {
                setOrdens(data.ordens);
            }


        }
    };

    const devuelveDetalle = (id) => {
        
        navigate('/rousse/detalle-caja', { state: { idCaja: id } });
    }


    return (
        <div className='orden__crear'>
            <span className='title__color title__pagar'>Historico de ordenes</span>

            <form onSubmit={getData}>

                <section className='list__ordens'>

                    <label
                        htmlFor="fecinic"
                        className="font-bold mt-3 dark:text-slate-300"
                    >
                        Fecha desde
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        //maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"

                    />

                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        //maxDate={new Date()}
                        dateFormat="dd/MM/yyyy"

                    />

                    <button type="submit" className="button mb-5">
                        Buscar
                    </button>
                </section>
            </form>

            {ordens && datosAgrupados.length > 0 && ordens.map(ordenes => {
                return (
                    <table key={ordenes._id} className='table__movimientos'>
                        <thead className='movimientos__head'>
                            <tr className='movimientos__tr'>
                                <th className='movimientos__th'>Fecha</th>
                                <th className='movimientos__th'>Subtotal</th>
                                <th className='movimientos__th'>Delivery</th>
                                <th className='movimientos__th'>Gastos</th>
                                <th className='movimientos__th'>Total</th>
                            </tr>
                        </thead>
                        {ordenes.orden.map(caja => {
                            return (
                                <tbody key={caja._id} onClick={() => devuelveDetalle(caja._id)}>
                                    <td>
                                        <span className='title__color title__pagar'>{moment(caja.created_at).format('DD-MM-YYYY')}</span>
                                    </td>

                                    {datosAgrupados.map(grupo => {
                                        if (grupo.id_caja == caja._id) {
                                            return (
                                                <td className='title__color title__pagar'>{grupo.total}</td>
                                            )
                                        }

                                    })
                                    }

                                    {datosAgrupados.map(grupo => {
                                        if (grupo.id_caja == caja._id) {
                                            return (
                                                <td className='title__color title__pagar'>{grupo.delivery}</td>
                                            )
                                        }
                                    })
                                    }

                                    {datosPagos && datosPagos.map(grupo => {
                                        if (grupo.id_caja == caja._id && datosPagos) {
                                            return (
                                                <td className='title__color title__pagar'>{grupo.total}</td>
                                            )
                                        } else {
                                            return (
                                                <td className='title__color title__pagar'>0</td>
                                            )
                                        }
                                    })

                                    }

                                    <td>
                                        {datosAgrupados.map((grupo) => {

                                            let totalGrupo = 0;
                                            let totalDelivery = 0;

                                            if (grupo.id_caja == caja._id) {
                                                totalGrupo = grupo.total;
                                                totalDelivery = grupo.delivery;
                                            }


                                            let pagoCoincidente = datosPagos.find((pago) => pago.id_caja == caja._id);
                                            let totalPago = 0;

                                            if (pagoCoincidente) {
                                                totalPago = pagoCoincidente.total;
                                            }

                                            const resultado = totalGrupo - totalPago - totalDelivery;

                                            if (grupo.id_caja == caja._id) {

                                                return (
                                                    <span key={grupo.id_caja} className="title__color title__pagar">
                                                        {resultado}
                                                    </span>
                                                );
                                            }
                                        })}
                                    </td>

                                </tbody>
                            )

                        })}
                    </table>
                )
            })

            }

        </div>
    )
}

export default Historico