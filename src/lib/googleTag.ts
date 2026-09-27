import { IL_MARKET } from '../siteos';
import { CTAContext } from '../types/attribution';

/**
 * Google Tag (gtag.js) Integration
 * 
 * Tag ID: AW-16832680902
 * Sourced from SiteOS IL_MARKET.analytics.googleTagId.
 * 
 * Handles initial configuration, SPA dynamic route page views across
 * all site pages (present and future), and structured conversion tracking.
 */

declare global {
    interface Window {
        dataLayer?: any[];
        gtag?: (...args: any[]) => void;
    }
}

export const GOOGLE_TAG_ID = IL_MARKET.analytics.googleTagId || 'AW-16832680902';

let isGoogleTagInitialized = false;

/**
 * Ensures Google Tag dataLayer and gtag function are initialized safely.
 * Safe to call multiple times (idempotent).
 */
export function initGoogleTag(customTagId?: string): void {
    if (typeof window === 'undefined') return;
    if (isGoogleTagInitialized) return;
    isGoogleTagInitialized = true;

    const tagId = customTagId || GOOGLE_TAG_ID;
    if (!tagId) return;

    try {
        window.dataLayer = window.dataLayer || [];
        if (!window.gtag) {
            window.gtag = function () {
                window.dataLayer!.push(arguments);
            };
        }

        // If tag was already configured by index.html static snippet, avoid duplicate initial call
        const alreadyConfigured = window.dataLayer.some(
            entry => entry && entry[0] === 'config' && entry[1] === tagId
        );

        if (!alreadyConfigured) {
            window.gtag('js', new Date());
            window.gtag('config', tagId);
        }
    } catch {
        // Safe fail-open: tracking errors must never crash the app
    }
}

/**
 * Tracks a PageView event on Google Tag.
 * Called automatically on SPA route changes across all pages.
 */
export function trackGooglePageview(path?: string, title?: string): void {
    if (typeof window === 'undefined') return;

    try {
        if (typeof window.gtag === 'function') {
            const currentPath = path || window.location.pathname;
            const currentTitle = title || document.title;
            const origin = window.location.origin || 'https://altrubiz.co.il';

            window.gtag('config', GOOGLE_TAG_ID, {
                page_path: currentPath,
                page_location: `${origin}${currentPath}`,
                page_title: currentTitle,
            });

            window.gtag('event', 'page_view', {
                page_path: currentPath,
                page_location: `${origin}${currentPath}`,
                page_title: currentTitle,
                send_to: GOOGLE_TAG_ID,
            });
        }
    } catch {
        // Safe fail-open: never block navigation
    }
}

/**
 * Tracks a conversion event to Google Tag / Google Ads.
 * Supports passing structured CTA context and attribution.
 */
export function trackGoogleConversion(conversionLabel: string, ctx?: CTAContext, extra?: Record<string, any>): void {
    if (typeof window === 'undefined') return;

    try {
        if (typeof window.gtag === 'function') {
            const sendTo = conversionLabel.includes('/') ? conversionLabel : `${GOOGLE_TAG_ID}/${conversionLabel}`;
            window.gtag('event', 'conversion', {
                send_to: sendTo,
                ...(ctx?.sourcePage ? { source_page: ctx.sourcePage } : {}),
                ...(ctx?.sourceSection ? { source_section: ctx.sourceSection } : {}),
                ...(ctx?.sourceArticle ? { source_article: ctx.sourceArticle } : {}),
                ...(ctx?.sourceHub ? { source_hub: ctx.sourceHub } : {}),
                ...(ctx?.intent ? { intent: ctx.intent } : {}),
                ...(ctx?.ctaType ? { cta_type: ctx.ctaType } : {}),
                ...(extra || {}),
            });
        }
    } catch {
        // Safe fail-open
    }
}
