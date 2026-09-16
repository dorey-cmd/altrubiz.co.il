import { CTAContext } from '../types/attribution';
import { IL_MARKET } from '../siteos';

const INBOUND_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/**
 * CAPTURE stage (SiteOS Phase 3 attribution unification, Step 11): reads
 * the visitor's OWN inbound UTM parameters and referrer from the current
 * URL, once. This is intentionally separate from buildAttributedIframeUrl
 * below, which builds AltruBiz's own OUTBOUND attribution toward GHL
 * (utm_source='altrubiz_web' etc.) -- the two must never be conflated:
 * one describes where the visitor came from, the other describes which
 * internal system handed the lead to GHL.
 *
 * Safe to call in any environment (returns empty values outside a
 * browser, e.g. during a build/SSR-adjacent script execution).
 */
export function captureInboundAttribution(): { inboundUtm?: Record<string, string>; referrer?: string } {
    if (typeof window === 'undefined') return {};

    const inboundUtm: Record<string, string> = {};
    try {
        const params = new URLSearchParams(window.location.search);
        for (const key of INBOUND_UTM_KEYS) {
            const value = params.get(key);
            if (value) inboundUtm[key] = value;
        }
    } catch {
        // no-op: malformed query string, leave inboundUtm empty
    }

    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;

    return {
        inboundUtm: Object.keys(inboundUtm).length > 0 ? inboundUtm : undefined,
        referrer
    };
}

/**
 * Builds an attributed URL for GoHighLevel form or booking widgets.
 * GoHighLevel iframes parse and absorb standard UTM and query parameters:
 * utm_source, utm_medium, utm_campaign, utm_content, utm_term, and custom query params.
 */
export function buildAttributedIframeUrl(baseUrl: string, attribution?: CTAContext): string {
    if (!attribution) return baseUrl;

    try {
        const url = new URL(baseUrl);
        
        url.searchParams.set('utm_source', 'altrubiz_web');
        
        if (attribution.sourcePage) {
            url.searchParams.set('source_page', attribution.sourcePage);
        }
        if (attribution.ctaType) {
            url.searchParams.set('utm_medium', attribution.ctaType);
        }
        if (attribution.sourceTopic || attribution.sourceNode || attribution.sourceHub) {
            url.searchParams.set('utm_campaign', attribution.sourceTopic || attribution.sourceNode || attribution.sourceHub || 'general');
        }
        if (attribution.sourceSection) {
            url.searchParams.set('utm_content', attribution.sourceSection);
        }
        if (attribution.sourceArticle) {
            url.searchParams.set('source_article', attribution.sourceArticle);
        }
        if (attribution.intent) {
            url.searchParams.set('intent', attribution.intent);
        }
        if (attribution.sourceLabel) {
            url.searchParams.set('source_label', attribution.sourceLabel);
        }

        return url.toString();
    } catch {
        return baseUrl;
    }
}

/**
 * Builds an attributed WhatsApp URL with contextual prefill text.
 * Supports both signatures:
 * - buildAttributedWhatsAppUrl(baseText, attribution, phone)
 * - buildAttributedWhatsAppUrl(phone, baseText, attribution)
 */
export function buildAttributedWhatsAppUrl(
    arg1: string = 'שלום צוות AltruBiz, אשמח להתייעץ',
    arg2?: CTAContext | string,
    arg3?: CTAContext | string
): string {
    // SiteOS Phase 3: default phone sourced from IL_MARKET (MarketConfig),
    // verified equal to the prior hardcoded literal. Every current call
    // site that doesn't explicitly pass a phone (ArticlePage.tsx,
    // HubPage.tsx, RoiCalculatorPage.tsx, RoiCalculatorTool.tsx) relies on
    // this single default, so fixing it here covers all of them at once.
    let phone = IL_MARKET.contactChannels.whatsapp;
    let baseText = 'שלום צוות AltruBiz, אשמח להתייעץ';
    let attribution: CTAContext | undefined;

    if (typeof arg2 === 'string') {
        // Called as (phone, baseText, attribution)
        phone = arg1;
        baseText = arg2;
        attribution = arg3 as CTAContext | undefined;
    } else {
        // Called as (baseText, attribution, phone)
        baseText = arg1;
        attribution = arg2;
        if (typeof arg3 === 'string') {
            phone = arg3;
        }
    }

    let finalPrefill = baseText.trim();
    
    // Add lightweight contextual attribution tag if source is specific
    if (attribution?.sourcePage && attribution.sourcePage !== '/') {
        const sourceRef = attribution.sourceArticle || attribution.sourceHub || attribution.sourceSection || attribution.sourcePage;
        finalPrefill = `${finalPrefill} (מתוך: ${sourceRef})`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(finalPrefill)}`;
}
