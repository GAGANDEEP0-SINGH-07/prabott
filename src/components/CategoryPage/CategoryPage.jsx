import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import CategoryProductCard from './CategoryProductCard';
import FilterSidebar from './FilterSidebar';
import { products as allProducts, getColorsForCategory, getTypesForCategory } from '../../data/products';
import Footer from '../Footer/Footer';

export default function CategoryPage() {
    const { categoryName } = useParams();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // "furniture" => "Furniture", "mirrors-decors" => "Mirrors & Decors", etc.
    const decodedCategoryName = categoryName ? decodeURIComponent(categoryName.replace(/-/g, ' ')).replace(/and/g, '&') : '';
    // Match against actual categories in data
    const matchedCategory = allProducts.find(p => p.category.toLowerCase().includes(decodedCategoryName.toLowerCase()))?.category || (categoryName.charAt(0).toUpperCase() + categoryName.slice(1));

    const [filters, setFilters] = useState({
        priceRange: [0, 5000],
        types: [],
        colors: [],
        rating: 0,
        inStockOnly: false,
        saleOnly: false,
    });
    const [sortOption, setSortOption] = useState('featured');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Dynamic filters
    const availableTypes = useMemo(() => getTypesForCategory(matchedCategory), [matchedCategory]);
    const availableColors = useMemo(() => getColorsForCategory(matchedCategory), [matchedCategory]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = allProducts.filter(p => p.category === matchedCategory);

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
            result = result.filter(p => p.numericPrice >= filters.priceRange[0] && p.numericPrice <= filters.priceRange[1]);
        }
        if (filters.types.length > 0) result = result.filter(p => filters.types.includes(p.type));
        if (filters.colors.length > 0) result = result.filter(p => filters.colors.includes(p.color));
        if (filters.inStockOnly) result = result.filter(p => p.inStock);
        if (filters.saleOnly) result = result.filter(p => p.sale);

        if (sortOption === 'price-low-high') result.sort((a, b) => a.numericPrice - b.numericPrice);
        else if (sortOption === 'price-high-low') result.sort((a, b) => b.numericPrice - a.numericPrice);
        else if (sortOption === 'newest') result.sort((a, b) => b.id.localeCompare(a.id));

        return result;
    }, [matchedCategory, filters, sortOption]);

    return (
        <div className="font-inter min-h-screen bg-[#FAFAFA] flex flex-col selection:bg-black/10 selection:text-black">
            <Navbar />

            <main className="flex-1 w-full max-w-[1440px] auto-rows-max mx-auto px-5 sm:px-8 py-12 lg:py-20 animate-fade-in-up">

                {/* Refined Page Header with clamp() typography */}
                <header className="mb-14 lg:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center justify-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-gray-200 to-transparent opacity-20 blur-3xl pointer-events-none rounded-full" />

                    <span className="text-[0.8rem] font-bold tracking-[0.1em] text-[#888] uppercase mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Collection
                    </span>
                    <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold text-[#111] tracking-tighter leading-[1.05] mb-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {matchedCategory}
                    </h1>
                    <p className="text-[#666] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed font-normal max-w-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        Discover our exclusive collection of {matchedCategory.toLowerCase()}, crafted with premium materials to elevate your everyday living.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            availableTypes={availableTypes}
                            availableColors={availableColors}
                        />
                    </aside>

                    <div className="flex-1 flex flex-col min-w-0">

                        {/* Premium Sort & Filter Toolbar */}
                        <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl p-3 pl-5 rounded-[20px] shadow-[0_4px_32px_rgba(0,0,0,0.03)] border border-white/60 mb-8 sticky top-24 z-20">

                            {/* Mobile trigger */}
                            <button
                                className="lg:hidden flex items-center gap-2.5 bg-[#111] px-5 py-2.5 rounded-xl text-[0.85rem] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                                Filters
                            </button>

                            <span className="text-[0.85rem] font-medium text-[#777] hidden lg:block">
                                Showing <span className="text-[#111] font-bold">{filteredAndSortedProducts.length}</span> luxury pieces
                            </span>

                            <div className="flex items-center gap-3 ml-auto px-2">
                                <span className="text-[0.85rem] text-[#666] font-medium hidden sm:block">Sort priority</span>
                                <div className="relative group">
                                    <select
                                        className="appearance-none bg-transparent hover:bg-gray-50 text-[#111] text-[0.9rem] font-bold tracking-tight outline-none cursor-pointer py-1.5 pl-3 pr-8 rounded-lg transition-colors border border-transparent focus:border-gray-200"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="price-low-high">Lowest Price</option>
                                        <option value="price-high-low">Premium First</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Redefined Grid layout */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {filteredAndSortedProducts.map((product, idx) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${(idx % 6) * 100}ms` }}>
                                        <CategoryProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <h3 className="text-[1.3rem] font-bold text-[#111] mb-3 tracking-tight">No match found</h3>
                                <p className="text-[#666] text-[1rem] max-w-sm leading-relaxed">
                                    We couldn't find any pieces matching your current filters.
                                </p>
                                <button
                                    onClick={() => setFilters({ priceRange: [0, 5000], types: [], colors: [], rating: 0, inStockOnly: false, saleOnly: false })}
                                    className="mt-8 px-8 py-3.5 bg-[#111] text-white rounded-[14px] text-[0.9rem] font-bold tracking-wide hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:bg-[#222] transition-all duration-300"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Premium Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-[300] transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                <div className={`absolute right-0 top-0 bottom-0 w-full max-w-[340px] bg-[#FAFAFA] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-spring flex flex-col ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
                        <h3 className="font-bold text-[#111] text-[1.2rem] tracking-tight">Filter Pieces</h3>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-[#666] hover:bg-gray-100 hover:text-[#111] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            availableTypes={availableTypes}
                            availableColors={availableColors}
                        />
                    </div>
                    <div className="p-6 bg-white border-t border-gray-100">
                        <button
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="w-full py-4 bg-[#111] hover:bg-[#222] text-white rounded-2xl font-bold text-[0.95rem] tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98]"
                        >
                            View {filteredAndSortedProducts.length} Results
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
