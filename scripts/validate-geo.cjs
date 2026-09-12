#!/usr/bin/env node

/**
 * Automated GEO / AEO / LLM-Readiness Validation Suite for AltruBiz
 * 
 * Verifies all permanent architectural and SEO requirements.
 * Run with: npm run test:geo or npm run geo:audit
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');

let errors = [];
let warnings = [];
let passedChecks = 0;

function reportPass(message) {
    passedChecks++;
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
}

function reportFail(message, isCritical = true) {
    if (isCritical) {
        errors.push(message);
        console.log(`  \x1b[31m✖ [CRITICAL]\x1b[0m ${message}`);
    } else {
        warnings.push(message);
        console.log(`  \x1b[33m⚠ [WARNING]\x1b[0m ${message}`);
    }
}

console.log('\n\x1b[1m\x1b[34m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Permanent GEO / AEO / LLM-Readiness Audit   \x1b[0m');
console.log('\x1b[1m\x1b[34m========================================================\x1b[0m\n');

// -------------------------------------------------------------
// 1. Audit robots.txt & AI Crawler Directives
// -------------------------------------------------------------
console.log('\x1b[1m1. Checking robots.txt & AI Bot Permissions...\x1b[0m');
const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
    reportFail('robots.txt does not exist in public/');
} else {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    const requiredBots = [
        'OAI-SearchBot',
        'ChatGPT-User',
        'PerplexityBot',
        'ClaudeBot',
        'Applebot-Extended',
        'Googlebot',
        'Bingbot'
    ];

    for (const bot of requiredBots) {
        if (robotsContent.includes(`User-agent: ${bot}`)) {
            reportPass(`AI/Search Bot declared: ${bot}`);
        } else {
            reportFail(`AI/Search Bot missing from robots.txt: ${bot}`, true);
        }
    }

    if (robotsContent.includes('Sitemap: https://altrubiz.co.il/sitemap.xml')) {
        reportPass('Sitemap directive present in robots.txt');
    } else {
        reportFail('Sitemap directive missing from robots.txt', true);
    }

    if (robotsContent.includes('Disallow: /offer')) {
        reportPass('Private offer route (/offer) correctly disallowed in robots.txt');
    } else {
        reportFail('Private offer route (/offer) should be disallowed in robots.txt', false);
    }
}

// -------------------------------------------------------------
// 2. Extract Registered Routes & Articles
// -------------------------------------------------------------
console.log('\n\x1b[1m2. Loading Routes & Articles Data via routes-loader...\x1b[0m');
const { getRoutesRegistry, getArticles } = require('./routes-loader.cjs');

const routesRegistry = getRoutesRegistry();
const knownRoutes = new Map(Object.entries(routesRegistry));
const articlesList = getArticles();

reportPass(`Loaded ${knownRoutes.size} total route(s) and ${articlesList.length} article(s) dynamically from TypeScript registry.`);

// -------------------------------------------------------------
// 3. Audit Article Metadata, Authorship & LLM Markdown Mirrors
// -------------------------------------------------------------
console.log('\n\x1b[1m3. Checking Article Metadata, Authorship & Markdown Counterparts...\x1b[0m');
for (const art of articlesList) {
    const title = art.seoTitle || art.title;
    // Check title length
    if (!title || title.length < 15) {
        reportFail(`Article "${art.slug}" title is missing or too short (< 15 chars)`, true);
    } else if (title.length > 90) {
        reportFail(`Article "${art.slug}" title is too long (> 90 chars)`, false);
    } else {
        reportPass(`Article "${art.slug}" has valid title: "${title}"`);
    }

    // Check description length
    if (!art.description || art.description.length < 50) {
        reportFail(`Article "${art.slug}" description is missing or too short (< 50 chars)`, true);
    } else if (art.description.length > 180) {
        reportFail(`Article "${art.slug}" description is too long (> 180 chars)`, false);
    } else {
        reportPass(`Article "${art.slug}" has valid description (${art.description.length} chars)`);
    }

    // Check author attribution (Must be brand/team, strictly forbidden: "דורי")
    const authorName = typeof art.author === 'object' ? art.author?.name : art.author;
    if (authorName) {
        if (authorName.includes('דורי') || authorName.toLowerCase().includes('dori')) {
            reportFail(`Article "${art.slug}" contains forbidden personal name in author: "${authorName}". Must be brand/team attribution (e.g. "צוות AltruBiz")!`, true);
        } else {
            reportPass(`Article "${art.slug}" author declared: "${authorName}"`);
        }
    } else {
        reportFail(`Article "${art.slug}" is missing author attribution!`, true);
    }

    if (art.cta?.whatsappText && (art.cta.whatsappText.includes('דורי') || art.cta.whatsappText.toLowerCase().includes('dori'))) {
        reportFail(`Article "${art.slug}" cta.whatsappText contains forbidden personal name "דורי"!`, true);
    }

    // Check dates
    if (art.datePublished && /^\d{4}-\d{2}-\d{2}$/.test(art.datePublished)) {
        reportPass(`Article "${art.slug}" datePublished valid: ${art.datePublished}`);
    } else {
        reportFail(`Article "${art.slug}" is missing or has invalid datePublished (format: YYYY-MM-DD)`, true);
    }

    // Check keyTakeaway for Answer Engine Optimization
    if (art.keyTakeaway && art.keyTakeaway.length > 20) {
        reportPass(`Article "${art.slug}" has concise keyTakeaway for LLM answer engines`);
    } else {
        reportFail(`Article "${art.slug}" is missing keyTakeaway summary for LLMs`, false);
    }

    // Check markdown mirror file
    const cleanPath = (art.publicPath || art.canonicalUrl.replace('https://altrubiz.co.il', '')).replace(/^\//, '');
    const mdFile = path.join(PUBLIC_DIR, `${cleanPath}.md`);
    if (fs.existsSync(mdFile)) {
        const mdContent = fs.readFileSync(mdFile, 'utf8');
        if (mdContent.startsWith('---') && mdContent.includes('title:')) {
            reportPass(`Article "${art.slug}" has valid markdown mirror with YAML frontmatter in public/${cleanPath}.md`);
        } else {
            reportFail(`Article markdown file "${cleanPath}.md" is missing YAML frontmatter`, true);
        }
    } else {
        reportFail(`Missing markdown mirror for LLMs: public/${cleanPath}.md`, true);
    }
}

// -------------------------------------------------------------
// 4. Audit Route Registry: Metadata, Canonicals & Accidental Noindex
// -------------------------------------------------------------
console.log('\n\x1b[1m4. Checking Route Registry Metadata, Canonicals & Indexability...\x1b[0m');
const seenTitles = new Set();
const seenDescriptions = new Set();

for (const [routePath, config] of knownRoutes.entries()) {
    // 1. Canonical verification
    if (!config.canonicalUrl || !config.canonicalUrl.startsWith('https://altrubiz.co.il')) {
        reportFail(`Route "${routePath}" canonical URL must start with https://altrubiz.co.il`, true);
    } else if (config.canonicalUrl.includes('#') || config.canonicalUrl.includes('?')) {
        reportFail(`Route "${routePath}" canonical URL must NOT contain queries or fragment hashes: ${config.canonicalUrl}`, true);
    } else {
        reportPass(`Route "${routePath}" canonical URL valid: ${config.canonicalUrl}`);
    }

    // 2. Accidental noindex check
    if (config.inSitemap && config.noindex) {
        reportFail(`Route "${routePath}" is marked inSitemap: true but has noindex: true!`, true);
    }

    // 3. Title checks
    if (!config.title || config.title.trim().length === 0) {
        reportFail(`Route "${routePath}" is missing title`, true);
    } else {
        if (seenTitles.has(config.title)) {
            reportFail(`Duplicate title found on route "${routePath}": "${config.title}"`, true);
        } else {
            seenTitles.add(config.title);
        }
    }

    // 4. Description checks
    if (!config.description || config.description.trim().length === 0) {
        reportFail(`Route "${routePath}" is missing meta description`, true);
    } else {
        if (seenDescriptions.has(config.description)) {
            reportFail(`Duplicate description found on route "${routePath}"`, true);
        } else {
            seenDescriptions.add(config.description);
        }
    }
}

// -------------------------------------------------------------
// 5. Audit sitemap.xml Validity & Canonical Coverage
// -------------------------------------------------------------
console.log('\n\x1b[1m5. Checking sitemap.xml validity & canonical synchronization...\x1b[0m');
const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
    reportFail('sitemap.xml does not exist in public/', true);
} else {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

    // Check for fragment hashes
    if (sitemapContent.includes('#')) {
        reportFail('sitemap.xml contains URL fragment hashes (#), which are forbidden in XML sitemaps', true);
    } else {
        reportPass('No fragment hashes (#) found in sitemap.xml');
    }

    // Check that sitemap contains zero .md companion files
    if (sitemapContent.includes('.md</loc>')) {
        reportFail('sitemap.xml contains .md companion URLs! Sitemap must contain ONLY approved canonical HTML destinations.', true);
    } else {
        reportPass('sitemap.xml correctly contains zero .md companion URLs');
    }

    // Check that sitemap contains zero llms files
    if (sitemapContent.includes('llms.txt') || sitemapContent.includes('llms-full.txt')) {
        reportFail('sitemap.xml contains llms discovery files! Sitemap must contain ONLY approved canonical HTML destinations.', true);
    } else {
        reportPass('sitemap.xml correctly contains zero llms discovery files');
    }

    // Check all public routes are included
    for (const [routePath, config] of knownRoutes.entries()) {
        if (config.inSitemap && !config.noindex) {
            if (sitemapContent.includes(`<loc>${config.canonicalUrl}</loc>`)) {
                reportPass(`Sitemap includes public route: ${config.canonicalUrl}`);
            } else {
                reportFail(`Public route "${routePath}" missing from sitemap.xml! Expected: ${config.canonicalUrl}`, true);
            }
        } else if (config.noindex) {
            // Private routes must NOT be in sitemap
            if (sitemapContent.includes(`<loc>${config.canonicalUrl}</loc>`)) {
                reportFail(`Private/noindex route "${routePath}" was accidentally included in sitemap.xml!`, true);
            } else {
                reportPass(`Private/noindex route correctly excluded from sitemap: ${routePath}`);
            }
        }
    }
}

// -------------------------------------------------------------
// 6. Audit Machine-Readable AI Support Files (llms.txt)
// -------------------------------------------------------------
console.log('\n\x1b[1m6. Checking machine-readable AI support files (llms.txt)...\x1b[0m');
const llmsPath = path.join(PUBLIC_DIR, 'llms.txt');
const llmsFullPath = path.join(PUBLIC_DIR, 'llms-full.txt');

if (fs.existsSync(llmsPath)) {
    const content = fs.readFileSync(llmsPath, 'utf8');
    if (content.length > 200 && content.includes('AltruBiz')) {
        reportPass('llms.txt exists with structured entity & documentation links');
    } else {
        reportFail('llms.txt is too short or missing entity context', false);
    }
} else {
    reportFail('public/llms.txt is missing', true);
}

if (fs.existsSync(llmsFullPath)) {
    const content = fs.readFileSync(llmsFullPath, 'utf8');
    if (content.length > 500 && content.includes('AltruBiz CRM')) {
        reportPass('llms-full.txt exists with comprehensive factual grounding');
    } else {
        reportFail('llms-full.txt is too short or missing factual grounding', false);
    }
} else {
    reportFail('public/llms-full.txt is missing', true);
}

// -------------------------------------------------------------
// 7. Audit index.html Semantic HTML & Entity Structured Data
// -------------------------------------------------------------
console.log('\n\x1b[1m7. Checking index.html No-JS fallback & Base Entity Schema...\x1b[0m');
const indexPath = path.join(ROOT_DIR, 'index.html');
if (!fs.existsSync(indexPath)) {
    reportFail('index.html not found', true);
} else {
    const indexContent = fs.readFileSync(indexPath, 'utf8');

    // Language and direction
    if (indexContent.includes('lang="he"') && indexContent.includes('dir="rtl"')) {
        reportPass('index.html specifies lang="he" and dir="rtl"');
    } else {
        reportFail('index.html must specify lang="he" and dir="rtl"', true);
    }

    // No-JS Semantic fallback in #root
    if (indexContent.includes('<div id="root">') && /<h1[^>]*>אלטרוביז CRM/i.test(indexContent)) {
        reportPass('index.html contains pre-rendered semantic fallback HTML for non-JS crawlers');
    } else {
        reportFail('index.html #root is empty! Non-JS AI crawlers cannot index content', true);
    }

    // Single H1 in fallback
    const h1Count = (indexContent.match(/<h1[\s>]/g) || []).length;
    if (h1Count === 1) {
        reportPass('Single <h1> element in index.html');
    } else {
        reportFail(`index.html contains ${h1Count} <h1> elements (must be exactly 1)`, true);
    }

    // Schema.org validation
    const schemaMatch = indexContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (schemaMatch && schemaMatch[1]) {
        try {
            const parsed = JSON.parse(schemaMatch[1]);
            if (parsed['@graph'] && parsed['@graph'].some(e => e['@id'] && e['@id'].includes('#organization'))) {
                reportPass('Valid base JSON-LD Schema.org graph with stable Organization @id found in index.html');
            } else {
                reportFail('Schema in index.html must use stable @id references for entities', true);
            }
        } catch (e) {
            reportFail(`Invalid JSON-LD in index.html: ${e.message}`, true);
        }
    } else {
        reportFail('No JSON-LD structured data found in index.html', true);
    }
}

// -------------------------------------------------------------
// 8. Audit Reusable Component Architecture
// -------------------------------------------------------------
console.log('\n\x1b[1m8. Checking Reusable Component Architecture...\x1b[0m');
const requiredComponents = [
    { file: 'src/components/common/SEOHead.tsx', desc: 'Centralized SEOHead declarative component' },
    { file: 'src/components/common/Breadcrumbs.tsx', desc: 'Hierarchical Breadcrumbs component' },
    { file: 'src/components/common/AuthorBox.tsx', desc: 'Standardized AuthorBox attribution component' },
    { file: 'src/components/common/AnswerBox.tsx', desc: 'Extractable AnswerBox passage component' },
    { file: 'scripts/routes-loader.cjs', desc: 'Automated CommonJS route loader bridge' },
    { file: 'scripts/generate-sitemap.cjs', desc: 'Automated sitemap generator script' },
    { file: 'scripts/sync-articles-md.cjs', desc: 'Automated article markdown mirror synchronizer' }
];

for (const comp of requiredComponents) {
    const p = path.join(ROOT_DIR, comp.file);
    if (fs.existsSync(p)) {
        reportPass(`Component present: ${comp.desc} (${comp.file})`);
    } else {
        reportFail(`Missing architectural component: ${comp.desc} at ${comp.file}`, true);
    }
}

// -------------------------------------------------------------
// 9. Audit Permanent Antigravity Workspace Rule
// -------------------------------------------------------------
console.log('\n\x1b[1m9. Checking Permanent Antigravity Workspace Rule...\x1b[0m');
const rulePath = path.join(ROOT_DIR, '.agents', 'rules', 'geo-llm-readiness.md');
if (!fs.existsSync(rulePath)) {
    reportFail('Permanent workspace rule .agents/rules/geo-llm-readiness.md is missing', true);
} else {
    const ruleContent = fs.readFileSync(rulePath, 'utf8');
    if (ruleContent.includes('always_on: true')) {
        reportPass('Workspace rule is configured as always_on: true');
    } else {
        reportFail('Workspace rule must be configured with always_on: true', true);
    }
    if (ruleContent.includes('AUTOMATIC') && ruleContent.includes('VALIDATED') && ruleContent.includes('EDITORIAL')) {
        reportPass('Three-tier checklist (AUTOMATIC, VALIDATED, EDITORIAL) defined in rule');
    } else {
        reportFail('Three-tier checklist is missing from workspace rule', true);
    }
    if (ruleContent.includes('26') || ruleContent.includes('Mandatory Architectural Requirements')) {
        reportPass('Mandatory architectural standards comprehensively documented in rule');
    } else {
        reportFail('Permanent rule missing comprehensive architectural requirements', false);
    }
}

// -------------------------------------------------------------
// Summary & Exit Code
// -------------------------------------------------------------
console.log('\n\x1b[1m\x1b[34m========================================================\x1b[0m');
console.log(`\x1b[1mAudit Summary: ${passedChecks} Passed, ${errors.length} Critical Errors, ${warnings.length} Warnings\x1b[0m`);
console.log('\x1b[1m\x1b[34m========================================================\x1b[0m\n');

if (errors.length > 0) {
    console.error('\x1b[31mValidation Failed with the following Critical Errors:\x1b[0m');
    errors.forEach((err, i) => console.error(` ${i + 1}. ${err}`));
    process.exit(1);
} else {
    console.log('\x1b[32m✔ All GEO / AEO / LLM-Readiness architectural checks PASSED successfully!\x1b[0m\n');
    process.exit(0);
}
