import { Router } from "express";
import {
  addPharmacyStock,
  getPharmacyStock,
  isMedicine,
  SearchPharmacy,
  UpdateStock,
  DeleteStock,
  getPharmacyDetails,
  CreateProfilePharmacy
} from "../controllers/pharmacy.controller.js";
import { CompletePharmacyInfoFunction } from "../controllers/userdetails.controller.js";


const pharmacyRouter = Router();

pharmacyRouter.get("/get-stock", getPharmacyStock);
pharmacyRouter.post("/add-stock", addPharmacyStock);
pharmacyRouter.get("/check-medicine", isMedicine);
pharmacyRouter.get("/get-pharmacy", SearchPharmacy);
pharmacyRouter.post("/update-stock", UpdateStock);
pharmacyRouter.post("/delete-stock", DeleteStock);
pharmacyRouter.get("/pharmacy-profile-info",CompletePharmacyInfoFunction)
pharmacyRouter.post("/pharmacy-profile-add", CreateProfilePharmacy);
pharmacyRouter.get("/get-info",getPharmacyDetails)

export default pharmacyRouter;
