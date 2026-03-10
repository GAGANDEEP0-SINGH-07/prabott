export default function ShowcaseImage() {
    return (
        <div className="bg-white mx-[18px] px-[2px] pt-6">
            <div className="showcase-zoom rounded-[20px] overflow-hidden w-full min-[641px]:aspect-[16/6.2] max-sm:aspect-[4/3]" style={{ minHeight: '240px' }}>
                <img
                    className="w-full h-full object-cover block transition-transform duration-[7000ms] ease-in-out"
                    style={{ objectPosition: 'center 40%' }}
                    src="/picture/so.webp"
                    alt="Scandinavian armchair with monstera plant and wooden side table"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
