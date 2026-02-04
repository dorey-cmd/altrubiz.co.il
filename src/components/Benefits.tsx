import React from 'react';
import { motion } from 'framer-motion';


export const Benefits = () => {
    return (
        <section id="benefits" className="relative py-24 bg-white text-right overflow-hidden" dir="rtl">
            {/* Wave Separator Top */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-8"
                >
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3 rounded-full text-base md:text-lg font-bold shadow-lg shadow-red-500/20 flex items-center gap-2">
                        <span className="text-xl">🛑</span>
                        כל דקה של עיכוב במענה עלולה להפוך לעסקה שהלכה למתחרים
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-16"
                >
                    יתרונות מרכזיים
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "זמינות מענה ללקוחות 24/7", desc: "עם שילוב אוטומציות ו־AI" },
                        { title: "תדירות ואחידות במענה", desc: "כל ליד מקבל יחס מדויק" },
                        { title: "חיבור אמיתי בין מכירות, שיווק ושירות", desc: "כל המידע במקום אחד" },
                        { title: "שיפור ניצול תקציבי פרסום", desc: "והגדלת ההמרות" },
                        { title: "ניהול זמן יעיל", desc: "פחות עבודה ידנית, יותר פוקוס על צמיחה" },
                        { title: "בקרה מלאה על תהליך המכירה", desc: "שליטה בכל שלב" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-slate-50 p-6 rounded-xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <a
                        href="#pricing"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        לחבילות אלטרוביז לפי הצורך שלך
                    </a>
                </div>
            </div>
        </section>
    );
};

export const Extras = () => {
    return (
        <section id="extras" className="py-20 bg-dark text-right text-white relative" dir="rtl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "ניהול לידים חכם", desc: "כל ליד במקום אחד. תמונה מלאה ברגע נתון." },
                        { title: "אוטומציה ובינה מלאכותית", desc: "תהליכים שרצים לבד, גם כשלא זמינים." },
                        { title: "תקשורת רב־ערוצית", desc: "וואטסאפ, טיקטוק, אינסטגרם, פייסבוק, טלפון, מייל ו־SMS." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 text-center hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                        >
                            <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                            <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
