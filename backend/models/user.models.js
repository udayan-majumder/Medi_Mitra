import pool from "../db/db.js";

export const CheckUserFunction = async (email, type) => {
  try {
    const isUserExsists = await pool.query(
      "select * from userinfo where email=$1 and type=$2",
      [email, type]
    );
    if (isUserExsists.rows.length > 0) {
      return isUserExsists.rows[0];
    }
    return false;
  } catch (err) {
    throw err;
  }
};

export const AddUserFunction = async (
  username = null,
  email = null,
  hassPassword = null,
  location = null,
  type = null
) => {
  try {
    if (username && email && hassPassword && location && type) {
      const AddQuery = await pool.query(
        "insert into userinfo(username,email,password,location,type) values($1,$2,$3,$4,$5) returning id",
        [username, email, hassPassword, location, type]
      );
      return { data: AddQuery.rows[0] };
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

export const AddPatientFunction = async (id, diseases = [], age = null) => {
  try {
    if (diseases.length > 0 && age !== null) {
      const pescription_urls = []
      const AddQuery = await pool.query(
        "insert into patient_table values($1,$2,$3,$4)",
        [id, diseases, age,pescription_urls]
      );
      return true;
    } else {
      await pool.query("delete from userinfo where id=$1", [id]);
      return false;
    }
  } catch (err) {}
};

export const checkUserById = async (id) => {
  try {
    const isUserExsists = await pool.query(
      "SELECT * FROM userinfo WHERE id=$1",
      [id]
    );
    if (isUserExsists.rows.length > 0) {
      return isUserExsists.rows[0];
    }
    return false;
  } catch (err) {
    throw err;
  }
};

export const GetPatientInfo = async (id) =>{
  try{
  if(!id){
    return false
  }

  const res = await pool.query("select * from patient_table where id=$1",[id])

  if(res?.rows.length<=0){
    return false
  }
  return res?.rows
  }
  catch(e){
    return false
  }
  
}

export const UploadPescriptionToDB = async(id,new_url)=>{
  try{
   const getAllPescription = await pool.query("select prescription_urls from patient_table where id=$1",[id])
   const new_urls = [...getAllPescription?.rows[0]?.prescription_urls,new_url]
   const addAllPescription = await pool.query("update patient_table set prescription_urls = $1 where id=$2",[new_urls,id])
   return true
  }catch(e){
  return false
  }
}

