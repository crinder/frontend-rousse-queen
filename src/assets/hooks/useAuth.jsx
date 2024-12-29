import { useContext } from "react";
import AuthProvider from "../../components/context/AuthProvider";

const useAuth = () => {
    return useContext(AuthProvider);
}

export default useAuth;