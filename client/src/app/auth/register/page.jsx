"use client";
import { useState, useEffect } from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionary.store";
import CapacitorInfoStore from "@/store/capacitorInfo.store";
import { useRouter } from "next/navigation";
import { RegisterHandler } from "@/services/user.services";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Eye,
  EyeOff,
  Lock,

} from "lucide-react";

export default function RegisterPage() {
  {
    /*Store variables */
  }
  const { LanguageType, setLanguageType } = UserStore();
  const { Language } = LanguageStore();
  {
    /*Custom Hooks */
  }
 
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [UserType, setUserType] = useState("patient");
  const [showPassword, setshowPassword] = useState(false);
  const [showRePassword, setshowRePassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (
      UserType !== "patient" &&
      (LanguageType === "hindi" || LanguageType === "punjabi")
    ) {
      setLanguageType("english");
    }
  }, [UserType, LanguageType]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Password !== RePassword) {
        return toast.error(Language?.[LanguageType]?.PasswordMismatch);
      }

      toast.loading(Language?.[LanguageType]?.Registering);
      const res = await RegisterHandler(
        Email,
        Password,
        UserType
      );

      if (res?.errortype) {
        toast.dismissAll();
        return toast.error(Language?.[LanguageType]?.InvalidEmailPassword);
      }

      if (res?.status === 200) {
        toast.dismissAll();
        toast.success(Language?.[LanguageType]?.UserRegisteredSuccess);

        setTimeout(() => {
          router.replace("/auth/login");
        }, 1500);
      }
    } catch (e) {
      toast.dismissAll();
      toast.error(Language?.[LanguageType]?.SomethingWentWrong);
    }
  };

  const handleMapEvent = (e) => {
    setCoords({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  return (
    <div className="h-screen w-full bg-white flex sm:flex-row flex-col items-center poppins tracking-wide relative ">
      <Toaster />
      {/*image vector green curve */}
      <div className="h-[20%] sm:h-full w-full sm:w-[40%]">
        <img
          src="/green-arc-desktop.png"
          className="h-screen w-full hidden sm:flex"
        />
        <img
          src="/arc-mobile-view.png"
          className="h-full w-full flex sm:hidden"
        />
      </div>

      {/* Login Box */}
      <div className="h-[80%] sm:h-full w-full sm:w-[60%] flex justify-center items-center poppins">
        <div className="h-full sm:h-[95%] w-full sm:w-[50%] bg-white rounded-none sm:rounded-xl shadow-xl p-8 flex flex-col justify-center items-center space-y-5">
          {/*Medicare Logo */}
          <img src="/logo.png" className="h-20" />
          <button
            className="text-gray-500 text-center text-sm cursor-pointer hover:text-black border-b border-gray-300 hover:border-b-1"
            onClick={() => {
              router.push("/auth/login");
            }}
          >
            {Language?.[LanguageType]?.signupheading}
          </button>

          {/*Input Button Container */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3  flex flex-col justify-center items-center w-[90%]"
          >
            {/* name input container */}
            

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
                type={showPassword ? "text" : "password"}
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={Language?.[LanguageType]?.Password}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  
               focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />

              {
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    showPassword
                      ? setshowPassword(false)
                      : setshowPassword(true);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              }
            </div>

            {/* re-Password Input Container*/}
            <div className="relative space-x-2">
              {RePassword.length > 0 ? null : (
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}

              <input
                type={showRePassword ? "text" : "password"}
                value={RePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder={Language?.[LanguageType]?.repasswordtext}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  
               focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />

              {
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={(e) => {
                    e.preventDefault();
                    showRePassword
                      ? setshowRePassword(false)
                      : setshowRePassword(true);
                  }}
                >
                  {showRePassword ? <Eye /> : <EyeOff />}
                </button>
              }
            </div>

            {/* location input container */}
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
                    e.preventDefault();
                    setUserType("patient");
                  }}
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
                    e.preventDefault();
                    setUserType("doctor");
                  }}
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
                    e.preventDefault();
                    setUserType("pharmacy");
                  }}
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
              {Language?.[LanguageType]?.signupbtn}
            </button>
          </form>
          <div className=" flex justify-center items-center h-[5%] w-full">
            <button
              onClick={(e) => {
                e.preventDefault();

                setLanguageType("english");
              }}
              className={
                LanguageType === "english"
                  ? "rounded-xl bg-green-700 w-[20%] h-[90%]"
                  : "text-gray-500 hover:text-gray-700 w-[20%] h-[90%]"
              }
            >
              {Language?.[LanguageType]?.englishtext}
            </button>
            {UserType === "patient" ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLanguageType("hindi");
                }}
                className={
                  LanguageType === "hindi"
                    ? "rounded-xl bg-green-700 w-[20%] h-[90%]"
                    : "text-gray-500 hover:text-gray-700 w-[20%] h-[90%]"
                }
              >
                {Language?.[LanguageType]?.hinditext}
              </button>
            ) : null}
            {UserType === "patient" ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLanguageType("punjabi");
                }}
                className={
                  LanguageType === "punjabi"
                    ? "rounded-xl bg-green-700 w-[20%] h-[90%]"
                    : "text-gray-500 hover:text-gray-700 w-[20%] h-[90%]"
                }
              >
                {Language?.[LanguageType]?.punjabtext}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div> */}
    </div>
  );
}
