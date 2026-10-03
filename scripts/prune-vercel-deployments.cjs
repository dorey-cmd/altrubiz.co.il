#!/usr/bin/env node

/**
 * AltruBiz Vercel Deployment Pruner (SiteOS Branch Lifecycle, step "prune deployments")
 *
 * Every push creates a deployment that stores a full copy of the site. Hobby has a 10 GB
 * deployment-storage quota, so deployments that nobody can use anymore must not pile up.
 *
 * KEEPS:
 *   - the current production deployment (always; it is what altrubiz.co.il serves)
 *   - the newest READY preview of every branch that still exists on GitHub (open work / awaiting approval)
 *   - (optional) --keep-previous-production : the newest older production deployment as a rollback buffer
 * DELETES everything else: old production versions, and previews of merged / deleted branches.
 *
 * Default is a DRY RUN. Add --apply to delete.
 *
 * Requires an authenticated Vercel CLI on this machine (`npx vercel login` once).
 *
 * Usage:
 *   npm run vercel:prune                         (report only)
 *   npm run vercel:prune -- --apply              (delete)
 *   npm run vercel:prune -- --apply --keep-previous-production
 */

const { execSync } = require('child_process');

const PROJECT = process.env.VERCEL_PROJECT || 'altrubiz-co-il';
const TEAM = process.env.VERCEL_TEAM || 'doreys-projects-c0716210';
const APPLY = process.argv.includes('--apply');
const KEEP_PREV_PROD = process.argv.includes('--keep-previous-production');

const run = (cmd, opts = {}) => execSync(cmd, { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'], ...opts });
const vercelApi = (args) => run(`npx --yes vercel@latest api ${args} --raw`);

function parseJson(text) {
    const i = text.search(/[\[{]/);
    return JSON.parse(text.slice(i));
}

function remoteBranches() {
    const out = run('git ls-remote --heads origin');
    return new Set(out.split('\n').filter(Boolean).map((l) => l.split('\trefs/heads/')[1]).filter(Boolean));
}

async function main() {
    console.log(`\nVercel deployment pruner  |  project: ${PROJECT}  |  mode: ${APPLY ? 'APPLY (deleting)' : 'DRY RUN (nothing is deleted)'}\n`);

    const project = parseJson(vercelApi(`"/v9/projects/${PROJECT}?teamId=${TEAM}"`));
    const prodId = project.targets && project.targets.production && project.targets.production.id;
    if (!prodId) throw new Error('Could not determine the current production deployment; refusing to continue.');

    // Paginated list -> JSON array
    let deployments = parseJson(vercelApi(`"/v6/deployments?projectId=${PROJECT}&teamId=${TEAM}&limit=100" --paginate`));
    if (!Array.isArray(deployments)) deployments = deployments.deployments || [];
    const byId = new Map(); deployments.forEach((d) => byId.set(d.uid, d));
    deployments = [...byId.values()].sort((a, b) => b.created - a.created);

    const live = remoteBranches();
    const keep = new Map(); keep.set(prodId, 'current production');

    const seenBranch = new Set();
    for (const d of deployments) {
        if (d.target === 'production') continue;
        const ref = d.meta && d.meta.githubCommitRef;
        if (d.state !== 'READY' || !ref || !live.has(ref) || seenBranch.has(ref)) continue;
        seenBranch.add(ref); keep.set(d.uid, `latest preview of open branch ${ref}`);
    }
    if (KEEP_PREV_PROD) {
        const prev = deployments.find((d) => d.target === 'production' && d.uid !== prodId && d.state === 'READY');
        if (prev) keep.set(prev.uid, 'previous production (rollback buffer)');
    }

    const remove = deployments.filter((d) => !keep.has(d.uid));
    console.log(`Deployments: ${deployments.length}  |  keep: ${keep.size}  |  delete: ${remove.length}\n`);
    for (const [id, why] of keep) console.log(`  KEEP    ${id}  ${why}`);
    for (const d of remove.slice(0, 15)) console.log(`  DELETE  ${d.uid}  ${d.target || 'preview'}  ${(d.meta && d.meta.githubCommitRef) || '-'}  ${new Date(d.created).toISOString().slice(0, 10)}`);
    if (remove.length > 15) console.log(`  ... and ${remove.length - 15} more`);

    if (!APPLY) { console.log('\nDry run only. Re-run with --apply to delete.\n'); return; }

    let ok = 0, failed = 0;
    for (const d of remove) {
        if (d.uid === prodId) continue;   // belt and braces
        try { vercelApi(`"/v13/deployments/${d.uid}?teamId=${TEAM}" -X DELETE --dangerously-skip-permissions`); ok++; }
        catch (e) { failed++; console.error(`  FAILED ${d.uid}: ${String(e.message).split('\n')[0]}`); }
    }
    console.log(`\nDeleted ${ok}, failed ${failed}. Production (${prodId}) untouched.\n`);
    if (failed) process.exit(1);
}

main().catch((e) => { console.error('Pruner failed:', e.message); process.exit(1); });
