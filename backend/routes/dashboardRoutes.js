import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
* Admin dashboard statistikasi
* GET /api/dashboard
*/
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        
        const totalOrders = await Order.countDocuments();
        
        const newOrders = await Order.countDocuments({
            status: "new",
        });
        
        const deliveredOrders = await Order.find({
            status: "delivered",
        });
        
        const totalSales = deliveredOrders.reduce((sum, order) => {
            return sum + order.totalPrice;
        }, 0);
        
        const allOrdersSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalPrice",
                    },
                },
            },
        ]);
        
        const totalAllOrdersAmount =
        allOrdersSales.length > 0 ? allOrdersSales[0].total : 0;
        
        const latestOrders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5);
        
        const lowStockProducts = await Product.find({
            stock: {
                $lte: 3,
            },
        })
        .sort({ stock: 1 })
        .limit(5);
        
        res.json({
            totalProducts,
            totalOrders,
            newOrders,
            totalSales,
            totalAllOrdersAmount,
            latestOrders,
            lowStockProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Dashboard statistikani olishda xatolik.",
            error: error.message,
        });
    }
});

export default router;