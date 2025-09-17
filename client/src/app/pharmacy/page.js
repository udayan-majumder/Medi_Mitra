"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MedicalLoader from "@/Components/MedicalLoader";

export default function App() {
  const router = useRouter();
  const [currentPage, setPage] = useState("/pharmacy/home");
  useEffect(() => {
    router.replace("/pharmacy/home");
  }, []);

  return <MedicalLoader />;
}
