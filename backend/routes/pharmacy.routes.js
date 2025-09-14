import { Router } from "express";
import {
  addPharmacyStock,
  getPharmacyStock,
  isMedicine,
  SearchPharmacy,
  UpdateStock,
  DeleteStock,
} from "../controllers/pharmacy.controller.js";

const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);
pharmacyRouter.get("/check-medicine", isMedicine);
pharmacyRouter.get("/get-pharmacy", SearchPharmacy);
pharmacyRouter.post("/update-stock", UpdateStock);
pharmacyRouter.post("/delete-stock", DeleteStock);
export default pharmacyRouter;
