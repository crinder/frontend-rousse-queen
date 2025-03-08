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
import Articulos from '../components/articulos/Articulos';
import Movimientos from '../components/movimientos/Movimientos';
import OtrosPagos from '../components/movimientos/OtrosPagos';
import Historico from '../components/movimientos/Historico';
import DetalleOrden from '../components/ordenes/DetalleOrden';
import Listado from '../components/articulos/Listado';
import Ordenes from '../components/ordenes/Ordenes';
import Delivery from '../components/config/Delivery';
import ListDelivery from '../components/config/ListDelivery';
import Hamburguesas from '../components/menu/Hamburguesas';
import Det_hamburguesa from '../components/menu/Det_hamburguesa';
import DetailOrden from '../components/ordenes/DetailOrden';


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
                            <Route path='detalle-orden' element={<DetalleOrden/>}></Route>
                            <Route path='listado-articulos' element={<Listado/>}></Route>
                            <Route path='crear-ordenes' element={<Ordenes/>}></Route>
                            <Route path='deliveries' element={<Delivery/>}></Route>
                            <Route path='list-deliveries' element={<ListDelivery/>}></Route>
                            <Route path='crear-hamburguesa' element={<Hamburguesas/>}></Route>
                            <Route path='detalle-hamburguesa' element={<Det_hamburguesa/>}></Route>
                            <Route path='detalles-ordenes' element={<DetailOrden/>}></Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>

        </div>
    )
}

export default Routing