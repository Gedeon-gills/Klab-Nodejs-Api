import { verifyToken } from "../utils/jwt.helper.js";
export const authenticate = (req, res, next) => {
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
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
