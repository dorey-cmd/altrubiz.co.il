import { IL_MARKET } from '../siteos';
import { CTAContext } from '../types/attribution';

/**
 * Meta Pixel (Facebook Pixel) Integration
 * 
 * Pixel ID: 2123722128574429
 * Sourced from SiteOS IL_MARKET.analytics.metaPixelId.
 * 
 * Tracks PageView across all initial and dynamic SPA route changes,
 * and enables standard / custom event measurement with structured attribution.
 */

declare global {
    interface Window {
        fbq?: ((...args: any[]) => void) & {
            callMethod?: (...args: any[]) => void;
            queue?: any[];
            loaded?: boolean;
            version?: string;
        };
        _fbq?: any;
    }
}

export const META_PIXEL_ID = IL_MARKET.analytics.metaPixelId || '2123722128574429';

let isMetaPixelInitialized = false;

/**
 * Ensures Meta Pixel queue/stub is available and initialized.
 * Safe to call multiple times (idempotent).
 */
export function initMetaPixel(customPixelId?: string): void {
    if (typeof window === 'undefined') return;
    if (isMetaPixelInitialized) return;
    isMetaPixelInitialized = true;

    const pixelId = customPixelId || META_PIXEL_ID;
    if (!pixelId) return;

    try {
        // If fbq was already defined and initialized by index.html, do not re-initialize
        if (window.fbq && (window.fbq.loaded || window._fbq)) {
            return;
        }

        if (!window.fbq) {
            const n: any = function (...args: any[]) {
                if (n.callMethod) {
                    n.callMethod.apply(n, args);
                } else {
                    n.queue.push(args);
                }
            };
            if (!window._fbq) window._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            window.fbq = n;
        }

        if (typeof window.fbq === 'function') {
            window.fbq('init', pixelId);
        }
    } catch {
        // Safe fail-open: never block execution
    }
}

/**
 * Tracks a PageView event on Meta Pixel.
 * Called automatically on SPA route changes across all pages.
 */
export function trackMetaPageview(_path?: string): void {
    if (typeof window === 'undefined') return;
    try {
        if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
        }
    } catch {
        // Safe fail-open
    }
}

/**
 * Tracks a standard or custom Meta event with contextual attribution.
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>): void {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    try {
        window.fbq('track', eventName, params);
    } catch {
        // Safe fail-open
    }
}

/**
 * Tracks lead conversions to Meta Pixel (Lead event).
 */
export function trackMetaConversion(ctx: CTAContext): void {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
    try {
        window.fbq('track', 'Lead', {
            content_name: ctx.sourceLabel || ctx.ctaType,
            content_category: ctx.intent,
            source_page: ctx.sourcePage,
            source_section: ctx.sourceSection,
            source_hub: ctx.sourceHub,
        });
    } catch {
        // Safe fail-open
    }
}
