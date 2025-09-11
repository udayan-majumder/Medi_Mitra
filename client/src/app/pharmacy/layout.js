"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import { GetPharamacyStock } from "@/services/pharmacy.services";
import PharmacyStore from "@/store/pharmacy.store";

export default function PharmacyLayout({ children }) {
  const { User } = UserStore();
  const  {setMedicineInventory,PharmacyRefresh,setPharmacyRefresh} = PharmacyStore()
  const router = useRouter();

  {/*Fetch Stock Script */}
  const fetchStock = async() =>{
   const res = await GetPharamacyStock(User?.id);
   console.log(res?.data)
   if(res?.data?.list && res?.data?.totalstock){
    setMedicineInventory(res?.data);
   }
  }
  

  useEffect(()=>{
     fetchStock()
  },[])
  

  useEffect(() => {
    if(PharmacyRefresh){
    console.log("triggered")
     fetchStock();
     setPharmacyRefresh(false)
    }
  }, [PharmacyRefresh]);


  useEffect(() => {
    if (!User?.id) {
      router.replace("/auth/login");
    }
  }, [User?.id]);

  return <>{children}</>;
}
