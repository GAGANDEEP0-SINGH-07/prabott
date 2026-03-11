import React from 'react';
import { useReveal } from '../../Shared/hooks';

export function CategoryHero({ data, page, productCount = 0 }) {
    useReveal();

    return (
        <div style={{ padding: "16px 24px 0", maxWidth: "100%", margin: "0 auto" }}>
            <div className="rv page-hero" style={{ minHeight: 520 }}>
                <img
                    src={data.hero}
                    alt={page}
                    style={{ transform: "scale(1.05)" }}
                />
                <div className="page-hero-overlay" />

                {/* Hero Content */}
                <div className="page-hero-content">
                    {/* Breadcrumb */}
                    <nav className="breadcrumb" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                        <a href="/" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, letterSpacing: ".3px" }}>Home</a>
                        <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>/</span>
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, letterSpacing: ".3px" }}>{page}</span>
                    </nav>

                    {/* Eyebrow */}
                    <span style={{
                        fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 16,
                        fontWeight: 400,
                    }}>
                        The Collection
                    </span>

                    {/* Title */}
                    <h1 className="page-title-font" style={{
                        fontSize: "clamp(48px, 7vw, 90px)",
                        fontWeight: 700, lineHeight: 0.95, color: "white",
                        marginBottom: 20, letterSpacing: "-2px",
                    }}>
                        {page}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 400,
                        lineHeight: 1.7, fontWeight: 300, marginBottom: 36, letterSpacing: ".3px",
                    }}>
                        {data.description}
                    </p>

                    {/* CTA */}
                    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                        <button className="btn-p" style={{
                            background: "#fff", color: "#1a1a18",
                        }}>
                            Explore Collection
                        </button>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>
                            {productCount || (data.products && data.products.length) || 0} Pieces
                        </span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="hide-mobile" style={{
                    position: "absolute", right: 48, bottom: 48, zIndex: 2,
                    flexDirection: "column", alignItems: "center", gap: 12,
                }}>
                    <span style={{
                        fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                        color: "rgba(255,255,255,0.3)", writingMode: "vertical-lr",
                    }}>
                        Scroll
                    </span>
                    <div style={{
                        width: 1, height: 36,
                        background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                    }} />
                </div>
            </div>
        </div>
    );
}
