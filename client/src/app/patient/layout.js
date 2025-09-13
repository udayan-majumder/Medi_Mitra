"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import MobileNavbarComponent from "@/Components/mobilenavbar.components";

export default function PatientLayout({ children }) {
  const { User } = UserStore();
  const router = useRouter();

  useEffect(() => {
    if (!User?.id) {
      router.replace("/auth/login");
    }
  }, [User?.id]);

  return (
    <div className="h-screen w-full bg-white">
      <div className="h-[90%] w-full ">{children}</div>
      <MobileNavbarComponent height={10} width={100} />
    </div>
  );
}
