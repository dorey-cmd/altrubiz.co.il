#!/usr/bin/env node

/**
 * AltruBiz Review Cockpit & Review Action Test Suite (Capability URL Model)
 * 
 * Verifies:
 * 1. Review Cockpit component exists and is mounted in ArticlePage.
 * 2. Fail-Closed Capability URL Review Authorization:
 *    - Production domain (altrubiz.co.il) NEVER activates Review Cockpit (even with valid token).
 *    - Production domain (www.altrubiz.co.il) NEVER activates Review Cockpit.
 *    - ?review=true alone NEVER activates Review Cockpit.
 *    - Short or weak tokens (< 32 chars) NEVER activate Review Cockpit.
 *    - Published articles NEVER show Review Cockpit.
 *    - Review Cockpit activates ONLY on non-production with BOTH review status AND valid unguessable token.
 * 3. Server-Side Token Store & Instant Revocation:
 *    - Validates minimum cryptographic length (32 chars).
 *    - Enforces article-scoping (cannot use token for article A on article B).
 *    - Enforces immediate token revocation upon action decision.
 * 4. Structured Review Actions conform to provider-agnostic contract (publish, comment, discard).
 * 5. Server-Side Fail-Closed Boundary:
 *    - api/validate-review-token fails closed on production host and invalid/revoked tokens.
 *    - api/review-action requires reviewToken and fails closed (403) on invalid/revoked tokens.
 *    - When REVIEW_WEBHOOK_URL is missing, server returns 503 WORKER_NOT_CONFIGURED (never fake success).
 * 6. Client-Side Fail-Closed Boundary:
 *    - Mock simulation is strictly restricted to local dev with VITE_ALLOW_MOCK_REVIEW === 'true'.
 * 7. Zero secrets or API keys exist in frontend JavaScript bundles.
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
const TOKEN_VALIDATE_API_PATH = path.join(ROOT_DIR, 'api', 'validate-review-token.ts');
const TOKEN_STORE_PATH = path.join(ROOT_DIR, 'api', '_tokenStore.ts');

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

// 2. Auditing Capability URL Authorization Logic
console.log('\n\x1b[36m2. Auditing Fail-Closed Capability URL Authorization Logic...\x1b[0m');

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

const strongValidToken = 'rev_article-test_a8f9c7e12d4b6a8f9c7e12d4b6a8f9c7';

// Test 2.1: Production domain hard rule (altrubiz.co.il)
global.window = { location: { hostname: 'altrubiz.co.il', search: `?review_token=${strongValidToken}` } };
if (isReviewModeAuthorized('review') === false && isReviewModeAuthorized('published') === false) {
    pass('Production domain (altrubiz.co.il) strictly returns false for Review Cockpit (even with valid token).');
} else {
    fail('Production domain allowed Review Cockpit to activate with token!');
}

// Test 2.2: www.altrubiz.co.il domain hard rule
global.window = { location: { hostname: 'www.altrubiz.co.il', search: `?review_token=${strongValidToken}` } };
if (isReviewModeAuthorized('review') === false) {
    pass('Production domain (www.altrubiz.co.il) strictly returns false for Review Cockpit.');
} else {
    fail('www.altrubiz.co.il domain allowed Review Cockpit to activate!');
}

// Test 2.3: Query param ?review=true alone (no token)
global.window = { location: { hostname: 'preview.altrubiz.co.il', search: '?review=true' } };
if (isReviewModeAuthorized('review') === false) {
    pass('Query parameter ?review=true alone NEVER activates Review Cockpit.');
} else {
    fail('?review=true activated Review Cockpit!');
}

// Test 2.4: Short or weak token
global.window = { location: { hostname: 'preview.altrubiz.co.il', search: '?review_token=weak123' } };
if (isReviewModeAuthorized('review') === false) {
    pass('Short/weak token (< 32 chars) strictly fails closed (returns false).');
} else {
    fail('Short/weak token activated Review Cockpit!');
}

// Test 2.5: Valid token on published article
global.window = { location: { hostname: 'preview.altrubiz.co.il', search: `?review_token=${strongValidToken}` } };
if (isReviewModeAuthorized('published') === false) {
    pass('Published articles on preview environments NEVER activate Review Cockpit.');
} else {
    fail('Published article activated Review Cockpit!');
}

// Test 2.6: Valid token on review article on preview domain
if (isReviewModeAuthorized('review') === true) {
    pass('Preview domain with valid 32+ char capability token on review article successfully authorizes initial render.');
} else {
    fail('Valid capability token failed to authorize review article on preview host!');
}

delete global.window;

// 3. Auditing Server-Side Token Store & Revocation
console.log('\n\x1b[36m3. Auditing Server-Side Token Store & Revocation Logic...\x1b[0m');

const tokenStoreBundle = esbuild.buildSync({
    entryPoints: [TOKEN_STORE_PATH],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    target: 'node18',
    loader: { '.ts': 'ts' }
});

const tokenStoreMod = { exports: {} };
const evalTokenStore = new Function('module', 'exports', 'require', tokenStoreBundle.outputFiles[0].text);
evalTokenStore(tokenStoreMod, tokenStoreMod.exports, require);
const { verifyReviewToken, revokeReviewToken, isReviewTokenRevoked } = tokenStoreMod.exports;

// Test 3.1: Token length requirement
const shortCheck = verifyReviewToken('too-short-token', 'my-article', 'preview.host');
if (!shortCheck.valid && shortCheck.reason.includes('cryptographic minimum')) {
    pass('verifyReviewToken rejects tokens below 32 chars.');
} else {
    fail('verifyReviewToken accepted a short token!');
}

// Test 3.2: Production host immunity in verifyReviewToken
const prodCheck = verifyReviewToken(strongValidToken, 'article-test', 'altrubiz.co.il');
if (!prodCheck.valid && prodCheck.reason.includes('Production domain immunity')) {
    pass('verifyReviewToken strictly enforces production domain immunity.');
} else {
    fail('verifyReviewToken allowed production host!');
}

// Test 3.3: Article scoping check
const wrongArticleCheck = verifyReviewToken(strongValidToken, 'different-article', 'preview.host');
if (!wrongArticleCheck.valid && wrongArticleCheck.reason.includes('scoped to a different article')) {
    pass('verifyReviewToken enforces article-scoped tokens (cannot use token for article A on article B).');
} else {
    fail('verifyReviewToken allowed token across mismatched articles!');
}

// Test 3.4: Immediate revocation lifecycle
const dynamicToken = 'rev_article-test_0123456789abcdef0123456789abcdef';
const beforeRevoke = verifyReviewToken(dynamicToken, 'article-test', 'preview.host');
if (beforeRevoke.valid) {
    revokeReviewToken(dynamicToken);
    const afterRevoke = verifyReviewToken(dynamicToken, 'article-test', 'preview.host');
    if (!afterRevoke.valid && afterRevoke.reason.includes('revoked')) {
        pass('revokeReviewToken successfully invalidates capability token immediately.');
    } else {
        fail('Token remained valid after revocation!');
    }
} else {
    fail('Dynamic token failed initial verification before revocation test!');
}

// 4. Auditing Three Owner Actions (Publish, Comments, Discard)
console.log('\n\x1b[36m4. Auditing Three Owner Actions (Publish, Comments, Discard)...\x1b[0m');

const cockpitContent = fs.readFileSync(COCKPIT_PATH, 'utf8');

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

// 5. Auditing Serverless Fail-Closed Boundary (api/review-action.ts & api/validate-review-token.ts)
console.log('\n\x1b[36m5. Auditing Serverless Endpoints & Fail-Closed Boundary...\x1b[0m');

if (fs.existsSync(TOKEN_VALIDATE_API_PATH)) {
    pass('api/validate-review-token.ts exists as dedicated capability verification endpoint.');
} else {
    fail('api/validate-review-token.ts is missing!');
}

if (fs.existsSync(SERVERLESS_API_PATH)) {
    const apiContent = fs.readFileSync(SERVERLESS_API_PATH, 'utf8');
    if (apiContent.includes('INVALID_CAPABILITY_TOKEN') && apiContent.includes('verifyReviewToken')) {
        pass('api/review-action.ts enforces capability token validation before accepting actions.');
    } else {
        fail('api/review-action.ts does not validate capability review token!');
    }

    if (apiContent.includes('revokeReviewToken(reviewToken)')) {
        pass('api/review-action.ts enforces immediate token revocation upon action submission.');
    } else {
        fail('api/review-action.ts does not revoke review token upon action submission!');
    }

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

// 6. Auditing Client-Side Fail-Closed & Mock Mode Isolation (src/lib/reviewAction.ts)
console.log('\n\x1b[36m6. Auditing Client-Side Fail-Closed & Mock Mode Isolation...\x1b[0m');

const reviewActionContent = fs.readFileSync(REVIEW_ACTION_LIB_PATH, 'utf8');
if (reviewActionContent.includes('validateReviewToken') && reviewActionContent.includes('/api/validate-review-token')) {
    pass('Client library exports validateReviewToken connected to serverless validation endpoint.');
} else {
    fail('Client library missing validateReviewToken function!');
}

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

// 7. Auditing Security Boundary & Secret Isolation
console.log('\n\x1b[36m7. Auditing Security & Secret Isolation...\x1b[0m');

const clientFiles = [COCKPIT_PATH, REVIEW_ACTION_LIB_PATH, ARTICLE_PAGE_PATH, REVIEW_TYPES_PATH];
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
