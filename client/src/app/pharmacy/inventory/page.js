"use client"
import { useState } from "react";
import { SidePharmacyNavbar } from "@/Components/sidenavbar.components";
import PharmacyStore from "@/store/pharmacy.store";
import { UpdatePharmacyStock } from "@/services/pharmacy.services";
import { UserStore } from "@/hooks/userauth.hooks";
import { Edit3, Check, X } from "lucide-react";

export default function Inventory() {
 const {MedicineInventory} = PharmacyStore()
 const {User} = UserStore()
 const [editingQuantities, setEditingQuantities] = useState({});
 const [newQuantities, setNewQuantities] = useState({});
 const [updating, setUpdating] = useState({});

 const handleUpdateQuantity = async (medicineId) => {
   const newQuantity = newQuantities[medicineId];
   if (!newQuantity || newQuantity < 0) {
     alert("Please enter a valid quantity (0 or greater)");
     return;
   }

   if (!User?.id) {
     alert("User not authenticated");
     return;
   }

   setUpdating(prev => ({ ...prev, [medicineId]: true }));
   
   try {
     const success = await UpdatePharmacyStock(User.id, medicineId, newQuantity);
     if (success) {
       // Update the local state
       setEditingQuantities(prev => ({ ...prev, [medicineId]: false }));
       setNewQuantities(prev => ({ ...prev, [medicineId]: "" }));
       window.location.reload();
     } else {
       alert("Failed to update quantity");
     }
   } catch (error) {
     alert("Error updating quantity");
   } finally {
     setUpdating(prev => ({ ...prev, [medicineId]: false }));
   }
 };

 const handleEditClick = (medicineId, currentQuantity) => {
   setEditingQuantities(prev => ({ ...prev, [medicineId]: true }));
   setNewQuantities(prev => ({ ...prev, [medicineId]: currentQuantity }));
 };

 const handleCancelEdit = (medicineId) => {
   setEditingQuantities(prev => ({ ...prev, [medicineId]: false }));
   setNewQuantities(prev => ({ ...prev, [medicineId]: "" }));
 };

  return (
    //main container
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins">
      {/*Side Navbar */}
      <SidePharmacyNavbar height={100} width={20} />

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
            {MedicineInventory?.totalstock
              ? Number(MedicineInventory?.totalstock[0]?.totalquantity)
              : 0}
          </div>
        </div>

        {/*Stock Table Div */}

        <div className="h-[75%] w-full flex justify-center items-center space-y-2">
          <div className="h-[90%] w-[98%] flex flex-col">
            {/*Table Headers */}
            <div className="h-[10%] w-full flex justify-center items-center bg-[#0D7135] rounded-lg shadow-md text-white">
              <div className="h-full w-[16%] flex justify-center items-center">
                Medicine
              </div>
              <div className="h-full w-[16%] flex justify-center items-center">
                Quantity
              </div>
              <div className="h-full w-[16%] flex justify-center items-center">
                Price
              </div>
              <div className="h-full w-[16%] flex justify-center items-center">
                MFG Date
              </div>
              <div className="h-full w-[16%] flex justify-center items-center">
                EXP Date
              </div>
              <div className="h-full w-[20%] flex justify-center items-center">
                Actions
              </div>
            </div>

            {/*Table Items */}

            <div className="h-[90%] w-full  overflow-y-scroll pt-[10px]">
              {MedicineInventory?.list?.length > 0 ? (
                MedicineInventory?.list?.map((items, index) => (
                  <div
                    key={index}
                    className="flex flex-auto justify-center items-center h-[12%] w-full text-black border-b-1 border-gray-300"
                  >
                    <div className="h-full w-[16%] flex justify-center items-center text-center">
                      <span className="truncate max-w-full">{items?.medicine_name}</span>
                    </div>
                    <div className="h-full w-[16%] flex justify-center items-center">
                      {editingQuantities[items?.medicine_id] ? (
                        <input
                          type="number"
                          min="0"
                          value={newQuantities[items?.medicine_id] || ""}
                          onChange={(e) => setNewQuantities(prev => ({ 
                            ...prev, 
                            [items?.medicine_id]: e.target.value 
                          }))}
                          className="w-[80%] h-[60%] border border-gray-300 rounded px-2 text-center"
                        />
                      ) : (
                        items?.quantity
                      )}
                    </div>
                    <div className="h-full w-[16%] flex justify-center items-center">
                      {items?.price}
                    </div>
                    <div className="h-full w-[16%] flex justify-center items-center">
                      {new Date(items?.manufacture_date).toLocaleDateString()}
                    </div>
                    <div className="h-full w-[16%] flex justify-center items-center">
                      {new Date(items?.expiry_date).toLocaleDateString()}
                    </div>
                    <div className="h-full w-[20%] flex justify-center items-center">
                      {editingQuantities[items?.medicine_id] ? (
                        <>
                          <button
                            onClick={() => handleUpdateQuantity(items?.medicine_id)}
                            disabled={updating[items?.medicine_id]}
                            className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center disabled:opacity-50"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleCancelEdit(items?.medicine_id)}
                            className="w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center ml-2"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(items?.medicine_id, items?.quantity)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
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
