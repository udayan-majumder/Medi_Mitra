import pool from "../db/db.js";

export const CheckMedicine = async (medicine_id) => {
  try {
    if (!medicine_id) {
      return false;
    }
    const res = await pool.query(
      "select medicine_id,medicine_name from medicine where medicine_id = $1",
      [medicine_id]
    );
    if (res.rows.length > 0) {
      return res.rows[0];
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const AllPharmacy = async () => {
  const usertype = "pharmacy";
  const res = await pool.query("select * from userinfo2 where type = $1", [
    usertype,
  ]);
  if (res.rows.length > 0) {
    return res?.rows?.map(({ password, ...items }) => items);
  }
};

export const SearchPharmacyByName = async (name) => {
  const usertype = "pharmacy";
  const cleanName = name.replace(/['"]+/g, "");

  const res = await pool.query(
    "select * from userinfo where type = $1 and username ilike $2",
    [usertype, `%${cleanName}%`]
  );

  if (res?.rows?.length > 0) {
    return res?.rows?.map(({ password, ...items }) => items);
  }

  return false;
};

export const AddnewPharmacyProfile = async(pharma_id,username,coordinates) =>{
  try{
  if(!pharma_id || username.length<= 0 || !coordinates?.lat){
    return false
  }
  const res = await pool.query("insert into pharma_profile(pharma_id,username,coordinates) values($1,$2,$3)",[pharma_id,username,coordinates])  

  if(res?.rowCount<=0){
    return false
  }
  return true
  }catch(e){
    return false
  }
}

export const PharmacyProfileInfo = async(id)=>{
  try{
  if(!id){
    return false
  }
  const res = await pool.query("select * from pharma_profile where pharma_id = $1",[id])
  if(res?.rows?.length<=0){
    return false
  }
  return res?.rows[0]
  }catch(e){
    return false
  }
}