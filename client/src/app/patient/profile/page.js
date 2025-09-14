"use client"

import { useState,useEffect, useRef } from "react";
import { LanguageStore } from "@/store/Dictionary.store";
import { UserStore } from "@/hooks/userauth.hooks";
import { ChevronLeft, UserRoundCog,Calendar,MapPin,ClipboardPlus,ClipboardList,CirclePlus } from "lucide-react";
import { UploadPatientPescription } from "@/services/user.services";

export default function CheckPatientProfile(){
{/*Default hooks */}
const {Language} = LanguageStore()
const {LanguageType,User,Age,Diseases} = UserStore()

{/*custom hooks */}
const fileinputRef = useRef(null)


const handleButtonClick = ()=>{
    fileinputRef.current.click()
}

const listenFileChanges = async(e) =>{
    const file = e.target.files[0]
    const formData = new FormData();
    formData.append("file", file);
   
    const res = await UploadPatientPescription(formData)
     
    console.log(res)
}

    return (
      //main div
      <div className="h-full w-full space-y-8 poppins bg-[#EEEEEE] text-black">
        {/*Heading Navbar */}
        <div className="h-[8%] w-full flex justify-left items-center p-4 space-x-2">
          <button>
            <ChevronLeft />
          </button>
          <div className="text-xl">{Language?.[LanguageType]?.profile}</div>
        </div>

        {/*User Profile */}
        <div className="h-[10%] w-full flex justify-center items-center">
          <div className="h-full w-[90%] rounded-lg bg-white flex">
            {/*User Icon */}
            <div className=" h-full w-[20%] flex justify-center items-center p-1">
              <div className="h-[80%] w-[90%] bg-gray-200 rounded-[100px] flex justify-center items-center">
                <UserRoundCog size={40} strokeWidth={1} color="gray" />
              </div>
            </div>

            {/*UserName */}
            <div className="h-full w-[60%] flex flex-col justify-center">
              <div className="text-base">{User?.username}</div>
              <div className="text-xs text-gray-500">{User?.email}</div>
            </div>

            {/*edit */}
            <div></div>
          </div>
        </div>

        {/*User Details */}
        <div className="h-[30%] w-full flex flex-col justify-center items-center ">
          <div className="h-full w-[90%] flex flex-col justify-center items-center bg-white rounded-lg">
            {/*Age Div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <Calendar size={40} strokeWidth={1} color="gray" />
              </div>

              {/*Age*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base">Age</div>
                <div className="text-xs text-gray-500">{Age}</div>
              </div>

              {/*edit */}
              <div></div>
            </div>

            {/*Locatin Div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <MapPin size={40} strokeWidth={1} color="gray" />
              </div>

              {/*UserName */}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base">Location</div>
                <div className="text-xs text-gray-500">{User?.location}</div>
              </div>

              {/*edit */}
              <div></div>
            </div>

            {/*Medical Condition div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <ClipboardPlus size={40} strokeWidth={1} color="gray" />
              </div>

              {/*Medical Condition*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base">Medical Condition</div>
                <div className="text-[9px] text-gray-500">
                  {Diseases?.map((items) => items)}
                </div>
              </div>

              {/*edit */}
              <div></div>
            </div>
          </div>
        </div>

        {/*Pescription Div */}
        <div className="h-[50%] w-full flex justify-center items-start ">
          <div className="h-[70%] w-[90%] bg-white rounded-lg">
            <div className="h-[30%] w-[95%] flex justify-center items-center space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <ClipboardList size={40} strokeWidth={1} color="gray" />
              </div>

              {/*Age*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base">Pescription</div>
                <div className="text-[10px] text-gray-500">view and manage your pescription</div>
              </div>

              {/*edit */}
              <div className="w-[10%] h-full flex justify-center items-center">
                <button><CirclePlus strokeWidth={1} onClick={handleButtonClick}/></button>
                <input type="file" ref={fileinputRef} onChange={listenFileChanges} style={{display:"none"}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}