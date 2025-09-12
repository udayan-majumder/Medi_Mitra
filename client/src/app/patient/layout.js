"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";

export default function PatientLayout({ children }) {
  const { User } = UserStore();
  const router = useRouter();

  // useEffect(() => {
  //   if (!User?.id) {
  //     router.replace("/auth/login");
  //   }
  // }, [User?.id]);

  return <>{children}</>;
}
