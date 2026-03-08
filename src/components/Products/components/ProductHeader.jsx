import { memo } from 'react';

function ProductHeader() {
    return (
        <div className="flex items-end justify-between mb-7 px-0.5">
            <h2
                className="font-bold text-[#111110] tracking-[-0.04em] leading-none"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}
            >
                Interiors by Prabott.
            </h2>

            <div className="flex items-center gap-5 shrink-0 pb-1.5">
                <button
                    className="bg-none border-none cursor-pointer p-1 text-[#333] flex items-center justify-center hover:text-[#111] hover:scale-[1.15] active:scale-[0.92] transition-all"
                    aria-label="Previous"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <button
                    className="bg-none border-none cursor-pointer p-1 text-[#333] flex items-center justify-center hover:text-[#111] hover:scale-[1.15] active:scale-[0.92] transition-all"
                    aria-label="Next"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default memo(ProductHeader);
