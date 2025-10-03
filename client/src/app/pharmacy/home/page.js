"use client"
import { useState, useEffect } from "react";
import { SidePharmacyNavbar} from "@/Components/sidenavbar.components";
import PharmacyStore from "@/store/pharmacy.store";
import { usePharmaStore } from "@/hooks/usePharmacy.hooks";
import { Map,Marker } from "@vis.gl/react-google-maps";
import toast,{Toaster} from "react-hot-toast";
import { AddnewPharmacyProfile } from "@/services/pharmacy.services";
import { UserStore } from "@/hooks/userauth.hooks";
import { Store, MapPin, Building2, CheckCircle } from "lucide-react";

export default function Home() {
 {/*Custom hooks */}
const [Username,setUsername] = useState("")
const [Coords,setCoords] = useState({})
const  [Location,setLocation] = useState("")

  {/*Default hooks */}
  // Get total stock from your pharmacy store
  const { MedicineInventory } = PharmacyStore();
  const {Pharmacy_profile,setPharmacy_profile,Reload,setReload} = usePharmaStore()
  const {User} = UserStore()

useEffect(()=>{
  navigator.geolocation.getCurrentPosition((position)=>{
    setCoords({
      lat:position?.coords?.latitude,
      lng:position?.coords?.longitude,
      location:Location
    })
  })

},[])



const handleSubmit = async()=>{
  try{
   toast.loading("Processing")
   if(Username.length<=0 || !Coords?.lat || Location.length<=0){
    toast.dismissAll();
    return toast.error("Missing Fields")
   }
   
   const res = await AddnewPharmacyProfile(User?.id,Username,Coords)
   if(!res){
    toast.dismissAll()
    return toast.error("Unable to add details")
   }
   toast.dismissAll()
   setReload(true)
   toast.success("Details added succesfully")
  }catch(e){
    console.error(e)
  }
}



  return (
    //main container
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins">
      <Toaster />
      {(!Pharmacy_profile?.pharma_id && !Reload) && (
        
        //Main popup div
        <div className="h-full w-full bg-black bg-opacity-50 absolute z-15 left-0 top-0 flex justify-center items-center backdrop-blur-sm">
          {/*Popup inside box */}
          <div className="h-[70%] w-[90%] max-w-md bg-white rounded-2xl shadow-2xl flex flex-col justify-start items-center p-6 relative">
            {/* Header with close button */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0D7136] to-[#7CBD27] rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Setup Pharmacy Profile</h2>
                  <p className="text-sm text-gray-500">Complete your pharmacy information</p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="w-full flex-1 flex flex-col space-y-6">
              {/*Username Input div */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy Name</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                    placeholder="Enter your pharmacy name"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Store className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/*Location Input div */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#0D7136] focus:ring-2 focus:ring-[#0D7136] focus:ring-opacity-20 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                    placeholder="Enter your pharmacy location"
                    value={Location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setCoords((prev)=>(
                        {...prev,location:e.target.value}
                      ))
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/*Map Div */}
              <div className="w-full flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Location on Map</label>
                <div className="w-full h-48 border border-gray-300 rounded-xl overflow-hidden shadow-inner">
                  <Map
                    style={{ width: "100%", height: "100%" }}
                    defaultCenter={Coords?.lat ? Coords : { lat: 22.0, lng: 24.0 }}
                    defaultZoom={6}
                    gestureHandling="greedy"
                    disableDefaultUI
                    onClick={(e) => {
                      setCoords({
                        lat: e.detail.latLng.lat,
                        lng: e.detail.latLng.lng,
                        location: Location,
                      });
                    }}
                  >
                    <Marker
                      position={Coords?.lat ? Coords : { lat: 22.0, lng: 24.0 }}
                    />
                  </Map>
                </div>
                <p className="text-xs text-gray-500 mt-1">Click on the map to set your exact location</p>
              </div>

              {/*Done ButtonDiv */}
              <div className="w-full pt-4">
                <button
                  className="w-full bg-gradient-to-r from-[#0D7136] to-[#7CBD27] text-white py-3 px-6 rounded-xl font-medium hover:from-[#0D7136] hover:to-[#4CAF50] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*Side Navbar */}
      <SidePharmacyNavbar height={100} width={20} />

      {/*Content Container*/}
      <div className="h-full w-[80%] flex flex-col justify-start items-center bg-white">
        {/*Logo div*/}
        <div className="h-[12%] w-full flex justify-end items-center p-[20px] text-black">
          <img src="/logo.png" className="h-full"></img>
        </div>

        {/*Stock Heading Div*/}
        <div className="h-[15%] w-full flex flex-col justify-center items-start px-[40px]">
          <div className="text-black text-[35px] font-medium">
            Total Stock Available:
          </div>
          <div className="bg-gradient-to-b from-[#7CBD27] via-[#378E31] to-[#0D7136] bg-clip-text text-transparent text-[70px] font-semibold -mt-2">
            {MedicineInventory?.totalstock?.[0]?.totalquantity || 0}
          </div>
        </div>

        {/*Main Content Area*/}
        <div className="h-[73%] w-full flex justify-center items-center">
          <div className="h-[95%] w-[98%] flex justify-center items-center">
            {/* Circular Background with Truck Image */}
            <div className="relative flex justify-center items-center">
              {/* Large outer circular background */}
              <div className="w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-green-100 rounded-full opacity-30 absolute"></div>

              {/* Medium circular background */}
              <div className="w-[400px] h-[400px] bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-50 absolute"></div>

              {/* Inner circular background - main container */}
              <div className="w-[350px] h-[350px] bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center shadow-xl relative z-10">
                {/* Supply truck image */}
                <img
                  src="/truck-supply-vector.png"
                  alt="Supply Truck Vector"
                  className="w-[280px] h-[280px] object-contain drop-shadow-lg"
                />
              </div>

              {/* Decorative animated dots around the circle */}
              <div className="absolute w-3 h-3 bg-green-400 rounded-full top-16 left-32 animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-green-500 rounded-full top-32 right-16 animate-pulse delay-300"></div>
              <div className="absolute w-4 h-4 bg-green-300 rounded-full bottom-20 left-20 animate-pulse delay-700"></div>
              <div className="absolute w-2 h-2 bg-green-600 rounded-full bottom-32 right-32 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}