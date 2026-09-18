import React, { useState } from 'react';
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
 * Optional ambient "breathing" state when idle, seamlessly transitioning into hover.
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
    const [isHovered, setIsHovered] = useState(false);

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
            animate={
                isHovered
                    ? { y: -liftDistance, scale: scale }
                    : breathing
                    ? { y: [0, -5, 0], scale: [1, 1.01, 1] }
                    : { y: 0, scale: 1 }
            }
            transition={
                isHovered
                    ? { duration: 0.22, ease: MOTION_EASINGS.enter }
                    : breathing
                    ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.25, ease: MOTION_EASINGS.enter }
            }
            whileTap={{
                y: 0,
                scale: 0.99,
                transition: { duration: 0.1 }
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};
