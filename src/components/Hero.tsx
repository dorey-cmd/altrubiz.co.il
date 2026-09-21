import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { MOTION_EASINGS } from '../lib/motionTokens';
import { handleClientNavClick } from './common/InternalLink';

interface HeroProps {
    onNavigate?: (path: string) => void;
    onOpenBookingModal?: () => void;
    onOpenDiagnosticModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenDiagnosticModal }) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const heroRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    });

    const yVideo = useTransform(scrollYProgress, [0, 1], ['-5%', prefersReducedMotion ? '-5%' : '25%']);
    const scaleVideo = useTransform(scrollYProgress, [0, 1], [1.1, prefersReducedMotion ? 1.1 : 1.25]);
    const yContent = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -50]);

    return (
        <section ref={heroRef} className="relative w-full h-[85vh] md:h-[95vh] min-h-[600px] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-right" dir="rtl">
            {/* Video Background with Pronounced True Scroll Parallax */}
            <motion.div 
                style={{ y: yVideo, scale: scaleVideo }}
                className="absolute -top-[12%] -bottom-[12%] inset-x-0 w-full h-[124%] pointer-events-none origin-center will-change-transform"
            >
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                    preload="auto"
                >
                    <source src="/media/hero-parallax.19b8e13e.mp4" type="video/mp4" />
                    הדפדפן אינו תומך בניגון וידאו
                </video>
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            {/* Content Container with Opposing Depth Parallax */}
            <motion.div
                style={{ y: yContent }}
                className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20"
            >
                {/* Logo - Ambient luminous backlight and crisp edge contrast */}
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: MOTION_EASINGS.enter }}
                    className="relative inline-flex items-center justify-center mb-10 group"
                >
                    {/* Soft atmospheric white/cyan backlight halo - illuminates brand blue against dark video without blocky containers */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-white/35 to-cyan-400/20 rounded-full blur-2xl scale-125 pointer-events-none -z-10" />
                    <div className="absolute inset-2 bg-white/20 rounded-full blur-xl pointer-events-none -z-10" />

                    <img
                        src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                        alt="לוגו אלטרוביז CRM"
                        className="relative z-10 w-64 md:w-80 h-auto object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.7)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-300"
                    />
                </motion.div>

                {/* H1 - Immediate, High-Legibility & Protected LCP */}
                <motion.h1
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: MOTION_EASINGS.enter }}
                    className="text-4xl md:text-6xl/tight font-bold text-white mb-6 drop-shadow-lg"
                >
                    אלטרוביז CRM - להכניס את השיטה לסיסטם
                </motion.h1>

                <motion.p
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : 0.08, ease: MOTION_EASINGS.enter }}
                    className="text-lg md:text-2xl text-gray-100 mb-8 max-w-3xl leading-relaxed drop-shadow-md"
                >
                    מערכת אחת שמרכזת את כל הכלים כדי לגדל את העסק הדיגיטלי - עם חיבור אמיתי בין טכנולוגיה, אוטומציה ובינה מלאכותית.
                </motion.p>

                <motion.p
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : 0.12, ease: MOTION_EASINGS.enter }}
                    className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl"
                >
                    נמאס לקפוץ בין עשר מערכות שונות? אלטרוביז מאחדת את כל מה שצריך - במקום אחד, פשוט וחכם.
                </motion.p>

                <motion.a
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : 0.16 }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                    href="/hidden-business-growth-barriers"
                    onClick={(e) => {
                        if (onOpenDiagnosticModal) {
                            e.preventDefault();
                            onOpenDiagnosticModal();
                        }
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.75)] transition-all duration-300 animate-subtle-glow cursor-pointer"
                >
                    ✨ איפה הכסף שלנו הולך לאיבוד?
                </motion.a>

                {/* Pain Bar with Knowledge Gateway */}
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: prefersReducedMotion ? 0 : 0.2, ease: MOTION_EASINGS.enter }}
                    className="mt-12 bg-black/60 backdrop-blur-sm border border-white/10 p-4 rounded-2xl text-gray-300 text-sm md:text-base max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right shadow-lg"
                >
                    <p className="leading-relaxed text-sm md:text-base">ניהול לקוחות מבוזר מבזבז שעות יקרות ומפספס הזדמנויות - ובסוף זה כסף שנשאר על הרצפה.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                        <a
                            href="/roi-calculator"
                            onClick={(e) => handleClientNavClick(e, '/roi-calculator', onNavigate)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white hover:text-yellow-300 font-bold whitespace-nowrap bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-full transition-all group cursor-pointer"
                        >
                            <span>לבדוק כמה כסף אתם מפספסים</span>
                            <span className="group-hover:-translate-x-0.5 transition-transform font-bold">←</span>
                        </a>
                        <a
                            href="/lost-leads"
                            onClick={(e) => handleClientNavClick(e, '/lost-leads', onNavigate)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 font-bold whitespace-nowrap bg-white/5 hover:bg-white/10 border border-yellow-400/25 px-3.5 py-1.5 rounded-full transition-all group cursor-pointer"
                        >
                            <span>איך עוצרים את הבריחה?</span>
                            <span className="group-hover:-translate-x-0.5 transition-transform font-bold">←</span>
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
