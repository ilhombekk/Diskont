import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function MobileBottomNav() {
    const { totalCount } = useCart();
    const { isAdmin } = useAuth();
    
    return (
        <nav className="mobile-bottom-nav">
        <Link to="/">
        <span>🏠</span>
        Bosh sahifa
        </Link>
        
        <a href="#products">
        <span>🧾</span>
        Katalog
        </a>
        
        <Link to="/cart" className="mobile-bottom-cart">
        <span>🛒</span>
        Savatcha
        {totalCount > 0 && <b>{totalCount}</b>}
        </Link>
        
        {isAdmin ? (
            <Link to="/admin/dashboard">
            <span>📊</span>
            Admin
            </Link>
        ) : (
            <Link to="/admin-login">
            <span>🔐</span>
            Admin
            </Link>
        )}
        </nav>
    );
}

export default MobileBottomNav;