import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import Message from '../Util/Message';


const Det_hamburguesa = () => {

    let token = localStorage.getItem('token');
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [opciones, setOpciones] = useState([]);
    const location = useLocation();
    const [NombreMenu, setNombreMenu] = useState('');
    const [resta, setResta] = useState('');
    const [opcional, setOpcional] = useState('');
    const [hamburguesa, setHamburguesa] = useState(false);
    const [elegir, setElegir] = useState(false);
    const [message, setMessage] = useState();
    const [variant, setVariant] = useState();
    const [showAlert, setShowAlert] = useState(false);

    let id_menu = location.state.idmenu;
    let nombre = 0;

    const handleAlert = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
            setMessage('');
            setVariant('');
        }, 5000);
    }

    useEffect(() => {

        nombre = location.state.nombre;

        setNombreMenu(nombre);
    }, []);

    const changeResta = (evento, id) => {
        console.log(evento.target.value);
        setResta({
            ...resta,
            [id]: evento.target.value
        });

    }


    const onSelect = (selectedList, selectedItem) => {

        for (let opcion of selectedList) {
            const obj = {
                id_article: opcion.id
            }

            insertMenu(obj);
        }

        setOpcionesSeleccionadas(selectedList);
    }

    const onRemove = (selectedList, removedItem) => {

        for (let opcion of selectedList) {
            const obj = {
                id_article: opcion.id
            }
        }

        setOpcionesSeleccionadas(selectedList);
    }

    const [detmenus, setDetmenus] = useState("");
    const [articles, setArticles] = useState("");
    const [guardado, setGuardado] = useState("");

   

    useEffect(() => {
        devuelveDetalle();
        articulosActualizado();
    }, [guardado]);

    const deleteArt = async (id_article) => {

        let obj = {
            id_article: id_article
        }

        const requestDel = await fetch(Global.url + 'det-menu/delete-det/' + id_menu, {
            method: "DELETE",
            body: JSON.stringify(obj),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataDel = await requestDel.json();

        if (dataDel.status == "success") {
            setMessage('producto eliminado');
            setVariant('Correcto');
            devuelveDetalle();
            articulosActualizado();
        } else {
            setMessage('Error al eliminar el producto');
            setVariant('errror');
        }

        handleAlert();

    }

    const insertMenu = async (obj) => {

        const request = await fetch(Global.url + 'det-menu/register/' + id_menu, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();

        if (data.status == "success") {
            devuelveDetalle();
            articulosActualizado();
            setMessage('producto actualizado');
            setVariant('Correcto');
        } else {
            setMessage('Error al actualizar el producto');
            setVariant('errror');
        }

        handleAlert();
    }


    const articulosActualizado = async () => {

        const requestArt = await fetch(Global.url + 'det-menu/listArticle/' + id_menu, {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataArt = await requestArt.json();


        if (dataArt.status == "success") {

            const opcionesMap = dataArt.listArticle.map(article => ({

                name: article.name_article,
                id: article._id
            }));

            setOpciones(opcionesMap);

        } else {
            setArticles("");
        }

    }

    const ActualizarArticulo = async (id, iddetmenu) => {
        const act = resta[id];
        const opc = opcional[id];
        const ele = elegir[id];

        let body = {
            id_menu: id_menu
        };

        if (act) {
            body.subtract = act;
        }

        if (opc) {
            body.opcional = opc;
        }

        if (ele) {
            body.elegir = ele;
        }

        const requestUpdate = await fetch(Global.url + 'det-menu/update/' + iddetmenu, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const dataUpdate = await requestUpdate.json();


    }

    const devuelveDetalle = async (e) => {

        const request = await fetch(Global.url + 'det-menu/list/' + id_menu, {

            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }
        });

        const data = await request.json();


        if (data.status == "success") {
            setDetmenus(data.det_menu);
        } else {
            setDetmenus(data);
        }
    }


    const articulOpcional = (evento, id) => {

        console.log(resta);
        let opc = evento.target.checked ? 'S' : 'N';

        setOpcional({
            ...resta,
            [id]: opc
        });

    }

    return (
        <div className='articulos__articulos'>
            
            <Message showAlert={showAlert} tipo={variant} message={message} />

            <section className='articulos__container container__det_menu'>
                <header className='articulo_headers'>
                    <span className='title__color--title'>Asociar productos a hamburguesa</span>
                </header>

                <section className="card__general">
                    <div className='title_menu'>
                        {detmenus.length > 0 &&

                            detmenus.map((detmenu, index) => (
                                <section className='section__detmenu' key={index}>
                                    <p className='detmenu__p'><span className='title__detmenu'>{NombreMenu}</span></p>

                                    <ul className='menu__list'>
                                        <li className='menu__item'>
                                            <span className='item__title'>Producto</span>
                                        </li>
                                        <li className='menu__item'>
                                            <span className='item__title'>Resta del inventario</span>
                                        </li>
                                        <li className='menu__item'>
                                            <span className='item__title'>Eliminar</span>
                                        </li>
                                        <li className='menu__item'>
                                            <span className='item__title'>Actualizar</span>
                                        </li>
                                        <li className='menu__item'>
                                            <span className='item__title'>Opcional?</span>
                                        </li>
                                    </ul>

                                    <div className='detmenu__list'>
                                        {Array.isArray(detmenu.det_menu) && detmenu.det_menu.map((subMenu, subMenuIndex) => (
                                            <article key={subMenuIndex} className='article__det__menu'>
                                                {subMenu.id_article &&

                                                    <ul className='articulo__list' key={subMenu.id_article._id}>
                                                        <li className='articulo__item'>
                                                            <div className='articulo__container'>
                                                                <span className='descrip__det-menu'>{subMenu.id_article.name_article}</span>
                                                            </div>
                                                        </li>

                                                        <li className='articulo__item'>
                                                            <div className='articulo__container'>
                                                                <p className='articulo_descrip'>
                                                                    <input type="text" name='subtract' id='subtract' className='input__form--menu input__control input__form--menu--det'
                                                                        required onChange={(evento) => changeResta(evento, subMenu.id_article._id)} defaultValue={subMenu.subtract} />
                                                                </p>
                                                            </div>
                                                        </li>

                                                        <li className='articulo__item'>

                                                            <div className='articulo__container'>
                                                                <i><FontAwesomeIcon className='icon__icon' icon={faTrash} style={{ color: "#bfb95f", }}
                                                                    onClick={() => deleteArt(subMenu.id_article._id)} /></i>
                                                            </div>
                                                        </li>

                                                        <li className='articulo__item'>
                                                            <div className='articulo__container'>
                                                                <FontAwesomeIcon icon={faRotateRight} className='menu__icon--select list__icon' onClick={() => ActualizarArticulo(subMenu.id_article._id, subMenu._id)} />
                                                            </div>

                                                        </li>

                                                        <li className='articulo__item'>
                                                            <div className='articulo__container'>
                                                                <p className='articulo_descrip'>
                                                                    <input type="checkbox" name='optional' id='optional' required onChange={(evento) => articulOpcional(evento, subMenu.id_article._id)} defaultValue={subMenu.subtract} />
                                                                </p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                }
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            ))
                        }
                    </div>
                </section>
            </section>
            <div className='articulos__articulos'>

                <section className='articulos__container'>

                    <header className='articulo_headers'>
                        <span className='title__color--title'>Agrega productos a hamburguesa</span>
                    </header>
                    <section className="card__crear crear__hamburguesa">

                        <form className='aside__login aside__crear'>

                            <div>
                                <Multiselect
                                    options={opciones} // Opciones para mostrar en el dropdown
                                    selectedValues={opcionesSeleccionadas} // Valores preseleccionados
                                    onSelect={onSelect} // Función que se activará al seleccionar un elemento
                                    onRemove={onRemove} // Función que se activará al eliminar un elemento
                                    displayValue="name" // Propiedad del objeto a mostrar en el dropdown
                                />
                            </div>

                        </form>

                    </section>

                </section>
            </div>
        </div>
    )
}

export default Det_hamburguesa