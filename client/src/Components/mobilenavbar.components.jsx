"use client";
import { ClipboardPen, House, Store, User } from "lucide-react";
import { useRouter,usePathname } from "next/navigation";
import { useEffect, useState } from "react";
export default function MobileNavbarComponent({ height, width }) {
  const [currentRoute, setcurrentRoute] = useState("/patient/home");
  const router = useRouter();
  const pathname = usePathname()

  useEffect(()=>{
    setcurrentRoute(pathname)
  },[])

  return (
    <div
      className="bg-green-700 flex justify-around items-center"
      style={{ height: `${height}%`, width: `${width}%` }}
    >
      <button
        className={
          currentRoute === "/patient/symptom-checker"
            ? "h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center"
            : "h-[70%] w-[15%] bg-none rounded-4xl flex justify-center items-center"
        }
        onClick={()=>{
          router.push("/patient/symptom-checker")
          setcurrentRoute("/patient/symptom-checker")
        }}
      >
        <ClipboardPen size={33} color="white" strokeWidth={1.5} />
      </button>
      <button
        className={
          currentRoute === "/patient/home"
            ? "h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center"
            : "h-[70%] w-[15%] bg-none rounded-4xl flex justify-center items-center"
        }
        onClick={()=>{
          router.push("/patient/home")
          setcurrentRoute("/patient/home")
        }}
      >
        <House size={33} color="white" strokeWidth={1.5} />
      </button>
      <button
        className={
          currentRoute === "/patient/pharmacy"
            ? "h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center"
            : "h-[70%] w-[15%] bg-none rounded-4xl flex justify-center items-center"
        }
        onClick={()=>{
          router.push("/patient/pharmacy")
          setcurrentRoute("/patient/pharmacy")
        }}
      >
        <Store size={33} color="white" strokeWidth={1.5} />
      </button>
      <button
        className={
          currentRoute === "/patient/profile"
            ? "h-[70%] w-[15%] bg-black rounded-4xl flex justify-center items-center"
            : "h-[70%] w-[15%] bg-none rounded-4xl flex justify-center items-center"
        }
        onClick={()=>{
          router.push("/patient/profile")
          setcurrentRoute("/patient/profile")
        }}
      >
        <User size={33} color="white" strokeWidth={1.5} />
      </button>
    </div>
  );
}
