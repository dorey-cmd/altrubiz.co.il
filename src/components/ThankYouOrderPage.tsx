import React, { useEffect, useRef } from 'react';
import { Home, Calculator, ClipboardCheck, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { InternalLink } from './common/InternalLink';

interface ThankYouOrderPageProps {
    onNavigate: (path: string) => void;
}

export const ThankYouOrderPage: React.FC<ThankYouOrderPageProps> = ({ onNavigate }) => {
    const hasMeasuredRef = useRef(false);

    useEffect(() => {
        if (hasMeasuredRef.current) return;
        hasMeasuredRef.current = true;

        if (typeof window === 'undefined') return;

        // Session-level deduplication to prevent double-counting on page refresh / back navigation
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const transactionId = searchParams.get('transactionId') ||
                searchParams.get('orderId') ||
                searchParams.get('tx') ||
                searchParams.get('payment_id') ||
                searchParams.get('ProductGuid') ||
                'completed_session_order';

            const storageKey = `oaiq_order_tracked_${transactionId}`;
            const alreadyTracked = sessionStorage.getItem(storageKey);

            if (!alreadyTracked) {
                sessionStorage.setItem(storageKey, 'true');

                window.oaiq = window.oaiq || function () {
                    (window.oaiq!.q = window.oaiq!.q || []).push(arguments);
                };
                window.oaiq("measure", "order_created", { type: "contents" });
            }
        } catch {
            // Fail open: ensure tracking fires if sessionStorage is unavailable
            window.oaiq = window.oaiq || function () {
                (window.oaiq!.q = window.oaiq!.q || []).push(arguments);
            };
            window.oaiq("measure", "order_created", { type: "contents" });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-28 pb-20 font-sans" dir="rtl">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold mb-6 border border-emerald-200/80 shadow-xs">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>התשלום התקבל בהצלחה</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                    התשלום התקבל בהצלחה
                </h1>

                {/* Reassuring Text */}
                <div className="text-base sm:text-lg text-slate-600 leading-relaxed space-y-2 mb-8">
                    <p>תודה! התשלום עבר כמו שצריך ואנחנו כבר ממשיכים מכאן.</p>
                    <p className="font-medium text-slate-700">הכסף לא נתקע בדרך, העסקה לא נעלמה במערכת - הכול מסודר 😊</p>
                </div>

                {/* Hero Illustration */}
                <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-white max-w-lg mx-auto">
                    <img
                        src="/images/thank-you-order.webp"
                        alt="איש מחויך מסמן שהתשלום הושלם והכול מסודר"
                        className="w-full h-auto object-cover"
                        width="800"
                        height="600"
                        loading="eager"
                    />
                </div>

                {/* "What happens now?" Section */}
                <div className="mb-10 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm text-right">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span>מה עכשיו?</span>
                    </h2>
                    <div className="space-y-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                        <p>אנחנו כבר מטפלים בשלב הבא בתהליך.</p>
                        <p>אם נדרש ממך משהו נוסף, נעדכן אותך בפרטים שסיפקת.</p>
                    </div>
                </div>

                {/* Prominent Onboarding Form Bridge */}
                <div className="mb-10 text-right">
                    <div className="text-base sm:text-lg text-slate-700 leading-relaxed mb-4 font-bold text-right sm:text-center">
                        בינתיים אפשר להמשיך מכאן:
                    </div>

                    <a
                        href="https://onboard.altrubiz.co.il/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-primary/30 hover:border-primary hover:shadow-lg transition-all group no-underline text-right"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                                <FileText size={24} />
                            </div>
                            <div>
                                <span className="block font-bold text-slate-900 group-hover:text-primary transition-colors text-base sm:text-lg mb-1">
                                    לטופס קבלת לקוח
                                </span>
                                <span className="text-xs sm:text-sm text-slate-600">
                                    לא חובה אבל עושה המון סדר בתהליך ומומלץ מאוד
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mr-3 shrink-0">
                            <span className="hidden sm:inline">מעבר לטופס</span>
                            <ExternalLink size={16} />
                        </div>
                    </a>
                </div>

                {/* 3 Secondary Navigation Cards */}
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
