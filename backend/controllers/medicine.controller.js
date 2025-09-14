import pool from "../db/db.js";

let medicineCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 60 * 1000; // 60 seconds

export const fetchAllMedicines = async (req, res) => {
  const now = Date.now();

  if (medicineCache && now - cacheTimestamp < CACHE_TTL) {
    return res.send(medicineCache);
  }

  try {
    const fetchQuery = await pool.query("SELECT * FROM medicine");
    medicineCache = fetchQuery.rows;
    cacheTimestamp = now;
    return res.send(medicineCache);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    throw err;
  }
};
