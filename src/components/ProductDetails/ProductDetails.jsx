import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/pricing';
import api from '../../api';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!product);
    const [error, setError] = useState(null);

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [activeImage, setActiveImage] = useState(0);

    const [descOpen, setDescOpen] = useState(true);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const [activeReview, setActiveReview] = useState(0);

    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setProduct(location.state?.product || null);
        setLoading(!location.state?.product);
        setError(null);
        setQuantity(1);
        setActiveImage(0);
        window.scrollTo(0, 0);
    }, [id, location.state?.product]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (product) return; 

            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                setError("Product not found or invalid ID.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            _id: product._id,
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.img || '',
            description: product.description || '',
            stock: product.stock
        }, quantity);
    };

    const handleBuyNow = () => {
        if (!product) return;
        if (!user) {
            navigate('/login');
        } else {
            addToCart({
                _id: product._id,
                id: product._id || product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || product.img || '',
                description: product.description || '',
                stock: product.stock
            }, quantity);
            navigate('/cart');
        }
    };

    if (loading) return <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>Loading elegant pieces...</div>;
    if (error || !product) return (
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
            <h2 className="font-['Inter'] text-[24px] font-bold text-[#1a1a18] mb-4">Piece Not Found</h2>
            <p className="text-[#888] mb-8">The piece you're looking for might have moved or been retired.</p>
            <Link to="/" className="inline-block px-8 py-3 bg-[#1a1a18] text-white rounded-[12px] font-bold text-[14px]">Back to Collection</Link>
        </div>
    );

    const displayProduct = {
        name: product.name,
        price: product.price,
        description: product.description,
        colors: product.colors && product.colors.length > 0 ? product.colors : ['#1a1a18', '#8B7355', '#E0C9A6'],
        images: product.images && product.images.length > 0 ? product.images : ["https://placehold.co/1200x1200?text=No+Image"],
        rating: product.ratings || 5,
        reviewsNum: product.numReviews || 0,
        features: product.features || [],
        reviews: product.reviews || [],
        ...product
    };

    const reviewsList = displayProduct.reviews.length > 0 ? displayProduct.reviews.map(r => ({
        name: r.name,
        date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        stars: "⭐".repeat(r.rating),
        text: `"${r.comment}"`
    })) : [
        {
            name: "Prabott Concierge",
            date: "Recent",
            stars: "⭐⭐⭐⭐⭐",
            text: `"Our latest addition to the collection. Be the first to share your experience with this piece."`
        }
    ];

    return (
        <div className="product-details-container font-inter">
            <div className="pd-breadcrumb">
                <Link to="/">&lt; Home</Link> <span>/ Products</span>
            </div>

            <div className="pd-main-content">
                {/* Left Column - Images */}
                <div className="pd-image-section">
                    <div className="pd-main-image-wrapper">
                        {(() => {
                            const img = displayProduct.images[activeImage] || displayProduct.images[0];
                            const resolvedImg = img?.startsWith('http') ? img : `${import.meta.env.VITE_API_URL || ''}${img}`;
                            return <img src={resolvedImg} alt={displayProduct.name} className="pd-main-image" />;
                        })()}
                    </div>
                    <div className="pd-thumbnails">
                        {[0, 1, 2].map((index) => {
                            const imgIndex = index + 1;
                            const img = displayProduct.images[imgIndex];

                            return img ? (
                                <div
                                    key={index}
                                    className={`pd-thumbnail-wrapper ${activeImage === imgIndex ? 'active' : ''}`}
                                    onClick={() => setActiveImage(imgIndex)}
                                >
                                    <img src={img} alt={`Thumbnail ${imgIndex}`} className="pd-thumbnail" />
                                </div>
                            ) : (
                                <div key={index} className="pd-thumbnail-wrapper placeholder" style={{ cursor: 'default' }}></div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="pd-info-section">
                    <h1 className="pd-product-title">{displayProduct.name}</h1>
                    <div className="pd-product-price">{formatPrice(displayProduct.price)}</div>
                    
                    <div className={`pd-stock-status ${displayProduct.stock <= 5 ? 'low' : ''}`}>
                        {displayProduct.stock > 0 
                            ? (displayProduct.stock <= 5 
                                ? `Hurry! Only ${displayProduct.stock} pieces left in stock` 
                                : `In Stock: ${displayProduct.stock} pieces`)
                            : "Out of Stock"}
                    </div>

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
                            {displayProduct.colors.map((color, idx) => {
                                const colorName = {
                                    '#1a1a18': 'Charcoal Black',
                                    '#8B7355': 'Antique Oak',
                                    '#E0C9A6': 'Natural Linen',
                                    '#f5f0eb': 'Cream White',
                                    '#d4c9b8': 'Sand Beige'
                                }[color] || color;

                                return (
                                    <button
                                        key={idx}
                                        className={`pd-color-btn ${selectedColor === idx ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(idx)}
                                        aria-label={`Select color: ${colorName}`}
                                        title={colorName}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="pd-quantity-section">
                        <div className="pd-quantity-control">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button 
                                onClick={() => setQuantity(Math.min(displayProduct.stock, quantity + 1))}
                                disabled={quantity >= displayProduct.stock}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pd-action-buttons">
                        <button 
                            className="pd-btn-add-cart" 
                            onClick={handleAddToCart}
                            disabled={!displayProduct.stock || displayProduct.stock < 1}
                        >
                            {displayProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button 
                            className="pd-btn-buy-now" 
                            onClick={handleBuyNow}
                            disabled={!displayProduct.stock || displayProduct.stock < 1}
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Features Accordion */}
                    <div className={`pd-accordion pd-shipping-accordion ${featuresOpen ? 'open' : ''}`}>
                        <div className="pd-accordion-header" onClick={() => setFeaturesOpen(!featuresOpen)}>
                            <h3>Product Features</h3>
                            <span className="pd-accordion-icon">{featuresOpen ? '∧' : '∨'}</span>
                        </div>
                        {featuresOpen && (
                            <div className="pd-accordion-content pd-shipping-grid">
                                {displayProduct.features.length > 0 ? displayProduct.features.map((f, i) => (
                                    <div key={i} className="pd-shipping-item">
                                        <div className="pd-shipping-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                        </div>
                                        <div>
                                            <div className="pd-shipping-label">{f.label}</div>
                                            <div className="pd-shipping-value">{f.value}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="pd-shipping-item">
                                        <div className="pd-shipping-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                        </div>
                                        <div>
                                            <div className="pd-shipping-label">Craftsmanship</div>
                                            <div className="pd-shipping-value">Premium Quality Assured</div>
                                        </div>
                                    </div>
                                )}
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
                        <div className="pd-review-card" style={{ display: "flex", flexDirection: "column", minHeight: "220px", justifyContent: "space-between", position: "relative" }}>

                            <button
                                onClick={() => setActiveReview((prev) => (prev > 0 ? prev - 1 : reviewsList.length - 1))}
                                style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid #eee", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", zIndex: 2 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            <button
                                onClick={() => setActiveReview((prev) => (prev < reviewsList.length - 1 ? prev + 1 : 0))}
                                style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "1px solid #eee", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", zIndex: 2 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>

                            <div key={activeReview} className="review-content-animated">
                                <div className="pd-review-header">
                                    <div className="pd-reviewer-name">{reviewsList[activeReview].name}</div>
                                    <div className="pd-review-date">{reviewsList[activeReview].date}</div>
                                </div>
                                <div className="pd-review-stars">
                                    {reviewsList[activeReview].stars}
                                </div>
                                <p className="pd-review-text">
                                    {reviewsList[activeReview].text}
                                </p>
                            </div>
                            <div className="pd-review-dots">
                                {reviewsList.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={idx === activeReview ? "active" : ""}
                                        onClick={() => setActiveReview(idx)}
                                        style={{ cursor: "pointer" }}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
