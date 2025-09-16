import { Router } from "express";
import {
  addPharmacyStock,
  getPharmacyStock,
  isMedicine,
  SearchPharmacy,
  UpdateStock,
  DeleteStock,
  getPharmacyDetails
} from "../controllers/pharmacy.controller.js";

const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);
pharmacyRouter.get("/check-medicine", isMedicine);
pharmacyRouter.get("/get-pharmacy", SearchPharmacy);
pharmacyRouter.post("/update-stock", UpdateStock);
pharmacyRouter.post("/delete-stock", DeleteStock);
pharmacyRouter.get("/get-info",getPharmacyDetails)

export default pharmacyRouter;
