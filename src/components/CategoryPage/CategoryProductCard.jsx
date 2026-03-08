import { memo } from 'react';

function CategoryProductCard({ product }) {
    return (
        <div className="group flex flex-col relative bg-white rounded-[24px] p-4 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]">
            {/* Image Container with refined background & zoom */}
            <div className="relative w-full aspect-[4/5] bg-[#F8F9FA] rounded-[16px] overflow-hidden mb-5 transition-colors duration-500 group-hover:bg-[#F1F3F5] flex items-center justify-center p-6">

                {/* Sale Badge - Premium pill design */}
                {product.sale && (
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/20">
                        <span className="text-[#111] text-[0.65rem] font-bold tracking-[0.06em] uppercase">Sale</span>
                    </div>
                )}

                <img
                    className="w-full h-full object-contain transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    style={{ mixBlendMode: 'multiply' }}
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                />

                {/* Quick Action Button - Reveals on Hover */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <button className="w-full bg-white/95 backdrop-blur-md text-[#111] text-[0.8rem] font-semibold py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-white/40 hover:bg-[#111] hover:text-white transition-colors duration-300">
                        Quick View
                    </button>
                </div>
            </div>

            {/* Typography & Details Container */}
            <div className="px-1 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[0.7rem] font-medium text-[#888] tracking-[0.02em] uppercase">
                        {product.type}
                    </span>
                    {/* Star Rating snippet */}
                    <div className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#111" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-[0.7rem] font-semibold text-[#111]">{product.rating}</span>
                    </div>
                </div>

                <h3 className="text-[0.95rem] font-bold text-[#111] leading-[1.3] mb-3 tracking-tight group-hover:text-[#444] transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        {product.sale ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[0.95rem] font-bold text-[#E05252]">{product.price}</span>
                                <span className="text-[0.75rem] font-medium text-[#aaa] line-through">
                                    £ {(product.numericPrice * 1.2).toLocaleString()}
                                </span>
                            </div>
                        ) : (
                            <span className="text-[0.95rem] font-bold text-[#111]">{product.price}</span>
                        )}
                    </div>

                    {/* Add to cart icon */}
                    <button className="w-8 h-8 rounded-full border border-[#eaeaea] flex items-center justify-center text-[#111] hover:bg-[#111] hover:text-white hover:border-[#111] transition-colors duration-300 group/btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/btn:scale-110">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(CategoryProductCard);
