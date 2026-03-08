import { useState } from "react";
import { ChevronRight, ArrowRight, GridIcon, ListIcon, useReveal } from "./Shared";
import { Sidebar } from "./Navigation";
import { ProductCard } from "./ProductCard";
import { PAGE_DATA } from "../../data/newProducts";

/* ─────────────────────────── CATEGORY PAGE ─────────────────────────── */
export function CategoryPage({ page, onAddCart }) {
    const data = PAGE_DATA[page];
    const [activeFilter, setActiveFilter] = useState("All");
    const [priceRange, setPriceRange] = useState(5000);
    const [activeRating, setActiveRating] = useState(null);
    const [sort, setSort] = useState("featured");
    const [gridView, setGridView] = useState("grid");

    useReveal();

    const [limit, setLimit] = useState(8);

    const filtered = data.products
        .filter(p => activeFilter === "All" || p.cat === activeFilter)
        .filter(p => {
            // Extract price as number if it's a string
            const price = typeof p.price === 'number' ? p.price : parseFloat(p.price.toString().replace(/[^0-9.]/g, ''));
            return price <= priceRange;
        })
        .filter(p => !activeRating || p.rating >= activeRating)
        .sort((a, b) => {
            const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price.toString().replace(/[^0-9.]/g, ''));
            const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price.toString().replace(/[^0-9.]/g, ''));
            if (sort === "price-asc") return priceA - priceB;
            if (sort === "price-desc") return priceB - priceA;
            if (sort === "rating") return b.rating - a.rating;
            if (sort === "newest") return b.id - a.id; // Assuming higher ID is newer
            return 0;
        });

    const paginated = filtered.slice(0, limit);

    return (
        <div style={{ fontFamily: "'Inter',sans-serif" }}>

            {/* ═══ CINEMATIC HERO ═══ */}
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
                                {data.products.length} Pieces
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

            {/* ═══ EDITORIAL BAND ═══ */}
            <div className="rv editorial-band">
                <div className="band-item">
                    <span className="band-number">01</span>
                    <div>
                        <h4 className="band-label">Handcrafted</h4>
                        <p className="band-desc">Each piece meticulously crafted by skilled artisans</p>
                    </div>
                </div>
                <div className="band-divider" />
                <div className="band-item">
                    <span className="band-number">02</span>
                    <div>
                        <h4 className="band-label">Sustainable</h4>
                        <p className="band-desc">Responsibly sourced materials & eco-conscious processes</p>
                    </div>
                </div>
                <div className="band-divider" />
                <div className="band-item">
                    <span className="band-number">03</span>
                    <div>
                        <h4 className="band-label">Timeless</h4>
                        <p className="band-desc">Designs that transcend trends and last generations</p>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 24px 80px" }}>

                {/* Top bar - sort & view only (no filter chips here - they are in sidebar) */}
                <div className="rv" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: 16, padding: "40px 0 24px",
                    borderBottom: "1px solid #eceae6", marginBottom: 40,
                }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", letterSpacing: ".2px" }}>
                        {activeFilter === "All" ? `All ${page}` : activeFilter}
                        <span style={{ fontSize: 13, color: "#bbb", fontWeight: 400, marginLeft: 8 }}>
                            (Showing {paginated.length} of {filtered.length} results)
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="featured">Featured</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <div style={{ display: "flex", gap: 2 }}>
                            <button className={`grid-btn ${gridView === "grid" ? "active" : ""}`}
                                onClick={() => setGridView("grid")} title="Grid view"
                                style={{ border: "none" }}><GridIcon /></button>
                            <button className={`grid-btn ${gridView === "list" ? "active" : ""}`}
                                onClick={() => setGridView("list")} title="List view"
                                style={{ border: "none" }}><ListIcon /></button>
                        </div>
                    </div>
                </div>

                {/* Layout: sidebar + grid */}
                <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                    <Sidebar
                        data={data}
                        activeFilter={activeFilter} setActiveFilter={setActiveFilter}
                        priceRange={priceRange} setPriceRange={setPriceRange}
                        activeRating={activeRating} setActiveRating={setActiveRating}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "100px 20px" }}>
                                <h3 className="page-title-font" style={{ fontSize: 28, fontWeight: 600, marginBottom: 12, color: "#1a1a18", letterSpacing: "-0.5px" }}>
                                    No pieces found
                                </h3>
                                <p style={{ color: "#aaa", fontSize: 13, letterSpacing: ".3px" }}>
                                    Try adjusting your filters to discover more.
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: gridView === "grid" ? "grid" : "flex",
                                gridTemplateColumns: gridView === "grid" ? "repeat(auto-fill,minmax(260px,1fr))" : undefined,
                                flexDirection: gridView === "list" ? "column" : undefined,
                                gap: gridView === "grid" ? 24 : 2,
                            }}>
                                {paginated.map((p, i) => (
                                    <div key={p.id} className={`rv rv${(i % 4) + 1}`}>
                                        <ProductCard product={p} onAddCart={onAddCart} view={gridView} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {limit < filtered.length && (
                            <div className="rv" style={{
                                display: "flex", justifyContent: "center", alignItems: "center",
                                gap: 8, marginTop: 72,
                            }}>
                                <button
                                    onClick={() => setLimit(l => l + 8)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "16px 48px", border: "1px solid #1a1a18", borderRadius: 12,
                                        background: "transparent", color: "#1a1a18",
                                        fontSize: 14, fontWeight: 700, cursor: "pointer",
                                        letterSpacing: ".02em", fontFamily: "'Inter',sans-serif",
                                        transition: "all .3s ease",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a1a18"; }}
                                >
                                    Load More Pieces
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ BESPOKE CTA ═══ */}
            <div style={{ padding: "0 24px 80px", maxWidth: "100%", margin: "0 auto" }}>
                <div className="cta-dark">
                    <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto" }}>
                        <span style={{
                            fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
                            color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 24,
                        }}>
                            Bespoke Service
                        </span>
                        <h3 className="page-title-font" style={{
                            fontSize: "clamp(28px, 3.5vw, 44px)",
                            fontWeight: 700, lineHeight: 1.2,
                            color: "white", marginBottom: 16,
                            letterSpacing: "-1px",
                        }}>
                            {"Can\u2019t find the"}<br />perfect piece?
                        </h3>
                        <p style={{
                            fontSize: 14, color: "rgba(255,255,255,0.35)",
                            lineHeight: 1.7, fontWeight: 300,
                            maxWidth: 400, margin: "0 auto 40px",
                        }}>
                            Our design consultants craft bespoke {page.toLowerCase()} tailored to your exact specifications, materials, and dimensions.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <button style={{
                                background: "transparent", color: "#fff",
                                border: "1px solid rgba(255,255,255,0.2)",
                                padding: "16px 40px", fontSize: 13, fontWeight: 500, borderRadius: 12,
                                letterSpacing: ".3px",
                                cursor: "pointer", fontFamily: "'Inter',sans-serif",
                                transition: "all .3s ease",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a1a18"; e.currentTarget.style.borderColor = "#fff"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                            >
                                Book a Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
