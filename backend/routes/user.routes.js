import { Router } from "express";
import LoginFunction from "../controllers/login.controller.js";
import RegisterFunction from "../controllers/register.controller.js";

const userRouter = Router();

userRouter.post("/login", LoginFunction);
userRouter.post("/register", RegisterFunction);

export default userRouter;
