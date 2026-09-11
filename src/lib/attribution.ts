import { CTAContext } from '../types/attribution';

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
    let phone = '972544350000';
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
