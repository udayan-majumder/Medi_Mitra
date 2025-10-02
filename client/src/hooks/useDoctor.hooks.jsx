"use client";
import { useEffect, useState, useContext, createContext } from "react";
import { UserStore } from "./userauth.hooks";
import {
  GetDoctorProfileInfo,
  AddnewDoctorProfile,
} from "@/services/doctor.services";
import { useRouter } from "next/navigation";

const DoctorContext = createContext(null);

export const useDoctorStore = () => {
  const context = useContext(DoctorContext);
  if (context === null) {
    throw new Error("Doctor context not found");
  }
  return context;
};

const DoctorWrapper = ({ children }) => {
  {
    /* Default hooks */
  }
  const { User } = UserStore();
  const router = useRouter();

  {
    /* Custom hooks */
  }
  const [DoctorProfile, setDoctorProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Reload, setReload] = useState(false);

  {
    /* Fetch doctor profile */
  }
  const fetchDoctorProfile = async (doctorid) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!doctorid || !User?.id) {
        throw new Error("Missing doctor ID or user not authenticated");
      }

      const res = await GetDoctorProfileInfo(doctorid);

      if (!res) {
        setDoctorProfile(null);
        return;
      }

      setDoctorProfile(res);
    } catch (e) {
      console.error("Error fetching doctor profile:", e);
      setError(e.message);
      setDoctorProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createDoctorProfile = async (name, age, specialization, experience) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!User?.id) {
        throw new Error("User not authenticated");
      }

      const res = await AddnewDoctorProfile(
        User.id,
        name,
        age,
        specialization,
        experience
      );

      if (!res) {
        throw new Error("Failed to create doctor profile");
      }

      // Refresh doctor profile after creation
      await fetchDoctorProfile(User.id);
      return true;
    } catch (e) {
      console.error("Error creating doctor profile:", e);
      setError(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  {
    /* Update doctor profile */
  }
  const updateDoctorProfile = async (name, age, specialization, experience) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!User?.id) {
        throw new Error("User not authenticated");
      }

      // For now, we'll recreate the profile (you might want to add an update endpoint)
      const res = await AddnewDoctorProfile(
        User.id,
        name,
        age,
        specialization,
        experience
      );

      if (!res) {
        throw new Error("Failed to update doctor profile");
      }

      // Refresh doctor profile after update
      await fetchDoctorProfile(User.id);
      return true;
    } catch (e) {
      console.error("Error updating doctor profile:", e);
      setError(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  {
    /* Clear error */
  }
  const clearError = () => {
    setError(null);
  };

  {
    /* Reload doctor profile */
  }
  const reloadDoctorProfile = () => {
    if (User?.id) {
      fetchDoctorProfile(User.id);
    }
  };

  {
    /* Effects */
  }
  useEffect(() => {
    if (User?.id && !DoctorProfile) {
      fetchDoctorProfile(User.id);
    }
  }, [User?.id]);

  useEffect(() => {
    if (Reload && User?.id) {
      fetchDoctorProfile(User.id);
      setReload(false);
    }
  }, [Reload]);

  return (
    <DoctorContext.Provider
      value={{
        DoctorProfile,
        setDoctorProfile,
        isLoading,
        error,
        clearError,
        fetchDoctorProfile,
        createDoctorProfile,
        updateDoctorProfile,
        reloadDoctorProfile,
        setReload,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorWrapper;
