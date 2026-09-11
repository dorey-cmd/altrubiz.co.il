#!/usr/bin/env node

/**
 * Route-Render Identity & Anti-Homepage-Fallback Regression Test
 * 
 * Verifies that all deep routes (Articles, Topic Hubs, Static Pages)
 * actually render their own destination content (H1, title, canonical)
 * and NEVER silently fallback to the Homepage.
 */

const fs = require('fs');
const path = require('path');
const { getRoutesRegistry, getAllHubs, getArticles } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('\n========================================================');
console.log('   AltruBiz Route-Render Identity & Anti-Fallback Test   ');
console.log('========================================================\n');

let passed = 0;
let failed = 0;

function reportPass(msg) {
    passed++;
    console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function reportFail(msg) {
    failed++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

const HOMEPAGE_H1 = 'אלטרוביז CRM - להכניס את השיטה לסיסטם';
const HOMEPAGE_TITLE = 'Altrubiz CRM | להכניס את השיטה לסיסטם - אוטומציה ובינה מלאכותית';

// 1. Audit Client-Side Entrypoint in src/main.tsx
console.log('1. Auditing Client-Side Entrypoint (src/main.tsx)...');
const mainTsxPath = path.join(ROOT_DIR, 'src', 'main.tsx');
const mainTsx = fs.readFileSync(mainTsxPath, 'utf8');

if (mainTsx.includes('getRouteConfig')) {
    reportPass('src/main.tsx dynamically verifies routes against getRouteConfig');
} else {
    reportFail('src/main.tsx missing getRouteConfig dynamic route validation!');
}

if (/!\s*currentPath\.startsWith\(['"]\/articles['"]\)/.test(mainTsx)) {
    reportFail('src/main.tsx contains brittle hardcoded path blacklist/whitelist!');
} else {
    reportPass('src/main.tsx does not contain brittle hardcoded path blacklist');
}

// 2. Audit Prerendered Static HTML Files in dist/
if (fs.existsSync(DIST_DIR)) {
    console.log('\n2. Auditing Static Prerendered HTML Files in dist/...');
    const registry = getRoutesRegistry();

    for (const [routePath, config] of Object.entries(registry)) {
        if (config.noindex || routePath === '/offer') continue;

        let htmlPath = path.join(DIST_DIR, routePath === '/' ? 'index.html' : path.join(routePath, 'index.html'));
        if (!fs.existsSync(htmlPath)) {
            htmlPath = path.join(DIST_DIR, `${routePath}.html`);
        }

        if (!fs.existsSync(htmlPath)) {
            reportFail(`Prerendered HTML missing for route: ${routePath}`);
            continue;
        }

        const html = fs.readFileSync(htmlPath, 'utf8');

        // Check Title
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';

        // Check H1
        const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        const h1 = h1Match ? h1Match[1].trim() : '';

        // Check Canonical
        const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
        const canonical = canonicalMatch ? canonicalMatch[1] : '';

        if (!h1) {
            reportFail(`Route "${routePath}" HTML missing <h1> tag`);
            continue;
        }

        if (routePath !== '/' && h1 === HOMEPAGE_H1) {
            reportFail(`Route "${routePath}" silently fell back to Homepage H1 ("${HOMEPAGE_H1}")!`);
            continue;
        }

        if (routePath !== '/' && title === HOMEPAGE_TITLE) {
            reportFail(`Route "${routePath}" silently fell back to Homepage <title>!`);
            continue;
        }

        if (canonical !== config.canonicalUrl) {
            reportFail(`Route "${routePath}" canonical mismatch: found "${canonical}", expected "${config.canonicalUrl}"`);
            continue;
        }

        // Check for unstyled inline fallback header regression
        if (html.includes('style="padding: 20px; text-align: center; border-bottom: 1px solid #eee;"')) {
            reportFail(`Route "${routePath}" contains obsolete unstyled inline header!`);
            continue;
        }

        // Check for Styled Foundation Header
        if (!html.includes('bg-white/90 backdrop-blur-md border-b border-gray-200')) {
            reportFail(`Route "${routePath}" missing styled AltruBiz Foundation Header in #root!`);
            continue;
        }

        // Check that deep routes NEVER contain Homepage body dumps
        if (routePath !== '/') {
            if (html.includes('✨ מתחילים כאן')) {
                reportFail(`Route "${routePath}" accidentally contains Homepage CTA button ("✨ מתחילים כאן")!`);
                continue;
            }
            if (html.includes('ניהול לקוחות מבוזר מבזבז שעות יקרות')) {
                reportFail(`Route "${routePath}" accidentally leaked Homepage pain bar into deep route!`);
                continue;
            }
            if (!html.includes('aria-label="פירורי לחם"')) {
                reportFail(`Route "${routePath}" missing semantic breadcrumbs in initial HTML!`);
                continue;
            }
        }

        reportPass(`Route "${routePath}" validated: H1="${h1.slice(0, 45)}...", canonical="${canonical}" (Foundation layout confirmed)`);
    }
} else {
    console.log('dist/ not found, skipping static file checks (run build first).');
}

console.log('\n========================================================');
console.log(`Summary: ${passed} Passed, ${failed} Failed`);
console.log('========================================================\n');

if (failed > 0) {
    process.exit(1);
}
