import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_EASINGS } from '../../lib/motionTokens';

interface HoverCardProps {
    children: React.ReactNode;
    className?: string;
    liftDistance?: number;
    scale?: number;
    breathing?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

/**
 * HoverCard: Tactile micro-interaction surface for cards and interactive boxes.
 * 
 * Provides subtle hover elevation and scale with keyboard parity.
 * Optional ambient "breathing" state when idle.
 * Under prefers-reduced-motion, elevation/scale are disabled and only color/border transitions run.
 */
export const HoverCard: React.FC<HoverCardProps> = ({
    children,
    className = '',
    liftDistance = 6,
    scale = 1.02,
    breathing = false,
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

    const breathingClass = breathing ? 'animate-ambient-breath' : '';

    return (
        <motion.div
            className={`transition-all duration-300 will-change-transform ${breathingClass} ${className}`}
            whileHover={{
                y: -liftDistance,
                scale: scale,
                transition: { duration: 0.22, ease: MOTION_EASINGS.enter }
            }}
            whileTap={{
                y: 0,
                scale: 0.99,
                transition: { duration: 0.1 }
            }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};
