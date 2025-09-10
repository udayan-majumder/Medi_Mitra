import { create } from "zustand";

const PharmacyStore = create((set)=>({
    MedicineInventory:[],
    PharmacyRefresh:false,


    setMedicineInventory:(data) => set({MedicineInventory:data}),
    setPharmacyRefresh:(data)=>set({PharmacyStore:data})
}))

export default PharmacyStore