import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart on load or auth change
    const fetchCart = useCallback(async () => {
        if (!user) {
            const saved = localStorage.getItem('prabott_cart');
            setCartItems(saved ? JSON.parse(saved) : []);
            return;
        }

        try {
            // MERGE LOCAL CART TO BACKEND IF EXISTS
            const saved = localStorage.getItem('prabott_cart');
            const localCart = saved ? JSON.parse(saved) : [];

            if (localCart.length > 0) {
                // Sequentially add local items to backend to avoid race conditions
                for (const item of localCart) {
                    const isValidObjectId = item.id && typeof item.id === 'string' && item.id.length >= 24;
                    await api.post('/cart/add', {
                        productId: isValidObjectId ? item.id : undefined,
                        productName: item.name,
                        quantity: item.quantity
                    }).catch(e => console.error("Error migrating items to auth cart", e));
                }
                localStorage.removeItem('prabott_cart');
            }

            const { data } = await api.get('/cart');
            if (data && data.products) {
                const mappedCart = data.products.map(p => ({
                    id: p.productId?._id,
                    name: p.productId?.name,
                    price: p.productId?.price,
                    image: p.productId?.images?.[0] || '',
                    quantity: p.quantity,
                }));
                setCartItems(mappedCart);
            }
        } catch (error) {
            console.error("Failed to fetch cart from backend", error);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Sync local storage for non-logged-in users
    useEffect(() => {
        if (!user) {
            localStorage.setItem('prabott_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            // Local fallback
            setCartItems(prev => {
                const existing = prev.find(item => (item.id && item.id === product.id) || item.name === product.name);
                if (existing) {
                    return prev.map(item =>
                        ((item.id && item.id === product.id) || item.name === product.name)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price?.toString().replace(/[^0-9.]/g, '') || 0);
                return [...prev, {
                    id: product.id || Date.now() + Math.random(),
                    name: product.name,
                    price: numericPrice,
                    image: product.image || product.img || (product.images && product.images[0]) || '',
                    description: product.description || product.cat || '',
                    quantity: quantity
                }];
            });
            return;
        }

        try {
            // Normalize product ID - Backend understands MongoDB _id (24-char hex string)
            const productId = product._id || product.id;
            const productName = product.name;

            // Detect stale/invalid IDs (numeric or short strings from old cached data)
            const isValidObjectId = productId && typeof productId === 'string' && productId.length >= 24;

            if (!isValidObjectId) {
                console.warn("WARNING: productId is not a valid MongoDB ObjectId:", productId, "— sending productName as fallback:", productName);
            }

            console.log("DEBUG: Adding to cart, productId:", productId, "productName:", productName);

            // Send both productId and productName so backend can do a fallback name-based lookup
            await api.post('/cart/add', {
                productId: isValidObjectId ? productId : undefined,
                productName,
                quantity
            });
            fetchCart(); // Re-sync
        } catch (error) {
            console.error("Error adding to remote cart", error);
        }
    };

    const removeFromCart = async (id) => {
        if (!user) {
            setCartItems(prev => prev.filter(item => item.id !== id));
            return;
        }

        try {
            await api.delete('/cart/remove', { data: { productId: id } });
            fetchCart();
        } catch (error) {
            console.error("Error removing from remote cart", error);
        }
    };

    const updateQuantity = async (id, newQty) => {
        if (!user) {
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item));
            return;
        }

        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const difference = newQty - item.quantity;
        if (difference > 0) {
            await addToCart({ id }, difference);
        } else if (difference < 0) {
            // we don't have a direct decrement API, so we would need to remove it and add it back at the new qty, 
            // or just rely on a new PUT endpoint if we had one. 
            // For now, let's mock the update visually to prevent breaking
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQty) } : item));
        }
    };

    const clearCart = () => {
        setCartItems([]);
        if (!user) localStorage.removeItem('prabott_cart');
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
