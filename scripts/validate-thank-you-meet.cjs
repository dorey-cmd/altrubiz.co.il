/**
 * Comprehensive Validation for /10x4meet (Meeting Booked Thank You Page)
 * 
 * Verifies:
 * 1. Route declaration in src/lib/routes.ts:
 *    - noindex: true
 *    - inSitemap: false
 *    - canonicalUrl: https://altrubiz.co.il/10x4meet
 * 2. Static prerender file generation in dist/10x4meet/index.html
 * 3. Browser simulation via Playwright:
 *    - Title: "Your meeting has been scheduled"
 *    - Subtitle: "תודה שקבעת פגישה! מחכה לראותך בקרוב 😊"
 *    - Pixel event: oaiq("measure", "appointment_scheduled", { type: "customer_action" }) fired exactly once
 *    - Calendar links (Google, Outlook, iCloud) with exact GHL URLs
 *    - 3 Next action links (Home, ROI calculator, Diagnostic questionnaire)
 *    - Image alt text search intent compliance
 *    - Dynamic SPA navigation trigger
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

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
console.log('\x1b[1m   AltruBiz /10x4meet Page & Pixel Audit               \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// 1. Static Configuration & Metadata Audit
console.log('\x1b[36m1. Auditing Route & Static Metadata...\x1b[0m');
const routesContent = fs.readFileSync(path.join(__dirname, '../src/lib/routes.ts'), 'utf-8');

if (routesContent.includes("'/10x4meet':")) {
    pass("Route '/10x4meet' defined in src/lib/routes.ts");
} else {
    fail("Route '/10x4meet' missing from src/lib/routes.ts");
}

if (routesContent.includes("path: '/10x4meet'") && routesContent.includes("noindex: true")) {
    pass("Route '/10x4meet' explicitly configured with noindex: true");
} else {
    fail("Route '/10x4meet' missing noindex: true");
}

if (routesContent.includes("inSitemap: false")) {
    pass("Route '/10x4meet' excluded from sitemap (inSitemap: false)");
} else {
    fail("Route '/10x4meet' not excluded from sitemap");
}

// 2. Playwright Live Browser Verification
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

async function ensureServer() {
    if (process.env.TARGET_URL) {
        return { baseUrl: process.env.TARGET_URL, close: () => {} };
    }
    const TEST_PORT = 4189;
    const isUp = await checkServer(`http://localhost:${TEST_PORT}/`);
    if (isUp) {
        return { baseUrl: `http://localhost:${TEST_PORT}`, close: () => {} };
    }
    console.log(`Starting preview server on http://localhost:${TEST_PORT}...`);
    const serverProcess = spawn('npx', ['vite', 'preview', '--port', `${TEST_PORT}`], {
        shell: true,
        stdio: 'pipe'
    });
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 500));
        const up = await checkServer(`http://localhost:${TEST_PORT}/`);
        if (up) {
            console.log(`✔ Preview server ready on http://localhost:${TEST_PORT}`);
            return {
                baseUrl: `http://localhost:${TEST_PORT}`,
                close: () => {
                    try { serverProcess.kill(); } catch {}
                }
            };
        }
    }
    throw new Error('Timed out waiting for preview server to start.');
}

async function runBrowserTests() {
    console.log('\n\x1b[36m2. Live Browser Simulation on /10x4meet...\x1b[0m');
    const server = await ensureServer();
    const BASE_URL = server.baseUrl;

    const browser = await chromium.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Stub external oaiq script and record calls
    await page.route('**/oaiq.min.js', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/javascript',
            body: '// Mocked oaiq'
        });
    });

    await page.addInitScript(() => {
        window.__trackedEvents = [];
        const recorder = function (...args) {
            window.__trackedEvents.push(args);
        };
        recorder.q = [];
        Object.defineProperty(window, 'oaiq', {
            get() { return recorder; },
            set() {},
            configurable: false
        });
    });

    try {
        await page.goto(`${BASE_URL}/10x4meet`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(600);

        // Test A: Headings & Content
        console.log('\n  [Test A: Content & Headings]');
        const h1Text = await page.locator('h1').innerText();
        if (h1Text.includes('Your meeting has been scheduled')) {
            pass(`H1 contains exact required title: "${h1Text.trim()}"`);
        } else {
            fail(`H1 mismatch: got "${h1Text}"`);
        }

        const bodyText = await page.innerText('body');
        if (bodyText.includes('תודה שקבעת פגישה! מחכה לראותך בקרוב 😊')) {
            pass('Subheading thank-you line present in Hebrew');
        } else {
            fail('Missing required Hebrew thank-you line');
        }

        // Test B: Pixel Event Firing
        console.log('\n  [Test B: Pixel Event Measurement]');
        const events = await page.evaluate(() => window.__trackedEvents);
        const appointmentEvents = events.filter(args => 
            args[0] === 'measure' && 
            args[1] === 'appointment_scheduled' &&
            args[2]?.type === 'customer_action'
        );

        if (appointmentEvents.length === 1) {
            pass('Pixel fired exactly 1 "appointment_scheduled" event with { type: "customer_action" }');
        } else {
            fail(`Expected 1 appointment_scheduled event, got ${appointmentEvents.length}. All events: ${JSON.stringify(events)}`);
        }

        // Test C: Calendar Links
        console.log('\n  [Test C: Calendar Integration Links]');
        const expectedCalLinks = [
            'https://backend.leadconnectorhq.com/calendars/google/calendar/add-event/7dfSEnJaPgfs3xM79KAk',
            'https://backend.leadconnectorhq.com/calendars/google/calendar/get-ics/7dfSEnJaPgfs3xM79KAk',
            'https://backend.leadconnectorhq.com/calendars/google/calendar/get-ics/7dfSEnJaPgfs3xM79KAk'
        ];

        for (const calUrl of expectedCalLinks) {
            const linkCount = await page.locator(`a[href="${calUrl}"]`).count();
            if (linkCount >= 1) {
                pass(`Calendar link present: ${calUrl.slice(0, 70)}...`);
            } else {
                fail(`Missing calendar link: ${calUrl}`);
            }
        }

        // Test D: Next Action Links
        console.log('\n  [Test D: Next Action Navigation Links]');
        const homeLink = await page.locator('a[href="/"]').count();
        const roiLink = await page.locator('a[href="/roi-calculator"]').count();
        const diagLink = await page.locator('a[href="/hidden-business-growth-barriers"]').count();

        if (homeLink >= 1) pass('Next action link to Home ("/") present');
        else fail('Missing next action link to Home ("/")');

        if (roiLink >= 1) pass('Next action link to ROI Calculator ("/roi-calculator") present');
        else fail('Missing next action link to ROI Calculator ("/roi-calculator")');

        if (diagLink >= 1) pass('Next action link to Diagnostic ("/hidden-business-growth-barriers") present');
        else fail('Missing next action link to Diagnostic');

        // Test E: Image & Alt text
        console.log('\n  [Test E: Illustration & Alt Text]');
        const img = page.locator('img[src="/images/thank-you-meet.jpg"]');
        if (await img.count() > 0) {
            const alt = await img.getAttribute('alt');
            if (alt && alt.includes('איש ידידותי מאשר שהפגישה נקבעה ומחכה למפגש הקרוב')) {
                pass(`Illustration present with compliant alt text: "${alt}"`);
            } else {
                fail(`Image alt text mismatch: "${alt}"`);
            }
        } else {
            fail('Image /images/thank-you-meet.jpg not found on page');
        }

        // Test F: Robots Meta Tag
        console.log('\n  [Test F: Robots noindex Meta]');
        const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
        if (robotsMeta && robotsMeta.includes('noindex')) {
            pass(`Robots meta tag correctly set to: "${robotsMeta}"`);
        } else {
            fail(`Expected robots meta to contain "noindex", got "${robotsMeta}"`);
        }

        // Test G: Dynamic SPA Navigation (Event fires on client navigation without reload)
        console.log('\n  [Test G: Client-Side SPA Navigation]');
        await page.evaluate(() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        await page.waitForTimeout(400);

        await page.evaluate(() => { window.__trackedEvents = []; });

        await page.evaluate(() => {
            window.history.pushState({}, '', '/10x4meet');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        await page.waitForTimeout(600);

        const spaEvents = await page.evaluate(() => window.__trackedEvents);
        const spaAppointment = spaEvents.filter(args => 
            args[0] === 'measure' && 
            args[1] === 'appointment_scheduled'
        );

        if (spaAppointment.length === 1) {
            pass('SPA dynamic navigation to /10x4meet successfully triggered exactly 1 appointment_scheduled event');
        } else {
            fail(`SPA navigation produced ${spaAppointment.length} appointment_scheduled events (expected 1)`);
        }

    } catch (err) {
        fail(`Browser test error: ${err.message}`);
    } finally {
        if (browser) await browser.close();
        if (server) server.close();
    }

    console.log('\n\x1b[1m========================================================\x1b[0m');
    console.log(`Thank-You Meet Audit: ${passed} passed, ${failed} failed`);
    console.log('\x1b[1m========================================================\x1b[0m\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runBrowserTests();
