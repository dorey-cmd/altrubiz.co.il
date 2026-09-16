import type { KnowledgeNode, NodeType } from '../../data/knowledgeGraph';
import type { KnowledgeEntity, KnowledgeEntityKind } from '../types/knowledgeEntity';
import { asKnowledgeEntityId } from '../identity';

/**
 * Pure, read-only projection from the existing KnowledgeNode registry
 * (src/data/knowledgeGraph.ts) to the future KnowledgeEntity shape.
 * `KnowledgeNode.id` is preserved as-is and reused directly as the
 * KnowledgeEntityId — this is deliberately NOT a competing identity
 * system; it is the same stable, URL-independent id KnowledgeNode already
 * provides, given a market-neutral wrapper shape. NOT consumed by any
 * runtime path in Batch 1.
 *
 * Known, intentional limitation: `relatedArticleSlugs` and
 * `parentHubSlug` are stored as slugs today, not stable ids, because
 * articles have no id separate from slug yet (see
 * compat/articleToPublication.ts). This projection maps them through the
 * same slug-as-temporary-id convention for consistency; both compat
 * modules will need to move together once a real persisted article id
 * exists.
 *
 * NodeType consolidation (11 of 14 values currently have zero instances,
 * per Phase 1.5 sec.5) is proposed, not performed, in Phase 2 blueprint
 * sec.11. This mapper is conservative: it maps every currently-live type
 * correctly and falls back to 'hub' only for the uninstantiated values,
 * which should be revisited before any of them gain real data.
 */
function mapNodeTypeToKind(nodeType: NodeType): KnowledgeEntityKind {
    if (nodeType === 'pain_hub' || nodeType === 'micro_hub') return 'hub';
    if (nodeType === 'concept') return 'concept';
    if (nodeType === 'assessment') return 'tool';
    if (nodeType === 'article' || nodeType === 'guide') return 'article';
    return 'hub';
}

export function knowledgeNodeToEntity(node: KnowledgeNode): KnowledgeEntity {
    return {
        id: asKnowledgeEntityId(node.id),
        kind: mapNodeTypeToKind(node.nodeType),
        primaryPainId: node.primaryPain,
        taxonomy: {
            processes: node.processes,
            channels: node.channels,
            technologies: node.technologies,
            businessObjects: node.businessObjects,
            outcomes: node.outcomes,
        },
        relationships: {
            parentHubEntityId: node.parentHubSlug ? asKnowledgeEntityId(node.parentHubSlug) : undefined,
            relatedEntityIds: (node.relatedArticleSlugs ?? []).map(asKnowledgeEntityId),
            conceptIds: [],
        },
        maturity: node.maturity,
        dateCreated: node.dateCreated,
        dateUpdated: node.dateUpdated,
    };
}
