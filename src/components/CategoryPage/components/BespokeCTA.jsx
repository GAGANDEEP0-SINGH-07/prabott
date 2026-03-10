import React from 'react';

export function BespokeCTA({ page }) {
    return (
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
    );
}
