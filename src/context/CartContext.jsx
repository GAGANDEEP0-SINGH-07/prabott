import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('prabott_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('prabott_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => (item.id && item.id === product.id) || item.name === product.name);
            if (existing) {
                return prev.map(item =>
                    ((item.id && item.id === product.id) || item.name === product.name)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            // Extract the price as a number properly
            let numericPrice = 0;
            if (typeof product.price === 'number') {
                numericPrice = product.price;
            } else if (typeof product.price === 'string') {
                numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
            }

            return [...prev, {
                id: product.id || Date.now() + Math.random(),
                name: product.name,
                price: numericPrice || 0,
                image: product.image || product.img || (product.images && product.images[0]) || '',
                description: product.description || product.cat || '',
                quantity: quantity
            }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQty) => {
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ items: cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
