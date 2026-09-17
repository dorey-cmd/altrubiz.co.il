/**
 * Cookie / tracking consent state.
 *
 * "Necessary" cookies (the ones the site needs to function - e.g. remembering
 * this consent choice itself) are always on and are not analytics/marketing
 * tools, so they carry no opt-in requirement.
 *
 * "Analytics" covers the non-essential, behavior-tracking tools the site
 * loads (Google Analytics 4, Microsoft Clarity) -- these are gated on an
 * explicit visitor choice before they run. See src/lib/analytics.ts and
 * src/lib/clarity.ts, which both call hasAnalyticsConsent()/onConsentChange()
 * from this module instead of initializing unconditionally.
 */

const STORAGE_KEY = 'altrubiz_cookie_consent_v1';
const CONSENT_EVENT = 'altrubiz:consent-changed';
const OPEN_SETTINGS_EVENT = 'altrubiz:open-cookie-settings';

export interface ConsentState {
    necessary: true;
    analytics: boolean;
    decidedAt: string;
}

function readStoredConsent(): ConsentState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed?.analytics === 'boolean' && typeof parsed?.decidedAt === 'string') {
            return { necessary: true, analytics: parsed.analytics, decidedAt: parsed.decidedAt };
        }
        return null;
    } catch {
        return null;
    }
}

export function hasDecided(): boolean {
    return readStoredConsent() !== null;
}

export function hasAnalyticsConsent(): boolean {
    return readStoredConsent()?.analytics === true;
}

export function setConsent(analytics: boolean): void {
    if (typeof window === 'undefined') return;
    const state: ConsentState = { necessary: true, analytics, decidedAt: new Date().toISOString() };
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // localStorage unavailable (private mode / blocked) -- consent still
        // takes effect for this page view via the in-memory event below.
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

/** Re-opens the cookie banner on demand (e.g. a "Cookie settings" footer
 * link), regardless of any past decision, so a visitor can change their
 * mind later. */
export function openCookieSettings(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettingsRequested(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(OPEN_SETTINGS_EVENT, callback);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, callback);
}

/** Calls `callback` immediately if analytics consent is already granted, and
 * again any time the visitor grants it later (e.g. via the cookie banner). */
export function onAnalyticsConsentGranted(callback: () => void): void {
    if (typeof window === 'undefined') return;
    if (hasAnalyticsConsent()) {
        callback();
        return;
    }
    const handler = (e: Event) => {
        const detail = (e as CustomEvent<ConsentState>).detail;
        if (detail?.analytics) {
            callback();
            window.removeEventListener(CONSENT_EVENT, handler);
        }
    };
    window.addEventListener(CONSENT_EVENT, handler);
}
