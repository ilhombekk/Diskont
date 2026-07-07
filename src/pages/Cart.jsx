import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

function Cart() {
    const { cartItems, totalPrice, clearCart } = useCart();
    
    if (cartItems.length === 0) {
        return (
            <div className="container empty-cart">
            <h2>Savatcha bo‘sh</h2>
            <p>Hozircha savatchaga mahsulot qo‘shilmagan.</p>
            <Link to="/" className="btn">
            Xaridni boshlash
            </Link>
            </div>
        );
    }
    
    return (
        <div className="container">
        <h1>Savatcha</h1>
        
        <div className="cart-list">
        {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
        ))}
        </div>
        
        <div className="cart-summary">
        <h2>Umumiy summa: {totalPrice.toLocaleString()} so‘m</h2>
        
        <div className="cart-buttons">
        <button onClick={clearCart} className="secondary-btn">
        Savatchani tozalash
        </button>
        
        <Link to="/checkout" className="btn">
        Buyurtma berish
        </Link>
        </div>
        </div>
        </div>
    );
}

export default Cart;