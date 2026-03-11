import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SearchOverlay from './components/SearchOverlay';
import MobileDrawer from './components/MobileDrawer';
import DesktopNav from './components/DesktopNav';
import NavIcons from './components/NavIcons';

const navLinks = [
    'Furniture',
    'Outdoor',
    'Lighting',
    'Dining',
    'Bathrooms',
    'Mirrors & Décor',
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Optimized scroll handler with passive listener
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    return (
        <>
            <SearchOverlay searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

            <MobileDrawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                navLinks={navLinks}
            />

            {/* ── Navbar ── */}
            <header
                className={`sticky top-0 z-[200] nav-slide-in transition-all duration-[350ms] ease-in-out ${scrolled ? 'px-[18px] pt-2' : 'px-[18px] pt-[14px]'
                    }`}
                role="banner"
            >
                <nav
                    className={`flex items-center justify-between gap-5 rounded-[18px] border border-white/70 transition-all duration-[350ms] ease-in-out ${scrolled
                        ? 'h-14 shadow-[0_4px_32px_rgba(0,0,0,0.1),0_1px_6px_rgba(0,0,0,0.06)]'
                        : 'h-[62px] shadow-[0_2px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]'
                        }`}
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(18px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
                        padding: '0 32px',
                    }}
                    aria-label="Main navigation"
                >
                    {/* Logo */}
                    <Link to="/" className="text-[1.22rem] font-bold text-[#111] tracking-[-0.035em] no-underline whitespace-nowrap shrink-0 hover:opacity-75 transition-opacity">
                        Prabott<span className="text-[#bbb]">.</span>
                    </Link>

                    <DesktopNav navLinks={navLinks} />

                    <NavIcons
                        setSearchOpen={setSearchOpen}
                        drawerOpen={drawerOpen}
                        setDrawerOpen={setDrawerOpen}
                    />
                </nav>
            </header>
        </>
    );
}
