import { useState, useRef, useCallback, useEffect } from "react";
import { GlobalStyles, CartToast } from "./Shared";
import { useCart } from "../../context/CartContext";
import { CategoryPage } from "./CategoryPage";
import { Navbar } from "./Navigation";
import SearchOverlay from "../Navbar/components/SearchOverlay";
import Footer from "../Footer/Footer";

/* ─────────────────────────── PREMIUM CATEGORY APP ─────────────────────────── */
export default function PremiumCategoryApp({ initialCategory = "Furniture" }) {
    const [activePage, setActivePage] = useState(initialCategory);
    const { addToCart } = useCart();
    const [toast, setToast] = useState({ visible: false, item: null });
    const [searchOpen, setSearchOpen] = useState(false);
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
            <GlobalStyles />
            <Navbar
                activePage={activePage}
                onNavigate={setActivePage}
                onSearchOpen={() => setSearchOpen(true)}
            />
            <SearchOverlay searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            <main style={{ paddingTop: 80 }}>
                <CategoryPage key={activePage} page={activePage} onAddCart={handleAddCart} />
            </main>
            <CartToast item={toast.item} visible={toast.visible} />
            <Footer />
        </div>
    );
}
