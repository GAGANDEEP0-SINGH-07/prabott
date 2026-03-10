import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import PaymentForm from './PaymentForm';
import PaymentSummary from './PaymentSummary';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


export default function CheckoutPage() {

    const { items, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Steps: 1=Shipping, 2=Method, 3=Payment, 4=Processing, 5=Result
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

    const [errors, setErrors] = useState({});
    const [paymentResult, setPaymentResult] = useState(null); // { status, transactionId?, message?, orderId? }
    const [processingMessage, setProcessingMessage] = useState('Processing payment securely...');
    const paymentFormRef = useRef(null);

    const SHIPPING_METHODS = [
        { id: 'standard', name: 'Standard Shipping', price: 0, deliveryText: '5-7 Business Days' },
        { id: 'express', name: 'Express Shipping', price: 15, deliveryText: '2-3 Business Days' },
        { id: 'nextday', name: 'Next Day Delivery', price: 29, deliveryText: '1 Business Day' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        if (items.length === 0 && step < 4) {
            navigate('/cart');
        }
    }, [items.length, navigate, step]);

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + shippingMethod.price;

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!shippingDetails.firstName) e.firstName = 'Required';
            if (!shippingDetails.lastName) e.lastName = 'Required';
            if (!shippingDetails.address) e.address = 'Required';
            if (!shippingDetails.city) e.city = 'Required';
            if (!shippingDetails.zipCode) e.zipCode = 'Required';
            if (!shippingDetails.email || !shippingDetails.email.includes('@')) e.email = 'Valid email required';
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

    // Processing message animation
    useEffect(() => {
        if (step !== 4) return;
        const messages = [
            'Processing payment securely...',
            'Verifying card details...',
            'Contacting payment network...',
            'Almost there...',
        ];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % messages.length;
            setProcessingMessage(messages[idx]);
        }, 1500);
        return () => clearInterval(interval);
    }, [step]);

    // Handle payment submission from PaymentForm
    const handlePaymentSubmit = async (paymentData) => {
        const { stripe, elements, cardName } = paymentData;

        // Move to processing screen
        setStep(4);
        window.scrollTo(0, 0);

        try {
            const api = (await import('../../api')).default;

            const shippingAddress = {
                address: shippingDetails.address,
                city: shippingDetails.city,
                postalCode: shippingDetails.zipCode,
                country: shippingDetails.country,
            };

            const orderDataPayload = {
                products: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                shippingAddress,
                paymentMethod: 'Stripe',
                totalAmount: total,
            };

            // 1. Create order (Pending Payment)
            const res = await api.post('/orders/create', orderDataPayload);
            const createdOrder = res.data;
            const finalOrderId = createdOrder._id || createdOrder.id;

            // 2. Create Payment Intent
            const intentRes = await api.post('/payments/create-payment-intent', {
                orderId: finalOrderId
            });
            const { clientSecret } = intentRes.data;

            // 3. Confirm Card Payment
            const { CardElement } = await import('@stripe/react-stripe-js');
            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: cardName,
                        email: shippingDetails.email,
                        address: {
                            line1: shippingDetails.address,
                            city: shippingDetails.city,
                            postal_code: shippingDetails.zipCode,
                            // country needs a 2 letter code, we default to GB if 'United Kingdom'
                            country: shippingDetails.country === 'United Kingdom' ? 'GB' : undefined,
                        }
                    }
                }
            });

            if (paymentResult.error) {
                setPaymentResult({
                    status: 'failed',
                    message: paymentResult.error.message,
                });
            } else {
                if (paymentResult.paymentIntent.status === 'succeeded') {
                    // Guest fallback
                    if (!user) {
                        const historyKey = 'prabott_orders_guest';
                        const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
                        localStorage.setItem(historyKey, JSON.stringify([{ ...createdOrder, paymentStatus: 'Paid' }, ...existingHistory]));
                    }

                    clearCart();

                    setPaymentResult({
                        status: 'success',
                        transactionId: paymentResult.paymentIntent.id,
                        orderId: finalOrderId,
                        amountPaid: total,
                    });

                    // Redirect to order confirmation page
                    navigate('/order-confirmation', {
                        state: {
                            orderData: {
                                orderId: finalOrderId,
                                email: shippingDetails.email,
                                shippingDetails,
                                shippingMethod: {
                                    ...shippingMethod,
                                    deliveryText: shippingMethod.deliveryText,
                                },
                                estimatedDelivery: 'Within next few days',
                                items: items.map(i => ({ ...i, qty: i.quantity, image: i.image || i.images?.[0] })),
                                total: total
                            }
                        }
                    });

                    return; // Stop execution so step isn't set to 5
                }
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentResult({
                status: 'failed',
                message: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
            });
            // Show failure screen inline
            setStep(5);
        }
    };

    const handleRetryPayment = () => {
        setPaymentResult(null);
        setStep(3);
        window.scrollTo(0, 0);
    };

    if (items.length === 0 && step < 4) return null;

    // Steps for progress indicator (only show first 3)
    const progressSteps = [
        { num: 1, label: 'Shipping' },
        { num: 2, label: 'Method' },
        { num: 3, label: 'Payment' },
    ];

    return (
        <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#FDFCFA' }}>
            <div className="w-full px-[18px] pt-[100px] pb-24">

                {/* Progress Indicator — hidden during processing/result */}
                {step <= 3 && (
                    <div className="max-w-[800px] mx-auto mb-12 px-4">
                        <div className="flex justify-between relative">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#e8e4df] -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-[2px] bg-[#1A1A1A] -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${((step - 1) / 2) * 100}%` }}
                            />
                            {progressSteps.map((s) => (
                                <div key={s.num} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${step >= s.num ? 'bg-[#1A1A1A] text-white' : 'bg-white border-2 border-[#e8e4df] text-[#999]'}`}>
                                        {step > s.num ? '✓' : s.num}
                                    </div>
                                    <span className={`absolute -bottom-7 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${step >= s.num ? 'text-[#1A1A1A]' : 'text-[#999]'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 4: Processing Screen */}
                {step === 4 && (
                    <div className="max-w-[560px] mx-auto mt-8 animate-fade-in">
                        <div className="bg-white rounded-[28px] border border-[#f0eeeb] p-12 shadow-sm flex flex-col items-center text-center">
                            {/* Animated spinner */}
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 rounded-full border-4 border-[#f0eeeb]" />
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1A1A1A] animate-spin" />
                                <div className="absolute inset-3 rounded-full bg-[#FDFCFA] flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
                                {processingMessage}
                            </h2>
                            <p className="text-[14px] text-[#888] max-w-[300px] leading-relaxed">
                                Please do not close this page or press the back button while we process your payment.
                            </p>
                            {/* Pulsing dots */}
                            <div className="flex gap-1.5 mt-8">
                                <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 5: Payment Result Screen (Only for Failure now) */}
                {step === 5 && paymentResult && paymentResult.status === 'failed' && (
                    <div className="max-w-[560px] mx-auto mt-8 animate-fade-in">
                        <div className="bg-white rounded-[28px] border border-[#f0eeeb] p-12 shadow-sm flex flex-col items-center text-center">
                            {/* Failure animation */}
                            <div className="w-20 h-20 rounded-full bg-[#FDE8E8] flex items-center justify-center mb-6 animate-scale-in">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E05252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h2 className="text-[26px] font-bold text-[#1A1A1A] mb-2 tracking-tight">
                                Payment Failed
                            </h2>
                            <p className="text-[15px] text-[#E05252] font-medium mb-2">
                                {paymentResult.message}
                            </p>
                            <p className="text-[14px] text-[#888] mb-8 max-w-[340px]">
                                Your card was not charged. Please check your card details and try again.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={handleRetryPayment}
                                    className="flex-[2] h-[52px] bg-[#1A1A1A] text-white rounded-[14px] text-[14px] font-bold hover:bg-[#333] transition-all flex items-center justify-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 4 23 10 17 10" />
                                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                    </svg>
                                    Try Again
                                </button>
                                <Link
                                    to="/cart"
                                    className="flex-1 h-[52px] border border-[#e8e4df] text-[#1A1A1A] rounded-[14px] text-[14px] font-bold hover:bg-[#F7F5F2] transition-all flex items-center justify-center"
                                >
                                    Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main layout for steps 1-3 */}
                {step <= 3 && (
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
                                <div>
                                    <Elements stripe={stripePromise}>
                                        <PaymentForm
                                            ref={paymentFormRef}
                                            onSubmit={handlePaymentSubmit}
                                            isProcessing={false}
                                            total={total}
                                        />
                                    </Elements>

                                    <div className="flex gap-4 mt-10">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex-1 h-[56px] border border-[#e8e4df] text-[#1A1A1A] rounded-[16px] text-[15px] font-bold hover:bg-[#F7F5F2] transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Trigger form submission via hidden submit in PaymentForm
                                                const form = document.querySelector('form');
                                                if (form) form.requestSubmit();
                                            }}
                                            className="flex-[2] h-[56px] bg-[#1A1A1A] text-white rounded-[16px] text-[15px] font-bold hover:bg-[#333] transition-all flex items-center justify-center gap-2"
                                        >
                                            Place Order: £{total.toLocaleString()}
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="w-full max-[960px]:w-full min-[961px]:w-[420px] shrink-0">
                            <PaymentSummary
                                items={items}
                                subtotal={subtotal}
                                shippingMethod={shippingMethod}
                                total={total}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {/* Inline animation keyframes */}
            <style>{`
                @keyframes scale-in {
                    0% { transform: scale(0); opacity: 0; }
                    60% { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
