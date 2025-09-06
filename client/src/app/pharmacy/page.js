"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App(){
const router = useRouter()

    useEffect(()=>{
        router.replace("/pharmacy/home")
    },[])

return <div>Redirecting...</div>

}