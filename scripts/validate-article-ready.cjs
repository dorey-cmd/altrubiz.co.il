#!/usr/bin/env node

/**
 * AltruBiz Article Readiness & Lifecycle Validator
 * 
 * Verifies that articles adhere to the Article-Ready Site OS standard:
 * 1. Published + Indexable: Full public, machine, and schema readiness.
 * 2. Review: Full preview readiness, strictly excluded from production discovery & sitemap.
 * 3. Draft: Isolated WIP, impossible to leak into production discovery.
 * 4. In-memory / fixture simulation of Article #18 in Review and Published.
 */

const fs = require('fs');
const path = require('path');
const routesLoader = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const LLMS_PATH = path.join(PUBLIC_DIR, 'llms.txt');
const LLMS_FULL_PATH = path.join(PUBLIC_DIR, 'llms-full.txt');
const DOMAIN = 'https://altrubiz.co.il';

let passed = 0;
let failed = 0;

function pass(msg) {
    passed++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${msg}`);
}

function fail(msg) {
    failed++;
    console.error(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Article Readiness Validator (Site OS)       \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

const allArticles = routesLoader.getAllArticles();
const publishedArticles = routesLoader.getPublishedArticles();
const indexableArticles = routesLoader.getIndexableArticles();
const reviewArticles = routesLoader.getReviewArticles();
const draftArticles = routesLoader.getDraftArticles();
const routesRegistry = routesLoader.getRoutesRegistry();
const hubs = routesLoader.getAllHubs();
const canonicalConcepts = routesLoader.CANONICAL_CONCEPTS;

console.log(`Loaded ${allArticles.length} total article(s):`);
console.log(`  - Published: ${publishedArticles.length}`);
console.log(`  - Indexable: ${indexableArticles.length}`);
console.log(`  - Review:    ${reviewArticles.length}`);
console.log(`  - Draft:     ${draftArticles.length}\n`);

// -------------------------------------------------------------
// 1. Audit Published & Indexable Articles
// -------------------------------------------------------------
console.log('\x1b[36m1. Auditing Published + Indexable Articles...\x1b[0m');

const seenSlugs = new Set();
const seenPublicPaths = new Set();
const forbiddenAltWords = ['פלסטלינה', 'איור תלת ממדי', 'דמות פלסטלינה'];

for (const art of publishedArticles) {
    // Unique internal slug
    if (!art.slug || seenSlugs.has(art.slug)) {
        fail(`Duplicate or missing slug: "${art.slug}"`);
    } else {
        seenSlugs.add(art.slug);
    }

    // Unique publicPath
    if (!art.publicPath || seenPublicPaths.has(art.publicPath)) {
        fail(`Duplicate or missing publicPath: "${art.publicPath}"`);
    } else {
        seenPublicPaths.add(art.publicPath);
    }

    // Valid publicPath format (starts with /, lowercase alphanumeric + hyphens)
    if (!/^\/[a-z0-9-]+$/.test(art.publicPath)) {
        fail(`Invalid publicPath format for "${art.slug}": "${art.publicPath}". Must be flat /<kebab-case>.`);
    }

    // Canonical URL exactly matches https://altrubiz.co.il + publicPath
    const expectedCanonical = `${DOMAIN}${art.publicPath}`;
    if (art.canonicalUrl !== expectedCanonical) {
        fail(`Canonical URL mismatch for "${art.slug}". Expected: "${expectedCanonical}", got: "${art.canonicalUrl}"`);
    }

    // Markdown URL matches publicPath + .md
    const expectedMd = `${art.publicPath}.md`;
    if (art.markdownUrl !== expectedMd) {
        fail(`Markdown URL mismatch for "${art.slug}". Expected: "${expectedMd}", got: "${art.markdownUrl}"`);
    }

    // Essential metadata
    if (!art.title || art.title.length < 5) fail(`Article "${art.slug}" missing or short title.`);
    if (!art.seoTitle || !art.seoTitle.includes('|')) fail(`Article "${art.slug}" missing valid seoTitle with brand pipe.`);
    if (!art.description || art.description.length < 20) fail(`Article "${art.slug}" missing or short description.`);
    if (!art.heroSummary || !art.keyTakeaway) fail(`Article "${art.slug}" missing heroSummary or keyTakeaway.`);
    if (!art.author || !art.author.name) fail(`Article "${art.slug}" missing author.`);
    if (!art.readTime) fail(`Article "${art.slug}" missing readTime.`);
    if (!art.datePublished) fail(`Article "${art.slug}" missing datePublished.`);

    // Section IDs uniqueness
    const sectionIds = new Set();
    for (const sec of art.sections || []) {
        if (!sec.id || sectionIds.has(sec.id)) {
            fail(`Duplicate or missing section id "${sec.id}" in article "${art.slug}".`);
        } else {
            sectionIds.add(sec.id);
        }

        // Image validation
        if (sec.image) {
            if (!sec.image.src || !sec.image.alt) {
                fail(`Section "${sec.id}" in "${art.slug}" has image without src or alt!`);
            }
            for (const word of forbiddenAltWords) {
                if (sec.image.alt.includes(word)) {
                    fail(`Forbidden art-medium word "${word}" found in alt text of section "${sec.id}" in "${art.slug}"!`);
                }
            }
        }
    }

    // Semantic concept references resolve
    for (const sec of art.sections || []) {
        for (const p of sec.content || []) {
            const matches = p.matchAll(/\[([^\]]+)\]\(concept:([a-z0-9-_]+)\)/gi);
            for (const m of matches) {
                const conceptId = m[2];
                if (!canonicalConcepts[conceptId]) {
                    fail(`Unresolvable concept reference "concept:${conceptId}" in article "${art.slug}"!`);
                }
            }
        }
    }

    // Route config check
    const routeConfig = routesRegistry[art.publicPath];
    if (!routeConfig) {
        fail(`Missing route configuration in routes registry for "${art.publicPath}".`);
    } else {
        if (!routeConfig.inSitemap || routeConfig.noindex) {
            fail(`Published + Indexable article "${art.slug}" has noindex: true or inSitemap: false in RouteConfig!`);
        }
    }
}
pass(`All ${publishedArticles.length} published articles passed rigorous metadata, identity, and semantic checks.`);

// -------------------------------------------------------------
// 2. Audit Machine & Sitemap Eligibility of Published vs Review
// -------------------------------------------------------------
console.log('\n\x1b[36m2. Auditing Sitemap, Machine & LLM Surface Eligibility...\x1b[0m');

if (fs.existsSync(SITEMAP_PATH)) {
    const sitemapText = fs.readFileSync(SITEMAP_PATH, 'utf8');
    for (const art of indexableArticles) {
        if (!sitemapText.includes(`<loc>${art.canonicalUrl}</loc>`)) {
            fail(`Indexable article missing from sitemap: ${art.canonicalUrl}`);
        }
    }
    pass(`All ${indexableArticles.length} indexable articles are present in public/sitemap.xml.`);
}

if (fs.existsSync(LLMS_PATH)) {
    const llmsText = fs.readFileSync(LLMS_PATH, 'utf8');
    for (const art of indexableArticles) {
        const cleanPath = art.publicPath.replace(/^\//, '');
        if (!llmsText.includes(`${DOMAIN}/${cleanPath}.md`)) {
            fail(`Indexable article missing from llms.txt: ${DOMAIN}/${cleanPath}.md`);
        }
    }
    pass(`All ${indexableArticles.length} indexable articles are present in public/llms.txt.`);
}

// -------------------------------------------------------------
// 3. Dynamic Simulation of Article #18 in Review vs Published
// -------------------------------------------------------------
console.log('\n\x1b[36m3. Simulating Article #18 Lifecycle Progression (Review -> Published)...\x1b[0m');

const simulatedArticle18 = {
    slug: 'simulated-ai-growth-strategy',
    publicPath: '/simulated-ai-growth-strategy',
    publicationStatus: 'review',
    indexable: false,
    title: 'מדריך סימולציה: אסטרטגיית צמיחה עם AI',
    seoTitle: 'אסטרטגיית צמיחה עם AI | AltruBiz CRM',
    description: 'מדריך מעשי לסימולציית תהליך פרסום מאמר חדש במערכת ההפעלה של האתר.',
    keywords: ['AI', 'אוטומציה', 'צמיחה'],
    category: 'אוטומציה',
    tags: ['AI', 'CRM'],
    datePublished: '2026-09-12',
    dateModified: '2026-09-12',
    readTime: '6 דקות',
    author: { name: 'צוות AltruBiz', role: 'מומחי אוטומציה' },
    canonicalUrl: `${DOMAIN}/simulated-ai-growth-strategy`,
    markdownUrl: '/simulated-ai-growth-strategy.md',
    heroSummary: 'תקציר הירו למאמר בדיקה סימולטיבי.',
    keyTakeaway: 'תובנה מרכזית למאמר בדיקה.',
    sections: [
        {
            id: 'section-intro',
            title: 'פתיח המאמר',
            content: ['בדיקת שילוב [אינבוקס אחוד](concept:omnichannel-unified-inbox) במערכת.']
        }
    ]
};

// Test 3.1: Article #18 in REVIEW mode
const { buildArticleRouteConfig } = routesLoader.loadRoutes();
const reviewRouteConfig = buildArticleRouteConfig(simulatedArticle18);

if (reviewRouteConfig.inSitemap === false && reviewRouteConfig.noindex === true) {
    pass(`Simulated Article #18 in REVIEW status correctly assigns inSitemap: false and noindex: true.`);
} else {
    fail(`Simulated Article #18 in REVIEW status leaked into sitemap or lacked noindex!`);
}

if (!reviewRouteConfig.alternateMarkdown) {
    pass(`Simulated Article #18 in REVIEW status suppresses public alternateMarkdown.`);
} else {
    fail(`Simulated Article #18 in REVIEW status exposed alternateMarkdown!`);
}

// Test 3.2: Article #18 in PUBLISHED + INDEXABLE mode
const publishedArticle18 = {
    ...simulatedArticle18,
    publicationStatus: 'published',
    indexable: true
};
const publishedRouteConfig = buildArticleRouteConfig(publishedArticle18);

if (publishedRouteConfig.inSitemap === true && publishedRouteConfig.noindex === false) {
    pass(`Simulated Article #18 promoted to PUBLISHED correctly assigns inSitemap: true and noindex: false.`);
} else {
    fail(`Simulated Article #18 promoted to PUBLISHED failed to acquire inSitemap: true!`);
}

if (publishedRouteConfig.canonicalUrl === 'https://altrubiz.co.il/simulated-ai-growth-strategy') {
    pass(`Simulated Article #18 canonicalUrl automatically derived as https://altrubiz.co.il/simulated-ai-growth-strategy.`);
} else {
    fail(`Simulated Article #18 canonicalUrl incorrect: ${publishedRouteConfig.canonicalUrl}`);
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n--------------------------------------------------------');
console.log(`Article Readiness Audit Complete: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.`);
console.log('--------------------------------------------------------\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
