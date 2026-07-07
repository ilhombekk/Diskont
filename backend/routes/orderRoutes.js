import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
* Buyurtma yaratish
* POST /api/orders
* Faqat login qilgan user
*/
router.post("/", protect, async (req, res) => {
    try {
        const { customerName, phone, address, payment, items, totalPrice } = req.body;
        
        if (!customerName || !phone || !address) {
            return res.status(400).json({
                message: "Ism, telefon va manzil majburiy.",
            });
        }
        
        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Buyurtmada mahsulot yo‘q.",
            });
        }
        
        /*
        1-qadam:
        Har bir mahsulot MongoDBda bormi va stock yetarlimi tekshiramiz
        */
        for (const item of items) {
            const product = await Product.findById(item.product);
            
            if (!product) {
                return res.status(404).json({
                    message: `${item.name} mahsuloti topilmadi.`,
                });
            }
            
            if (product.stock <= 0) {
                return res.status(400).json({
                    message: `${product.name} hozir sotuvda yo‘q.`,
                });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} uchun omborda faqat ${product.stock} dona bor.`,
                });
            }
        }
        
        /*
        2-qadam:
        Stock yetarli bo‘lsa, har bir mahsulot sonini kamaytiramiz
        */
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: -item.quantity,
                },
            });
        }
        
        /*
        3-qadam:
        Buyurtmani MongoDBga saqlaymiz
        */
        const order = await Order.create({
            user: req.user._id,
            customerName,
            phone,
            address,
            payment,
            items,
            totalPrice,
            status: "new",
        });
        
        res.status(201).json({
            message: "Buyurtma qabul qilindi.",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Buyurtma yaratishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Admin barcha buyurtmalarni ko‘radi
* GET /api/orders
* Faqat admin
*/
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Buyurtmalarni olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* User o‘z buyurtmalarini ko‘radi
* GET /api/orders/my
* Login qilgan user
*/
router.get("/my", protect, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Mening buyurtmalarimni olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Admin bitta buyurtmani ko‘radi
* GET /api/orders/:id
* Faqat admin
*/
router.get("/:id", protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        
        if (!order) {
            return res.status(404).json({
                message: "Buyurtma topilmadi.",
            });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: "Buyurtmani olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Admin buyurtma statusini o‘zgartiradi
* PUT /api/orders/:id/status
* Faqat admin
*/
router.put("/:id/status", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        
        const allowedStatuses = ["new", "accepted", "delivered", "cancelled"];
        
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Noto‘g‘ri status yuborildi.",
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                message: "Buyurtma topilmadi.",
            });
        }
        
        order.status = status;
        
        await order.save();
        
        res.json({
            message: "Buyurtma statusi yangilandi.",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "Statusni yangilashda xatolik.",
            error: error.message,
        });
    }
});

export default router;