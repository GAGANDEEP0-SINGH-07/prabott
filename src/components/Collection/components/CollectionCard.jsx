import { memo } from 'react';

function CollectionCard({ src, alt, label, indicator, children }) {
    return (
        <div className="col-card-hover relative rounded-[18px] overflow-hidden cursor-pointer max-[900px]:aspect-video max-[560px]:aspect-[4/3]">
            <img
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
            />
            {/* Gradient overlay */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0) 62%)',
                }}
            />
            {/* White dot indicator */}
            {indicator && (
                <span
                    className="absolute z-[2] w-3 h-3 rounded-full bg-white"
                    style={{ ...indicator, boxShadow: '0 0 0 2px rgba(255,255,255,0.4)' }}
                />
            )}
            {/* Label or custom children */}
            {label && (
                <div
                    className="absolute bottom-[22px] left-[22px] z-[2] text-white text-[0.92rem] font-semibold tracking-[-0.01em] leading-[1.35] max-w-[280px]"
                    style={{ textShadow: '0 1px 6px rgba(0,0,0,0.25)' }}
                >
                    {label}
                </div>
            )}
            {children}
        </div>
    );
}

export default memo(CollectionCard);
