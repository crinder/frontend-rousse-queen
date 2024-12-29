import React, { useState } from 'react';
import Global from '../../helpers/Global';
import useForm from '../../assets/hooks/useForm';
import { Navigate } from 'react-router-dom';

const Login = () => {

    const {form, changed} = useForm({});
    const [saved,setSaved] = useState("");

    const loginUser = async(e) => {
        e.preventDefault();

        setSaved("");

        const userLogin = form;

        const request = await fetch(Global.url + "user/login", {
            method: "POST",
            body: JSON.stringify(userLogin),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await(request).json();

       if(data.status == "success"){
            localStorage.setItem('token',data.token);
            localStorage.setItem('user',JSON.stringify(data.user));
            setSaved('success');
            <Navigate to='/home'/>
       }else{
        setSaved('error');
       }
    }

    


    return (
        <section className="aside__left">
            <form className="aside__login" onSubmit={loginUser}>

                <article className="login__title">
                    <span className="title__color">!Bienvenido a Rousse Queen!</span>
                </article>  

                
                    <div className='box__alert'>
                       {saved == 'success' ? <strong><span className='message__success'>Login correctamente</span></strong> : ""}
                       {saved == 'error' ? <strong><span className='message__alert'>Error</span></strong> : ""}
                    </div>
                    

                <label className="user__label" htmlFor="user">Usuario</label>
                <input type="text" className="user__input" name="cod_user" onChange={changed} />

                <label className="user__label" htmlFor="password">Password</label>
                <input type="password" className="user__input" name='password' onChange={changed}/>

                <input type="submit" className="user__button" value="Ingresar" />

            </form>

        </section>
    )
}

export default Login