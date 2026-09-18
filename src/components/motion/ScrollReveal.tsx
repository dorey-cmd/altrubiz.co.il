import React, { useState, useEffect, useRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_DISTANCES, MOTION_VIEWPORT } from '../../lib/motionTokens';

export interface ScrollRevealProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    distance?: keyof typeof MOTION_DISTANCES | number;
    direction?: 'up' | 'down' | 'none';
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
    distance = 'medium',
    direction = 'up',
    duration = MOTION_DURATIONS.normal,
    immediate = false,
    ...rest
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isMounted, setIsMounted] = useState(false);
    const [forceVisible, setForceVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const distancePx = typeof distance === 'number' ? distance : MOTION_DISTANCES[distance];
    const initialY = direction === 'up' ? distancePx : direction === 'down' ? -distancePx : 0;

    useEffect(() => {
        setIsMounted(true);

        // Fail-safe timer (Law §2.3.2): Guarantee final visible state within 1500ms
        // even if IntersectionObserver fails, window is backgrounded, or scroll threshold isn't reached.
        const timer = setTimeout(() => {
            setForceVisible(true);
        }, 1500 + delay * 1000);

        return () => clearTimeout(timer);
    }, [delay]);

    // Baseline: if reduced motion, immediate LCP, before mount, or force-visible triggered,
    // render standard HTML element with zero animation overhead.
    if (prefersReducedMotion || immediate || !isMounted || forceVisible) {
        return (
            <div
                ref={containerRef}
                className={className}
                onFocusCapture={() => setForceVisible(true)}
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            className={className}
            initial={{ opacity: 0, y: initialY }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={MOTION_VIEWPORT}
            transition={{
                duration,
                delay,
                ease: MOTION_EASINGS.enter
            }}
            onFocusCapture={() => setForceVisible(true)}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
