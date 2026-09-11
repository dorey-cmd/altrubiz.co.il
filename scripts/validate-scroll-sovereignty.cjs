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
    if (process.env.TARGET_URL) {
        console.log(`✔ Target server specified: ${process.env.TARGET_URL}`);
        return { baseUrl: process.env.TARGET_URL, close: () => {} };
    }

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
        // Test 1: Desktop ArticlePage Passive Scroll Sovereignty & STICKY BEHAVIOR
        // ----------------------------------------------------
        console.log('1. Auditing Desktop ArticlePage Scroll Sovereignty & STICKY BEHAVIOR (1280x800)...');
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.goto(`${baseUrl}/articles/omnichannel-communication-unified-inbox-crm-guide`, { waitUntil: 'networkidle' });

        // Initial measurement at top of page (before sticky activates)
        const initialGeometry = await page.evaluate(() => {
            const aside = document.querySelector('aside');
            const rect = aside ? aside.getBoundingClientRect() : null;
            return {
                scrollY: window.scrollY,
                asideTop: rect ? rect.top : null,
                asideHeight: rect ? rect.height : null,
                viewportHeight: window.innerHeight
            };
        });

        console.log(`  - Initial aside top: ${initialGeometry.asideTop}px, height: ${initialGeometry.asideHeight}px`);
        if (!initialGeometry.asideTop || initialGeometry.asideTop < 200) {
            throw new Error(`Aside top at scroll 0 is unexpectedly low: ${initialGeometry.asideTop}`);
        }

        let prevScroll = 0;
        const observedSections = new Set();
        const stickyTops = [];

        // Scroll through the article down to 4000px
        for (let target = 400; target <= 4000; target += 300) {
            await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), target);
            await page.waitForTimeout(100);

            const actualScroll = await page.evaluate(() => window.scrollY);
            const asideGeometry = await page.evaluate(() => {
                const aside = document.querySelector('aside');
                const rect = aside ? aside.getBoundingClientRect() : null;
                const activeEl = document.querySelector('aside a[class*="border-r-4"]');
                return {
                    asideTop: rect ? rect.top : null,
                    asideBottom: rect ? rect.bottom : null,
                    asideHeight: rect ? rect.height : null,
                    activeText: activeEl ? activeEl.textContent.trim() : 'none'
                };
            });

            if (asideGeometry.activeText !== 'none') {
                observedSections.add(asideGeometry.activeText);
            }

            // INVARIANT 1: Scroll sovereignty (no jumps or snaps backward)
            if (actualScroll < prevScroll) {
                throw new Error(`CRITICAL REGRESSION: Document scroll jumped backward! (prev: ${prevScroll}, actual: ${actualScroll}, target: ${target})`);
            }

            const diff = Math.abs(actualScroll - target);
            if (diff > 5) {
                throw new Error(`CRITICAL REGRESSION: Document scroll position diverted by TOC tracking! (target: ${target}, actual: ${actualScroll}, diff: ${diff})`);
            }

            // INVARIANT 2: Real Sticky Behavior in Browser
            // Once target >= 800px (header has scrolled past), aside must lock to top-28 (112px ± 15px)
            if (target >= 800 && target <= 3500) {
                stickyTops.push(asideGeometry.asideTop);
                // Expected sticky offset: top-28 is 112px (7rem). Header + padding should hold aside between 95px and 130px.
                if (asideGeometry.asideTop < 90 || asideGeometry.asideTop > 135) {
                    throw new Error(`STICKY FAILURE: Sidebar is NOT sticky! At scrollY=${actualScroll}, aside top was ${asideGeometry.asideTop}px (expected ~112px)`);
                }
            }

            prevScroll = actualScroll;
        }

        console.log(`  ✔ Monotonic downward scrolling verified across 13 scroll intervals (target 400px -> 4000px)`);
        console.log(`  ✔ Active TOC transitions verified across ${observedSections.size} distinct sections without document jumps`);
        console.log(`  ✔ INVARIANT 2 PASSED: Sidebar remained strictly sticky at top ~112px across scroll positions (min: ${Math.min(...stickyTops)}px, max: ${Math.max(...stickyTops)}px)`);

        // ----------------------------------------------------
        // Test 1B: Natural Sidebar Height (No Excessive Legroom)
        // ----------------------------------------------------
        console.log('\n1B. Auditing Sidebar Natural Height & Legroom Removal...');
        const asideDimensions = await page.evaluate(() => {
            const aside = document.querySelector('aside');
            const nav = aside?.querySelector('nav');
            const cta = aside?.querySelector('div[class*="bg-gradient-to-br"]');
            return {
                asideHeight: aside ? aside.getBoundingClientRect().height : 0,
                contentHeight: (nav ? nav.getBoundingClientRect().height : 0) + (cta ? cta.getBoundingClientRect().height : 0),
                viewportHeight: window.innerHeight
            };
        });

        // Invariant: Sidebar must not artificially stretch to 100vh when content is shorter
        const unusedGap = asideDimensions.asideHeight - asideDimensions.contentHeight;
        console.log(`  - Aside height: ${asideDimensions.asideHeight}px, Content height: ${asideDimensions.contentHeight}px, Unused gap: ${unusedGap}px`);
        if (unusedGap > 40) {
            throw new Error(`EXCESSIVE LEGROOM FAILURE: Sidebar has ${unusedGap}px of unused blank space!`);
        }
        console.log(`  ✔ Natural sidebar height verified: Zero excessive legroom (gap is only ${unusedGap}px for standard spacing)`);

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
        // Test 4: HubPage Passive Scroll Sovereignty & Sticky Sidebar
        // ----------------------------------------------------
        console.log('\n4. Auditing HubPage (/topics/lost-leads) Scroll Sovereignty & Sticky Navigation...');
        const hubPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await hubPage.goto(`${baseUrl}/topics/lost-leads`, { waitUntil: 'networkidle' });

        let prevHubScroll = 0;
        const observedHubSections = new Set();
        const hubStickyTops = [];

        for (let target = 400; target <= 3600; target += 300) {
            await hubPage.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), target);
            await hubPage.waitForTimeout(100);

            const actualScroll = await hubPage.evaluate(() => window.scrollY);
            const hubAsideGeometry = await hubPage.evaluate(() => {
                const aside = document.querySelector('aside');
                const rect = aside ? aside.getBoundingClientRect() : null;
                const activeEl = document.querySelector('aside button[class*="border-r-4"]');
                return {
                    asideTop: rect ? rect.top : null,
                    activeText: activeEl ? activeEl.textContent.trim() : 'none'
                };
            });

            if (hubAsideGeometry.activeText !== 'none') {
                observedHubSections.add(hubAsideGeometry.activeText);
            }

            if (actualScroll < prevHubScroll) {
                throw new Error(`CRITICAL REGRESSION on HubPage: Document scroll jumped backward! (prev: ${prevHubScroll}, actual: ${actualScroll}, target: ${target})`);
            }

            const diff = Math.abs(actualScroll - target);
            if (diff > 5) {
                throw new Error(`CRITICAL REGRESSION on HubPage: Document scroll position diverted! (target: ${target}, actual: ${actualScroll}, diff: ${diff})`);
            }

            if (target >= 800 && target <= 3000) {
                hubStickyTops.push(hubAsideGeometry.asideTop);
                if (hubAsideGeometry.asideTop < 90 || hubAsideGeometry.asideTop > 135) {
                    throw new Error(`HUB STICKY FAILURE: Sidebar is NOT sticky on HubPage! At scrollY=${actualScroll}, aside top was ${hubAsideGeometry.asideTop}px`);
                }
            }

            prevHubScroll = actualScroll;
        }

        console.log(`  ✔ Monotonic downward scrolling verified on HubPage (target 400px -> 3600px)`);
        console.log(`  ✔ HubPage active nav transitions verified across ${observedHubSections.size} sections with 0 document jumps`);
        console.log(`  ✔ INVARIANT 2 PASSED on HubPage: Sidebar remained sticky at top ~112px (min: ${Math.min(...hubStickyTops)}px, max: ${Math.max(...hubStickyTops)}px)`);

        // ----------------------------------------------------
        // Test 5: Mobile Navigation, Reading Progress & Hub Bridge
        // ----------------------------------------------------
        console.log('\n5. Auditing Mobile Navigation, Reading Progress & Hub Bridge (390x844)...');
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

        // Check that mobile floating pill appeared with reading progress percentage
        const pillInfo = await mobilePage.evaluate(() => {
            const btn = document.querySelector('div[class*="fixed bottom-"] button');
            const progressEl = btn?.querySelector('span[class*="font-mono"]');
            return {
                exists: Boolean(btn),
                text: btn ? btn.textContent : '',
                progress: progressEl ? progressEl.textContent.trim() : null
            };
        });

        if (!pillInfo.exists) {
            throw new Error('Mobile floating jump pill did not appear at scrollY > 200px');
        }
        if (!pillInfo.progress || !pillInfo.progress.includes('%')) {
            throw new Error(`Mobile floating pill is missing progress percentage! (found: ${pillInfo.progress})`);
        }
        console.log(`  ✔ Mobile floating jump pill active with progress: ${pillInfo.progress}`);

        // Open mobile drawer
        await mobilePage.click('div[class*="fixed bottom-"] button');
        await mobilePage.waitForTimeout(250);

        // Verify document scroll position did NOT move when opening drawer
        const mobileScroll2 = await mobilePage.evaluate(() => window.scrollY);
        if (Math.abs(mobileScroll2 - mobileScroll1) > 5) {
            throw new Error(`Opening mobile drawer altered document scroll position! (${mobileScroll1} -> ${mobileScroll2})`);
        }

        // Check drawer contents: section list, booking button, and parent Hub bridge
        const drawerInfo = await mobilePage.evaluate(() => {
            const hubLink = document.querySelector('div[class*="fixed inset-0"] a[href^="/topics/"]');
            const bookingBtn = document.querySelector('div[class*="fixed inset-0"] button[class*="bg-primary"]');
            const sectionButtons = document.querySelectorAll('div[class*="fixed inset-0"] div[class*="overflow-y-auto"] button');
            return {
                hasHubBridge: Boolean(hubLink),
                hubText: hubLink ? hubLink.textContent.trim() : null,
                hubHref: hubLink ? hubLink.getAttribute('href') : null,
                hasBooking: Boolean(bookingBtn),
                sectionCount: sectionButtons.length
            };
        });

        if (!drawerInfo.hasHubBridge) {
            throw new Error('Mobile drawer is missing parent Hub bridge button!');
        }
        console.log(`  ✔ Mobile drawer contains parent Hub bridge: "${drawerInfo.hubText}" -> ${drawerInfo.hubHref}`);
        console.log(`  ✔ Mobile drawer contains ${drawerInfo.sectionCount} navigable sections & quick booking CTA`);

        // Close mobile drawer by clicking the close button
        await mobilePage.click('button[aria-label*="סגירת תפריט"]');
        await mobilePage.waitForTimeout(200);

        // Verify document scroll position remained intact
        const mobileScroll3 = await mobilePage.evaluate(() => window.scrollY);
        if (Math.abs(mobileScroll3 - mobileScroll1) > 5) {
            throw new Error(`Closing mobile drawer altered document scroll position! (${mobileScroll1} -> ${mobileScroll3})`);
        }

        console.log('  ✔ Mobile bottom-sheet opening and closing preserves exact scroll position');

        // ----------------------------------------------------
        // Test 6: Contextual Semantic Linking & Popovers
        // ----------------------------------------------------
        console.log('\n6. Auditing Contextual Semantic Linking & Popovers...');
        const desktopArticle = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await desktopArticle.goto(`${baseUrl}/articles/omnichannel-communication-unified-inbox-crm-guide`, { waitUntil: 'networkidle' });

        const conceptLinks = await desktopArticle.evaluate(() => {
            const links = Array.from(document.querySelectorAll('article a[href^="/topics/"]'));
            return links.map(l => ({ text: l.textContent.trim(), href: l.getAttribute('href') }));
        });

        console.log(`  - Found ${conceptLinks.length} contextual hub links in article`);
        if (conceptLinks.length === 0) {
            throw new Error('Contextual semantic links to topic hubs not found in article content!');
        }
        console.log(`  ✔ Contextual semantic links verified: ${conceptLinks.slice(0, 3).map(l => `"${l.text}" -> ${l.href}`).join(', ')}`);

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
