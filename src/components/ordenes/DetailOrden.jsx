import { React, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Global from '../../helpers/Global';

const DetailOrden = () => {

    const location = useLocation();
    const idOrden = location.state.idOrden;
    const token = localStorage.getItem("token");
    const [orden, setOrden] = useState();
    const [total, setTotal] = useState();
    const [hamburguesa, setHamburguesa] = useState();
    const [c_observacion, setObservacion] = useState();
    const [ordenMenu, setOrdenMenu] = useState();

    useEffect(() => {
        buscarOrden(idOrden);
        devuelveOrden(idOrden)
    }, []);

    const devuelveOrden = async () => {

        let body = {
            _id: idOrden
        }

        const request = await fetch(Global.url + 'orden/listOrdenes', {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "authorization": token
            }
        });

        let data = await request.json();

        if (data.status == 'success') {

            setOrdenMenu(data.ordens);

        }
    }

    const buscarOrden = async () => {
        const request = await fetch(Global.url + 'orden/listar-pedido/' + idOrden, {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {

            setOrden([...Array(data.pedido)]);
            setHamburguesa(data.c_hamburguesa);
            setObservacion(data.c_observacion);


        } else {
            console.log('error');
        }

    }

    return (
        <div>
            <span className='title__color title__pagar'>Detalle del pedido</span>

            <section className='orden__crear'>
                {ordenMenu && ordenMenu.length > 0 && ordenMenu.map((list, index) => {
                    return (
                        <section key={index} className=''>

                            <div className='detalle__pedidos'>
                                <li className='list__detalles'>
                                    <span className='title__color title__pagar'>Nombre : </span> 
                                    <span className='title__descripcion'>{list.name}</span>
                                </li>
                                
                                <li className='list__detalles'>
                                    <span className='title__color title__pagar '>Tipo : </span>  
                                    <span className='title__descripcion'>{list.orderType}</span>
                                </li>
                                
                                <li className='list__detalles'>
                                    <span className='title__color title__pagar '>Total : </span>
                                    <span className='title__descripcion'>{list.total}</span>
                                </li>
                            </div>

                            <div className='orden__pedido'>
                                {list.items && list.items.map((item, index) => {
                                    return (
                                        <div key={index} className='orden__pedidos'>

                                            <div className='item__menu--orden'>
                                                <div>
                                                    <span className='title__color title__pagar'>Menu:</span>
                                                    <span className='title__descripcion'> {item.description}</span>
                                                </div>

                                                <div>
                                                    <span className='title__color title__pagar'>Cantidad:</span>
                                                    <span className='title__descripcion'> {item.quantity}</span>
                                                </div>

                                            </div>

                                            {hamburguesa && hamburguesa.map((grupo, grupoIndex) => (
                                                <div key={`grupo-${grupoIndex}`} >
                                                    {grupo.resultados.map((resultado, resultadoIndex) => (
                                                        <div className='grupo__pedido'>
                                                            {item.id_menu == resultado.idmenu ? (
                                                                <div key={`resultado-${grupoIndex}-${resultadoIndex}`}
                                                                    className='grupo__menu extend__menu'>
                                                                    <span className='title__color title__pagar'>Menu: </span>
                                                                    <span className='title__descripcion'>{resultado.item.description}</span>
                                                                </div>
                                                            ) : null}

                                                            <div className=''>

                                                                {c_observacion && c_observacion.map((observacion) => {
                                                                    const observacionesFiltradas = observacion.resultados.filter(
                                                                        (resultadObs) =>
                                                                            resultado.idmenu == resultadObs.idmenu &&
                                                                            item.id_menu == resultadObs.idmenu &&
                                                                            resultadObs.indice == resultado.indice
                                                                    );

                                                                    // Eliminar duplicados usando Set
                                                                    const observacionesUnicas = [...new Set(observacionesFiltradas.map(JSON.stringify))].map(JSON.parse);

                                                                    return observacionesUnicas.map((resultadObs, indexObser) => (
                                                                        <div key={`resultado-<span class="math-inline">\{grupoIndex\}\-</span>{indexObser}`}
                                                                            className='grupo__observacion extend__menu'>
                                                                            <span className='title__color title__pagar'>Observacion: </span>
                                                                            <span className='title__descripcion'>{resultadObs.valor}</span>
                                                                        </div>
                                                                    ));
                                                                })}

                                                            </div>


                                                        </div>
                                                    ))}
                                                </div>
                                            ))}





                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}



            </section>

        </div>
    )
}

export default DetailOrden