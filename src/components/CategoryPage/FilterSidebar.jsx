import { memo } from 'react';

function FilterSidebar({ filters, setFilters, availableTypes, availableColors }) {
    const handleTypeChange = (type) => {
        setFilters(prev => {
            const types = prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type];
            return { ...prev, types };
        });
    };

    const handleColorChange = (color) => {
        setFilters(prev => {
            const colors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];
            return { ...prev, colors };
        });
    };

    const handlePriceChange = (e, index) => {
        const value = parseInt(e.target.value) || 0;
        setFilters(prev => {
            const newRange = [...prev.priceRange];
            newRange[index] = value;
            return { ...prev, priceRange: newRange };
        });
    };

    return (
        <div className="bg-white rounded-[24px] p-7 border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.03)] sticky top-24">
            <h3 className="font-bold text-[#111] text-[1.15rem] tracking-tight mb-6">Filters</h3>

            {/* Price Filter */}
            <div className="mb-8">
                <h4 className="font-semibold text-[0.8rem] text-[#666] tracking-[0.04em] uppercase mb-4">Price Range</h4>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] text-[0.85rem]">£</span>
                        <input
                            type="number"
                            value={filters.priceRange[0]}
                            onChange={(e) => handlePriceChange(e, 0)}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-[0.85rem] font-medium text-[#111] outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all hover:bg-white inset-shadow-sm"
                            placeholder="Min"
                        />
                    </div>
                    <span className="text-[#ccc]">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999] text-[0.85rem]">£</span>
                        <input
                            type="number"
                            value={filters.priceRange[1]}
                            onChange={(e) => handlePriceChange(e, 1)}
                            className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-[0.85rem] font-medium text-[#111] outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all hover:bg-white inset-shadow-sm"
                            placeholder="Max"
                        />
                    </div>
                </div>
            </div>

            {/* Type/Category Filter */}
            {availableTypes.length > 0 && (
                <div className="mb-8">
                    <h4 className="font-semibold text-[0.8rem] text-[#666] tracking-[0.04em] uppercase mb-4">Type</h4>
                    <div className="flex flex-col gap-3">
                        {availableTypes.map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`relative w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${filters.types.includes(type) ? 'bg-[#111] border-[#111]' : 'border-gray-300 bg-[#FAFAFA] group-hover:border-gray-400'}`}>
                                    <svg
                                        className={`absolute w-[10px] h-[10px] text-white transition-transform duration-300 ease-spring ${filters.types.includes(type) ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className={`text-[0.9rem] transition-colors duration-200 ${filters.types.includes(type) ? 'text-[#111] font-medium' : 'text-[#555] group-hover:text-[#111]'}`}>{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Filter */}
            {availableColors.length > 0 && (
                <div className="mb-8">
                    <h4 className="font-semibold text-[0.8rem] text-[#666] tracking-[0.04em] uppercase mb-4">Color</h4>
                    <div className="flex flex-wrap gap-2.5">
                        {availableColors.map(color => {
                            const isSelected = filters.colors.includes(color);
                            // Very basic dynamic color mapping for the mock.
                            const bgMap = {
                                'Black': '#111', 'White': '#fff', 'Brown': '#8B5A2B',
                                'Grey': '#9E9E9E', 'Gold': '#D4AF37', 'Green': '#4CAF50', 'Multi': 'linear-gradient(45deg, #f06, #9f6)'
                            };
                            return (
                                <button
                                    key={color}
                                    onClick={() => handleColorChange(color)}
                                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'ring-2 ring-offset-2 ring-[#111] scale-105' : 'ring-2 ring-transparent ring-offset-2 hover:ring-gray-200 hover:scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'}`}
                                    title={color}
                                >
                                    <div
                                        className="w-[22px] h-[22px] rounded-full border border-black/5"
                                        style={{ background: bgMap[color] || '#ccc' }}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* In Stock & Sale items map */}
            <div className="mb-6 flex flex-col gap-4">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[0.9rem] text-[#444] font-medium group-hover:text-[#111] transition-colors">In Stock Only</span>
                    <div className={`relative w-10 h-[22px] rounded-full p-0.5 transition-colors duration-300 ${filters.inStockOnly ? 'bg-[#111]' : 'bg-[#e0e0e0]'}`}>
                        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-spring ${filters.inStockOnly ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                    />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-[0.9rem] text-[#444] font-medium group-hover:text-[#111] transition-colors">On Sale</span>
                    <div className={`relative w-10 h-[22px] rounded-full p-0.5 transition-colors duration-300 ${filters.saleOnly ? 'bg-[#111]' : 'bg-[#e0e0e0]'}`}>
                        <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-spring ${filters.saleOnly ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                    </div>
                    <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.saleOnly || false}
                        onChange={(e) => setFilters({ ...filters, saleOnly: e.target.checked })}
                    />
                </label>
            </div>

            {/* Clear Filters Button with Premium Hover Effect */}
            <div className={`transition-all duration-500 overflow-hidden ${(filters.types.length > 0 || filters.colors.length > 0 || filters.inStockOnly || filters.saleOnly || filters.priceRange[0] > 0 || filters.priceRange[1] < 5000)
                    ? 'max-h-20 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0 pt-0'
                }`}>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />
                <button
                    onClick={() => setFilters({ priceRange: [0, 5000], types: [], colors: [], rating: 0, inStockOnly: false, saleOnly: false })}
                    className="w-full relative overflow-hidden py-3 text-[0.85rem] font-semibold text-[#666] bg-[#FAFAFA] border border-gray-200 rounded-xl hover:text-[#111] transition-colors group"
                >
                    <div className="absolute inset-0 bg-gray-100 scale-x-0 origin-left transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
                    <span className="relative z-10">Clear All Filters</span>
                </button>
            </div>
        </div>
    );
}

export default memo(FilterSidebar);
