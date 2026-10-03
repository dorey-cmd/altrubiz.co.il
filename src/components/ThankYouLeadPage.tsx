import React, { useEffect, useRef } from 'react';
import { Home, Calculator, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { InternalLink } from './common/InternalLink';

interface ThankYouLeadPageProps {
    onNavigate: (path: string) => void;
}

export const ThankYouLeadPage: React.FC<ThankYouLeadPageProps> = ({ onNavigate }) => {
    const hasMeasuredRef = useRef(false);

    useEffect(() => {
        if (hasMeasuredRef.current) return;
        hasMeasuredRef.current = true;

        if (typeof window !== 'undefined') {
            window.oaiq = window.oaiq || function () {
                (window.oaiq!.q = window.oaiq!.q || []).push(arguments);
            };
            window.oaiq("measure", "lead_created", { type: "customer_action" });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-28 pb-20 font-sans" dir="rtl">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold mb-6 border border-emerald-200/80 shadow-xs">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>הפנייה התקבלה בהצלחה</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    תודה, קיבלנו את הפנייה שלך
                </h1>

                {/* Reassuring Message */}
                <div className="text-base sm:text-lg text-slate-600 leading-relaxed space-y-2 mb-8">
                    <p>הפנייה שלך הגיעה אלינו כמו שצריך, ואנחנו כבר מטפלים בה.</p>
                    <p className="font-medium text-slate-700">היא לא הלכה לאיבוד, לא נפלה בין הכיסאות, ולא מחכה באיזה אקסל נשכח.</p>
                </div>

                {/* Hero Illustration */}
                <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-white max-w-lg mx-auto">
                    <img
                        src="/images/thank-you-lead.webp"
                        alt="איש מחויך מאשר שהפנייה התקבלה ושכבר מטפלים בה"
                        className="w-full h-auto object-cover"
                        width="800"
                        height="600"
                        loading="eager"
                    />
                </div>

                {/* Follow-up Note */}
                <div className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10">
                    <p>אם השארת פרטים מלאים, נחזור אליך בהקדם.</p>
                    <p className="font-bold text-slate-900 mt-2">ועד שנחזור, אפשר להמשיך מכאן:</p>
                </div>

                {/* 3 Clear Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
                    <InternalLink
                        href="/"
                        onNavigate={onNavigate}
                        className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all group no-underline"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Home size={20} />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-900 group-hover:text-primary transition-colors text-base mb-1">
                                לעמוד הבית
                            </span>
                            <span className="text-xs text-slate-500">
                                חזרה לעמוד הראשי של המערכת
                            </span>
                        </div>
                    </InternalLink>

                    <InternalLink
                        href="/roi-calculator"
                        onNavigate={onNavigate}
                        className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all group no-underline"
                    >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-900 group-hover:text-primary transition-colors text-base mb-1">
                                למחשבון ROI
                            </span>
                            <span className="text-xs text-slate-500">
                                חישוב פוטנציאל ההכנסות שאפשר להציל
                            </span>
                        </div>
                    </InternalLink>

                    <InternalLink
                        href="/hidden-business-growth-barriers"
                        onNavigate={onNavigate}
                        className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 hover:shadow-lg transition-all group no-underline"
                    >
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ClipboardCheck size={20} />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-900 group-hover:text-primary transition-colors text-base mb-1">
                                לשאלון האבחון
                            </span>
                            <span className="text-xs text-slate-500">
                                18 שאלות לזיהוי חסמי צמיחה בעסק
                            </span>
                        </div>
                    </InternalLink>
                </div>
            </div>
        </div>
    );
};
