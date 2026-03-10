import React, { useState, useEffect } from "react";
import api from "../../api";
import { GridIcon, ListIcon } from "../Shared/Icons";
import { useReveal } from "../Shared/hooks";
import { Sidebar } from "./components/Sidebar";
import { BespokeCTA } from "./components/BespokeCTA";
import { EditorialBand } from "./components/EditorialBand";
import { CategoryHero } from "./components/CategoryHero";
import { PremiumProductCard } from "./components/PremiumProductCard";
import { CATEGORY_METADATA } from "../../config/categoryMetadata";

export function CategoryPage({ page, onAddCart }) {
    const data = CATEGORY_METADATA[page] || {
        hero: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&q=80",
        tagline: "Explore our collection",
        description: "Discover quality craftsmanship and enduring beauty.",
        filters: ["All"],
        color: "#fdfaf7",
        accent: "#1a1a18",
    };
    const [activeFilter, setActiveFilter] = useState("All");
    const [priceRange, setPriceRange] = useState(5000);
    const [activeRating, setActiveRating] = useState(null);
    const [sort, setSort] = useState("featured");
    const [gridView, setGridView] = useState("grid");

    useReveal();

    const [limit, setLimit] = useState(8);

    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Fetch up to 100 products for this category to ensure we have enough for pagination
                const { data: resData } = await api.get(`/products?category=${encodeURIComponent(page)}&pageNumber=1`);

                // Map DB schema to frontend PremiumProductCard schema
                const adapted = (resData.products || []).map(p => ({
                    ...p,
                    id: p._id,
                    cat: p.category,
                    price: p.price,
                    img: p.images?.[0] || 'https://via.placeholder.com/600',
                    rating: p.ratings || 5, // Fallback if no ratings exist
                    oldPrice: null, // Optional
                }));
                setApiProducts(adapted);
            } catch (error) {
                console.error("Error fetching products", error);
                setApiProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    const filtered = apiProducts
        .filter(p => activeFilter === "All" || p.cat === activeFilter)
        .filter(p => {
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
            if (sort === "newest") return b.id.toString().localeCompare(a.id.toString());
            return 0;
        });

    const paginated = filtered.slice(0, limit);

    return (
        <div style={{ fontFamily: "'Inter',sans-serif" }}>

            <CategoryHero data={data} page={page} />

            <EditorialBand />

            {/* ═══ MAIN CONTENT ═══ */}
            <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 24px 80px" }}>

                {/* Top bar */}
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
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "100px 20px", color: "#666" }}>
                                Loading elegant pieces...
                            </div>
                        ) : filtered.length === 0 ? (
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
                                        <PremiumProductCard product={p} onAddCart={onAddCart} view={gridView} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {(!loading && limit < filtered.length) && (
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

            <BespokeCTA page={page} />
        </div>
    );
}

export default CategoryPage;
