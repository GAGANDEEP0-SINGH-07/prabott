import { memo } from 'react';
import { ProductCard } from '../prabott/ProductCard';
import ProductHeader from './components/ProductHeader';
import { GlobalStyles } from '../prabott/Shared';
import { useCart } from '../../context/CartContext';

import { products as allProducts } from '../../data/products';

function Products() {
    const { addToCart } = useCart();
    // Only show a few furniture/featured items on the home page for brevity
    const featuredProducts = allProducts.slice(0, 8);

    return (
        <section className="bg-white mx-[18px] px-[18px] py-12 pb-14">
            <GlobalStyles />
            <ProductHeader />

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1">
                {featuredProducts.map((product) => {
                    const adaptedProduct = {
                        ...product,
                        cat: product.category,
                        price: product.numericPrice,
                        badge: product.sale ? 'Sale' : undefined,
                    };
                    return (
                        <ProductCard
                            key={product.name}
                            product={adaptedProduct}
                            onAddCart={(product) => {
                                addToCart(product, 1);
                                alert('Added ' + product.name + ' to cart!');
                            }}
                            view="grid"
                        />
                    );
                })}
            </div>
        </section>
    );
}

export default memo(Products);
