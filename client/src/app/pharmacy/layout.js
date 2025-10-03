"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserStore } from "@/hooks/userauth.hooks";
import { GetPharamacyStock } from "@/services/pharmacy.services";
import PharmacyStore from "@/store/pharmacy.store";
import MedicalLoader from "@/Components/MedicalLoader";
import PharmacyWrapper from "@/hooks/usePharmacy.hooks";


export default function PharmacyLayout({ children }) {
  const { User, isLoading } = UserStore();
  const { setMedicineInventory, PharmacyRefresh, setPharmacyRefresh } =
    PharmacyStore();
  const router = useRouter();

  {
    /*Fetch Stock Script */
  }
  const fetchStock = async () => {
    const res = await GetPharamacyStock(User?.id);
    console.log(res?.data);
    if (res?.data?.list && res?.data?.totalstock) {
      setMedicineInventory(res?.data);
    }
  };

  useEffect(() => {
    if (!isLoading && User !== null && !User?.id) {
      router.replace("/auth/login");
    }
  }, [User, isLoading, router]);

  useEffect(() => {
    if (User?.id) {
      fetchStock();
    }
  }, [User?.id]);

  useEffect(() => {
    if (PharmacyRefresh && User?.id) {
      console.log("triggered");
      fetchStock();
      setPharmacyRefresh(false);
    }
  }, [PharmacyRefresh, User?.id]);

  if (isLoading || User === null) {
    return <MedicalLoader />;
  }

  if (!User?.id) {
    return null;
  }

  return (
    <>
      <PharmacyWrapper>{children}</PharmacyWrapper>
    </>
  );
}
