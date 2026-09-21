/**
 * AltruBiz Crawlable Internal Links Regression Test (SiteOS Link Semantics)
 *
 * Permanent rule:
 *   "Navigation to another URL must render a valid, crawlable <a href>.
 *    <button> is for actions. Every page intended for indexing must receive a
 *    regular internal link from a relevant page on the site."
 *
 * Layer 1 - Source guard (no browser):
 *   No <button>/<div>/<span>/<li>/<Button> may navigate with a bare
 *   `onClick={() => onNavigate(...)}`; that renders a click handler with no href.
 *   Also flags href="#", href="" and javascript: hrefs.
 *
 * Layer 2 - Rendered DOM audit (Playwright against the built site):
 *   A. /knowledge: every publicly linkable article card exposes a real
 *      <a href="<publicPath>"> on its title, cover image and CTA; no <button> is
 *      used to navigate; filter controls remain <button>s and still filter.
 *   B. Structural hygiene on representative pages: no empty / "#" / javascript:
 *      hrefs, no nested interactive elements, breadcrumb ancestors are links.
 *   C. Reachability: crawling only <a href> links from "/", every URL in
 *      sitemap.xml is discovered, and every indexable article receives a
 *      contextual inbound link from /knowledge or a topic hub (sitemap alone is
 *      not a substitute for an internal link).
 *   D. Interaction: plain click navigates client-side, Ctrl/Cmd+click opens a
 *      new tab, Enter on a focused link navigates.
 *
 * Exit code 1 on any violation.
 */

const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { getIndexableArticles } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let failures = 0;
let passes = 0;
const pass = (m) => { passes++; console.log(`  \x1b[32m✔\x1b[0m ${m}`); };
const fail = (m) => { failures++; console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${m}`); };
const check = (cond, okMsg, failMsg) => (cond ? pass(okMsg) : fail(failMsg));

// ---------------------------------------------------------------------------
// Layer 1: source guard
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, out);
        else if (/\.tsx$/.test(entry.name)) out.push(full);
    }
    return out;
}

function auditSource() {
    console.log('\n1. Source guard: navigation must be a real <a href>, not a click handler...');
    const NON_LINK_TAGS = /^(button|div|span|li|Button|motion\.[a-zA-Z]+)$/;
    // A click handler whose only job is to navigate (client-side or by opening a URL).
    const NAV_CLICK = /onClick=\{\(\)\s*=>\s*(?:onNavigate\(|window\.open\(|window\.location(?:\.href)?\s*=)/g;
    let violations = 0;

    for (const file of walk(SRC_DIR)) {
        const src = fs.readFileSync(file, 'utf8');
        const rel = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
        const lineOf = (idx) => src.slice(0, idx).split('\n').length;

        let m;
        while ((m = NAV_CLICK.exec(src))) {
            const tagStart = src.lastIndexOf('<', m.index);
            const tagName = /^<([A-Za-z.]+)/.exec(src.slice(tagStart))?.[1] || '';
            if (NON_LINK_TAGS.test(tagName)) {
                violations++;
                fail(`${rel}:${lineOf(m.index)} <${tagName}> navigates with onClick but has no href. Use <InternalLink href=...> (or <Button href=...>, or <a href target="_blank"> for external URLs).`);
            }
        }

        for (const bad of [/href=["']#["']/g, /href=["']["']/g, /href=["']javascript:/gi, /role=["']link["']/g]) {
            let b;
            while ((b = bad.exec(src))) {
                violations++;
                fail(`${rel}:${lineOf(b.index)} invalid link pattern "${b[0]}" (use a real URL).`);
            }
        }
    }
    if (violations === 0) pass('No navigation-by-onClick and no "#" / empty / javascript: hrefs in src/**/*.tsx');
}

// ---------------------------------------------------------------------------
// Server helpers (same convention as the other runtime audits)
// ---------------------------------------------------------------------------
function checkServer(url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => resolve(res.statusCode >= 200 && res.statusCode < 400));
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => { req.destroy(); resolve(false); });
    });
}

async function ensureServer() {
    if (process.env.TARGET_URL) {
        console.log(`✔ Using TARGET_URL: ${process.env.TARGET_URL}`);
        return { baseUrl: process.env.TARGET_URL.replace(/\/$/, ''), close: () => {} };
    }
    if (await checkServer('http://localhost:4173/')) {
        console.log('✔ Connected to active preview server on http://localhost:4173');
        return { baseUrl: 'http://localhost:4173', close: () => {} };
    }
    console.log('Starting ephemeral preview server on http://localhost:4191...');
    const proc = spawn('npx', ['vite', 'preview', '--port', '4191'], { shell: true, stdio: 'pipe' });
    for (let i = 0; i < 40; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (await checkServer('http://localhost:4191/')) {
            return { baseUrl: 'http://localhost:4191', close: () => { try { proc.kill(); } catch { /* noop */ } } };
        }
    }
    throw new Error('Failed to start preview server (run `npm run build` first).');
}

const normalizePath = (href, base) => {
    try {
        const u = new URL(href, base);
        if (u.origin !== new URL(base).origin && !/altrubiz\.co\.il$/.test(u.hostname)) return null;
        let p = u.pathname.replace(/\/+$/, '') || '/';
        if (/\.(md|xml|txt|png|jpg|jpeg|webp|svg|pdf)$/i.test(p)) return null;
        return p;
    } catch { return null; }
};

function readSitemapPaths() {
    const xml = fs.readFileSync(path.join(ROOT_DIR, 'public', 'sitemap.xml'), 'utf8');
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/+$/, '') || '/');
}

async function openPage(browser, baseUrl, p, viewport = { width: 1280, height: 900 }) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}${p}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1', { timeout: 15000 });
    await page.waitForTimeout(250);
    return page;
}

// ---------------------------------------------------------------------------
// Layer 2: rendered DOM
// ---------------------------------------------------------------------------
async function auditKnowledgeCenter(browser, baseUrl, articles) {
    console.log('\n2A. /knowledge: article cards expose real destination URLs...');
    const page = await openPage(browser, baseUrl, '/knowledge');

    const cardLinks = await page.$$eval('h2 a', (as) => as.map((a) => ({ href: a.getAttribute('href'), text: a.textContent.trim() })));
    const titleHrefs = new Set(cardLinks.map((l) => l.href));
    for (const art of articles) {
        check(titleHrefs.has(art.publicPath),
            `title link → ${art.publicPath}`,
            `Article "${art.slug}" has no <h2><a href="${art.publicPath}"> in the /knowledge DOM (title is not a real link).`);
    }

    const allHrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const art of articles) {
        const n = allHrefs.filter((h) => h === art.publicPath).length;
        check(n >= 2, `${art.publicPath}: ${n} real links (title + CTA${n >= 3 ? ' + cover' : ''})`,
            `${art.publicPath} has only ${n} <a href> on /knowledge; the card CTA must also be a real link.`);
    }

    const buttonsInHeadings = await page.$$eval('h2 button, h3 button', (b) => b.length);
    check(buttonsInHeadings === 0, 'No <button> inside article headings', `${buttonsInHeadings} <button> element(s) inside headings on /knowledge.`);

    const titles = new Set(articles.map((a) => a.title));
    const navButtons = await page.$$eval('button', (bs) => bs.map((b) => b.textContent.trim()));
    const titleButtons = navButtons.filter((t) => titles.has(t));
    check(titleButtons.length === 0, 'No <button> carries an article title', `<button> used for article title(s): ${titleButtons.join(' | ')}`);

    // Filters stay as buttons and keep working (action, not navigation)
    console.log('  filter behavior preserved...');
    const before = await page.$$eval('h2 a', (as) => as.length);
    const cats = page.getByRole('button').filter({ hasText: /\d+$/ });
    const catCount = await cats.count();
    check(catCount > 1, `Category filter controls are <button>s (${catCount})`, 'Category filter buttons missing.');
    if (catCount > 1) {
        await cats.nth(1).click();
        await page.waitForTimeout(400);
        const after = await page.$$eval('h2 a', (as) => as.length);
        const urlAfter = new URL(page.url()).pathname;
        check(after <= before && urlAfter === '/knowledge', `Filter click updates the list without navigating (${before} → ${after}, still /knowledge)`,
            `Filter click changed the URL to ${urlAfter} or grew the list (${before} → ${after}).`);
        const anchorsAfter = await page.$$eval('h2 a', (as) => as.every((a) => a.getAttribute('href')));
        check(anchorsAfter, 'Filtered cards still render real links', 'Filtered cards lost their hrefs.');
    }
    await page.close();
}

async function auditStructure(browser, baseUrl, samplePaths) {
    console.log('\n2B. Structural hygiene on representative pages...');
    for (const p of samplePaths) {
        const page = await openPage(browser, baseUrl, p);
        const res = await page.evaluate(() => {
            const bad = [];
            document.querySelectorAll('a').forEach((a) => {
                const h = (a.getAttribute('href') || '').trim();
                if (!h || h === '#' || /^javascript:/i.test(h)) bad.push(`invalid href "${h}" on <a> "${a.textContent.trim().slice(0, 40)}"`);
            });
            const nested = document.querySelectorAll('a a, a button, button a, button button').length;
            const roleLinks = document.querySelectorAll('[role="link"]').length;
            const crumbs = [...document.querySelectorAll('nav[aria-label="פירורי לחם"] li')];
            const crumbNav = crumbs.slice(0, -1).filter((li) => !li.querySelector('a[href]')).length;
            return { bad, nested, roleLinks, crumbNav, crumbCount: crumbs.length };
        });
        check(res.bad.length === 0, `${p}: no empty / "#" / javascript: hrefs`, `${p}: ${res.bad.join('; ')}`);
        check(res.nested === 0, `${p}: no nested interactive elements`, `${p}: ${res.nested} nested interactive element(s).`);
        check(res.roleLinks === 0, `${p}: no role="link" stand-ins`, `${p}: ${res.roleLinks} role="link" element(s); use <a href>.`);
        if (res.crumbCount > 1) {
            check(res.crumbNav === 0, `${p}: breadcrumb ancestors are links`, `${p}: ${res.crumbNav} breadcrumb ancestor(s) are not <a href>.`);
        }
        await page.close();
    }
}

async function auditReachability(browser, baseUrl, articles, sitemapPaths) {
    console.log('\n2C. Reachability: crawling only <a href> links from "/"...');
    const inbound = new Map();          // target -> Set(source)
    const visited = new Set();
    const queue = ['/'];
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

    while (queue.length && visited.size < 120) {
        const p = queue.shift();
        if (visited.has(p)) continue;
        visited.add(p);
        try {
            await page.goto(`${baseUrl}${p}`, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('h1', { timeout: 15000 });
            await page.waitForTimeout(150);
        } catch { continue; }
        const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
        for (const h of hrefs) {
            const target = normalizePath(h, baseUrl);
            if (!target || target === p) continue;
            if (!inbound.has(target)) inbound.set(target, new Set());
            inbound.get(target).add(p);
            if (!visited.has(target)) queue.push(target);
        }
    }
    await page.close();

    for (const p of sitemapPaths) {
        if (p === '/') continue;
        check(inbound.has(p), `${p}: discovered via <a href> (${inbound.get(p)?.size || 0} inbound page(s))`,
            `${p} is in sitemap.xml but no crawled page links to it with <a href>.`);
    }

    const hubPaths = sitemapPaths.filter((p) => !articles.some((a) => a.publicPath === p) &&
        !['/', '/about', '/knowledge', '/privacy-policy', '/terms-of-use', '/cookie-policy', '/accessibility-statement', '/roi-calculator'].includes(p));
    const contextual = new Set(['/knowledge', ...hubPaths]);
    for (const art of articles) {
        const sources = [...(inbound.get(art.publicPath) || [])];
        const ok = sources.some((s) => contextual.has(s));
        check(ok, `${art.publicPath}: contextual inbound link from ${sources.filter((s) => contextual.has(s)).slice(0, 2).join(', ')}${sources.length > 2 ? ` (+${sources.length} total sources)` : ''}`,
            `${art.publicPath} has no <a href> from /knowledge or a topic hub (sources: ${sources.join(', ') || 'none'}).`);
    }

    // Evidence table
    console.log('\n  Inbound <a href> coverage (crawled pages: ' + visited.size + '):');
    for (const p of sitemapPaths.filter((x) => x !== '/')) {
        console.log(`   ${String(inbound.get(p)?.size || 0).padStart(3)}  ${p}`);
    }
}

async function auditShareLinks(browser, baseUrl, articles) {
    console.log('\n2E. Article share bar: external share intents are real links...');
    const page = await openPage(browser, baseUrl, articles[0].publicPath);
    const res = await page.evaluate(() => {
        const has = (sel) => [...document.querySelectorAll(sel)].filter((a) => a.tagName === 'A' && a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') || '')).length;
        return {
            whatsapp: has('a[href^="https://api.whatsapp.com/send"]'),
            linkedin: has('a[href^="https://www.linkedin.com/sharing"]'),
            facebook: has('a[href^="https://www.facebook.com/sharer"]'),
            twitter: has('a[href^="https://twitter.com/intent/tweet"]'),
            shareButtons: [...document.querySelectorAll('button[aria-label^="שיתוף ב"]')].map((b) => b.getAttribute('aria-label')),
        };
    });
    for (const k of ['whatsapp', 'linkedin', 'facebook', 'twitter']) {
        check(res[k] >= 1, `${k} share is a real <a href target="_blank" rel="noopener">`, `${k} share is not a real link on ${articles[0].publicPath}.`);
    }
    const navButtons = res.shareButtons.filter((l) => /וואטסאפ|לינקדאין|פייסבוק|ב-X/.test(l));
    check(navButtons.length === 0, 'No share <button> opens an external URL (Copy / Instagram / TikTok stay buttons)', `Share buttons still used for navigation: ${navButtons.join(', ')}`);
    await page.close();
}

async function auditInteraction(browser, baseUrl, articles) {
    console.log('\n2D. Interaction: click, new tab, keyboard...');
    const target = articles[0].publicPath;
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h2 a', { timeout: 15000 });
    await page.evaluate(() => { window.__spaMarker = 'alive'; });

    const link = page.locator(`h2 a[href="${target}"]`).first();

    // Plain click => client-side navigation (no reload)
    await link.click();
    await page.waitForURL(`**${target}`, { timeout: 10000 });
    const marker = await page.evaluate(() => window.__spaMarker);
    check(marker === 'alive', `Plain click on title navigates client-side to ${target}`, 'Plain click caused a full reload instead of SPA navigation.');

    // Ctrl/Cmd + click => new tab
    await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h2 a', { timeout: 15000 });
    const [newTab] = await Promise.all([
        context.waitForEvent('page', { timeout: 8000 }).catch(() => null),
        page.locator(`h2 a[href="${target}"]`).first().click({ modifiers: ['Control'] })
    ]);
    check(!!newTab, 'Ctrl+click opens the article in a new tab', 'Ctrl+click did not open a new tab (link click is being swallowed).');
    if (newTab) {
        await newTab.waitForLoadState('domcontentloaded').catch(() => {});
        check(newTab.url().endsWith(target), `New tab URL is ${target}`, `New tab opened ${newTab.url()} instead of ${target}.`);
        await newTab.close();
    }
    check(new URL(page.url()).pathname === '/knowledge', 'Original tab stays on /knowledge after Ctrl+click', 'Original tab navigated away on Ctrl+click.');

    // Keyboard: focus + Enter
    await page.locator(`h2 a[href="${target}"]`).first().focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(`**${target}`, { timeout: 10000 }).then(
        () => pass('Enter on a focused title link navigates'),
        () => fail('Enter on a focused title link did not navigate.'));
    await context.close();
}

// ---------------------------------------------------------------------------
async function main() {
    console.log('\n========================================================');
    console.log('   AltruBiz Crawlable Internal Links Regression Test    ');
    console.log('========================================================');

    auditSource();

    // Fast static guard used by `prebuild` (no browser, no built site required).
    if (process.argv.includes('--source-only')) {
        console.log(`\nCrawlable Links Source Guard: ${passes} passed, ${failures} failed`);
        if (failures > 0) {
            console.error('\x1b[31mValidation failed: navigation must render <a href>; <button> is for actions.\x1b[0m\n');
            process.exit(1);
        }
        console.log('\x1b[32m✔ Source guard passed.\x1b[0m\n');
        return;
    }

    const articles = getIndexableArticles();
    const sitemapPaths = readSitemapPaths();
    const { baseUrl, close } = await ensureServer();
    let browser;
    try {
        browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
        await auditKnowledgeCenter(browser, baseUrl, articles);

        const hubSamples = sitemapPaths.filter((p) => ['/lost-leads', '/whatsapp-in-crm', '/sales-pipeline', '/business-memory', '/repetitive-manual-work'].includes(p));
        const sample = ['/', '/knowledge', '/about', '/roi-calculator', ...hubSamples, ...articles.slice(0, 3).map((a) => a.publicPath)];
        await auditStructure(browser, baseUrl, sample);
        await auditReachability(browser, baseUrl, articles, sitemapPaths);
        await auditShareLinks(browser, baseUrl, articles);
        await auditInteraction(browser, baseUrl, articles);
    } finally {
        if (browser) await browser.close();
        close();
    }

    console.log('\n========================================================');
    console.log(`Crawlable Links Audit: ${passes} passed, ${failures} failed`);
    console.log('========================================================\n');
    if (failures > 0) {
        console.error('\x1b[31mValidation failed: navigation must render <a href>; <button> is for actions.\x1b[0m\n');
        process.exit(1);
    }
    console.log('\x1b[32m✔ All crawlable-link checks passed.\x1b[0m\n');
}

main().catch((err) => {
    console.error('Crawlable links audit crashed:', err);
    process.exit(1);
});
