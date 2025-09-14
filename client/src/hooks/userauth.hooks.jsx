"use client";
import {
    useContext,
    createContext,
    useState,
    useEffect,
} from "react";
import { GetUserDetails } from "@/services/user.services";
import { GetPatientInfo } from "@/services/user.services";

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
    const [LanguageType, setLanguageType] = useState("english");
    const [Age,setAge] = useState(null)
    const  [Diseases,setDiseases] = useState([])

    const handleUser = async()=>{
        const res = await GetUserDetails();
        setUser(res)
         if(res?.type === 'patient'){
            const patientres = await GetPatientInfo(res?.id)
            console.log(patientres[0]?.age)
            setAge(patientres[0]?.age)
            setDiseases(patientres[0]?.diseases)
        }
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
        <UserContext.Provider value={{ User, setUser, LanguageType , setLanguageType,Age,setAge,Diseases,setDiseases }}>
            {children}
        </UserContext.Provider>
    );
};

export default Wrapper;
