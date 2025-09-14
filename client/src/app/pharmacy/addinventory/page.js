"use client";
import { SidePharmacyNavbar } from "@/Components/sidenavbar.components";
import { useState } from "react";
import { FetchMedicine, AddPharmacyStock } from "@/services/pharmacy.services";
import toast, { Toaster } from "react-hot-toast";
import { UserStore } from "@/hooks/userauth.hooks";
import PharmacyStore from "@/store/pharmacy.store";

export default function AddInventory() {
  {
    /*Store */
  }
  const { User } = UserStore();
  const { setPharmacyRefresh } = PharmacyStore();
  {
    /*Custom Hook */
  }
  const [Medicineid, setMedicineid] = useState("");
  const [MedicineName, setMedicineName] = useState("");
  const [MedicineQuantity, setMedicineQuantity] = useState(1);
  const [Medicine_MFG_Date, set_MFG_Date] = useState("");
  const [Medicine_EXP_Date, set_EXP_Date] = useState("");



  const handlerSubmit = async (e) => {
    try {
      e.preventDefault();
      if (Medicineid.length <= 0) {
        return toast.error("no medicine id");
      }
      if (MedicineName.length <= 0) {
        return toast.error("no medicine name");
      }
      if (Medicine_EXP_Date.length <= 0 || Medicine_MFG_Date.length <= 0) {
        return toast.error("Date field missing");
      }

      const res = await AddPharmacyStock(
        User?.id,
        MedicineName,
        Medicineid,
        Medicine_MFG_Date,
        Medicine_EXP_Date,
        MedicineQuantity
      );
      if (res) {
        console.log(res)
        setPharmacyRefresh(true);
        setMedicineid("")
        setMedicineName("")
        setMedicineQuantity("")
        set_EXP_Date("")
        set_MFG_Date("")
        return toast.success("added to stock successfully")
      } else {
        return toast.error("stock not added");
      }
    } catch (e) {
      console.log(error);
    }
  };

  const getMedicine = async () => {
    try {
      const res = await FetchMedicine(Number(Medicineid));
      console.log(res);
      if (res?.medicine_id) {
        setMedicineName(res?.medicine_name);
      } else {
        setMedicineName("");
        return toast.error("no medicine found");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center tracking-wider poppins text-black">
      <Toaster />
      {/*Side Navbar */}
      <SidePharmacyNavbar height={100} width={20} />

      {/*Content Container*/}
      <div className="h-full w-[80%] flex flex-col justify-start items-center bg-white">
        {/*Logo div */}
        <div className="h-[12%] w-full flex justify-end items-center p-[20px] text-black">
          <img src="/logo.png" className="h-full"></img>
        </div>

        {/* Heading Div */}
        <div className="h-[12%] w-[93%] flex justify-left items-center p-[5px] bg-[#E9F7E0] rounded-lg shadow-md">
          <div className="h-full w-[25%] text-black flex justify-center items-center text-[30px] font-medium">
            Add To Inventory
          </div>
        </div>

        {/*Form Input Div */}
        <div className="h-[75%] w-[98%] flex justify-center items-center">
          {/*Form */}
          <form
            onSubmit={handlerSubmit}
            className="h-[80%] w-[60%] bg-[#E9F7E0] flex flex-col justify-center items-center space-y-6 p-[20px] rounded-lg shadow-md"
          >
            {/*Medicine Id input */}
            <div className="h-[10%] w-[90%] flex justify-center items-center space-x-6">
              <input
                className="h-full w-full border border-gray-300 rounded-lg px-3 bg-white text-black outline-none focus:border-[#7CBC27]"
                value={Medicineid}
                placeholder="Medicine Id"
                type="number"
                onChange={(e) => {
                  e.preventDefault();
                  setMedicineid(e.target.value);
                }}
              ></input>
              <button
                className="h-[80%] bg-[#7CBC27] p-[20px] flex justify-center items-center rounded-lg text-white hover:bg-[#0D7135]"
                onClick={(e) => {
                  e.preventDefault();
                  getMedicine();
                }}
              >
                Search
              </button>
            </div>

            {/*Medicine Name input */}
            <div className="h-[10%] w-[90%]">
              <input
                className="h-full w-full border border-gray-300 rounded-lg px-3 bg-white text-black outline-none focus:border-[#7CBC27]"
                value={MedicineName}
                placeholder="Medicine Name"
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setMedicineName(e.target.value);
                }}
              ></input>
            </div>

            {/*Medicine quantity input */}
            <div className="h-[10%] w-[90%]">
              <input
                className="h-full w-[15%] border border-gray-300 rounded-lg px-3 bg-white text-black outline-none focus:border-[#7CBC27]"
                value={MedicineQuantity}
                placeholder="Quantity"
                type="number"
                onChange={(e) => {
                  e.preventDefault();
                  setMedicineQuantity(e.target.value);
                }}
              ></input>
            </div>

            {/*Medicine MFG Date input */}
            <div className="h-[10%] w-[90%]">
              <input
                className="h-full w-full border border-gray-300 rounded-lg px-3 bg-white text-black outline-none focus:border-[#7CBC27]"
                value={Medicine_MFG_Date}
                placeholder="MFG Date"
                type="date"
                onChange={(e) => {
                  e.preventDefault();
                  set_MFG_Date(e.target.value);
                }}
              ></input>
            </div>

            {/*Medicine EXP Date input */}
            <div className="h-[10%] w-[90%]">
              <input
                className="h-full w-full border border-gray-300 rounded-lg px-3 bg-white text-black outline-none focus:border-[#7CBC27]"
                value={Medicine_EXP_Date}
                placeholder="EXP Date"
                type="date"
                onChange={(e) => {
                  e.preventDefault();
                  set_EXP_Date(e.target.value);
                }}
              ></input>
            </div>

            {/*Submit Button */}
            <div className="h-[10%] w-[90%] flex justify-end">
              <button
                className="h-full w-[20%] bg-[#7CBC27] rounded-lg text-white hover:bg-[#0D7135]"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>

          {/*Decoration */}
          <div className="h-full w-[5%] flex justify-center items-center">
            <div className="h-[90%] w-[0%] border-r-1 border-gray-300"></div>
          </div>

          {/*Image Div */}
          <div className="h-full w-[30%] flex flex-col justify-end items-center space-y-4 ">
            <div className="w-[70%] flex justify-center items-start gap-[5px]">
              <p className="text-green-400">Tip</p> : Always double-check expiry
              dates before adding stock
            </div>
            <img src="/heart-hand.png"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
