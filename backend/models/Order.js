import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    
    name: {
        type: String,
        required: true,
    },
    
    price: {
        type: Number,
        required: true,
    },
    
    quantity: {
        type: Number,
        required: true,
    },
    
    image: {
        type: String,
    },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        
        customerName: {
            type: String,
            required: true,
        },
        
        phone: {
            type: String,
            required: true,
        },
        
        address: {
            type: String,
            required: true,
        },
        
        payment: {
            type: String,
            default: "Naqd",
        },
        
        items: [orderItemSchema],
        
        totalPrice: {
            type: Number,
            required: true,
        },
        
        status: {
            type: String,
            enum: ["new", "accepted", "delivered", "cancelled"],
            default: "new",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;