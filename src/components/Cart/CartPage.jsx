import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CartItem({ item, onQtyChange, onRemove }) {
    const [removing, setRemoving] = useState(false);

    const handleRemove = () => {
        setRemoving(true);
        setTimeout(() => onRemove(item.id), 400);
    };

    return (
        <div
            className={`group transition-all duration-500 ease-out ${removing ? 'opacity-0 -translate-x-8 max-h-0 py-0 overflow-hidden' : 'opacity-100 translate-x-0 max-h-[300px]'}`}
        >
            <div className="flex items-center gap-6 py-6 border-b border-[#edeae6] max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4">
                {/* Product Image */}
                <div className="w-[120px] h-[120px] bg-[#F7F5F2] rounded-[14px] shrink-0 overflow-hidden max-[700px]:w-full max-[700px]:h-[200px]">
                    <img
                        src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL || ''}${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-semibold text-[#1A1A1A] tracking-[-0.01em] mb-1">{item.name}</h3>
                    <p className="text-[13px] text-[#999]">{item.description}</p>
                    <p className="text-[15px] font-medium text-[#555] mt-2">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Quantity + Price + Remove */}
                <div className="flex items-center gap-8 max-[700px]:w-full max-[700px]:justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-[#F7F5F2] rounded-[10px] overflow-hidden">
                        <button
                            onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-[#1A1A1A] hover:bg-[#ece9e4] transition-all duration-200 cursor-pointer border-none bg-transparent text-[18px] font-light"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="w-10 text-center text-[15px] font-semibold text-[#1A1A1A] select-none">{item.quantity}</span>
                        <button
                            onClick={() => onQtyChange(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-[#666] hover:text-[#1A1A1A] hover:bg-[#ece9e4] transition-all duration-200 cursor-pointer border-none bg-transparent text-[18px] font-light"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    {/* Subtotal */}
                    <span className="text-[18px] font-bold text-[#1A1A1A] tracking-[-0.02em] min-w-[100px] text-right">
                        ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>

                    {/* Remove */}
                    <button
                        onClick={handleRemove}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[#bbb] hover:text-white hover:bg-[#E05252] transition-all duration-200 cursor-pointer border-none bg-transparent shrink-0"
                        aria-label="Remove item"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const { items, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    const handleQtyChange = (id, newQty) => {
        updateQuantity(id, newQty);
    };

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal;
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#FDFCFA' }}>
            {/* Full-width content area */}
            <div className="w-full px-[18px] pt-[100px] pb-0">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[13px] mb-6 px-4 animate-fade-in-up">
                    <Link to="/" className="text-[#999] hover:text-[#1A1A1A] transition-colors no-underline">Home</Link>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    <span className="text-[#1A1A1A] font-medium">Shopping Cart</span>
                </nav>

                {/* Page Header */}
                <div className="flex items-end justify-between mb-8 px-4 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
                    <div>
                        <h1 className="text-[clamp(26px,3.5vw,36px)] font-bold text-[#1A1A1A] tracking-[-0.03em] leading-tight">
                            Your Cart
                        </h1>
                        <p className="text-[14px] text-[#999] mt-1">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="hidden sm:flex items-center gap-2 text-[14px] font-medium text-[#666] hover:text-[#1A1A1A] transition-colors no-underline group/link"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                        Continue shopping
                    </Link>
                </div>

                {/* ═══ Full-width two column layout ═══ */}
                <div className="flex gap-0 items-start max-[960px]:flex-col">

                    {/* ── LEFT: Cart Items ── */}
                    <div className="flex-1 min-w-0 bg-white rounded-[20px] border border-[#f0eeeb] px-8 py-2 max-[600px]:px-5">
                        {items.length > 0 ? (
                            <>
                                {/* Table header */}
                                <div className="hidden md:grid grid-cols-[1fr_auto] items-center py-4 border-b border-[#edeae6]">
                                    <span className="text-[13px] font-semibold text-[#999] uppercase tracking-[0.06em]">Product</span>
                                    <div className="flex items-center gap-8">
                                        <span className="text-[13px] font-semibold text-[#999] uppercase tracking-[0.06em] w-[120px] text-center">Quantity</span>
                                        <span className="text-[13px] font-semibold text-[#999] uppercase tracking-[0.06em] min-w-[100px] text-right">Total</span>
                                        <span className="w-9" />
                                    </div>
                                </div>

                                {items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onQtyChange={handleQtyChange}
                                        onRemove={handleRemove}
                                    />
                                ))}

                            </>
                        ) : (
                            /* Empty Cart State */
                            <div className="text-center py-24 animate-fade-in-up">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F7F5F2] flex items-center justify-center">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </div>
                                <h2 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">Your cart is empty</h2>
                                <p className="text-[15px] text-[#999] mb-8">Looks like you haven't added anything yet.</p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-8 py-3.5 rounded-[12px] text-[14px] font-semibold no-underline hover:bg-[#333] transition-colors"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Order Summary ── */}
                    {items.length > 0 && (
                        <div className="w-full max-[960px]:w-full min-[961px]:w-[420px] shrink-0 min-[961px]:pl-6 max-[960px]:mt-6 animate-fade-in-up" style={{ animationDelay: '120ms' }}>
                            <div className="sticky top-[100px] bg-white rounded-[20px] p-8 text-[#1A1A1A] border border-[#f0eeeb]">
                                <h2 className="text-[22px] font-bold tracking-[-0.02em] mb-7">Order Summary</h2>

                                <div className="flex flex-col gap-4 pb-6 border-b border-[#f0eeeb]">
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#888]">Subtotal ({totalItems} items)</span>
                                        <span className="font-semibold">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>

                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#888]">Shipping</span>
                                        <span className="font-semibold text-[#4CAF50]">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-baseline pt-6 mb-8">
                                    <span className="text-[16px] font-medium text-[#1A1A1A]">Grand Total</span>
                                    <span className="text-[32px] font-bold tracking-[-0.03em]">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>

                                <button onClick={handleCheckout} className="w-full h-[56px] bg-[#1A1A1A] text-white rounded-[14px] text-[15px] font-bold tracking-[-0.01em] hover:bg-[#333] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none mb-4 flex items-center justify-center gap-2 font-['Inter',sans-serif]">
                                    Proceed to Checkout
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </button>

                                <Link
                                    to="/"
                                    className="w-full h-[48px] border border-[#e8e4df] text-[#1A1A1A] rounded-[14px] text-[14px] font-medium hover:bg-[#F7F5F2] transition-all duration-200 no-underline flex items-center justify-center font-['Inter',sans-serif]"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-6 mt-7 pt-6 border-t border-[#f0eeeb]">
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#aaa]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        Secure
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#aaa]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        Protected
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#aaa]">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                                        Free Returns
                                    </div>
                                </div>

                                {/* Payment Icons */}
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <div className="px-3 py-1 rounded-[6px] bg-[#F7F5F2] text-[10px] font-bold text-[#666] tracking-[0.05em]">VISA</div>
                                    <div className="px-3 py-1 rounded-[6px] bg-[#F7F5F2] text-[10px] font-bold text-[#666] tracking-[0.05em]">MC</div>
                                    <div className="px-3 py-1 rounded-[6px] bg-[#F7F5F2] text-[10px] font-bold text-[#666] tracking-[0.05em]">AMEX</div>
                                    <div className="px-3 py-1 rounded-[6px] bg-[#F7F5F2] text-[10px] font-bold text-[#666] tracking-[0.05em]">GPay</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12">
                <Footer />
            </div>
        </div>
    );
}
