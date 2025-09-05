import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const GenerateToken = (payload) => {
  try {
    const newpaylaod = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      location: payload.location,
      type: payload.type,
    };

    const token = jwt.sign(newpaylaod, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (e) {
    console.log("error", e);
  }
};
