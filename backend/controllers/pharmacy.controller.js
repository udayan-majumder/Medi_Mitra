import pool from "../db/db.js";
import { checkUserById } from "../models/user.models.js";
import { AddnewPharmacyProfile, CheckMedicine, GetCompletePharmacyInfo } from "../models/pharmacy.models.js";
import { AllPharmacy } from "../models/pharmacy.models.js";
import { SearchPharmacyByName } from "../models/pharmacy.models.js";

export const getPharmacyStock = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const fetchQuery = await pool.query(
      `SELECT
    p.pharma_id,
    p.medicine_id,
    m.medicine_name,
    m.price,
    p.manufacture_date,
    p.expiry_date,
    p.quantity
    FROM pharma2 p
    JOIN medicine m ON p.medicine_id = m.medicine_id
    WHERE p.pharma_id = $1 AND p.quantity > 0`,
      [id]
    );

    const StockQuery = await pool.query(
      `SELECT
    p.pharma_id,
    sum(p.quantity) as TotalQuantity
    FROM pharma2 p
    JOIN medicine m ON p.medicine_id = m.medicine_id
    WHERE p.pharma_id = $1 AND p.quantity > 0 group by p.pharma_id`,
      [id]
    );

    return res.json({ list: fetchQuery?.rows, totalstock: StockQuery?.rows });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    throw err;
  }
};

export const addPharmacyStock = async (req, res) => {
  try {
    const {
      id,
      medicine_name,
      medicine_id,
      manufacture_date,
      expiry_date,
      quantity,
    } = req.body;

    if (
      !id ||
      !medicine_name ||
      !medicine_id ||
      !manufacture_date ||
      !expiry_date ||
      !quantity
    ) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const fetchQuery = await pool.query(
      "INSERT INTO pharma2(pharma_id,medicine_name,medicine_id,manufacture_date,expiry_date,quantity) values($1,$2,$3,$4,$5,$6)",
      [id, medicine_name, medicine_id, manufacture_date, expiry_date, quantity]
    );
    return res.status(200).json({ message: "medicine added successfully" });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    throw err;
  }
};

export const isMedicine = async (req, res) => {
  try {
    const { medicineid } = req.query;

    if (!medicineid) {
      return res.status(400).json({ param: false });
    }

    const Medicine = await CheckMedicine(medicineid);
    if (!Medicine) {
      return res.status(400).json({ exsist: false });
    }

    return res.status(200).json({ Medicine });
  } catch (e) {
    return res.status(500).json({ e });
  }
};

export const SearchPharmacy = async (req, res) => {
  const { Search } = req.query;

  if (!Search) {
    const data = await AllPharmacy();
    return res.json({ data });
  }

  const data = await SearchPharmacyByName(Search);

  if (!data) {
    return res.status(400).json({ pharmacy: false });
  }

  return res.status(200).json({ data });
};

export const UpdateStock = async (req, res) => {
  try {
    const { id, medicine_id, quantity } = req.body;

    if (!id || !medicine_id || quantity === undefined || quantity === null) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "quantity cannot be negative" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const fetchQuery = await pool.query(
      "UPDATE pharma2 SET quantity = $1 WHERE pharma_id = $2 AND medicine_id = $3",
      [quantity, id, medicine_id]
    );
    return res.status(200).json({ message: "stock updated successfully" });
  } catch (e) {
    return res.status(500).json({ e });
  }
};

export const DeleteStock = async (req, res) => {
  try {
    const { id, medicine_id } = req.body;
    if (!id || !medicine_id) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    const userExists = checkUserById(id);
    if (!userExists) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const fetchQuery = await pool.query(
      "DELETE FROM pharma2 WHERE pharma_id = $1 AND medicine_id = $2",
      [id, medicine_id]
    );
    return res.status(200).json({ message: "stock deleted successfully" });
  } catch (e) {
    console.error("Error deleting stock:", err);
    return res.status(500).json({ err });
  }
};

export const getPharmacyDetails = async(req,res) =>{
  try{
   const {id} = req.query

  if(!id){
    return res.status(400).json({id:false})
  }
   
  const isPharmacy = await GetCompletePharmacyInfo(id)

  if(!isPharmacy){
    return res.status(400).json({user:false})
  }
  return res.status(200).json({isPharmacy})
  }
  catch(e){
    return res.status(400).json({error:true})
  }


}

export const CreateProfilePharmacy = async(req,res)=>{
  try{
   const {pharma_id,username,coordinates} =req.body

   if(!pharma_id || username.length <=0 || !coordinates?.lat){
    return res.status(400).json({missingField:true})
   }
   
   const isAddedPharma = await AddnewPharmacyProfile(pharma_id,username,coordinates)

   if(!isAddedPharma){
    return res.status(400).json({useradded:false})
   }
  
   return res.status(200).json({useradded:true})
  }catch(e){
    return res.status(400).json({error:true})
  }
}