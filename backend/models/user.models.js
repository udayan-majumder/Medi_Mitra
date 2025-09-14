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

export const GetCompletePatientInfo = async (id) => {
  try {
    console.log("GetCompletePatientInfo called with id:", id);
    if (!id) {
      console.log("No ID provided");
      return false;
    }

    // Get user basic info and patient specific info in one query
    const res = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.location,
        u.type,
        p.diseases,
        p.age
      FROM userinfo u
      LEFT JOIN patient_table p ON u.id = p.id
      WHERE u.id = $1 AND u.type = 'patient'
    `, [id]);

    console.log("Database query result:", res.rows);

    if (res?.rows.length <= 0) {
      console.log("No patient found with ID:", id);
      return false;
    }

    const patientData = res.rows[0];
    console.log("Patient data from DB:", patientData);
    
    // Get prescriptions if any (assuming there's a prescriptions table)
    // For now, we'll return empty array as prescription handling might be different
    const prescriptions = []; // TODO: Implement prescription fetching if needed

    const result = {
      id: patientData.id,
      name: patientData.username,
      email: patientData.email,
      location: patientData.location,
      age: patientData.age,
      medicalConditions: patientData.diseases || [],
      prescriptions: prescriptions
    };

    console.log("Returning patient info:", result);
    return result;
  } catch (e) {
    console.error("Error getting complete patient info:", e);
    return false;
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

