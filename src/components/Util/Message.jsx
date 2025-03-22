import React from 'react'

const Message = ({ showAlert, tipo, message }) => {

    let valor = 'progress active progress-success';

    if (tipo == 'Error') {
        valor = 'progress progress-error active ';
    } else if (tipo == 'Alerta') {
        valor = 'progress progress-danger active ';
    }

    if (tipo) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    return (
        <div className={showAlert ? "toast-toast active" : "toast-toast"}>

            <div className="toast-content">

                <div className="message">
                    <span className="text text-1">{tipo}</span>
                    {Array.isArray(message) ? message.map(mensaje => {
                        return (
                            <span className="text text-2">{mensaje}</span>
                        )
                    }) : (
                        <span className="text text-2">{message}</span>
                    )}
                </div>
            </div>
            <i className="fa-solid fa-xmark close"></i>

            <div className={showAlert ? valor : ""}></div>
        </div>
    )
}

export default Message