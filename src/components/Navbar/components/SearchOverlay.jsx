import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchOverlay({ searchOpen, setSearchOpen }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const overlayRef = useRef(null);
    const inputRef = useRef(null);

    // Focus trap & Auto-focus
    useEffect(() => {
        if (!searchOpen) return;

        // Small delay to ensure transition started
        const timer = setTimeout(() => inputRef.current?.focus(), 50);

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;
            const focusableElms = overlayRef.current?.querySelectorAll('button, input, [href]');
            if (!focusableElms) return;
            const first = focusableElms[0];
            const last = focusableElms[focusableElms.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleTab);
        return () => {
            window.removeEventListener('keydown', handleTab);
            clearTimeout(timer);
        };
    }, [searchOpen]);

    const handleSearch = () => {
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setSearchOpen(false);
        setQuery("");
    };
    return (
        <div
            ref={overlayRef}
            className={`fixed inset-0 z-[300] flex items-start justify-center pt-20 transition-opacity duration-300 ${searchOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
                }`}
            style={{ background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
            role="dialog"
            aria-modal="true"
            aria-label="Search site"
        >
            <div
                className={`bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex items-center gap-3 w-[min(600px,90vw)] transition-transform duration-300 ${searchOpen
                    ? 'translate-y-0 scale-100'
                    : '-translate-y-3 scale-[0.97]'
                    }`}
                style={{ padding: '6px 6px 6px 20px' }}
            >
                <div className="flex items-center gap-3 flex-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for chairs, sofas, tables…"
                        className="border-none outline-none font-inter text-base font-normal text-[#111] flex-1 bg-transparent placeholder:text-[#bbb]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        aria-label="Search query"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-[#111] text-white border-none cursor-pointer rounded-[11px] px-5 py-2.5 font-inter text-[0.82rem] font-medium whitespace-nowrap hover:bg-[#333] transition-colors"
                >
                    Search
                </button>
                <button
                    className="bg-[#f3f3f3] border-none cursor-pointer rounded-[9px] w-9 h-9 flex items-center justify-center text-[#555] hover:bg-[#eaeaea] transition-colors shrink-0"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
