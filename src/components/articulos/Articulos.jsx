import React, { useEffect, useState } from 'react';
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Articulos = () => {


  /*{<li className='articulo__listar'>
       <div className="form-check form-switch">
       <input className="form-check-input" type="checkbox" role="switch" id={`flexSwitchCheckDefault${articulo._id}`} onChange={() => toggleActualizar(articulo._id)} />
       <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Actualizar?</label>
     </div>
       </li>}

       </ul>

       {idsParaActualizar.includes(articulo._id) && (
         <div>
           <div className='content__field--menu'>
             <input type="text" name='name_article' id='name_article' className='input__form--menu' placeholder=' ' required onChange={(evento) => actInve(evento, articulo._id)} />
             <label htmlFor="name_article" className='label__form--menu'>Actualizar artículo</label>
           </div>
           <FontAwesomeIcon icon={faRotateRight} className='menu__icon--select list__icon' onClick={() => ActualizarArticulo(articulo._id)} />
         </div>


       )}*/

  const [lista, setLista] = useState("");
  const [articulos, setArticulos] = useState([]);
  const token = localStorage.getItem('token');
  const [idsParaActualizar, setIdsParaActualizar] = useState([]);
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("");
  const [articulo, setArticulo] = useState("");
  const [artmanual, setArtManual] = useState([]);
  const [articuloAct, setArticuloAct] = useState({});
  const [isContable, setIsContable] = useState(false);

  useEffect(() => {

    listar();
  }, []);


  const toggleActualizar = (id,valor) => {

    setIdsParaActualizar((valores) => ({
      ...valores,
      [id]: valor
    }));

  };


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
    let contable = 'N';

    console.log(articulos);

    if(isContable){
      contable = 'S';
    }

    articulos.contable = contable;

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

  const actInve = (evento, id) => {

    setArticuloAct({
      ...articuloAct,
      [id]: evento.target.value
    })

  }

  const ActualizarManual = (evento,id) =>{


    const artExist = artmanual.some((seleted) => seleted.id == id);

    setArtManual(
      artExist
        ? artmanual.filter((selected) => selected.id !== id)
        : [...artmanual, { id: id}]
    );
   
    
  }
 
  const ActualizarArticulo = async (e) => {

    e.preventDefault();

    const articulos = form;

    console.log(idsParaActualizar);

    console.log(artmanual);


    let body = {
      articulos: idsParaActualizar,
      artmanual: artmanual
    }

    const requestUpdate = await fetch(Global.url + 'article/update-inventory', {

      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "authorization": token,
        "Content-Type": "application/json"
      }

    });

    const dataUpdate = await requestUpdate.json();

    if (dataUpdate.status == 'success') {
      listar();
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

            <form className='form_articulo' onSubmit={ActualizarArticulo}>

              <ul className='menu__list'>
                <li className='menu__item'>
                  <span className='item__title'>Artículos</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Actualizar articulo</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Disponible</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Inventario anterior</span>
                </li>
                <li className='menu__item'>
                  <span className='item__title'>Inventario manual</span>
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
                        <p className='articulo_descrip'>
                          <input className='input__form--articulo' type="text" name="art_dispo" id="art_dispo" defaultValue={0}
                            onChange={(e)=> toggleActualizar(articulo._id,e.target.value)}
                          />
                        </p>
                      </div>
                    </li>

                    <li className='articulo__item'>

                      <div className='articulo__container'>
                      <p className='articulo_descrip'> {articulo.availability}</p>
                      </div>
                    </li>

                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <p className='articulo_descrip'> {articulo.inv_before}</p>
                      </div>

                    </li>

                    <li className='articulo__item'>
                      <div className='articulo__container'>
                        <p className='articulo_descrip'>
                          <input  type="checkbox" name="art_dispo" id="art_dispo" 
                            onChange={(e)=> ActualizarManual(e.target.checked,articulo._id)}
                          />
                        </p>
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
                  <input type="checkbox" name='contable' id='contable' onChange={(e) => setIsContable(e.target.checked)} />
                </div>


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