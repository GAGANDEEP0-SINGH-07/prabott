export default function AboutSection() {
    return (
        <>
            <section
                id="about"
                className="bg-white mx-[18px] grid items-start max-sm:grid-cols-1 max-sm:gap-[10px]"
                style={{
                    gridTemplateColumns: 'clamp(80px, 12%, 130px) 1fr',
                    gap: 'clamp(16px, 3vw, 32px)',
                    padding: 'clamp(36px, 5vw, 60px) clamp(24px, 5vw, 60px)',
                }}
            >
                <span className="text-[0.78rem] font-normal text-[#aaa] tracking-[0.01em] pt-1.5 whitespace-nowrap max-sm:pt-0">
                    About Us
                </span>
                <blockquote
                    className="font-normal text-[#111110] leading-[1.38] tracking-[-0.025em]"
                    style={{ fontSize: 'clamp(1.25rem, 2.6vw, 1.9rem)' }}
                >
                    "We believe quality furniture is key to a beautiful, functional home.
                    With a passion for design and craftsmanship, we blend modern
                    aesthetics with timeless elegance."
                </blockquote>
            </section>

            {/* Thin divider after About Us */}
            <div className="bg-white mx-[18px] px-[18px]">
                <div className="h-px bg-[#e8e8e8]" />
            </div>
        </>
    );
}
