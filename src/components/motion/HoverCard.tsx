import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_EASINGS } from '../../lib/motionTokens';

interface HoverCardProps {
    children: React.ReactNode;
    className?: string;
    liftDistance?: number;
    scale?: number;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * HoverCard: Tactile micro-interaction surface for cards and interactive boxes.
 * 
 * Provides subtle hover elevation and scale with keyboard parity.
 * Under prefers-reduced-motion, elevation/scale are disabled and only color/border transitions run.
 */
export const HoverCard: React.FC<HoverCardProps> = ({
    children,
    className = '',
    liftDistance = 3,
    scale = 1.008,
    onClick
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return (
            <div className={`transition-colors duration-200 ${className}`} onClick={onClick}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={`transition-shadow duration-300 will-change-transform ${className}`}
            whileHover={{
                y: -liftDistance,
                scale: scale,
                transition: { duration: 0.22, ease: MOTION_EASINGS.standard }
            }}
            whileTap={{
                y: 0,
                scale: 0.995,
                transition: { duration: 0.1 }
            }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};
