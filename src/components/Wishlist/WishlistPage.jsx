import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Footer from '../Footer/Footer';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item);
        // Optional: remove from wishlist when added to cart
        // removeFromWishlist(item.id);
    };

    return (
        <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#FDFCFA' }}>
            <div className="w-full px-[18px] pt-[100px] pb-24">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[13px] mb-6 px-4">
                    <Link to="/" className="text-[#999] hover:text-[#1A1A1A] transition-colors no-underline">Home</Link>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    <span className="text-[#1A1A1A] font-medium">My Wishlist</span>
                </nav>

                <div className="px-4 mb-10">
                    <h1 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#1A1A1A] tracking-[-0.03em] leading-tight mb-2">
                        My Wishlist
                    </h1>
                    <p className="text-[14px] text-[#999]">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved in your wishlist
                    </p>
                </div>

                <div className="px-4">
                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <div key={item.id} className="group bg-white rounded-[24px] border border-[#f0eeeb] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                                    <div className="h-[280px] overflow-hidden relative">
                                        <img
                                            src={item.image || item.img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-white hover:text-[#E05252] transition-all border-none cursor-pointer shadow-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-2">{item.category || item.cat}</p>
                                        <h3 className="text-[17px] font-bold text-[#1A1A1A] mb-3">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[18px] font-bold text-[#1A1A1A]">
                                                ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                                            </span>
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-[12px] text-[13px] font-bold hover:bg-[#333] transition-colors border-none cursor-pointer"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[30px] border border-[#f0eeeb]">
                            <div className="w-20 h-20 bg-[#F7F5F2] rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-[32px]">♡</span>
                            </div>
                            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
                            <p className="text-[#999] mb-10 max-w-[400px] mx-auto">
                                Browsing our collection and save items you love to find them here easily.
                            </p>
                            <Link
                                to="/collections"
                                className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3.5 rounded-[16px] text-[15px] font-bold no-underline hover:bg-[#333] transition-all"
                            >
                                Browse Collections
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
