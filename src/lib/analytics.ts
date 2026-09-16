import ReactGA from 'react-ga4';
import { CTAContext } from '../types/attribution';
import { IL_MARKET } from '../siteos';

// SiteOS Phase 3: sourced from IL_MARKET.analytics (MarketConfig) instead
// of a standalone literal -- account identity is now market/environment
// configuration, not a semantic constant, so a future second market's
// events won't silently share this property (Phase 2 blueprint sec.15).
const GA_MEASUREMENT_ID = IL_MARKET.analytics.ga4MeasurementId;

export function initAnalytics() {
    if (!import.meta.env.PROD) return;
    // Disable gtag's own automatic page_view on init — SPA route changes are
    // tracked explicitly via trackPageview() so every client-side navigation
    // (not just full page loads) is captured, with no duplicate initial hit.
    ReactGA.initialize(GA_MEASUREMENT_ID, {
        gtagOptions: { send_page_view: false },
    });
}

export function trackPageview(path: string, title?: string) {
    if (!import.meta.env.PROD || !ReactGA.isInitialized) return;
    ReactGA.send({ hitType: 'pageview', page: path, title });
}

// GA4 recommended "generate_lead" event, carrying the site's existing
// structured CTA attribution (page, section, article, hub, intent, label)
// so lead sources are reportable by dimension without extra setup.
export function trackConversion(ctx: CTAContext) {
    if (!import.meta.env.PROD || !ReactGA.isInitialized) return;
    ReactGA.event('generate_lead', {
        cta_type: ctx.ctaType,
        intent: ctx.intent,
        source_page: ctx.sourcePage,
        source_section: ctx.sourceSection,
        source_article: ctx.sourceArticle,
        source_hub: ctx.sourceHub,
        source_label: ctx.sourceLabel,
        // SiteOS Phase 3: the visitor's own inbound campaign attribution
        // (captured once in conversionEngine.ts), additive -- absent for
        // any visitor who didn't arrive via a UTM-tagged link.
        ...(ctx.campaign ? { campaign: ctx.campaign } : {}),
        ...(ctx.inboundUtm?.utm_source ? { utm_source: ctx.inboundUtm.utm_source } : {}),
        ...(ctx.inboundUtm?.utm_medium ? { utm_medium: ctx.inboundUtm.utm_medium } : {}),
        ...(ctx.referrer ? { referrer: ctx.referrer } : {}),
    });
}
