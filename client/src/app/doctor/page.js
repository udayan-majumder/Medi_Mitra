"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MedicalLoader from "@/Components/MedicalLoader";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/doctor/home");
  }, []);

  return <MedicalLoader />;
}
