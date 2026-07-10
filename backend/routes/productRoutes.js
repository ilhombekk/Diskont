import express from "express";
import multer from "multer";
import path from "path";
import csvParser from "csv-parser";
import { Readable } from "stream";

import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const parseBoolean = (value) => {
    if (typeof value === "boolean") return value;
    
    const normalized = String(value || "")
    .trim()
    .toLowerCase();
    
    return normalized === "true" || normalized === "1" || normalized === "ha";
};

const parseNumber = (value, defaultValue = 0) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }
    
    const cleaned = String(value)
    .replace(/\s/g, "")
    .replace(/,/g, ".");
    
    const number = Number(cleaned);
    
    return Number.isNaN(number) ? defaultValue : number;
};

/**
* Image upload storage
*/
const imageStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Faqat jpg, jpeg, png yoki webp rasm yuklash mumkin."), false);
    }
};

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

/**
* CSV import upload
*/
const uploadCsv = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
    fileFilter(req, file, cb) {
        const allowedMimeTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/csv",
        ];
        
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedMimeTypes.includes(file.mimetype) || ext === ".csv") {
            cb(null, true);
        } else {
            cb(new Error("Faqat CSV fayl yuklash mumkin."), false);
        }
    },
});

const parseCsvBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const rows = [];
        
        const stream = Readable.from(buffer.toString("utf8"));
        
        stream
        .pipe(csvParser())
        .on("data", (row) => {
            rows.push(row);
        })
        .on("end", () => {
            resolve(rows);
        })
        .on("error", (error) => {
            reject(error);
        });
    });
};

/**
* Barcha mahsulotlar
* GET /api/products
*/
router.get("/", async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
        
        const filter = {};
        
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        
        if (category && category !== "Barchasi") {
            filter.category = category;
        }
        
        if (minPrice || maxPrice) {
            filter.price = {};
            
            if (minPrice) {
                filter.price.$gte = parseNumber(minPrice);
            }
            
            if (maxPrice) {
                filter.price.$lte = parseNumber(maxPrice);
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
* CSV orqali mahsulot import qilish
* POST /api/products/import
*
* MUHIM:
* Bu route /:id dan oldin turishi shart.
*/
router.post(
    "/import",
    protect,
    adminOnly,
    uploadCsv.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "CSV fayl tanlanmagan.",
                });
            }
            
            const rows = await parseCsvBuffer(req.file.buffer);
            
            if (!rows || rows.length === 0) {
                return res.status(400).json({
                    message: "CSV faylda ma’lumot yo‘q.",
                });
            }
            
            const productsToCreate = [];
            const errors = [];
            
            rows.forEach((row, index) => {
                const line = index + 2;
                
                const name = row.name?.trim();
                const category = row.category?.trim();
                const price = parseNumber(row.price);
                const oldPrice = parseNumber(row.oldPrice);
                const image = row.imageUrl?.trim() || row.image?.trim();
                const description = row.description?.trim();
                const stock = parseNumber(row.stock);
                const isHit = parseBoolean(row.isHit);
                const isFeatured = parseBoolean(row.isFeatured);
                
                if (!name) {
                    errors.push(`${line}-qatorda name yo‘q.`);
                }
                
                if (!category) {
                    errors.push(`${line}-qatorda category yo‘q.`);
                }
                
                if (!price || price <= 0) {
                    errors.push(`${line}-qatorda price noto‘g‘ri.`);
                }
                
                if (!image) {
                    errors.push(`${line}-qatorda imageUrl yo‘q.`);
                }
                
                if (!description) {
                    errors.push(`${line}-qatorda description yo‘q.`);
                }
                
                if (name && category && price > 0 && image && description) {
                    productsToCreate.push({
                        name,
                        category,
                        price,
                        oldPrice,
                        image,
                        description,
                        stock,
                        isHit,
                        isFeatured,
                    });
                }
            });
            
            if (errors.length > 0) {
                return res.status(400).json({
                    message: "CSV faylda xatolik bor.",
                    errors,
                });
            }
            
            const createdProducts = await Product.insertMany(productsToCreate);
            
            res.status(201).json({
                message: `${createdProducts.length} ta mahsulot import qilindi.`,
                count: createdProducts.length,
                products: createdProducts,
            });
        } catch (error) {
            res.status(500).json({
                message: "CSV import qilishda xatolik.",
                error: error.message,
            });
        }
    }
);

/**
* Bitta mahsulot
* GET /api/products/:id
*
* MUHIM:
* Bu route /import dan keyin turishi kerak.
*/
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                message: "Mahsulot topilmadi.",
                id,
            });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Mahsulotni olishda xatolik.",
            error: error.message,
        });
    }
});

/**
* Mahsulot qo‘shish
* POST /api/products
*/
router.post(
    "/",
    protect,
    adminOnly,
    uploadImage.single("imageFile"),
    async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                oldPrice,
                imageUrl,
                description,
                stock,
                isHit,
                isFeatured,
            } = req.body;
            
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
                price: parseNumber(price),
                oldPrice: parseNumber(oldPrice),
                image,
                description,
                stock: parseNumber(stock),
                isHit: parseBoolean(isHit),
                isFeatured: parseBoolean(isFeatured),
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
    }
);

/**
* Mahsulot tahrirlash
* PUT /api/products/:id
*/
router.put(
    "/:id",
    protect,
    adminOnly,
    uploadImage.single("imageFile"),
    async (req, res) => {
        try {
            const {
                name,
                category,
                price,
                oldPrice,
                imageUrl,
                description,
                stock,
                isHit,
                isFeatured,
            } = req.body;
            
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
            product.price = price !== undefined ? parseNumber(price) : product.price;
            product.oldPrice =
            oldPrice !== undefined ? parseNumber(oldPrice) : product.oldPrice;
            product.image = image;
            product.description = description || product.description;
            product.stock = stock !== undefined ? parseNumber(stock) : product.stock;
            product.isHit = isHit !== undefined ? parseBoolean(isHit) : product.isHit;
            product.isFeatured =
            isFeatured !== undefined ? parseBoolean(isFeatured) : product.isFeatured;
            
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
    }
);

/**
* Mahsulot o‘chirish
* DELETE /api/products/:id
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