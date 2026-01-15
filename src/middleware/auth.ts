import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.helper.js";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.user = {
      _id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
