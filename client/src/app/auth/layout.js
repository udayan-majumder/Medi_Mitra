"use client"

import { UserStore } from "@/hooks/userauth.hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }) {
  const { User } = UserStore();
  const router = useRouter();

  useEffect(() => {
    if (User?.id) {
      router.replace(`/${User.type}`);
    }
  }, [User?.id]);

  return <>{children}</>;
}
