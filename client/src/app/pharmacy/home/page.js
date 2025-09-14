"use client"
import { useState, useEffect } from "react";
import { SidePharmacyNavbar} from "@/Components/sidenavbar.components";
import PharmacyStore from "@/store/pharmacy.store";

export default function Home() {
  // Get total stock from your pharmacy store
  const { MedicineInventory } = PharmacyStore();

  return (
    //main container
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins">
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