"use client"

import { useParams } from "next/navigation";
import PharmacyStore from "@/store/pharmacy.store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import { ChevronLeft, Search, Store, MapPinCheck, MapPinX } from "lucide-react";
import { GetPharamacyStock } from "@/services/pharmacy.services";

export default function PharmacyStockpage(){
{/*default hooks */}
const {PharmacyList,MedicineInventory,setMedicineInventory} = PharmacyStore()
const { pharmaid } = useParams();
const {User} = UserStore()
const router = useRouter()

{/*Custom hook */}
const [currentProfile, setCurrentProfile] = useState([])
const  [SearchParam,setSearchParam] = useState(null)
useEffect(()=>{
    if(PharmacyList?.length<=0){
     router.push("/patient/pharmacy")
    }
    const res = PharmacyList?.find((items)=> items?.id === Number(pharmaid))
    setCurrentProfile(res)
    setMedicineInventory([])
},[])
   
useEffect(()=>{
if(currentProfile?.id){
    FetchStock()
}
},[currentProfile])



const FetchStock = async()=>{
    try{
       const res = await GetPharamacyStock(currentProfile?.id)
       if(!res){
        setMedicineInventory([])
       }
       setMedicineInventory(res?.data?.list)
    }catch(e){
    console.log(e)
    }
}
const handleSubmit = async(e) =>{

}


    return (
      //main div
      <div className="h-screen w-full bg-gray-900 text-white poppins">
        <div className="h-[90%] w-full py-8">
          {/*Back Button */}
          <button
            className="h-[8%] w-full flex justify-left items-center p-[15px]"
            onClick={() => {
              router.push("/patient/pharmacy");
            }}
          >
            <ChevronLeft color="white" />
          </button>

          {/*Profile Current*/}
          <div className="h-[12%] w-full flex justify-center items-center border-b border-gray-600">
            <div className="h-full w-[70%] flex flex-col justify-start items-start text-white ">
              <div className="w-full text-left text-[22px]">
                {User?.username}
              </div>
              <div className="w-full text-left text-[16px]">
                {User?.location}
              </div>
              <div className="w-full text-left text-[13px] text-gray-300">
                {User?.location === currentProfile?.location
                  ? "Available in your city"
                  : "Not available in your city"}
              </div>
            </div>
            <div className="h-full w-[20%] flex justify-center items-start pt-[10px]">
              <div
                className={
                  User?.location === currentProfile?.location
                    ? "h-[55%] w-[60%] rounded-[100px] bg-green-400 flex justify-center items-center"
                    : "h-[55%] w-[60%] rounded-[100px] bg-red-500 flex justify-center items-center"
                }
              >
                {User?.location === currentProfile?.location ? (
                  <MapPinCheck color="white" />
                ) : (
                  <MapPinX color="white" />
                )}
              </div>
            </div>
          </div>

          {/*Search functionalty */}
          <form
            // onSubmit={handleSubmit}
            className="h-[8%] w-full flex justify-center items-center space-x-2"
          >
            <input
              className="h-[60%] w-[80%] border border-gray-600 bg-gray-800 p-[10px] rounded-[100px] placeholder-gray-400 text-white focus:outline-green-500"
              placeholder="search pharamacy name"
              onChange={(e) => {
                if (e.target.value.length <= 0) {
                  setSearchParam(null);
                } else {
                  setSearchParam(e.target.value);
                }
              }}
            ></input>
            <button
              type="submit"
              className="h-[60%] w-[9%] bg-gray-700 hover:bg-gray-600 rounded-[300px] flex justify-center items-center"
            >
              <Search color="white" />
            </button>
          </form>

          {/*List item div */}
          <div className="h-[74%] w-full p-[22px] flex flex-col justify-start items-start overflow-y-scroll space-y-3">
            {MedicineInventory?.length > 0 ? (
              MedicineInventory?.filter((items) =>
                items?.medicine_name
                  ?.toLowerCase()
                  ?.includes(
                    SearchParam !== null ? SearchParam.toLowerCase() : ""
                  )
              ).map((items) => (
                <div
                  key={items?.medicine_id}
                  className="min-h-[60px] w-full flex justify-center items-center border-b border-gray-600"
                >
                  <div className="h-full w-[70%] space-y-1">
                    <div className="text-sm font-medium text-white">
                      {items?.medicine_name}
                    </div>
                    <div className="text-xs text-gray-300">
                      Availablility : {items?.quantity}
                    </div>
                  </div>
                  <div className="h-full w-[30%]">
                    <div className="w-full flex justify-center items-right text-xl font-semibold text-white">
                      ₹{items?.price}/-
                    </div>
                    <div className="w-full flex justify-center items-right  text-xs text-gray-300">
                      per strip
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white"> loading...</div>
            )}
          </div>
        </div>
      </div>
    );


}