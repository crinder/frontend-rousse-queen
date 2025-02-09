import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Ordenes = () => {

    const [checkPago, setCheckPago] = useState(false);
    const [opciones, setOpciones] = useState([]);
    const [cantidad, setCantidad] = useState({});
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [activo, setActivo] = useState(false);
    const [detalleMenu, setDetalleMenu] = useState([]);
    const token = localStorage.getItem("token");
    const idcaja = localStorage.getItem("idcaja");
    const [ingredinetes, setIngredinetes] = useState(false);

    useEffect(() => {
        devuelveMenu();
        
    }, []);

    useEffect(() => {
        onSelect();
    }, [cantidad]);


    

    const onSelect = async () => {

        setTotal(0);
        let totalGen = 0;
    
        Object.values(cantidad).forEach(async opcion => {
            try {
                const devuelveMonto = await actualizaPrecios(opcion.id_menu, 'I');
                totalGen += devuelveMonto * opcion.quantity;
                setTotal(totalGen);
            } catch (error) {
                console.error("Error al actualizar precios:", error);
            }
        });
       
    }


    const guardarOrden = async (e) => {
        e.preventDefault();
        setActivo(true);


        const objeto = Object.values(cantidad);
        let array = [];

        objeto.map(item => {
            const obj = {
                id_menu: item.id_menu,
                quantity: item.quantity
            }

            array.push(obj);
        });


        if (array == [] || array == '') {
            console.log('debe seleccionar un menu');
            return
        }

        if (total <= 0) {
            console.log('El total no debe ser 0');
            return
        }

        const c_body = {
            items: JSON.stringify(array),
            status: 1,
            total: total,
            orderType: 1
        }

        const requestRegist = await fetch(Global.url + 'orden/add', {
            method: "POST",
            body: JSON.stringify(c_body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json",
                "box": idcaja
            }
        });

        const dataRegis = await requestRegist.json();

        if (dataRegis.status == 'success') {


            navigate('/rousse/detalle-orden', { state: { idOrden: dataRegis.ordenSave } });

        } else {
            console.log('Error guardando orden');
        }


    }

    const devuelveMenu = async () => {

        const requestMenu = await fetch(Global.url + 'menu/list/' + 1, {

            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await requestMenu.json();

        if (data.status == "success") {

            setOpciones(data.menu);

        }

    }

    const incrementar = (id, valor = true) => {

        if (valor) {

            setCantidad(prevState => ({
                ...prevState,
                [id]: {
                    id_menu: id,
                    quantity: Math.max((prevState[id]?.quantity || 0) + 1, 0)
                }
            }));

        } else {
            setCantidad(prevState => ({
                ...prevState,
                [id]: {
                    id_menu: id,
                    quantity: 1
                }
            }));
        }
    }

    const decrementar = (id) => {

        setCantidad(prevState => ({
            ...prevState,
            [id]: {
                id_menu: id,
                quantity: Math.max((prevState[id]?.quantity || 0) - 1, 0)
            }
        }))

    }

    const actualizaPrecios = (idMenu, ind) => {

        let precioTotal = 0;
        let datos = opciones;

        let objetoBuscado = datos.find(objeto => objeto._id == idMenu);

        let precio = objetoBuscado.price;

        if (ind == 'I') {

            let totalGeneral = parseInt(precio);
            return totalGeneral;

        } else if (ind == 'D') {
            precioTotal = parseInt(sumaTotal) - parseInt(precio);
        } else {

            let cant = cantidad[idMenu]?.quantity;

            let totalGeneral = precio * cant
            return totalGeneral;

        }


        setTotal(precioTotal);

    }

    return (
        <div className='orden__crear'>
            <section className='crear__content detmenu__section'>
                <form className='crear__orden' onSubmit={guardarOrden}>

                    <div className='option__menu'>


                        {opciones.length > 0 && opciones.map(opcion => {
                            return (
                                <div className='menu__option'>
                                    <span className='menu__description'>{opcion.description}</span>
                                    <span className='menu__precio'>Precio: {opcion.price}</span>
                                    <div className='select__select'>
                                        <FontAwesomeIcon icon={faMinus} className='menu__icon--select' onClick={() => decrementar(opcion._id)} />
                                        <span className='select__opcion'>{cantidad[opcion._id]?.quantity || 0}</span>
                                        <FontAwesomeIcon icon={faPlus} className='menu__icon--select' onClick={() => incrementar(opcion._id)} />
                                    </div>

                                </div>
                            )
                        })
                        }

                    </div>

                    

                    <input type="submit" className="user__button" value="Crear Orden" disabled={activo} />

                </form>
            </section>
        </div>
    )
}
export default Ordenes