/**
 * AltruBiz Runtime Contextual Knowledge Linking Behavioral Test
 * 
 * Verifies that:
 * 1. State A concepts (with approved public destinations) render as inline high-contrast links to their canonical hubs.
 * 2. State B concepts (without public destinations) render as defined term buttons with accessible popovers.
 * 3. Clicking State B opens popover with definition & CTA without displacing document scroll position.
 * 4. Dismissing State B via Escape, outside click, or backdrop works.
 * 5. Mobile touch interaction functions correctly with backdrop.
 * 6. Zero raw "concept:*" strings leak into the visible DOM text.
 */

const { chromium } = require('playwright-core');
const http = require('http');
const { spawn } = require('child_process');

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
        console.log(`✔ Using TARGET_URL: ${process.env.TARGET_URL}`);
        return { baseUrl: process.env.TARGET_URL, close: () => {} };
    }

    const isUp = await checkServer('http://localhost:4173/');
    if (isUp) {
        console.log('✔ Connected to active preview server on http://localhost:4173');
        return { baseUrl: 'http://localhost:4173', close: () => {} };
    }

    console.log('Starting ephemeral preview server on port 4188...');
    const proc = spawn('npx', ['vite', 'preview', '--port', '4188'], {
        shell: true,
        stdio: 'pipe'
    });

    for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (await checkServer('http://localhost:4188/')) {
            console.log('✔ Ephemeral server started on http://localhost:4188');
            return {
                baseUrl: 'http://localhost:4188',
                close: () => {
                    try {
                        process.kill(-proc.pid);
                    } catch (e) {
                        proc.kill();
                    }
                }
            };
        }
    }
    throw new Error('Failed to start preview server on port 4188.');
}

async function runTests() {
    console.log('\n===============================================================');
    console.log('  AltruBiz Contextual Knowledge Linking Runtime Behavioral Test');
    console.log('===============================================================\n');

    const server = await ensureServer();
    let browser;
    let failed = false;

    try {
        browser = await chromium.launch({
            executablePath: CHROME_PATH,
            headless: true
        });

        // -------------------------------------------------------------
        // TEST 1: Desktop Browser - State A & State B Verification
        // -------------------------------------------------------------
        console.log('--- TEST 1: Desktop Verification on /excel-to-pipeline ---');
        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 }
        });
        const page = await context.newPage();

        const targetUrl = `${server.baseUrl}/excel-to-pipeline`;
        await page.goto(targetUrl, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        // Check for any raw "concept:" leakage in the document text
        const hasLeakedConcept = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            return /concept:[a-z0-9-]+/i.test(bodyText);
        });
        if (hasLeakedConcept) {
            console.error('❌ FAIL: Raw "concept:*" string leaked into document.body.innerText!');
            failed = true;
        } else {
            console.log('  ✔ PASS: Zero raw "concept:*" strings leaked in visible body text.');
        }

        // Verify State A (Link to /sales-pipeline for "פייפליין")
        const stateALink = await page.$('a[href="/sales-pipeline"]');
        if (!stateALink) {
            console.error('❌ FAIL: State A link pointing to /sales-pipeline not found!');
            failed = true;
        } else {
            const linkText = await stateALink.innerText();
            const linkTarget = await stateALink.getAttribute('target');
            const linkClasses = await stateALink.getAttribute('class');
            console.log(`  ✔ PASS: State A link found. Text: "${linkText.trim()}", target="${linkTarget}"`);
            if (linkTarget !== '_self') {
                console.error(`❌ FAIL: State A target must be "_self", found "${linkTarget}"`);
                failed = true;
            }
            if (!linkClasses.includes('text-primary') || !linkClasses.includes('underline')) {
                console.error('❌ FAIL: State A link missing high-contrast text-primary or underline class');
                failed = true;
            } else {
                console.log('  ✔ PASS: State A link has distinct high-contrast visual affordance.');
            }
        }

        // Verify State B (Button with aria-haspopup="dialog" for "מערכת CRM")
        const stateBButton = await page.$('button[aria-haspopup="dialog"]');
        if (!stateBButton) {
            console.error('❌ FAIL: State B interactive concept button with aria-haspopup="dialog" not found!');
            failed = true;
        } else {
            const buttonText = await stateBButton.innerText();
            const ariaExpandedBefore = await stateBButton.getAttribute('aria-expanded');
            console.log(`  ✔ PASS: State B button found. Text: "${buttonText.trim()}", aria-expanded="${ariaExpandedBefore}"`);

            // Scroll so the button is in view
            await stateBButton.scrollIntoViewIfNeeded();
            await page.waitForTimeout(200);

            // Record scroll position before click
            const scrollYBefore = await page.evaluate(() => window.scrollY);

            // Click State B button to toggle popover
            await stateBButton.click();
            await page.waitForTimeout(300);

            // Verify aria-expanded is now true
            const ariaExpandedAfter = await stateBButton.getAttribute('aria-expanded');
            if (ariaExpandedAfter !== 'true') {
                console.error(`❌ FAIL: Expected aria-expanded="true" after click, got "${ariaExpandedAfter}"`);
                failed = true;
            } else {
                console.log('  ✔ PASS: aria-expanded toggled to "true" upon click.');
            }

            // Verify popover dialog appeared
            const popoverDialog = await page.$('div[role="dialog"]');
            if (!popoverDialog) {
                console.error('❌ FAIL: Definition popover div[role="dialog"] did not render!');
                failed = true;
            } else {
                const dialogText = await popoverDialog.innerText();
                console.log(`  ✔ PASS: Definition popover rendered. Content preview: "${dialogText.substring(0, 60)}..."`);
                
                // Verify scroll position was not displaced (Scroll Sovereignty)
                const scrollYAfter = await page.evaluate(() => window.scrollY);
                const scrollDiff = Math.abs(scrollYAfter - scrollYBefore);
                if (scrollDiff > 2) {
                    console.error(`❌ FAIL: Document scroll position displaced by ${scrollDiff}px during popover open!`);
                    failed = true;
                } else {
                    console.log(`  ✔ PASS: Scroll Sovereignty preserved (scroll displacement = ${scrollDiff}px).`);
                }
            }

            // Test Escape key dismissal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(200);
            const ariaExpandedEsc = await stateBButton.getAttribute('aria-expanded');
            if (ariaExpandedEsc === 'false') {
                console.log('  ✔ PASS: Popover dismissed via Escape key.');
            } else {
                console.error(`❌ FAIL: Expected popover to close on Escape, but aria-expanded is "${ariaExpandedEsc}"`);
                failed = true;
            }

            // Re-open and test outside click dismissal
            await stateBButton.click();
            await page.waitForTimeout(200);
            await page.mouse.click(100, 100);
            await page.waitForTimeout(200);
            const ariaExpandedOutside = await stateBButton.getAttribute('aria-expanded');
            if (ariaExpandedOutside === 'false') {
                console.log('  ✔ PASS: Popover dismissed via pointer click outside.');
            } else {
                console.error(`❌ FAIL: Expected popover to close on outside click, but aria-expanded is "${ariaExpandedOutside}"`);
                failed = true;
            }
        }

        await context.close();

        // -------------------------------------------------------------
        // TEST 2: Mobile Viewport & Touch Interaction
        // -------------------------------------------------------------
        console.log('\n--- TEST 2: Mobile Viewport & Touch Verification (375x667) ---');
        const mobileContext = await browser.newContext({
            viewport: { width: 375, height: 667 },
            hasTouch: true,
            isMobile: true
        });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });
        await mobilePage.waitForTimeout(400);

        const mobileStateB = await mobilePage.$('button[aria-haspopup="dialog"]');
        if (!mobileStateB) {
            console.error('❌ FAIL: State B button not found on mobile viewport!');
            failed = true;
        } else {
            await mobileStateB.scrollIntoViewIfNeeded();
            await mobilePage.waitForTimeout(100);

            // Tap State B on mobile
            await mobileStateB.tap();
            await mobilePage.waitForTimeout(300);

            const mobilePopover = await mobilePage.$('div[role="dialog"]');
            if (!mobilePopover) {
                console.error('❌ FAIL: Mobile definition popover did not appear upon tap!');
                failed = true;
            } else {
                console.log('  ✔ PASS: Mobile popover opened upon tap.');

                // Verify mobile backdrop exists
                const backdrop = await mobilePage.$('div[data-testid="concept-backdrop"]');
                if (!backdrop) {
                    console.error('❌ FAIL: Mobile modal backdrop not found!');
                    failed = true;
                } else {
                    console.log('  ✔ PASS: Mobile modal backdrop rendered.');
                    // Tap backdrop (at top corner away from centered dialog) to dismiss
                    await backdrop.tap({ position: { x: 10, y: 10 }, force: true });
                    await mobilePage.waitForTimeout(300);
                    const mobileExpandedAfter = await mobileStateB.getAttribute('aria-expanded');
                    const dialogAfter = await mobilePage.$('div[role="dialog"]');
                    if (mobileExpandedAfter === 'false' || !dialogAfter) {
                        console.log('  ✔ PASS: Mobile popover dismissed by tapping backdrop.');
                    } else {
                        console.error('❌ FAIL: Popover remained open after tapping mobile backdrop.');
                        failed = true;
                    }
                }
            }
        }

        await mobileContext.close();

    } catch (err) {
        console.error('❌ Unexpected error during test execution:', err);
        failed = true;
    } finally {
        if (browser) await browser.close();
        server.close();
    }

    if (failed) {
        console.error('\n❌ Semantic Links Runtime Verification FAILED.');
        process.exit(1);
    } else {
        console.log('\n✔ ALL Contextual Knowledge Linking Runtime Tests PASSED successfully!\n');
        process.exit(0);
    }
}

runTests();
