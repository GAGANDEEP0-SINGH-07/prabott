import { memo } from 'react';

function StatCard({ number, desc }) {
    return (
        <div>
            <div
                className="font-bold text-[#111110] tracking-[-0.04em] leading-none mb-[18px]"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)' }}
            >
                {number}
            </div>
            <p className="text-[0.8rem] font-normal text-[#666] leading-[1.65] max-w-[320px]">
                {desc}
            </p>
        </div>
    );
}

export default memo(StatCard);
