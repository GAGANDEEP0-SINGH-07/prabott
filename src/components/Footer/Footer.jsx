import FooterInfo from './components/FooterInfo';
import SocialLinks from './components/SocialLinks';

export default function Footer() {
    return (
        <footer className="mx-[18px] mb-[18px] bg-white rounded-[20px] overflow-hidden relative">
            {/* ══ Giant faded brand name ══ */}
            <div className="relative h-[180px] max-[560px]:h-[110px] overflow-hidden flex items-end border-b border-[#ebebeb]">
                <span
                    className="absolute bottom-[-8px] left-0 font-extrabold text-[#e0e0e0] tracking-[-0.04em] leading-none whitespace-nowrap select-none max-[560px]:text-[4.5rem]"
                    style={{ fontSize: 'clamp(5rem, 16vw, 13.5rem)', paddingLeft: '28px' }}
                >
                    PRABOTT
                </span>
            </div>

            {/* ══ Info columns ══ */}
            <FooterInfo />

            {/* ══ Bottom bar ══ */}
            <div className="flex items-center justify-between px-8 py-[18px] max-[560px]:flex-col max-[560px]:gap-3.5 max-[560px]:text-center max-[560px]:px-5 max-[560px]:py-4">
                <SocialLinks />

                {/* Copyright */}
                <p className="text-[0.76rem] font-normal text-[#aaa] tracking-[0.01em] text-center">
                    Copyright 2026, All Right Reserved
                </p>

                {/* Terms */}
                <a href="#" className="text-[0.76rem] font-normal text-[#aaa] no-underline tracking-[0.01em] hover:text-[#555] transition-colors">
                    Terms &amp; Conditions
                </a>
            </div>
        </footer>
    );
}
