import { memo } from 'react';
import CollectionCard from './components/CollectionCard';

function Collection() {
    return (

        <section className="bg-white mx-[18px] px-[2px] py-10">
            <div
                className="grid gap-3 max-[900px]:grid-cols-1 max-[900px]:h-auto"
                style={{ gridTemplateColumns: '1.18fr 1fr', height: '760px' }}
            >
                {/* ══ LEFT: Big Beds card ══ */}
                <CollectionCard
                    src="/picture/The Beds Collection.webp"
                    alt="Beds Collection"
                    indicator={{ bottom: '42%', left: '36%' }}
                    label={<>Our Beds Collection : Your Sleep Space with<br />Comfort and Style</>}
                />

                {/* ══ RIGHT COLUMN ══ */}
                <div className="grid gap-3 max-[900px]:grid-rows-[auto]" style={{ gridTemplateRows: '1.1fr 1fr' }}>
                    {/* Top: Sofas card */}
                    <CollectionCard
                        src="/picture/The Sofas Collection.webp"
                        alt="Sofas Collection"
                        indicator={{ top: '50%', right: '22px', transform: 'translateY(-50%)' }}
                        label="Browse Our Sofas Collection"
                    />

                    {/* Bottom 2 cards */}
                    <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
                        {/* Tables card */}
                        <CollectionCard
                            src="/picture/Tables Collection.webp"
                            alt="Tables Collection"
                            indicator={{ bottom: '42%', left: '50%', transform: 'translateX(-50%)' }}
                            label="Our Tables Collection"
                        />

                        {/* See All Collection card */}
                        <div className="col-card-hover relative rounded-[18px] overflow-hidden cursor-pointer max-[900px]:aspect-video max-[560px]:aspect-[4/3]">
                            <img
                                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                src="/picture/The DiningKitchen Collection.webp"
                                alt="All Collections"
                                loading="lazy"
                            />
                            <div
                                className="absolute inset-0 z-[1] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 100%)',
                                }}
                            />
                            <button
                                className="absolute z-[2] bottom-[22px] left-[22px] bg-white text-[#111110] font-inter text-[0.82rem] font-medium tracking-[0.005em] py-[11px] px-5 rounded-full border-none cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-[0_2px_16px_rgba(0,0,0,0.12)] hover:bg-[#f5f5f5] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)] transition-all group"
                                aria-label="See All Collection"
                            >
                                See All Collection
                                <svg className="transition-transform group-hover:translate-x-[3px]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default memo(Collection);
