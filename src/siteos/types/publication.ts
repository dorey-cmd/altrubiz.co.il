import type { KnowledgeEntityId, MarketId, PublicationId } from '../identity';

/**
 * Publication — one market's public expression of a KnowledgeEntity.
 * 1:many capable (a KnowledgeEntity may eventually have several
 * Publications of genuinely different purpose/format/market) without
 * implying automatic duplication — most KnowledgeEntities have exactly
 * one Publication today, and Batch 1 does not create a second Publication
 * for anything.
 *
 * PublicationState collapses today's independent `publicationStatus` +
 * `indexable` fields (src/data/articles.ts) into one authoritative field.
 * Every other flag below is a PURE DERIVATION of `state` — never
 * independently settable — per Phase 2 blueprint sec.8. This module does
 * not migrate any existing Article; see
 * src/siteos/compat/articleToPublication.ts for the read-only projection.
 */
export type PublicationFormat =
    | 'article'
    | 'guide'
    | 'hub'
    | 'tool'
    | 'assessment'
    | 'calculator'
    | 'gateway';

export type PublicationState = 'internal' | 'draft' | 'review' | 'published';

export interface PublicationStateFlags {
    state: PublicationState;
    /**
     * The one legal override: withhold an otherwise-published page from
     * search indexing (e.g. thin/duplicate content) while it stays fully
     * public and present in llms/machine surfaces. Can only withhold —
     * never grants indexing to a non-published state.
     */
    indexableOverride?: false;
}

export interface Publication {
    id: PublicationId;
    knowledgeEntityId?: KnowledgeEntityId;
    marketId: MarketId;
    format: PublicationFormat;
    locale: string;
    slug: string;
    state: PublicationStateFlags;
}

export function isRoutable(flags: PublicationStateFlags): boolean {
    return flags.state === 'review' || flags.state === 'published' || flags.state === 'draft';
}

export function isPubliclyRenderable(flags: PublicationStateFlags): boolean {
    return flags.state === 'published';
}

/** Governs whether a link to this Publication may render as a live link anywhere (Phase 2 blueprint sec.12/sec.8). */
export function isPubliclyLinkable(flags: PublicationStateFlags): boolean {
    return flags.state === 'published';
}

export function isSitemapEligible(flags: PublicationStateFlags): boolean {
    return flags.state === 'published' && flags.indexableOverride !== false;
}

/** llms.txt/llms-full.txt presence tracks publicness, not search indexability — a published+indexableOverride:false page is still genuine public knowledge. */
export function isLlmSurfaceEligible(flags: PublicationStateFlags): boolean {
    return flags.state === 'published';
}

export function isMarkdownMirrorEligible(flags: PublicationStateFlags): boolean {
    return flags.state === 'published';
}

export function isSchemaEligible(flags: PublicationStateFlags): boolean {
    return flags.state === 'published';
}
