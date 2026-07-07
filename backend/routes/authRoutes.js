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
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email va password majburiy.",
            });
        }
        
        const existsUser = await User.findOne({ email });
        
        if (existsUser) {
            return res.status(400).json({
                message: "Bu email allaqachon ro‘yxatdan o‘tgan.",
            });
        }
        
        const usersCount = await User.countDocuments();
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            
            // Birinchi ro‘yxatdan o‘tgan user admin bo‘ladi
            role: usersCount === 0 ? "admin" : "user",
        });
        
        res.status(201).json({
            message: "Ro‘yxatdan o‘tish muvaffaqiyatli.",
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
            message: "Register xatosi.",
            error: error.message,
        });
    }
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