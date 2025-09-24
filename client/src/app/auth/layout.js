"use client"

import { UserStore } from "@/hooks/userauth.hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function AuthLayout({ children }) {
  const { User } = UserStore();
  const router = useRouter();

  useEffect(() => {
    if (User?.id) {
      router.replace(`/${User.type}`);
    }
  }, [User?.id]);

  return <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    {children}
  </APIProvider>
}
