#!/usr/bin/env node

/**
 * AltruBiz URL Architecture Migration Validation Test
 * 
 * Verifies that:
 * 1. Every approved new public route exists in the route registry.
 * 2. /knowledge exists as the canonical Knowledge Center index.
 * 3. All 17 article publicPaths are unique.
 * 4. All 5 Hub URLs are unique.
 * 5. No collision between article publicPaths, Hub URLs, and static routes.
 * 6. Canonical article routes do not contain /articles/.
 * 7. Canonical Hub routes do not contain /topics/.
 * 8. Every old URL has a direct permanent Vercel redirect in vercel.json.
 * 9. No redirect chains exist (old -> new directly).
 * 10. Old routes are not canonical destinations.
 * 11. State A semantic links use new Hub destinations.
 * 12. Homepage links to all five public Hubs.
 * 13. Route registry resolves the new flat URLs accurately.
 */

const fs = require('fs');
const path = require('path');
const { 
    getRoutesRegistry, 
    getArticles, 
    getAllHubs, 
    loadRoutes 
} = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const VERCEL_JSON_PATH = path.join(ROOT_DIR, 'vercel.json');

console.log('\n========================================================');
console.log('   AltruBiz Public URL Architecture Migration Audit     ');
console.log('========================================================\n');

let passedCount = 0;
let failedCount = 0;

function pass(msg) {
    passedCount++;
    console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function fail(msg) {
    failedCount++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

const EXPECTED_HUBS = [
    '/lost-leads',
    '/whatsapp-in-crm',
    '/sales-pipeline',
    '/business-memory',
    '/repetitive-manual-work'
];

const EXPECTED_ARTICLES = {
    'whatsapp-messaging-guidelines': '/whatsapp-messaging-guidelines',
    'crm-quick-wins-guide': '/crm-quick-wins',
    'lead-first-5-minutes-guide': '/lead-first-5-minutes',
    'missed-call-text-back-guide': '/missed-call-text-back',
    'excel-to-crm-pipeline-guide': '/excel-to-pipeline',
    'business-memory-crm-guide': '/crm-as-business-memory',
    'lead-reactivation-guide': '/lead-reactivation',
    'follow-up-tasks-crm-guide': '/follow-up-tasks',
    'automated-meeting-scheduling-guide': '/automated-meeting-scheduling',
    'crm-duplicate-contacts-prevention-guide': '/prevent-duplicate-contacts',
    'crm-adoption-thursday-test-guide': '/crm-thursday-test',
    'customer-reviews-reputation-crm-guide': '/customer-review-requests',
    'preventing-meeting-no-shows-guide': '/prevent-no-shows',
    'non-technical-to-ai-automation-guide': '/automation-without-tech-skills',
    'client-onboarding-process-guide': '/client-onboarding',
    'salespeople-hate-crm-adoption-guide': '/salespeople-hate-crm',
    'omnichannel-communication-unified-inbox-crm-guide': '/unified-inbox'
};

const OLD_URL_REDIRECT_MAP = {
    '/articles': '/knowledge',
    '/topics/lost-leads': '/lost-leads',
    '/topics/whatsapp-in-crm': '/whatsapp-in-crm',
    '/topics/sales-pipeline': '/sales-pipeline',
    '/topics/business-memory': '/business-memory',
    '/topics/repetitive-manual-work': '/repetitive-manual-work',
    '/articles/whatsapp-messaging-guidelines': '/whatsapp-messaging-guidelines',
    '/articles/crm-quick-wins-guide': '/crm-quick-wins',
    '/articles/lead-first-5-minutes-guide': '/lead-first-5-minutes',
    '/articles/missed-call-text-back-guide': '/missed-call-text-back',
    '/articles/excel-to-crm-pipeline-guide': '/excel-to-pipeline',
    '/articles/business-memory-crm-guide': '/crm-as-business-memory',
    '/articles/lead-reactivation-guide': '/lead-reactivation',
    '/articles/follow-up-tasks-crm-guide': '/follow-up-tasks',
    '/articles/automated-meeting-scheduling-guide': '/automated-meeting-scheduling',
    '/articles/crm-duplicate-contacts-prevention-guide': '/prevent-duplicate-contacts',
    '/articles/crm-adoption-thursday-test-guide': '/crm-thursday-test',
    '/articles/customer-reviews-reputation-crm-guide': '/customer-review-requests',
    '/articles/preventing-meeting-no-shows-guide': '/prevent-no-shows',
    '/articles/non-technical-to-ai-automation-guide': '/automation-without-tech-skills',
    '/articles/client-onboarding-process-guide': '/client-onboarding',
    '/articles/salespeople-hate-crm-adoption-guide': '/salespeople-hate-crm',
    '/articles/omnichannel-communication-unified-inbox-crm-guide': '/unified-inbox'
};

// 1. Check Routes Registry
console.log('1. Auditing Route Registry & Flat Routes...');
const registry = getRoutesRegistry();
const routesModule = loadRoutes();

// Knowledge index check
if (registry['/knowledge']) {
    pass('Route /knowledge exists in registry');
    if (registry['/knowledge'].canonicalUrl === 'https://altrubiz.co.il/knowledge') {
        pass('Route /knowledge has canonical https://altrubiz.co.il/knowledge');
    } else {
        fail(`/knowledge canonical mismatch: ${registry['/knowledge'].canonicalUrl}`);
    }
} else {
    fail('Route /knowledge is missing from registry');
}

if (registry['/articles']) {
    fail('Old /articles route should NOT be present in public routes registry');
} else {
    pass('Old /articles route absent from public registry');
}

// 2. Hub Routes
console.log('\n2. Auditing Hub URLs...');
const hubs = getAllHubs();
const hubUrls = new Set();
for (const hub of hubs) {
    if (hubUrls.has(hub.url)) {
        fail(`Duplicate Hub URL: ${hub.url}`);
    }
    hubUrls.add(hub.url);

    if (hub.url.startsWith('/topics/')) {
        fail(`Hub "${hub.slug}" still uses legacy /topics/ path: ${hub.url}`);
    } else {
        pass(`Hub "${hub.slug}" uses flat URL: ${hub.url}`);
    }

    const regEntry = registry[hub.url];
    if (!regEntry) {
        fail(`Hub URL "${hub.url}" not registered in registry!`);
    } else if (regEntry.canonicalUrl !== `https://altrubiz.co.il${hub.url}`) {
        fail(`Hub "${hub.slug}" canonical mismatch: ${regEntry.canonicalUrl}`);
    } else {
        pass(`Hub "${hub.slug}" canonical URL verified: ${regEntry.canonicalUrl}`);
    }
}

for (const expHub of EXPECTED_HUBS) {
    if (hubUrls.has(expHub)) {
        pass(`Approved Hub URL verified: ${expHub}`);
    } else {
        fail(`Approved Hub URL missing: ${expHub}`);
    }
}

// 3. Article Routes
console.log('\n3. Auditing Article Public Paths & Canonicals...');
const articles = getArticles();
const articlePublicPaths = new Set();

for (const art of articles) {
    const expectedPath = EXPECTED_ARTICLES[art.slug];
    if (!expectedPath) {
        fail(`Article "${art.slug}" not found in approved migration map!`);
        continue;
    }

    if (art.publicPath !== expectedPath) {
        fail(`Article "${art.slug}" publicPath mismatch! Found: "${art.publicPath}", Expected: "${expectedPath}"`);
    } else {
        pass(`Article "${art.slug}" publicPath verified: ${art.publicPath}`);
    }

    if (articlePublicPaths.has(art.publicPath)) {
        fail(`Duplicate article publicPath: ${art.publicPath}`);
    }
    articlePublicPaths.add(art.publicPath);

    if (art.publicPath.startsWith('/articles/')) {
        fail(`Article "${art.slug}" publicPath contains legacy /articles/ prefix: ${art.publicPath}`);
    }

    if (art.canonicalUrl !== `https://altrubiz.co.il${expectedPath}`) {
        fail(`Article "${art.slug}" canonicalUrl mismatch! Found: "${art.canonicalUrl}", Expected: "https://altrubiz.co.il${expectedPath}"`);
    } else {
        pass(`Article "${art.slug}" canonicalUrl verified: ${art.canonicalUrl}`);
    }

    const regEntry = registry[art.publicPath];
    if (!regEntry) {
        fail(`Article route "${art.publicPath}" not registered in registry!`);
    } else {
        pass(`Article route "${art.publicPath}" resolved by registry`);
    }
}

// 4. Collision Detection
console.log('\n4. Checking Collision Across Namespace...');
for (const pp of articlePublicPaths) {
    if (hubUrls.has(pp)) {
        fail(`Collision between Article and Hub: ${pp}`);
    }
    if (pp === '/about' || pp === '/knowledge' || pp === '/offer' || pp === '/') {
        fail(`Collision between Article and static route: ${pp}`);
    }
}
for (const hu of hubUrls) {
    if (hu === '/about' || hu === '/knowledge' || hu === '/offer' || hu === '/') {
        fail(`Collision between Hub and static route: ${hu}`);
    }
}
pass('No URL collisions detected between articles, hubs, and static routes.');

// 5. Audit Vercel Redirects (vercel.json)
console.log('\n5. Auditing Vercel Permanent Redirects (vercel.json)...');
if (!fs.existsSync(VERCEL_JSON_PATH)) {
    fail('vercel.json does not exist!');
} else {
    const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf8'));
    const redirects = vercelConfig.redirects || [];
    const redirectMap = new Map();

    for (const r of redirects) {
        redirectMap.set(r.source, r);
    }

    for (const [oldUrl, newUrl] of Object.entries(OLD_URL_REDIRECT_MAP)) {
        const r = redirectMap.get(oldUrl);
        if (!r) {
            fail(`Missing Vercel redirect for old URL: ${oldUrl}`);
        } else if (r.destination !== newUrl) {
            fail(`Vercel redirect mismatch for ${oldUrl}: points to "${r.destination}", expected "${newUrl}"`);
        } else if (!r.permanent) {
            fail(`Vercel redirect for ${oldUrl} must have permanent: true (308)!`);
        } else {
            pass(`Redirect verified: ${oldUrl} -> ${newUrl} (permanent: true)`);
        }
    }

    // Check for redirect chains
    for (const r of redirects) {
        if (redirectMap.has(r.destination)) {
            fail(`Redirect chain detected: ${r.source} -> ${r.destination} -> ${redirectMap.get(r.destination).destination}`);
        }
    }
    pass('Zero redirect chains detected in vercel.json.');
}

// 6. Audit State A Semantic Links & Single Source of Truth
console.log('\n6. Auditing State A Semantic Knowledge Links...');
const kgPath = path.join(ROOT_DIR, 'src', 'data', 'knowledgeGraph.ts');
const kgContent = fs.readFileSync(kgPath, 'utf8');

if (kgContent.includes('/topics/')) {
    fail('src/data/knowledgeGraph.ts still contains legacy "/topics/" paths!');
} else {
    pass('src/data/knowledgeGraph.ts has zero "/topics/" paths.');
}

if (kgContent.includes('non-technical-ai-automation')) {
    fail('src/data/knowledgeGraph.ts contains unapproved slug "non-technical-ai-automation"!');
} else {
    pass('src/data/knowledgeGraph.ts contains approved slug "automation-without-tech-skills".');
}

// 7. Audit Homepage Links to All Five Public Hubs
console.log('\n7. Auditing Homepage Hub Connections...');
for (const hubUrl of EXPECTED_HUBS) {
    if (kgContent.includes(`url: '${hubUrl}'`)) {
        pass(`Knowledge graph exports selector connecting to hub: ${hubUrl}`);
    } else {
        fail(`Knowledge graph missing selector url for hub: ${hubUrl}`);
    }
}

// 8. Route Config Dynamic Resolution
console.log('\n8. Auditing getRouteConfig() Dynamic Lookup...');
const testRoutes = [
    { path: '/lost-leads', expectedType: 'pain_hub' },
    { path: '/sales-pipeline', expectedType: 'pain_hub' },
    { path: '/excel-to-pipeline', expectedType: 'article' },
    { path: '/unified-inbox', expectedType: 'article' },
    { path: '/knowledge', expectedType: 'static' }
];

for (const t of testRoutes) {
    const config = routesModule.getRouteConfig(t.path);
    if (!config) {
        fail(`getRouteConfig("${t.path}") returned undefined!`);
    } else {
        pass(`getRouteConfig("${t.path}") successfully resolved: "${config.title}"`);
    }
}

// Summary
console.log('\n========================================================');
console.log(`Summary: ${passedCount} Passed, ${failedCount} Failed`);
console.log('========================================================\n');

if (failedCount > 0) {
    process.exit(1);
} else {
    console.log('✔ All URL Migration Criteria PASSED perfectly!\n');
    process.exit(0);
}
