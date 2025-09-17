"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { House, BriefcaseMedical, SquareStack, LogOut } from 'lucide-react';
import { UserStore } from "@/hooks/userauth.hooks";
import { LogoutHandler } from "@/services/user.services";
import toast from "react-hot-toast";

 {
   /*Taking parameter <SideNavbar height={100} width={20}/> */
}
export const SidePharmacyNavbar = ({ height, width }) => {
  const router = useRouter();
  const [currentPage, setPage] = useState("");
  const  {User,setUser} = UserStore()

  const Logout = async()=>{
    toast.loading("Logging out...")
    const res = await LogoutHandler()
    if(res){
      console.log(res)
      setUser(null)
      toast.dismiss()
      toast.success("Logged out successfully")
      router.push("/auth/login")
    }
  }
  

  // Get current path from window.location
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPage(window.location.pathname);
    }
  }, []);

  // Listen for route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined') {
        setPage(window.location.pathname);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  {
    /*Main Component */
  }
  return (
    <div
      className="flex flex-col"
      style={{ 
        height: `${height}%`, 
        width: `${width}%`,
        background: 'linear-gradient(180deg, #0D7136 0%, #4CAF50 100%)'
      }}
    >
        
      {/*HeadingDiv*/}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">👤</span>
            </div>
          </div>
          <span className="text-white font-semibold text-lg">{User?.username}</span>
        </div>
        <h2 className="text-white text-xl font-medium">Pharmacy Dashboard</h2>
      </div>

      {/*Navigation Buttons*/}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out transform ${
                currentPage === "/pharmacy/home" 
                  ? "bg-[#7CBD27] text-white font-medium shadow-lg" 
                  : "text-green-100 hover:bg-green-600 hover:bg-opacity-30 hover:text-white hover:translate-x-1 hover:shadow-md"
              }`}
              onClick={() => {
                router.push("/pharmacy/home");
                setPage("/pharmacy/home");
              }}
            >
              <House className="w-5 h-5" />
              Home
            </button>
          </li>
          
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out transform ${
                currentPage === "/pharmacy/inventory" 
                  ? "bg-[#7CBD27] text-white font-medium shadow-lg" 
                  : "text-green-100 hover:bg-green-600 hover:bg-opacity-30 hover:text-white hover:translate-x-1 hover:shadow-md"
              }`}
              onClick={() => {
                router.push("/pharmacy/inventory");
                setPage("/pharmacy/inventory");
              }}
            >
              <BriefcaseMedical className="w-5 h-5" />
              Medicine Inventory
            </button>
          </li>
          
          <li>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ease-in-out transform ${
                currentPage === "/pharmacy/addinventory" 
                  ? "bg-[#7CBD27] text-white font-medium shadow-lg" 
                  : "text-green-100 hover:bg-green-600 hover:bg-opacity-30 hover:text-white hover:translate-x-1 hover:shadow-md"
              }`}
              onClick={() => {
                router.push("/pharmacy/addinventory");
                setPage("/pharmacy/addinventory");
              }}
            >
              <SquareStack className="w-5 h-5" />
              Update Inventory
            </button>
          </li>
        </ul>
      </nav>

      {/*Logout*/}
      <div className="p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-green-100 hover:bg-red-600 hover:bg-opacity-20 hover:text-red-200 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-md" onClick={Logout}>
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </div>
  );
};