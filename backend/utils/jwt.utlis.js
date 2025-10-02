import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const GenerateToken = (payload) => {
  try {
    const newpaylaod = {
      id: payload.id,
      email: payload.email,
      type: payload.type,
    };

    const token = jwt.sign(newpaylaod, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (e) {
    console.error("error", e);
  }
};

export const ValidateToken = (payload) => {
  try {
    const isValidToken = jwt.verify(payload, process.env.JWT_SECRET);
    if (isValidToken.id) {
      return isValidToken;
    }
    return false;
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return { expired: true };
    }
  }
};
