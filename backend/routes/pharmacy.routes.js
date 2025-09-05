import { Router } from "express";
import { addPharmacyStock, getPharmacyStock } from "../controllers/pharmacy.controller.js";

const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);

export default pharmacyRouter;
