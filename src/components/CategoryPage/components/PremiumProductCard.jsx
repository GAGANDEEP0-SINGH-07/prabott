import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "../../Shared/Icons";
import { useWishlist } from "../../../context/WishlistContext";

export function PremiumProductCard({ product, onAddCart, view }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const navigate = useNavigate();

    const handleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlist(product);
    };

    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price.toString().replace(/[^0-9.]/g, ''));
    const oldPrice = product.oldPrice ? (typeof product.oldPrice === 'number' ? product.oldPrice : parseFloat(product.oldPrice.toString().replace(/[^0-9.]/g, ''))) : null;

    /* ── LIST VIEW ── */
    if (view === "list") {
        return (
            <div style={{
                display: "flex", gap: 32, alignItems: "center",
                borderBottom: "1px solid #f0ede8", padding: 0,
                cursor: "pointer", transition: "all .3s ease",
                fontFamily: "'Inter',sans-serif",
            }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f8f7f5"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                onClick={() => navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } })}
            >
                <div style={{ width: 160, height: 120, flexShrink: 0, overflow: "hidden", position: "relative", borderRadius: 12 }}>
                    <img src={product.img?.startsWith('http') ? product.img : `${import.meta.env.VITE_API_URL || ''}${product.img}`} alt={product.name} style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform .6s cubic-bezier(.16,1,.3,1)",
                    }}
                        onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    />
                    {product.badge && (
                        <div className={`badge badge-${product.badge.toLowerCase()}`}
                            style={{ top: 8, left: 8 }}>{product.badge}</div>
                    )}
                </div>
                <div style={{ flex: 1, padding: "20px 0" }}>
                    <div style={{ fontSize: 11, color: "#bbb", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                        {product.cat}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a18", marginBottom: 8, letterSpacing: "-0.2px" }}>
                        {product.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#aaa" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#1a1a18" stroke="none">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        <span>{product.rating}</span>
                        <span style={{ color: "#ddd" }}>{"\u00b7"}</span>
                        <span>{product.reviews} reviews</span>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, padding: "20px 4px 20px 0" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 18, fontWeight: 600, color: "#1a1a18" }}>
                            {"\u00a3"}{price.toLocaleString()}
                        </span>
                        {oldPrice && (
                            <span style={{ fontSize: 13, color: "#ccc", textDecoration: "line-through" }}>
                                {"\u00a3"}{oldPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button style={{
                        background: "none", color: "#1a1a18",
                        border: "1px solid #1a1a18", padding: "10px 24px",
                        fontSize: 12, fontWeight: 500, letterSpacing: ".3px",
                        borderRadius: 10, cursor: "pointer",
                        fontFamily: "'Inter',sans-serif", transition: "all .3s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#1a1a18"; }}
                        onClick={(e) => { e.stopPropagation(); onAddCart(product); }}
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={handleWishlist}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: isWishlisted ? 1 : 0.6 }}
                    >
                        <HeartIcon filled={isWishlisted} color={isWishlisted ? "#E05252" : "#999"} />
                    </button>
                </div>
            </div>
        );
    }

    /* ── GRID VIEW ── */
    return (
        <div className="pcard" style={{ fontFamily: "'Inter',sans-serif", cursor: "pointer" }} onClick={() => navigate(`/product/${encodeURIComponent(product.name)}`, { state: { product } })}>
            <div className="pcard-img">
                {product.badge && (
                    <div className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</div>
                )}
                <button
                    className={`wish-btn ${isWishlisted ? "active" : ""}`}
                    onClick={handleWishlist}
                >
                    <HeartIcon filled={isWishlisted} color={isWishlisted ? "#E05252" : "#1a1a18"} />
                </button>
                <img src={product.img?.startsWith('http') ? product.img : `${import.meta.env.VITE_API_URL || ''}${product.img}`} alt={product.name} />
            </div>
            <div style={{ padding: "16px 16px 20px" }}>
                <span style={{
                    fontSize: 11, color: "#bbb", textTransform: "uppercase",
                    letterSpacing: 1, fontWeight: 500, display: "block", marginBottom: 6,
                }}>
                    {product.cat}
                </span>
                <h3 style={{
                    fontSize: 15, fontWeight: 600, color: "#1a1a18",
                    lineHeight: 1.3, marginBottom: 12, letterSpacing: "-0.2px",
                }}>
                    {product.name}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a18", letterSpacing: ".2px" }}>
                            {"\u00a3"}{price.toLocaleString()}
                        </span>
                        {oldPrice && (
                            <span style={{ fontSize: 12, color: "#ccc", textDecoration: "line-through" }}>
                                {"\u00a3"}{oldPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                    <button
                        style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "#1a1a18", color: "white",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 18, transition: "all .2s ease"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = "#333"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#1a1a18"; }}
                        onClick={(e) => { e.stopPropagation(); onAddCart(product); }}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
