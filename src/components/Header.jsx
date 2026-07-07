import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
    const navigate = useNavigate();
    
    const { totalCount } = useCart();
    const { user, logout, isAdmin } = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    
    return (
        <>
        <div className="top-header">
        <div className="container top-header-content">
        <div className="top-links">
        <a href="#">Bizning do‘konlar</a>
        <a href="#">To‘lov usullari</a>
        <a href="#">Muddatli to‘lov</a>
        <a href="#">Qaytarish va almashtirish</a>
        <a href="#">Yetkazib berish</a>
        </div>
        
        <div className="contact-center">
        <span>Kontakt markaz:</span>
        <b>+998 99 818 00 25</b>
        </div>
        </div>
        </div>
        
        <header className="main-header">
        <div className="container main-header-content">
        <Link to="/" className="brand-logo">
        <span>Diskont</span>
        <small>tech market</small>
        </Link>
        
        <button className="catalog-btn">
        <span>☰</span>
        Katalog
        </button>
        
        <div className="header-search">
        <input type="text" placeholder="Mahsulotlarni qidirish..." />
        <button>Qidirish</button>
        </div>
        
        <nav className="header-actions">
        {isAdmin && (
            <>
            <Link to="/admin/dashboard" className="header-action">
            <span>📊</span>
            Dashboard
            </Link>
            
            <Link to="/admin/products" className="header-action">
            <span>📦</span>
            Mahsulotlar
            </Link>
            
            <Link to="/admin/orders" className="header-action">
            <span>🧾</span>
            Buyurtmalar
            </Link>
            </>
        )}
        
        {user && !isAdmin && (
            <Link to="/my-orders" className="header-action">
            <span>🧾</span>
            Buyurtmalarim
            </Link>
        )}
        
        <Link to="/cart" className="header-action cart-action">
        <span>🛒</span>
        Savatcha
        {totalCount > 0 && <b>{totalCount}</b>}
        </Link>
        
        {!user ? (
            <Link to="/login" className="login-btn">
            Kirish
            </Link>
        ) : (
            <div className="user-menu">
            <span>{user.name}</span>
            <button onClick={handleLogout}>Chiqish</button>
            </div>
        )}
        </nav>
        </div>
        </header>
        
        <div className="category-strip">
        <div className="container category-strip-content">
        <Link to="#">Smartfonlar</Link>
        <Link to="#">Konditsionerlar</Link>
        <Link to="#">Noutbuklar</Link>
        <Link to="#">Televizorlar</Link>
        <Link to="#">Muzlatgichlar</Link>
        <Link to="#">Kir yuvish mashinalari</Link>
        <Link to="#">Changyutgichlar</Link>
        </div>
        </div>
        </>
    );
}

export default Header;