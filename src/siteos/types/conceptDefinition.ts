import type { ConceptId, KnowledgeEntityId, PublicationId } from '../identity';

/**
 * ConceptDefinition — a reusable semantic definition for a term that may
 * need in-context explanation (e.g. "Pipeline", "Lead Scoring", "Unified
 * Inbox"). NODE EXISTENCE != PUBLIC PAGE EXISTENCE is preserved exactly as
 * today's CANONICAL_CONCEPTS/ContextualConcept.tsx already enforce it: a
 * ConceptDefinition is never automatically a public page.
 *
 * This is a projection target for the existing CANONICAL_CONCEPTS
 * registry (src/data/knowledgeGraph.ts), not a third, competing
 * representation of concept identity — see
 * src/siteos/compat/canonicalConceptToDefinition.ts.
 *
 * Batch 1 scope: model only. No tooltip/popover/drawer/inline-injection
 * UI is implemented anywhere in this batch.
 */
export interface ConceptDefinition {
    id: ConceptId;
    knowledgeEntityId?: KnowledgeEntityId;
    term: string;
    canonicalDefinition: string;
    /** Present only when the concept has an approved deeper Publication to link to (mirrors hasApprovedPublicDestination). */
    deeperPublicationId?: PublicationId;
    recommendedBehavior: 'contextual_link' | 'progressive_definition';
}
