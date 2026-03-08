import Newsletter from './Newsletter';

export default function FooterInfo() {
    return (
        <div className="grid grid-cols-[1fr_1fr_1fr_1.6fr] gap-x-8 gap-y-0 border-b border-[#ebebeb] max-[900px]:grid-cols-2 max-[900px]:gap-7 max-[560px]:grid-cols-1 max-[560px]:gap-6 max-[560px]:px-5 max-[560px]:py-7" style={{ padding: '36px 32px 40px' }}>
            {/* Location */}
            <div>
                <div className="text-[0.88rem] font-semibold text-[#111110] tracking-[-0.01em] mb-3.5">Location :</div>
                <div className="text-[0.77rem] font-normal text-[#666] leading-[1.75]">
                    Prabott Furniture Store 123<br />
                    Harmony Street, Suite 456<br />
                    Jakarta, Indonesia 12345
                </div>
            </div>

            {/* Contact */}
            <div>
                <div className="text-[0.88rem] font-semibold text-[#111110] tracking-[-0.01em] mb-3.5">Contact Us:</div>
                <div className="text-[0.77rem] font-normal text-[#666] leading-[1.75]">
                    Phone: +62 21 555 1234<br />
                    Customer Service Hours: Mon–<br />
                    Fri, 9 AM – 6 PM
                </div>
            </div>

            {/* Email */}
            <div>
                <div className="text-[0.88rem] font-semibold text-[#111110] tracking-[-0.01em] mb-3.5">Email :</div>
                <div className="text-[0.77rem] font-normal text-[#666] leading-[1.75]">
                    For inquiries: <a href="mailto:info@prabottfurniture.com" className="text-[#666] no-underline hover:text-[#111] transition-colors">info@prabottfurniture.com</a><br />
                    For support: <a href="mailto:support@prabottfurniture.com" className="text-[#666] no-underline hover:text-[#111] transition-colors">support@prabottfurniture.com</a>
                </div>
            </div>

            {/* Newsletter */}
            <Newsletter />
        </div>
    );
}
