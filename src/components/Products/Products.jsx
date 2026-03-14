import React, { useState, useEffect } from 'react';
import { PremiumProductCard as ProductCard } from '../CategoryPage/components/PremiumProductCard';
import { useCart } from '../../context/CartContext';
import ProductHeader from './components/ProductHeader';
import { useReveal } from '../Shared/hooks';
import api from '../../api';

function Products() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useReveal([products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // The backend returns { products, page, pages }
                setProducts((data.products || []).slice(0, 8)); // Just show 8 on home
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
            <ProductHeader />

            {/* Product Grid */}
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", fontStyle: "italic", color: "#666" }}>
                    Loading premium collection...
                </div>
            ) : products.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                    Our collection is being curated. Check back soon.
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1">
                    {products.map((product, i) => {
                        const adaptedProduct = {
                            ...product,
                            id: product._id,
                            cat: product.category,
                            price: product.price,
                            img: product.images?.[0] || 'https://placehold.co/600',
                        };
                        return (
                            <div key={adaptedProduct.id} className={`rv rv${(i % 4) + 1}`}>
                                <ProductCard
                                    product={adaptedProduct}
                                    onAddCart={() => {
                                        addToCart(adaptedProduct, 1);
                                    }}
                                    view="grid"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}


export default Products;

