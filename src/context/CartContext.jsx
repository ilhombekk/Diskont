import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const getProductId = (product) => product._id || product.id;
    
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);
    
    const addToCart = (product) => {
        const productId = getProductId(product);
        
        if (product.stock !== undefined && product.stock <= 0) {
            alert("Bu mahsulot hozir sotuvda yo‘q");
            return;
        }
        
        const exists = cartItems.find((item) => getProductId(item) === productId);
        
        if (exists) {
            if (
                product.stock !== undefined &&
                exists.quantity + 1 > product.stock
            ) {
                alert(`Omborda faqat ${product.stock} dona bor`);
                return;
            }
            
            setCartItems(
                cartItems.map((item) =>
                    getProductId(item) === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
        );
    } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
};

const increaseQuantity = (id) => {
    setCartItems(
        cartItems.map((item) => {
            if (getProductId(item) === id) {
                if (item.stock !== undefined && item.quantity + 1 > item.stock) {
                    alert(`Omborda faqat ${item.stock} dona bor`);
                    return item;
                }
                
                return { ...item, quantity: item.quantity + 1 };
            }
            
            return item;
        })
    );
};

const decreaseQuantity = (id) => {
    setCartItems(
        cartItems
        .map((item) =>
            getProductId(item) === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0)
);
};

const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => getProductId(item) !== id));
};

const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
};

const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);

const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

return (
    <CartContext.Provider
    value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalCount,
        getProductId,
    }}
    >
    {children}
    </CartContext.Provider>
);
}

export function useCart() {
    return useContext(CartContext);
}