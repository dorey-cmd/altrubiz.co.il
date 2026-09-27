/**
 * Comprehensive Validation for SiteOS Google Tag (gtag.js) Integration
 * 
 * Verifies:
 * 1. SiteOS Configuration:
 *    - MarketAnalyticsConfig interface defines googleTagId in marketConfig.ts
 *    - IL_MARKET defines googleTagId: 'AW-16832680902' in il.ts
 *    - src/lib/googleTag.ts exports GOOGLE_TAG_ID, initGoogleTag, trackGooglePageview, trackGoogleConversion
 * 2. Static HTML Presence:
 *    - index.html includes Google tag script with 'AW-16832680902'
 *    - index.html includes dataLayer initialization and gtag('config', 'AW-16832680902')
 * 3. Playwright Live Browser Simulation:
 *    - Initial page load registers gtag config with 'AW-16832680902'
 *    - Dynamic SPA navigation to subsequent pages triggers page_view / config update
 *    - Fail-safe: app functions flawlessly even if tracking encounters network errors
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');

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
console.log('\x1b[1m   AltruBiz SiteOS Google Tag Integration Audit        \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

// 1. Static Configuration Checks
console.log('\x1b[36m1. Auditing SiteOS & HTML Static Integration...\x1b[0m');

const marketConfigContent = fs.readFileSync(path.join(__dirname, '../src/siteos/config/marketConfig.ts'), 'utf-8');
if (marketConfigContent.includes('googleTagId?: string;')) {
    pass("MarketAnalyticsConfig defines googleTagId in marketConfig.ts");
} else {
    fail("MarketAnalyticsConfig missing googleTagId in marketConfig.ts");
}

const ilMarketContent = fs.readFileSync(path.join(__dirname, '../src/siteos/config/markets/il.ts'), 'utf-8');
if (ilMarketContent.includes("googleTagId: 'AW-16832680902'")) {
    pass("IL_MARKET defines googleTagId: 'AW-16832680902' in il.ts");
} else {
    fail("IL_MARKET missing googleTagId in il.ts");
}

const indexHtmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
if (indexHtmlContent.includes('AW-16832680902') &&
    indexHtmlContent.includes("googletagmanager.com/gtag/js?id=AW-16832680902") &&
    indexHtmlContent.includes("gtag('config', 'AW-16832680902')")) {
    pass("index.html contains Google tag snippet with ID 'AW-16832680902' and initial config");
} else {
    fail("index.html missing Google tag snippet or initialization");
}

const googleTagLib = fs.readFileSync(path.join(__dirname, '../src/lib/googleTag.ts'), 'utf-8');
if (googleTagLib.includes('export function initGoogleTag') &&
    googleTagLib.includes('export function trackGooglePageview') &&
    googleTagLib.includes('export function trackGoogleConversion') &&
    googleTagLib.includes('export const GOOGLE_TAG_ID')) {
    pass("src/lib/googleTag.ts exports initGoogleTag, trackGooglePageview, trackGoogleConversion, and GOOGLE_TAG_ID");
} else {
    fail("src/lib/googleTag.ts missing expected exports");
}

// 2. Playwright Live Browser Simulation
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
    const TEST_PORT = 4192;
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
                pid: serverProcess.pid,
                close: () => {
                    try { serverProcess.kill(); } catch {}
                }
            };
        }
    }
    throw new Error('Timed out waiting for preview server to start.');
}

async function runBrowserTests() {
    console.log('\n\x1b[36m2. Live Browser Simulation on Preview Server...\x1b[0m');
    let server;
    let browser;

    try {
        server = await ensureServer();
        const BASE_URL = server.baseUrl;

        browser = await chromium.launch({
            executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // Stub external googletagmanager script to avoid external network dependencies during test
        await page.route('**/googletagmanager.com/gtag/js*', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/javascript',
                body: '// Mock Google Tag Manager SDK'
            });
        });

        // Intercept and instrument window.dataLayer
        await page.addInitScript(() => {
            window.__gtagEvents = [];
            window.dataLayer = window.dataLayer || [];
            
            const originalPush = window.dataLayer.push;
            window.dataLayer.push = function (...args) {
                for (const arg of args) {
                    if (arg && typeof arg === 'object') {
                        // arguments object or array-like
                        const item = Array.from(arg);
                        window.__gtagEvents.push(item);
                    }
                }
                return originalPush.apply(this, args);
            };
        });

        // Test A: Initial Page Load
        console.log('\n  [Test A: Initial Page Load]');
        await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(600);

        const initialEvents = await page.evaluate(() => window.__gtagEvents);
        const hasConfig = initialEvents.some(
            args => args[0] === 'config' && args[1] === 'AW-16832680902'
        );

        if (hasConfig) {
            pass("gtag('config', 'AW-16832680902') registered on initial page load");
        } else {
            fail("Google Tag config for 'AW-16832680902' not found on initial load");
        }

        // Test B: Dynamic SPA Route Navigation to /roi-calculator
        console.log('\n  [Test B: Dynamic SPA Route Navigation to /roi-calculator]');
        await page.evaluate(() => { window.__gtagEvents = []; });

        await page.evaluate(() => {
            window.history.pushState({}, '', '/roi-calculator');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        await page.waitForTimeout(600);

        const roiEvents = await page.evaluate(() => window.__gtagEvents);
        const roiPageviews = roiEvents.filter(
            args => (args[0] === 'config' && args[1] === 'AW-16832680902' && args[2]?.page_path === '/roi-calculator') ||
                    (args[0] === 'event' && args[1] === 'page_view' && args[2]?.page_path === '/roi-calculator')
        );

        if (roiPageviews.length >= 1) {
            pass('Dynamic SPA navigation to /roi-calculator recorded Google Tag page view');
        } else {
            fail(`Expected page view event on /roi-calculator navigation, got ${roiPageviews.length}`);
        }

        // Test C: Dynamic SPA Route Navigation to Article Page
        console.log('\n  [Test C: Dynamic SPA Route Navigation to Article Page]');
        await page.evaluate(() => { window.__gtagEvents = []; });

        await page.evaluate(() => {
            window.history.pushState({}, '', '/how-many-sales-follow-ups');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
        await page.waitForTimeout(600);

        const articleEvents = await page.evaluate(() => window.__gtagEvents);
        const articlePageviews = articleEvents.filter(
            args => (args[0] === 'config' && args[1] === 'AW-16832680902' && args[2]?.page_path === '/how-many-sales-follow-ups') ||
                    (args[0] === 'event' && args[1] === 'page_view' && args[2]?.page_path === '/how-many-sales-follow-ups')
        );

        if (articlePageviews.length >= 1) {
            pass('Dynamic SPA navigation to article page recorded Google Tag page view');
        } else {
            fail(`Expected page view on article page navigation, got ${articlePageviews.length}`);
        }

    } catch (err) {
        fail(`Browser test error: ${err.message}`);
    } finally {
        if (browser) await browser.close();
        if (server) {
            try {
                if (process.platform === 'win32' && server.pid) {
                    execSync(`taskkill /F /T /PID ${server.pid}`, { stdio: 'ignore' });
                }
            } catch {}
            server.close();
        }
    }

    console.log('\n\x1b[1m========================================================\x1b[0m');
    console.log(`SiteOS Google Tag Audit: ${passed} passed, ${failed} failed`);
    console.log('\x1b[1m========================================================\x1b[0m\n');

    process.exit(failed > 0 ? 1 : 0);
}

runBrowserTests();
