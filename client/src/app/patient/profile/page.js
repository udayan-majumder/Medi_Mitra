"use client"

import { useState,useEffect, useRef } from "react";
import { LanguageStore } from "@/store/Dictionary.store";
import { UserStore } from "@/hooks/userauth.hooks";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  UserRoundCog,
  Calendar,
  MapPin,
  ClipboardPlus,
  ClipboardList,
  CirclePlus,
  LogOut,
  X,
  RefreshCcw,
} from "lucide-react";
import { UploadPatientPescription, LogoutHandler } from "@/services/user.services";
import toast, { Toaster } from "react-hot-toast";
import { usePatientStore } from "@/hooks/usePatient.hooks";

export default function CheckPatientProfile(){
{/*Default hooks */}
const {Language} = LanguageStore()
const {LanguageType,User,setUser} = UserStore()
const {PatientProfile,setReload,setcurrentProfileId} = usePatientStore()
const router = useRouter()

{/*custom hooks */}
const fileinputRef = useRef(null)
const [SelectedImage,setSelectedImage] = useState(null)

const handleButtonClick = ()=>{
    fileinputRef.current.click()
}

const listenFileChanges = async (e) => {
  try {
    toast.loading(Language?.[LanguageType]?.Uploading);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userid", User?.id);
    formData.append("profileid",PatientProfile?.profileid)

    const res = await UploadPatientPescription(formData);

    if (!res) {
      toast.dismissAll();
      return toast.error(Language?.[LanguageType]?.FileUploadFailed);
    }

    setReload(true)
    toast.dismissAll();
    toast.success(Language?.[LanguageType]?.FileUploadSuccess);

    e.target.value = null;
  } catch (e) {
    toast.dismissAll();
    toast.error(Language?.[LanguageType]?.FileUploadFailed);
    console.log(e);
  }
};

const handleLogout = async () => {
    try {
        toast.loading(Language?.[LanguageType]?.LoggingOut);
        const logoutSuccess = await LogoutHandler();
        if (logoutSuccess) {
            toast.dismissAll();
            toast.success(Language?.[LanguageType]?.LogoutSuccess);
            localStorage.removeItem("languagetype");
            localStorage.removeItem("profileid")
            setTimeout(() => {
                setUser(null);
                router.push("/auth/login");
            }, 1500);
        } else {
            toast.dismissAll();
            toast.error(Language?.[LanguageType]?.LogoutFailed);
        }
    } catch (error) {
        toast.dismissAll();
        toast.error(Language?.[LanguageType]?.LogoutError);
        console.error("Logout error:", error);
    }
};

const handleSwitchProfile = ()=>{
  localStorage.removeItem("profileid")
  setcurrentProfileId(null)
  router.replace("/patient")
}

    return (
      //main div
      <div className="h-full w-full space-y-8 poppins bg-gray-900 text-white pt-12">
        <Toaster position="top-center" />
        {/*Heading Navbar */}
        <div className="h-[8%] w-full flex justify-between items-center p-4">
          <div className="flex items-center px-2 space-x-2">
            {/* <button>
              <ChevronLeft />
            </button> */}
            <div className="text-xl">{Language?.[LanguageType]?.profile}</div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSwitchProfile}
              className="flex items-center space-x-2 border border-gray-300 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <RefreshCcw size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">
                Switch
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm font-medium">
                {Language?.[LanguageType]?.LogOut}
              </span>
            </button>
          </div>
        </div>

        {/*User Profile */}
        <div className="h-[10%] w-full flex justify-center items-center">
          <div className="h-full w-[90%] rounded-lg bg-gray-800 flex">
            {/*User Icon */}
            <div className=" h-full w-[20%] flex justify-center items-center p-1">
              <div className="h-[80%] w-[90%] bg-gray-600 rounded-[100px] flex justify-center items-center">
                <UserRoundCog size={40} strokeWidth={1} color="white" />
              </div>
            </div>

            {/*UserName */}
            <div className="h-full w-[60%] flex flex-col justify-center">
              <div className="text-base text-white">{PatientProfile?.name}</div>
              <div className="text-xs text-gray-300">{User?.email}</div>
            </div>

            {/*edit */}
            <div></div>
          </div>
        </div>

        {/*User Details */}
        <div className="h-[30%] w-full flex flex-col justify-center items-center ">
          <div className="h-full w-[90%] flex flex-col justify-center items-center bg-gray-800 rounded-lg">
            {/*Age Div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <Calendar size={40} strokeWidth={1} color="white" />
              </div>

              {/*Age*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base text-white">
                  {Language?.[LanguageType]?.age}
                </div>
                <div className="text-xs text-gray-300">
                  {PatientProfile?.age}
                </div>
              </div>

              {/*edit */}
              <div></div>
            </div>

            {/*Locatin Div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <MapPin size={40} strokeWidth={1} color="white" />
              </div>

              {/*UserName */}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base text-white">
                  {Language?.[LanguageType]?.location}
                </div>
                <div className="text-xs text-gray-300">
                  {PatientProfile?.coordinates?.location}
                </div>
              </div>

              {/*edit */}
              <div></div>
            </div>

            {/*Medical Condition div */}
            <div className="h-[30%] w-[95%] flex space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <ClipboardPlus size={40} strokeWidth={1} color="white" />
              </div>

              {/*Medical Condition*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base text-white">
                  {Language?.[LanguageType]?.medicalCondition}
                </div>
                <div className="text-[9px] text-gray-300">
                  {PatientProfile?.diseases?.map((items) => items)}
                </div>
              </div>

              {/*edit */}
              <div></div>
            </div>
          </div>
        </div>

        {/*Pescription Div */}
        <div className="h-[50%] w-full flex justify-center items-start ">
          <div className="h-[70%] w-[90%] bg-gray-800 rounded-lg">
            <div className="h-[30%] w-[95%] flex justify-center items-center space-x-3">
              {/*Icon */}
              <div className=" h-full w-[15%] flex justify-center items-center p-1">
                <ClipboardList size={40} strokeWidth={1} color="white" />
              </div>

              {/*Prescription heading*/}
              <div className="h-full w-[60%] flex flex-col justify-center">
                <div className="text-base text-white">
                  {Language?.[LanguageType]?.prescription}
                </div>
                <div className="text-[10px] text-gray-300">
                  {Language?.[LanguageType]?.viewAndManagePrescription}
                </div>
              </div>

              {/*edit */}
              <div className="w-[10%] h-full flex justify-center items-center">
                <button>
                  <CirclePlus
                    strokeWidth={1}
                    color="white"
                    onClick={handleButtonClick}
                  />
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
              {PatientProfile?.prescriptions?.length > 0 ? (
                PatientProfile?.prescriptions?.map((items) => (
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
                <div className="h-full w-full flex items-center justify center text-xl text-white">
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
                bg-black/50 backdrop-blur-sm z-50 pt-12"
          >
            <div className="h-[10%] flex justify-center items-left p-2">
              <button
                className="max-h-[50px] min-w-[50px] rounded-lg flex justify-center items-center bg-gray-800 hover:bg-gray-700"
                onClick={() => {
                  setSelectedImage(null);
                }}
              >
                <X color="white" />
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