import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        
        category: {
            type: String,
            required: true,
            trim: true,
        },
        
        price: {
            type: Number,
            required: true,
        },
        
        oldPrice: {
            type: Number,
            default: 0,
        },
        
        image: {
            type: String,
            required: true,
        },
        
        description: {
            type: String,
            required: true,
        },
        
        stock: {
            type: Number,
            default: 0,
        },
        
        isHit: {
            type: Boolean,
            default: false,
        },
        
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;