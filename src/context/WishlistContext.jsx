import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            const saved = localStorage.getItem('prabott_wishlist');
            setWishlistItems(saved ? JSON.parse(saved) : []);
            return;
        }

        try {
            const saved = localStorage.getItem('prabott_wishlist');
            const localWishlist = saved ? JSON.parse(saved) : [];

            if (localWishlist.length > 0) {
                const productIds = localWishlist.map(item => item._id || item.id);
                await api.post('/wishlist/merge', { productIds });
                localStorage.removeItem('prabott_wishlist');
            }

            const { data } = await api.get('/wishlist');
            if (data && data.products) {
                setWishlistItems(data.products.map(p => ({
                    ...p,
                    id: p._id, // Ensure id matches expected frontend shape
                })));
            }
        } catch (error) {
            console.error("Failed to fetch wishlist from backend", error);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem('prabott_wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, user]);

    const addToWishlist = async (product) => {
        if (!user) {
            setWishlistItems(prev => {
                if (prev.find(item => item.id === product.id || item.id === product._id)) return prev;
                return [...prev, product];
            });
            return;
        }

        try {
            await api.post('/wishlist/add', { productId: product._id || product.id });
            fetchWishlist();
        } catch (error) {
            console.error("Error adding to remote wishlist", error);
        }
    };

    const removeFromWishlist = async (id) => {
        if (!user) {
            setWishlistItems(prev => prev.filter(item => item.id !== id));
            return;
        }

        try {
            await api.delete('/wishlist/remove', { data: { productId: id } });
            fetchWishlist();
        } catch (error) {
            console.error("Error removing from remote wishlist", error);
        }
    };

    const toggleWishlist = async (product) => {
        const id = product._id || product.id;
        const exists = wishlistItems.some(item => item.id === id || item._id === id);
        
        if (exists) {
            await removeFromWishlist(id);
        } else {
            await addToWishlist(product);
        }
    };

    const isInWishlist = (id) => {
        return wishlistItems.some(item => item.id === id || item._id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
