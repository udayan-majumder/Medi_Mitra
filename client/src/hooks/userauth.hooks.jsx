"use client";
import {
    useContext,
    createContext,
    Children,
    useState,
    useEffect,
} from "react";
import axios from "axios";

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

    const GetUserDetails = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/user/userdetails`,
                {
                    withCredentials: true,
                }
            );
            if (res?.data?.id) {
                setUser(res?.data);
            }
        } catch (e) {
            setUser(null);
        }
    };

    useEffect(() => {
        GetUserDetails();
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
