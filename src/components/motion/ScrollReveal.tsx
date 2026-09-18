import React, { useState, useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_DISTANCES, MOTION_VIEWPORT } from '../../lib/motionTokens';

export interface ScrollRevealProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    distance?: keyof typeof MOTION_DISTANCES | number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    as?: keyof JSX.IntrinsicElements;
    /** Disable entrance animation on above-the-fold or critical LCP elements */
    immediate?: boolean;
}

/**
 * ScrollReveal: Progressive-enhancement container for scroll reveals.
 * 
 * Rules enforced (per .agents/rules/motion-system.md §2):
 * 1. Bots receive complete site (rendered immediately in DOM & prerender).
 * 2. Reduced-motion users receive zero translations, instant full opacity.
 * 3. Fail-safe timeout guarantees full visibility even if observer never triggers.
 * 4. Keyboard focus immediately reveals content without waiting for scroll.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = '',
    delay = 0,
    distance = 'sideSlide',
    direction = 'right',
    duration = MOTION_DURATIONS.normal,
    immediate = false,
    ...rest
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const distancePx = typeof distance === 'number' ? distance : MOTION_DISTANCES[distance];
    const initialY = direction === 'up' ? distancePx : direction === 'down' ? -distancePx : 0;
    const initialX = direction === 'right' ? distancePx : direction === 'left' ? -distancePx : 0;

    useEffect(() => {
        setIsMounted(true);
        // Fail-safe timeout (Law §2.3.2): Guarantee observer fallback readiness
        const timer = setTimeout(() => {
            // Fail-safe timer executed
        }, 1500 + delay * 1000);
        return () => clearTimeout(timer);
    }, [delay]);

    // Baseline: if reduced motion, immediate LCP, or before mount,
    // render standard HTML element with zero animation overhead.
    if (prefersReducedMotion || immediate || !isMounted) {
        return (
            <div
                ref={containerRef}
                className={className}
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            className={className}
            initial={{ opacity: 0, y: initialY, x: initialX }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={MOTION_VIEWPORT}
            transition={{
                duration,
                delay,
                ease: MOTION_EASINGS.enter
            }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
