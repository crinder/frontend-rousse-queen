import React, { useEffect, useState } from 'react';
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import {IconDelete} from '../Util/Iconos';

const Articulos = () => {


  const [lista, setLista] = useState("");
  const [articulos, setArticulos] = useState([]);
  const token = localStorage.getItem('token');
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("");
  const [articulo, setArticulo] = useState("");
  const [isContable, setIsContable] = useState(false);
  const [extra, setExtra] = useState('N');
  const [bebida, setBebida] = useState('N');

  useEffect(() => {

    listar();
  }, []);

  const listar = async () => {
    let sucursal = 1

    const request = await fetch(Global.url + 'article/list/' + sucursal, {
      method: "GET",
      headers: {
        "authorization": token,
        "Content-Type": "application/json"
      }

    });

    const data = await request.json();

    if (data.status == "success") {
      setLista("success");
      setArticulos(data.articles);

    } else if (data.status == "error") {

      setLista("error");

    } else {
      setLista("");
    }


  }

  const crearArticulo = async (e) => {

    e.preventDefault();

    const articulos = form;

    if(extra == 'N'){
      articulos.price = 0;
    }


    articulos.contable = isContable;
    articulos.extra = extra;
    articulos.bebida = bebida;


    let token = localStorage.getItem('token');

    const request = await fetch(Global.url + 'article/register', {

      method: "POST",
      body: JSON.stringify(articulos),
      headers: {
        "authorization": token,
        "Content-Type": "application/json"
      }
    });

    const data = await request.json();


    if (data.status == "success") {
      setSaved("success");
      listar();
    } else {
      setSaved("error");
      setArticulo(data);
    }
  }

 const EliminarArticulo = async (id) => {
   
   const request = await fetch(Global.url + 'article/delete/' + id, {
     method: "GET",
     headers: {
       "authorization": token,
       "Content-Type": "application/json"
     }
   });
   
   const data = await request.json();
   
   if (data.status == "success") {
     listar();
   } else {
     console.log('error');
   }
 }


 

  return (
    <div className='articulos__articulos'>

      <section className='articulos__container'>

        <header className='articulo_headers'>
          <span className='title__color--title'>Articulos</span>
        </header>

        <section className="card__general">

          <section className='title_menu'>

            <form className='form_articulo'>

              <ul className='menu__list'>
                <li className='menu__item'>
                  <span className='item__title'>Articulos</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Articulo contable</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Ingrediente extra</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Costo extra</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Eliminar</span>
                </li>
              </ul>

              {articulos.map(articulo => {

                return (

                  <ul className='articulo__list' key={articulo._id}>
                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <p className='articulo_descrip'> {articulo.name_article}</p>
                      </div>
                    </li>

                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <p className='articulo_descrip'> {articulo.contable == 'S' ? 'Si' : 'No'}</p>
                      </div>
                    </li>

                    <li className='articulo__item'>

                      <div className='articulo__container'>
                      <p className='articulo_descrip'> {articulo.extra == 'S' ? 'Si' : 'No'}</p>
                      </div>
                    </li>

                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <p className='articulo_descrip'> {articulo.price}</p>
                      </div>

                    </li>

                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <i onClick={() => EliminarArticulo(articulo._id)} className='icono-tabler icono-tabler-trash'><IconDelete/></i>
                      </div>

                    </li>
                  </ul>

                )

              })

              }
              <div className='form__bottom'>
                <input type="submit" className='user__button' value="Actualizar inventario" />
              </div>
              
            </form>
          </section>
        </section>

        <div className='articulos__articulos'>

          <section className='articulos__container'>

            <header className='articulo_headers'>
              <span className='title__color--title'>Crear articulos</span>
            </header>
            <section className="card__crear">

              <form className='aside__login aside__crear' onSubmit={crearArticulo}>

                <div className='box__alert'>
                  {saved == 'success' ? <strong><span className='message__success'>Articulo registrado</span></strong> : ""}
                  {saved == 'error' ? <strong><span className='message__alert'>{articulos.message}</span></strong> : ""}
                </div>

                <div className='content__field--menu'>
                  <input type="text" name='name_article' id='name_article' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                  <label htmlFor="name_article" className='input__label'>Nombre</label>
                </div>

                <div className='content__field--menu'>
                  <input type="text" name='availability' id='availability' className='input__form--menu input__control' placeholder=' ' onChange={changed} required />
                  <label htmlFor="availability" className='input__label'>Disponible</label>
                </div>

                <div className='content__field--menu'>
                  <label htmlFor="contable" className='label__form'>Articulo contable?</label>
                  <input type="checkbox" name='contable' id='contable' onChange={(e) => setIsContable(e.target.checked ? 'S' : 'N')} />
                </div>

                <div className='content__field--menu'>
                  <label htmlFor="contable" className='label__form'>Ingrediente extra?</label>
                  <input type="checkbox" name='contable' id='contable' onChange={(e) => setExtra(e.target.checked ? 'S' : 'N')} />
                </div>

                <div className='content__field--menu'>
                  <label htmlFor="contable" className='label__form'>Bebida?</label>
                  <input type="checkbox" name='contable' id='contable' onChange={(e) => setBebida(e.target.checked ? 'S' : 'N')} />
                </div>

                {extra == 'S' &&
                  <div className='content__field--menu'>
                    <label htmlFor="contable" className='label__form'>Precio extra</label>
                    <input type="text" name='price' id='price' className='input__form--menu input__control' placeholder=' ' onChange={changed}  />
                  </div>
                }

                <input type="submit" className='user__button' value="Crear articulo" />

              </form>

            </section>

          </section>
        </div>

      </section>

    </div>
  )
}

export default Articulos