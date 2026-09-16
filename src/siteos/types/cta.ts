import type { CtaPlacementId, PublicationId, ToolId } from '../identity';
import type { CTAIntent, CTAType } from '../../types/attribution';

/**
 * CTA foundation types — Phase 3 Batch 1.
 *
 * Establishes Goal / Action / Mechanism / Placement / Variant as distinct
 * dimensions; collapsing them into one field is explicitly disallowed per
 * the Phase 3 brief sec.10-12. This module does NOT replace or rewire the
 * existing CTAContext/ConversionContext model
 * (src/types/attribution.ts, src/types/conversion.ts,
 * src/lib/conversionEngine.ts) — no existing CTA component is touched in
 * this batch. It defines the forward-compatible shape those will be able
 * to grow into, and every CtaPlacement carries an explicit bridge back to
 * today's CTAType/CTAIntent vocabulary so the two models can coexist
 * during migration.
 */

/** THE BUSINESS OBJECTIVE behind a CTA. */
export type CtaGoal =
    | 'lead_generation'
    | 'direct_sale'
    | 'consultation'
    | 'request_help'
    | 'sales_enablement'
    | 'lead_nurture'
    | 'qualification'
    | 'product_adoption'
    | 'tool_engagement'
    | 'assessment'
    | 'knowledge_continuation'
    | 'education'
    | 'conversion_assist';

/** WHAT the visitor is asked to do. */
export type CtaAction =
    | 'open_contact'
    | 'open_whatsapp'
    | 'book_meeting'
    | 'start_checkout'
    | 'open_tool'
    | 'run_assessment'
    | 'open_roi_calculator'
    | 'continue_reading'
    | 'explain_concept'
    | 'view_related_knowledge'
    | 'request_help';

/** HOW the action is technically executed. */
export type CtaMechanism =
    | 'modal'
    | 'internal_route'
    | 'external_url'
    | 'ghl_form'
    | 'ghl_calendar'
    | 'checkout'
    | 'embedded_tool'
    | 'inline_knowledge_interaction'
    | 'whatsapp_deep_link';

/**
 * WHERE a CTA appears on a page. A page may carry many CtaPlacements; the
 * same goal may recur with different placements/variants (Phase 3 brief
 * sec.11-12) — nothing here forces a single page-level CTA.
 */
export interface CtaPlacement {
    id: CtaPlacementId;
    goal: CtaGoal;
    action: CtaAction;
    mechanism: CtaMechanism;
    /** Free-form editorial location label, e.g. 'hero', 'mid-article', 'sidebar', 'bottom-banner'. */
    location: string;
    /** Bridge to today's live attribution vocabulary — required for any future migration adapter, not used by existing code in Batch 1. */
    legacyCtaType?: CTAType;
    legacyIntent?: CTAIntent;
}

/** HOW a placement is presented — copy/visual layer, left fully to Antigravity. */
export interface CtaVariant {
    placementId: CtaPlacementId;
    message: {
        title?: string;
        description?: string;
        buttonText?: string;
    };
    /** Free-form presentation hint (box/strip/inline/banner/etc.) — intentionally unconstrained; Antigravity retains full visual freedom. */
    presentationHint?: string;
}

/** The stable thing a CtaPlacement ultimately resolves to. */
export interface CtaDestination {
    kind: 'publication' | 'tool' | 'commercial';
    publicationId?: PublicationId;
    toolId?: ToolId;
    /** For 'commercial' destinations — resolved via MarketConfig, never hardcoded per-placement. */
    commercialChannel?: 'booking' | 'contact' | 'pricing' | 'whatsapp';
}
