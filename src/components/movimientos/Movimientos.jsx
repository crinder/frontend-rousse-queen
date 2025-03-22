import React, { useEffect, useState } from 'react'
import Detalles from './Detalles';

const DetailCaja = () => {

    const id_caja = localStorage.getItem('idcaja');

    return (
        <div>
            <Detalles id_caja={id_caja}  />
        </div >
    )
}

export default DetailCaja