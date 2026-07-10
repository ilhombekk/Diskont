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
        <a href="#">Наши магазины</a>
        <a href="#">Способы оплаты</a>
        <a href="#">Рассрочка</a>
        <a href="#">Возврат и обмен</a>
        <a href="#">Доставка</a>
        </div>
        
        <div className="top-right">
        <span>
        Контакт центр: <b>+998 71 207 77 88</b>
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
        
        <div className="header-search">
        <button className="catalog-btn">
        <span>☰</span>
        Каталог
        </button>
        
        <input type="text" placeholder="Поиск по каталогу" />
        
        <button className="search-btn">⌕</button>
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
        <Link to="#">Смартфоны</Link>
        <Link to="#">Кондиционеры</Link>
        <Link to="#">Ноутбуки</Link>
        <Link to="#">Телевизоры</Link>
        <Link to="#">Холодильники</Link>
        <Link to="#">Морозильник</Link>
        <Link to="#">Стиральные машины</Link>
        <Link to="#">Утюги</Link>
        <Link to="#">Отпариватели</Link>
        <Link to="#">Мини печи</Link>
        </div>
        </header>
        </>
    );
}

export default Header;