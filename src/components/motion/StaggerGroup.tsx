import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_DISTANCES, MOTION_STAGGER, MOTION_VIEWPORT } from '../../lib/motionTokens';

interface StaggerGroupProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    delayChildren?: number;
}

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    distance?: keyof typeof MOTION_DISTANCES | number;
    direction?: 'left' | 'right' | 'up' | 'none';
}

const containerVariants = (staggerDelay: number, delayChildren: number) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayChildren
        }
    }
});

const itemVariants = (distancePx: number, direction: 'left' | 'right' | 'up' | 'none') => {
    const initialX = direction === 'right' ? distancePx : direction === 'left' ? -distancePx : 0;
    const initialY = direction === 'up' ? distancePx : 0;

    return {
        hidden: { opacity: 0, x: initialX, y: initialY },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: MOTION_DURATIONS.normal,
                ease: MOTION_EASINGS.enter
            }
        }
    };
};

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
    children,
    className = '',
    staggerDelay = MOTION_STAGGER.normal,
    delayChildren = 0
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isMounted, setIsMounted] = useState(false);
    const [forceVisible, setForceVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        // Fail-safe: force all items visible within 1.5s
        const timer = setTimeout(() => {
            setForceVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (prefersReducedMotion || !isMounted || forceVisible) {
        return (
            <div
                ref={ref}
                className={className}
                onFocusCapture={() => setForceVisible(true)}
            >
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={containerVariants(staggerDelay, delayChildren)}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION_VIEWPORT}
            onFocusCapture={() => setForceVisible(true)}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem: React.FC<StaggerItemProps> = ({
    children,
    className = '',
    distance = 'sideSlide',
    direction = 'right'
}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const distancePx = typeof distance === 'number' ? distance : MOTION_DISTANCES[distance];

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            variants={itemVariants(distancePx, direction)}
        >
            {children}
        </motion.div>
    );
};
