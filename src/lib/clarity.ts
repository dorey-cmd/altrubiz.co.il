import Clarity from '@microsoft/clarity';
import { CTAContext } from '../types/attribution';

const CLARITY_PROJECT_ID = 'yj55u92ks2';

export function initClarity() {
    if (!import.meta.env.PROD) return;
    Clarity.init(CLARITY_PROJECT_ID);
}

// Tags the session with CTA attribution, marks it a conversion event, and
// upgrades it for priority retention/replay in the Clarity dashboard.
export function trackConversion(ctx: CTAContext) {
    if (!import.meta.env.PROD) return;
    Clarity.setTag('cta_type', ctx.ctaType);
    if (ctx.intent) Clarity.setTag('cta_intent', ctx.intent);
    Clarity.setTag('source_page', ctx.sourcePage);
    Clarity.event('generate_lead');
    Clarity.upgrade('lead_conversion');
}
