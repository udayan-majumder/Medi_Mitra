import bcrypt from "bcrypt";
import { CheckUserFunction } from "../models/user.models.js";
import { GenerateToken } from "../utils/jwt.utlis.js";

const LoginFunction = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    const isUserExsists = await CheckUserFunction(email, type);

    if (!isUserExsists) {
      return res.status(400).json({ user: false });
    }

    const hassPassword = isUserExsists.password;
    const isPasswordMatch = await bcrypt.compare(password, hassPassword);

    if (!isPasswordMatch) {
      return res.status(400).json({ correctpass: false });
    }

    const token = GenerateToken(isUserExsists);
    if (!token) {
      return res.status(400).json({ tokengenerated: false });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      id: isUserExsists.id,
      username: isUserExsists.username,
      email: isUserExsists.email,
      location: isUserExsists.location,
      type: isUserExsists.type,
    });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

export default LoginFunction;
