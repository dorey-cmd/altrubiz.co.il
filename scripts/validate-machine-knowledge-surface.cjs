/**
 * AltruBiz Machine Knowledge Surface & LLM Representation Validator
 * 
 * Strict 18-point verification for the machine knowledge layer:
 * - Public markdown mirrors (.md)
 * - Concept resolution (State A -> canonical HTML, State B -> clean text + glossary, State C -> clean text)
 * - Zero concept: pseudo-links
 * - Zero .md or llms in sitemap.xml
 * - llms.txt and llms-full.txt accuracy and coverage
 * - Unified Inbox vs WhatsApp distinction
 * - Deterministic generation
 */

const fs = require('fs');
const path = require('path');
const routesLoader = require('./routes-loader.cjs');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const LLMS_PATH = path.join(PUBLIC_DIR, 'llms.txt');
const LLMS_FULL_PATH = path.join(PUBLIC_DIR, 'llms-full.txt');
const DOMAIN = 'https://altrubiz.co.il';

let passed = 0;
let failed = 0;

function pass(msg) {
    passed++;
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${msg}`);
}

function fail(msg) {
    failed++;
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

console.log('\n\x1b[1m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Machine Knowledge Surface Validation        \x1b[0m');
console.log('\x1b[1m========================================================\x1b[0m\n');

const articles = routesLoader.getArticles();
const hubs = routesLoader.getAllHubs();
const canonicalConcepts = routesLoader.CANONICAL_CONCEPTS;
const routesRegistry = routesLoader.getRoutesRegistry();

const publicArticles = routesLoader.getIndexableArticles ? routesLoader.getIndexableArticles() : articles.filter(a => a.publicationStatus === 'published' && a.indexable === true);

// -------------------------------------------------------------
// 1. Every approved public article has exactly one machine companion
// -------------------------------------------------------------
console.log('\x1b[36m1. Auditing machine companion existence...\x1b[0m');
let companionsCount = 0;
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    if (fs.existsSync(mdFile)) {
        companionsCount++;
    } else {
        fail(`Article "${art.slug}" missing companion: public/${cleanPath}.md`);
    }
}
if (companionsCount === publicArticles.length) {
    pass(`All ${publicArticles.length} approved public articles have exactly one machine companion.`);
}

// -------------------------------------------------------------
// 2. Machine companion URL follows publicPath: /<publicPath>.md
// -------------------------------------------------------------
console.log('\x1b[36m2. Auditing machine companion public path naming...\x1b[0m');
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const expectedFilename = `${cleanPath}.md`;
    const fullPath = path.join(PUBLIC_DIR, expectedFilename);
    if (fs.existsSync(fullPath)) {
        // verify it's not under public/articles/
        const legacyPath = path.join(PUBLIC_DIR, 'articles', `${art.slug}.md`);
        if (fs.existsSync(legacyPath)) {
            fail(`Legacy markdown file still exists in public/articles/${art.slug}.md`);
        }
    } else {
        fail(`Companion file does not match publicPath: expected public/${expectedFilename}`);
    }
}
pass(`All machine companions follow publicPath (/<publicPath>.md) with zero legacy public/articles/ files.`);

// -------------------------------------------------------------
// 3. Every machine mirror frontmatter canonical_url points to the HTML canonical
// -------------------------------------------------------------
console.log('\x1b[36m3. Auditing frontmatter canonical_url in machine companions...\x1b[0m');
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    const content = fs.readFileSync(mdFile, 'utf8');
    const expectedCanonical = art.canonicalUrl;
    if (content.includes(`canonical_url: "${expectedCanonical}"`) || content.includes(`canonical_url: '${expectedCanonical}'`)) {
        // valid
    } else {
        fail(`Companion ${cleanPath}.md has missing or incorrect canonical_url. Expected: ${expectedCanonical}`);
    }
}
pass(`All ${publicArticles.length} machine companions have canonical_url pointing to the HTML canonical.`);

// -------------------------------------------------------------
// 4. ZERO generated Markdown files contain "concept:"
// -------------------------------------------------------------
console.log('\x1b[36m4. Auditing zero "concept:" leaks in markdown files...\x1b[0m');
let conceptLeakCount = 0;
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    const content = fs.readFileSync(mdFile, 'utf8');
    if (content.includes('concept:')) {
        conceptLeakCount++;
        fail(`Companion ${cleanPath}.md contains unrendered "concept:" syntax!`);
    }
}
if (conceptLeakCount === 0) {
    pass(`ZERO generated Markdown files contain "concept:" syntax.`);
}

// -------------------------------------------------------------
// 5. Every State A semantic concept present in Markdown resolves to a real approved canonical HTML URL
// -------------------------------------------------------------
console.log('\x1b[36m5. Auditing State A concept link resolution...\x1b[0m');
const stateAConcepts = Object.entries(canonicalConcepts).filter(([_, c]) => c.hasApprovedPublicDestination && c.publicDestinationUrl);
for (const [id, concept] of stateAConcepts) {
    const targetPath = concept.publicDestinationUrl;
    const targetRoute = routesRegistry[targetPath];
    if (!targetRoute) {
        fail(`State A concept "${id}" points to non-existent route: ${targetPath}`);
    } else if (targetRoute.noindex) {
        fail(`State A concept "${id}" points to noindex route: ${targetPath}`);
    }
}
pass(`All ${stateAConcepts.length} State A concepts resolve to approved indexable canonical destinations.`);

// -------------------------------------------------------------
// 6. State B concepts never become invented links
// -------------------------------------------------------------
console.log('\x1b[36m6. Auditing State B concept links (must be clean text, never fake URLs)...\x1b[0m');
const stateBConcepts = Object.entries(canonicalConcepts).filter(([_, c]) => !c.hasApprovedPublicDestination);
let stateBFakeLinkFound = false;
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    const content = fs.readFileSync(mdFile, 'utf8');
    
    // Check for fake links like /crm, /lead, /contact, /follow-up, /no-show
    const fakeLinks = ['/crm', '/lead', '/contact', '/follow-up', '/no-show', 'https://altrubiz.co.il/crm'];
    for (const fl of fakeLinks) {
        const regex = new RegExp(`\\]\\(${fl}[\\)/]`, 'g');
        if (regex.test(content)) {
            stateBFakeLinkFound = true;
            fail(`Found invented link to State B concept in ${cleanPath}.md: ${fl}`);
        }
    }
}
if (!stateBFakeLinkFound) {
    pass(`State B concepts never become invented links (e.g. /crm or /lead).`);
}

// -------------------------------------------------------------
// 7. State B glossary definitions come from Knowledge Graph source-of-truth
// -------------------------------------------------------------
console.log('\x1b[36m7. Auditing State B glossary definitions source of truth...\x1b[0m');
for (const art of publicArticles) {
    const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    const content = fs.readFileSync(mdFile, 'utf8');
    if (content.includes('## מושגים שמופיעים במאמר')) {
        // verify definition matches canonicalConcepts
        for (const [id, concept] of stateBConcepts) {
            const termName = concept.term ? concept.term.split(' ')[0] : id;
            if (content.includes(`- **${termName}`) || content.includes(`- **${concept.term}`)) {
                if (!content.includes(concept.canonicalDefinition)) {
                    fail(`Glossary definition in ${cleanPath}.md for ${concept.term} does not match knowledgeGraph.ts!`);
                }
            }
        }
    }
}
pass(`State B glossary definitions strictly match knowledgeGraph.ts single source of truth.`);

// -------------------------------------------------------------
// 8. Sitemap contains ZERO .md URLs
// -------------------------------------------------------------
console.log('\x1b[36m8. Auditing sitemap for zero .md URLs...\x1b[0m');
if (fs.existsSync(SITEMAP_PATH)) {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    if (sitemapContent.includes('.md</loc>')) {
        fail(`Sitemap contains .md companion URLs!`);
    } else {
        pass(`Sitemap contains ZERO .md URLs.`);
    }
} else {
    fail(`public/sitemap.xml does not exist.`);
}

// -------------------------------------------------------------
// 9. Sitemap contains only approved canonical HTML routes
// -------------------------------------------------------------
console.log('\x1b[36m9. Auditing sitemap approved canonical HTML routes...\x1b[0m');
if (fs.existsSync(SITEMAP_PATH)) {
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    
    // Check no llms or .txt in sitemap
    for (const loc of locMatches) {
        if (loc.endsWith('.txt') || loc.endsWith('.md')) {
            fail(`Sitemap contains non-HTML URL: ${loc}`);
        }
        const routePath = loc.replace(DOMAIN, '') || '/';
        const route = routesRegistry[routePath];
        if (!route) {
            fail(`Sitemap contains unapproved route: ${loc}`);
        } else if (route.noindex) {
            fail(`Sitemap contains noindex route: ${loc}`);
        }
    }
    pass(`Sitemap contains only approved canonical HTML destinations (${locMatches.length} URLs).`);
}

// -------------------------------------------------------------
// 10. llms.txt contains all current public Hubs
// -------------------------------------------------------------
console.log('\x1b[36m10. Auditing llms.txt for all public Hubs...\x1b[0m');
if (fs.existsSync(LLMS_PATH)) {
    const llmsContent = fs.readFileSync(LLMS_PATH, 'utf8');
    for (const hub of hubs) {
        const cleanHubUrl = `${DOMAIN}${hub.url}`;
        if (!llmsContent.includes(cleanHubUrl)) {
            fail(`llms.txt is missing Hub URL: ${cleanHubUrl}`);
        }
    }
    pass(`llms.txt contains all ${hubs.length} current public Hubs.`);
} else {
    fail(`public/llms.txt does not exist.`);
}

// -------------------------------------------------------------
// 11. llms.txt contains current article machine links and no legacy /articles/<slug>.md links
// -------------------------------------------------------------
console.log('\x1b[36m11. Auditing llms.txt article links...\x1b[0m');
if (fs.existsSync(LLMS_PATH)) {
    const llmsContent = fs.readFileSync(LLMS_PATH, 'utf8');
    if (llmsContent.includes('/articles/')) {
        fail(`llms.txt contains legacy /articles/ link!`);
    } else {
        pass(`llms.txt contains zero legacy /articles/ links.`);
    }

    for (const art of publicArticles) {
        const cleanPath = (art.publicPath || art.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
        const expectedMd = `${DOMAIN}/${cleanPath}.md`;
        if (!llmsContent.includes(expectedMd)) {
            fail(`llms.txt is missing machine link for article: ${expectedMd}`);
        }
    }
    pass(`llms.txt contains all ${publicArticles.length} article machine links.`);
}

// -------------------------------------------------------------
// 12. llms-full.txt includes all approved public articles exactly once
// -------------------------------------------------------------
console.log('\x1b[36m12. Auditing llms-full.txt article coverage...\x1b[0m');
if (fs.existsSync(LLMS_FULL_PATH)) {
    const fullContent = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
    for (const art of publicArticles) {
        const occurrences = fullContent.split(`### ${art.title}`).length - 1;
        if (occurrences === 0) {
            fail(`llms-full.txt is missing article: "${art.title}"`);
        } else if (occurrences > 1) {
            fail(`llms-full.txt has ${occurrences} duplicate occurrences of: "${art.title}"`);
        }
    }
    pass(`llms-full.txt includes all ${publicArticles.length} approved public articles exactly once.`);
} else {
    fail(`public/llms-full.txt does not exist.`);
}

// -------------------------------------------------------------
// 13. llms-full.txt contains ZERO concept:, legacy /topics/, legacy HTML /articles/<slug>
// -------------------------------------------------------------
console.log('\x1b[36m13. Auditing llms-full.txt for forbidden legacy syntax...\x1b[0m');
if (fs.existsSync(LLMS_FULL_PATH)) {
    const fullContent = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
    if (fullContent.includes('concept:')) {
        fail(`llms-full.txt contains "concept:" pseudo-links!`);
    } else {
        pass(`llms-full.txt contains ZERO "concept:" pseudo-links.`);
    }

    if (fullContent.includes('/topics/')) {
        fail(`llms-full.txt contains legacy "/topics/" paths!`);
    } else {
        pass(`llms-full.txt contains ZERO legacy "/topics/" paths.`);
    }

    // Check for legacy HTML /articles/ links (ignoring /images/articles/)
    const lines = fullContent.split('\n');
    let legacyArticleLinks = 0;
    for (const line of lines) {
        if (line.includes('/articles/') && !line.includes('/images/articles/')) {
            legacyArticleLinks++;
            fail(`llms-full.txt contains legacy HTML /articles/ link: ${line}`);
        }
    }
    if (legacyArticleLinks === 0) {
        pass(`llms-full.txt contains ZERO legacy HTML /articles/<slug> links.`);
    }
}

// -------------------------------------------------------------
// 14. Unified Inbox resolves to /unified-inbox
// -------------------------------------------------------------
console.log('\x1b[36m14. Auditing Unified Inbox resolution...\x1b[0m');
const uiConcept = routesLoader.resolveCanonicalConcept('unified-inbox');
if (uiConcept && uiConcept.publicDestinationUrl === '/unified-inbox') {
    pass(`Unified Inbox correctly resolves to /unified-inbox.`);
} else {
    fail(`Unified Inbox resolution failed. Expected /unified-inbox, got: ${uiConcept?.publicDestinationUrl}`);
}

// -------------------------------------------------------------
// 15. WhatsApp-specific concept resolves to /whatsapp-in-crm
// -------------------------------------------------------------
console.log('\x1b[36m15. Auditing WhatsApp-specific concept resolution...\x1b[0m');
const waConcept = routesLoader.resolveCanonicalConcept('whatsapp-in-crm');
if (waConcept && waConcept.publicDestinationUrl === '/whatsapp-in-crm') {
    pass(`WhatsApp-specific concept correctly resolves to /whatsapp-in-crm.`);
} else {
    fail(`WhatsApp-specific concept resolution failed. Expected /whatsapp-in-crm, got: ${waConcept?.publicDestinationUrl}`);
}

// -------------------------------------------------------------
// 16. CRM remains definition-only with no fabricated /crm destination
// -------------------------------------------------------------
console.log('\x1b[36m16. Auditing CRM concept (definition-only State B)...\x1b[0m');
const crmConcept = routesLoader.resolveCanonicalConcept('crm');
if (crmConcept && crmConcept.hasApprovedPublicDestination === false && !crmConcept.publicDestinationUrl) {
    if (routesRegistry['/crm']) {
        fail(`Found fabricated /crm route in routes registry!`);
    } else {
        pass(`CRM remains strictly State B definition-only with no fabricated /crm destination.`);
    }
} else {
    fail(`CRM concept is not State B or has publicDestinationUrl: ${crmConcept?.publicDestinationUrl}`);
}

// -------------------------------------------------------------
// 17. Draft/noindex/non-public content cannot enter machine indexes
// -------------------------------------------------------------
console.log('\x1b[36m17. Auditing exclusion of non-public/noindex content...\x1b[0m');
const llmsContent = fs.readFileSync(LLMS_PATH, 'utf8');
const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
for (const [routePath, config] of Object.entries(routesRegistry)) {
    if (config.noindex || !config.inSitemap) {
        if (sitemapContent.includes(`<loc>${config.canonicalUrl}</loc>`)) {
            fail(`Noindex route found in sitemap: ${config.canonicalUrl}`);
        }
        if (llmsContent.includes(config.canonicalUrl)) {
            fail(`Noindex route found in llms.txt: ${config.canonicalUrl}`);
        }
    }
}
pass(`Draft/noindex/non-public content cannot enter sitemap or machine discovery.`);

// -------------------------------------------------------------
// 18. Generated machine artifacts are deterministic
// -------------------------------------------------------------
console.log('\x1b[36m18. Auditing determinism of machine artifact generation...\x1b[0m');
// Read current generated artifacts
const beforeLlms = fs.readFileSync(LLMS_PATH, 'utf8');
const beforeFull = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
const beforeSitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

// Run generator again in-memory / re-run scripts
const { execSync } = require('child_process');
execSync('node scripts/sync-articles-md.cjs', { stdio: 'pipe' });
execSync('node scripts/generate-llms-txt.cjs', { stdio: 'pipe' });
execSync('node scripts/generate-sitemap.cjs', { stdio: 'pipe' });

const afterLlms = fs.readFileSync(LLMS_PATH, 'utf8');
const afterFull = fs.readFileSync(LLMS_FULL_PATH, 'utf8');
const afterSitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');

if (beforeLlms === afterLlms && beforeFull === afterFull && beforeSitemap === afterSitemap) {
    pass(`Machine artifacts generation is 100% deterministic (zero diff on rerun).`);
} else {
    fail(`Generation produced non-deterministic output between runs!`);
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n--------------------------------------------------------');
console.log(`Machine Knowledge Surface Audit Complete: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.`);
console.log('--------------------------------------------------------\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
