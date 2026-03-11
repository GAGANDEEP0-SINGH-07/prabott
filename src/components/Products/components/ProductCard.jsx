import { memo } from 'react';
import { formatPrice } from '../../../utils/pricing';

function ProductCard({ product }) {
    return (
        <div
            className="product-card-hover bg-[#f4f4f3] rounded-2xl p-[18px] pb-4 flex flex-col cursor-pointer relative overflow-hidden transition-all duration-[250ms]"
        >
            {product.sale && (
                <span className="absolute top-3.5 right-3.5 bg-[#111] text-white text-[0.62rem] font-semibold tracking-[0.04em] uppercase px-2 py-[3px] rounded-full">
                    Sale
                </span>
            )}

            <div className="text-[0.88rem] font-semibold text-[#111110] tracking-[-0.01em] leading-[1.3] mb-3">
                {product.name}
            </div>

            <div className="flex-1 flex items-center justify-center px-2 pb-5 pt-2.5 min-h-[180px] max-[700px]:min-h-[130px] overflow-hidden">
                <img
                    className="product-img-scale w-full max-w-[220px] h-[180px] max-[700px]:h-[130px] object-contain transition-transform duration-[400ms]"
                    style={{ objectPosition: 'center bottom', mixBlendMode: 'multiply' }}
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="220"
                    height="180"
                />
            </div>

            <div className="flex items-center justify-between pt-1 mt-auto">
                <span className="text-[0.68rem] font-normal text-[#999] tracking-[0.005em]">
                    {product.category}
                </span>
                <span className="text-[0.72rem] font-semibold text-[#111] tracking-[-0.01em]">
                    {formatPrice(product.price)}
                </span>
            </div>
        </div>
    );
}

export default memo(ProductCard);
