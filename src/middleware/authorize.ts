import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.js";

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
    next();
  };