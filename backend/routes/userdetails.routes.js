import {Router} from "express"
import { MiddleWareFunction } from "../middleware/verifytoken.middleware.js";
import UserDetailsFunction from "../controllers/userdetails.controller.js";

const router = Router()
 
router.get("/userdetails",MiddleWareFunction,UserDetailsFunction)

export default router
