import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const sendTelegramMessage = async (text) => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!botToken || !chatId) {
            return;
        }
        
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: "HTML",
            }),
        });
    } catch (error) {
        console.error("Telegram xabar yuborishda xatolik:", error.message);
    }
};

/**
* Buyurtma yaratish
* POST /api/orders
* Public — login shart emas
*/
router.post("/", async (req, res) => {
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
        
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: -item.quantity,
                },
            });
        }
        
        const order = await Order.create({
            user: null,
            customerName,
            phone,
            address,
            payment,
            items,
            totalPrice,
            status: "new",
            adminNote: "",
        });
        
        const productsText = items
        .map((item) => {
            return `• ${item.name} x ${item.quantity} = ${(
                item.price * item.quantity
            ).toLocaleString()} so‘m`;
        })
        .join("\n");
        
        await sendTelegramMessage(`
🛒 <b>Yangi buyurtma</b>
            
👤 Mijoz: ${customerName}
📞 Telefon: ${phone}
📍 Manzil: ${address}
💳 To‘lov: ${payment || "Naqd"}
            
📦 Mahsulotlar:
            ${productsText}
            
💰 Jami: ${Number(totalPrice).toLocaleString()} so‘m
`);
            
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
    * User buyurtmalari — hozir ishlatilmaydi
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
    * Admin status o‘zgartiradi
    * Agar cancelled qilinsa stock qaytadi.
    * Agar cancelled holatdan qayta active qilinsa stock yana kamayadi.
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
            
            const oldStatus = order.status;
            
            if (oldStatus !== "cancelled" && status === "cancelled") {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: {
                            stock: item.quantity,
                        },
                    });
                }
            }
            
            if (oldStatus === "cancelled" && status !== "cancelled") {
                for (const item of order.items) {
                    const product = await Product.findById(item.product);
                    
                    if (!product) {
                        return res.status(404).json({
                            message: `${item.name} mahsuloti topilmadi.`,
                        });
                    }
                    
                    if (product.stock < item.quantity) {
                        return res.status(400).json({
                            message: `${product.name} uchun omborda faqat ${product.stock} dona bor.`,
                        });
                    }
                }
                
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: {
                            stock: -item.quantity,
                        },
                    });
                }
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
    
    /**
    * Admin buyurtmaga izoh yozadi
    * PUT /api/orders/:id/note
    */
    router.put("/:id/note", protect, adminOnly, async (req, res) => {
        try {
            const { adminNote } = req.body;
            
            const order = await Order.findById(req.params.id);
            
            if (!order) {
                return res.status(404).json({
                    message: "Buyurtma topilmadi.",
                });
            }
            
            order.adminNote = adminNote || "";
            
            await order.save();
            
            res.json({
                message: "Admin izoh saqlandi.",
                order,
            });
        } catch (error) {
            res.status(500).json({
                message: "Admin izohni saqlashda xatolik.",
                error: error.message,
            });
        }
    });
    
    export default router;