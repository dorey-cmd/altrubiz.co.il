import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { NEWSLETTER_CONSENT_CONFIG } from '../../data/newsletterConsent';
import { buildNewsletterNote, generateSubmissionId } from '../../lib/newsletterNoteBuilder';
import { TURNSTILE_SITE_KEY, loadTurnstile } from '../../lib/turnstile';

interface NewsletterClubBannerProps {
    currentPath?: string;
}

// Server-side boundary: the CRM webhook is never called from the browser.
const SUBSCRIBE_ENDPOINT = '/api/newsletter-subscribe';
const BOT_CHECK_TIMEOUT_MS = 15000;
const GENERIC_ERROR_MESSAGE = 'לא הצלחנו להשלים את ההרשמה. אפשר לנסות שוב בעוד רגע.';

export const NewsletterClubBanner: React.FC<NewsletterClubBannerProps> = ({ currentPath }) => {
    const [email, setEmail] = useState('');
    const [consentChecked, setConsentChecked] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    // Honeypot: invisible to visitors, filled only by automated form fillers
    const [honeypot, setHoneypot] = useState('');

    const mountedAtRef = useRef(Date.now());
    const botCheckContainerRef = useRef<HTMLDivElement>(null);
    const botCheckWidgetIdRef = useRef<string | null>(null);
    const botCheckTokenRef = useRef<string | null>(null);
    const botCheckWaitersRef = useRef<Array<(token: string | null) => void>>([]);

    const settleBotCheck = (token: string | null) => {
        botCheckTokenRef.current = token;
        const waiters = botCheckWaitersRef.current;
        botCheckWaitersRef.current = [];
        waiters.forEach((resolve) => resolve(token));
    };

    // Loads the bot check on first interaction with the form, never on page load
    const startBotCheck = useCallback(async () => {
        if (botCheckWidgetIdRef.current || !botCheckContainerRef.current) return;
        try {
            const turnstile = await loadTurnstile();
            if (botCheckWidgetIdRef.current || !botCheckContainerRef.current) return;
            botCheckWidgetIdRef.current = turnstile.render(botCheckContainerRef.current, {
                sitekey: TURNSTILE_SITE_KEY,
                appearance: 'interaction-only',
                theme: 'dark',
                language: 'he',
                action: 'newsletter_signup',
                callback: (token) => settleBotCheck(token),
                'error-callback': () => settleBotCheck(null),
                'expired-callback': () => {
                    botCheckTokenRef.current = null;
                }
            });
        } catch (err) {
            console.warn('[NewsletterClubBanner] Bot check failed to load', err);
            settleBotCheck(null);
        }
    }, []);

    const waitForBotCheckToken = (): Promise<string | null> => {
        if (botCheckTokenRef.current) return Promise.resolve(botCheckTokenRef.current);
        return new Promise((resolve) => {
            const timer = window.setTimeout(() => resolve(null), BOT_CHECK_TIMEOUT_MS);
            botCheckWaitersRef.current.push((token) => {
                window.clearTimeout(timer);
                resolve(token);
            });
            void startBotCheck();
        });
    };

    // Tokens are single-use: request a fresh one after every submission attempt
    const resetBotCheck = () => {
        botCheckTokenRef.current = null;
        if (botCheckWidgetIdRef.current && window.turnstile) {
            window.turnstile.reset(botCheckWidgetIdRef.current);
        }
    };

    useEffect(() => {
        return () => {
            if (botCheckWidgetIdRef.current && window.turnstile) {
                window.turnstile.remove(botCheckWidgetIdRef.current);
                botCheckWidgetIdRef.current = null;
            }
        };
    }, []);

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

        // Strict consent enforcement: no submission without explicit manual opt-in
        if (!consentChecked) {
            setErrorMessage('יש לסמן את תיבת ההסכמה לקבלת עדכונים כדי להמשיך');
            return;
        }

        setStatus('loading');

        const submissionId = generateSubmissionId();
        let noteContent = '';
        try {
            noteContent = buildNewsletterNote({
                email: trimmedEmail,
                sourcePagePath: pathname,
                pageTitle: typeof document !== 'undefined' ? document.title : 'AltruBiz CRM',
                submissionId,
                consentConfirmed: consentChecked,
                componentLocation: 'מועדון המהלך הבא (Footer Banner)'
            });
        } catch (err) {
            console.error('[NewsletterClubBanner] Error building note string:', err);
            // Resilient fallback note if an unexpected error occurs so payload is never corrupted
            noteContent = `--------------------------------\nNEWSLETTER SIGNUP - מועדון המהלך הבא\n--------------------------------\n\nSubmission ID:\n${submissionId}\n\nConsent:\nYES - checkbox manually selected by user\n\nConsent version:\n${NEWSLETTER_CONSENT_CONFIG.consentVersion}\n\nConsent text:\n"${NEWSLETTER_CONSENT_CONFIG.consentText}"\n\nSignup time UTC:\n${new Date().toISOString()}\n\nEmail:\n${trimmedEmail}\n\nPath:\n${pathname}\n--------------------------------`;
        }

        const payload = {
            email: trimmedEmail,
            source: 'מועדון המהלך הבא',
            sourcePage: pathname,
            pageTitle: typeof document !== 'undefined' ? document.title : 'AltruBiz CRM',
            submittedAt: new Date().toISOString(),
            consent: true,
            consent_version: NEWSLETTER_CONSENT_CONFIG.consentVersion,
            submission_id: submissionId,
            note: noteContent,
            contact_me_by_fax_only: honeypot,
            form_elapsed_ms: Date.now() - mountedAtRef.current,
            turnstile_token: ''
        };

        const botCheckToken = await waitForBotCheckToken();
        if (!botCheckToken) {
            resetBotCheck();
            setStatus('idle');
            setErrorMessage('האימות לא הושלם. אפשר לרענן את העמוד ולנסות שוב.');
            return;
        }
        payload.turnstile_token = botCheckToken;

        try {
            const response = await fetch(SUBSCRIBE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                resetBotCheck();
                setStatus('idle');
                setErrorMessage(typeof result?.message === 'string' ? result.message : GENERIC_ERROR_MESSAGE);
                return;
            }

            setStatus('success');
            setEmail('');
            setConsentChecked(false);
        } catch {
            resetBotCheck();
            setStatus('idle');
            setErrorMessage(GENERIC_ERROR_MESSAGE);
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
                                נשאר רק לאשר במייל
                            </h3>
                            <p className="text-xs text-emerald-200 leading-relaxed">
                                שלחנו מייל עם קישור לאישור ההרשמה. לחיצה עליו תשלים את ההצטרפות. אם המייל לא הגיע, כדאי לבדוק גם בתיבת הספאם.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="max-w-lg mx-auto space-y-3.5">
                            <div className="flex flex-col sm:flex-row gap-2.5">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => void startBotCheck()}
                                        placeholder="Email"
                                        aria-label="כתובת אימייל"
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

                            {/* Honeypot field: hidden from visitors and assistive technology */}
                            <div className="sr-only" aria-hidden="true">
                                <label htmlFor="newsletter-club-fax">Fax</label>
                                <input
                                    type="text"
                                    id="newsletter-club-fax"
                                    name="contact_me_by_fax_only"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Mandatory Explicit Consent Checkbox */}
                            <div className="pt-1 text-right">
                                <div className="flex items-start gap-2.5">
                                    <input
                                        type="checkbox"
                                        id="newsletter-club-consent"
                                        name="newsletter-club-consent"
                                        checked={consentChecked}
                                        onChange={(e) => {
                                            setConsentChecked(e.target.checked);
                                            if (e.target.checked) setErrorMessage('');
                                            void startBotCheck();
                                        }}
                                        required
                                        disabled={status === 'loading'}
                                        className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-amber-400 focus:ring-amber-400 focus:ring-offset-0 focus:ring-2 cursor-pointer flex-shrink-0 accent-amber-400"
                                        aria-required="true"
                                    />
                                    <label
                                        htmlFor="newsletter-club-consent"
                                        className="text-[12px] sm:text-[13px] text-slate-300 leading-relaxed cursor-pointer select-none"
                                    >
                                        אני מאשר/ת לקבל מ-AltruBiz עדכונים, מידע ותוכן חשוב ורלוונטי. פרטיי לא יימסרו לצדדים שלישיים לצורכי שיווק שלהם, והשימוש בהם ייעשה בהתאם ל
                                        <a
                                            href={NEWSLETTER_CONSENT_CONFIG.privacyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-300 hover:text-amber-200 underline font-semibold mx-1 inline-block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {NEWSLETTER_CONSENT_CONFIG.privacyLinkText}
                                        </a>
                                        ול
                                        <a
                                            href={NEWSLETTER_CONSENT_CONFIG.termsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-300 hover:text-amber-200 underline font-semibold mx-1 inline-block"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {NEWSLETTER_CONSENT_CONFIG.termsLinkText}
                                        </a>
                                        .
                                    </label>
                                </div>
                            </div>

                            {/* Bot check widget: renders only when a challenge is required */}
                            <div ref={botCheckContainerRef} className="flex justify-center" />

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
