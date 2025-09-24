"use client"
import { useEffect,useState,useContext,createContext, use } from "react"
import { UserStore } from "./userauth.hooks"
import { GetAllProfiles } from "@/services/patient.services"
import { GetPatientInfo } from "@/services/user.services"
import { useRouter } from "next/navigation"

const PatientContext = createContext(null)


export const usePatientStore = ()=>{
  
    const context = useContext(PatientContext)
    if(context === null){
        throw new Error("no patient profile")
    }
    return context
}



const PatientWrapper = ({children})=>{
{/*Default hooks */}   
const {User} = UserStore()
const router = useRouter()

{/*Custom hooks */}
const [AllProfiles,setAllProfiles] = useState(null)
const [currentProfileId,setcurrentProfileId] = useState(null)
const [PatientProfile,setPatientProfile] = useState(null) 
const [Reload,setReload] = useState(false)
{/*Fetch all exsisting profiles */}
const fetchAllProfiles = async()=>{
try{
 const res = await GetAllProfiles(User?.id)
 if(!res){
    setAllProfiles([])
 }
setAllProfiles(res)
}catch(e){
    console.log(e)
}
}    

{/*Fetch current profile selected */}
const fetchCurrentProfile  = async(profileid)=>{
try{

if(!profileid || !User?.id){
    console.log("missing")
}
const res = await GetPatientInfo(profileid,User?.id)

if(!res){
setPatientProfile(null)
}

setPatientProfile(res)
if(!Reload){
localStorage.setItem("profileid",profileid)
return router.replace("/patient/home")
}
}catch(e){
    console.log(e)
}
}

useEffect(()=>{
    if(User?.id){
      fetchAllProfiles()
    }
},[])

useEffect(()=>{
    if(Reload){
    if(User?.id){
      fetchAllProfiles()
      setReload(false)
    }
    }
},[Reload])

useEffect(()=>{
    if(Reload){
    if(currentProfileId!==null){
      fetchCurrentProfile(currentProfileId)
      setReload(false)
    }
    }
},[Reload])


useEffect(()=>{
const id = localStorage?.getItem("profileid")
if(!id){
    setcurrentProfileId(null)
    router.replace("/patient")
}
setcurrentProfileId(id)
},[])


useEffect(()=>{
    if(currentProfileId!==null){
     fetchCurrentProfile(currentProfileId)
    }
},[currentProfileId])

    return(
     <PatientContext.Provider value={{AllProfiles,currentProfileId,setcurrentProfileId,PatientProfile,setPatientProfile,setReload}}>
       {children}
     </PatientContext.Provider>
    )
}

export default PatientWrapper