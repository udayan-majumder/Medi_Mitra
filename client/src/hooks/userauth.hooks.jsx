"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { GetUserDetails } from "@/services/user.services";
import { APIProvider } from "@vis.gl/react-google-maps";
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
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    try {
      setIsLoading(true);
      const res = await GetUserDetails();
      setUser(res);
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    handleUser();
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
    <UserContext.Provider
      value={{
        User,
        setUser,
        LanguageType,
        setLanguageType,
        isLoading,
      }}
    >
       <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      {children}
      </APIProvider>
    </UserContext.Provider>
  );
};

export default Wrapper;
