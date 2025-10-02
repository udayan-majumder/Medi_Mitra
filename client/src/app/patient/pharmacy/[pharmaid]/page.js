"use client"

import { useParams } from "next/navigation";
import PharmacyStore from "@/store/pharmacy.store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import { ChevronLeft, Search, Store, MapPinCheck, MapPinX, X } from "lucide-react";
import { FetchPharmacyDetails, GetPharamacyStock } from "@/services/pharmacy.services";
import { LanguageStore } from "@/store/Dictionary.store";
import { Map ,Marker} from "@vis.gl/react-google-maps";
import MedicalLoader from "@/Components/MedicalLoader";
import { usePatientStore } from "@/hooks/usePatient.hooks";

export default function PharmacyStockpage(){
{/*default hooks */}
const {PharmacyList,MedicineInventory,setMedicineInventory} = PharmacyStore()
const { pharmaid } = useParams();
const {User,LanguageType} = UserStore()
const  {PatientProfile} = usePatientStore()
const router = useRouter()
const {Language} = LanguageStore()

{/*Custom hook */}
const [currentProfile, setCurrentProfile] = useState([])
const  [currentProfileDetails,setCurrentProfileDetails] = useState([])
const  [SearchParam,setSearchParam] = useState(null)
const   [MapShow,setMapShow] = useState(false)


useEffect(()=>{
    if(PharmacyList?.length<=0){
     router.push("/patient/pharmacy")
    }
    const res = PharmacyList?.find((items)=> items?.id === Number(pharmaid))
    setCurrentProfile(res)
    setMedicineInventory([])
},[])
   
useEffect(()=>{
if(currentProfile?.id){
    FetchStock()
}
},[currentProfile])



const FetchStock = async()=>{
    try{
       const res = await GetPharamacyStock(currentProfile?.id)
       const newres = await FetchPharmacyDetails(currentProfile?.id)
       
       if(!res){
        setMedicineInventory([])
       }
       if(!newres?.isPharmacy){
        router.push("/patient/pharmacy")
       }
       setMedicineInventory(res?.data?.list)
       setCurrentProfileDetails(newres?.isPharmacy)
    }catch(e){
    console.error(e)
    }
}
const handleSubmit = async(e) =>{

}



    return (
      //main div
      <div className="h-screen w-full bg-gray-900 text-white poppins relative">
        <div className="h-[90%] w-full py-8">
          {/*Back Button */}
          <button
            className="h-[8%] w-full flex justify-left items-center p-[15px]"
            onClick={() => {
              router.push("/patient/pharmacy");
            }}
          >
            <ChevronLeft color="white" />
          </button>

          {/*Profile Current*/}
          <div className="h-[12%] w-full flex justify-center items-center border-b border-gray-600">
            <div className="h-full w-[70%] flex flex-col justify-start items-start text-white ">
              <div className="w-full text-left text-[22px]">
                {currentProfileDetails?.username}
              </div>
              <div className="w-full text-left text-[16px]">
                {currentProfileDetails?.coordinates?.location}
              </div>
              <div className="w-full text-left text-[13px] text-gray-300">
                {PatientProfile?.coordinates?.location ===
                currentProfileDetails?.coordinates?.location
                  ? Language?.[LanguageType]?.AvailableInYourCity
                  : Language?.[LanguageType]?.NotAvailableInYourCity}
              </div>
            </div>
            <div className="h-full w-[20%] flex flex-col justify-start items-center pt-[10px] space-y-2">
              <button
                onClick={() => setMapShow(true)}
                className={
                  PatientProfile?.coordinates?.location ===
                  currentProfileDetails?.coordinates?.location
                    ? "h-[55%] w-[60%] rounded-[100px] bg-green-400 flex justify-center items-center"
                    : "h-[55%] w-[60%] rounded-[100px] bg-red-500 flex justify-center items-center"
                }
              >
                {PatientProfile?.coordinates?.location ===
                currentProfileDetails?.coordinates?.location ? (
                  <MapPinCheck color="white" />
                ) : (
                  <MapPinX color="white" />
                )}
              </button>
              <div className="text-xs">{Language?.[LanguageType]?.Seemap}</div>
            </div>
          </div>

          {/*Search functionalty */}
          <form
            // onSubmit={handleSubmit}
            className="h-[8%] w-full flex justify-center items-center space-x-2"
          >
            <input
              className="h-[60%] w-[80%] border border-gray-600 bg-gray-800 p-[10px] rounded-[100px] placeholder-gray-400 text-white focus:outline-green-500"
              placeholder={Language?.[LanguageType]?.placeholderMedicine}
              onChange={(e) => {
                if (e.target.value.length <= 0) {
                  setSearchParam(null);
                } else {
                  setSearchParam(e.target.value);
                }
              }}
            ></input>
            <button
              type="submit"
              className="h-[60%] w-[9%] bg-gray-700 hover:bg-gray-600 rounded-[300px] flex justify-center items-center"
            >
              <Search color="white" />
            </button>
          </form>

          {/*List item div */}
          <div className="h-[74%] w-full p-[22px] flex flex-col justify-start items-start overflow-y-scroll space-y-3">
            {MedicineInventory?.length > 0 ? (
              MedicineInventory?.filter((items) =>
                items?.medicine_name
                  ?.toLowerCase()
                  ?.includes(
                    SearchParam !== null ? SearchParam.toLowerCase() : ""
                  )
              ).map((items) => (
                <div
                  key={items?.medicine_id}
                  className="min-h-[60px] w-full flex justify-center items-center border-b border-gray-600"
                >
                  <div className="h-full w-[70%] space-y-1">
                    <div className="text-sm font-medium text-white">
                      {items?.medicine_name}
                    </div>
                    <div className="text-xs text-gray-300">
                      {Language?.[LanguageType]?.Availability} :{" "}
                      {items?.quantity}
                    </div>
                  </div>
                  <div className="h-full w-[30%]">
                    <div className="w-full flex justify-center items-right text-xl font-semibold text-white">
                      ₹{items?.price}/-
                    </div>
                    <div className="w-full flex justify-center items-right  text-xs text-gray-300">
                      {Language?.[LanguageType]?.PerStrip}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full w-full flex flex-col justify-center items-center space-y-3">
                {/* Spinner */}
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

                {/* Text */}
                <div className="text-white text-sm">
                  {Language?.[LanguageType]?.FetchMedicine}
                </div>
              </div>
            )}
          </div>
        </div>
        {MapShow ? (
          <div className="h-full w-full backdrop-blur-md absolute top-0 left-0 space-y-2">
            <div className="h-[5%] w-full flex justify-start items-center">
              <button
                className="h-[80%] min-w-[40px] bg-green-500 rounded-lg m-2 flex justify-center items-center"
                onClick={() => setMapShow(false)}
              >
                <X color="white" strokeWidth={2} />
              </button>
            </div>
            <Map
              defaultZoom={5}
              defaultCenter={{ lat: 20.5937, lng: 78.9629 }} // India center
              style={{ width: "100%", height: "80%" }}
            >
              <Marker
                position={{
                  lat: currentProfileDetails?.coordinates?.lat,
                  lng: currentProfileDetails?.coordinates?.lng,
                }}
                label={{
                  text: currentProfileDetails?.username,
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  labelOrigin: new google.maps.Point(18, 40),
                }}
              />
              <Marker
                position={{
                  lat: PatientProfile?.coordinates?.lat,
                  lng: PatientProfile?.coordinates?.lng,
                }}
                label={{
                  text: "You",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  labelOrigin: new google.maps.Point(18, 40),
                }}
              />
            </Map>
          </div>
        ) : null}
      </div>
    );


}