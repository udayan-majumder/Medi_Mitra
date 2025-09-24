"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import MobileNavbarComponent from "@/Components/mobilenavbar.components";
import MedicalLoader from "@/Components/MedicalLoader";
import PatientWrapper from "@/hooks/usePatient.hooks";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function PatientLayout({ children }) {
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
    <PatientWrapper>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <div className="h-screen w-full bg-white">
          <div className="h-[90%] w-full ">{children}</div>
          <MobileNavbarComponent height={10} width={100} />
        </div>
      </APIProvider>
    </PatientWrapper>
  );
}
