import StatCard from './components/StatCard';
import ShowcaseImage from './components/ShowcaseImage';

const stats = [
    {
        number: '10+',
        desc: 'With a decade of expertise, Prabot crafts high-quality, bespoke furniture that blends style and functionality.',
    },
    {
        number: '800+',
        desc: 'Our commitment to customer satisfaction ensures we deliver outstanding service and products that exceed expectations.',
    },
    {
        number: '1200+',
        desc: 'Prabot has crafted over 1200 unique furniture pieces, from elegant sofas to functional cabinets, with precision and care.',
    },
];

export default function Stats() {
    return (
        <>
            {/* ═══════════════ STATS ═══════════════ */}
            <section className="bg-white mx-[18px] pt-[52px] px-[18px]">
                <div className="grid grid-cols-3 max-sm:grid-cols-1 max-sm:gap-8 text-center place-items-center">
                    {stats.map((stat, i) => (
                        <StatCard key={i} number={stat.number} desc={stat.desc} />
                    ))}
                </div>
            </section>

            {/* Thin HR divider */}
            <div className="bg-white mx-[18px] px-[18px]">
                <div className="h-px bg-[#e8e8e8]" />
            </div>

            {/* ═══════════════ SHOWCASE IMAGE ═══════════════ */}
            <ShowcaseImage />
        </>
    );
}
