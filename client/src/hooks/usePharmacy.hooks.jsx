"use client";

import { GetPharmacyProfileInfo } from "@/services/pharmacy.services";
import { useState, useEffect, useContext, createContext } from "react";
import { UserStore } from "./userauth.hooks";

const PharmacyContext = createContext(null);

export const usePharmaStore = () => {
  const context = useContext(PharmacyContext);
  if (context === null) {
    throw new Error("no user");
  }
  return context;
};

export default function PharmacyWrapper({ children }) {
  const [Pharmacy_profile, setPharmacy_profile] = useState(null);
  const [Reload, setReload] = useState(false);
  const { User } = UserStore();

  const fetchProfile = async (id) => {
    try {
      const res = await GetPharmacyProfileInfo(id);
      if (!res) {
        return setPharmacy_profile(null);
      }
      setPharmacy_profile(res);
    } catch (e) {
     return setPharmacy_profile(null)
    }
  };

  useEffect(() => {
    if (User?.id) {
      fetchProfile(User?.id);
    }
  }, []);

  useEffect(() => {
    if (Reload) {
      if (User?.id) {
        fetchProfile(User?.id);
      }
    }
  }, [Reload]);

  return (
    <PharmacyContext.Provider value={{ Pharmacy_profile, setPharmacy_profile,Reload,setReload }}>
      {children}
    </PharmacyContext.Provider>
  );
}
