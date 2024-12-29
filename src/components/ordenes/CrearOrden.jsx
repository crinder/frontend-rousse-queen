import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const CrearOrden = () => {

  const [changeCheck, useChangeCheck] = useState(false);
  const [checkPago, useCheckPago] = useState(false);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
  const [opciones, setOpciones] = useState([]);
  const [cantidad, setCantidad] = useState({});
  const [pagoInmediato, setPagoInmediato] = useState(false);
  const navigate = useNavigate();
  const [tiporden, setTiporden] = useState({});
  const [ordenType, setOrdenType] = useState(1);
  const [total, setTotal] = useState(0);
  const [mdelivery, setMdelivery] = useState(0);
  const [deliv, setDeliv] = useState('');
  const [activo, setActivo] = useState(false);
  const [nombre, setNombre] = useState('En mesa');
  const [detalleMenu, setDetalleMenu] = useState([]);
  const token = localStorage.getItem("token");
  const idcaja = localStorage.getItem("idcaja");

  useEffect(() => {
    devuelveMenu();
    devuelveTipo();
  }, []);

  useEffect(() => {

    console.log(cantidad);

    let opc = opcionesSeleccionadas;
    let totalGen = 0;

    if (opc.length > 0) {

      for (let option of opc) {
        let devuelveMonto = actualizaPrecios(option._id, 'C');

        totalGen += devuelveMonto;

      }

      setDeliv(mdelivery);
      totalGen += parseInt(mdelivery);

      setTotal(totalGen);
    }


  }, [cantidad, mdelivery]);

  const devuelveTipo = async () => {

    let c_body = {
      group: "tipo_orden"
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
      setTiporden(dataPago.findStored);

    }

  }


  const onSelect = async (selectedList, selectedItem) => {

    setTotal(0);
    let totalGen = 0;

    for (let opcion of selectedList) {
      await incrementar(opcion._id, false);
      let devuelveMonto = await actualizaPrecios(opcion._id, 'I');
      totalGen += devuelveMonto;

    }

    setOpcionesSeleccionadas(selectedList);
    setTotal(totalGen);
  }

  const onRemove = (selectedList, removedItem) => {

    setTotal(0);
    let totalGen = 0;

    for (let opcion of selectedList) {
      incrementar(opcion._id, false);
      let devuelveMonto = actualizaPrecios(opcion._id, 'I');
      totalGen += devuelveMonto;
    }

    setOpcionesSeleccionadas(selectedList);
    setTotal(totalGen);

  }


  const guardarOrden = async (e) => {
    e.preventDefault();
    setActivo(true);

    let c_nombre = nombre;

    c_nombre = c_nombre.trim();

    if (c_nombre === '') {
      console.log('debe escribir un nombre');
      return
    }

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
      name: nombre,
      items: JSON.stringify(array),
      status: 1,
      orderType: ordenType,
      total: total,
      cost_delivery: mdelivery

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

      console.log(changeCheck);

      if (checkPago) {
        let idOrden = 'valor';

        navigate('/rousse/pagar', { state: { idOrden } });

      } else {
        let valor = 1;
        navigate('/rousse/success', { state: { valor } });

      }

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
          quantity: Math.max((prevState[id]?.quantity || 1) + 1, 1)
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
        quantity: Math.max((prevState[id]?.quantity || 1) - 1, 1)
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

  const tipoOrden = (event) => {

    const tipo = event.target.value;

    setOrdenType(tipo);

    if (tipo == 1) {
      setNombre('En mesa');
    } else {
      setNombre('');
    }


  }

  const manejarCambio = (evento) => {
    useChangeCheck(evento.target.checked);
  };

  const manejarCambioPago = (evento) => {
    useCheckPago(evento.target.checked);
  }

  const montoDelivery = (event) => {

    let c_delivery = event.target.value;

    c_delivery = c_delivery.replace(/[^\d]/g, '');

    setMdelivery(c_delivery);

  }

  const nombreCli = (event) => {

    let c_nombre = event.target.value;

    c_nombre = c_nombre.replace(/\d/g, '');

    setNombre(c_nombre);

  }

  const devuelveDetalleMenu = async (idmenu) => {

    const request = await fetch(Global.url + 'det-menu/list/'+idmenu, {

      method: "GET",
      headers: {
        "authorization": token,
        "Content-Type": "application/json"
      }

    });

    const data = request.JSON();

  }


  return (
    <div className='orden__crear'>

      {pagoInmediato}

      <section className='crear__content detmenu__section'>
        <form className='crear__orden' onSubmit={guardarOrden}>

          <div className="user__label--select">

            <Multiselect
              options={opciones} // Opciones para mostrar en el dropdown
              selectedValues={opcionesSeleccionadas} // Valores preseleccionados
              onSelect={onSelect} // Función que se activará al seleccionar un elemento
              onRemove={onRemove} // Función que se activará al eliminar un elemento
              displayValue="description" // Propiedad del objeto a mostrar en el dropdown
            />

          </div>

          <div>
            <label className="user__label--orden" htmlFor="user">Tipo de orden</label>
            <select name="orderType" className="user__input--orden" onChange={tipoOrden}>

              {tiporden.length > 0 && tiporden.map(orden => {
                return (
                  <option value={orden.code} key={orden.code}>{orden.descrip}</option>
                )
              })}
            </select>
          </div>

          <div>

            <label className="user__label--orden" htmlFor="user">Nombre</label>
            <input type="text" className="user__input--orden" name="name" onChange={nombreCli} required value={nombre} />


            {(ordenType != 1 && ordenType != 4) &&
              <div class="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={manejarCambio} checked={changeCheck} />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Delivery?</label>
              </div>
            }


            {(changeCheck && ordenType != 1 || ordenType == 4) &&

              <div className='form-check form__check--div'>
                <input type="text" className="user__input--orden" name="cost_delivery" onBlur={montoDelivery} placeholder='Monto delivery' required pattern="^[1-9]\d*$" title="Por favor, introduce un número mayor que 0." />
              </div>

            }

          </div>

          <div>

            <label className="user__label" htmlFor="user">Total</label>
            <input type="text" className="user__input--orden" name="total" readOnly value={total} />

          </div>


          <div className='menu__select'>

            {opcionesSeleccionadas && opcionesSeleccionadas.length > 0 && opcionesSeleccionadas.map((opcion, index) => {
              return (
                <article className='menu__article' key={index}><FontAwesomeIcon icon={faMinus} className='menu__icon--select' onClick={() => decrementar(opcion._id)} />
                  <span className='select__opcion'>{opcion.description}</span>
                  <FontAwesomeIcon icon={faPlus} className='menu__icon--select' onClick={() => incrementar(opcion._id)} />
                  <span className='select__opcion'>Cantidad: {cantidad[opcion._id]?.quantity || 1}</span>
                </article>
              )
            })}
          </div>

          <div className='menu__select'>

            <div className='menu__title'>
              <h3 className='title__menu'>Quitar de la orden</h3>
            </div>

            {opcionesSeleccionadas && opcionesSeleccionadas.length > 0 && opcionesSeleccionadas.map((opcion, index) => {

              return (
                <article>
                  <span className='select__opcion'>{opcion.description}</span>
                </article>
              )

            })

            }

          </div>

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={manejarCambioPago} checked={checkPago} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Pago inmediato?</label>
          </div>

          <input type="submit" className="user__button" value="Crear Orden" disabled={activo} />

        </form>
      </section>
    </div>
  )
}

export default CrearOrden