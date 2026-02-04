import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const Spotlight = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 250); // Center the 500px spotlight
            cursorY.set(e.clientY - 250);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.08)_0%,rgba(0,0,0,0)_70%)] opacity-50 will-change-transform"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                }}
            />
        </div>
    );
};
