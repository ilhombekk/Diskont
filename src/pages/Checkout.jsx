import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function Checkout() {
    const { cartItems, totalPrice, clearCart } = useCart();
    
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        payment: "Naqd",
    });
    
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    
    const submitOrder = async (e) => {
        e.preventDefault();
        
        if (!form.name || !form.phone || !form.address) {
            alert("Iltimos, ism, telefon va manzilni to‘ldiring");
            return;
        }
        
        try {
            setError("");
            
            const orderItems = cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            }));
            
            await api.post("/orders", {
                customerName: form.name,
                phone: form.phone,
                address: form.address,
                payment: form.payment,
                items: orderItems,
                totalPrice,
            });
            
            clearCart();
            setSuccess(true);
        } catch (error) {
            setError(error.response?.data?.message || "Buyurtma yuborishda xatolik");
        }
    };
    
    if (success) {
        return (
            <div className="container success-box">
            <h1>Buyurtma qabul qilindi!</h1>
            <p>Tez orada operator siz bilan bog‘lanadi.</p>
            
            <Link to="/" className="btn">
            Bosh sahifaga qaytish
            </Link>
            </div>
        );
    }
    
    if (cartItems.length === 0) {
        return (
            <div className="container empty-cart">
            <h2>Savatcha bo‘sh</h2>
            
            <Link to="/" className="btn">
            Mahsulot tanlash
            </Link>
            </div>
        );
    }
    
    return (
        <div className="container">
        <h1>Buyurtma berish</h1>
        
        {error && <p className="error-text">{error}</p>}
        
        <div className="checkout-layout">
        <form onSubmit={submitOrder} className="checkout-form">
        <label>
        Ismingiz
        <input
        type="text"
        name="name"
        placeholder="Masalan: Ali"
        value={form.name}
        onChange={handleChange}
        />
        </label>
        
        <label>
        Telefon raqamingiz
        <input
        type="text"
        name="phone"
        placeholder="+998 90 123 45 67"
        value={form.phone}
        onChange={handleChange}
        />
        </label>
        
        <label>
        Manzil
        <textarea
        name="address"
        placeholder="Yetkazib berish manzili"
        value={form.address}
        onChange={handleChange}
        />
        </label>
        
        <label>
        To‘lov turi
        <select name="payment" value={form.payment} onChange={handleChange}>
        <option value="Naqd">Naqd</option>
        <option value="Karta">Karta orqali</option>
        <option value="Click">Click</option>
        <option value="Payme">Payme</option>
        </select>
        </label>
        
        <button type="submit" className="btn">
        Buyurtmani tasdiqlash
        </button>
        </form>
        
        <div className="order-summary">
        <h2>Buyurtma</h2>
        
        {cartItems.map((item) => (
            <div key={item._id} className="order-row">
            <span>
            {item.name} x {item.quantity}
            </span>
            
            <b>{(item.price * item.quantity).toLocaleString()} so‘m</b>
            </div>
        ))}
        
        <hr />
        
        <h3>Jami: {totalPrice.toLocaleString()} so‘m</h3>
        </div>
        </div>
        </div>
    );
}

export default Checkout;