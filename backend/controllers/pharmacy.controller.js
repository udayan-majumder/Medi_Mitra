import pool from "../db/db.js";
import { checkUserById } from "../models/user.models.js";

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
    FROM pharma p
    JOIN medicine m ON p.medicine_id = m.medicine_id
    WHERE p.pharma_id = $1`,
      [id]
    );

    return res.send(fetchQuery.rows);
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
      "INSERT INTO pharma(pharma_id,medicine_name,medicine_id,manufacture_date,expiry_date,quantity) values($1,$2,$3,$4,$5,$6)",
      [id, medicine_name, medicine_id, manufacture_date, expiry_date, quantity]
    );
    return res.status(200).json({ message: "medicine added successfully" });
  } catch (err) {
    console.error("Error fetching medicines:", err);
    throw err;
  }
};
