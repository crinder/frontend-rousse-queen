import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';


const Det_menu = () => {

    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [opciones, setOpciones] = useState([]);
    const location = useLocation();
    const [NombreMenu, setNombreMenu] = useState('');
    const [resta, setResta] = useState('');
    const [opcional, setOpcional] = useState('');
    let id_menu = location.state.idmenu;
    let nombre = 0;

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

            deletetMenu(obj);
        }

        setOpcionesSeleccionadas(selectedList);
    }

    const [saved, setSaved] = useState("");
    const [detmenus, setDetmenus] = useState("");
    const [articles, setArticles] = useState("");
    const [guardado, setGuardado] = useState("");

    let token = localStorage.getItem('token');

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
            devuelveDetalle();
            articulosActualizado();
        } else {
            setGuardado("error");
        }

    }

    const insertMenu = async (obj) => {

        console.log('insert...' + id_menu);

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
        } else {
            setGuardado("error");
        }
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
            setSaved("success");

            const opcionesMap = dataArt.listArticle.map(article => ({

                name: article.name_article,
                id: article._id
            }));

            setOpciones(opcionesMap);

        } else {
            setSaved("error");
            setArticles("");
        }

    }

    const ActualizarArticulo = async (id, iddetmenu) => {
        const act = resta[id];
        const opc = opcional[id];

        let body = {
            id_menu: id_menu
        };

        if (act) {
            body.subtract = act;
        }

        if (opc) {
            body.opcional = opc;
        }

        console.log(body);

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
            setSaved("success");
            setDetmenus(data.det_menu);
        } else {
            setSaved("error");
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

            <section className='articulos__container container__det_menu'>
                <header className='articulo_headers'>
                    <span className='title__color--title'>Articulos asociados al menu</span>
                </header>

                <section className="aside__login detmenu__section">
                    {detmenus.length > 0 &&
                        detmenus.map((detmenu, index) => (
                            <section className='section__detmenu' key={index}>
                                <p className='detmenu__p'><span className='title__detmenu'>{NombreMenu}</span></p>

                                <div className='detmenu__list'>
                                    {Array.isArray(detmenu.det_menu) && detmenu.det_menu.map((subMenu, subMenuIndex) => (
                                        <article key={subMenuIndex} className='article__det__menu'>
                                            {subMenu.id_article &&
                                                <div className='detmenu__span' >
                                                    <div className='detmenu__menu--det'>
                                                        <span className='title__det-menu'>Articulo</span>
                                                        <span className='descrip__det-menu'>{subMenu.id_article.name_article}</span>
                                                    </div>

                                                    <div className='detmenu__menu--det'>
                                                        <span className='title__det-menu'>Actualizar</span>
                                                        <div>
                                                            <input type="text" name='subtract' id='subtract' className='input__form--menu input__control input__form--menu--det'
                                                                required onChange={(evento) => changeResta(evento, subMenu.id_article._id)} defaultValue={subMenu.subtract} />
                                                        </div>
                                                    </div>

                                                    <div className='detmenu__menu--det'>
                                                        <span className='title__det-menu'>Eliminar</span>
                                                        <i><FontAwesomeIcon className='icon__icon' icon={faTrash} style={{ color: "#bfb95f", }}
                                                            onClick={() => deleteArt(subMenu.id_article._id)} /></i>
                                                    </div>

                                                    <div className='detmenu__menu--det'>
                                                        <span className='title__det-menu'>Actualizar</span>
                                                        <FontAwesomeIcon icon={faRotateRight} className='menu__icon--select list__icon' onClick={() => ActualizarArticulo(subMenu.id_article._id, subMenu._id)} />
                                                    </div>

                                                    <div className='detmenu__menu--det'>
                                                        <span className='title__det-menu'>Opcional?</span>
                                                        <div>
                                                            <input type="checkbox" name='optional' id='optional' required onChange={(evento) => articulOpcional(evento, subMenu.id_article._id)} defaultValue={subMenu.subtract} />
                                                        </div>
                                                    </div>


                                                </div>
                                            }
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))
                    }
                </section>
            </section>

            <section className='crear__detmenu'>
                <header className='articulo_headers'>
                    <span className='title__color--title'>Agrega articulos al menu</span>
                </header>

                <Multiselect
                    options={opciones} // Opciones para mostrar en el dropdown
                    selectedValues={opcionesSeleccionadas} // Valores preseleccionados
                    onSelect={onSelect} // Función que se activará al seleccionar un elemento
                    onRemove={onRemove} // Función que se activará al eliminar un elemento
                    displayValue="name" // Propiedad del objeto a mostrar en el dropdown
                />

            </section>
        </div>


    )
}

export default Det_menu