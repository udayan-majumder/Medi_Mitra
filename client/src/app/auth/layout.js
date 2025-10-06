"use client"

import { UserStore } from "@/hooks/userauth.hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Github,Info } from "lucide-react";

export default function AuthLayout({ children }) {
  const { User } = UserStore();
  const router = useRouter();
  const [popup,setPopup] = useState(false) 


  useEffect(() => {
    if (User?.id) {
      router.replace(`/${User.type}`);
    }
  }, [User?.id]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="absolute bottom-5 left-2 h-[40px] w-[140px] bg-black rounded-[60px] flex justify-center items-center shadow-2xl active:bg-gray-400 ">
        <button
          onClick={() => router.replace("/about")}
          className="h-full w-full flex justify-center items-center gap-2 cursor-pointer"
        >
          <Info size={22} strokeWidth={2} />
          <div className="text-[16px]">Github Link</div>
        </button>
      </div>
      {children}
    </APIProvider>
  );
}
