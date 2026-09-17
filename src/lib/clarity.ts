import Clarity from '@microsoft/clarity';
import { CTAContext } from '../types/attribution';
import { IL_MARKET } from '../siteos';
import { hasAnalyticsConsent, onAnalyticsConsentGranted } from './consent';

// SiteOS Phase 3: sourced from IL_MARKET.analytics (MarketConfig) -- see
// the matching note in src/lib/analytics.ts.
const CLARITY_PROJECT_ID = IL_MARKET.analytics.clarityProjectId;

// Microsoft Clarity records session replay / heatmap data, so -- like GA4 --
// it only ever loads after the visitor explicitly opts in via the cookie
// consent banner, never by default on page load. See src/lib/consent.ts.
export function initClarity() {
    if (!import.meta.env.PROD) return;
    onAnalyticsConsentGranted(() => Clarity.init(CLARITY_PROJECT_ID));
}

// Tags the session with CTA attribution, marks it a conversion event, and
// upgrades it for priority retention/replay in the Clarity dashboard.
export function trackConversion(ctx: CTAContext) {
    if (!import.meta.env.PROD || !hasAnalyticsConsent()) return;
    Clarity.setTag('cta_type', ctx.ctaType);
    if (ctx.intent) Clarity.setTag('cta_intent', ctx.intent);
    Clarity.setTag('source_page', ctx.sourcePage);
    // SiteOS Phase 3: stable semantic identity, when already resolved.
    if (ctx.publicationId) Clarity.setTag('publication_id', ctx.publicationId);
    if (ctx.knowledgeEntityId) Clarity.setTag('knowledge_entity_id', ctx.knowledgeEntityId);
    Clarity.event('generate_lead');
    Clarity.upgrade('lead_conversion');
}
