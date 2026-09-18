/**
 * AltruBiz Design OS - Motion & Dynamic Experience Tokens
 * 
 * Sourced from .agents/rules/motion-system.md
 * Principles:
 * 1. "Bots receive the complete site. Humans receive the complete site plus motion."
 * 2. Motion is progressive enhancement only.
 * 3. Animate transform and opacity only (compositor-friendly, zero layout shifts).
 */

export const MOTION_DURATIONS = {
    instant: 0,
    fast: 0.18,
    normal: 0.32,
    relaxed: 0.48,
    ambient: 12
} as const;

export const MOTION_EASINGS = {
    // Natural deceleration curve for entering elements
    enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
    // Smooth standard ease for transitions
    standard: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
    // Snappy spring for micro-interactions (buttons, badges, cards)
    snappySpring: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 26
    },
    // Gentle spring for larger surface reveals
    gentleSpring: {
        type: 'spring' as const,
        stiffness: 140,
        damping: 20
    }
} as const;

export const MOTION_DISTANCES = {
    subtle: 6,
    medium: 14,
    large: 24,
    sideSlide: 36
} as const;

export const MOTION_STAGGER = {
    fast: 0.06,
    normal: 0.09,
    relaxed: 0.14
} as const;

export const MOTION_BREATHING = {
    duration: 5.5,
    ease: "easeInOut"
} as const;

export const MOTION_VIEWPORT = {
    once: true,
    amount: 0.15,
    margin: '-30px'
} as const;
