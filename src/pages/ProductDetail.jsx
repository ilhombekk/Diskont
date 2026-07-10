import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/api";

function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const getProduct = async () => {
        try {
            setLoading(true);
            
            const response = await api.get(`/products/${id}`);
            
            setProduct(response.data);
        } catch (error) {
            console.error("Mahsulotni olishda xatolik:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        getProduct();
    }, [id]);
    
    if (loading) {
        return (
            <div className="container">
            <h2>Yuklanmoqda...</h2>
            </div>
        );
    }
    
    if (!product) {
        return (
            <div className="container">
            <div className="empty-cart">
            <h2>Mahsulot topilmadi</h2>
            
            <Link to="/" className="btn">
            Bosh sahifaga qaytish
            </Link>
            </div>
            </div>
        );
    }
    
    const isAvailable = product.stock > 0;
    
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    
    const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
    
    const monthlyPrice = Math.ceil(product.price / 12);
    
    return (
        <div className="container">
        <div className="product-detail">
        <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
        <p className="product-detail-category">{product.category}</p>
        
        <h1>{product.name}</h1>
        
        <div className="detail-badges">
        {product.isHit && <span className="badge hit">Hit</span>}
        
        {product.isFeatured && <span className="badge benefit">Top</span>}
        
        {hasDiscount && (
            <span className="badge discount">-{discountPercent}%</span>
        )}
        </div>
        
        <p className={isAvailable ? "stock available" : "stock not-available"}>
        {isAvailable ? "Sotuvda bor" : "Sotuvda yo‘q"}
        </p>
        
        <p className="monthly-price">
        {monthlyPrice.toLocaleString()} so‘m/oy
        </p>
        
        {hasDiscount && (
            <p className="old-price detail-old-price">
            {product.oldPrice.toLocaleString()} so‘m
            </p>
        )}
        
        <p className="detail-price">
        {product.price.toLocaleString()} so‘m
        </p>
        
        <p className="description">{product.description}</p>
        
        <p className="detail-stock">
        Omborda: <b>{product.stock}</b> dona
        </p>
        
        <div className="detail-actions">
        <button
        onClick={() => addToCart(product)}
        className="btn"
        disabled={!isAvailable}
        >
        {isAvailable ? "Savatchaga qo‘shish" : "Mavjud emas"}
        </button>
        
        <Link to="/cart" className="secondary-btn detail-cart-link">
        Savatchaga o‘tish
        </Link>
        </div>
        </div>
        </div>
        </div>
    );
}

export default ProductDetail;