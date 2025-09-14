import { Router } from "express";
import LoginFunction from "../controllers/login.controller.js";
import RegisterFunction from "../controllers/register.controller.js";
import { MiddleWareFunction } from "../middleware/verifytoken.middleware.js";
import {UserDetailsFunction,PatientInfoFunction,CompletePatientInfoFunction} from "../controllers/userdetails.controller.js";
import LogoutFunction from "../controllers/logout.controller.js";
import {
  AddToChatHistory,
  DeleteChatHistory,
  GetChatFunction,
} from "../controllers/chat.controller.js";
import upload from "../middleware/multer.middleware.js";
import { uploadFile } from "../controllers/imageupload.controller.js";



const userRouter = Router();

userRouter.post("/login", LoginFunction);
userRouter.post("/register", RegisterFunction);
userRouter.get("/userdetails", MiddleWareFunction, UserDetailsFunction);
userRouter.get("/patient-info",PatientInfoFunction)
userRouter.get("/complete-patient-info",CompletePatientInfoFunction)
userRouter.get("/logout", LogoutFunction);
userRouter.get("/get-chat", MiddleWareFunction, GetChatFunction);
userRouter.post("/add-chat", MiddleWareFunction, AddToChatHistory);
userRouter.post("/delete-chat", MiddleWareFunction, DeleteChatHistory);
userRouter.post("/upload-pescription", upload.single("file"), uploadFile);

export default userRouter;
