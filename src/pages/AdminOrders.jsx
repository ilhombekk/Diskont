import { useEffect, useState } from "react";
import api from "../api/api";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getOrders = async () => {
        try {
            setLoading(true);
            
            const response = await api.get("/orders");
            
            setOrders(response.data);
        } catch (error) {
            console.error("Buyurtmalarni olishda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getOrders();
    }, []);
    
    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, {
                status,
            });
            
            getOrders();
        } catch (error) {
            alert(error.response?.data?.message || "Statusni o‘zgartirishda xatolik");
        }
    };
    
    const updateNote = async (id, adminNote) => {
        try {
            await api.put(`/orders/${id}/note`, {
                adminNote,
            });
            
            getOrders();
        } catch (error) {
            alert(error.response?.data?.message || "Izohni saqlashda xatolik");
        }
    };
    
    const getStatusText = (status) => {
        if (status === "new") return "Yangi";
        if (status === "accepted") return "Qabul qilindi";
        if (status === "delivered") return "Yetkazildi";
        if (status === "cancelled") return "Bekor qilindi";
        
        return status;
    };
    
    const getStatusClass = (status) => {
        if (status === "new") return "status-new";
        if (status === "accepted") return "status-accepted";
        if (status === "delivered") return "status-delivered";
        if (status === "cancelled") return "status-cancelled";
        
        return "";
    };
    
    if (loading) {
        return (
            <div className="container">
            <h2>Yuklanmoqda...</h2>
            </div>
        );
    }
    
    return (
        <div className="container">
        <h1>Admin panel — Buyurtmalar</h1>
        
        {orders.length === 0 ? (
            <div className="empty-cart">
            <h2>Buyurtmalar yo‘q</h2>
            <p>Hozircha hech qanday buyurtma kelmagan.</p>
            </div>
        ) : (
            <div className="orders-list">
            {orders.map((order) => (
                <div key={order._id} className="admin-order-card">
                <div className="order-top">
                <div>
                <h3>Buyurtma #{order._id.slice(-6)}</h3>
                
                <p>
                <b>Mijoz:</b> {order.customerName}
                </p>
                
                <p>
                <b>Telefon:</b> {order.phone}
                </p>
                
                <p>
                <b>Manzil:</b> {order.address}
                </p>
                
                <p>
                <b>To‘lov:</b> {order.payment}
                </p>
                
                <p>
                <b>Sana:</b>{" "}
                {new Date(order.createdAt).toLocaleString("uz-UZ")}
                </p>
                
                {order.user && (
                    <p>
                    <b>User:</b> {order.user?.name} — {order.user?.email}
                    </p>
                )}
                </div>
                
                <div className="order-status-box">
                <b>{order.totalPrice.toLocaleString()} so‘m</b>
                
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                {getStatusText(order.status)}
                </span>
                
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
                
                <textarea
                className="admin-note-input"
                placeholder="Admin izoh..."
                defaultValue={order.adminNote || ""}
                onBlur={(e) => updateNote(order._id, e.target.value)}
                />
                
                <hr />
                
                <div className="order-products">
                {order.items.map((item, index) => (
                    <div key={index} className="order-product-row">
                    <div className="order-product-info">
                    {item.image && (
                        <img src={item.image} alt={item.name} />
                    )}
                    
                    <span>
                    {item.name} x {item.quantity}
                    </span>
                    </div>
                    
                    <b>
                    {(item.price * item.quantity).toLocaleString()} so‘m
                    </b>
                    </div>
                ))}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default AdminOrders;