import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

interface NewsletterClubBannerProps {
    currentPath?: string;
}

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/O8tlYEQIUn4z3qPCt1FX/webhook-trigger/ad603078-9b7e-4e14-9e1e-69a68cddf2fd';

export const NewsletterClubBanner: React.FC<NewsletterClubBannerProps> = ({ currentPath }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const pathname = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');

    // Adapt layout styling based on page type
    const isArticle = pathname.startsWith('/articles/');
    const isHome = pathname === '/' || pathname === '';
    const isDiagnostic = pathname.includes('diagnostic');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setErrorMessage('נא להזין כתובת אימייל');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage('נא להזין כתובת אימייל תקינה');
            return;
        }

        setStatus('loading');

        const payload = {
          email: trimmedEmail,
          source: 'מועדון המהלך הבא',
          sourcePage: pathname,
          pageTitle: typeof document !== 'undefined' ? document.title : 'AltruBiz CRM',
          submittedAt: new Date().toISOString()
        };

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            setStatus('success');
            setEmail('');
        } catch {
            // Fallback for CORS restrictions on webhook endpoints
            try {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(WEBHOOK_URL, blob);
            } catch (beaconErr) {
                console.warn('Beacon delivery failed', beaconErr);
            }
            // Delivery attempt dispatched
            setStatus('success');
            setEmail('');
        }
    };

    return (
        <section 
            aria-label="הרשמה למועדון המהלך הבא"
            className={`w-full relative z-20 overflow-hidden ${
                isHome 
                    ? 'bg-gradient-to-b from-[#061426] via-[#091b33] to-[#040e1a] text-white py-16 sm:py-20 border-t border-b border-sky-900/40' 
                    : isArticle
                        ? 'bg-slate-900 text-white py-14 sm:py-16 border-t border-slate-800'
                        : isDiagnostic
                            ? 'bg-slate-900 text-white py-14 sm:py-16 border-t border-slate-800'
                            : 'bg-[#091b33] text-white py-14 sm:py-16 border-t border-sky-950'
            }`}
            dir="rtl"
        >
            {/* Subtle background glow effect */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className={`mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${isArticle ? 'max-w-4xl' : 'max-w-5xl'}`}>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-center space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-xs">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>מועדון המהלך הבא</span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-2.5 max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                            הרשמה למועדון המהלך הבא
                        </h2>
                        <p className="text-sm sm:text-base font-bold text-sky-200">
                            לקבל ללא עלות, כל פעם, משהו אחד ששווה ליישם בעסק.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                            רעיונות, כלים ומהלכים פרקטיים שעוזרים לעבוד חכם יותר, לשווק טוב יותר ולנצל את מה שהטכנולוגיה מאפשרת היום.
                        </p>
                    </div>

                    {/* Form or Success State */}
                    {status === 'success' ? (
                        <div className="max-w-md mx-auto p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="font-bold text-base text-white">
                                תודה על ההרשמה!
                            </h3>
                            <p className="text-xs text-emerald-200">
                                המהלך הבא יישלח ישירות אל תיבת הדואר שלכם.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2.5">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        disabled={status === 'loading'}
                                        required
                                        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
                                        dir="ltr"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-60 cursor-pointer flex-shrink-0"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>שולחים...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>שלחו לי את המהלך הבא</span>
                                            <ArrowLeft size={16} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {errorMessage && (
                                <p className="text-xs font-semibold text-rose-300 text-right pr-2">
                                    {errorMessage}
                                </p>
                            )}
                        </form>
                    )}

                    {/* Trust / Anti-Spam Reassurance */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-slate-400 pt-1 text-center">
                        <span>אנחנו שולחים רק דברים ששווה לקרוא.</span>
                        <span className="hidden sm:inline opacity-30">•</span>
                        <span>אפשר לצאת בכל רגע.</span>
                        <span className="hidden sm:inline opacity-30">•</span>
                        <span>אנחנו לא אוהבים ספאם יותר מכם.</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
