import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { products as oldProducts } from '../../data/products';
import { PAGE_DATA } from '../../data/newProducts';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const location = useLocation();

    const decodedId = id ? decodeURIComponent(id) : '';
    let foundProduct = location.state?.product;

    if (!foundProduct) {
        for (const cat of Object.values(PAGE_DATA || {})) {
            const match = cat.products?.find(p => p.name === decodedId);
            if (match) {
                foundProduct = match;
                break;
            }
        }
    }
    if (!foundProduct) {
        foundProduct = oldProducts?.find(p => p.name === decodedId);
    }

    const productPrice = foundProduct ? (typeof foundProduct.price === 'number' ? foundProduct.price : foundProduct.numericPrice || 240.99) : 240.99;

    const product = {
        name: foundProduct ? foundProduct.name : (decodedId || "Elite Chair"),
        price: productPrice,
        description: foundProduct?.description || "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood.",
        colors: foundProduct?.colors || ['#f8f8f8', '#aaaaaa', '#4e5a37', '#915f33'],
        images: foundProduct?.img ? [
            foundProduct.img,
            foundProduct.img,
            foundProduct.img,
            foundProduct.img
        ] : [
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop"
        ],
        rating: foundProduct?.rating || 4.5,
        reviews: foundProduct?.reviews || 50,
        ...foundProduct
    };

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [activeImage, setActiveImage] = useState(0);

    const [descOpen, setDescOpen] = useState(true);
    const [shippingOpen, setShippingOpen] = useState(true);

    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(product, quantity);
        alert('Product added to cart!');
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/login');
        } else {
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="product-details-container font-inter">
            <div className="pd-breadcrumb">
                <Link to="/">&lt; Home</Link> <span>/ Products</span>
            </div>

            <div className="pd-main-content">
                {/* Left Column - Images */}
                <div className="pd-image-section">
                    <div className="pd-main-image-wrapper">
                        <img src={product.images[activeImage]} alt={product.name} className="pd-main-image" />
                    </div>
                    <div className="pd-thumbnails">
                        {product.images.slice(1, 4).map((img, index) => (
                            <div
                                key={index}
                                className={`pd-thumbnail-wrapper ${activeImage === index + 1 ? 'active' : ''}`}
                                onClick={() => setActiveImage(index + 1)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} className="pd-thumbnail" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="pd-info-section">
                    <h1 className="pd-product-title">{product.name}</h1>
                    <div className="pd-product-price">${product.price.toFixed(2)}</div>

                    {/* Description Accordion */}
                    <div className={`pd-accordion ${descOpen ? 'open' : ''}`}>
                        <div className="pd-accordion-header" onClick={() => setDescOpen(!descOpen)}>
                            <h3>Description</h3>
                            <span className="pd-accordion-icon">{descOpen ? '∧' : '∨'}</span>
                        </div>
                        {descOpen && (
                            <div className="pd-accordion-content">
                                <p>{product.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Color Selection */}
                    <div className="pd-color-section">
                        <h3 className="pd-section-label">Color</h3>
                        <div className="pd-color-options">
                            {product.colors.map((color, idx) => (
                                <button
                                    key={idx}
                                    className={`pd-color-btn ${selectedColor === idx ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(idx)}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="pd-quantity-section">
                        <div className="pd-quantity-control">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pd-action-buttons">
                        <button className="pd-btn-add-cart" onClick={handleAddToCart}>Add to Cart</button>
                        <button className="pd-btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
                    </div>

                    {/* Shipping Accordion */}
                    <div className={`pd-accordion pd-shipping-accordion ${shippingOpen ? 'open' : ''}`}>
                        <div className="pd-accordion-header" onClick={() => setShippingOpen(!shippingOpen)}>
                            <h3>Shipping</h3>
                            <span className="pd-accordion-icon">{shippingOpen ? '∧' : '∨'}</span>
                        </div>
                        {shippingOpen && (
                            <div className="pd-accordion-content pd-shipping-grid">
                                <div className="pd-shipping-item">
                                    <div className="pd-shipping-icon">
                                        %
                                    </div>
                                    <div>
                                        <div className="pd-shipping-label">Discount</div>
                                        <div className="pd-shipping-value">Disc 50%</div>
                                    </div>
                                </div>
                                <div className="pd-shipping-item">
                                    <div className="pd-shipping-icon">
                                        📦
                                    </div>
                                    <div>
                                        <div className="pd-shipping-label">Package</div>
                                        <div className="pd-shipping-value">Reg</div>
                                    </div>
                                </div>
                                <div className="pd-shipping-item">
                                    <div className="pd-shipping-icon">
                                        ⏱
                                    </div>
                                    <div>
                                        <div className="pd-shipping-label">Delivery Time</div>
                                        <div className="pd-shipping-value">3-4 Working Days</div>
                                    </div>
                                </div>
                                <div className="pd-shipping-item">
                                    <div className="pd-shipping-icon">
                                        🚚
                                    </div>
                                    <div>
                                        <div className="pd-shipping-label">Arrive</div>
                                        <div className="pd-shipping-value">0 - 12 Oct 2024</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ratings & Reviews Section */}
            <div className="pd-reviews-section">
                <h2 className="pd-reviews-title">Rating & Reviews</h2>
                <div className="pd-reviews-content">
                    <div className="pd-reviews-left">
                        <div className="pd-overall-rating">
                            <span className="pd-rating-huge">4.5</span>
                            <span className="pd-rating-max">/5</span>
                        </div>
                        <div className="pd-reviews-count">(50 New Reviews)</div>
                        <div className="pd-rating-bars">
                            {[5, 4, 3, 2, 1].map(stars => (
                                <div key={stars} className="pd-rating-bar-row">
                                    <span className="pd-star-icon">⭐</span>
                                    <span className="pd-star-num">{stars}</span>
                                    <div className="pd-progress-track">
                                        <div className="pd-progress-fill" style={{ width: stars >= 4 ? '80%' : stars === 3 ? '20%' : '5%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pd-reviews-right">
                        <div className="pd-review-card">
                            <div className="pd-review-header">
                                <div className="pd-reviewer-name">Obayedul</div>
                                <div className="pd-review-date">13 Oct 2024</div>
                            </div>
                            <div className="pd-review-stars">
                                ⭐⭐⭐⭐⭐
                            </div>
                            <p className="pd-review-text">
                                "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves."
                            </p>
                            <div className="pd-review-dots">
                                <span className="active"></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
