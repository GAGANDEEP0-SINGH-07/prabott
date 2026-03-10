import { useState, forwardRef } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = forwardRef(function PaymentForm({ onSubmit, isProcessing, total }, ref) {
    const stripe = useStripe();
    const elements = useElements();

    const [cardName, setCardName] = useState('');
    const [errors, setErrors] = useState({});

    function validate() {
        const errs = {};

        if (!cardName.trim()) {
            errs.cardName = 'Cardholder name is required';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            return;
        }

        if (!validate()) return;

        onSubmit({
            stripe,
            elements,
            cardName: cardName.trim(),
        });
    }

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '15px',
                color: '#1A1A1A',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': {
                    color: '#999999',
                },
            },
            invalid: {
                color: '#E05252',
            },
        },
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="animate-fade-in">
            <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-8 tracking-tight">
                Payment Details
            </h2>

            <div className="flex flex-col gap-6">
                {/* Cardholder Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">
                        Cardholder Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        autoComplete="cc-name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className={`w-full h-12 px-4 rounded-[12px] border ${errors.cardName ? 'border-[#E05252]' : 'border-[#e8e4df]'} bg-[#F7F5F2] text-[15px] focus:outline-none focus:border-[#1A1A1A] focus:bg-white transition-all`}
                    />
                    {errors.cardName && (
                        <span className="text-[11px] text-[#E05252] font-semibold ml-1 flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {errors.cardName}
                        </span>
                    )}
                </div>

                {/* Stripe Card Element */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#999] uppercase tracking-wider ml-1">
                        Card Details
                    </label>
                    <div className="w-full p-4 rounded-[12px] border border-[#e8e4df] bg-[#F7F5F2] focus-within:border-[#1A1A1A] focus-within:bg-white transition-all">
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>
            </div>

            {/* Security notice */}
            <div className="mt-8 p-4 rounded-[16px] bg-[#E8F5EE] border border-[#D1EAD9] flex gap-3 text-[#2D7D52] text-[13px] font-medium leading-relaxed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your payment information is encrypted and securely processed by Stripe.
            </div>

            {/* Accepted cards footer */}
            <div className="mt-4 flex items-center gap-2 justify-center opacity-50">
                <span className="text-[10px] text-[#999] uppercase tracking-wider font-bold">Accepted:</span>
                <svg viewBox="0 0 48 32" width="30" height="20"><rect width="48" height="32" rx="4" fill="#1A1F71" /><text x="24" y="20" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="bold" fontFamily="Arial">VISA</text></svg>
                <svg viewBox="0 0 48 32" width="30" height="20"><rect width="48" height="32" rx="4" fill="#252525" /><circle cx="19" cy="16" r="8" fill="#EB001B" /><circle cx="29" cy="16" r="8" fill="#F79E1B" /></svg>
                <svg viewBox="0 0 48 32" width="30" height="20"><rect width="48" height="32" rx="4" fill="#2E77BC" /><text x="24" y="20" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="bold" fontFamily="Arial">AMEX</text></svg>
            </div>

            {/* Hidden submit trigger */}
            <input type="hidden" name="_paymentFormReady" value="1" />
        </form>
    );
});

export default PaymentForm;
