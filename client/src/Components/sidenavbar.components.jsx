"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

{
  /*Taking parameter <SideNavbar height={100} width={20}/> */
}
export const SideNavbar = ({ height, width }) => {
  const [currentPage, setPage] = useState("/pharmacy/home");
  const router = useRouter();

  {
    /*Main Component */
  }
  return (
    <div
      className="bg-green-400"
      style={{ height: `${height}%`, width: `${width}%` }}
    >
        
        {/*HeadingDiv */}
      <div>
        <div>ABC Pharma</div>
        <div>Pharmacy Dashboard</div>
      </div>

      {/*Navigation Buttons */}
      <button
        onClick={() => {
          router.push("/pharmacy/home");
          setPage("/pharmacy/home");
        }}
      >
        Home
      </button>
      <button
        onClick={() => {
          router.push("/pharmacy/inventory");
          setPage("/pharmacy/inventory");
        }}
      >
        Medicine Inventory
      </button>
      <button
        onClick={() => {
          router.push("/pharmacy/addinventory");
          setPage("/pharmacy/addinventory");
        }}
      >
        Update Inventory
      </button>
    </div>
  );
};
