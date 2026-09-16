#!/usr/bin/env node

/**
 * SiteOS Identity & Publication Architecture Validator (Phase 3 Batch 2)
 *
 * Verifies that every existing Article / KnowledgeNode / CanonicalConcept
 * genuinely participates in the SiteOS Publication / KnowledgeEntity /
 * ConceptDefinition architecture (src/siteos/) against REAL production
 * data — i.e. that the projection layer introduced in Batch 1 is now
 * live, not dormant. Strictly read-only: never modifies data, only
 * reports. Run with: npm run test:siteos-identity
 */

const routesLoader = require('./routes-loader.cjs');
const { loadSiteOS } = require('./siteos-loader.cjs');

console.log('\n========================================================');
console.log('   AltruBiz SiteOS Identity & Publication Architecture   ');
console.log('========================================================\n');

let passed = 0;
let failed = 0;

function pass(msg) {
    passed++;
    console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function fail(msg) {
    failed++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

const siteos = loadSiteOS();
const articles = routesLoader.getArticles();
const hubs = routesLoader.getAllHubs();
const concepts = routesLoader.CANONICAL_CONCEPTS;

console.log('1. Auditing Article -> Publication participation...');
const publicationIds = new Set();
let missingId = 0;
for (const article of articles) {
    if (!article.id) {
        missingId++;
        continue;
    }
    if (publicationIds.has(article.id)) {
        fail(`Duplicate Publication id: "${article.id}" (article "${article.slug}")`);
    }
    publicationIds.add(article.id);
}
if (missingId === 0) {
    pass(`All ${articles.length} articles carry a persisted, stable Publication id.`);
} else {
    fail(`${missingId} article(s) missing a persisted Publication id.`);
}

let projectionErrors = 0;
for (const article of articles) {
    try {
        const pub = siteos.articleToPublication(article);
        if (pub.id !== article.id) {
            fail(`articleToPublication("${article.slug}") did not use the persisted id (got "${pub.id}", expected "${article.id}")`);
            projectionErrors++;
        }
    } catch (e) {
        fail(`articleToPublication threw for "${article.slug}": ${e.message}`);
        projectionErrors++;
    }
}
if (projectionErrors === 0) {
    pass(`articleToPublication() runs live against all ${articles.length} real articles and preserves persisted identity.`);
}

console.log('\n2. Auditing PublicationState derivation consistency...');
const stateCounts = { published: 0, review: 0, draft: 0, internal: 0 };
let contradictions = 0;
for (const article of articles) {
    const flags = siteos.deriveStateFlags(article);
    stateCounts[flags.state] = (stateCounts[flags.state] || 0) + 1;
    const legacyIndexable = article.publicationStatus === 'published' && article.indexable === true;
    const derivedIndexable = flags.state === 'published' && flags.indexableOverride !== false;
    if (legacyIndexable !== derivedIndexable) {
        fail(`State derivation mismatch for "${article.slug}": legacy isIndexable=${legacyIndexable}, derived=${derivedIndexable}`);
        contradictions++;
    }
}
if (contradictions === 0) {
    pass(`PublicationState derivation agrees with legacy publicationStatus+indexable for all ${articles.length} articles (published:${stateCounts.published}, review:${stateCounts.review}, draft:${stateCounts.draft}).`);
}

console.log('\n3. Auditing KnowledgeNode -> KnowledgeEntity participation...');
const entityIds = new Set();
let hubProjectionErrors = 0;
for (const hub of hubs) {
    try {
        const entity = siteos.knowledgeNodeToEntity(hub);
        if (entity.id !== hub.id) {
            fail(`knowledgeNodeToEntity("${hub.slug}") did not reuse KnowledgeNode.id as-is (got "${entity.id}", expected "${hub.id}")`);
            hubProjectionErrors++;
        }
        if (entityIds.has(entity.id)) {
            fail(`Duplicate KnowledgeEntity id: "${entity.id}"`);
            hubProjectionErrors++;
        }
        entityIds.add(entity.id);
    } catch (e) {
        fail(`knowledgeNodeToEntity threw for "${hub.slug}": ${e.message}`);
        hubProjectionErrors++;
    }
}
if (hubProjectionErrors === 0) {
    pass(`knowledgeNodeToEntity() runs live against all ${hubs.length} public hubs, reusing KnowledgeNode.id as the single authoritative identity (no competing identity system introduced).`);
}

console.log('\n4. Auditing CanonicalConcept -> ConceptDefinition participation (State A/B preserved)...');
let conceptErrors = 0;
let stateA = 0;
let stateB = 0;
const conceptKeys = Object.keys(concepts);
for (const key of conceptKeys) {
    const concept = concepts[key];
    try {
        const def = siteos.canonicalConceptToDefinition(concept);
        if (def.id !== concept.id) {
            fail(`canonicalConceptToDefinition("${key}") identity drift (got "${def.id}", expected "${concept.id}")`);
            conceptErrors++;
        }
        const hasDeep = !!def.deeperPublicationId;
        const shouldHaveDeep = !!(concept.hasApprovedPublicDestination && concept.publicDestinationUrl);
        if (hasDeep !== shouldHaveDeep) {
            fail(`canonicalConceptToDefinition("${key}") deeperPublicationId disagrees with hasApprovedPublicDestination (NODE EXISTENCE != PUBLIC PAGE EXISTENCE violated)`);
            conceptErrors++;
        }
        if (hasDeep) stateA++; else stateB++;
    } catch (e) {
        fail(`canonicalConceptToDefinition threw for "${key}": ${e.message}`);
        conceptErrors++;
    }
}
if (conceptErrors === 0) {
    pass(`canonicalConceptToDefinition() runs live against all ${conceptKeys.length} canonical concepts (State A/public: ${stateA}, State B/definition-only: ${stateB}), preserving NODE EXISTENCE != PUBLIC PAGE EXISTENCE.`);
}

console.log('\n========================================================');
console.log(`SiteOS Identity Audit: ${passed} passed, ${failed} failed`);
console.log('========================================================\n');

if (failed > 0) {
    console.error('\x1b[31m✖ SiteOS identity/publication architecture audit FAILED.\x1b[0m');
    process.exit(1);
} else {
    console.log('\x1b[32m✔ SiteOS Publication/KnowledgeEntity/ConceptDefinition architecture is live against all real production data.\x1b[0m');
}
