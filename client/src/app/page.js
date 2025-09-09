"use client"
import Image from "next/image";
import CapacitorInfoStore from "../store/capacitorInfo.store"
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import  {useRouter} from "next/navigation"

export default function Home() {
 const {IsMobileView,setIsMobileView} = CapacitorInfoStore()
 const {User,setUser} = UserStore()
 const router = useRouter()

 useEffect(()=>{
  if(Capacitor.isNativePlatform()){
    setIsMobileView(true)
  }
  User?.id ? router.replace(`/${User.type}`) : router.replace(`/auth/login`) 
 },[])



  return (
    <></>
  );
}
