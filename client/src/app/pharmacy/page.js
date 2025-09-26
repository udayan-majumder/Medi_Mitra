"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MedicalLoader from "@/Components/MedicalLoader";
import { usePharmaStore } from "@/hooks/usePharmacy.hooks";

export default function App() {
  const router = useRouter();
  const [currentPage, setPage] = useState("/pharmacy/home");
  const {Pharmacy_profile} = usePharmaStore()
  useEffect(() => {
    router.replace("/pharmacy/home");
  }, []);
  
  return <MedicalLoader />;
}
