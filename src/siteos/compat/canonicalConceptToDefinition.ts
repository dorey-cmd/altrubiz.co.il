import type { CanonicalConcept } from '../../data/knowledgeGraph';
import type { ConceptDefinition } from '../types/conceptDefinition';
import { asConceptId, asPublicationId } from '../identity';

/**
 * Pure, read-only projection from the existing CANONICAL_CONCEPTS registry
 * (src/data/knowledgeGraph.ts) to ConceptDefinition. This is intentionally
 * a projection, not a third representation of concept identity —
 * CanonicalConcept.id remains the single authoritative source.
 * ConceptDefinition is the shape a future inline-explanation UI
 * (tooltip/popover — explicitly NOT built in Batch 1) will consume.
 *
 * `hasApprovedPublicDestination` continues to gate whether a deeper link
 * exists, preserving NODE EXISTENCE != PUBLIC PAGE EXISTENCE exactly as
 * src/components/common/ContextualConcept.tsx already enforces it today.
 * NOT consumed by any runtime path in Batch 1.
 */
export function canonicalConceptToDefinition(concept: CanonicalConcept): ConceptDefinition {
    return {
        id: asConceptId(concept.id),
        term: concept.term,
        canonicalDefinition: concept.canonicalDefinition,
        deeperPublicationId:
            concept.hasApprovedPublicDestination && concept.publicDestinationUrl
                ? asPublicationId(concept.id)
                : undefined,
        recommendedBehavior: concept.recommendedBehavior,
    };
}
