import { useEffect } from "react";

export function useReveal(deps = []) {
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    obs.unobserve(entry.target);
                }
            }),
            { threshold: 0.1 }
        );
        document.querySelectorAll(".rv:not(.in)").forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, deps);
}
