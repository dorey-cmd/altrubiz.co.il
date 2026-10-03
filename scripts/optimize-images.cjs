#!/usr/bin/env node

/**
 * AltruBiz Image Optimizer (SiteOS: modern image formats)
 *
 * Converts content images under public/images (JPG/PNG) to WebP (quality 90, visually
 * lossless), deletes the originals, and rewrites exact path references in
 * src/, scripts/ and index.html.
 *
 * Kept as JPEG on purpose (social crawlers): public/images/articles/og/** (generated at
 * build) and public/images/og-altrubiz-main.jpg.
 *
 * Usage:  npm run images:optimize
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const KEEP = new Set(['public/images/og-altrubiz-main.jpg']);
const QUALITY = 90;

function* walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(p);
        else yield p;
    }
}
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

/** Content images that should be WebP (exported for the validator). */
function findLegacyImages() {
    const out = [];
    for (const abs of walk(path.join(ROOT, 'public', 'images'))) {
        const r = rel(abs);
        if (!/\.(jpe?g|png)$/i.test(r)) continue;
        if (r.startsWith('public/images/articles/og/') || KEEP.has(r)) continue;
        out.push({ abs, rel: r, bytes: fs.statSync(abs).size });
    }
    return out;
}

async function main() {
    const legacy = findLegacyImages();
    if (legacy.length === 0) { console.log('No legacy JPG/PNG content images found. Nothing to do.'); return; }

    const mapping = new Map();
    let before = 0, after = 0;
    for (const img of legacy) {
        const out = img.abs.replace(/\.(jpe?g|png)$/i, '.webp');
        await sharp(img.abs).rotate().webp({ quality: QUALITY, effort: 6 }).toFile(out);
        const size = fs.statSync(out).size;
        if (size >= img.bytes * 0.9) { fs.unlinkSync(out); console.log(`  kept (WebP not smaller): ${img.rel}`); continue; }
        fs.unlinkSync(img.abs);
        mapping.set('/' + img.rel.replace(/^public\//, ''), '/' + rel(out).replace(/^public\//, ''));
        before += img.bytes; after += size;
    }
    console.log(`Converted ${mapping.size} image(s): ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

    const targets = [path.join(ROOT, 'index.html')];
    for (const d of ['src', 'scripts']) for (const f of walk(path.join(ROOT, d))) if (/\.(ts|tsx|cjs|js|css)$/.test(f)) targets.push(f);
    let refs = 0;
    for (const f of targets) {
        let s = fs.readFileSync(f, 'utf8'), n = 0;
        for (const [from, to] of mapping) { const c = s.split(from).length - 1; if (c) { s = s.split(from).join(to); n += c; } }
        if (n) { fs.writeFileSync(f, s, 'utf8'); refs += n; console.log(`  ${rel(f)}: ${n} reference(s)`); }
    }
    console.log(`Rewrote ${refs} reference(s). Run "npm run build" to regenerate OG images and mirrors.`);
}

module.exports = { findLegacyImages };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });
