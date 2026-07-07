import { useEffect, useState } from "react";
import api from "../api/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    
    const getOrders = async () => {
        const response = await api.get("/orders");
        setOrders(response.data);
    };
    
    useEffect(() => {
        getOrders();
    }, []);
    
    const updateStatus = async (id, status) => {
        await api.put(`/orders/${id}/status`, {
            status,
        });
        
        getOrders();
    };
    
    return (
        <div className="container">
        <h1>Admin panel — Buyurtmalar</h1>
        
        <div className="orders-list">
        {orders.map((order) => (
            <div key={order._id} className="admin-order-card">
            <div className="order-top">
            <div>
            <h3>{order.customerName}</h3>
            <p>Telefon: {order.phone}</p>
            <p>Manzil: {order.address}</p>
            <p>To‘lov: {order.payment}</p>
            <p>
            User: {order.user?.name} — {order.user?.email}
            </p>
            </div>
            
            <div>
            <b>{order.totalPrice.toLocaleString()} so‘m</b>
            
            <select
            value={order.status}
            onChange={(e) => updateStatus(order._id, e.target.value)}
            >
            <option value="new">Yangi</option>
            <option value="accepted">Qabul qilindi</option>
            <option value="delivered">Yetkazildi</option>
            <option value="cancelled">Bekor qilindi</option>
            </select>
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
        </div>
    );
}

export default AdminOrders;