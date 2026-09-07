import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { HOMEPAGE_FAQS } from '../lib/seo';

export const FAQSection: React.FC = () => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIdx(prev => prev === idx ? null : idx);
    };

    return (
        <section id="faq" className="py-24 bg-white text-right relative overflow-hidden" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-3 border border-blue-100">
                        <HelpCircle size={15} />
                        <span>שאלות ותשובות עובדתיות</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        שאלות נפוצות על AltruBiz CRM
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
                        תשובות ישירות וברורות על היכולות, החיבור לוואטסאפ, המסלולים ואופן הפעולה של המערכת.
                    </p>
                </div>

                <div className="space-y-4">
                    {HOMEPAGE_FAQS.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div 
                                key={idx}
                                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                    isOpen 
                                        ? 'bg-slate-50/90 border-primary/30 shadow-sm' 
                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <button
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-right focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <h3 className="font-bold text-slate-900 text-base sm:text-lg pr-1">
                                        {faq.question}
                                    </h3>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 transition-transform duration-200 ${
                                        isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-6 sm:px-6 pt-0 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-gray-100/80">
                                        <p className="pt-3">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
