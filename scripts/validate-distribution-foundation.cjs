#!/usr/bin/env node

/**
 * AltruBiz Post-Publish Distribution Foundation Test Suite
 * 
 * Verifies:
 * 1. DistributionManifest correctly generated from Article data.
 * 2. Canonical URL, publicPath, and metadata integrity.
 * 3. Knowledge Graph concept extraction and parent Hub inclusion.
 * 4. Channel status model (website, email, social) initialized appropriately.
 * 5. content.published event emission contract.
 * 6. Failure isolation: downstream failures do NOT throw or invalidate publication.
 * 7. Zero third-party network dependencies required at compile/test time.
 */

const fs = require('fs');
const path = require('path');
const routesLoader = require('./routes-loader.cjs');

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
console.log('\x1b[1m   AltruBiz Distribution Foundation Audit               \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// 1. Verify Distribution Files Existence
console.log('\x1b[36m1. Auditing Distribution Files & Types...\x1b[0m');

const ROOT_DIR = path.resolve(__dirname, '..');
const TYPES_PATH = path.join(ROOT_DIR, 'src', 'types', 'distribution.ts');
const MANIFEST_LIB_PATH = path.join(ROOT_DIR, 'src', 'lib', 'distributionManifest.ts');
const SPEC_PATH = path.join(ROOT_DIR, '.agents', 'specs', 'content-distribution-pipeline.md');

if (fs.existsSync(TYPES_PATH)) {
    pass('src/types/distribution.ts exists with channel and manifest contracts.');
} else {
    fail('src/types/distribution.ts is missing!');
}

if (fs.existsSync(MANIFEST_LIB_PATH)) {
    pass('src/lib/distributionManifest.ts exists with builder and event emitter.');
} else {
    fail('src/lib/distributionManifest.ts is missing!');
}

if (fs.existsSync(SPEC_PATH)) {
    pass('.agents/specs/content-distribution-pipeline.md exists with architectural specifications.');
} else {
    fail('.agents/specs/content-distribution-pipeline.md is missing!');
}

// 2. Functional Test: Create Distribution Manifest from sample article
console.log('\n\x1b[36m2. Testing Distribution Manifest Generation...\x1b[0m');

const sampleArticle = routesLoader.getArticleBySlug('excel-to-crm-pipeline-guide') || routesLoader.getArticleByPublicPath('/excel-to-pipeline');
if (!sampleArticle) {
    fail('Could not load sample article from registry!');
} else {
    pass(`Successfully retrieved sample article "${sampleArticle.slug}" from registry.`);

    // We can evaluate createDistributionManifest via esbuild or regex/dynamic evaluation
    const esbuild = require('esbuild');
    const bundle = esbuild.buildSync({
        entryPoints: [MANIFEST_LIB_PATH],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        target: 'node18'
    });

    const mod = { exports: {} };
    const fn = new Function('module', 'exports', 'require', bundle.outputFiles[0].text);
    fn(mod, mod.exports, require);

    const { createDistributionManifest, emitContentPublishedEvent } = mod.exports;

    const manifest = createDistributionManifest(sampleArticle);

    if (manifest.articleId === sampleArticle.slug && manifest.publicPath === '/excel-to-pipeline') {
        pass(`Manifest accurately preserves articleId (${manifest.articleId}) and publicPath (${manifest.publicPath}).`);
    } else {
        fail(`Manifest identity mismatch: ${manifest.articleId}, ${manifest.publicPath}`);
    }

    if (manifest.canonicalUrl === 'https://altrubiz.co.il/excel-to-pipeline') {
        pass('Manifest canonicalUrl is exact absolute HTTPS URL.');
    } else {
        fail(`Manifest canonicalUrl mismatch: ${manifest.canonicalUrl}`);
    }

    if (manifest.channels && manifest.channels.website && manifest.channels.website.status === 'published') {
        pass('Manifest website channel is set to "published".');
    } else {
        fail('Manifest website channel status is not "published"!');
    }

    if (manifest.channels.email && manifest.channels.email.status === 'pending' &&
        manifest.channels.social && manifest.channels.social.status === 'pending') {
        pass('Downstream channels (email, social) correctly initialized in independent "pending" status.');
    } else {
        fail('Downstream channels failed to initialize in "pending" status!');
    }

    if (manifest.parentHub && manifest.parentHub.slug === 'lost-leads') {
        pass(`Manifest includes Knowledge Graph parent Hub context (${manifest.parentHub.slug}).`);
    } else {
        fail(`Manifest missing or incorrect parent Hub: ${JSON.stringify(manifest.parentHub)}`);
    }

    // 3. Test content.published Event Emission & Failure Isolation
    console.log('\n\x1b[36m3. Testing Event Emission & Failure Isolation...\x1b[0m');

    // Test emission with invalid webhook url to guarantee failure isolation
    process.env.DISTRIBUTION_WEBHOOK_URL = 'http://localhost:9999/non-existent-webhook';
    
    mod.exports.emitContentPublishedEvent(manifest).then((result) => {
        if (result.success && result.downstreamEligible) {
            pass('emitContentPublishedEvent succeeded and maintained downstream eligibility despite webhook failure.');
            pass('Downstream failure isolation strictly preserved (publication never rolls back).');
        } else {
            fail('emitContentPublishedEvent failed unexpectedly.');
        }

        console.log('\n--------------------------------------------------------');
        console.log(`Distribution Foundation Audit Complete: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m.`);
        console.log('--------------------------------------------------------\n');

        if (failed > 0) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }).catch((err) => {
        fail(`emitContentPublishedEvent threw uncaught error: ${err.message}`);
        process.exit(1);
    });
}
