"use client";
import {
    useContext,
    createContext,
    Children,
    useState,
    useEffect,
} from "react";
import { GetUserDetails } from "@/services/user.services";

export const UserContext = createContext(null);

export const UserStore = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error({ User: false });
    }
    return context;
};

const Wrapper = ({ children }) => {
    const [User, setUser] = useState(null);
    const [LanguageType, setLanguageType] = useState(null);

    const handleUser = async()=>{
        const res = await GetUserDetails();
        setUser(res)
    }

    useEffect(() => {
        handleUser()
        const Ltype = localStorage.getItem("languagetype");
        if (!Ltype) {
            setLanguageType("english");
        } else {
            setLanguageType(Ltype);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("languagetype", LanguageType);
    }, [LanguageType]);

    return (
        <UserContext.Provider value={{ User, setUser, LanguageType , setLanguageType }}>
            {children}
        </UserContext.Provider>
    );
};

export default Wrapper;
