import { Router } from "express";
import { fetchAllMedicines } from "../models/medicine.models.js";

const MedicineRouter = Router();

MedicineRouter.get("/fetch", fetchAllMedicines);

export default MedicineRouter;