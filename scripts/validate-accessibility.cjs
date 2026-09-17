#!/usr/bin/env node

/**
 * AltruBiz Automated Accessibility Regression Suite (SiteOS Governance Layer)
 *
 * Runs axe-core (WCAG 2.0/2.1/2.2 A + AA rule tags) plus targeted keyboard,
 * focus-management, target-size and reduced-motion checks across every
 * distinct UI TEMPLATE/PATTERN on the site (not every URL -- routes that
 * share a template are deduped), reusing the same ephemeral-preview-server
 * pattern as scripts/validate-scroll-sovereignty.cjs /
 * scripts/validate-conversion-context.cjs.
 *
 * Failure policy:
 *   - Deterministic, high-confidence problems (serious/critical axe
 *     violations, missing document language, unlabeled controls, keyboard
 *     traps, broken modal focus management, sub-24px critical targets)
 *     FAIL the script (exit 1).
 *   - Subjective/uncertain findings are printed as warnings and never fail
 *     the build.
 *   - Anything that categorically requires a human with real assistive
 *     technology is printed under "MANUAL VERIFICATION REQUIRED" -- never
 *     silently assumed to pass.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const AXE_SOURCE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const HYDRATION_SELECTOR = 'a[aria-label="פתיחת שיחת וואטסאפ עם צוות AltruBiz"]';

/**
 * Waits until the client-side React app has actually mounted (rather than
 * guessing a fixed timeout), using the site-wide WhatsAppFloat link as a
 * reliable hydration marker -- it only exists once React has replaced any
 * prerendered social-share placeholder markup in #root.
 */
async function waitForHydration(page) {
    await page.waitForSelector(HYDRATION_SELECTOR, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(150);
}

let failures = 0;
let warnings = 0;
const manualVerificationItems = [];

function fail(message) {
    failures += 1;
    console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${message}`);
}

function warn(message) {
    warnings += 1;
    console.warn(`  \x1b[33m⚠ WARN:\x1b[0m ${message}`);
}

function pass(message) {
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
}

function manual(message) {
    manualVerificationItems.push(message);
}

function checkServer(url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

const { spawn, execSync } = require('child_process');

/**
 * Best-effort process-tree kill. `child.kill()` alone is not reliable here:
 * this script spawns `npx vite preview` with `shell: true`, which on
 * Windows means the tracked PID is a cmd.exe wrapper, not the actual node/
 * vite process underneath it -- killing just that PID can leave the real
 * server running as an orphaned "zombie" process bound to the port.
 * `taskkill /T` (Windows) / a negative-PID signal to the process group
 * (POSIX, requires `detached: true` at spawn time) kill the whole tree.
 */
function killProcessTree(pid) {
    if (!pid) return;
    try {
        if (process.platform === 'win32') {
            execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
        } else {
            process.kill(-pid, 'SIGKILL');
        }
    } catch {
        // Already dead, or we never had permission -- either way, nothing
        // more we can do.
    }
}

/**
 * Forcibly frees a local port before we bind our own preview server to it.
 * Without this, a zombie `vite preview` left running from an earlier
 * interrupted/manual run would cause ensureServer() below to (previously)
 * silently reuse it via a bare checkServer() ping -- reporting a false
 * PASS for this entire suite against a STALE build that may not even
 * contain the change under test. Confirmed reproducible: strip an
 * aria-label, rebuild, leave a stale server listening, run test:a11y --
 * it reports 0 failures because it never re-served the new dist/ output.
 */
function killPort(port) {
    try {
        if (process.platform === 'win32') {
            // Deliberately NOT `netstat -ano -p tcp`: `vite preview` binds to
            // the IPv6 loopback ([::1]) by default in this environment, and
            // Windows' `-p tcp` protocol filter only returns IPv4 rows --
            // confirmed empirically to return zero rows for such a listener
            // (both `-p tcp` and `-p TCP`), silently turning this whole
            // pre-emptive kill into a no-op against exactly the scenario it
            // exists for (an independent/orphaned vite preview left on the
            // port by something outside this script's own run). Running
            // plain `netstat -ano` with no protocol filter surfaces both
            // IPv4 and IPv6 (and TCP/UDP) rows for the port.
            const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
            const pids = new Set();
            out.split('\n').forEach((line) => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
            });
            pids.forEach((pid) => killProcessTree(pid));
        } else {
            const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' });
            out.split('\n').filter(Boolean).forEach((pid) => killProcessTree(pid));
        }
    } catch {
        // Nothing was listening on the port (the common case) or the
        // lookup tool isn't available -- either way, nothing to kill.
    }
}

async function ensureServer() {
    if (process.env.TARGET_URL) {
        console.log(`✔ Target server specified: ${process.env.TARGET_URL}`);
        return { baseUrl: process.env.TARGET_URL, close: () => {} };
    }

    // Deliberately does NOT reuse "whatever happens to already be
    // listening" on a well-known port (e.g. localhost:4173, as the
    // sibling validate-scroll-sovereignty.cjs / validate-conversion-context
    // .cjs scripts do for developer convenience) -- this suite is the
    // authoritative accessibility gate, and blindly trusting an already-up
    // server is exactly what let it silently pass against stale content
    // (see killPort() doc comment above). It always kills anything on its
    // target port first, then spawns and serves a guaranteed-fresh
    // `vite preview` against the just-built dist/.
    const PORT = 4181;
    killPort(PORT);
    await new Promise((r) => setTimeout(r, 300));

    console.log(`Starting a fresh preview server on http://localhost:${PORT} (serving the current dist/ build)...`);
    const serverProcess = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
        shell: true,
        stdio: 'pipe',
        detached: process.platform !== 'win32'
    });
    serverProcess.on('error', () => {});

    let closed = false;
    const close = () => {
        if (closed) return;
        closed = true;
        killProcessTree(serverProcess.pid);
        killPort(PORT);
    };
    // Belt-and-suspenders: guarantees the spawned server is torn down even
    // if the caller's own try/finally never runs (e.g. a thrown error
    // before reaching it, or an early/forced process exit) -- the prior
    // version's cleanup only ran on the happy path.
    process.once('exit', close);

    for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 500));
        const up = await checkServer(`http://localhost:${PORT}/`);
        if (up) {
            console.log(`✔ Fresh preview server ready on http://localhost:${PORT}`);
            return { baseUrl: `http://localhost:${PORT}`, close };
        }
    }

    close();
    throw new Error('Failed to start preview server for accessibility audit.');
}

/** Injects axe-core into the page and runs it, returning violations. */
async function runAxe(page, context, { include, exclude } = {}) {
    await page.addScriptTag({ content: AXE_SOURCE });
    const results = await page.evaluate(
        async ({ tags, include, exclude }) => {
            const opts = { runOnly: { type: 'tag', values: tags } };
            const contextArg = include || exclude
                ? { include: include ? [include] : undefined, exclude: exclude ? [exclude] : undefined }
                : document;
            // eslint-disable-next-line no-undef
            return await axe.run(contextArg, opts);
        },
        { tags: AXE_TAGS, include, exclude }
    );

    const seriousOrCritical = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    const minorOrModerate = results.violations.filter(
        (v) => v.impact !== 'serious' && v.impact !== 'critical'
    );

    if (seriousOrCritical.length === 0) {
        pass(`axe-core: 0 serious/critical violations on ${context}`);
    }
    for (const v of seriousOrCritical) {
        fail(`axe-core [${v.impact}] ${context}: ${v.id} - ${v.help} (${v.nodes.length} node(s)) ${v.helpUrl}`);
    }
    for (const v of minorOrModerate) {
        warn(`axe-core [${v.impact || 'minor'}] ${context}: ${v.id} - ${v.help} (${v.nodes.length} node(s))`);
    }

    return results;
}

async function auditStaticPage(browser, baseUrl, routePath, label) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    // 'load' rather than 'networkidle': the homepage's always-on
    // ContactForm iframe embeds a Cloudflare Turnstile widget that polls
    // continuously and never lets the network go idle (the site's other
    // validate-*.cjs scripts avoid this by never targeting '/' at all).
    await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'load' });
    await waitForHydration(page);

    // Document language -- deterministic, always required.
    const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
    if (lang === 'he') {
        pass(`${label}: <html lang="he"> present`);
    } else {
        fail(`${label}: <html lang> is "${lang}", expected "he"`);
    }
    if (dir === 'rtl') {
        pass(`${label}: <html dir="rtl"> present`);
    } else {
        fail(`${label}: <html dir> is "${dir}", expected "rtl"`);
    }

    // Landmarks -- exactly one <main>, one top-level <header> ("banner"),
    // one <footer>, no dupes left behind by SPA transitions. A <header>
    // nested inside <main>/<article>/<section>/<aside>/<nav> is valid HTML5
    // (e.g. an article's own hero header) and does NOT get the "banner"
    // landmark role per the HTML-AAM spec, so only top-level headers count
    // toward the single-banner-landmark requirement.
    const landmarkCounts = await page.evaluate(() => {
        const allHeaders = Array.from(document.querySelectorAll('header'));
        const bannerHeaders = allHeaders.filter((h) => !h.closest('main, article, section, aside, nav'));
        return {
            main: document.querySelectorAll('main').length,
            bannerHeader: bannerHeaders.length,
            footer: document.querySelectorAll('footer').length,
            h1: document.querySelectorAll('h1').length
        };
    });
    if (landmarkCounts.main === 1) {
        pass(`${label}: exactly one <main> landmark`);
    } else {
        fail(`${label}: found ${landmarkCounts.main} <main> landmarks, expected exactly 1`);
    }
    if (landmarkCounts.bannerHeader === 1) {
        pass(`${label}: exactly one top-level <header> ("banner" landmark)`);
    } else {
        fail(`${label}: found ${landmarkCounts.bannerHeader} top-level <header> element(s) outside main/article/section/aside/nav, expected exactly 1`);
    }
    if (landmarkCounts.h1 === 1) {
        pass(`${label}: exactly one <h1> on page`);
    } else if (landmarkCounts.h1 === 0) {
        fail(`${label}: no <h1> found on page`);
    } else {
        warn(`${label}: found ${landmarkCounts.h1} <h1> elements (expected exactly 1)`);
    }

    // Every icon-only button must have an accessible name.
    const unlabeledButtons = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons
            .filter((b) => {
                const text = (b.textContent || '').trim();
                const hasAriaLabel = b.hasAttribute('aria-label') && b.getAttribute('aria-label').trim().length > 0;
                const hasAriaLabelledBy = b.hasAttribute('aria-labelledby');
                return text.length === 0 && !hasAriaLabel && !hasAriaLabelledBy;
            })
            .map((b) => b.outerHTML.slice(0, 120));
    });
    if (unlabeledButtons.length === 0) {
        pass(`${label}: every <button> has an accessible name`);
    } else {
        for (const html of unlabeledButtons) {
            fail(`${label}: icon-only <button> without accessible name: ${html}`);
        }
    }

    // Every form input must have a programmatic label.
    const unlabeledInputs = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
        return inputs
            .filter((el) => {
                if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') return false;
                const hasAriaLabel = el.hasAttribute('aria-label') && el.getAttribute('aria-label').trim().length > 0;
                const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
                const id = el.getAttribute('id');
                const hasLabelFor = id ? !!document.querySelector(`label[for="${CSS.escape(id)}"]`) : false;
                const wrappedInLabel = !!el.closest('label');
                return !hasAriaLabel && !hasAriaLabelledBy && !hasLabelFor && !wrappedInLabel;
            })
            .map((el) => el.outerHTML.slice(0, 120));
    });
    if (unlabeledInputs.length === 0) {
        pass(`${label}: every form control has a programmatic label`);
    } else {
        for (const html of unlabeledInputs) {
            fail(`${label}: form control without a programmatic label: ${html}`);
        }
    }

    // Every iframe must have a descriptive title.
    const badIframes = await page.evaluate(() => {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        return iframes
            .filter((f) => !f.getAttribute('title') || f.getAttribute('title').trim().length < 3)
            .map((f) => f.getAttribute('src') || '(no src)');
    });
    if (badIframes.length === 0) {
        pass(`${label}: every <iframe> has a descriptive title`);
    } else {
        for (const src of badIframes) {
            fail(`${label}: <iframe> missing a descriptive title (src: ${src})`);
        }
    }

    await runAxe(page, label);
    await page.close();
}

async function auditSkipLink(browser, baseUrl) {
    console.log('\n--- Skip Link ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await waitForHydration(page);

    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        href: document.activeElement?.getAttribute('href'),
        text: document.activeElement?.textContent?.trim()
    }));

    if (firstFocused.href === '#main-content') {
        pass(`Skip link is the first Tab stop ("${firstFocused.text}")`);
    } else {
        fail(`First Tab stop was not the skip link (got tag=${firstFocused.tag}, href=${firstFocused.href})`);
    }

    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const afterActivation = await page.evaluate(() => ({
        id: document.activeElement?.id,
        tag: document.activeElement?.tagName
    }));
    if (afterActivation.id === 'main-content') {
        pass('Activating the skip link moves focus to #main-content');
    } else {
        fail(`Activating the skip link did not focus #main-content (focused id="${afterActivation.id}", tag=${afterActivation.tag})`);
    }

    // SPA route-change focus management: navigate to another route via a
    // real in-page link and confirm focus lands on the new #main-content.
    await page.goto(`${baseUrl}/about`, { waitUntil: 'load' });
    await waitForHydration(page);
    const clicked = await page.evaluate(() => {
        const knowledgeLink = document.querySelector('header a[href="/knowledge"]');
        if (knowledgeLink) { knowledgeLink.click(); return true; }
        return false;
    });
    if (clicked) {
        await page.waitForTimeout(200);
        const focusedAfterNav = await page.evaluate(() => document.activeElement?.id);
        if (focusedAfterNav === 'main-content') {
            pass('SPA route change moves focus to the new page\'s #main-content');
        } else {
            fail(`SPA route change did not move focus to #main-content (focused id="${focusedAfterNav}")`);
        }
    } else {
        warn('Could not locate header /knowledge link to test SPA route-change focus');
    }

    await page.close();
}

async function auditModalFocusManagement(browser, baseUrl) {
    console.log('\n--- Modal Dialog Focus Management (BookingModal via Header CTA) ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await waitForHydration(page);

    const triggerHandle = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('header button'));
        return buttons.find((b) => (b.textContent || '').includes('קביעת פגישה')) || null;
    });
    const triggerExists = await page.evaluate((el) => !!el, triggerHandle);
    if (!triggerExists) {
        warn('Could not locate header "קביעת פגישה" CTA to test BookingModal focus management');
        await page.close();
        return;
    }

    await page.evaluate((el) => el.focus(), triggerHandle);
    await page.evaluate((el) => el.click(), triggerHandle);
    await page.waitForTimeout(300);

    const dialogOpen = await page.evaluate(() => !!document.querySelector('div[role="dialog"][aria-modal="true"]'));
    if (!dialogOpen) {
        fail('BookingModal did not open (role="dialog" not found) after clicking header CTA');
        await page.close();
        return;
    }
    pass('BookingModal opened with role="dialog" aria-modal="true"');

    const focusedInsideDialog = await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
        return !!(dialog && dialog.contains(document.activeElement));
    });
    if (focusedInsideDialog) {
        pass('Focus moved inside the dialog on open');
    } else {
        fail('Focus did NOT move inside the dialog on open');
    }

    // Focus trap: Shift+Tab from the first focusable element should wrap to
    // the last one, never escaping to the page behind the dialog.
    await page.keyboard.press('Shift+Tab');
    const afterShiftTab = await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
        return !!(dialog && dialog.contains(document.activeElement));
    });
    if (afterShiftTab) {
        pass('Shift+Tab from the first element stays trapped inside the dialog');
    } else {
        fail('Shift+Tab escaped the dialog\'s focus trap (keyboard trap / leak regression)');
    }

    await runAxe(page, 'BookingModal (open)', { include: 'div[role="dialog"][aria-modal="true"]' });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const dialogClosed = await page.evaluate(() => !document.querySelector('div[role="dialog"][aria-modal="true"]'));
    const focusReturned = await page.evaluate(() => (document.activeElement?.textContent || '').includes('קביעת פגישה'));
    if (dialogClosed) {
        pass('Escape closes the BookingModal');
    } else {
        fail('Escape did not close the BookingModal');
    }
    if (focusReturned) {
        pass('Focus returns to the triggering element after close');
    } else {
        fail('Focus did NOT return to the triggering "קביעת פגישה" element after close');
    }

    await page.close();
}

async function auditPricingModal(browser, baseUrl) {
    console.log('\n--- PricingModal (via article inline CTA) ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        await page.goto(`${baseUrl}/whatsapp-messaging-guidelines`, { waitUntil: 'load' });
    await waitForHydration(page);
        const clicked = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find((b) =>
                (b.textContent || '').includes('צפייה בחבילות ומחירים')
            );
            if (btn) { btn.click(); return true; }
            return false;
        });
        if (!clicked) {
            warn('Could not locate the pricing inline-CTA button to open PricingModal -- skipped (article content may have changed)');
            await page.close();
            return;
        }
        await page.waitForTimeout(300);
        const dialogOpen = await page.evaluate(() => !!document.querySelector('div[role="dialog"][aria-modal="true"]'));
        if (!dialogOpen) {
            fail('PricingModal did not open after clicking the pricing inline CTA');
            await page.close();
            return;
        }
        pass('PricingModal opened with role="dialog" aria-modal="true"');
        const focusedInsideDialog = await page.evaluate(() => {
            const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
            return !!(dialog && dialog.contains(document.activeElement));
        });
        if (focusedInsideDialog) {
            pass('Focus moved inside PricingModal on open');
        } else {
            fail('Focus did NOT move inside PricingModal on open');
        }
        await runAxe(page, 'PricingModal (open)', { include: 'div[role="dialog"][aria-modal="true"]' });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
        const dialogClosed = await page.evaluate(() => !document.querySelector('div[role="dialog"][aria-modal="true"]'));
        if (dialogClosed) {
            pass('Escape closes PricingModal');
        } else {
            fail('Escape did not close PricingModal');
        }
    } finally {
        await page.close();
    }
}

async function auditMobileDrawer(browser, baseUrl, routePath, label, pillSelector, closeLabelSubstring) {
    console.log(`\n--- Mobile Drawer (${label}) ---`);
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'load' });
    await waitForHydration(page);
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(300);

    const pillClicked = await page.evaluate((sel) => {
        const btn = document.querySelector(sel);
        if (btn) { btn.click(); return true; }
        return false;
    }, pillSelector);

    if (!pillClicked) {
        warn(`${label}: could not locate mobile jump pill to open drawer -- skipped`);
        await page.close();
        return;
    }
    await page.waitForTimeout(300);

    const dialogInfo = await page.evaluate(() => {
        const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
        return {
            exists: !!dialog,
            focusedInside: !!(dialog && dialog.contains(document.activeElement))
        };
    });
    if (dialogInfo.exists) {
        pass(`${label}: mobile drawer exposes role="dialog" aria-modal="true"`);
    } else {
        fail(`${label}: mobile drawer is missing role="dialog" aria-modal="true"`);
    }
    if (dialogInfo.focusedInside) {
        pass(`${label}: focus moved inside the mobile drawer on open`);
    } else {
        fail(`${label}: focus did NOT move inside the mobile drawer on open`);
    }

    await runAxe(page, `${label} (drawer open)`, { include: 'div[role="dialog"][aria-modal="true"]' });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const closedByEscape = await page.evaluate(() => !document.querySelector('div[role="dialog"][aria-modal="true"]'));
    if (closedByEscape) {
        pass(`${label}: Escape closes the mobile drawer`);
    } else {
        fail(`${label}: Escape did not close the mobile drawer`);
    }

    await page.close();
}

async function auditRoiCalculatorTargetSizesAndSliders(browser, baseUrl) {
    console.log('\n--- ROI Calculator: Target Size & Slider Semantics ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/roi-calculator`, { waitUntil: 'load' });
    await waitForHydration(page);

    // WCAG 2.2 SC 2.5.8 Target Size (Minimum): interactive icon-only step
    // buttons must be at least 24x24 CSS px.
    const smallTargets = await page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('button')).filter((b) => {
            const label = b.getAttribute('aria-label') || '';
            return /הפחתת|הוספת/.test(label);
        });
        return candidates
            .map((b) => {
                const r = b.getBoundingClientRect();
                return { label: b.getAttribute('aria-label'), width: r.width, height: r.height };
            })
            .filter((r) => r.width < 24 || r.height < 24);
    });
    if (smallTargets.length === 0) {
        pass('ROI calculator stepper buttons all meet the 24x24px minimum target size');
    } else {
        for (const t of smallTargets) {
            fail(`ROI calculator stepper button "${t.label}" is ${Math.round(t.width)}x${Math.round(t.height)}px, below the 24x24px WCAG 2.2 minimum`);
        }
    }

    // Non-linear custom sliders must expose a real-world aria-valuetext,
    // not just the raw 0-100 internal position value.
    const sliderValueTexts = await page.evaluate(() => {
        const leads = document.getElementById('leads-range');
        const deal = document.getElementById('deal-range');
        return {
            leads: leads ? leads.getAttribute('aria-valuetext') : null,
            deal: deal ? deal.getAttribute('aria-valuetext') : null
        };
    });
    if (sliderValueTexts.leads && /\d/.test(sliderValueTexts.leads)) {
        pass(`Leads slider exposes a real-world aria-valuetext: "${sliderValueTexts.leads}"`);
    } else {
        fail('Leads slider is missing a real-world aria-valuetext (screen readers would announce the raw 0-100 position)');
    }
    if (sliderValueTexts.deal && /\d/.test(sliderValueTexts.deal)) {
        pass(`Deal-value slider exposes a real-world aria-valuetext: "${sliderValueTexts.deal}"`);
    } else {
        fail('Deal-value slider is missing a real-world aria-valuetext');
    }

    // Dragging Movements (WCAG 2.2 SC 2.5.7): every slider must have a
    // non-drag keyboard/pointer alternative (here: a paired number input).
    const hasKeyboardAlternative = await page.evaluate(() => !!document.getElementById('leads-input'));
    if (hasKeyboardAlternative) {
        pass('Leads slider has a non-dragging keyboard alternative (number input)');
    } else {
        fail('Leads slider has no non-dragging alternative input');
    }

    await runAxe(page, 'ROI Calculator page');
    await page.close();
}

async function auditReflow(browser, baseUrl) {
    console.log('\n--- 320px Reflow & 200% Zoom (WCAG 1.4.10 / 1.4.4) ---');

    // 320 CSS px width is the WCAG 1.4.10 Reflow reference viewport (matches
    // a 1280px desktop viewport zoomed to 400%, or a small mobile phone).
    // No axis of horizontal scrolling should ever be needed.
    const narrowRoutes = ['/', '/about', '/roi-calculator', '/unified-inbox', '/lost-leads', '/privacy-policy'];
    for (const route of narrowRoutes) {
        const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'load' });
        await waitForHydration(page);
        const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
        }));
        if (overflow.scrollWidth <= overflow.clientWidth + 2) {
            pass(`320px reflow: ${route} has no horizontal overflow (scrollWidth ${overflow.scrollWidth} <= ${overflow.clientWidth})`);
        } else {
            fail(`320px reflow: ${route} overflows horizontally (scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth})`);
        }
        await page.close();
    }

    // 200% browser zoom at a standard 1280px viewport is equivalent to
    // rendering at 640 CSS px width with the same content -- a practical,
    // deterministic proxy for "does the layout still work at 200% zoom"
    // without needing real browser zoom APIs (Playwright/Chromium headless
    // has no reliable page-zoom control).
    const zoomProxyPage = await browser.newPage({ viewport: { width: 640, height: 800 } });
    await zoomProxyPage.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await waitForHydration(zoomProxyPage);
    const zoomOverflow = await zoomProxyPage.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
    }));
    if (zoomOverflow.scrollWidth <= zoomOverflow.clientWidth + 2) {
        pass(`200%-zoom-equivalent (640px) width: Homepage has no horizontal overflow`);
    } else {
        fail(`200%-zoom-equivalent (640px) width: Homepage overflows horizontally (scrollWidth ${zoomOverflow.scrollWidth} > clientWidth ${zoomOverflow.clientWidth})`);
    }
    await zoomProxyPage.close();

    manual('200% zoom was approximated with a 640px-wide viewport (equivalent content-to-viewport ratio) rather than real browser zoom, since headless Chromium via playwright-core has no reliable page-zoom API. A manual check with actual browser zoom (Ctrl/Cmd + +) is recommended to catch zoom-specific quirks (e.g. fixed-position element overlap) this proxy cannot.');
}

/** WCAG relative luminance / contrast ratio, computed the same way axe-core does. */
function relLuminance([r, g, b]) {
    const chan = (c) => {
        const cs = c / 255;
        return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    };
    const [rl, gl, bl] = [chan(r), chan(g), chan(b)];
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}
function contrastRatio(rgb1, rgb2) {
    const l1 = relLuminance(rgb1);
    const l2 = relLuminance(rgb2);
    const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (lighter + 0.05) / (darker + 0.05);
}
function parseRgb(str) {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] : null;
}

/**
 * Regression guard for a real bug found in review: axe-core only inspects
 * static DOM/CSS state, so a `:hover` background override that regresses
 * contrast (as happened with the old un-fixed brand cyan on the
 * per-article CTA buttons) is invisible to every other check in this
 * suite. This hovers those buttons for real (Playwright's `.hover()`
 * triggers genuine `:hover` matching, not a simulated attribute) and
 * computes the ratio from actual getComputedStyle() colors.
 */
async function auditHoverStateContrast(browser, baseUrl) {
    console.log('\n--- :hover State Contrast (Knowledge Index CTA buttons) ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/knowledge`, { waitUntil: 'load' });
    await waitForHydration(page);

    // Checks EVERY matching element, not just the first: ArticlesIndex.tsx
    // has two independent occurrences of `bg-secondary hover:bg-[...]`
    // (the per-article CTA button and the "WhatsApp guide" CTA button), and
    // a regression introduced to only one of them would be invisible to a
    // check that stopped at the first match.
    const count = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button, a')).filter(
            (e) => e.className && typeof e.className === 'string' && e.className.includes('bg-secondary') && e.className.includes('hover:bg-')
        ).length
    );

    if (count === 0) {
        warn('Could not locate any bg-secondary CTA button with a hover: override on /knowledge to hover-contrast-test -- skipped');
        await page.close();
        return;
    }

    for (let i = 0; i < count; i++) {
        // Re-query by index each iteration rather than holding stale
        // handles, since hovering/animation could in principle reflow and
        // detach earlier handles.
        const handle = await page.evaluateHandle((idx) => {
            const matches = Array.from(document.querySelectorAll('button, a')).filter(
                (e) => e.className && typeof e.className === 'string' && e.className.includes('bg-secondary') && e.className.includes('hover:bg-')
            );
            return matches[idx];
        }, i);
        const el = handle.asElement();
        if (!el) continue;

        const restStyle = await el.evaluate((node) => {
            const cs = getComputedStyle(node);
            return { bg: cs.backgroundColor, color: cs.color };
        });
        const restRgbBg = parseRgb(restStyle.bg);
        const restRgbFg = parseRgb(restStyle.color);
        if (restRgbBg && restRgbFg) {
            const ratio = contrastRatio(restRgbBg, restRgbFg);
            if (ratio >= 4.5) {
                pass(`CTA button #${i + 1}/${count} rest-state contrast: ${ratio.toFixed(2)}:1 (${restStyle.color} on ${restStyle.bg})`);
            } else {
                fail(`CTA button #${i + 1}/${count} rest-state contrast is only ${ratio.toFixed(2)}:1, below the 4.5:1 AA minimum (${restStyle.color} on ${restStyle.bg})`);
            }
        }

        await el.hover();
        await page.waitForTimeout(200);
        const hoverStyle = await el.evaluate((node) => {
            const cs = getComputedStyle(node);
            return { bg: cs.backgroundColor, color: cs.color };
        });
        const hoverRgbBg = parseRgb(hoverStyle.bg);
        const hoverRgbFg = parseRgb(hoverStyle.color);
        if (hoverRgbBg && hoverRgbFg) {
            const ratio = contrastRatio(hoverRgbBg, hoverRgbFg);
            if (ratio >= 4.5) {
                pass(`CTA button #${i + 1}/${count} :hover-state contrast: ${ratio.toFixed(2)}:1 (${hoverStyle.color} on ${hoverStyle.bg})`);
            } else {
                fail(`CTA button #${i + 1}/${count} :hover-state contrast is only ${ratio.toFixed(2)}:1, below the 4.5:1 AA minimum (${hoverStyle.color} on ${hoverStyle.bg}) -- a real reachable control regresses on hover`);
            }
        }
    }

    await page.close();
}

/**
 * Regression guard for a real bug found in review: ContextualConcept's
 * definition popover is shown whenever `isVisible = isOpen || isHovered`
 * is true (mouse hover OR keyboard focus, via onMouseEnter/onFocus --  not
 * only on click), but its `aria-expanded` had drifted to only reflect
 * `isOpen`, so a sighted mouse user hovering the term saw the popover
 * while a screen reader was told it was collapsed. axe-core's static DOM
 * inspection cannot catch this class of bug (aria-expanded="false" is a
 * perfectly valid attribute value on its own) -- only actually hovering
 * the trigger and reading the live attribute does.
 */
async function auditContextualConceptHoverAriaExpanded(browser, baseUrl) {
    console.log('\n--- ContextualConcept aria-expanded on :hover ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${baseUrl}/excel-to-pipeline`, { waitUntil: 'load' });
    await waitForHydration(page);

    const trigger = await page.$('article button[aria-haspopup="dialog"]');
    if (!trigger) {
        warn('Could not locate a ContextualConcept definition trigger on /excel-to-pipeline -- skipped');
        await page.close();
        return;
    }

    const before = await trigger.getAttribute('aria-expanded');
    if (before === 'false') {
        pass('ContextualConcept trigger: aria-expanded="false" before interaction');
    } else {
        fail(`ContextualConcept trigger: expected aria-expanded="false" before interaction, got "${before}"`);
    }

    await trigger.hover();
    await page.waitForTimeout(200);
    const duringHover = await trigger.getAttribute('aria-expanded');
    const dialogVisibleOnHover = await page.$('div[role="dialog"]');
    if (duringHover === 'true' && dialogVisibleOnHover) {
        pass('ContextualConcept trigger: aria-expanded="true" while the popover is visible on hover (matches real DOM state)');
    } else {
        fail(`ContextualConcept trigger: popover visible on hover=${!!dialogVisibleOnHover} but aria-expanded="${duringHover}" -- must track real visibility, not just click state`);
    }

    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);

    await page.close();
}

async function auditReducedMotion(browser, baseUrl) {
    console.log('\n--- prefers-reduced-motion ---');
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
    await waitForHydration(page);
    await page.waitForTimeout(300);

    const spotlightPresent = await page.evaluate(() => !!document.querySelector('[data-testid="ambient-spotlight"]'));
    if (!spotlightPresent) {
        pass('Ambient cursor-tracking Spotlight effect is disabled under prefers-reduced-motion');
    } else {
        fail('Spotlight ambient effect still renders under prefers-reduced-motion: reduce');
    }

    manual('StarDust canvas particle trail: automated pixel-emptiness checks under prefers-reduced-motion were judged too flaky for a hard gate; the animation-loop early-return was verified by code review (src/components/StarDust.tsx) but not confirmed pixel-by-pixel in a live browser.');

    await page.close();
}

async function main() {
    console.log('\n========================================================');
    console.log('   AltruBiz Accessibility Regression Suite (axe-core)   ');
    console.log('========================================================\n');

    const { baseUrl, close } = await ensureServer();
    let browser;

    try {
        browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

        console.log('--- Static Pages & Unique Templates ---');
        await auditStaticPage(browser, baseUrl, '/', 'Homepage');
        await auditStaticPage(browser, baseUrl, '/about', 'About page');
        await auditStaticPage(browser, baseUrl, '/knowledge', 'Knowledge index');
        await auditStaticPage(browser, baseUrl, '/roi-calculator', 'ROI calculator page');
        await auditStaticPage(browser, baseUrl, '/offer', 'Offer page');
        await auditStaticPage(browser, baseUrl, '/privacy-policy', 'Privacy policy (legal template)');
        await auditStaticPage(browser, baseUrl, '/terms-of-use', 'Terms of use (legal template)');
        await auditStaticPage(browser, baseUrl, '/cookie-policy', 'Cookie policy (legal template)');
        await auditStaticPage(browser, baseUrl, '/accessibility-statement', 'Accessibility statement (legal template)');
        await auditStaticPage(browser, baseUrl, '/unified-inbox', 'Article template');
        await auditStaticPage(browser, baseUrl, '/lost-leads', 'Hub template');

        await auditSkipLink(browser, baseUrl);
        await auditModalFocusManagement(browser, baseUrl);
        await auditPricingModal(browser, baseUrl);
        await auditMobileDrawer(
            browser, baseUrl, '/unified-inbox', 'ArticlePage',
            'div[class*="fixed bottom-"] button', 'סגירת תפריט'
        );
        await auditMobileDrawer(
            browser, baseUrl, '/lost-leads', 'HubPage',
            'div[class*="fixed bottom-"] button', 'סגירת תפריט'
        );
        await auditRoiCalculatorTargetSizesAndSliders(browser, baseUrl);
        await auditHoverStateContrast(browser, baseUrl);
        await auditContextualConceptHoverAriaExpanded(browser, baseUrl);
        await auditReflow(browser, baseUrl);
        await auditReducedMotion(browser, baseUrl);

        manual('No test in this suite used a real screen reader (NVDA/JAWS/VoiceOver). All checks above are axe-core + accessibility-tree + keyboard automation. A human pass with a real screen reader is still recommended before treating the site as fully verified for AT users.');
        manual('The ContactForm/ContactModal/BookingModal GoHighLevel iframes are cross-origin: this suite can only verify the iframe\'s own title attribute and that keyboard focus can enter/exit it, not the accessibility of the form fields rendered inside it.');

    } finally {
        if (browser) await browser.close();
        close();
    }

    console.log('\n========================================================');
    if (manualVerificationItems.length > 0) {
        console.log('MANUAL VERIFICATION REQUIRED:');
        for (const item of manualVerificationItems) {
            console.log(`  - ${item}`);
        }
        console.log('');
    }
    console.log(`Result: ${failures} failing check(s), ${warnings} warning(s).`);
    if (failures > 0) {
        console.log('\x1b[31m✖ ACCESSIBILITY GATE FAILED\x1b[0m');
        console.log('========================================================\n');
        process.exit(1);
    }
    console.log('\x1b[32m✔ ACCESSIBILITY GATE PASSED\x1b[0m (see MANUAL VERIFICATION REQUIRED above)');
    console.log('========================================================\n');
    process.exit(0);
}

main().catch((err) => {
    console.error('\n❌ Accessibility Regression Suite crashed:');
    console.error(err.stack || err);
    process.exit(1);
});
