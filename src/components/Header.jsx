import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
    const navigate = useNavigate();
    
    const { totalCount } = useCart();
    const { user, logout, isAdmin } = useAuth();
    
    const [search, setSearch] = useState("");
    const [catalogOpen, setCatalogOpen] = useState(false);
    
    const categories = [
        "Смартфоны",
        "Кондиционеры",
        "Ноутбуки",
        "Телевизоры",
        "Холодильники",
        "Морозильник",
        "Стиральные машины",
        "Утюги",
        "Отпариватели",
        "Мини печи",
        "Пылесосы",
        "Принтеры",
    ];
    
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    
    const submitSearch = (e) => {
        e.preventDefault();
        
        const query = search.trim();
        
        if (query) {
            navigate(`/?search=${encodeURIComponent(query)}#products`);
        } else {
            navigate("/#products");
        }
    };
    
    const goToCategory = (category) => {
        setCatalogOpen(false);
        navigate(`/?category=${encodeURIComponent(category)}#products`);
    };
    
    return (
        <>
        <div className="top-header">
        <div className="container top-header-content">
        <div className="top-links">
        <a href="#">Наши магазины</a>
        <a href="#">Способы оплаты</a>
        <a href="#">Рассрочка</a>
        <a href="#">Возврат и обмен</a>
        <a href="#">Доставка</a>
        </div>
        
        <div className="top-right">
        <span>
        Контакт центр: <b>+998 99 818 00 25</b>
        </span>
        
        {!user && (
            <Link to="/admin-login" className="admin-login-top">
            Admin panel
            </Link>
        )}
        
        {isAdmin && (
            <button onClick={handleLogout} className="logout-top-btn">
            Chiqish
            </button>
        )}
        </div>
        </div>
        </div>
        
        <header className="main-header">
        <div className="container main-header-content">
        <Link to="/" className="brand-logo">
        DISKONT
        </Link>
        
        <div className="header-search-wrapper">
        <form onSubmit={submitSearch} className="header-search">
        <button
        type="button"
        className="catalog-btn"
        onClick={() => setCatalogOpen(!catalogOpen)}
        >
        <span>☰</span>
        Каталог
        </button>
        
        <input
        type="text"
        placeholder="Поиск по каталогу"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        
        <button type="submit" className="search-btn">
        ⌕
        </button>
        </form>
        
        {catalogOpen && (
            <div className="catalog-dropdown">
            {categories.map((category) => (
                <button
                key={category}
                type="button"
                onClick={() => goToCategory(category)}
                >
                {category}
                </button>
            ))}
            </div>
        )}
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
        
        <Link to="/cart" className="header-action cart-action">
        <span>🛒</span>
        Корзина
        {totalCount > 0 && <b>{totalCount}</b>}
        </Link>
        
        {!user && (
            <Link to="/admin-login" className="header-action">
            <span>👤</span>
            Войти
            </Link>
        )}
        </nav>
        </div>
        
        <div className="container category-menu">
        {categories.slice(0, 10).map((category) => (
            <button key={category} onClick={() => goToCategory(category)}>
            {category}
            </button>
        ))}
        </div>
        </header>
        </>
    );
}

export default Header;