import { Router } from "express";
import { addPharmacyStock, getPharmacyStock,isMedicine } from "../controllers/pharmacy.controller.js";
const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);
pharmacyRouter.get("/check-medicine",isMedicine)

export default pharmacyRouter;
