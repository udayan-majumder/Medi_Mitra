import { Router } from "express";
import LoginFunction from "../controllers/login.controller.js";

const router = Router()

router.post("/login",LoginFunction)

export default router