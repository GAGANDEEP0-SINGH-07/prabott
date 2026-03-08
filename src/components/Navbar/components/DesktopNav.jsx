import { NavLink } from 'react-router-dom';

export default function DesktopNav({ navLinks }) {
    return (
        <ul className="hidden min-[961px]:flex items-center gap-1 list-none flex-1 justify-center">
            {navLinks.map((link, i) => (
                <li key={i}>
                      <NavLink
                          to={`/category/${link.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`}
                          className={({ isActive }) => `nav-link-item relative no-underline text-[0.79rem] tracking-[0.01em] px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${isActive
                              ? 'active text-[#111] font-medium bg-black/[0.04]'
                              : 'text-[#666] font-normal hover:text-[#111] hover:bg-black/[0.04]'
                              }`}
                      >
                        {link}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}
