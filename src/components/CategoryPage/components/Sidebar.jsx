import React, { useState } from 'react';
import { Star, CheckIcon } from '../../Shared/Icons';

/* ─────────────────────────── SIDEBAR FILTERS ─────────────────────────── */
export function Sidebar({ data, activeFilter, setActiveFilter, priceRange, setPriceRange, activeRating, setActiveRating }) {
    const [colorFilter, setColorFilter] = useState([]);
    const [openSections, setOpenSections] = useState({
        category: true, price: true, color: true, rating: false,
    });

    const toggle = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }));

    const colors = [
        { name: "Natural", hex: "#C4A882" },
        { name: "Walnut", hex: "#5C4A3A" },
        { name: "Slate", hex: "#A8A095" },
        { name: "Ivory", hex: "#f0ede8" },
        { name: "Forest", hex: "#6B7B6E" },
        { name: "Noir", hex: "#1a1a18" },
    ];

    const ChevronIcon = ({ open }) => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s ease" }}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );

    return (
        <aside className="sidebar" style={{ width: 220, flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
            <h3 style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: 2, color: "#bbb", marginBottom: 28,
            }}>
                Filters
            </h3>

            {/* Categories */}
            <div className="filter-section">
                <button onClick={() => toggle("category")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", background: "none", border: "none",
                    padding: "18px 0", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif", fontSize: 13,
                    fontWeight: 500, color: "#1a1a18", letterSpacing: ".2px",
                }}>
                    <span>Category</span>
                    <ChevronIcon open={openSections.category} />
                </button>
                {openSections.category && (
                    <div style={{ paddingBottom: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                        {data.filters.map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "7px 8px", border: "none", background: "none",
                                cursor: "pointer", textAlign: "left", width: "100%",
                                color: activeFilter === f ? "#1a1a18" : "#999",
                                fontWeight: activeFilter === f ? 500 : 400,
                                fontSize: 13, fontFamily: "'Inter',sans-serif",
                                transition: "all .18s ease", letterSpacing: ".2px",
                                borderRadius: 6,
                            }}
                                onMouseEnter={e => { if (activeFilter !== f) e.currentTarget.style.background = "#f5f3f0"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                            >
                                {f}
                                {activeFilter === f && <CheckIcon />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="filter-section">
                <button onClick={() => toggle("price")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", background: "none", border: "none",
                    padding: "18px 0", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif", fontSize: 13,
                    fontWeight: 500, color: "#1a1a18", letterSpacing: ".2px",
                }}>
                    <span>Price Range</span>
                    <ChevronIcon open={openSections.price} />
                </button>
                {openSections.price && (
                    <div style={{ paddingBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ fontSize: 11, color: "#aaa" }}>{"\u00a3"}0</span>
                            <span style={{ fontSize: 11, color: "#aaa" }}>
                                {"\u00a3"}{priceRange.toLocaleString()}
                            </span>
                        </div>
                        <input
                            type="range" className="slider"
                            min="200" max="5000" value={priceRange}
                            onChange={e => setPriceRange(Number(e.target.value))}
                            style={{
                                width: "100%",
                                background: `linear-gradient(to right,#1a1a18 ${(priceRange - 200) / 48}%,#e8e5e0 ${(priceRange - 200) / 48}%)`,
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Color */}
            <div className="filter-section">
                <button onClick={() => toggle("color")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", background: "none", border: "none",
                    padding: "18px 0", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif", fontSize: 13,
                    fontWeight: 500, color: "#1a1a18", letterSpacing: ".2px",
                }}>
                    <span>Color</span>
                    <ChevronIcon open={openSections.color} />
                </button>
                {openSections.color && (
                    <div style={{ paddingBottom: 20, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {colors.map(c => (
                            <button key={c.name}
                                onClick={() => setColorFilter(prev =>
                                    prev.includes(c.hex) ? prev.filter(x => x !== c.hex) : [...prev, c.hex]
                                )}
                                title={c.name}
                                style={{
                                    display: "flex", flexDirection: "column", alignItems: "center",
                                    gap: 6, background: "none", border: "none", cursor: "pointer",
                                    padding: 6, transition: "all .2s",
                                }}
                            >
                                <span style={{
                                    width: 24, height: 24, borderRadius: "50%", background: c.hex,
                                    border: colorFilter.includes(c.hex)
                                        ? "2px solid #1a1a18"
                                        : "1.5px solid rgba(0,0,0,0.08)",
                                    transition: "all .2s",
                                    transform: colorFilter.includes(c.hex) ? "scale(1.15)" : "scale(1)",
                                    display: "block",
                                }} />
                                <span style={{
                                    fontSize: 9, color: "#aaa", letterSpacing: ".3px",
                                    textTransform: "uppercase", fontWeight: 500,
                                }}>
                                    {c.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="filter-section">
                <button onClick={() => toggle("rating")} style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", background: "none", border: "none",
                    padding: "18px 0", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif", fontSize: 13,
                    fontWeight: 500, color: "#1a1a18", letterSpacing: ".2px",
                }}>
                    <span>Rating</span>
                    <ChevronIcon open={openSections.rating} />
                </button>
                {openSections.rating && (
                    <div style={{ paddingBottom: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                        {[5, 4, 3].map(r => (
                            <button key={r} onClick={() => setActiveRating(activeRating === r ? null : r)} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "7px 8px", border: "none", borderRadius: 6,
                                cursor: "pointer", fontFamily: "'Inter',sans-serif",
                                background: activeRating === r ? "#f5f3f0" : "transparent",
                                transition: "all .2s",
                            }}>
                                <div style={{ display: "flex", gap: 2 }}>
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} filled={s <= r} />)}
                                </div>
                                <span style={{ fontSize: 12, color: "#aaa" }}>& up</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button className="btn-o" style={{ width: "100%", justifyContent: "center", fontSize: 12, marginTop: 8 }}
                onClick={() => {
                    setActiveFilter("All");
                    setPriceRange(5000);
                    setActiveRating(null);
                    setColorFilter([]);
                }}
            >
                Clear All Filters
            </button>
        </aside>
    );
}
