import type { KnowledgeEntityId } from '../identity';

/**
 * KnowledgeEntity — stable, market-neutral, language-neutral semantic
 * identity representing WHAT a piece of knowledge is, never where or how
 * it is published. Extends the identity pattern KnowledgeNode.id already
 * proves in src/data/knowledgeGraph.ts (semantic identity != URL identity)
 * rather than introducing a competing model. See
 * src/siteos/compat/knowledgeNodeToEntity.ts for the projection from the
 * existing KnowledgeNode registry.
 */
export type KnowledgeEntityKind = 'article' | 'hub' | 'concept' | 'pain' | 'tool';

export interface KnowledgeEntityTaxonomy {
    processes: string[];
    channels: string[];
    technologies: string[];
    businessObjects: string[];
    outcomes: string[];
}

export interface KnowledgeEntityRelationships {
    parentHubEntityId?: KnowledgeEntityId;
    relatedEntityIds: KnowledgeEntityId[];
    conceptIds: KnowledgeEntityId[];
}

export interface KnowledgeEntity {
    id: KnowledgeEntityId;
    kind: KnowledgeEntityKind;
    primaryPainId?: string;
    taxonomy: KnowledgeEntityTaxonomy;
    relationships: KnowledgeEntityRelationships;
    maturity: 'canonical' | 'maturing' | 'emerging';
    dateCreated: string;
    dateUpdated: string;
}
