#!/usr/bin/env node

/**
 * AltruBiz Release Gate Orchestrator
 * 
 * The authoritative gatekeeper for the Site Operating System.
 * Enforces zero violations before content or code can reach production.
 * 
 * Pipeline Execution Order (Fail-Fast & Zero Redundancy):
 * 1. Article Readiness & Lifecycle:  npm run test:article-ready
 * 2. TypeScript Compilation:        npx tsc -b
 * 3. URL Architecture & Migration:  node scripts/validate-url-migration.cjs
 * 4. Review Cockpit & Security:     npm run test:review-cockpit
 * 5. Distribution Foundation:       npm run test:distribution
 * 6. Production Build & Generator:  npm run build
 *    (prebuild: og, sync-md, llms, sitemap, test:geo, test:machine -> vite build -> prerender -> test:render)
 * 7. Conversion Context Isolation:  npm run test:conversion
 * 8. Scroll Sovereignty Integrity:  npm run test:scroll
 * 9. Runtime Semantic Link Audit:   npm run test:semantic
 */

const { execSync } = require('child_process');

console.log('\n\x1b[1m\x1b[35m====================================================================\x1b[0m');
console.log('\x1b[1m\x1b[37m   AltruBiz Authoritative Release Gate (Site Operating System)       \x1b[0m');
console.log('\x1b[1m\x1b[35m====================================================================\x1b[0m\n');

const STEPS = [
    {
        name: 'Step 1/9: Article Readiness & Publication Lifecycle',
        cmd: 'node scripts/validate-article-ready.cjs'
    },
    {
        name: 'Step 2/9: TypeScript Compilation',
        cmd: 'npx tsc -b'
    },
    {
        name: 'Step 3/9: URL Architecture & Canonical Migration',
        cmd: 'node scripts/validate-url-migration.cjs'
    },
    {
        name: 'Step 4/9: Editorial Review Cockpit & Security Layer',
        cmd: 'node scripts/validate-review-cockpit.cjs'
    },
    {
        name: 'Step 5/9: Content Distribution Foundation & Failure Isolation',
        cmd: 'node scripts/validate-distribution-foundation.cjs'
    },
    {
        name: 'Step 6/9: Full Production Build & Asset Pipeline',
        cmd: 'npm run build'
    },
    {
        name: 'Step 7/9: Context-Aware Conversion Engine Isolation',
        cmd: 'node scripts/validate-conversion-context.cjs'
    },
    {
        name: 'Step 8/9: Scroll Sovereignty & Sticky Sidebar Integrity',
        cmd: 'node scripts/validate-scroll-sovereignty.cjs'
    },
    {
        name: 'Step 9/9: Runtime Semantic Graph & Corpus Link Audit',
        cmd: 'node scripts/validate-runtime-semantic-links.cjs'
    }
];

const startTime = Date.now();

for (let i = 0; i < STEPS.length; i++) {
    const step = STEPS[i];
    console.log(`\n\x1b[1m\x1b[34m▶ [RELEASE GATE] ${step.name}\x1b[0m`);
    console.log(`\x1b[90m$ ${step.cmd}\x1b[0m\n`);

    const stepStart = Date.now();
    try {
        execSync(step.cmd, { stdio: 'inherit', env: process.env });
        const stepDuration = ((Date.now() - stepStart) / 1000).toFixed(1);
        console.log(`\x1b[32m✔ Completed in ${stepDuration}s\x1b[0m`);
    } catch (err) {
        console.error(`\n\x1b[1m\x1b[31m✖ [RELEASE GATE FAILED] ${step.name} failed!\x1b[0m`);
        console.error(`\x1b[31mExecution halted. Refusing publication / deployment to production.\x1b[0m\n`);
        process.exit(1);
    }
}

const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);

console.log('\n\x1b[1m\x1b[32m====================================================================\x1b[0m');
console.log(`\x1b[1m\x1b[32m✔ TECHNICAL RELEASE GATE PASSED: ALL 9 STAGES VERIFIED (${totalDuration}s)\x1b[0m`);
console.log('\x1b[1m\x1b[32m  Site OS code, schema, and routing architecture are 100% verified. \x1b[0m');
console.log('\x1b[36m  Note: External review-worker integration (Claude/Gemini/Webhook)    \x1b[0m');
console.log('\x1b[36m  is an operational configuration step and will fail closed if unset. \x1b[0m');
console.log('\x1b[1m\x1b[32m====================================================================\x1b[0m\n');
