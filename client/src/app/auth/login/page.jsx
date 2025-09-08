"use client";

import React from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionary.store";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation";
import { LoginHandler } from "@/services/user.services";
import toast,{Toaster} from "react-hot-toast";
import CapacitorInfoStore from "@/store/capacitorInfo.store";

export default function LoginPage() {
  {/*Store variables */}
  const { LanguageType,setUser } = UserStore();
  const { Language } = LanguageStore();
  const {IsMobileView} =CapacitorInfoStore()

  {/*Custom Hooks */}
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [UserType, setUserType] = useState("patient");
  const router = useRouter()

  
  const handleSubmit = async(e) =>{
    e.preventDefault()
    try{
      toast.loading("authenticating")
      const res = await LoginHandler(Email,Password,UserType)
      
      if(res?.errortype){
        toast.dismissAll()  
        return toast.error("invalid email / password")
      }
       
        setTimeout(()=>{
       toast.dismissAll()  
       toast.success("Login succesfull") 
       },1000)

       setTimeout(()=>{
       setUser(res)
       },2000)
      
    }
    catch(e){
      console.log(e)
    }
  }

  return (
    <div className="h-screen w-full bg-white flex sm:flex-row flex-col items-center poppins tracking-wide">
      <Toaster/>
      {/*image vector green curve */}
      <div className="h-[20%] sm:h-full w-full sm:w-[40%]">
        <img src="/green-arc-desktop.png" className="h-screen w-full" />
      </div>

      {/* Login Box */}
      <div className="h-[80%] sm:h-full w-full sm:w-[60%] flex justify-center items-center poppins">
        <div className="h-full sm:h-[70%] w-full sm:w-[50%] bg-white rounded-none sm:rounded-xl shadow-xl p-8 flex flex-col justify-center items-center space-y-5">
          {/*Medicare Logo */}
          <img src="/logo.png" className="h-24" />
          <button className="text-gray-500 text-center text-sm cursor-pointer hover:text-black hover:border-b-1" onClick={()=>{
            router.push("/auth/register")
          }}>
            {Language?.[LanguageType]?.loginheading}
          </button>

          {/*Input Button Container */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 flex flex-col justify-center items-center w-[90%]">
            {/* Email Input Container*/}
            <div className="relative space-x-2">
              {Email.length > 0 ? null : (
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <input
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={Language?.[LanguageType]?.EmailID}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />
            </div>

            {/* Password Input Container*/}
            <div className="relative space-x-2">
              {Password.length > 0 ? null : (
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}

              <input
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={Language?.[LanguageType]?.Password}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  
               focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />
            </div>

            {/* Forgot Password*/}
            <div className="flex justify-end mt-2">
              <a
                href="#"
                onClick={() => console.log("Forgot password clicked")}
                className="text-sm text-green-600 hover:underline cursor-pointer"
              >
                {Language?.[LanguageType]?.forgotpassword}
              </a>
            </div>

            {/* Toggle usertype*/}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-center items-center">
                <button
                  onClick={(e) => {
                     e.preventDefault()
                    setUserType("patient")}}
                  className={`flex px-4 py-2 text-sm font-medium cursor-pointer ${
                    UserType === "patient"
                      ? " rounded-b-xl bg-green-700 rounded-t-xl"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {Language?.[LanguageType]?.patient}
                </button>

                <button
                  onClick={(e) => {
                     e.preventDefault()
                    setUserType("doctor")}}
                  className={`flex px-4 py-2 text-sm font-medium cursor-pointer ${
                    UserType === "doctor"
                      ? "rounded-b-xl bg-green-700 rounded-t-xl"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {Language?.[LanguageType]?.doctor}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setUserType("pharmacy")}}
                  className={`flex px-4 py-2 text-sm font-medium cursor-pointer ${
                    UserType === "pharmacy"
                      ? "rounded-b-xl bg-green-700 rounded-t-xl"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {Language?.[LanguageType]?.pharmacy}
                </button>
              </div>
            </div>

            <button className="bg-green-700 h-9 w-28 rounded-2xl poppins">
              {Language?.[LanguageType]?.loginbtn}
            </button>
          </form>
        </div>
      </div>

      {/* <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div> */}
    </div>
  );
}
