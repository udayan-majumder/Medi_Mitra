import { Router } from "express";
import LoginFunction from "../controllers/login.controller.js";
import RegisterFunction from "../controllers/register.controller.js";
import { MiddleWareFunction } from "../middleware/verifytoken.middleware.js";
import UserDetailsFunction from "../controllers/userdetails.controller.js";
import LogoutFunction from "../controllers/logout.controller.js";
import {
  AddToChatHistory,
  GetChatFunction,
} from "../controllers/chat.controller.js";
const userRouter = Router();

userRouter.post("/login", LoginFunction);
userRouter.post("/register", RegisterFunction);
userRouter.get("/userdetails", MiddleWareFunction, UserDetailsFunction);
userRouter.get("/logout", LogoutFunction);
userRouter.get("/get-chat", MiddleWareFunction, GetChatFunction);
userRouter.post("/add-chat", MiddleWareFunction, AddToChatHistory);
export default userRouter;
