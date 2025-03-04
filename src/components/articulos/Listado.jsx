import React, { useEffect, useState } from 'react';
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Listado = () => {

    const [lista, setLista] = useState("");
    const [articulos, setArticulos] = useState([]);
    const token = localStorage.getItem('token');
    const [articulo, setArticulo] = useState("");
    const [artmanual, setArtManual] = useState([]);
    const [articuloAct, setArticuloAct] = useState({});
    const [idsParaActualizar, setIdsParaActualizar] = useState([]);
    const { form, changed } = useForm({});

    useEffect(() => {

        listar();
    }, []);


    const toggleActualizar = (id, valor) => {

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

    const actInve = (evento, id) => {

        setArticuloAct({
            ...articuloAct,
            [id]: evento.target.value
        })

    }

    const ActualizarManual = (evento, id) => {


        const artExist = artmanual.some((seleted) => seleted.id == id);

        setArtManual(
            artExist
                ? artmanual.filter((selected) => selected.id !== id)
                : [...artmanual, { id: id }]
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
        <div className='articulos__container'>

            <header className='articulo_headers'>
                <span className='title__color--title'>Articulos</span>
            </header>

            <section className="card__general">

                <div className='title_menu'>

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
                                                    onChange={(e) => toggleActualizar(articulo._id, e.target.value)}
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
                                                <input type="checkbox" name="art_dispo" id="art_dispo"
                                                    onChange={(e) => ActualizarManual(e.target.checked, articulo._id)}
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
                </div>
            </section>
        </div>
    )
}

export default Listado