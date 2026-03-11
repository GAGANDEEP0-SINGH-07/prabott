import React, { useState, useMemo, useEffect, memo } from 'react';
import { PremiumProductCard as ProductCard } from '../CategoryPage/components/PremiumProductCard';
import { useCart } from '../../context/CartContext';
import ProductHeader from './components/ProductHeader';
import api from '../../api';

function Products() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // The backend returns { products, page, pages }
                setProducts(data.products.slice(0, 8)); // Just show 8 on home
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="bg-white mx-[18px] px-[18px] py-12 pb-14">
            <GlobalStyles />
            <ProductHeader />

            {/* Product Grid */}
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", fontStyle: "italic", color: "#666" }}>
                    Loading premium collection...
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1">
                    {products.map((product) => {
                        const adaptedProduct = {
                            ...product,
                            id: product._id, // Map MongoDB _id to id for frontend compatibility
                            cat: product.category,
                            price: product.price,
                        };
                        return (
                            <ProductCard
                                key={product._id}
                                product={adaptedProduct}
                                onAddCart={() => {
                                    addToCart(adaptedProduct, 1);
                                }}
                                view="grid"
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Products;
