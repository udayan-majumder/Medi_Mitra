import { api } from "@/lib/axios.lib";

export const GetAllProfiles = async(id) =>{
try{
if(!id){
    return false
}

const res = await api.get("/user/all-profiles",{
    params:{
        "id":id
    }
})
if(!res?.data?.AllProfiles){
return false
}

return res?.data?.AllProfiles

}catch(e){
    return false
}
}

export const AddnewProfile = async(
  id,
  name,
  diseases,
  age,
  allergies,
  coordinates
) =>{
try{
       
if(!id || name.length<=0 || diseases.length<=0 || age === null || allergies.length<0 || !coordinates?.lat ){
    return false
}
const res = await api.post("/user/add-profile", {
  "id":id,
  "name":name,
  "diseases":diseases,
  "age":age,
  "prescriptions":[],
  "allergies":allergies,
  "coordinates":coordinates,
});


if(!res?.data?.UserAdded){
    return false
}

return true
}catch(e){
    console.log(e)
    return false
}
}
