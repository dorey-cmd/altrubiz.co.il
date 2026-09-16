/**
 * SiteOS Foundational Identity Types — Phase 3 Batch 1
 *
 * Stable, market-neutral identifier primitives introduced by the Phase 2
 * blueprint (Knowledge != Publication != Market != Presentation). Pure
 * type-level branding, zero runtime behavior. Nothing under src/siteos/
 * is imported by any existing rendering, routing, build, or validation
 * code path in this batch — see
 * .agents/specs/siteos-foundation-architecture.md for scope and rationale.
 */

declare const brand: unique symbol;
type Branded<T, B extends string> = T & { readonly [brand]: B };

export type MarketId = Branded<string, 'MarketId'>;
export type KnowledgeEntityId = Branded<string, 'KnowledgeEntityId'>;
export type PublicationId = Branded<string, 'PublicationId'>;
export type ToolId = Branded<string, 'ToolId'>;
export type ConceptId = Branded<string, 'ConceptId'>;
export type CtaPlacementId = Branded<string, 'CtaPlacementId'>;

export function asMarketId(value: string): MarketId {
    return value as MarketId;
}

export function asKnowledgeEntityId(value: string): KnowledgeEntityId {
    return value as KnowledgeEntityId;
}

export function asPublicationId(value: string): PublicationId {
    return value as PublicationId;
}

export function asToolId(value: string): ToolId {
    return value as ToolId;
}

export function asConceptId(value: string): ConceptId {
    return value as ConceptId;
}

export function asCtaPlacementId(value: string): CtaPlacementId {
    return value as CtaPlacementId;
}
