#!/usr/bin/env node

/**
 * Public Surface Governance Validator (SiteOS Phase 3)
 *
 * Enforces the standalone-public-tool governance boundary (Phase 2
 * blueprint sec.19 / Phase 3 brief Step 14): every page-producing file
 * under public/ (an .html file specifically -- everything else in public/
 * is a known, already-governed asset/machine-surface type) must be
 * explicitly accounted for, and no dotfile/dotdirectory (dev-tooling
 * config, the exact public/aga/.claude/ class of exposure fixed in this
 * same batch) may exist anywhere under public/ at all.
 *
 * This is the concrete fix for "a random file under public/ can silently
 * become an unmanaged public web property" -- it does not decide the fate
 * of any existing tool, it only requires every one to be declared.
 */

const fs = require('fs');
const path = require('path');
const { loadSiteOS } = require('./siteos-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('\n========================================================');
console.log('   AltruBiz Public Surface Governance Audit (SiteOS)    ');
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

// Known, explicitly-governed static HTML files that are NOT ToolNodes --
// each entry must name why it's allowed to exist ungoverned by a ToolNode.
const KNOWN_STATIC_PAGES = {
    'thank-you.html': 'Governed via robots.txt Disallow (Phase 1 finding, intentional design) -- not a Tool, a post-conversion confirmation page.'
};

function walk(dir, results) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        const rel = path.relative(PUBLIC_DIR, full).replace(/\\/g, '/');
        if (entry.name.startsWith('.')) {
            results.dotEntries.push(rel);
            continue; // don't descend into dotdirs either
        }
        if (entry.isDirectory()) {
            walk(full, results);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
            results.htmlFiles.push(rel);
        }
    }
}

const results = { htmlFiles: [], dotEntries: [] };
walk(PUBLIC_DIR, results);

console.log('1. Auditing for dotfiles/dotdirectories under public/ (dev-tooling exposure)...');
if (results.dotEntries.length === 0) {
    pass('No dotfiles or dotdirectories found under public/ (the public/aga/.claude/ exposure class is now structurally impossible without being caught here).');
} else {
    for (const entry of results.dotEntries) {
        fail(`Dotfile/dotdirectory found under public/: "${entry}" -- this is copied into dist/ by Vite regardless of git-tracking status and would be served on production. Dev-tooling config must never live under public/.`);
    }
}

console.log('\n2. Auditing every .html file under public/ has an explicit governance status...');
const siteos = loadSiteOS();
const toolPaths = new Set(
    siteos.TOOL_NODES
        .filter(t => t.governance !== 'private')
        .map(t => (t.id === 'aga-growth-analyzer' ? 'aga/index.html' : null))
        .filter(Boolean)
);

for (const htmlFile of results.htmlFiles) {
    if (KNOWN_STATIC_PAGES[htmlFile]) {
        pass(`"${htmlFile}" -- ${KNOWN_STATIC_PAGES[htmlFile]}`);
        continue;
    }
    if (toolPaths.has(htmlFile)) {
        const tool = siteos.TOOL_NODES.find(t => t.id === 'aga-growth-analyzer');
        pass(`"${htmlFile}" -- registered ToolNode (id: "${tool.id}", governance: "${tool.governance}").`);
        continue;
    }
    fail(`"${htmlFile}" is an ungoverned public HTML file: not a known static page, not a registered ToolNode. Either register it in src/siteos/config/tools.ts (or KNOWN_STATIC_PAGES above) with an explicit governance status, or remove it.`);
}

console.log('\n========================================================');
console.log(`Public Surface Governance Audit: ${passed} passed, ${failed} failed`);
console.log('========================================================\n');

if (failed > 0) {
    console.error('\x1b[31m✖ Public surface governance audit FAILED.\x1b[0m');
    process.exit(1);
} else {
    console.log('\x1b[32m✔ Every page-producing file under public/ is explicitly governed. No dev-tooling exposure found.\x1b[0m');
}
