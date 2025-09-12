"use client"

import { useState,useEffect } from "react";
import { ChevronLeft,Search,Store,MapPinCheck,MapPinX } from "lucide-react";
import { FetchPharmacyList } from "@/services/pharmacy.services";
import { UserStore } from "@/hooks/userauth.hooks";
import { useRouter } from "next/navigation";
import PharmacyStore from "@/store/pharmacy.store";
export default function Pharmacy() {
{/*Default hook */}
  const {User} = UserStore()
  const  router = useRouter()
  {/*Custom hook */}
  const [SearchParam,setSearchParam] = useState(null)
  const {PharmacyList,setPharmacyList} = PharmacyStore()

useEffect(()=>{
  handleSubmit()
},[])

  useEffect(()=>{
    const handler = setTimeout(()=>{
      handleSubmit()
    },500)
    return ()=>clearTimeout (handler)
  },[SearchParam])

{/*Function for search */}
const handleSubmit = async(e)=>{
try{
  if(e){
  e.preventDefault();
  }
  const res = await FetchPharmacyList(SearchParam)

  if(!res?.data){
    console.log("no data")
  }
  setPharmacyList(res?.data)
}
catch(e){
  console.error(e)
}
}

  return (
    //main div
    <div className="h-screen w-full bg-white poppins">
      {/*sub div */}
      <div className="h-[90%] w-full flex flex-col justify-start items-start">
        {/*Back Button */}
        <div className="h-[6%] w-full flex justify-left items-center p-[10px]">
          <ChevronLeft color="black" />
        </div>

        {/*search Form */}
        <form
          onSubmit={handleSubmit}
          className="h-[8%] w-full flex justify-center items-center space-x-2"
        >
          <input
            className="h-[60%] w-[80%] border border-gray-300 p-[10px] rounded-[100px] placeholder-gray-400 text-black focus:outline-green-500"
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
            className="h-[60%] w-[9%] bg-black rounded-[300px] flex justify-center items-center"
          >
            <Search color="white" />
          </button>
        </form>

        {/*All pharamacy list div*/}
        <div className="h-[85%] w-full flex flex-col justify-start items-center space-y-6 p-[20px] overflow-y-scroll">
          {PharmacyList?.length > 0 ? (
            PharmacyList?.sort((prev,next)=> {

              if (prev.location === User?.location && next?.location !== User?.location)
                return -1;
              if (prev?.location !== User?.location && next?.location === User?.location)
                return 1;
              return 0;
            } ).map((items) => (
              <button
                key={items?.id}
                className="min-h-[90px] w-full flex justify-center items-center shadow-[0_0_2px_2px_rgba(0,0,0,0.2)] rounded-lg pt-[10px] active:bg-gray-200"
                onClick={()=> router.push(`/patient/pharmacy/${items?.id}`) }
              >
                <div className="h-full w-[15%] flex justify-center items-start">
                  <Store color="black" size={40} strokeWidth={0.8} />
                </div>
                <div className="h-full w-[60%] flex flex-col justify-start items-start text-black space-y-1">
                  <div className="w-full text-left text-[15px]">
                    {items?.username}
                  </div>
                  <div className="w-full text-left text-[12px]">
                     {items?.location}
                  </div>
                  <div className="w-full text-left text-[11px] text-gray-400">
                    {items?.location === User?.location ? "Available in your city" : "Not available in your city"}
                  </div>
                </div>
                <div className="h-full w-[20%] flex justify-center items-start">
                  <div
                    className={
                      items?.location === User?.location
                        ? "h-[60%] w-[70%] rounded-[100px] bg-green-400 flex justify-center items-center"
                        : "h-[60%] w-[70%] rounded-[100px] bg-red-500 flex justify-center items-center"
                    }
                  >
                    {items?.location === User?.location ? (
                      <MapPinCheck color="white" />
                    ) : (
                      <MapPinX color="white" />
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="h-full w-full flex justify-center items-center text-black">
              no store Available
            </div>
          )}
        </div>
      </div>

      {/*Navbar Component */}
      <div className="h-[10%] w-full bg-blue-500"></div>
    </div>
  );
}
