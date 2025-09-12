import { create } from "zustand";

const PharmacyStore = create((set)=>({
    MedicineInventory:[],
    PharmacyRefresh:false,
    PharmacyList:[], 

    setMedicineInventory:(data) => set({MedicineInventory:data}),
    setPharmacyRefresh:(data)=>set({PharmacyRefresh:data}),
    setPharmacyList:(data)=>set({PharmacyList:data})
}))

export default PharmacyStore