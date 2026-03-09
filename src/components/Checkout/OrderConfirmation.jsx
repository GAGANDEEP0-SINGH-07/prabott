import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

export default function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) return null;

    return (
        <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: '#FDFCFA' }}>
            <div className="max-w-[900px] mx-auto px-6 pt-[120px] pb-24">
                <div className="bg-white rounded-[30px] p-10 shadow-sm border border-[#f0eeeb] text-center">
                    <div className="w-20 h-20 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>

                    <h1 className="text-[36px] font-bold text-[#1A1A1A] tracking-[-0.04em] mb-4">
                        Thank you for your order!
                    </h1>
                    <p className="text-[16px] text-[#666] mb-8 max-w-[500px] mx-auto leading-relaxed">
                        We've received your order and are currently processing it. A confirmation email has been sent to <span className="font-semibold text-[#1A1A1A]">{orderData.email}</span>.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-[#F7F5F2] rounded-[24px] p-8 text-left mb-10">
                        <div className="flex justify-between items-start border-b border-[#e8e4df] pb-6 mb-6">
                            <div>
                                <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-1">Order Number</p>
                                <p className="text-[18px] font-bold text-[#1A1A1A]">{orderData.orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-1">Status</p>
                                <span className="inline-flex items-center px-3 py-1 bg-[#EEF2FF] text-[#4A5FBD] text-[12px] font-bold rounded-full">Processing</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 max-[600px]:grid-cols-1 mb-8">
                            <div>
                                <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-3">Shipping Address</p>
                                <p className="text-[14px] text-[#1A1A1A] font-medium leading-relaxed">
                                    {orderData.shippingDetails.firstName} {orderData.shippingDetails.lastName}<br />
                                    {orderData.shippingDetails.address}<br />
                                    {orderData.shippingDetails.city}, {orderData.shippingDetails.zipCode}<br />
                                    {orderData.shippingDetails.country}
                                </p>
                            </div>
                            <div>
                                <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-3">Delivery Estimate</p>
                                <p className="text-[14px] text-[#1A1A1A] font-medium leading-relaxed">
                                    {orderData.shippingMethod.deliveryText}<br />
                                    Expected: {orderData.estimatedDelivery}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[12px] font-bold text-[#999] uppercase tracking-wider mb-4">Order Summary</p>
                            <div className="flex flex-col gap-4">
                                {orderData.items.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-[50px] h-[50px] rounded-[8px] overflow-hidden bg-white shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-[#1A1A1A] truncate">{item.name}</p>
                                            <p className="text-[12px] text-[#666]">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-[14px] font-bold text-[#1A1A1A]">£{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-[#e8e4df] flex justify-between items-baseline">
                                    <p className="text-[14px] font-semibold text-[#1A1A1A]">Total Paid</p>
                                    <p className="text-[24px] font-bold text-[#1A1A1A] tracking-tighter">${orderData.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 max-[480px]:flex-col">
                        <Link to="/dashboard?tab=orders" className="flex-1 h-[56px] bg-[#1A1A1A] text-white rounded-[16px] text-[15px] font-bold flex items-center justify-center no-underline hover:bg-[#333] transition-colors">
                            View My Orders
                        </Link>
                        <Link to="/collections" className="flex-1 h-[56px] border border-[#e8e4df] text-[#1A1A1A] rounded-[16px] text-[15px] font-bold flex items-center justify-center no-underline hover:bg-[#F7F5F2] transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
