import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        country: 'United Kingdom',
        email: user?.email || '',
        phone: '',
    });

    const [shippingMethod, setShippingMethod] = useState({
        id: 'standard',
        name: 'Standard Shipping',
        price: 0,
        deliveryText: '5-7 Business Days',
    });

    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardName: '',
    });

    const [errors, setErrors] = useState({});

    const SHIPPING_METHODS = [
        { id: 'standard', name: 'Standard Shipping', price: 0, deliveryText: '5-7 Business Days' },
        { id: 'express', name: 'Express Shipping', price: 15, deliveryText: '2-3 Business Days' },
        { id: 'nextday', name: 'Next Day Delivery', price: 29, deliveryText: '1 Business Day' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        if (items.length === 0 && step !== 4) {
            navigate('/cart');
        }
    }, [items.length, navigate, step]);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + shippingMethod.price;
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!shippingDetails.firstName) e.firstName = 'Required';
            if (!shippingDetails.lastName) e.lastName = 'Required';
            if (!shippingDetails.address) e.address = 'Required';
            if (!shippingDetails.city) e.city = 'Required';
            if (!shippingDetails.zipCode) e.zipCode = 'Required';
            if (!shippingDetails.email || !shippingDetails.email.includes('@')) e.email = 'Valid email required';
        } else if (s === 3) {
            if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Invalid card number';
            if (!paymentDetails.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Use MM/YY';
            if (paymentDetails.cvv.length < 3) e.cvv = 'Required';
            if (!paymentDetails.cardName) e.cardName = 'Required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        const orderId = `PB-2024-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const estimatedDelivery = new Date();
        const daysToAdd = shippingMethod.id === 'standard' ? 7 : shippingMethod.id === 'express' ? 3 : 1;
        estimatedDelivery.setDate(estimatedDelivery.getDate() + daysToAdd);

        const orderData = {
            orderId,
            items: [...items],
            subtotal,
            shippingMethod,
            total,
            shippingDetails,
            email: shippingDetails.email,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            estimatedDelivery: estimatedDelivery.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: 'Processing'
        };

        // Save to User's Order History in localStorage
        const userId = user?.email || 'guest';
        const historyKey = `prabott_orders_${userId}`;
        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
        localStorage.setItem(historyKey, JSON.stringify([orderData, ...existingHistory]));

        clearCart();
        navigate('/order-confirmation', { state: { orderData } });
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) return parts.join(' ');
        return value;
    };

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#FDFCFA' }}>
            <div className="w-full px-[18px] pt-[100px] pb-24">

                {/* Progress Indicator */}
                <div className="max-w-[800px] mx-auto mb-12 px-4">
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e8e4df] -translate-y-1/2 z-0" />
                        <div className="absolute top-1/2 left-0 h-[2px] bg-[#1A1A1A] -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${step >= s ? 'bg-[#1A1A1A] text-white' : 'bg-white border-2 border-[#e8e4df] text-[#999]'}`}>
                                    {step > s ? '✓' : s}
                                </div>
                                <span className={`absolute -bottom-7 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${step >= s ? 'text-[#1A1A1A]' : 'text-[#999]'}`}>
                                    {s === 1 ? 'Shipping' : s === 2 ? 'Method' : 'Payment'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-8 items-start max-[960px]:flex-col max-w-[1200px] mx-auto">
                    {/* LEFT: Step Content */}
                    <div className="flex-1 min-w-0 bg-white rounded-[24px] border border-[#f0eeeb] p-8 max-[600px]:p-5 w-full shadow-sm">

                        {/* STEP 1: SHIPPING INFORMATION */}
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8 tracking-tight">Shipping Information</h2>
                                <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={shippingDetails.email}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.email ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                        {errors.email && <span className="text-[11px] text-[#E05252] font-semibold ml-1">{errors.email}</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={shippingDetails.firstName}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, firstName: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.firstName ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={shippingDetails.lastName}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, lastName: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.lastName ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Address</label>
                                        <input
                                            type="text"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.address ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">City</label>
                                        <input
                                            type="text"
                                            value={shippingDetails.city}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.city ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">ZIP / Postcode</label>
                                        <input
                                            type="text"
                                            value={shippingDetails.zipCode}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.zipCode ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                </div>
                                <button onClick={handleNext} className="w-full h-[56px] bg-[#1A1A1A] text-white rounded-[16px] text-[15px] font-bold mt-10 hover:bg-[#333] transition-all flex items-center justify-center gap-2">
                                    Next: Shipping Method
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </button>
                            </div>
                        )}

                        {/* STEP 2: SHIPPING METHOD */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8 tracking-tight">Select Shipping Method</h2>
                                <div className="flex flex-col gap-3">
                                    {SHIPPING_METHODS.map((m) => (
                                        <div
                                            key={m.id}
                                            onClick={() => setShippingMethod(m)}
                                            className={`p-5 rounded-[20px] border-2 cursor-pointer transition-all flex items-center justify-between ${shippingMethod.id === m.id ? 'border-[#1A1A1A] bg-[#fdfaf7]' : 'border-[#f0eeeb] bg-white hover:border-[#ddd]'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod.id === m.id ? 'border-[#1A1A1A]' : 'border-[#ccc]'}`}>
                                                    {shippingMethod.id === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#1A1A1A]">{m.name}</p>
                                                    <p className="text-[13px] text-[#666]">{m.deliveryText}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-[#1A1A1A]">{m.price === 0 ? 'FREE' : `£${m.price}`}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <button onClick={handleBack} className="flex-1 h-[56px] border border-[#e8e4df] text-[#1A1A1A] rounded-[16px] text-[15px] font-bold hover:bg-[#F7F5F2] transition-all">
                                        Back
                                    </button>
                                    <button onClick={handleNext} className="flex-[2] h-[56px] bg-[#1A1A1A] text-white rounded-[16px] text-[15px] font-bold hover:bg-[#333] transition-all flex items-center justify-center gap-2">
                                        Next: Payment Detail
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PAYMENT DETAILS */}
                        {step === 3 && (
                            <form onSubmit={handlePlaceOrder} className="animate-fade-in">
                                <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8 tracking-tight">Payment Detail</h2>
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={paymentDetails.cardName}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.cardName ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength="19"
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: formatCardNumber(e.target.value) })}
                                            className={`w-full h-12 px-4 rounded-[12px] border ${errors.cardNumber ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={paymentDetails.expiry}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                                                className={`w-full h-12 px-4 rounded-[12px] border ${errors.expiry ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                maxLength="4"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                                className={`w-full h-12 px-4 rounded-[12px] border ${errors.cvv ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 rounded-[16px] bg-[#E8F5EE] border border-[#D1EAD9] flex gap-3 text-[#2D7D52] text-[13px] font-medium leading-relaxed">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Your payment information is encrypted and secured by Prabott's premium security vault.
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <button type="button" onClick={handleBack} className="flex-1 h-[56px] border border-[#e8e4df] text-[#1A1A1A] rounded-[16px] text-[15px] font-bold hover:bg-[#F7F5F2] transition-all">
                                        Back
                                    </button>
                                    <button type="submit" className="flex-[2] h-[56px] bg-[#1A1A1A] text-white rounded-[16px] text-[15px] font-bold hover:bg-[#333] transition-all flex items-center justify-center gap-2">
                                        Place Order: £{total.toLocaleString()}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="w-full max-[960px]:w-full min-[961px]:w-[420px] shrink-0">
                        <div className="sticky top-[100px] bg-white rounded-[24px] p-8 text-[#1A1A1A] border border-[#f0eeeb] shadow-sm">
                            <h2 className="text-[20px] font-bold tracking-tight mb-8">Order Summary</h2>

                            <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-[70px] h-[70px] rounded-[14px] bg-[#F7F5F2] overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[14px] font-bold text-[#1A1A1A] truncate">{item.name}</h3>
                                            <p className="text-[12px] text-[#999] mt-0.5">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-[15px] font-bold text-[#1A1A1A]">
                                            £{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 py-6 border-y border-[#f0eeeb] mb-6">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#888] font-medium">Subtotal</span>
                                    <span className="font-bold text-[#1A1A1A]">£{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#888] font-medium">Shipping ({shippingMethod.name})</span>
                                    <span className={`font-bold ${shippingMethod.price === 0 ? 'text-[#4CAF7D]' : 'text-[#1A1A1A]'}`}>
                                        {shippingMethod.price === 0 ? 'FREE' : `+£${shippingMethod.price}`}
                                    </span>
                                </div>
                                {/* Promo Code could go here */}
                                <div className="flex justify-between text-[13px] mt-2">
                                    <input type="text" placeholder="Promo code" className="bg-[#F7F5F2] border border-[#e8e4df] rounded-[10px] px-3 py-2 text-[12px] flex-1 focus:outline-none focus:border-[#1A1A1A]" />
                                    <button className="px-4 text-[12px] font-bold text-[#1A1A1A] bg-white border border-[#e8e4df] rounded-[10px] ml-2 hover:bg-[#F7F5F2] transition-colors">Apply</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-[16px] font-bold text-[#1A1A1A]">Total</span>
                                <span className="text-[32px] font-bold tracking-tighter text-[#1A1A1A]">£{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
