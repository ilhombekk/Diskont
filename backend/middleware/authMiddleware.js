import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        if (!token) {
            return res.status(401).json({
                message: "Token topilmadi. Login qiling.",
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                message: "Foydalanuvchi topilmadi.",
            });
        }
        
        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token noto‘g‘ri yoki muddati tugagan.",
        });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Faqat admin kirishi mumkin.",
        });
    }
};