import { ValidateToken } from "../utils/jwt.utlis.js";

export const MiddleWareFunction = async (req, res, next) => {
  try {
    const payload = req.cookies.token;

    if (!payload) {
      return res.status(404).json({ user: false });
    }
    const token = ValidateToken(payload);

    if (token.expired) {
      return res.status(400).json({ expired: true });
    }

    if (!token) {
      return res.status(400).json({ invalid: true });
    }
    req.user = token;
    next();
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
