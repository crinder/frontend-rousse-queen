import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock,faBars, faTruckMoving, faClockRotateLeft, faLayerGroup, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

const Config = () => {
  return (
    <div className='div__config'>
        <section className='config__content'>
            <ul className='config__menu'>
              <li className='config__option'><NavLink className='config__link' to="/rousse/caja" exact><FontAwesomeIcon icon={faUnlock} className='menu__icon' style={{ color: "#e2e0e0", }} />Caja</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/menu"><FontAwesomeIcon icon={faBars} className='menu__icon' style={{ color: "#e2e0e0", }} />Menu</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/articulos"><FontAwesomeIcon icon={faTruckMoving} className='menu__icon' style={{ color: "#e2e0e0", }} />Inventario</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/pago-tercero"><FontAwesomeIcon icon={faHandHoldingDollar} className='menu__icon' style={{ color: "#e2e0e0", }} />Otros pagos</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/movimientos"><FontAwesomeIcon icon={faLayerGroup} className='menu__icon' style={{ color: "#e2e0e0", }} />Movimientos del día</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/historico-ordenes"><FontAwesomeIcon icon={faClockRotateLeft} className='menu__icon' style={{ color: "#e2e0e0", }} />Historico de ordenes</NavLink></li>
            </ul>
        </section>
    </div>
  )
}

export default Config