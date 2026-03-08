export default function HeroBanner() {
    return (
        <section className="px-[18px] pt-[10px]">
            <div
                className="relative rounded-[20px] overflow-hidden flex flex-col w-full"
                style={{
                    aspectRatio: '16 / 8.6',
                    minHeight: '380px',
                    maxHeight: '640px',
                }}
            >
                {/* Full-bleed background */}
                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 55%' }}
                    src="/picture/hero.webp"
                    alt="Modern Scandinavian living room with gray sofa, wooden coffee table and armchair"
                    loading="eager"
                    fetchpriority="high"
                />

                {/* Text content upper-left */}
                <div
                    className="relative z-[2] flex-1"
                    style={{
                        padding: 'clamp(28px, 4vw, 52px) clamp(24px, 4vw, 52px) 0',
                        maxWidth: 'clamp(450px, 55%, 1000px)',
                    }}
                >
                    <h1
                        className="font-bold text-[#111110] leading-[1.09] tracking-[-0.04em]"
                        style={{ fontSize: 'clamp(1.7rem, 3.8vw, 3.15rem)', marginBottom: 'clamp(12px, 2vw, 20px)' }}
                    >
                        Discover Comfort, Style, and<br />
                        Quality Craftsmanship
                    </h1>

                    <p
                        className="font-normal text-[#5a5a5a] leading-[1.65] max-w-[380px]"
                        style={{ fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)', marginBottom: 'clamp(20px, 3vw, 36px)' }}
                    >
                        Our furniture embodies a perfect blend of functionality and aesthetic appeal, ensuring every piece
                        enhances your home with enduring elegance and superior durability.
                    </p>

                    <a
                        href="#"
                        className="inline-block bg-[#111110] text-white font-inter text-[0.82rem] font-medium tracking-[0.005em] px-6 py-3 rounded-[10px] no-underline hover:bg-[#2c2c2c] hover:-translate-y-px active:translate-y-0 transition-all"
                    >
                        Join Membership
                    </a>
                </div>

                {/* Scroll down indicator — bottom center */}
                <div
                    className="relative z-[2] flex justify-center items-end mt-auto"
                    style={{ paddingBottom: 'clamp(18px, 3vw, 30px)' }}
                >
                    <a
                        className="scroll-bounce flex items-center justify-center w-[42px] h-[42px] rounded-full border-[1.5px] border-white/75 bg-transparent cursor-pointer no-underline hover:border-white hover:bg-white/[0.12] transition-colors"
                        href="#about"
                        aria-label="Scroll down"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
