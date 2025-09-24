import bcrypt from "bcrypt";
import { CheckUserFunction } from "../models/user.models.js";
import { AddUserFunction } from "../models/user.models.js";

const RegisterFunction = async (req, res) => {
  try {
    const {password, email ,type} =
      req.body;
      console.log(password,email,type)
    const isUserExsists = await CheckUserFunction(email, type);

    if (isUserExsists) {
      return res.status(400).json({ message: "user exists" });
    }

    const hassPassword = await bcrypt.hash(password, 10);
    const resInsertUser = await AddUserFunction(
      email,
      hassPassword,
      type
    );

    if (!resInsertUser) {
      return res.status(400).json({ message: "missing values in parameter" });
    }

    return res.status(200).json({ message: "User added successfully" });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default RegisterFunction;
