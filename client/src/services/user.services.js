import { api } from "@/lib/axios.lib";

export const GetUserDetails = async() => {
  try {
    const res = await api.get("/user/userdetails");
    if (res?.data?.user) {
      return res?.data?.user;
    }
  } catch (e) {
    return null;
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