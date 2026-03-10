export default function PaymentSummary({ items, subtotal, shippingMethod, total }) {
    return (
        <div className="sticky top-[100px] bg-white rounded-[24px] p-8 text-[#1A1A1A] border border-[#f0eeeb] shadow-sm">
            <h2 className="text-[20px] font-bold tracking-tight mb-8">Order Summary</h2>

            {/* Cart Items */}
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

            {/* Pricing Breakdown */}
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
                {/* Promo code */}
                <div className="flex justify-between text-[13px] mt-2">
                    <input
                        type="text"
                        placeholder="Promo code"
                        className="bg-[#F7F5F2] border border-[#e8e4df] rounded-[10px] px-3 py-2 text-[12px] flex-1 focus:outline-none focus:border-[#1A1A1A]"
                    />
                    <button className="px-4 text-[12px] font-bold text-[#1A1A1A] bg-white border border-[#e8e4df] rounded-[10px] ml-2 hover:bg-[#F7F5F2] transition-colors">
                        Apply
                    </button>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-2">
                <span className="text-[16px] font-bold text-[#1A1A1A]">Total</span>
                <span className="text-[32px] font-bold tracking-tighter text-[#1A1A1A]">£{total.toLocaleString()}</span>
            </div>
        </div>
    );
}
