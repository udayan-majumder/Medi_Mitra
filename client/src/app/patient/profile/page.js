"use client"

import { useState,useEffect, useRef } from "react";
import { LanguageStore } from "@/store/Dictionary.store";
import { UserStore } from "@/hooks/userauth.hooks";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserRoundCog,Calendar,MapPin,ClipboardPlus,ClipboardList,CirclePlus, LogOut, X } from "lucide-react";
import { UploadPatientPescription, LogoutHandler } from "@/services/user.services";
import toast, { Toaster } from "react-hot-toast";

export default function CheckPatientProfile(){
{/*Default hooks */}
const {Language} = LanguageStore()
const {LanguageType,User,Age,Diseases,setUser,Prescription_URLS,setPrescription_URLS} = UserStore()
const router = useRouter()

{/*custom hooks */}
const fileinputRef = useRef(null)
const [SelectedImage,setSelectedImage] = useState(null)

const handleButtonClick = ()=>{
    fileinputRef.current.click()
}

const listenFileChanges = async(e) =>{
  try{
   toast.loading("Uploading")
   const file = e.target.files[0]
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id",User?.id)
    const res = await UploadPatientPescription(formData)
    if(!res){
      return toast.error("File no uploaded")
    }  
   
    setPrescription_URLS(prev => [...prev,res])
    toast.dismissAll()
    toast.success("File Uploaded Successfully")
   
    e.target.value = null
  }
  catch(e){
    console.log(e)
  }
   
}

const handleLogout = async () => {
    try {
        toast.loading("Logging out...");
        const logoutSuccess = await LogoutHandler();
        if (logoutSuccess) {
            toast.dismissAll();
            toast.success("Logged out successfully");
            setUser(null);
            localStorage.removeItem("languagetype");
            setTimeout(() => {
                router.push("/auth/login");
            }, 1000);
        } else {
            toast.dismissAll();
            toast.error("Logout failed. Please try again.");
        }
    } catch (error) {
        toast.dismissAll();
        toast.error("Something went wrong. Please try again.");
        console.error("Logout error:", error);
    }
};

    return (
      //main div
      <div className="h-full w-full space-y-8 poppins bg-[#EEEEEE] text-black">
        <Toaster position="top-center" />
        {/*Heading Navbar */}
        <div className="h-[8%] w-full flex justify-between items-center p-4">
          <div className="flex items-center px-2 space-x-2">
            {/* <button>
              <ChevronLeft />
            </button> */}
            <div className="text-xl">{Language?.[LanguageType]?.profile}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Logout</span>
          </button>
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

              {/*Prescription heading*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base">Prescription</div>
                <div className="text-[10px] text-gray-500">
                  View and manage your prescription
                </div>
              </div>

              {/*edit */}
              <div className="w-[10%] h-full flex justify-center items-center">
                <button>
                  <CirclePlus strokeWidth={1} onClick={handleButtonClick} />
                </button>
                <input
                  type="file"
                  ref={fileinputRef}
                  onChange={listenFileChanges}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="h-[70%] w-full grid grid-cols-3 p-4 gap-4 overflow-y-scroll">
              {Prescription_URLS?.length > 0 ? (
                Prescription_URLS?.map((items) => (
                  <button
                    key={items}
                    onClick={() => {
                      setSelectedImage(items);
                    }}
                  >
                    <img
                      className="rounded-lg max-h-[100px] min-h-[80px] min-w-[80px] max-w-[100px]"
                      src={items}
                    ></img>
                  </button>
                ))
              ) : (
                <div className="h-full w-full flex items-center justify center text-xl">
                  {" "}
                  no items here
                </div>
              )}
            </div>
          </div>
        </div>
        {SelectedImage ? (
          <div
            className="h-full w-full absolute top-0 left-0 flex flex-col justify-start items-end 
                bg-black/30 backdrop-blur-sm z-50"
          >
            <div className="h-[10%] flex justify-center items-left p-2">
              <button
              className="max-h-[50px] min-w-[50px] rounded-lg flex justify-center items-center"
                onClick={() => {
                  setSelectedImage(null);
                }}
              >
                <X color="white"/>
              </button>
            </div>
            <div className="h-[90%] w-full flex justify-center items-center">
              <img className="h-[70%] p-2 rounded-[20px]" src={SelectedImage} />
            </div>
          </div>
        ) : null}
      </div>
    );
}