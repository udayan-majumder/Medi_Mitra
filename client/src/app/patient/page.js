"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePatientStore } from "@/hooks/usePatient.hooks";
import { Plus, X, ChevronDown } from "lucide-react";
import DiseasesStore from "@/store/Diseases.store";
import { Map, Marker } from "@vis.gl/react-google-maps";
import toast, { Toaster } from "react-hot-toast";
import { AddnewProfile } from "@/services/patient.services";
import { UserStore } from "@/hooks/userauth.hooks";
import { LanguageStore } from "@/store/Dictionary.store";

export default function App() {
  {
    /*Default hooks */
  }
  const router = useRouter();
  const { User ,LanguageType} = UserStore();
  const { AllProfiles, setcurrentProfileId, setReload,Coords,setCoords } = usePatientStore();
  const { DiseasesList, AllergiesList } = DiseasesStore();
  const  {Language} =LanguageStore()
  {
    /*custom hooks */
  }
  const [Popup, setPopup] = useState(false);
  const [Username, setUsername] = useState("");
  const [Age, setAge] = useState(null);
  const [Diseases, setDiseases] = useState([DiseasesList[0]]);
  const [Allergies, setAllergies] = useState([AllergiesList[0]]);
  const [Location, setLocation] = useState("");
 

  

  const handleSubmit = async (e) => {
    try {
      toast.loading("Creating new profile");
      e.preventDefault();
      if (
        Username.length < 0 ||
        Age === null ||
        location.length <= 0 ||
        !Coords?.lat
      ) {
        toast.dismissAll();
        return toast.error("Invalid or empty field");
      }
      const res = await AddnewProfile(
        User?.id,
        Username,
        Diseases,
        Age,
        Allergies,
        Coords
      );

      if (!res) {
        toast.dismissAll();
        return toast.error("unable to add user");
      }
      toast.dismissAll();
      setReload(true);
      setUsername("");
      setAge(null);
      setDiseases(DiseasesList[0]);
      setAllergies(AllergiesList[0]);
      setLocation("");
      setCoords({});
      setPopup(false);
      return toast.success("profile created successfully");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    //main div
    <div className="absolute h-screen w-full bg-[#0D0D0D] flex justify-center items-center poppins">
      <Toaster />
      {/*Sub div */}
      <div className="h-[90%] w-[95%] flex flex-col justify-start items-center p-4 space-y-2">
        {/*Heading Div */}
        <div className="h-[10%] w-full p-2 text-[30px] ">
          {Language?.[LanguageType]?.welcome}
          <p className="text-base p-1 text-gray-400">
            {Language?.[LanguageType]?.selectProfile}
          </p>
        </div>

        {/*All Profile Show */}
        <div className="h-[90%] w-full p-10 grid grid-cols-2 auto-rows-[120px] gap-1 overflow-y-scroll place-items-center">
          {AllProfiles?.length > 0
            ? AllProfiles?.map((patient) => (
                <button
                  key={patient?.profileid}
                  className="min-h-[100px] min-w-[100px] bg-green-600 rounded-lg active:bg-green-400"
                  onClick={() => setcurrentProfileId(patient?.profileid)}
                >
                  {patient?.name}
                </button>
              ))
            : null}
          <button
            className="min-h-[100px] min-w-[100px] border-[1px] border-gray-100 rounded-lg active:bg-green-400 flex justify-center items-center"
            onClick={() => setPopup(true)}
          >
            <Plus size={40} />
          </button>
        </div>
      </div>

      {/*Pop for add new profile */}
      {Popup ? (
        <div className="absolute h-full w-full bg-black bg-opacity-50 left-0 top-0 flex justify-center items-center backdrop-blur-sm z-50">
          <form
            onSubmit={handleSubmit}
            className="h-[85%] w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col justify-start items-center p-6 relative"
          >
            {/* Header with close button */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0D7136] to-[#7CBD27] rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Create New Profile
                  </h2>
                  <p className="text-sm text-gray-500">
                    Add your medical information
                  </p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                onClick={() => setPopup(false)}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form Container */}
            <div className="w-full flex-1 flex flex-col space-y-6 overflow-y-auto scrollbar-hide">
              {/*Username Input */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                    type="text"
                    onChange={(e) => {
                      e.preventDefault();
                      setUsername(e.target.value);
                    }}
                    value={Username}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Age Input */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                    type="number"
                    placeholder="Enter your age"
                    onChange={(e) => {
                      e.preventDefault();
                      setAge(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Diseases Selection */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diseases
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 bg-white appearance-none hover:border-gray-400 cursor-pointer"
                    onChange={(e) => {
                      e.preventDefault();
                      setDiseases((prev) => [...prev, e.target.value]);
                    }}
                  >
                    <option value="" className="text-gray-500">
                      Select a disease
                    </option>
                    {DiseasesList?.length > 0
                      ? DiseasesList?.map((items) => (
                          <option
                            key={items}
                            value={items}
                            className="text-gray-800"
                          >
                            {items}
                          </option>
                        ))
                      : null}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Allergies Selection */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 bg-white appearance-none hover:border-gray-400 cursor-pointer"
                    onChange={(e) => {
                      e.preventDefault();
                      setAllergies((prev) => [...prev, e.target.value]);
                    }}
                  >
                    <option value="" className="text-gray-500">
                      Select an allergy
                    </option>
                    {AllergiesList?.length > 0
                      ? AllergiesList?.map((items) => (
                          <option
                            key={items}
                            value={items}
                            className="text-gray-800"
                          >
                            {items}
                          </option>
                        ))
                      : null}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Map */}
              <div className="w-full flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Location
                </label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                    placeholder="Enter your location"
                    value={Location}
                    onChange={(e) => {
                      e.preventDefault();
                      setLocation(e.target.value);
                      setCoords((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full h-48 border border-gray-300 rounded-xl overflow-hidden shadow-inner">
                  <Map
                    style={{ width: "100%", height: "100%" }}
                    defaultCenter={{
                      lat: 22.9734,
                      lng: 78.6569,
                    }}
                    defaultZoom={6}
                    gestureHandling="greedy"
                    disableDefaultUI
                    onClick={(e) => {
                      setCoords({
                        lat: e?.detail?.latLng?.lat,
                        lng: e?.detail?.latLng?.lng,
                        location: Location,
                      });
                    }}
                  >
                    <Marker position={Coords}></Marker>
                  </Map>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click on the map to set your exact location
                </p>
              </div>

              {/* Submit Button */}
              <div className="w-full pt-4">
                <button
                  className="w-full bg-gradient-to-r from-[#0D7136] to-[#7CBD27] text-white py-3 px-6 rounded-xl font-medium hover:from-[#0D7136] hover:to-[#4CAF50] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  type="submit"
                >
                  <Plus className="w-5 h-5" />
                  Create Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
