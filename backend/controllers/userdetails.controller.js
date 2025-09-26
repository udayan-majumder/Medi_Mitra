import { error } from "console"
import { GetPatientInfo, GetCompletePatientInfo } from "../models/user.models.js"
import { PharmacyProfileInfo } from "../models/pharmacy.models.js"

export const UserDetailsFunction = async(req,res)=>{

    const user = req.user
    
    if(!user.id){
        return res.json({"user":false})
    }
    return res.status(200).json({user})

}

export const PatientInfoFunction = async(req,res)=>{

   const {profileid,userid} = req.query
   
   const Patient = await GetPatientInfo(profileid,userid)

   if(!Patient){
    return res.status(400).json({user:false})
   }

   return res.status(200).json({Patient})
}

export const CompletePatientInfoFunction = async(req,res)=>{
   const {id} = req.query

   const Patient = await GetCompletePatientInfo(id)

   if(!Patient){
    return res.status(400).json({patient:false})
   }

   return res.status(200).json({patient:Patient})
}

export const CompletePharmacyInfoFunction = async(req,res)=>{
    try{
     const {id} = req.query
     if(!id){
        return res.status(400).json({id:false})
     }
     const isPharmacyProfile = await PharmacyProfileInfo(id)
     if(!isPharmacyProfile){
        return res.status(400).json({user:false})
     }

     return res.status(200).json({isPharmacyProfile})
    }catch(e){
        return res.status(400).json({error:true})
    }
}