/**
 * AltruBiz Scroll Sovereignty Behavioral Regression Test
 * 
 * Architectural Invariant:
 * "TOC follows reader. Reader NEVER follows TOC."
 * 
 * Verifies that passive active-section tracking inside the sticky sidebar
 * NEVER causes document/window scroll position to jump, snap, or move backward.
 */

const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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
    // Check if port 4173 is already up
    const isUp = await checkServer('http://localhost:4173/');
    if (isUp) {
        console.log('✔ Connected to active server on http://localhost:4173');
        return { baseUrl: 'http://localhost:4173', close: () => {} };
    }

    // Otherwise launch an ephemeral preview server on port 4179
    console.log('Starting ephemeral preview server on http://localhost:4179...');
    const serverProcess = spawn('npx', ['vite', 'preview', '--port', '4179'], {
        shell: true,
        stdio: 'pipe'
    });

    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 500));
        const up = await checkServer('http://localhost:4179/');
        if (up) {
            console.log('✔ Ephemeral server ready on http://localhost:4179');
            return {
                baseUrl: 'http://localhost:4179',
                close: () => {
                    try {
                        serverProcess.kill();
                    } catch {}
                }
            };
        }
    }

    throw new Error('Failed to start preview server for scroll test.');
}

async function runScrollAudit() {
    console.log('\n========================================================');
    console.log('   AltruBiz Scroll Sovereignty & TOC Behavioral Audit   ');
    console.log('========================================================\n');

    const { baseUrl, close } = await ensureServer();
    let browser;

    try {
        browser = await chromium.launch({
            executablePath: CHROME_PATH,
            headless: true
        });

        // ----------------------------------------------------
        // Test 1: Desktop ArticlePage Passive Scroll Sovereignty
        // ----------------------------------------------------
        console.log('1. Auditing Desktop ArticlePage Passive Scroll Sovereignty...');
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.goto(`${baseUrl}/articles/omnichannel-communication-unified-inbox-crm-guide`, { waitUntil: 'networkidle' });

        let prevScroll = 0;
        const observedSections = new Set();

        for (let target = 400; target <= 4000; target += 300) {
            await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), target);
            await page.waitForTimeout(100);

            const actualScroll = await page.evaluate(() => window.scrollY);
            const activeText = await page.evaluate(() => {
                const el = document.querySelector('aside a[class*="border-r-4"]');
                return el ? el.textContent.trim() : 'none';
            });

            if (activeText !== 'none') {
                observedSections.add(activeText);
            }

            // Invariant: Scroll must never jump backward during downward progression
            if (actualScroll < prevScroll) {
                throw new Error(`CRITICAL REGRESSION: Document scroll jumped backward! (prev: ${prevScroll}, actual: ${actualScroll}, target: ${target})`);
            }

            // Invariant: Actual scroll must strictly match user's scroll intent
            const diff = Math.abs(actualScroll - target);
            if (diff > 5) {
                throw new Error(`CRITICAL REGRESSION: Document scroll position diverted by TOC tracking! (target: ${target}, actual: ${actualScroll}, diff: ${diff})`);
            }

            prevScroll = actualScroll;
        }

        console.log(`  ✔ Monotonic downward scrolling verified across 13 scroll intervals (target 400px -> 4000px)`);
        console.log(`  ✔ Active TOC transitions verified across ${observedSections.size} distinct sections without document jumps`);

        // ----------------------------------------------------
        // Test 2: Intentional TOC Click vs Passive Tracking
        // ----------------------------------------------------
        console.log('\n2. Auditing Intentional TOC Click vs. Passive Tracking...');
        const scrollBeforeClick = await page.evaluate(() => window.scrollY);
        
        // Find a TOC link to an earlier section (e.g. section 1)
        const clicked = await page.evaluate(() => {
            const firstTocLink = document.querySelector('aside a[href^="#"]');
            if (firstTocLink) {
                firstTocLink.click();
                return true;
            }
            return false;
        });

        if (!clicked) {
            throw new Error('Failed to find TOC link to click.');
        }

        // Allow smooth scroll to settle
        await page.waitForTimeout(1000);
        const scrollAfterClick = await page.evaluate(() => window.scrollY);

        if (scrollAfterClick >= scrollBeforeClick) {
            throw new Error(`Intentional TOC click did not scroll document up to requested section (before: ${scrollBeforeClick}, after: ${scrollAfterClick})`);
        }
        console.log(`  ✔ Explicit TOC click successfully moved document from ${scrollBeforeClick}px to ${scrollAfterClick}px`);

        // ----------------------------------------------------
        // Test 3: Fast Jump & Drag Simulation on ArticlePage
        // ----------------------------------------------------
        console.log('\n3. Auditing Fast Jump & Scrollbar Drag Behavior...');
        await page.evaluate(() => window.scrollTo({ top: 3200, behavior: 'instant' }));
        await page.waitForTimeout(300);
        const jumpPos = await page.evaluate(() => window.scrollY);
        if (Math.abs(jumpPos - 3200) > 5) {
            throw new Error(`Fast jump to 3200px failed, position was ${jumpPos}px`);
        }
        console.log(`  ✔ Fast scroll jump to 3200px stayed rock-solid at ${jumpPos}px without feedback snap`);

        // ----------------------------------------------------
        // Test 4: HubPage Passive Scroll Sovereignty
        // ----------------------------------------------------
        console.log('\n4. Auditing HubPage (/topics/lost-leads) Scroll Sovereignty...');
        const hubPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await hubPage.goto(`${baseUrl}/topics/lost-leads`, { waitUntil: 'networkidle' });

        let prevHubScroll = 0;
        const observedHubSections = new Set();

        for (let target = 400; target <= 3600; target += 300) {
            await hubPage.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), target);
            await hubPage.waitForTimeout(100);

            const actualScroll = await hubPage.evaluate(() => window.scrollY);
            const activeText = await hubPage.evaluate(() => {
                const el = document.querySelector('aside button[class*="border-r-4"]');
                return el ? el.textContent.trim() : 'none';
            });

            if (activeText !== 'none') {
                observedHubSections.add(activeText);
            }

            if (actualScroll < prevHubScroll) {
                throw new Error(`CRITICAL REGRESSION on HubPage: Document scroll jumped backward! (prev: ${prevHubScroll}, actual: ${actualScroll}, target: ${target})`);
            }

            const diff = Math.abs(actualScroll - target);
            if (diff > 5) {
                throw new Error(`CRITICAL REGRESSION on HubPage: Document scroll position diverted! (target: ${target}, actual: ${actualScroll}, diff: ${diff})`);
            }

            prevHubScroll = actualScroll;
        }

        console.log(`  ✔ Monotonic downward scrolling verified on HubPage (target 400px -> 3600px)`);
        console.log(`  ✔ HubPage active nav transitions verified across ${observedHubSections.size} sections with 0 document jumps`);

        // ----------------------------------------------------
        // Test 5: Mobile Navigation Non-Interference
        // ----------------------------------------------------
        console.log('\n5. Auditing Mobile Navigation & Drawer Sovereignty (390x844)...');
        const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
        await mobilePage.goto(`${baseUrl}/articles/omnichannel-communication-unified-inbox-crm-guide`, { waitUntil: 'networkidle' });

        // Scroll to 800px on mobile
        await mobilePage.evaluate(() => {
            window.scrollTo({ top: 800, behavior: 'instant' });
            window.dispatchEvent(new Event('scroll'));
        });
        await mobilePage.waitForTimeout(200);
        const mobileScroll1 = await mobilePage.evaluate(() => window.scrollY);
        if (Math.abs(mobileScroll1 - 800) > 5) {
            throw new Error(`Mobile scroll to 800px failed, position was ${mobileScroll1}px`);
        }

        // Check that mobile floating pill appeared
        const hasMobilePill = await mobilePage.evaluate(() => {
            const btn = document.querySelector('div[class*="fixed bottom-"] button');
            return Boolean(btn);
        });

        if (!hasMobilePill) {
            throw new Error('Mobile floating jump pill did not appear at scrollY > 200px');
        }

        // Open mobile drawer
        await mobilePage.click('div[class*="fixed bottom-"] button');
        await mobilePage.waitForTimeout(200);

        // Verify document scroll position did NOT move when opening drawer
        const mobileScroll2 = await mobilePage.evaluate(() => window.scrollY);
        if (Math.abs(mobileScroll2 - mobileScroll1) > 5) {
            throw new Error(`Opening mobile drawer altered document scroll position! (${mobileScroll1} -> ${mobileScroll2})`);
        }

        // Close mobile drawer by clicking the close button
        await mobilePage.click('button[aria-label*="סגירת תפריט"]');
        await mobilePage.waitForTimeout(200);

        // Verify document scroll position remained intact
        const mobileScroll3 = await mobilePage.evaluate(() => window.scrollY);
        if (Math.abs(mobileScroll3 - mobileScroll1) > 5) {
            throw new Error(`Closing mobile drawer altered document scroll position! (${mobileScroll1} -> ${mobileScroll3})`);
        }

        console.log('  ✔ Mobile floating jump pill activates cleanly without layout shift');
        console.log('  ✔ Mobile bottom-sheet opening and closing preserves exact scroll position');

        console.log('\n========================================================');
        console.log('✔ All Scroll Sovereignty & Behavioral Audits PASSED!');
        console.log('========================================================\n');

    } finally {
        if (browser) await browser.close();
        close();
    }
}

runScrollAudit().catch((err) => {
    console.error('\n❌ Scroll Sovereignty Test FAILED:');
    console.error(err.message || err);
    process.exit(1);
});
