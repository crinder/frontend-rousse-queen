import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faListCheck, faCartShopping, faRectangleList, faGears,faHome } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <div className='nav__nav'>
      <nav className='nav__container'>
        <ul className='container__option'>
          <li className='option__list'><NavLink className='list__link' to="/rousse/home" exact activeClassName="active"><FontAwesomeIcon className='menu__icon' icon={faHome} style={{ color: "#bfb95f", }} /><span className='menu__link'>Home</span> </NavLink></li>
          <li className='option__list'><NavLink className='list__link' to="/rousse/articulos"><FontAwesomeIcon icon={faRectangleList} className='menu__icon' style={{ color: "#bfb95f", }} /><span className='menu__link'>Articulos</span></NavLink></li>
          <li className='option__list'><NavLink className='list__link' to="/rousse/crear-orden"><FontAwesomeIcon icon={faStore} className='menu__icon' style={{ color: "#bfb95f", }} /> <span className='menu__link'>Crear Ordenes</span> </NavLink></li>
          <li className='option__list'><NavLink className='list__link' to="/rousse/list-ordenes"><FontAwesomeIcon icon={faCartShopping} className='menu__icon' style={{ color: "#bfb95f", }} /><span className='menu__link'>Ordenes</span></NavLink></li>
          <li className='option__list'><NavLink className='list__link' to="/rousse/detalle-menu"><FontAwesomeIcon icon={faListCheck} className='menu__icon' style={{ color: "#bfb95f", }} /> <span className='menu__link'>Resumen</span></NavLink></li>
          <li className='option__list'><NavLink className='list__link' to="/rousse/configuracion"><FontAwesomeIcon icon={faGears} className='menu__icon' style={{ color: "#bfb95f", }} /> <span className='menu__link'>Mas</span></NavLink></li>
        </ul>
      </nav>
    </div>
  )
}

export default Nav
