import React, { useState, useRef, useCallback, useEffect } from "react";
import CartToast from "../Shared/CartToast";
import { useCart } from "../../context/CartContext";
import CategoryPage from "./CategoryPage"; // default export
import Footer from "../Footer/Footer";

export default function PremiumCategoryApp({ initialCategory = "Furniture" }) {
    const [activePage, setActivePage] = useState(initialCategory);
    const { addToCart } = useCart();
    const [toast, setToast] = useState({ visible: false, item: null });
    const toastTimer = useRef(null);

    // Sync state when URL changes
    useEffect(() => {
        setActivePage(initialCategory);
    }, [initialCategory]);

    const handleAddCart = useCallback((product) => {
        addToCart(product, 1);
        setToast({ visible: true, item: product });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
    }, [addToCart]);

    return (
        <div style={{ minHeight: "100vh", background: "#FDFCFA" }}>
            {/* Navbar is in MainLayout, SearchOverlay is in Navbar */}
            <main style={{ paddingTop: 80 }}>
                <CategoryPage key={activePage} page={activePage} onAddCart={handleAddCart} />
            </main>
            <CartToast item={toast.item} visible={toast.visible} />
            {/* MainLayout doesn't render Footer natively, so we render it here */}
            <Footer />
        </div>
    );
}
