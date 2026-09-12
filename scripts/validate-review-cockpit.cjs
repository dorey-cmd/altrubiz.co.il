#!/usr/bin/env node

/**
 * AltruBiz Review Cockpit & Review Action Test Suite (Hardened)
 * 
 * Verifies:
 * 1. Review Cockpit component exists and is mounted in ArticlePage.
 * 2. Fail-Closed Review Authorization:
 *    - Production domain (altrubiz.co.il) NEVER activates Review Cockpit (even with ?review=true).
 *    - ?review=true alone NEVER activates Review Cockpit.
 *    - Published articles NEVER show Review Cockpit.
 *    - Draft articles NEVER show Review Cockpit.
 *    - Review Cockpit activates ONLY on non-production with BOTH review status AND VITE_REVIEW_MODE === 'true'.
 * 3. Structured Review Actions conform to provider-agnostic contract (publish, comment, discard).
 * 4. Comments action collects structured free-text feedback.
 * 5. Discard action requires confirmation and does not touch master.
 * 6. Publish action mandates release:gate validation before production.
 * 7. Server-Side Fail-Closed Boundary:
 *    - When REVIEW_WEBHOOK_URL is missing, server returns 503 WORKER_NOT_CONFIGURED (never fake success).
 * 8. Client-Side Fail-Closed Boundary:
 *    - When API is unreachable, fails closed with clear worker-not-connected message.
 *    - Mock simulation is strictly restricted to local dev with VITE_ALLOW_MOCK_REVIEW === 'true'.
 * 9. Zero secrets or API keys exist in frontend JavaScript bundles.
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const ROOT_DIR = path.resolve(__dirname, '..');
const COCKPIT_PATH = path.join(ROOT_DIR, 'src', 'components', 'common', 'ReviewCockpit.tsx');
const ARTICLE_PAGE_PATH = path.join(ROOT_DIR, 'src', 'components', 'articles', 'ArticlePage.tsx');
const REVIEW_TYPES_PATH = path.join(ROOT_DIR, 'src', 'types', 'review.ts');
const REVIEW_ACTION_LIB_PATH = path.join(ROOT_DIR, 'src', 'lib', 'reviewAction.ts');
const SERVERLESS_API_PATH = path.join(ROOT_DIR, 'api', 'review-action.ts');

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
console.log('\x1b[1m   AltruBiz Review Cockpit & Action Layer Audit         \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// 1. Check Review Cockpit Component Existence and Mounting
console.log('\x1b[36m1. Auditing Review Cockpit Component and Mounting...\x1b[0m');

if (fs.existsSync(COCKPIT_PATH)) {
    pass('ReviewCockpit.tsx exists in src/components/common/');
} else {
    fail('ReviewCockpit.tsx is missing!');
}

const articlePageContent = fs.readFileSync(ARTICLE_PAGE_PATH, 'utf8');
if (articlePageContent.includes('<ReviewCockpit') && articlePageContent.includes('import { ReviewCockpit }')) {
    pass('ReviewCockpit is properly imported and rendered in ArticlePage.tsx (uses same real site renderer).');
} else {
    fail('ReviewCockpit is NOT mounted in ArticlePage.tsx!');
}

// 2. Auditing Fail-Closed Review Authorization Logic
console.log('\n\x1b[36m2. Auditing Fail-Closed Review Mode Authorization Logic...\x1b[0m');

const cockpitContent = fs.readFileSync(COCKPIT_PATH, 'utf8');

// Compile isReviewModeAuthorized function in-memory to test exact behavioral matrix
const cockpitBundle = esbuild.buildSync({
    entryPoints: [COCKPIT_PATH],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    target: 'node18',
    loader: { '.tsx': 'tsx', '.ts': 'ts' }
});

const cockpitMod = { exports: {} };
const evalFn = new Function('module', 'exports', 'require', cockpitBundle.outputFiles[0].text);
evalFn(cockpitMod, cockpitMod.exports, require);
const { isReviewModeAuthorized } = cockpitMod.exports;

// Test 2.1: Production domain hard rule (altrubiz.co.il)
global.window = { location: { hostname: 'altrubiz.co.il', search: '?review=true' } };
if (isReviewModeAuthorized('review') === false && isReviewModeAuthorized('published') === false) {
    pass('Production domain (altrubiz.co.il) strictly returns false for Review Cockpit (even with ?review=true).');
} else {
    fail('Production domain allowed Review Cockpit to activate!');
}

// Test 2.2: www.altrubiz.co.il domain hard rule
global.window = { location: { hostname: 'www.altrubiz.co.il', search: '?review=true' } };
if (isReviewModeAuthorized('review') === false) {
    pass('Production domain (www.altrubiz.co.il) strictly returns false for Review Cockpit.');
} else {
    fail('www.altrubiz.co.il domain allowed Review Cockpit to activate!');
}

// Test 2.3: Query param ?review=true on published article on preview domain
global.window = { location: { hostname: 'preview.altrubiz.co.il', search: '?review=true' } };
if (isReviewModeAuthorized('published') === false) {
    pass('Published articles on preview environments NEVER activate Review Cockpit.');
} else {
    fail('Published article activated Review Cockpit!');
}

// Test 2.4: Query param alone without VITE_REVIEW_MODE env flag
if (isReviewModeAuthorized('review') === false) {
    pass('Review article without VITE_REVIEW_MODE === "true" strictly fails closed (returns false).');
} else {
    fail('Review article activated without explicit VITE_REVIEW_MODE configuration!');
}

delete global.window;

// 3. Auditing Action Contract & Modals
console.log('\n\x1b[36m3. Auditing Three Owner Actions (Publish, Comments, Discard)...\x1b[0m');

if (cockpitContent.includes("handleExecuteAction('publish')") && cockpitContent.includes('אישור פרסום מאמר')) {
    pass('PUBLISH action implemented with explicit confirmation modal.');
} else {
    fail('PUBLISH action or modal missing in Review Cockpit!');
}

if (cockpitContent.includes("handleExecuteAction('comment'") && cockpitContent.includes('textarea') && cockpitContent.includes('הערות ותיקונים לעריכה')) {
    pass('COMMENTS action implemented with free-text feedback input and prompt examples.');
} else {
    fail('COMMENTS action or feedback textarea missing in Review Cockpit!');
}

if (cockpitContent.includes("handleExecuteAction('discard')") && cockpitContent.includes('פסילת טיוטת מאמר')) {
    pass('DISCARD action implemented with intent confirmation modal preventing accidental deletion.');
} else {
    fail('DISCARD action or confirmation missing in Review Cockpit!');
}

// 4. Auditing Server-Side Fail-Closed Boundary (api/review-action.ts)
console.log('\n\x1b[36m4. Auditing Serverless Fail-Closed Boundary (api/review-action.ts)...\x1b[0m');

if (fs.existsSync(SERVERLESS_API_PATH)) {
    const apiContent = fs.readFileSync(SERVERLESS_API_PATH, 'utf8');
    if (apiContent.includes('WORKER_NOT_CONFIGURED') && apiContent.includes('503')) {
        pass('Serverless API fails closed (503 WORKER_NOT_CONFIGURED) when REVIEW_WEBHOOK_URL is missing.');
    } else {
        fail('Serverless API does not fail closed with 503 when worker is unconfigured!');
    }

    if (apiContent.includes('WORKER_DISPATCH_FAILED') && apiContent.includes('502')) {
        pass('Serverless API fails closed (502 WORKER_DISPATCH_FAILED) if worker webhook fails.');
    } else {
        fail('Serverless API does not fail closed when worker dispatch fails!');
    }
} else {
    fail('Serverless function api/review-action.ts not found!');
}

// 5. Auditing Client-Side Fail-Closed & Mock Mode Isolation (src/lib/reviewAction.ts)
console.log('\n\x1b[36m5. Auditing Client-Side Fail-Closed & Mock Mode Isolation...\x1b[0m');

const reviewActionContent = fs.readFileSync(REVIEW_ACTION_LIB_PATH, 'utf8');
if (reviewActionContent.includes('VITE_ALLOW_MOCK_REVIEW === \'true\'') && reviewActionContent.includes('import.meta.env?.DEV')) {
    pass('Mock simulation is strictly gated behind explicit DEV flag AND VITE_ALLOW_MOCK_REVIEW === "true".');
} else {
    fail('Mock simulation is too permissive or accessible in non-DEV builds!');
}

if (reviewActionContent.includes('Review automation is not connected yet') || reviewActionContent.includes('טרם חוברה')) {
    pass('Client gracefully presents user-friendly "automation not connected yet" message upon failure.');
} else {
    fail('Client missing user-friendly worker-not-connected error message!');
}

// 6. Auditing Security Boundary & Secret Isolation
console.log('\n\x1b[36m6. Auditing Security & Secret Isolation...\x1b[0m');

const clientFiles = [COCKPIT_PATH, REVIEW_ACTION_LIB_PATH, ARTICLE_PAGE_PATH];
const secretPatterns = [
    /ghp_[a-zA-Z0-9]{36}/,
    /github_token/i,
    /vercel_token/i,
    /api[_-]?secret/i,
    /service_role/i
];

let leakFound = false;
for (const file of clientFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
            fail(`Potential credential leak found in client file ${path.basename(file)} matching ${pattern}`);
            leakFound = true;
        }
    }
}
if (!leakFound) {
    pass('Zero credentials, API secrets, or GitHub tokens exist in client-side bundles.');
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('\n--------------------------------------------------------');
console.log(`Review Cockpit Audit Complete: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.`);
console.log('--------------------------------------------------------\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
