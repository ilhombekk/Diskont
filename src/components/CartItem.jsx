import { useCart } from "../context/CartContext";

function CartItem({ item }) {
    const { increaseQuantity, decreaseQuantity, removeFromCart, getProductId } =
    useCart();
    
    const id = getProductId(item);
    
    return (
        <div className="cart-item">
        <img src={item.image} alt={item.name} />
        
        <div className="cart-details">
        <h3>{item.name}</h3>
        <p>{item.price.toLocaleString()} so‘m</p>
        
        <div className="quantity">
        <button onClick={() => decreaseQuantity(id)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQuantity(id)}>+</button>
        </div>
        </div>
        
        <div className="cart-actions">
        <p>{(item.price * item.quantity).toLocaleString()} so‘m</p>
        
        <button onClick={() => removeFromCart(id)} className="delete-btn">
        O‘chirish
        </button>
        </div>
        </div>
    );
}

export default CartItem;