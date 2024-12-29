import { React, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,useLocation } from 'react-router-dom';

const Success = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [descrip,setDescrip] = useState();
  const [icono,setIcono] = useState();

  let valor = location.state.valor;

  useEffect(() => {

    setTimeout(() => {
      navigate('/rousse/crear-orden');
    }, 3000);

    if(valor == 2){
      setDescrip('Orden pagada correctamente');
      setIcono(faCircleCheck);
    }else if(valor == 1){
      setDescrip('Orden creada correctamente');
      setIcono(faCircleCheck);
    }else if(valor == 3){
      setDescrip('Error pagando orden');
      setIcono(faCircleXmark);
    }

  }, []);

  

  return (
    <div className='orden__success'>

        <section className='success__content'>

          <span className='title__color title__pagar size__font'>{descrip}</span>
          <FontAwesomeIcon className='icon__icon--success' icon={icono} style={{ color: "#FFD43B", }} />

        </section>

    </div>
  )
}

export default Success