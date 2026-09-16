import type { Article } from '../../data/articles';
import type { Publication, PublicationStateFlags } from '../types/publication';
import { asPublicationId } from '../identity';
import { IL_MARKET } from '../config/markets/il';

/**
 * Pure, read-only projection from today's Article shape (src/data/articles.ts)
 * to the future Publication shape. NOT consumed by any runtime rendering,
 * routing, or build path in Batch 1 — it exists so later migration and
 * validation tooling has one correct, reviewable mapping to build against,
 * independent of any actual behavior change.
 *
 * Known, intentional limitation of this batch: Article has no stable ID
 * separate from `slug` (the exact gap Phase 1.5 sec.7 traced). Rather than
 * add a persisted ID field to every article record in Batch 1 — a change
 * to production data this brief explicitly asks to avoid unless
 * necessary — this projection derives a Publication ID from the current
 * slug as an honest, temporary proxy. It is stable only as long as the
 * slug is; true slug-independent Publication IDs are deferred to the
 * batch that actually needs them (a real rename, or a second Publication
 * of the same KnowledgeEntity).
 *
 * publicationStatus + indexable -> PublicationState mapping:
 *   published + indexable:true   -> 'published'
 *   published + indexable:false  -> 'published' with indexableOverride:false
 *   review    (any indexable)    -> 'review'
 *   draft     (any indexable)    -> 'draft'
 * `indexable:true` never grants publicness that `publicationStatus` denies —
 * matching Phase 2 blueprint sec.8's resolution of the contradictory
 * combinations Phase 1.5 sec.6 found technically possible today.
 */
export function deriveStateFlags(article: Article): PublicationStateFlags {
    if (article.publicationStatus === 'published') {
        return article.indexable ? { state: 'published' } : { state: 'published', indexableOverride: false };
    }
    if (article.publicationStatus === 'review') {
        return { state: 'review' };
    }
    return { state: 'draft' };
}

export function articleToPublication(article: Article): Publication {
    return {
        id: asPublicationId(article.slug),
        marketId: IL_MARKET.id,
        format: 'article',
        locale: IL_MARKET.locale,
        slug: article.slug,
        state: deriveStateFlags(article),
    };
}
