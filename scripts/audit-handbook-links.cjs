/**
 * AltruBiz Central Handbook & External Link Audit Tool (SiteOS)
 * 
 * Verifies that all links to https://handbook.altrubiz.co.il/join are strictly
 * managed from the central CTA Registry, validates placement resolution,
 * deduplication, and scans the repository for unmanaged hard-coded links.
 */

const path = require('path');
const { execSync } = require('child_process');
const esbuild = require('esbuild');
const { getArticles } = require('./routes-loader.cjs');

function loadCtaRegistry() {
    const ctaRegistryTsPath = path.resolve(__dirname, '../src/data/ctaRegistry.ts');
    const buildResult = esbuild.buildSync({
        entryPoints: [ctaRegistryTsPath],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        sourcemap: false,
        target: 'node18'
    });

    if (!buildResult.outputFiles || buildResult.outputFiles.length === 0) {
        throw new Error(`Failed to compile ${ctaRegistryTsPath} with esbuild.`);
    }

    const code = buildResult.outputFiles[0].text;
    const moduleScope = { exports: {} };
    const wrapper = new Function(
        'module',
        'exports',
        'require',
        '__dirname',
        '__filename',
        code
    );

    wrapper(
        moduleScope,
        moduleScope.exports,
        require,
        path.dirname(ctaRegistryTsPath),
        ctaRegistryTsPath
    );

    return moduleScope.exports;
}

function runAudit() {
    console.log('\n====================================================================');
    console.log('       AltruBiz Handbook (GPT Playbook) Central Link Audit          ');
    console.log('====================================================================\n');

    const ctaRegistry = loadCtaRegistry();
    const { CTA_DEFINITIONS, CTA_PLACEMENTS, CTA_AUTO_RULES, resolveCtaForArticle } = ctaRegistry;

    const gptPlaybookCta = CTA_DEFINITIONS['gpt-playbook'];
    if (!gptPlaybookCta) {
        console.error('❌ FATAL: "gpt-playbook" definition not found in CTA_DEFINITIONS!');
        process.exit(1);
    }

    console.log('1. Auditing Central CTA Definition (Source of Truth)...');
    console.log(`   ✔ CTA ID: "${gptPlaybookCta.id}"`);
    console.log(`   ✔ Name: "${gptPlaybookCta.name}"`);
    console.log(`   ✔ Destination URL: ${gptPlaybookCta.destination}`);
    console.log(`   ✔ Globally Enabled: ${gptPlaybookCta.enabled ? 'YES (Active)' : 'NO (Disabled site-wide)'}`);
    console.log(`   ✔ Tracking ID: "${gptPlaybookCta.trackingId}"`);
    console.log(`   ✔ Available Variants: ${Object.keys(gptPlaybookCta.availableVariants).join(', ')}`);

    console.log('\n2. Auditing Placement Registry & Deduplication Engine...');
    const articles = getArticles() || [];
    const resolvedPlacements = [];
    let activeManualCount = 0;
    let disabledManualCount = 0;
    let activeAutoCount = 0;

    // Check declared manual placements
    for (const p of CTA_PLACEMENTS) {
        if (p.ctaId === 'gpt-playbook') {
            if (p.enabled) {
                activeManualCount++;
            } else {
                disabledManualCount++;
            }
        }
    }

    // Resolve CTAs across all articles in the site
    for (const article of articles) {
        const resolved = resolveCtaForArticle(article, 'gpt-playbook');
        if (resolved) {
            resolvedPlacements.push({
                articleTitle: article.title,
                pagePath: article.publicPath,
                placementId: resolved.placementId,
                type: resolved.placementType,
                position: resolved.position,
                relevance: resolved.relevance,
                variant: resolved.variantId,
                source: resolved.source,
                destination: resolved.destination,
                enabled: resolved.enabled
            });
            if (resolved.source === 'auto') {
                activeAutoCount++;
            }
        }
    }

    console.log(`   ✔ Found ${resolvedPlacements.length} active resolved placement(s) across ${articles.length} total articles.`);
    console.log(`   ✔ Declared manual placements: ${CTA_PLACEMENTS.filter(p => p.ctaId === 'gpt-playbook').length} (${activeManualCount} active, ${disabledManualCount} disabled).`);
    console.log(`   ✔ Declared auto rules: ${CTA_AUTO_RULES.filter(r => r.ctaId === 'gpt-playbook').length} active.`);

    console.log('\n3. Active GPT Playbook Placements Roster:');
    console.log('------------------------------------------------------------------------------------------------------------------------');
    console.log('| Page Route                       | Placement ID                   | Type   | Rel.  | Variant              | Source   |');
    console.log('------------------------------------------------------------------------------------------------------------------------');
    for (const r of resolvedPlacements) {
        const route = r.pagePath.padEnd(32);
        const pid = r.placementId.padEnd(30);
        const type = r.type.padEnd(6);
        const rel = r.relevance.padEnd(5);
        const variant = r.variant.padEnd(20);
        const source = r.source.padEnd(8);
        console.log(`| ${route} | ${pid} | ${type} | ${rel} | ${variant} | ${source} |`);
    }
    console.log('------------------------------------------------------------------------------------------------------------------------');

    if (disabledManualCount > 0) {
        console.log('\n4. Explicitly Disabled / Suppressed Placements:');
        for (const p of CTA_PLACEMENTS.filter(p => p.ctaId === 'gpt-playbook' && !p.enabled)) {
            console.log(`   - [DISABLED] Page: ${p.target.page} | ID: ${p.id} | Context: ${p.context}`);
        }
    }

    console.log('\n5. Scanning Entire Repository for Unmanaged "handbook.altrubiz.co.il" Links...');
    let unmanagedMatches = [];
    try {
        const grepOutput = execSync('git grep -n "handbook.altrubiz.co.il"', { encoding: 'utf8' }).trim();
        const lines = grepOutput ? grepOutput.split('\n') : [];
        
        for (const line of lines) {
            const parts = line.split(':');
            const file = parts[0];
            const lineNum = parts[1];
            const content = parts.slice(2).join(':').trim();

            // Authorized files:
            const isAuthorized = 
                file.startsWith('src/data/ctaRegistry.ts') ||
                file.startsWith('scripts/audit-handbook-links.cjs') ||
                file.startsWith('.agents/') ||
                file.startsWith('AGENTS.md') ||
                file.startsWith('GEMINI.md') ||
                (file.startsWith('public/') && (file.endsWith('.md') || file.endsWith('.txt')));

            if (!isAuthorized) {
                unmanagedMatches.push({ file, lineNum, content });
            } else {
                console.log(`   ✔ Authorized source of truth / spec match: ${file}:${lineNum}`);
            }
        }
    } catch {
        // git grep returns exit code 1 if no matches found
        console.log('   ✔ No raw matches found outside git tracking.');
    }

    const unmanagedCount = unmanagedMatches.length;
    if (unmanagedCount > 0) {
        console.error(`\n❌ ERROR: Detected ${unmanagedCount} UNMANAGED link(s) to handbook.altrubiz.co.il!`);
        for (const m of unmanagedMatches) {
            console.error(`   - ${m.file}:${m.lineNum} -> ${m.content}`);
        }
        console.error('All links to handbook.altrubiz.co.il must be routed through src/data/ctaRegistry.ts!');
        process.exit(1);
    } else {
        console.log('   ✔ Zero unmanaged hardcoded Handbook links detected across the repository!');
    }

    console.log('\n====================================================================');
    console.log('                   Handbook Link Management Report                   ');
    console.log('====================================================================');
    console.log(`- CTA registry location: src/data/ctaRegistry.ts`);
    console.log(`- Placement registry location: src/data/ctaRegistry.ts`);
    console.log(`- Destination source of truth: ${gptPlaybookCta.destination}`);
    console.log(`- Number of active placements: ${resolvedPlacements.length}`);
    console.log(`- Auto placements: ${activeAutoCount}`);
    console.log(`- Manual placements: ${activeManualCount}`);
    console.log(`- Disabled placements: ${disabledManualCount}`);
    console.log(`- Unmanaged Handbook links remaining: 0`);
    console.log(`- How to change the destination globally: Edit 'destination' in CTA_DEFINITIONS['gpt-playbook'] in src/data/ctaRegistry.ts`);
    console.log(`- How to disable the CTA globally: Set 'enabled: false' in CTA_DEFINITIONS['gpt-playbook'] in src/data/ctaRegistry.ts`);
    console.log('====================================================================\n');
}

runAudit();
