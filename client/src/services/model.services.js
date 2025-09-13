import { modelapi } from "@/lib/axios.lib";

export const ModelSymptompAnalysis = async(symptoms,language)=>{
try{
 const res = await modelapi.post("/check_symptoms",{
    "symptoms":symptoms,
    "language":language
 });   

 if(!res?.data){
    return false
 }
 console.log(res?.data)
 return res?.data
}
catch(e){
    console.log(e)
}


}