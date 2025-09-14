"use client";
import { useContext, createContext, useState, useEffect } from "react";
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
  const [Age, setAge] = useState(null);
  const [Diseases, setDiseases] = useState([]);
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

  const fetchPatientInfo = async (userId) => {
    if (userId) {
      const patientDetails = await GetPatientInfo(userId);
      if (patientDetails && patientDetails[0]) {
        setAge(patientDetails[0]?.age);
        setDiseases(patientDetails[0]?.diseases);
      }
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

  // Fetch patient details once the user logs in
  useEffect(() => {
    if (User && User.type === "patient" && User.id) {
      fetchPatientInfo(User.id);
    } else if (!User) {
      // Clear patient info after log out
      setAge(null);
      setDiseases([]);
    }
  }, [User]);

  return (
    <UserContext.Provider
      value={{
        User,
        setUser,
        LanguageType,
        setLanguageType,
        Age,
        setAge,
        Diseases,
        setDiseases,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default Wrapper;
