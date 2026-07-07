import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
* Multer storage
*/
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

/**
* Faqat rasm fayllarga ruxsat
*/
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Faqat jpg, jpeg, png yoki webp rasm yuklash mumkin."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

/**
* Barcha mahsulotlar
* GET /api/products
*/
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotlarni olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Bitta mahsulot
* GET /api/products/:id
*/
router.get("/", async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
        
        const filter = {};
        
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }
        
        if (category && category !== "Barchasi") {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            
            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }
            
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }
        
        const products = await Product.find(filter).sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotlarni olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Mahsulot qo‘shish
* POST /api/products
* Admin
*
* imageFile — kompyuterdan yuklangan rasm
* imageUrl — internetdagi rasm URL
*/
router.post("/", protect, adminOnly, upload.single("imageFile"), async (req, res) => {
    try {
        const { name, category, price, imageUrl, description, stock } = req.body;
        
        if (!name || !category || !price || !description) {
            return res.status(400).json({
                message: "Nomi, kategoriya, narx va izoh majburiy.",
            });
        }
        
        let image = imageUrl;
        
        if (req.file) {
            image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
        
        if (!image) {
            return res.status(400).json({
                message: "Rasm yuklang yoki rasm URL kiriting.",
            });
        }
        
        const product = await Product.create({
            name,
            category,
            price: Number(price),
            image,
            description,
            stock: Number(stock) || 0,
        });
        
        res.status(201).json({
            message: "Mahsulot qo‘shildi.",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Mahsulot qo‘shishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Mahsulot tahrirlash
* PUT /api/products/:id
* Admin
*/
router.put("/:id", protect, adminOnly, upload.single("imageFile"), async (req, res) => {
    try {
        const { name, category, price, imageUrl, description, stock } = req.body;
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                message: "Mahsulot topilmadi.",
            });
        }
        
        let image = product.image;
        
        if (imageUrl) {
            image = imageUrl;
        }
        
        if (req.file) {
            image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }
        
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price ? Number(price) : product.price;
        product.image = image;
        product.description = description || product.description;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        
        await product.save();
        
        res.json({
            message: "Mahsulot yangilandi.",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotni yangilashda xatolik.",
            error: error.message,
        });
    }
});

/**
* Mahsulot o‘chirish
* DELETE /api/products/:id
* Admin
*/
router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                message: "Mahsulot topilmadi.",
            });
        }
        
        res.json({
            message: "Mahsulot o‘chirildi.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotni o‘chirishda xatolik.",
            error: error.message,
        });
    }
});

export default router;