import type { KnowledgeEntityId, MarketId, ToolId } from '../identity';

/**
 * ToolNode — a first-class interactive SiteOS knowledge surface (ROI
 * Calculator, AGA/Growth Analyzer, future assessments/simulators). Tools
 * are not external side applications; they are intended to participate in
 * the same Knowledge Graph, canonical, structured-data, and CTA
 * architecture as any other Publication (Phase 2 blueprint sec.3/19 of the
 * Phase 3 brief). This interface establishes that boundary only — Batch 1
 * does not migrate, rewire, or rewrite the ROI Calculator or AGA.
 *
 * `governance` mirrors the standalone-public-tool governance boundary
 * (Phase 2 blueprint sec.19): every tool-shaped public surface must
 * declare one of these statuses so a page-producing file can never sit
 * outside SiteOS governance silently again (the public/aga/ finding).
 */
export type ToolKind = 'calculator' | 'assessment' | 'diagnostic' | 'simulator';

export type ToolGovernanceStatus = 'governed' | 'private' | 'experiment' | 'legacy';

export interface ToolNode {
    id: ToolId;
    kind: ToolKind;
    marketId?: MarketId;
    knowledgeEntityId?: KnowledgeEntityId;
    governance: ToolGovernanceStatus;
}
