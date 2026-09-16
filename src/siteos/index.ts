/**
 * SiteOS Foundational Architecture — Phase 3 Batch 1
 *
 * Purely additive type/config/compat layer introduced per the Phase 2
 * blueprint (Knowledge != Publication != Market != Presentation). Nothing
 * under src/siteos/ is imported by any existing rendering, routing,
 * build, or validation code path in this batch. See
 * .agents/specs/siteos-foundation-architecture.md for scope, rationale,
 * and the intended migration sequencing into Batch 2+.
 */
export * from './identity';
export * from './types/knowledgeEntity';
export * from './types/publication';
export * from './types/toolNode';
export * from './types/conceptDefinition';
export * from './types/cta';
export * from './config/marketConfig';
export * from './config/markets/il';
export * from './config/tools';
export * from './config/gateway';
export * from './compat/articleToPublication';
export * from './compat/knowledgeNodeToEntity';
export * from './compat/canonicalConceptToDefinition';
