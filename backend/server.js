import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// uploads papkadagi rasmlarni browser orqali ko‘rsatish
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("TexnoShop backend ishlayapti");
});

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB ulandi");
    
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server ${process.env.PORT || 5000}-portda ishlayapti`);
    });
})
.catch((error) => {
    console.error("MongoDB ulanish xatosi:", error);
});