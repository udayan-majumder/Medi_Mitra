"use client";

import React from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionarystore";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { LanguageType } = UserStore();
  const { Language } = LanguageStore();

  const [emailIcon, setEmailIcon] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [activeTab, setActiveTab] = useState("tab-1");
  return (
    <div className="h-screen w-full bg-white flex flex-row items-center poppins tracking-wide">
      {/*image vector green curve */}
      <div>
        <img src="/green-arc-desktop.png" className="h-screen w-sm" />
      </div>

      {/* Login Box */}
      <div className="h-full w-[50%] flex justify-center items-center poppins">
        <div className=" h-[70%] w-full max-w-md bg-white rounded-xl shadow-md p-8 flex flex-col justify-center items-center space-y-5">
          {/*Medicare Logo */}
          <img src="/logo.png" className="h-24" />
          <p className="text-gray-500 text-center text-sm">
            {Language?.[LanguageType]?.loginheading}
          </p>

          {/*Input Button Container */}
          <div className="mt-6 space-y-4 flex flex-col justify-center items-center w-70">
            {/* Email Input Container*/}
            <div className="relative space-x-2">
              {emailIcon.length > 0 ? null : (
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <input
                type="email"
                value={emailIcon}
                onChange={(e) => setEmailIcon(e.target.value)}
                placeholder={Language?.[LanguageType]?.EmailID}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />
            </div>

            {/* Password Input Container*/}
            <div className="relative space-x-2">
              {passwordValue.length > 0 ? null : (
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}

              <input
                type="password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
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
                  onClick={() => setActiveTab("tab-1")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "tab-1"
                      ? " rounded-b-xl bg-green-700 rounded-t-xl"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {Language?.[LanguageType]?.patient}
                </button>

                <button
                  onClick={() => setActiveTab("tab-2")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "tab-2"
                      ? "rounded-b-xl bg-green-700 rounded-t-xl"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {Language?.[LanguageType]?.doctor}
                </button>
                <button
                  onClick={() => setActiveTab("tab-3")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "tab-3"
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
          </div>
        </div>
      </div>

      {/* <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div> */}
    </div>
  );
}
