import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTruckMoving, faClockRotateLeft, faLayerGroup, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { IconDelivery,IconLock, Iconboard, Iconbox, IconSettings, IconHistory, IconDate } from '../Util/Iconos';

const Config = () => {
  return (
    <div className='div__config'>
        <section className='config__content'>
            <ul className='config__menu'>
              <li className='config__option'><NavLink className='config__link' to="/rousse/caja" exact><IconLock className='menu__icon' style={{ color: "#e2e0e0", }} />Caja</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/menu"><Iconboard className='menu__icon' style={{ color: "#e2e0e0", }} />Menu</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/articulos"><IconSettings  className='menu__icon' style={{ color: "#e2e0e0", }} />Configurar Inventario</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/deliveries"><IconDelivery  className='menu__icon' style={{ color: "#e2e0e0", }} />Delivery</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/movimientos">< IconDate className='menu__icon' style={{ color: "#e2e0e0", }} />Movimientos del día</NavLink></li>
              <li className='config__option'><NavLink className='config__link' to="/rousse/historico-ordenes"><IconHistory  className='menu__icon' style={{ color: "#e2e0e0", }} />Historico de ordenes</NavLink></li>
            </ul>
        </section>
    </div>
  )
}

export default Config