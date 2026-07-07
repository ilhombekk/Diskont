import { useEffect, useState } from "react";
import api from "../api/api";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getDashboard = async () => {
        try {
            const response = await api.get("/dashboard");
            setStats(response.data);
        } catch (error) {
            console.error("Dashboard xatosi:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getDashboard();
    }, []);
    
    if (loading) {
        return (
            <div className="container">
            <h2>Yuklanmoqda...</h2>
            </div>
        );
    }
    
    if (!stats) {
        return (
            <div className="container">
            <h2>Dashboard ma’lumotlari topilmadi</h2>
            </div>
        );
    }
    
    return (
        <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="dashboard-grid">
        <div className="dashboard-card">
        <p>Jami mahsulotlar</p>
        <h2>{stats.totalProducts}</h2>
        </div>
        
        <div className="dashboard-card">
        <p>Jami buyurtmalar</p>
        <h2>{stats.totalOrders}</h2>
        </div>
        
        <div className="dashboard-card">
        <p>Yangi buyurtmalar</p>
        <h2>{stats.newOrders}</h2>
        </div>
        
        <div className="dashboard-card">
        <p>Jami buyurtma summasi</p>
        <h2>{stats.totalAllOrdersAmount.toLocaleString()} so‘m</h2>
        </div>
        
        <div className="dashboard-card">
        <p>Yetkazilgan savdo summasi</p>
        <h2>{stats.totalSales.toLocaleString()} so‘m</h2>
        </div>
        </div>
        
        <div className="dashboard-section">
        <h2>Oxirgi buyurtmalar</h2>
        
        {stats.latestOrders.length === 0 ? (
            <p>Buyurtmalar yo‘q</p>
        ) : (
            <div className="admin-table-wrapper">
            <table className="admin-table">
            <thead>
            <tr>
            <th>Mijoz</th>
            <th>Telefon</th>
            <th>Status</th>
            <th>Summa</th>
            <th>Sana</th>
            </tr>
            </thead>
            
            <tbody>
            {stats.latestOrders.map((order) => (
                <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.status}</td>
                <td>{order.totalPrice.toLocaleString()} so‘m</td>
                <td>
                {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                </td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        )}
        </div>
        
        <div className="dashboard-section">
        <h2>Omborda kam qolgan mahsulotlar</h2>
        
        {stats.lowStockProducts.length === 0 ? (
            <p>Kam qolgan mahsulotlar yo‘q</p>
        ) : (
            <div className="admin-table-wrapper">
            <table className="admin-table">
            <thead>
            <tr>
            <th>Rasm</th>
            <th>Nomi</th>
            <th>Kategoriya</th>
            <th>Soni</th>
            </tr>
            </thead>
            
            <tbody>
            {stats.lowStockProducts.map((product) => (
                <tr key={product._id}>
                <td>
                <img src={product.image} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
        )}
        </div>
        </div>
    );
}

export default AdminDashboard;