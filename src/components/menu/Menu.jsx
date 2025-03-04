import React, { useEffect, useState } from 'react';
import Global from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import useForm from '../../assets/hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {

  const [lista, setLista] = useState("");
  const [menus, setMenus] = useState([]);
  const { form, changed } = useForm({});
  const [hamburguesa, setHamburguesa] = useState(false);


  let token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {

    listar();
  }, []);


  const listar = async () => {
    let sucursal = 1;
    
    const request = await fetch(Global.url + 'menu/list/' + sucursal +'/N', {
      method: "GET",
      headers: {
        "authorization": token,
        "Content-Type": "application/json"
      }

    });

    const data = await request.json();

    if (data.status == "success") {
      setLista("success");
      setMenus(data.menu);

    } else if (data.status == "error") {

      setLista("error");

    } else {
      setLista("");
    }

  }

  const det_menu = (idmenu, nombre) => {

    navigate('/rousse/detalle-menu', { state: { idmenu, nombre } });

  }

  const crearHamburguesa = (idmenu, nombre) => {

    navigate('/rousse/crear-hamburguesa');

  }

  const CrearMenu = async (e) => {
    e.preventDefault();

    let body = form;

    body.hamburguesa = 'N';

    if (body.price == 0 || isNaN(body.price)) {
      console.log('debe ingresar un numero valido');
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
      listar();
    }


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
      listar();
    }

  }

  return (
    <div className='articulos__articulos'>

      <section className='articulos__container'>

        <header className='articulo_headers'>
          <span className='title__color--title'>Configura el menú</span>
        </header>

        {menus.map(menu => {

          return (
            <section className="card__menu" key={menu._id} >

              <article className='title__menu title__menu--menu' onClick={() => det_menu(menu._id, menu.description)}>
                <span className='title__color title__color--subtitle'>{menu.description}</span>

              </article>

              <article className='title__menu'>
                <span className='title__color title__color--subtitle'>{menu.price}$</span>
                <span className='icon__menu' onClick={() => eliminar(menu._id)}><FontAwesomeIcon icon={faTrash} className='menu__icon--select list__icon' /></span>
              </article>

            </section>

          )
        })

        }

        <div className='articulos__articulos'>

          <section className='articulos__container'>

            <header className='articulo_headers'>
              <span className='title__color--title'>Crear menu</span>
            </header>
            <section className="card__crear">

              <form className='aside__login aside__crear' onSubmit={CrearMenu}>

                <div className='content__field--menu'>
                  <input type="text" name='description' id='description' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                  <label htmlFor="description" className='input__label'>Nombre</label>
                </div>

                <div className='content__field--menu'>
                  <input type="text" name='price' id='price' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                  <label htmlFor="price" className='input__label'>Precio</label>
                </div>

                <input type="submit" className='user__button' value="Crear articulo" />

              </form>

            </section>

          </section>
        </div>

        <div className='articulos__articulos'>

          <section className='articulos__container'>

            <header className='articulo_headers'>
              <span className='title__color--title' onClick={()=> crearHamburguesa()}>Agrega hamburguesa</span>
            </header>

          </section>
        </div>
      </section>
    </div>
  )
}

export default Menu