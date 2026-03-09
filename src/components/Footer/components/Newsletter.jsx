import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        // In a real app, this would call an API
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="max-[900px]:col-span-full">
            <div
                className="font-bold text-[#111110] tracking-[-0.03em] leading-[1.2] mb-[18px]"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.55rem)' }}
            >
                Sign up for our newsletter
            </div>
            <form onSubmit={handleSubmit} className="flex items-center bg-[#f5f5f5] rounded-xl overflow-hidden border border-[#e8e8e8] gap-2" style={{ padding: '5px 5px 5px 16px' }}>
                <input
                    className="flex-1 border-none bg-transparent font-inter text-[0.8rem] font-normal text-[#111] outline-none min-w-0 placeholder:text-[#bbb] placeholder:font-normal"
                    type="email"
                    placeholder="Enter email address"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-[#111110] text-white font-inter text-[0.8rem] font-medium tracking-[0.005em] py-2.5 px-[22px] border-none rounded-[9px] cursor-pointer whitespace-nowrap hover:bg-[#2d2d2d] active:scale-[0.97] transition-all shrink-0">
                    {submitted ? 'Subscribed!' : 'Enter'}
                </button>
            </form>
        </div>
    );
}
