import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    
    const monthlyPrice = Math.ceil(product.price / 12);
    
    const isAvailable = product.stock > 0;
    
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    
    const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
    
    return (
        <div className="product-card diskont-card">
        <div className="product-badges">
        {product.isHit && <span className="badge hit">Hit</span>}
        
        {product.isFeatured && <span className="badge benefit">Top</span>}
        
        {hasDiscount && (
            <span className="badge discount">-{discountPercent}%</span>
        )}
        </div>
        
        <Link to={`/product/${product._id}`} className="product-image-box">
        <img src={product.image} alt={product.name} />
        </Link>
        
        <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-category">
        {product.category}
        </Link>
        
        <Link to={`/product/${product._id}`} className="product-title">
        {product.name}
        </Link>
        
        <p className={isAvailable ? "stock available" : "stock not-available"}>
        {isAvailable ? "Sotuvda bor" : "Sotuvda yo‘q"}
        </p>
        
        <p className="monthly-price">
        {monthlyPrice.toLocaleString()} so‘m/oy
        </p>
        
        {hasDiscount && (
            <p className="old-price">{product.oldPrice.toLocaleString()} so‘m</p>
        )}
        
        <p className="price">{product.price.toLocaleString()} so‘m</p>
        
        <button
        onClick={() => addToCart(product)}
        className="buy-btn"
        disabled={!isAvailable}
        >
        {isAvailable ? "Savatchaga" : "Mavjud emas"}
        </button>
        </div>
        </div>
    );
}

export default ProductCard;