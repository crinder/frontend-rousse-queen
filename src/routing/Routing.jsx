import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link, Outlet } from 'react-router-dom';
import AuthProvider from '../components/context/AuthProvider';
import Layout from '../components/general/Layout';
import Login from '../components/public/Login';
import Home from '../components/private/Home';
import Menu from '../components/menu/Menu';
import Det_menu from '../components/menu/Det_menu';
import CrearOrden from '../components/ordenes/CrearOrden';
import PrivateLayout from '../components/private/PrivateLayout';
import Pagar from '../components/pago/Pagar';
import Success from '../components/private/Success';
import List_ordenes from '../components/ordenes/List_ordenes';
import Config from '../components/config/Config';
import Caja from '../components/config/Caja';
import Crear_menu from '../components/menu/Crear_menu';
import Articulos from '../components/articulos/Articulos';
import Movimientos from '../components/movimientos/Movimientos';
import OtrosPagos from '../components/movimientos/OtrosPagos';
import Historico from '../components/movimientos/Historico';


const Routing = () => {
    return (
        <div>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>

                        <Route path='/' element={<Layout />}>
                            <Route path='login' element={<Login />}></Route>
                        </Route>

                        <Route path='/rousse/*' element={<PrivateLayout />}>
                            <Route path='home' element={<Home />}></Route>
                            <Route path='articulos' element={<Articulos />}></Route>
                            <Route path='menu' element={<Menu />}></Route>
                            <Route path='crear-menu' element={<Crear_menu/>}></Route>
                            <Route path='detalle-menu' element={<Det_menu />}></Route>
                            <Route path='crear-orden' element={<CrearOrden />}></Route>
                            <Route path='pagar' element={<Pagar />}></Route>
                            <Route path='success' element={<Success />}></Route>
                            <Route path='list-ordenes' element={<List_ordenes/>}></Route>
                            <Route path='configuracion' element={<Config/>}></Route>
                            <Route path='caja' element={<Caja/>}></Route>
                            <Route path='movimientos' element={<Movimientos/>}></Route>
                            <Route path='pago-tercero' element={<OtrosPagos/>}></Route>
                            <Route path='historico-ordenes' element={<Historico/>}></Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>

        </div>
    )
}

export default Routing