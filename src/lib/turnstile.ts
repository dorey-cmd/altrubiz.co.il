/**
 * Cloudflare Turnstile loader (bot check for the Newsletter Club form).
 *
 * The script is injected on demand (first interaction with the form), never on
 * page load, so it costs nothing for visitors who do not sign up.
 * The token it produces is verified server-side in api/newsletter-subscribe.ts.
 */

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Cloudflare's published always-pass test key. The production secret rejects its tokens. */
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

export const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY || TURNSTILE_TEST_SITE_KEY;

export interface TurnstileRenderOptions {
    sitekey: string;
    callback: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
    appearance?: 'always' | 'execute' | 'interaction-only';
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    action?: string;
}

export interface TurnstileApi {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
}

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

let loadPromise: Promise<TurnstileApi> | null = null;

export function loadTurnstile(): Promise<TurnstileApi> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Turnstile is only available in the browser'));
    }
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (loadPromise) return loadPromise;

    loadPromise = new Promise<TurnstileApi>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.turnstile) {
                resolve(window.turnstile);
            } else {
                loadPromise = null;
                reject(new Error('Turnstile script loaded without API'));
            }
        };
        script.onerror = () => {
            loadPromise = null;
            script.remove();
            reject(new Error('Turnstile script failed to load'));
        };
        document.head.appendChild(script);
    });

    return loadPromise;
}
