import React, { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { hasDecided, onOpenCookieSettingsRequested, setConsent } from '../../lib/consent';
import { isAnyOverlayOpen, onOverlayCountChanged } from '../../lib/overlayCoordination';

interface CookieConsentBannerProps {
    onNavigate?: (path: string) => void;
}

const SCROLL_HIDE_THRESHOLD = 160;

/**
 * Consent gate for non-essential cookies (Google Analytics 4 + Microsoft
 * Clarity - see src/lib/analytics.ts / src/lib/clarity.ts). Rendered once at
 * the app root (src/App.tsx) so it appears on every route until the visitor
 * makes a choice, which is then remembered (src/lib/consent.ts).
 */
export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onNavigate }) => {
    const [decided, setDecided] = useState(true);
    const [forcedOpen, setForcedOpen] = useState(false);
    const [nearTop, setNearTop] = useState(true);
    const [overlayOpen, setOverlayOpenState] = useState(false);

    useEffect(() => {
        setDecided(hasDecided());
        setNearTop(window.scrollY < SCROLL_HIDE_THRESHOLD);
        setOverlayOpenState(isAnyOverlayOpen());

        const handleScroll = () => setNearTop(window.scrollY < SCROLL_HIDE_THRESHOLD);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const unsubscribeSettings = onOpenCookieSettingsRequested(() => setForcedOpen(true));
        const unsubscribeOverlay = onOverlayCountChanged(setOverlayOpenState);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribeSettings();
            unsubscribeOverlay();
        };
    }, []);

    // Undecided visitors only see it near the top of the page - by the time
    // an article's sticky sidebar CTA or an inline CTA has scrolled into
    // this same corner, the banner has already stepped aside, so the two
    // never compete for a click. Reopening from the footer's "Cookie
    // settings" link (forcedOpen) always shows it regardless of scroll
    // position, since that's a deliberate action from the very bottom of
    // the page, past where the sidebar's sticky range ends.
    const visible = forcedOpen || (!decided && nearTop);
    if (!visible || overlayOpen) return null;

    const handleChoice = (analytics: boolean) => {
        setConsent(analytics);
        setDecided(true);
        setForcedOpen(false);
    };

    const handlePolicyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onNavigate) {
            e.preventDefault();
            onNavigate('/cookie-policy');
        }
    };

    return (
        <div
            role="region"
            aria-label="הודעה על שימוש בקובצי Cookie"
            dir="rtl"
            // Small corner card, not a big attention-grabbing bar. Kept on
            // the same side as the WhatsApp float button (bottom-5 left-5)
            // at every breakpoint, but raised above it (bottom-24) for
            // vertical clearance instead of trying to share the corner.
            // z-40 stays below the z-50 used by the Header and every
            // full-screen mobile drawer/modal, so those always render above
            // it and keep their own clicks while open.
            className="fixed bottom-24 inset-x-3 sm:inset-x-auto sm:left-5 z-40 flex justify-center sm:justify-start pointer-events-none"
        >
            <div className="w-full max-w-[300px] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md p-3 flex flex-col gap-2.5 pointer-events-auto text-xs">
                <div className="flex items-start gap-2 text-slate-600 leading-relaxed">
                    <Cookie size={15} className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>
                        האתר משתמש בעוגיות חיוניות, ובכפוף להסכמתכם גם בכלי ניתוח שימוש. פרטים ב
                        <a
                            href="/cookie-policy"
                            onClick={handlePolicyClick}
                            className="text-primary font-semibold hover:underline mx-1"
                        >
                            מדיניות ה-Cookies
                        </a>
                        .
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleChoice(false)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        רק חיוניים
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChoice(true)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-primary hover:bg-blue-700 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                    >
                        אישור הכל
                    </button>
                </div>
            </div>
        </div>
    );
};
