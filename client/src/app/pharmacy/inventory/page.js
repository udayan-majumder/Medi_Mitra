"use client"
import { useState,useEffect } from "react";
import { SideNavbar } from "@/Components/sidenavbar.components";
import PharmacyStore from "@/store/pharmacy.store";

export default function Inventory() {
 const {MedicineInventory} = PharmacyStore()

  return (
    //main container
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins">
      {/*Side Navbar */}
      <SideNavbar height={100} width={20} />

      {/*Content Container*/}
      <div className="h-full w-[80%] flex flex-col justify-start items-center bg-white">
        {/*Logo div */}
        <div className="h-[12%] w-full flex justify-end items-center p-[20px] text-black">
          <img src="/logo.png" className="h-full"></img>
        </div>

        {/*Stock Heading Div */}
        <div className="h-[12%] w-[98%] flex justify-between items-center p-[5px] bg-[#E9F7E0] rounded-lg shadow-md">
          <div className="h-full w-[25%] text-black flex justify-center items-center text-[30px] font-medium">
            Total Stock Available :{" "}
          </div>
          <div className="h-full w-[10%] bg-gradient-to-b from-[#7CBD27] via-[#378E31] to-[#0D7136] bg-clip-text text-transparent flex justify-center items-center text-[60px] font-medium">
            {MedicineInventory?.totalstock ? Number(MedicineInventory?.totalstock[0]?.totalquantity) : 0}
          </div>
        </div>

        {/*Stock Table Div */}

        <div className="h-[75%] w-full flex justify-center items-center ">
          <div className="h-[95%] w-[98%] ">
            {/*Table Headers */}
            <div className="h-[10%] w-full flex justify-center items-center bg-[#0D7135] rounded-lg shadow-md">
              <div className="h-full w-[20%] flex justify-center items-center">
                Medicine
              </div>
              <div className="h-full w-[20%] flex justify-center items-center">
                Quantity
              </div>
              <div className="h-full w-[20%] flex justify-center items-center">
                Price
              </div>
              <div className="h-full w-[20%] flex justify-center items-center">
                MFG Date
              </div>
              <div className="h-full w-[20%] flex justify-center items-center">
                EXP Date
              </div>
            </div>

            {/*Table Items */}

            <div className="h-[90%] w-full flex justify-center items-start  pt-[10px] overflow-y-scroll">
              {MedicineInventory?.list?.length > 0 ? (
                MedicineInventory?.list?.map((items) => (
                    <div key={items?.pharma_id} className="flex-1 flex justify-center items-center h-[10%] w-full text-black border-b-1 border-gray-300">
                      <div className="h-full w-[20%] flex justify-center items-center">
                        {items?.medicine_name}
                      </div>
                      <div className="h-full w-[20%] flex justify-center items-center">
                        {items?.quantity}
                      </div>
                      <div className="h-full w-[20%] flex justify-center items-center">
                        {items?.price}
                      </div>
                      <div className="h-full w-[20%] flex justify-center items-center">
                        {new Date(items?.manufacture_date).toLocaleDateString()}
                      </div>
                      <div className="h-full w-[20%] flex justify-center items-center">
                        {new Date(items?.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                ))
                
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
