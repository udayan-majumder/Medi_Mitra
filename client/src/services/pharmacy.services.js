import { api } from "@/lib/axios.lib";


export const GetPharamacyStock = async(id) =>{
    
try{
    const res =  await api.get("/pharmacy/get-stock",{
        params:{
            "id":id
        }
    })
    return res
}
catch(e){
    return false
}
}