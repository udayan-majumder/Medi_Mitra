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
  UserRound,
  MapPin,
  Check,
  X,
  MapPlus
} from "lucide-react";
import DiseasesStore from "@/store/Diseases.store";
import { Map, Marker } from "@vis.gl/react-google-maps";
export default function RegisterPage() {
  {
    /*Store variables */
  }
  const { LanguageType, setLanguageType } = UserStore();
  const { Language } = LanguageStore();
  const { IsMobileView } = CapacitorInfoStore();
  const { DiseasesList } = DiseasesStore();
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
  const [Age, setAge] = useState(18);
  const [showPassword, setshowPassword] = useState(false);
  const [showRePassword, setshowRePassword] = useState(false);
  const [showMap, setshowMap] = useState(false);
  const [Coords, setCoords] = useState({});

  const router = useRouter();

  useEffect(() => {
    if (
      UserType !== "patient" &&
      (LanguageType === "hindi" || LanguageType === "punjabi")
    ) {
      setLanguageType("english");
    }
  }, [UserType, LanguageType]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Password !== RePassword) {
        return toast.error(Language?.[LanguageType]?.PasswordMismatch);
      }

      if(!Coords?.lat || !Coords?.lng){
        return toast.error("Select map for location")
      }

      if (UserType === "patient") {
        if (DiseasesType.length <= 0 || Age === null || Age <= 0 || Age <= 18) {
          return toast.error(Language?.[LanguageType]?.AllFieldsMandatory);
        }
      }

      toast.loading(Language?.[LanguageType]?.Registering);
      const res = await RegisterHandler(
        Username,
        Email,
        Password,
        Location,
        UserType,
        DiseasesType,
        Age,
        Coords
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
            <div className="relative space-x-2">
              {Location.length > 0 ? null : (
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
              <button
                className="h-[70%] w-[40px] absolute right-1 top-2 bg-green-400 rounded-lg flex justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setshowMap(true);
                }}
              >
                <MapPlus color="white" strokeWidth={1.2}/>
              </button>
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

            {/*Diseases and Age Div */}

            {UserType === "patient" ? (
              <div className="w-full h-[10%] flex justify-center items-center text-gray-900 space-x-5 ">
                <select
                  className="w-[60%] text-sm border-gray-300 border p-2 rounded-lg"
                  onChange={(e) => {
                    e.preventDefault();
                    if (!DiseasesType?.includes(e.target.value)) {
                      setDiseasesType((prev) => [...prev, e.target.value]);
                    }
                    console.log(DiseasesType);
                  }}
                >
                  <option value="" disabled>
                    Medical Condition
                  </option>
                  {DiseasesList.map((item, index) => (
                    <option
                      key={index}
                      value={item}
                      className={
                        DiseasesType?.includes(item)
                          ? "bg-green-500 text-white"
                          : ""
                      }
                    >
                      {item}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={Age}
                  placeholder={Language?.[LanguageType]?.agetext}
                  className="w-[20%] p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    e.preventDefault();
                    setAge(e.target.value);
                  }}
                ></input>
              </div>
            ) : (
              <div></div>
            )}

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

      {showMap ? (
        <div className="h-full w-full absolute top-0 right-0 flex flex-col space-y-2 backdrop-blur-sm">
          <button
            className="h-[5%] w-[10%] sm:h-[5%] sm:w-[3%] bg-red-500 m-2 text-black flex items-center justify-center rounded-lg"
            onClick={() => {
              setshowMap(false);
            }}
          >
            <X color="white" strokeWidth={2}/>
          </button>
          <Map
            defaultZoom={5}
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }} // India center
            style={{ width: "100%", height: "85%" }}
            onClick={(e) => handleMapEvent(e)}
          >
            <Marker position={Coords} />
          </Map>
          <div className="h-[5%] w-full flex justify-center items-center space-x-3">
            <button
              className="h-[90%] min-w-[200px] bg-red-500 cursor-pointer rounded-lg"
              onClick={() => {
                navigator.geolocation.getCurrentPosition((pos) => {
                  setCoords({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  });
                });
              }}
            >
              {Language?.[LanguageType]?.CurrentLocation}
            </button>
            <button
              className="h-[90%] min-w-[200px] bg-green-500 cursor-pointer rounded-lg"
              onClick={() => {
                setshowMap(false);
              }}
            >
              {Language?.[LanguageType]?.Done}
            </button>
          </div>
        </div>
      ) : null}
      {/* <div>this is login page testing {Language?.[LanguageType]?.username} : {LanguageType} language</div> */}
    </div>
  );
}
