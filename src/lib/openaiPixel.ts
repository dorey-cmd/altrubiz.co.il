import { CTAContext } from '../types/attribution';
import { IL_MARKET } from '../siteos';

/**
 * OpenAI Ads Conversion Measurement Pixel (oaiq)
 *
 * Pixel: GPT_pix_1
 * Pixel ID: VhQDWuEErwuNe33qTVu24K
 *
 * Implements client-side measurement for OpenAI Ads campaigns.
 * Captures browser conversion events (lead_created, order_created, etc.)
 * with contextual attribution aligned with AltruBiz SiteOS standards.
 */

declare global {
    interface Window {
        oaiq?: ((...args: any[]) => void) & {
            q?: any[];
        };
    }
}

export const OPENAI_PIXEL_ID = IL_MARKET.analytics.openAiPixelId || 'VhQDWuEErwuNe33qTVu24K';

/**
 * Checks whether a given URL points to a WhatsApp destination.
 * Matches wa.me, api.whatsapp.com, web.whatsapp.com, or whatsapp:// scheme.
 */
export function isWhatsAppUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    return (
        lower.includes('wa.me') ||
        lower.includes('api.whatsapp.com') ||
        lower.includes('web.whatsapp.com') ||
        lower.startsWith('whatsapp://')
    );
}

/**
 * Fires the exact OpenAI custom event for WhatsApp clicks:
 * oaiq("measure", "custom", { type: "custom" }, { custom_event_name: "whatsup" });
 * 
 * Safe fail-open: Never allows a tracking error to disrupt user interaction.
 */
export function trackWhatsAppClick(): void {
    if (typeof window === 'undefined') return;
    try {
        window.oaiq = window.oaiq || function (...args: any[]) {
            (window.oaiq!.q = window.oaiq!.q || []).push(args);
        };
        window.oaiq(
            'measure',
            'custom',
            { type: 'custom' },
            { custom_event_name: 'whatsup' }
        );
    } catch {
        // Safe fail-open: Never allow a tracking issue to break visitor click
    }
}

let isGlobalWhatsAppTrackerInitialized = false;
let lastWhatsAppClickTime = 0;

/**
 * Global delegated listener for WhatsApp interactions across all pages,
 * including client-side SPA navigations and dynamically rendered components.
 * 
 * Intercepts clicks on <a> elements pointing to WhatsApp as well as
 * programmatic window.open calls to WhatsApp URLs.
 */
export function initGlobalWhatsAppTracker(): void {
    if (typeof window === 'undefined' || isGlobalWhatsAppTrackerInitialized) return;
    isGlobalWhatsAppTrackerInitialized = true;

    // 1. Delegated click listener on document (capture phase to run before navigation)
    document.addEventListener(
        'click',
        (event: MouseEvent) => {
            try {
                const target = event.target as Element | null;
                if (!target) return;

                const anchor = target.closest('a');
                if (anchor) {
                    const href = anchor.getAttribute('href') || anchor.href;
                    if (isWhatsAppUrl(href)) {
                        const now = Date.now();
                        // Deduplicate clicks occurring within 400ms on the same action
                        if (now - lastWhatsAppClickTime > 400) {
                            lastWhatsAppClickTime = now;
                            trackWhatsAppClick();
                        }
                    }
                }
            } catch {
                // Fail open
            }
        },
        { capture: true, passive: true }
    );

    // 2. Wrap window.open to intercept programmatic WhatsApp triggers (e.g. popups)
    try {
        const originalOpen = window.open;
        if (typeof originalOpen === 'function') {
            window.open = function (url?: string | URL, target?: string, features?: string) {
                try {
                    const urlString = typeof url === 'string' ? url : url?.toString();
                    if (isWhatsAppUrl(urlString)) {
                        const now = Date.now();
                        if (now - lastWhatsAppClickTime > 400) {
                            lastWhatsAppClickTime = now;
                            trackWhatsAppClick();
                        }
                    }
                } catch {
                    // Fail open
                }
                return originalOpen.call(this, url, target, features);
            };
        }
    } catch {
        // Fail open
    }
}

/**
 * Initializes the OpenAI Ads Measurement queue and pixel instance.
 * Safe to call multiple times (idempotent).
 */
export function initOpenAiPixel(customPixelId?: string) {
    if (typeof window === 'undefined') return;
    const pixelId = customPixelId || OPENAI_PIXEL_ID;
    if (!pixelId) return;

    window.oaiq = window.oaiq || function (...args: any[]) {
        (window.oaiq!.q = window.oaiq!.q || []).push(args);
    };

    window.oaiq('init', { pixelId });
    initGlobalWhatsAppTracker();
}

/**
 * Generic helper to send a measured event to OpenAI Ads.
 */
export function trackOpenAiEvent(
    eventName: string,
    data: Record<string, any> = {},
    options?: { event_id?: string }
) {
    if (typeof window === 'undefined' || typeof window.oaiq !== 'function') return;
    const eventId = options?.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.oaiq('measure', eventName, data, { event_id: eventId });
}

/**
 * Tracks lead conversions (modal open, contact submission, booking, whatsapp).
 * Fires standard 'lead_created' event with structured CTA attribution.
 */
export function trackConversion(ctx: CTAContext) {
    if (typeof window === 'undefined' || typeof window.oaiq !== 'function') return;
    const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.oaiq(
        'measure',
        'lead_created',
        {
            type: 'lead',
            cta_type: ctx.ctaType,
            intent: ctx.intent,
            source_page: ctx.sourcePage,
            source_section: ctx.sourceSection,
            source_article: ctx.sourceArticle,
            source_hub: ctx.sourceHub,
            source_label: ctx.sourceLabel,
            currency: 'ILS',
            ...(ctx.campaign ? { campaign: ctx.campaign } : {}),
            ...(ctx.inboundUtm?.utm_source ? { utm_source: ctx.inboundUtm.utm_source } : {}),
            ...(ctx.inboundUtm?.utm_medium ? { utm_medium: ctx.inboundUtm.utm_medium } : {}),
            ...(ctx.publicationId ? { publication_id: ctx.publicationId } : {}),
            ...(ctx.knowledgeEntityId ? { knowledge_entity_id: ctx.knowledgeEntityId } : {}),
        },
        { event_id: eventId }
    );
}

/**
 * Tracks completed purchases/orders.
 * Fires standard 'order_created' event with currency, amount, and event_id.
 */
export function trackOrder(orderData: {
    amount?: number;
    currency?: string;
    orderId?: string;
    type?: string;
    [key: string]: any;
}) {
    if (typeof window === 'undefined' || typeof window.oaiq !== 'function') return;
    const eventId = orderData.orderId || `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.oaiq(
        'measure',
        'order_created',
        {
            type: orderData.type || 'contents',
            amount: orderData.amount,
            currency: orderData.currency || 'ILS',
            ...orderData,
        },
        { event_id: eventId }
    );
}
