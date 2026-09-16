import type { ToolNode } from '../types/toolNode';
import { asToolId } from '../identity';
import { IL_MARKET } from './markets/il';

/**
 * ToolNode registry — Phase 3 Batch 2, Definition of Done #5 / brief Step 11.
 *
 * Gives the two real, currently-live interactive tools an explicit SiteOS
 * identity and governance status. This is identity/metadata only: it does
 * NOT add either tool to the route registry, does NOT change routing,
 * sitemap, robots, or rendering behavior for either surface, and does NOT
 * rewrite AGA into the React app. See the Batch 2 final report for the
 * explicit reasoning on why each governance status was chosen.
 */
export const ROI_CALCULATOR_TOOL: ToolNode = {
    id: asToolId('roi-calculator'),
    kind: 'calculator',
    marketId: IL_MARKET.id,
    // 'governed' is accurate today: the ROI Calculator is already a real
    // route in src/lib/routes.ts (STATIC_ROUTES_REGISTRY['/roi-calculator']),
    // already carries canonical/Schema.org/sitemap treatment via the
    // existing SEOHead.tsx + generate-sitemap.cjs pipeline.
    governance: 'governed',
};

export const AGA_TOOL: ToolNode = {
    id: asToolId('aga-growth-analyzer'),
    kind: 'assessment',
    marketId: IL_MARKET.id,
    // 'experiment' is the honest status, not 'governed': this record gives
    // AGA a real, addressable SiteOS identity, but public/aga/index.html
    // itself is still a standalone static app outside routes.ts, the
    // sitemap, and SEOHead.tsx — none of that changed in this batch (see
    // Phase 1.5's public/aga/ findings). Promoting this to 'governed'
    // is future work: registering a real route, canonical, and Schema
    // for it (or migrating its implementation), which is explicitly out
    // of scope here as a "risky rewrite."
    governance: 'experiment',
};

export const TOOL_NODES: ToolNode[] = [ROI_CALCULATOR_TOOL, AGA_TOOL];
