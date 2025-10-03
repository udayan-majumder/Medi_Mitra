"use client";
import { useEffect, useState, useContext, createContext, use } from "react";
import { UserStore } from "./userauth.hooks";
import { GetAllProfiles } from "@/services/patient.services";
import { GetPatientInfo } from "@/services/user.services";
import { useRouter } from "next/navigation";
import { Geolocation } from '@capacitor/geolocation';
import CapacitorInfoStore from "@/store/capacitorInfo.store";
const PatientContext = createContext(null);

export const usePatientStore = () => {
  const context = useContext(PatientContext);
  if (context === null) {
    throw new Error("no patient profile");
  }
  return context;
};

const PatientWrapper = ({ children }) => {
  {
    /*Default hooks */
  }
  const { User } = UserStore();
  const router = useRouter();
  const {IsMobileView} = CapacitorInfoStore()
  {
    /*Custom hooks */
  }
  const [AllProfiles, setAllProfiles] = useState(null);
  const [currentProfileId, setcurrentProfileId] = useState(null);
  const [PatientProfile, setPatientProfile] = useState(null);
  const [Reload, setReload] = useState(false);
  const [Coords, setCoords] = useState({});
  const [Location,setLocation] = useState("")
  {
    /*Fetch all exsisting profiles */
  }
  const fetchAllProfiles = async () => {
    try {
      const res = await GetAllProfiles(User?.id);
      if (!res) {
        setAllProfiles([]);
      }
      setAllProfiles(res);
    } catch (e) {
      console.error(e);
    }
  };

  {
    /*Fetch current profile selected */
  }
  const fetchCurrentProfile = async (profileid) => {
    try {
      if (!profileid || !User?.id) {
        console.log("missing");
      }
      const res = await GetPatientInfo(profileid, User?.id);

      if (!res) {
        setPatientProfile(null);
      }

      setPatientProfile(res);
      if (!Reload) {
        localStorage.setItem("profileid", profileid);
        return router.replace("/patient/home");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (User?.id) {
      fetchAllProfiles();
    }
  }, []);

  useEffect(() => {
    if (Reload) {
      if (User?.id) {
        fetchAllProfiles();
        setReload(false);
      }
    }
  }, [Reload]);

  useEffect(() => {
    if (Reload) {
      if (currentProfileId !== null) {
        fetchCurrentProfile(currentProfileId);
        setReload(false);
      }
    }
  }, [Reload]);

  useEffect(() => {
    const id = localStorage?.getItem("profileid");
    if (!id) {
      setcurrentProfileId(null);
      router.replace("/patient");
    }
    setcurrentProfileId(id);
  }, []);

  useEffect(() => {
    if (currentProfileId !== null) {
      fetchCurrentProfile(currentProfileId);
    }
  }, [currentProfileId]);


   useEffect(() => {
    if (IsMobileView) {
      MobileFetchCoordinates();
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position?.coords?.latitude,
          lng: position?.coords?.longitude,
          location: Location,
        });
      });
    }
  }, [IsMobileView]);

  async function MobileFetchCoordinates() {
    const position = await Geolocation.getCurrentPosition();
    setCoords({
      lat: position?.coords?.latitude,
      lng: position?.coords?.longitude,
      location: Location,
    });
  }

  return (
    <PatientContext.Provider
      value={{
        AllProfiles,
        currentProfileId,
        setcurrentProfileId,
        PatientProfile,
        setPatientProfile,
        setReload,
        Coords,
        setCoords
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export default PatientWrapper;
