import React, { useEffect, useRef } from 'react';
import { Home, Calculator, ClipboardCheck, CheckCircle2, Calendar, Download, ExternalLink } from 'lucide-react';
import { InternalLink } from './common/InternalLink';

interface ThankYouMeetPageProps {
    onNavigate: (path: string) => void;
}

export const ThankYouMeetPage: React.FC<ThankYouMeetPageProps> = ({ onNavigate }) => {
    const hasMeasuredRef = useRef(false);

    useEffect(() => {
        if (hasMeasuredRef.current) return;
        hasMeasuredRef.current = true;

        if (typeof window !== 'undefined') {
            window.oaiq = window.oaiq || function () {
                (window.oaiq!.q = window.oaiq!.q || []).push(arguments);
            };
            window.oaiq("measure", "appointment_scheduled", { type: "customer_action" });
        }
    }, []);

    const calendarLinks = [
        {
            name: 'Google Calendar',
            href: 'https://backend.leadconnectorhq.com/calendars/google/calendar/add-event/7dfSEnJaPgfs3xM79KAk',
            icon: Calendar,
            actionLabel: 'פתיחה ב-Google Calendar',
            isExternal: true
        },
        {
            name: 'Outlook Calendar',
            href: 'https://backend.leadconnectorhq.com/calendars/google/calendar/get-ics/7dfSEnJaPgfs3xM79KAk',
            icon: Download,
            actionLabel: 'הורדת קובץ ICS ל-Outlook',
            isExternal: false
        },
        {
            name: 'iCloud Calendar',
            href: 'https://backend.leadconnectorhq.com/calendars/google/calendar/get-ics/7dfSEnJaPgfs3xM79KAk',
            icon: Download,
            actionLabel: 'הורדת קובץ ICS ל-iCloud',
            isExternal: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-28 pb-20 font-sans" dir="rtl">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold mb-6 border border-emerald-200/80 shadow-xs">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>הפגישה נקבעה בהצלחה</span>
                </div>

                {/* Main Heading (English as requested) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4" dir="ltr">
                    Your meeting has been scheduled
                </h1>

                {/* Subheading / Thank you line */}
                <p className="text-lg sm:text-xl font-medium text-slate-700 leading-relaxed mb-8">
                    תודה שקבעת פגישה! מחכה לראותך בקרוב 😊
                </p>

                {/* Hero Illustration */}
                <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-white max-w-lg mx-auto">
                    <img
                        src="/images/thank-you-meet.webp"
                        alt="איש ידידותי מאשר שהפגישה נקבעה ומחכה למפגש הקרוב"
                        className="w-full h-auto object-cover"
                        width="800"
                        height="600"
                        loading="eager"
                    />
                </div>

                {/* Add to Calendar Section */}
                <div className="mb-12 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm text-right">
                    <div className="flex items-center gap-2.5 mb-2">
                        <Calendar className="text-primary w-5 h-5" />
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                            רוצה לשמור את הפגישה ביומן?
                        </h2>
                    </div>
                    <p className="text-sm text-slate-600 mb-5">
                        לחיצה על היומן המתאים תוסיף את מועד הפגישה והפרטים באופן אוטומטי:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {calendarLinks.map((cal) => {
                            const IconComponent = cal.icon;
                            return (
                                <a
                                    key={cal.name}
                                    href={cal.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary/60 hover:bg-blue-50/50 hover:shadow-md transition-all group no-underline text-center"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-primary flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:border-primary/40 transition-all shadow-xs">
                                        <IconComponent size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm mb-1">
                                        {cal.name}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-primary/80">
                                        <span>{cal.isExternal ? 'הוספה ליומן' : 'הורדה'}</span>
                                        <ExternalLink size={12} />
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Continue Exploring Section */}
                <div className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-bold text-right sm:text-center">
                    בינתיים אפשר להמשיך מכאן:
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
