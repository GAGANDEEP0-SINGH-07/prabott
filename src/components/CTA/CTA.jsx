export default function CTA() {
    return (
        <section className="px-[18px]">
            <div
                className="cta-bg-hover relative rounded-[20px] overflow-hidden flex items-center max-md:items-end max-[480px]:aspect-[3/3.2]"
                style={{ aspectRatio: '16 / 5.2', minHeight: '240px' }}
            >
                {/* Full-bleed background */}
                <img
                    className="cta-bg-img absolute inset-0 w-full h-full object-cover transition-transform duration-[7000ms] ease-in-out"
                    style={{ objectPosition: '70% center' }}
                    src="/picture/Furniture.webp"
                    alt="Modern dark sofa with aloe vera plant on coffee table"
                    loading="lazy"
                />

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none max-md:hidden"
                    style={{
                        background: 'linear-gradient(to right, #e8e7e3 0%, #e8e7e3 28%, rgba(232,231,227,0.92) 36%, rgba(232,231,227,0.70) 44%, rgba(232,231,227,0.25) 56%, rgba(232,231,227,0) 68%)',
                    }}
                />
                {/* Mobile gradient overlay */}
                <div
                    className="absolute inset-0 z-[1] pointer-events-none hidden max-md:block"
                    style={{
                        background: 'linear-gradient(to top, rgba(232,231,227,0.98) 0%, rgba(232,231,227,0.90) 40%, rgba(232,231,227,0.30) 70%, rgba(232,231,227,0) 100%)',
                    }}
                />

                {/* Text content */}
                <div
                    className="relative z-[2] max-md:max-w-full max-md:p-7 max-md:pb-8"
                    style={{
                        padding: 'clamp(28px, 5vw, 60px) clamp(28px, 5vw, 62px)',
                        maxWidth: 'clamp(300px, 48%, 960px)',
                    }}
                >
                    <h2
                        className="font-bold text-[#111110] tracking-[-0.04em] leading-[1.1]"
                        style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)', marginBottom: 'clamp(12px, 2vw, 20px)' }}
                    >
                        Craft Your Ideal Furniture<br />
                        Masterpieces Today
                    </h2>

                    <p
                        className="font-normal text-[#666] leading-[1.7] max-w-[360px]"
                        style={{ fontSize: 'clamp(0.72rem, 1vw, 0.82rem)', marginBottom: 'clamp(22px, 3vw, 36px)' }}
                    >
                        Whether it's a sleek wooden chair, a plush sofa, or a functional table with
                        drawers, our platform offers endless possibilities. Start crafting your dream
                        furniture now and bring your vision to life!
                    </p>

                    <a
                        href="#"
                        className="inline-flex items-center gap-2.5 bg-[#111110] text-white font-inter text-[0.83rem] font-medium tracking-[0.005em] py-[13px] px-[26px] rounded-[11px] border-none cursor-pointer no-underline shadow-[0_2px_14px_rgba(0,0,0,0.14)] hover:bg-[#2b2b2b] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all"
                    >
                        Pre-Order Now
                    </a>
                </div>
            </div>
        </section>
    );
}
