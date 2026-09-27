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
