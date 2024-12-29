import React from 'react'
import { useState, useEffect, createContext } from 'react'
import Global from '../../helpers/Global';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        authUser();
    },[]);

    const authUser = async () => {

        let token = localStorage.getItem("token");
        let user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);
            return (false);
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id;

        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        });

        const data = await request.json();

        setAuth(data.user);

        setLoading(false);

    }

    return (<AuthContext.Provider
        value={{ 
            auth,
            setAuth,
            loading}}>
        {children}
    </AuthContext.Provider>
    )
}

export default AuthProvider