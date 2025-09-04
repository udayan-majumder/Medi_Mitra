import {Router} from "express"
import RegisterFunction from "../controllers/register.controller.js"

const router = Router()

router.post("/register",RegisterFunction)

export default router

