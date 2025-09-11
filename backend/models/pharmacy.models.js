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