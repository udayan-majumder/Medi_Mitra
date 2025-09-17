import { api } from "@/lib/axios.lib";

export const GetPharamacyStock = async (id) => {
  try {
    const res = await api.get("/pharmacy/get-stock", {
      params: {
        id: id,
      },
    });
    return res;
  } catch (e) {
    return false;
  }
};

export const AddPharmacyStock = async (
  id,
  medicine_name,
  medicine_id,
  manufacture_date,
  expiry_date,
  quantity
) => {
  try {
    const res = await api.post("/pharmacy/add-stock",{
         "id":id,
         "medicine_name":medicine_name,
         "medicine_id":medicine_id,
         "manufacture_date":manufacture_date,
         "expiry_date":expiry_date,
         "quantity":quantity
         })
    if(res?.status === 200){
     return true
    }
   return false
  } catch (e) {
    return false;
  }
};

export const FetchMedicine = async (medicineid) => {
  try {
    const res = await api.get("/pharmacy/check-medicine", {
      params: {
        medicineid: medicineid,
      },
    });
    console.log(res);
    if (res?.data?.Medicine) {
      return res?.data?.Medicine;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const FetchPharmacyList = async (Searchparam) =>{
  try{
    const res = await api.get("/pharmacy/get-pharmacy",{
      params:{
        "Search":Searchparam
      }
    });
    if(res?.data?.length<=0){
      return false;
    }
    return res?.data;
  }catch(e){
    return false
  }
}

export const FetchPharmacyDetails = async(id)=>{
  try{
    if(!id){
      return false
    }
    const res =  await api.get("/pharmacy/get-info",{
      params:{
        "id":id
      }
    })

    if(!res?.data){
      return false
    }
    return res?.data
  }
  catch(e){
  return false
  }
}

export const UpdatePharmacyStock = async (id, medicine_id, quantity) => {
  try {
    const res = await api.post("/pharmacy/update-stock", {
      id: id,
      medicine_id: medicine_id,
      quantity: quantity
    });
    if (res?.status === 200) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};