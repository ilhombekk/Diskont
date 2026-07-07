import { useEffect, useState } from "react";
import api from "../api/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getMyOrders = async () => {
        try {
            const response = await api.get("/orders/my");
            setOrders(response.data);
        } catch (error) {
            console.error("Buyurtmalarni olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getMyOrders();
    }, []);
    
    if (loading) {
        return (
            <div className="container">
            <h2>Yuklanmoqda...</h2>
            </div>
        );
    }
    
    return (
        <div className="container">
        <h1>Mening buyurtmalarim</h1>
        
        {orders.length === 0 ? (
            <div className="empty-cart">
            <h2>Buyurtmalar yo‘q</h2>
            <p>Siz hali buyurtma bermagansiz.</p>
            </div>
        ) : (
            <div className="orders-list">
            {orders.map((order) => (
                <div key={order._id} className="admin-order-card">
                <div className="order-top">
                <div>
                <h3>Buyurtma #{order._id.slice(-6)}</h3>
                <p>Telefon: {order.phone}</p>
                <p>Manzil: {order.address}</p>
                <p>To‘lov: {order.payment}</p>
                <p>Status: <b>{order.status}</b></p>
                <p>
                Sana:{" "}
                {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                </p>
                </div>
                
                <div>
                <b>{order.totalPrice.toLocaleString()} so‘m</b>
                </div>
                </div>
                
                <hr />
                
                {order.items.map((item, index) => (
                    <div key={index} className="order-product-row">
                    <span>
                    {item.name} x {item.quantity}
                    </span>
                    
                    <b>{(item.price * item.quantity).toLocaleString()} so‘m</b>
                    </div>
                ))}
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default MyOrders;