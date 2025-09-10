"use client"
import { useState } from "react";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionary.store";
import CapacitorInfoStore from "@/store/capacitorInfo.store";
import { useRouter } from "next/navigation";
import { RegisterHandler } from "@/services/user.services";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Eye, EyeOff,Lock, UserRound , MapPin  } from "lucide-react";

export default function RegisterPage() {
  {
    /*Store variables */
  }
  const { LanguageType, setUser,setLanguageType,User} = UserStore();
  
  const { Language } = LanguageStore();
  const { IsMobileView } = CapacitorInfoStore();

  {
    /*Custom Hooks */
  }
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [Location, setLocation] = useState("");
  const [UserType, setUserType] = useState("patient");
  const [DiseasesType, setDiseasesType] = useState([]);
  const [Age, setAge] = useState(null);
  const [showPassword, setshowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Password !== RePassword) {
        return toast.error("Password Don't Match");
      }
      if (UserType === "patient") {
        if (DiseasesType.length <= 0 || Age === null || Age <= 0) {
          return toast.error("All fields are mandatory");
        }
      }
      toast.loading("Registering");
      const res = await RegisterHandler(
        Username,
        Email,
        Password,
        Location,
        UserType,
        DiseasesType,
        Age
      );
      if (res?.errortype) {
        toast.dismissAll();
        return toast.error("Invalid email/password ");
      }

      if (res?.status === 200) {
        toast.dismissAll();
        toast.success("User Registered Successfully");

        setTimeout(() => {
          router.replace("/auth/login");
        }, 1500);
      }
    } catch (e) {
      toast.dismissAll();
      toast.error("Something went wrong");
    }
  };
  {
    /*Important --- Kaushani Form Use Krbi ... dekh Login er Design change korechi div er jai form use krbi 
    and e.preventDefault() use krbi jate reload na hoi jai baki sob setup kore diechi */
  }
  return(
     <div className="h-screen w-full bg-white flex sm:flex-row flex-col items-center poppins tracking-wide">
      <Toaster/>
      {/*image vector green curve */}
      <div className="h-[20%] sm:h-full w-full sm:w-[40%]">
        <img src="/green-arc-desktop.png" className="h-screen w-full hidden sm:flex" />
        <img src="/arc-mobile-view.png" className="h-full w-full flex sm:hidden" />
      </div>

      {/* Login Box */}
      <div className="h-[80%] sm:h-full w-full sm:w-[60%] flex justify-center items-center poppins">
        <div className="h-full sm:h-[95%] w-full sm:w-[50%] bg-white rounded-none sm:rounded-xl shadow-xl p-8 flex flex-col justify-center items-center space-y-5">
          {/*Medicare Logo */}
          <img src="/logo.png" className="h-20" />
          <button className="text-gray-500 text-center text-sm cursor-pointer hover:text-black hover:border-b-1" onClick={()=>{
            router.push("/auth/register")
          }}>
            {Language?.[LanguageType]?.signupheading}
          </button>

          {/*Input Button Container */}
          <form onSubmit={handleSubmit} className="space-y-3  flex flex-col justify-center items-center w-[90%]">
            {/* name input container */}
             <div className="relative space-x-2">
              {Username.length > 0 ? null : (
                <UserRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <input
                type="text"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={Language?.[LanguageType]?.usernametext}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
                required
              />
            </div>
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
                  onClick={(e)=> {
                    e.preventDefault()
                    showPassword ? setshowPassword(false) : setshowPassword(true)}}
                >
                  {showPassword ? <Eye/> : <EyeOff/>}
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
                type={showPassword ? "text" : "password"}
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
                  onClick={(e)=> {
                    e.preventDefault()
                    showPassword ? setshowPassword(false) : setshowPassword(true)}}
                >
                  {showPassword ? <Eye/> : <EyeOff/>}
                </button>
              }
            </div>

             {/* location input container */}
             <div className="relative space-x-2">
              {location.length > 0 ? null : (
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <input
                type="text"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={Language?.[LanguageType]?.locationtext}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm  focus:border-green-700 focus:ring-1 focus:ring-green-500 text-gray-800 pl-10 outline-none"
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
            
            {UserType==="patient" ? <div className="w-full h-[10%] flex justify-center items-center text-gray-900 space-x-5 ">
              <select className="w-[60%] text-sm border-gray-300 border p-2 rounded-lg">
                <option disabled> Medical Condition </option>
                <option value={"Diabetes (Type 1 & Type 2)"}> Diabetes (Type 1 & Type 2) </option>
                <option value={"Hypertension (High Blood Pressure)"}>Hypertension (High Blood Pressure)</option>
                <option value={"Asthma"}>Asthma</option>
                <option value={"Chronic Obstructive Pulmonary Disease (COPD)"}>Chronic Obstructive Pulmonary Disease (COPD)</option>
                <option value={"Arthritis (Rheumatoid / Osteoarthritis)"}>Arthritis (Rheumatoid / Osteoarthritis)</option>
                <option value={"HIV/AIDS"}>HIV/AIDS</option>
                <option value={"Chronic Kidney Disease"}>Chronic Kidney Disease</option>
                <option value={"Coronary Artery Disease / Heart Disease"}> Coronary Artery Disease / Heart Disease</option>
                <option value={"Parkinson’s Disease"}>Parkinson’s Disease</option>
                <option value={"Alzheimer’s Disease (Dementia)"}>Alzheimer’s Disease (Dementia)</option>
              </select>
              <input type="number" placeholder={Language?.[LanguageType]?.agetext} className="w-[20%] p-2 border border-gray-300 rounded-lg"></input>
            </div>: <div></div>}

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
           <div className=" flex justify-center items-center h-[5%] w-full">
                    <button
                  onClick={(e) => {
                     e.preventDefault()
                    
                    setLanguageType("english")}}
                  className={LanguageType==="english"? "rounded-xl bg-green-700 w-[20%] h-[90%]" : "text-gray-500 hover:text-gray-700 w-[20%] h-[90%]"}
                >
                  {Language?.[LanguageType]?.englishtext}
                </button>

                <button
                  onClick={(e) => {
                     e.preventDefault()
                    setLanguageType("hindi")}}
                  className={LanguageType==="hindi"? "rounded-xl bg-green-700 w-[20%] h-[90%]" : "text-gray-500 hover:text-gray-700 w-[20%] h-[90%]"}
                >
                   {Language?.[LanguageType]?.hinditext}
                </button>
            </div>
        </div>
      </div>

      {/* <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div> */}
    </div>
  ) ;
}
