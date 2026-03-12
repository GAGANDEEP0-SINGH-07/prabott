import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    // Fetch cart on load or auth change
    const fetchCart = useCallback(async (signal) => {
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
                console.log("[DEBUG] Merging local cart to backend...");
                for (const item of localCart) {
                    if (signal?.aborted) return;
                    try {
                        const productId = item._id || item.id;
                        const isValidObjectId = productId && typeof productId === 'string' && /^[0-9a-fA-F]{24}$/.test(productId);
                        
                        await api.post('/cart/add', {
                            productId: isValidObjectId ? productId : undefined,
                            productName: item.name,
                            quantity: item.quantity
                        }, { signal });
                    } catch (e) {
                        if (e.name === 'CanceledError') return;
                        console.error(`Error migrating item "${item.name}" to auth cart:`, e.message);
                    }
                }
                localStorage.removeItem('prabott_cart');
            }

            const { data } = await api.get('/cart', { signal });
            if (data && data.products) {
                const mappedCart = data.products.map(p => ({
                    id: p.productId?._id,
                    name: p.productId?.name,
                    price: p.productId?.price,
                    image: p.productId?.images?.[0] || '',
                    quantity: p.quantity,
                    stock: p.productId?.stock,
                    _id: p.productId?._id 
                }));
                setCartItems(mappedCart);
            }
        } catch (error) {
            if (error.name === 'CanceledError') return;
            console.error("Failed to fetch cart from backend", error);
        }
    }, [user]);

    useEffect(() => {
        const controller = new AbortController();
        fetchCart(controller.signal);
        return () => controller.abort();
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
                const existing = prev.find(item => (item.id && (item.id === product.id || item.id === product._id)) || item.name === product.name);
                if (existing) {
                    return prev.map(item =>
                        ((item.id && (item.id === product.id || item.id === product._id)) || item.name === product.name)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price?.toString().replace(/[^0-9.]/g, '') || 0);
                return [...prev, {
                    id: product._id || product.id || Date.now() + Math.random(),
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
            const productId = product._id || product.id;
            const productName = product.name;
            const isValidObjectId = productId && typeof productId === 'string' && /^[0-9a-fA-F]{24}$/.test(productId);

            await api.post('/cart/add', {
                productId: isValidObjectId ? productId : undefined,
                productName,
                quantity
            });
            fetchCart(); 
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
        const qty = Math.max(1, newQty);
        
        if (!user) {
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
            return;
        }

        try {
            await api.put('/cart/update', { productId: id, quantity: qty });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart quantity", error);
            // Optimistic update fallback or just ignore and let fetchCart handle sync if it fails
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
