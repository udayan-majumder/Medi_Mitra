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
