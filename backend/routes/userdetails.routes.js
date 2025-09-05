import {Router} from "express"
import { MiddleWareFunction } from "../middleware/verifytoken.middleware.js";
import UserDetailsFunction from "../controllers/userdetails.controllers.js";

const router = Router()
 
router.get("/userdetails",MiddleWareFunction,UserDetailsFunction)

export default router
