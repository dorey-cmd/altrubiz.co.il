import { useEffect, useState } from 'react';

/**
 * Shared `prefers-reduced-motion` detection hook (SiteOS accessibility
 * governance layer). Previously duplicated ad hoc inside individual
 * components (e.g. RoiCalculatorTool.tsx); centralizing it here lets every
 * ambient/ decorative animation (StarDust, Spotlight, count-up numbers,
 * Framer Motion effects) respect the same live-updating preference without
 * re-implementing the matchMedia listener each time.
 */
export function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState<boolean>(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return reduced;
}
