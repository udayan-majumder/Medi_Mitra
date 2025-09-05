import { Router } from "express";
import { fetchAllMedicines } from "../controllers/medicine.controller";

const MedicineRouter = Router();

MedicineRouter.get("/fetch", fetchAllMedicines);

export default MedicineRouter;