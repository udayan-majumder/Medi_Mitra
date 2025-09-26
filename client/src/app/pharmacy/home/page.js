"use client"
import { useState, useEffect } from "react";
import { SidePharmacyNavbar} from "@/Components/sidenavbar.components";
import PharmacyStore from "@/store/pharmacy.store";
import { usePharmaStore } from "@/hooks/usePharmacy.hooks";
import { Map,Marker } from "@vis.gl/react-google-maps";
import toast,{Toaster} from "react-hot-toast";
import { AddnewPharmacyProfile } from "@/services/pharmacy.services";
import { UserStore } from "@/hooks/userauth.hooks";
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
    console.log(e)
  }
}



  return (
    //main container
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins">
      <Toaster />
      {(!Pharmacy_profile?.pharma_id && !Reload) && (
        
        //Main popup div
        <div className="h-full w-full bg-[#0e0e0e8c] absolute z-15 left-0 top-0 flex justify-center items-center backdrop-blur-xl text-black">
          {/*Popup inside box */}
          <div className="h-[60%] w-[25%] bg-white rounded-lg shadow-md flex flex-col justify-start items-center p-2">
            {/*Username Input div */}

            <div className="h-[20%] w-full p-1 flex flex-col justify-center items-start space-y-2">
              <div>Username</div>
              <input
                className="border border-gray-300 p-2 rounded-lg outline-green-300 w-full"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/*Location Input div */}
            <div className="h-[20%] w-full p-1 flex flex-col justify-center items-start space-y-2">
              <div>Location</div>
              <input
                className="border border-gray-300 p-2 rounded-lg outline-green-300 w-full"
                value={Location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCoords((prev)=>(
                    {...prev,location:e.target.value}
                  ))
                }}
              />
            </div>

            {/*Map Div */}
            <div className="h-[50%] w-full p-1 flex flex-col justify-center items-start space-y-2">
              <div>Select Location In Map</div>
              <Map
                style={{ width: "100%", height: "100%", borderRadius: "20px" }}
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

            {/*Done ButtonDiv */}
            <div className="h-[10%] w-full p-1 flex flex-col justify-center items-center space-y-2">
              <button
                className="bg-green-500 p-2 pr-10 pl-10 rounded-lg cursor-pointer text-white hover:bg-green-400 font-medium"
                onClick={handleSubmit}
              >
                Done
              </button>
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