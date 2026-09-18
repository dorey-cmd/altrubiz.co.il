import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ParallaxLayerProps {
    children?: React.ReactNode;
    className?: string;
    speed?: number; // e.g. -50 to 50
    style?: React.CSSProperties;
}

/**
 * ParallaxLayer: Subtle atmospheric background depth.
 * 
 * Rules enforced:
 * - Reduced motion: Parallax translation completely disabled (static layer).
 * - Never alters document scroll position or speed (Scroll Sovereignty).
 * - Operates purely on transform: translateY for GPU compositing without layout shift.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
    children,
    className = '',
    speed = 40,
    style = {}
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className} style={style}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                ...style,
                y,
                willChange: 'transform'
            }}
        >
            {children}
        </motion.div>
    );
};
