import { create } from "zustand";

const PharmacyStore = create((set)=>({
    MedicineInventory:[],
    PharmacyRefresh:false,
     

    setMedicineInventory:(data) => set({MedicineInventory:data}),
    setPharmacyRefresh:(data)=>set({PharmacyRefresh:data})
}))

export default PharmacyStore