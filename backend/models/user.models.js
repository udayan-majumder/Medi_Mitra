import pool from "../db/db.js";

export const CheckUserFunction = async (email, type) => {
  try {
    const isUserExsists = await pool.query(
      "select * from userinfo where email=$1 and type=$2",
      [email, type]
    );
    if (isUserExsists.rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

export const AddUserFunction = async (
  username=null,
  email=null,
  hassPassword=null,
  location=null,
  type=null
) => {
  try {
    if(username && email && hassPassword && location && type ){
    const AddQuery = await pool.query(
      "insert into userinfo(username,email,password,location,type) values($1,$2,$3,$4,$5) returning id",
      [username, email, hassPassword, location, type]
    );
    return { data: AddQuery.rows[0] };
    }
    else{
        return false
    }
  } catch (err) {
    throw err;
  }
};

export const AddPatientFunction = async (id, diseases =[], age=null) => {
  try {
    if(diseases.length>0 && age !==null){
    const AddQuery = await pool.query(
      "insert into patient_table values($1,$2,$3)",
      [id, diseases, age]
    );
    return true
    }
    else{
        await pool.query("delete from userinfo where id=$1",[id])
        return false
    }
  } catch (err) {}
};
