import React, { useEffect, useState } from 'react'
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import Multiselect from 'multiselect-react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faCheckToSlot } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';


const Det_menu = () => {

    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [opcionesSeleccionadasHam, setOpcionesSeleccionadasHam] = useState([]);
    const [opciones, setOpciones] = useState([]);
    const location = useLocation();
    const [NombreMenu, setNombreMenu] = useState('');
    const [resta, setResta] = useState('');
    const [opcional, setOpcional] = useState('');
    const [hamburguesaAdd, setHamburguesaAdd] = useState('N');
    const [hamburguesas, setHamburguesas] = useState(false);
    const [opcionesHamburguesa, setOpcionesHamburguesa] = useState([]);
    const [cantidadHamburguesa, setCantidadHamburguesa] = useState(0);
    const [alitas, setAlitas] = useState();
    const [menu, setMenu] = useState('');
    const [alitaSelected, setAlitaSelected] = useState();
    const [hamburguesaSelected, setHamburguesaSelected] = useState();
    const [cantidad, setCantidad] = useState();

    let id_menu = location.state.idmenu;
    let nombre = 0;

    useEffect(() => {

        nombre = location.state.nombre;

        setNombreMenu(nombre);
        listar();
    }, []);

    const changeResta = (evento, id) => {
        console.log(evento.target.value);
        setResta({
            ...resta,
            [id]: evento.target.value
        });

    }

    const eliminarHamburguesa = (id) => {

        const hamburguesasSelect = opcionesHamburguesa.filter(item => item.id != id);
        const hamburguesasEli = opcionesHamburguesa.filter(item => item.id == id);

        let c_body = hamburguesasSelect.map(item => ({
            id_hamburguesa: item.id
        }));

        insertHamburguesa(c_body, 'E');
        setHamburguesas(hamburguesasEli);
        setOpcionesSeleccionadasHam(hamburguesasSelect);

    }

    const onSelectHam = (selectedList, selectedItem) => {

        console.log(selectedList);
        //setOpcionesHamburguesa[selectedList];

        const hamburguesasSelect = selectedList.map(item => ({
            id_hamburguesa: item.id
        }));

        insertHamburguesa(hamburguesasSelect, 'A');

        setOpcionesSeleccionadasHam(selectedList);


    }

    const onRemoveHam = (selectedList, removedItem) => {

        for (let opcion of selectedList) {
            const obj = {
                id_article: opcion.id
            }
        }

        setOpcionesSeleccionadasHam(selectedList);
    }

    const listar = async () => {
        let sucursal = 1;

        const request = await fetch(Global.url + 'menu/listOne/' + id_menu, {
            method: "GET",
            headers: {
                "authorization": token,
                "Content-Type": "application/json"
            }

        });

        const data = await request.json();

        if (data.status == "success") {
            setMenu(data.menu);
            setAlitaSelected(data.menu.alitas);

            console.log(data.menu.cantidad_hamburguesa);

            if (data.menu.cantidad_hamburguesa > 0) {
                console.log(data.menu.cantidad_hamburguesa);
                setHamburguesaAdd('S');
                setCantidad(data.menu.cantidad_hamburguesa);
            }else{
                setHamburguesaAdd('N');
            }
           
        }

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

    const insertHamburguesa = async (obj, ind) => {

        let c_body = {
            id_hamburguesa: obj,
            cantidad_hamburguesa: cantidadHamburguesa,
            ind: ind
        }

        const request = await fetch(Global.url + 'menu/update/' + id_menu, {
            method: "POST",
            body: JSON.stringify(c_body),
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


            const hamburguesasSelect = dataArt.hamburguesaSelect.map(menu => ({

                name: menu.description,
                id: menu._id
            }));

            setHamburguesas(hamburguesasSelect);

            if (dataArt.hamburguesaSelected.length > 0) {

                const hamburguesasMap = dataArt.hamburguesaSelected.map(menu => ({

                    name: menu.description,
                    id: menu._id
                }));

                setOpcionesHamburguesa(hamburguesasMap);
            } else {
                setOpcionesHamburguesa([]);
            }


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

    const changeAlitas = (e) => {

        setAlitas(e);
        setAlitaSelected(e);
    }

    useEffect(() => {
        actualizaMenu();
        listar();
    }, [alitas]);

    const actualizaMenu = async () => {

        if (alitas) {
            let body = {
                alitas: alitas
            };

            const request = await fetch(Global.url + 'menu/update/' + id_menu, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                }
            });
        }
    }

    return (
        <div className='articulos__articulos'>

            <section className='articulos__container container__det_menu'>
                <header className='articulo_headers'>
                    <span className='title__color--title'>Asociar productos a menu</span>
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
                        <span className='title__color--title'>Hamburguesas del menu</span>
                    </header>
                </section>

                <div>
                    {opcionesHamburguesa.length > 0 && opcionesHamburguesa.map((opcion, index) => {
                        return (
                            <article className='menu__article' key={index}>
                                <span className='select__opcion'>{opcion.name}</span>
                                <span><FontAwesomeIcon icon={faTrash} className='menu__icon--select list__icon' onClick={() => eliminarHamburguesa(opcion.id)} /></span>
                            </article>
                        )
                    })

                    }
                </div>
            </div>

            <div className='articulos__articulos'>

                <section className='articulos__container'>

                    <header className='articulo_headers'>
                        <span className='title__color--title'>Agrega productos al menu</span>
                    </header>
                    <section className="card__crear">

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

                            <div className='content__field--menu'>
                                <label htmlFor="contable" className='label__form'>Incluye hamburguesa?</label>
                                <input type="checkbox" name='hamburguesa' id='hamburguesa' 
                                                       onChange={(e) => setHamburguesaAdd(e.target.checked ? 'S' : 'N')} 
                                                       checked={hamburguesaAdd == 'S' ? true : false}/>
                            </div>

                            <div className='content__field--menu'>
                                <label htmlFor="contable" className='label__form'>Incluye alitas?</label>
                                <input type="checkbox" name='hamburguesa' id='hamburguesa'
                                    onChange={e => changeAlitas(e.target.checked ? 'S' : 'N')}
                                    checked={alitaSelected == 'S' ? true : false} />
                            </div>

                            {hamburguesaAdd == 'S' && hamburguesas &&

                                <div>

                                    <Multiselect
                                        options={hamburguesas} // Opciones para mostrar en el dropdown
                                        selectedValues={opcionesSeleccionadasHam} // Valores preseleccionados
                                        onSelect={onSelectHam} // Función que se activará al seleccionar un elemento
                                        onRemove={onRemoveHam} // Función que se activará al eliminar un elemento
                                        displayValue="name" // Propiedad del objeto a mostrar en el dropdown
                                    />

                                    <div className='content__field--menu'>
                                        <label htmlFor="contable" className='label__form'>Cantidad de hamburguesa?</label>
                                        <input type="text" name='cantidad_hamburguesa' id='cantidad_hamburguesa' onChange={(e) => setCantidadHamburguesa(e.target.value)} 
                                        defaultValue={cantidad}
                                        />
                                    </div>

                                </div>

                            }


                        </form>

                    </section>

                </section>
            </div>
        </div>
    )
}

export default Det_menu