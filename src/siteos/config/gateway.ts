import type { Publication, PublicationStateFlags } from '../types/publication';
import { asPublicationId } from '../identity';
import { IL_MARKET } from './markets/il';

/**
 * Gateway Publication — Phase 3 Batch 2, Definition of Done #6 / brief
 * Step 10. Gives the Homepage an explicit SiteOS identity as a
 * market-specific top-level entry point (`format: 'gateway'`), per the
 * Phase 2 blueprint's Gateway Publication concept.
 *
 * This is identity/metadata only. It does NOT redesign, rewrite, or
 * reroute the Homepage — src/App.tsx's homepage render branch and
 * STATIC_ROUTES_REGISTRY['/'] in src/lib/routes.ts are untouched. It
 * exists so a future market's homepage is representable as its own
 * Gateway Publication (a different marketId, a different canonical
 * domain) rather than a structural fork of the app.
 */
const GATEWAY_STATE: PublicationStateFlags = { state: 'published' };

export const IL_GATEWAY_PUBLICATION: Publication = {
    id: asPublicationId('gateway_il'),
    marketId: IL_MARKET.id,
    format: 'gateway',
    locale: IL_MARKET.locale,
    slug: '',
    state: GATEWAY_STATE,
};
