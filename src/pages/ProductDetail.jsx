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
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
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
            <h2>Mahsulot topilmadi</h2>
            <Link to="/" className="btn">
            Bosh sahifaga qaytish
            </Link>
            </div>
        );
    }
    
    return (
        <div className="container">
        <div className="product-detail">
        <img src={product.image} alt={product.name} />
        
        <div>
        <p className="category">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="detail-price">{product.price.toLocaleString()} so‘m</p>
        <p className="description">{product.description}</p>
        <p>Skladda: {product.stock} dona</p>
        
        <button onClick={() => addToCart(product)} className="btn">
        Savatchaga qo‘shish
        </button>
        </div>
        </div>
        </div>
    );
}

export default ProductDetail;