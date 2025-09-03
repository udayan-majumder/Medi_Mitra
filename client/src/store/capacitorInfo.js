import { create } from "zustand";

const CapacitorInfoStore = create((set)=>({
    IsMobileView : false,
    setIsMobileView:(data)=>set({IsMobileView:data})
}))


export default CapacitorInfoStore