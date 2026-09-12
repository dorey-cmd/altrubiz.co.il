
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface HeroProps {
    onNavigate?: (path: string) => void;
    onOpenBookingModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative w-full h-[85vh] md:h-[95vh] min-h-[600px] overflow-hidden bg-black text-right" dir="rtl">
            {/* Video Background */}
            <video
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                poster="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/6893869aeedaf87c98bf84d1.png"
            >
                <source src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697da649372e6d7d2b32d.mp4" type="video/mp4" />
                הדפדפן אינו תומך בניגון וידאו
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            {/* Content */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20"
            >

                {/* Logo */}
                <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                    alt="לוגו אלטרוביז CRM"
                    className="w-64 md:w-80 mb-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl/tight font-bold text-white mb-6 drop-shadow-lg"
                >
                    אלטרוביז CRM - להכניס את השיטה לסיסטם
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-gray-100 mb-8 max-w-3xl leading-relaxed drop-shadow-md"
                >
                    המערכת האחת שמרכזת את כל הכלים כדי לגדל את העסק הדיגיטלי - עם חיבור אמיתי בין טכנולוגיה, אוטומציה ובינה מלאכותית.
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl"
                >
                    נמאס לקפוץ בין עשר מערכות שונות? אלטרוביז מאחדת את כל מה שצריך - במקום אחד, פשוט וחכם.
                </motion.p>

                <motion.a
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#pricing"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                >
                    ✨ מתחילים כאן
                </motion.a>

                {/* Pain Bar with Knowledge Gateway */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-12 bg-black/60 backdrop-blur-sm border border-white/10 p-4 rounded-2xl text-gray-300 text-sm md:text-base max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right"
                >
                    <p className="leading-relaxed text-sm md:text-base">ניהול לקוחות מבוזר מבזבז שעות יקרות ומפספס הזדמנויות - ובסוף זה כסף שנשאר על הרצפה.</p>
                    <a
                        href="/lost-leads"
                        onClick={(e) => {
                            if (onNavigate) {
                                e.preventDefault();
                                onNavigate('/lost-leads');
                            }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-yellow-400 hover:text-yellow-300 font-bold whitespace-nowrap bg-white/5 hover:bg-white/10 border border-yellow-400/25 px-3.5 py-1.5 rounded-full transition-all shrink-0 group cursor-pointer"
                    >
                        <span>איך עוצרים את הבריחה?</span>
                        <span className="group-hover:-translate-x-0.5 transition-transform font-bold">←</span>
                    </a>
                </motion.div>
            </motion.div>
        </section>
    );
};
