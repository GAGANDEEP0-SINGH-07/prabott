import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import ProfileDropdown from './ProfileDropdown';

export default function NavIcons({ setSearchOpen, drawerOpen, setDrawerOpen }) {
    const navigate = useNavigate();
    const { items: cartItems } = useCart();
    const { wishlist } = useWishlist();

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    return (
        <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            <button
                className="bg-none border-none cursor-pointer w-9 h-9 rounded-[10px] text-[#444] flex items-center justify-center hover:text-[#111] hover:bg-black/5 hover:-translate-y-px active:translate-y-0 active:scale-95 transition-all"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>

            {/* Wishlist — hidden on mobile */}
            <Link
                to="/wishlist"
                className="hidden min-[961px]:flex relative bg-none border-none cursor-pointer w-9 h-9 rounded-[10px] text-[#444] items-center justify-center hover:text-[#111] hover:bg-black/5 hover:-translate-y-px active:translate-y-0 active:scale-95 transition-all"
                aria-label="Wishlist"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishlistCount > 0 && (
                    <span className="cart-badge-anim absolute top-[5px] right-[5px] bg-[#E05252] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border-[1.5px] border-white/85">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            {/* Divider — hidden on mobile */}
            <div className="hidden min-[961px]:block w-px h-[22px] bg-[#e0e0e0] mx-1.5 shrink-0" />

            {/* Cart */}
            <Link
                to="/cart"
                className="relative bg-none border-none cursor-pointer w-9 h-9 rounded-[10px] text-[#444] flex items-center justify-center hover:text-[#111] hover:bg-black/5 hover:-translate-y-px active:translate-y-0 active:scale-95 transition-all"
                aria-label="Cart"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                    <span className="cart-badge-anim absolute top-[5px] right-[5px] bg-[#111] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border-[1.5px] border-white/85">
                        {cartCount}
                    </span>
                )}
            </Link>

            {/* Profile — shows icon or avatar+dropdown */}
            <ProfileDropdown />

            {/* Hamburger — visible on mobile */}
            <button
                className={`flex min-[961px]:hidden flex-col gap-[4.5px] bg-none border-none cursor-pointer p-1.5 rounded-lg hover:bg-black/5 transition-colors ${drawerOpen ? 'hamburger-open' : ''
                    }`}
                aria-label="Menu"
                onClick={() => setDrawerOpen(!drawerOpen)}
            >
                <span className="block w-5 h-[1.5px] bg-[#333] rounded-sm origin-center transition-all duration-300" />
                <span className="block w-5 h-[1.5px] bg-[#333] rounded-sm origin-center transition-all duration-300" />
                <span className="block w-5 h-[1.5px] bg-[#333] rounded-sm origin-center transition-all duration-300" />
            </button>
        </div>
    );
}
