import { api } from "@/lib/axios.lib";

export const GetUserDetails = async() => {
  try {
    const res = await api.get("/user/userdetails");
    if (res?.data?.user) {
      return res?.data?.user;
    }
  } catch (e) {
    return false;
  }
};

export const LoginHandler = async(email,password,type) =>{
    try{
      const res = await api.post("/user/login",{
        "email":email,
        "password":password,
        "type":type
      })

      if(res?.status === 200){
        return res?.data
      }
    }catch(e){
      if(!e?.response?.data?.user || !e?.response?.data?.correctpass || !e?.response?.data?.tokengenerated ){
        return {"errortype":true }
      }
     return {internal_server_error : true}
    }
}

export const RegisterHandler = async(username,email,password,location,type,diseases=[],age=null,coordinates) =>{
    try{
const reqbody = {"username":username,"email":email,"password":password,"location":location,"type":type,"diseases":diseases,"age":age,"coordinates":coordinates}
    const res = await api.post("/user/register",reqbody)
    if(res.status === 200){
        return res
    }
    }
    catch(e){
        return {"errortype":e?.response?.data}
    }
}

export const LogoutHandler = async() =>{
  try{
   const res = await api.get("/user/logout")
   if(res?.data?.logout && res?.status === 200){
    return true
   }
  }catch(e){
    return false
  }
}

export const GetPatientInfo = async(id)=>{

try{
const res  =await api.get("/user/patient-info",{
  params:{
    "id":id
  }
})
 
if(!res?.data?.Patient){
  return false
}
return res?.data?.Patient

}
catch(e){
return false
}
}

export const UploadPatientPescription = async(formData) =>{
 try{

  const res = await api.post("/user/upload-pescription",formData,{
    headers:{
      'Content-Type':'multipart/form-data',
    },
  })

  if(!res?.data?.url){
    return false
  }

  return res?.data?.url
 }catch(e){
return false
 }
}