import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


const features = [
    {
        title: "ניהול לידים חכם בזמן אמת",
        desc: "כל ליד במקום אחד, תמונת מצב ברגע נתון.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db3b96f7dfadc2b0c6.png"
    },
    {
        title: "תקשורת רב־ערוצית",
        desc: "וואטסאפ, טיקטוק, רשתות חברתיות, טלפון, SMS, מייל.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f41abf5634f5.png"
    },
    {
        title: "תהליך מכירה מסודר ואחיד",
        desc: "אחידות שמייצרת אמון והמרות.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db48d9ff2bd218bab5.png"
    },
    {
        title: "אוטומציות שחוסכות זמן",
        desc: "עקביות בלי מאמץ.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f46b0a5634f3.png"
    },
    {
        title: "בוטים מבוססי בינה מלאכותית",
        desc: "מענה איכותי סביב השעון.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697dba1ed26466abb3609.png"
    },
    {
        title: "דשבורד מקיף ומדדים",
        desc: "מעקב ביצועים וניתוח נתונים בזמן אמת.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697da6346f473045634f2.png"
    }
];

export const Features = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const rotateBackground = useTransform(scrollYProgress, [0, 1], [0, 45]);

    return (
        <section ref={ref} id="why-altrubiz" className="relative py-24 bg-white text-right overflow-hidden" dir="rtl">
            {/* Parallax Background Elements */}
            <motion.div
                style={{ y: yBackground, rotate: rotateBackground }}
                className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]), right: 0 }}
                className="absolute bottom-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-0"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center text-dark mb-8"
                >
                    למה אלטרוביז?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-16"
                >
                    <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-sm text-red-700 px-6 py-3 rounded-full text-base font-medium border border-red-200/50 shadow-sm flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        לידים "נופלים בין הכיסאות" כשהמידע מפוזר
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-white shadow-lg border border-gray-100 hover:border-accent hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <img
                                src={feature.icon}
                                alt={`אייקון ${feature.title}`}
                                className="w-20 h-20 mb-6 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                            />

                            <h3 className="text-xl font-bold text-primary mb-3 relative z-10">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium relative z-10">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-16 relative z-10">
                    <a
                        href="#how-it-works"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        לגלות איך זה עובד עכשיו
                    </a>
                </div>
            </div>
        </section>
    );
};
