
import pool from "../db/db.js";

export const CheckUserFunction = async (email, type) => {
  try {
    const isUserExsists = await pool.query(
      "select * from userinfo2 where email=$1 and type=$2",
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
  email = null,
  hassPassword = null,
  type = null
) => {
  try {
    if (email && hassPassword && type) {
      const AddQuery = await pool.query(
        "insert into userinfo2(email,password,type) values($1,$2,$3) returning id",
        [email, hassPassword, type]
      );
      return { data: AddQuery.rows[0] };
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

export const AddPatientFunction = async (id, name, diseases = [], age = null , prescription =[] , allergies = [] , coordinates = {}) => {
  try {
    if (diseases.length > 0 && age !== null && id && name.length>0 && coordinates?.lat) {
      const AddQuery = await pool.query(
        "insert into patient_profile(userid,name,age,diseases,prescriptions,allergies,coordinates) values($1,$2,$3,$4,$5,$6,$7)",
        [id,name,age,diseases,prescription,allergies,coordinates]
      );
      return true;
    } else {
    
      return false;
    }
  } catch (err) {
    console.log(err)
  }
};

export const checkUserById = async (id) => {
  try {
    const isUserExsists = await pool.query(
      "SELECT * FROM userinfo2 WHERE id=$1",
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

export const GetPatientInfo = async (profileid,userid) =>{
  try{
  if(!profileid && !userid){
    return false
  }

  const res = await pool.query("select * from patient_profile where profileid=$1 and userid=$2",[profileid,userid])
  if(res?.rows.length<=0){
    return false
  }
  return res?.rows
  }
  catch(e){
    return false
  }
  
}

export const GetCompletePatientInfo = async (profileid) => {
  try {
    console.log("GetCompletePatientInfo called with profileid:", profileid);
    if (!profileid) {
      console.log("No profileid provided");
      return false;
    }

    // Get user basic info and patient specific info in one query
    const res = await pool.query(`
      SELECT 
        u.email,
        p.profileid,
        p.userid,
        p.name,
        p.coordinates,
        p.diseases,
        p.age,
        p.prescriptions,
        p.allergies
      FROM patient_profile p 
      INNER JOIN userinfo2 u ON u.id = p.userid
      WHERE p.profileid = $1
    `, [profileid]);

    console.log("Database query result:", res.rows);

    if (res?.rows.length <= 0) {
      console.log("No patient profile found with ID:", profileid);
      return false;
    }

    const patientData = res.rows[0];
    console.log("Patient data from DB:", patientData);
    
    // Get prescriptions from the prescription_urls column
    const prescriptions = patientData.prescriptions || [];

    const result = {
      id: patientData.profileid,
      name: patientData.name,
      email: patientData.email,
      location: patientData.coordinates.location,
      age: patientData.age,
      medicalConditions: patientData.diseases || [],
      allergies: patientData.allergies,
      prescriptions: prescriptions
    };

    console.log("Returning patient info:", result);
    return result;
  } catch (e) {
    console.error("Error getting complete patient info:", e);
    return false;
  }
}

export const UploadPescriptionToDB = async(profileid,userid,new_url)=>{
  try{
    console.log(profileid, userid, new_url);
   const getAllPescription = await pool.query("select prescriptions from patient_profile where userid=$1 and profileid=$2",[userid,profileid])
  
   const new_urls = [...getAllPescription?.rows[0]?.prescriptions,new_url]
  
   const addAllPescription = await pool.query("update patient_profile set prescriptions = $1 where userid=$2 and profileid = $3",[new_urls,userid,profileid])
   return true
  }catch(e){
  return false
  }
}

export const GetAllPatientProfiles = async(id)=>{
  try{
  if(!id){
    return false
  }
  
  const res = await pool.query("select * from patient_profile where userid=$1",[id])
  if(!res?.rows){
    return false
  }
  return res?.rows
  }
  catch{
    return false
  }
}