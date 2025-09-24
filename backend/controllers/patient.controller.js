import { AddPatientFunction, GetAllPatientProfiles } from "../models/user.models.js"


export const CreateProfile = async(req,res) =>{
    try{
    const {
      id,
      name,
      diseases,
      age,
      prescription,
      allergies,
      coordinates,
    } = req.body;
    
    if(!id){
        return res.json({id:null}).status(400)
    }

    const AddnewProfile = await AddPatientFunction(id, name, diseases, age , prescription , allergies , coordinates )
    if(!AddnewProfile){
        return res.status(400).json({UserAdded:false})
    }

    return res.status(200).json({UserAdded:true})
    }catch(e){
      return res.json({error:true}).status(400)
    }
} 


export const GetAllProfiles = async(req,res)=>{
    try{
     const {id} = req.query

     if(!id){
        return res.status(400).json({id:null})
     }
     
     const AllProfiles = await GetAllPatientProfiles(id)

     if(!AllProfiles){
        return res.status(400).json({Profiles:null})
     }

     return res.status(200).json({AllProfiles})
    }catch(e){
        return res.status(400).json({error:true})
    }
}

