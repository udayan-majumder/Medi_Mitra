import { Router } from "express";
import { fetchAllMedicines } from "../controllers/medicine.controller.js";

const medicineRouter = Router();

medicineRouter.get("/fetch", fetchAllMedicines);

export default medicineRouter;
