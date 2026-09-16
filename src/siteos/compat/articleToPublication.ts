import type { Article } from '../../data/articles';
import type { Publication, PublicationStateFlags } from '../types/publication';
import { asPublicationId } from '../identity';
import { IL_MARKET } from '../config/markets/il';

/**
 * Pure, read-only projection from today's Article shape (src/data/articles.ts)
 * to the future Publication shape. Called live, against real production
 * data, by scripts/validate-siteos-identity.cjs (Phase 3 Batch 2) — this
 * is no longer a dormant type layer. It is still not consumed by any
 * rendering/routing/build path that affects the live site.
 *
 * Identity: every article in ARTICLES now carries a persisted, stable
 * `id` field (Phase 3 Batch 2 — closed the gap Phase 1.5 sec.7 traced),
 * assigned once and never recomputed from slug. This projection uses that
 * persisted id as the Publication id whenever present, and falls back to
 * a slug-derived id only as a defensive default for any future article
 * that is inserted without one (which should not happen — new articles
 * should always be given a real id at ingestion).
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
        id: asPublicationId(article.id ?? article.slug),
        marketId: IL_MARKET.id,
        format: 'article',
        locale: IL_MARKET.locale,
        slug: article.slug,
        state: deriveStateFlags(article),
    };
}
