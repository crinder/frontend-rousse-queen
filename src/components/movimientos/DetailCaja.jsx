import React, { useEffect, useState } from 'react'
import Detalles from './Detalles';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailCaja = () => {

    const location = useLocation(); 
    let id_caja = location.state.idCaja;

    const idcaja = id_caja;

    return (

        <div>
            <Detalles id_caja={idcaja}  />
        </div>
    )
}

export default DetailCaja