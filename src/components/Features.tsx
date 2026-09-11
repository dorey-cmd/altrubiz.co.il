import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';


interface FeatureItem {
    title: string;
    desc: string;
    icon: string;
    hubUrl: string;
    hubLabel: string;
}

const features: FeatureItem[] = [
    {
        title: "ניהול לידים חכם בזמן אמת",
        desc: "כל ליד במקום אחד, תמונת מצב ברגע נתון.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db3b96f7dfadc2b0c6.png",
        hubUrl: "/topics/lost-leads",
        hubLabel: "מדריך לאבחון ועצירת בריחת לידים"
    },
    {
        title: "תקשורת רב־ערוצית",
        desc: "וואטסאפ, טיקטוק, רשתות חברתיות, טלפון, SMS, מייל.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f41abf5634f5.png",
        hubUrl: "/topics/whatsapp-in-crm",
        hubLabel: "איך לחבר וואטסאפ ל-CRM בצורה נכונה"
    },
    {
        title: "תהליך מכירה מסודר ואחיד",
        desc: "אחידות שמייצרת אמון והמרות.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db48d9ff2bd218bab5.png",
        hubUrl: "/topics/sales-pipeline",
        hubLabel: "מדריך לבניית פייפליין מכירות חזותי"
    },
    {
        title: "אוטומציות שחוסכות זמן",
        desc: "עקביות בלי מאמץ.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f46b0a5634f3.png",
        hubUrl: "/topics/repetitive-manual-work",
        hubLabel: "איך לשחרר את הצוות מעבודה ידנית"
    },
    {
        title: "בוטים מבוססי בינה מלאכותית",
        desc: "מענה איכותי סביב השעון.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697dba1ed26466abb3609.png",
        hubUrl: "/articles/non-technical-to-ai-automation-guide",
        hubLabel: "איך מתחילים עם אוטומציה ו-AI בלי להסתבך"
    },
    {
        title: "דשבורד מקיף ומדדים",
        desc: "מעקב ביצועים וניתוח נתונים בזמן אמת.",
        icon: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697da6346f473045634f2.png",
        hubUrl: "/topics/business-memory",
        hubLabel: "איך לשמור על הזיכרון הארגוני והנתונים"
    }
];

// Natural recognition situations that visitors immediately relate to
const recognitionSituations = [
    { text: "לידים שלא מקבלים מענה בזמן", url: "/topics/lost-leads" },
    { text: "וואטסאפ שלא מחובר לתהליך", url: "/topics/whatsapp-in-crm" },
    { text: "לא ברור איפה כל עסקה עומדת", url: "/topics/sales-pipeline" },
    { text: "מידע שנשאר בראש של העובד", url: "/topics/business-memory" },
    { text: "עבודה ידנית שחוזרת על עצמה", url: "/topics/repetitive-manual-work" }
];

interface FeaturesProps {
    onNavigate?: (path: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const rotateBackground = useTransform(scrollYProgress, [0, 1], [0, 45]);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        if (onNavigate) {
            e.preventDefault();
            onNavigate(url);
        }
    };

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                        למה אלטרוביז?
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                        תשתיות עבודה שסוגרות את הפערים בין שיווק, מכירות ותפעול יומיומי.
                    </p>
                </motion.div>

                {/* Natural Recognition Gateway: "זה קורה אצלכם?" */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 backdrop-blur-sm max-w-4xl mx-auto shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/60">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span>זה קורה אצלכם? מזהים את המצב בעסק ומעמיקים לפתרון:</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                            בחרו מצב להעמקה
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
                        {recognitionSituations.map((sit, idx) => (
                            <a
                                key={idx}
                                href={sit.url}
                                onClick={(e) => handleLinkClick(e, sit.url)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white text-slate-700 hover:text-primary hover:bg-blue-50/80 border border-slate-200 hover:border-primary/30 shadow-xs hover:shadow-sm transition-all group cursor-pointer"
                            >
                                <span>{sit.text}</span>
                                <span className="text-slate-400 group-hover:text-primary group-hover:-translate-x-0.5 transition-all text-xs">←</span>
                            </a>
                        ))}
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
                                alt={`אייקון תכונה: ${feature.title} - ${feature.desc} במערכת AltruBiz CRM`}
                                className="w-20 h-20 mb-6 object-contain group-hover:scale-110 transition-transform duration-300 relative z-10"
                            />

                            <h3 className="text-xl font-bold text-primary mb-3 relative z-10">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium relative z-10 mb-6 flex-1">
                                {feature.desc}
                            </p>

                            {/* Subtle Editorial Knowledge Connection */}
                            <a
                                href={feature.hubUrl}
                                onClick={(e) => handleLinkClick(e, feature.hubUrl)}
                                className="relative z-10 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-primary bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-primary/30 px-3 py-1.5 rounded-full transition-all group/link"
                            >
                                <span>{feature.hubLabel}</span>
                                <span className="group-hover/link:-translate-x-0.5 transition-transform text-primary font-bold">←</span>
                            </a>
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
