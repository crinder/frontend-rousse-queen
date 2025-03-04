import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Hamburguesas = () => {

    const [hamburguesas, setHamburguesas] = useState([]);
    const token = localStorage.getItem("token");
    const { form, changed } = useForm({});
    const navigate = useNavigate();

    useEffect(() => {
        devuelveHamburguesas();
    }, []);

    const devuelveHamburguesas = async () => {


        let sucursal = 1;

        const request = await fetch(Global.url + 'menu/list/' + sucursal + '/S', {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }

        });

        const data = await request.json();

        if (data.status == "success") {
            setHamburguesas(data.menu);
        } else {
            console.log('error');
        }

    }

    const det_menu = (idmenu, nombre) => {
        navigate('/rousse/detalle-hamburguesa', { state: { idmenu, nombre } });
    }

    const eliminar = async (idmenu) => {
        const requestEliminar = await fetch(Global.url + 'menu/delete/' + idmenu, {
            method: "DELETE",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataElimnar = await requestEliminar.json();

        if (dataElimnar.status == 'success') {
            devuelveHamburguesas();
        } else {
            console.log('error');
        }
    }

    const CrearMenu = async (e) => {
        e.preventDefault();
    
        let body = form;
    
        body.hamburguesa = 'S';
    
        if (body.description.length == 0) {
          console.log('debe ingresar un nombre');
          return
        }
    
        const requestMenu = await fetch(Global.url + 'menu/register/', {
    
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "authorization": token,
            "Content-Type": "application/json"
          }
    
        });
    
        const dataMenu = await requestMenu.json();
    
        if (dataMenu.status == 'success') {
          devuelveHamburguesas();
        }
    
    
      }



    return (
        <div className='articulos__articulos'>

            <section className='articulos__container'>

                <header className='articulo_headers'>
                    <span className='title__color--title'>Configura el menú</span>
                </header>

                {hamburguesas.map(menu => {

                    return (
                        <section className="card__menu" key={menu._id} >

                            <article className='title__menu title__menu--menu' onClick={() => det_menu(menu._id, menu.description)}>
                                <span className='title__color title__color--subtitle'>{menu.description}</span>

                            </article>

                            <article className='title__menu'>
                                <span className='icon__menu' onClick={() => eliminar(menu._id)}><FontAwesomeIcon icon={faTrash} className='menu__icon--select list__icon' /></span>
                            </article>

                        </section>

                    )
                })

                }
            </section>

            <div className='articulos__articulos'>

                <section className='articulos__container'>

                    <header className='articulo_headers'>
                        <span className='title__color--title'>Agrega productos al menu</span>
                    </header>
                    <section className="card__crear">

                        <form className='aside__login aside__crear' onSubmit={CrearMenu}>

                            <div className='content__field--menu'>
                                <input type="text" name='description' id='description' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                                <label htmlFor="description" className='input__label'>Nombre</label>
                            </div>

                            <input type="submit" className='user__button' value="Crear hamburguesa" />

                        </form>

                    </section>

                </section>
            </div>
        </div>
    )
}

export default Hamburguesas