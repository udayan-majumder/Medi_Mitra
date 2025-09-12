import pool from "../db/db.js";

export const CheckMedicine  = async(medicine_id)=>{
    try{
     if(!medicine_id){
        return false
     }
     const res = await pool.query("select medicine_id,medicine_name from medicine where medicine_id = $1",[medicine_id])
     if(res.rows.length>0){
        return res.rows[0]
     }
     return false
    }catch(e){
        return false
    }
}

export const AllPharmacy = async() =>{
const usertype = "pharmacy"
const res = await pool.query("select * from userinfo where type = $1",[usertype])
if(res.rows.length>0){
return res?.rows?.map(({password,...items})=>(items))
}
}

export const SearchPharmacyByName = async(name)=>{
 const usertype = "pharmacy";
  const cleanName = name.replace(/['"]+/g, "");
  console.log(cleanName)
 const res = await pool.query("select * from userinfo where type = $1 and username ilike $2",[usertype,`%${cleanName}%`])
  console.log(res?.rows)
 if(res?.rows?.length > 0){
    return res?.rows
 }

 return false

}
