import { Router } from "express";
import { addPharmacyStock, getPharmacyStock,isMedicine,SearchPharmacy } from "../controllers/pharmacy.controller.js";

const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);
pharmacyRouter.get("/check-medicine",isMedicine)
pharmacyRouter.get("/get-pharmacy",SearchPharmacy)
export default pharmacyRouter;
