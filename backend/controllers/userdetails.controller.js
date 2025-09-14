import { GetPatientInfo } from "../models/user.models.js"

export const UserDetailsFunction = async(req,res)=>{

    const user = req.user
    
    if(!user.id){
        return res.json({"user":false})
    }
    return res.status(200).json({user})

}



export const PatientInfoFunction = async(req,res)=>{

   const {id} = req.query

   const Patient = await GetPatientInfo(id)

   if(!Patient){
    return res.status(400).json({user:false})
   }

   return res.status(200).json({Patient})
}