"use client"

import { useState,useEffect } from "react";
import { ChevronLeft,Search,Store,MapPinCheck,MapPinX } from "lucide-react";
import { FetchPharmacyList } from "@/services/pharmacy.services";
import { UserStore } from "@/hooks/userauth.hooks";


export default function Pharmacy() {
{/*Default hook */}
  const {User} = UserStore()
  
  {/*Custom hook */}
  const [SearchParam,setSearchParam] = useState(null)
  const [PharmacyList,setPharmacyList] = useState([]) 

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
        <div className="h-[85%] w-full flex flex-col justify-start items-center space-y-6 p-[10px] overflow-y-scroll">
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
                className="min-h-[80px] w-full flex justify-center items-center shadow-[0_0_2px_2px_rgba(0,0,0,0.2)] rounded-lg"
              >
                <div className="h-full w-[15%] flex justify-center items-center">
                  <Store color="black" />
                </div>
                <div className="h-full w-[65%] flex flex-col justify-center items-center text-black p-[5px]">
                  <div className="h-[30%] w-full text-left text-base">
                    {items?.username}
                  </div>
                  <div className="h-[30%] w-full text-left text-sm">
                    {items?.location}
                  </div>
                  <div className="h-[20%] w-full text-left text-xs text-gray-400">
                    {items?.location === User?.location ? "Available in your city" : "Not available in your city"}
                  </div>
                </div>
                <div className="h-full w-[20%] flex justify-center items-center">
                  <div
                    className={
                      items?.location === User?.location
                        ? "h-[60%] w-[60%] rounded-[100px] bg-green-400 flex justify-center items-center"
                        : "h-[50%] w-[56%] rounded-[100px] bg-red-500 flex justify-center items-center"
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
