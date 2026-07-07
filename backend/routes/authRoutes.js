import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign(
        {
            id: userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// Register
router.post("/register", async (req, res) => {
    return res.status(403).json({
        message: "Ro‘yxatdan o‘tish yopilgan.",
    });
});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                message: "Email yoki parol noto‘g‘ri.",
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                message: "Email yoki parol noto‘g‘ri.",
            });
        }
        
        res.json({
            message: "Login muvaffaqiyatli.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({
            message: "Login xatosi.",
            error: error.message,
        });
    }
});

// Current user
router.get("/me", protect, async (req, res) => {
    res.json({
        user: req.user,
    });
});

export default router;