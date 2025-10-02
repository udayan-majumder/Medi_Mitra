"use client"

import { UserStore } from "@/hooks/userauth.hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MedicalLoader from "@/Components/MedicalLoader";
import DoctorWrapper from "@/hooks/useDoctor.hooks";

export default function DoctorLayout({ children }) {
  const { User, isLoading } = UserStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and user is not authenticated
    // Add a small delay to ensure the authentication check is complete
    if (!isLoading && User !== null && !User?.id) {
      router.replace("/auth/login");
    }
  }, [User, isLoading, router]);

  // Display the loader while checking authentication
  if (isLoading || User === null) {
    return <MedicalLoader />;
  }

  // Don't render if user is not authenticated
  if (!User?.id) {
    return null;
  }

  return (
    <DoctorWrapper>
      {children}
    </DoctorWrapper>
  );
}
