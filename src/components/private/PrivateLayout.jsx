import React from 'react'
import Nav from './Nav'
import Header from './Header'
import Resumen from './Resumen'
import {Outlet} from 'react-router-dom';
 

const PrivateLayout = () => {
  return (
    <>
      <Header />
      <div className='home__home'>
        <div className='home__container'>

        </div>

          <Outlet/>


        <Nav />

      </div>

    </>
  )
}

export default PrivateLayout