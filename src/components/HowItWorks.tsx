

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const steps = [
    {
        num: "1",
        title: "לכידה",
        desc: "דפי נחיתה, טפסים, לוחות שנה, סקרים, טלפוניה.",
        pain: "כי שאין איסוף מסודר אז עשרות לידים נעלמים ומתמוססים בלי ששמים לב",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f45dc55634f4.png"
    },
    {
        num: "2",
        title: "טיפוח",
        desc: "מסרים אוטומטיים מותאמים אישית בוואטסאפ, SMS, מייל, רשתות חברתיות ושיחות קוליות.",
        pain: "אם לא, חוסר עקביות במעקב גורם להפסדים ישירים של לקוחות",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db3b96f70dc1c2b0c5.png"
    },
    {
        num: "3",
        title: "סגירה",
        desc: "קביעת פגישות, הצעות מחיר, תיעוד מלא.",
        pain: "כי פגישות שמתפספסות והצעות שלא נענות = כסף אבוד",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697dbf0447344096548de.png"
    },
    {
        num: "4",
        title: "שימור",
        desc: "אוטומציות שירות ותמיכה, מעקב לקוחות, נאמנות.",
        pain: "לקוחות נשכחים אחרי העסקה = מפסידים מכירות המשך",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db10ecc40bcf69ee3e.png"
    }
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50 text-right relative overflow-hidden" dir="rtl">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-16"
                >
                    איך זה עובד בפועל?
                </motion.h2>

                <div className="space-y-24">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <img
                                        src={step.img}
                                        alt={`שלב ${step.title}`}
                                        className="relative w-full h-auto rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="flex items-center gap-4">
                                    <motion.span
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        className="flex items-center justify-center w-12 h-12 bg-primary text-white text-xl font-bold rounded-full shadow-lg border-4 border-white ring-2 ring-primary/20"
                                    >
                                        {step.num}
                                    </motion.span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-xl text-gray-600 leading-relaxed pr-16 md:pr-0">
                                    {step.desc}
                                </p>

                                <motion.div
                                    whileHover={{ x: -5, y: -2 }}
                                    className="bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm p-4 rounded-xl mr-4 md:mr-0 cursor-default relative overflow-hidden group hover:shadow-md transition-all duration-300"
                                >
                                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-xl"></div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                                            <Lightbulb size={18} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-slate-700 font-medium text-base/relaxed">
                                            {step.pain}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <a
                        href="#pricing"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        להתחלת ייעול מיידית
                    </a>
                </div>
            </div>
        </section>
    );
};
