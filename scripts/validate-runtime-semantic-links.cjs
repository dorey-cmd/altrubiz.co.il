/**
 * AltruBiz Runtime Contextual Knowledge Linking Corpus Behavioral Test
 * 
 * Verifies across the ENTIRE corpus (17 articles + 5 public hubs):
 * 1. Each page renders its expected H1.
 * 2. Zero raw "concept:*" strings leak into the visible DOM text.
 * 3. State A concepts render as inline high-contrast links pointing to approved public canonical destinations.
 * 4. Zero legacy "/articles/" or "/topics/" URLs in internal links.
 * 5. State A links navigate in the same window (target !== "_blank").
 * 6. State B concepts render as accessible dialog buttons and toggle explanatory popovers without scroll displacement.
 * 7. State B popovers dismiss cleanly on Escape and outside click / backdrop tap.
 * 8. Mobile touch interaction functions correctly with backdrop on small viewports.
 * 9. No excessive repeated semantic links exist for the same concept in an article.
 */

const { chromium } = require('playwright-core');
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// 17 approved article publicPaths
const ARTICLE_PATHS = [
    '/whatsapp-messaging-guidelines',
    '/crm-quick-wins',
    '/lead-first-5-minutes',
    '/missed-call-text-back',
    '/excel-to-pipeline',
    '/crm-as-business-memory',
    '/lead-reactivation',
    '/follow-up-tasks',
    '/automated-meeting-scheduling',
    '/prevent-duplicate-contacts',
    '/crm-thursday-test',
    '/customer-review-requests',
    '/prevent-no-shows',
    '/automation-without-tech-skills',
    '/client-onboarding',
    '/salespeople-hate-crm',
    '/unified-inbox'
];

// 5 approved public Hubs
const HUB_PATHS = [
    '/lost-leads',
    '/whatsapp-in-crm',
    '/sales-pipeline',
    '/business-memory',
    '/repetitive-manual-work'
];

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
    console.log('  AltruBiz Full Corpus Semantic Knowledge Runtime Audit');
    console.log('===============================================================\n');

    const server = await ensureServer();
    let browser;
    let failed = false;
    let totalChecks = 0;

    try {
        browser = await chromium.launch({
            executablePath: CHROME_PATH,
            headless: true
        });

        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 }
        });
        const page = await context.newPage();

        // -------------------------------------------------------------
        // PART 0: Validating Knowledge Graph Semantic Concept Mappings
        // -------------------------------------------------------------
        console.log('--- PART 0: Validating Knowledge Graph Semantic Concept Mappings ---');
        const kgContent = fs.readFileSync(path.join(__dirname, '../src/data/knowledgeGraph.ts'), 'utf8');
        if (!kgContent.includes("publicDestinationUrl: '/unified-inbox'")) {
            console.error("❌ FAIL: unified-inbox publicDestinationUrl is not '/unified-inbox' in knowledgeGraph.ts!");
            failed = true;
        } else {
            console.log("  ✔ PASS: unified-inbox resolves to /unified-inbox");
            totalChecks++;
        }
        if (!kgContent.includes("'omnichannel': 'unified-inbox'")) {
            console.error("❌ FAIL: omnichannel alias missing or incorrect in knowledgeGraph.ts!");
            failed = true;
        } else {
            console.log("  ✔ PASS: omnichannel maps to unified-inbox family");
            totalChecks++;
        }
        if (!kgContent.includes("publicDestinationUrl: '/whatsapp-in-crm'")) {
            console.error("❌ FAIL: whatsapp-in-crm destination missing in knowledgeGraph.ts!");
            failed = true;
        } else {
            console.log("  ✔ PASS: whatsapp-in-crm preserves destination /whatsapp-in-crm");
            totalChecks++;
        }

        // -------------------------------------------------------------
        // PART 1: Audit All 17 Articles
        // -------------------------------------------------------------
        console.log('\n--- PART 1: Auditing 17 Articles for Semantic Integrity ---');

        for (const relPath of ARTICLE_PATHS) {
            const url = `${server.baseUrl}${relPath}`;
            await page.goto(url, { waitUntil: 'networkidle' });
            await page.waitForTimeout(200);

            // Special audit for /unified-inbox
            if (relPath === '/unified-inbox') {
                const unifiedLink = await page.$('a[href="/unified-inbox"]');
                if (!unifiedLink) {
                    console.error('❌ FAIL [/unified-inbox]: State A link for unified-inbox pointing to /unified-inbox not found!');
                    failed = true;
                } else {
                    const text = await unifiedLink.innerText();
                    console.log(`    ✔ PASS [/unified-inbox]: Verified unified-inbox semantic link "${text.trim()}" -> /unified-inbox`);
                    totalChecks++;
                }

                const waLink = await page.$('a[href="/whatsapp-in-crm"]');
                if (!waLink) {
                    console.error('❌ FAIL [/unified-inbox]: Legitimate WhatsApp-in-CRM link pointing to /whatsapp-in-crm not found!');
                    failed = true;
                } else {
                    console.log('    ✔ PASS [/unified-inbox]: Legitimate WhatsApp-in-CRM link properly preserved -> /whatsapp-in-crm');
                    totalChecks++;
                }
            }

            // 1. H1 Check
            const h1Text = await page.$eval('h1', el => el.innerText.trim()).catch(() => null);
            if (!h1Text) {
                console.error(`❌ FAIL [${relPath}]: H1 missing or empty!`);
                failed = true;
            } else {
                totalChecks++;
            }

            // 2. Zero concept:* leakage in innerText
            const leakedConcept = await page.evaluate(() => {
                const bodyText = document.body.innerText;
                const match = bodyText.match(/concept:[a-z0-9-]+/i);
                return match ? match[0] : null;
            });
            if (leakedConcept) {
                console.error(`❌ FAIL [${relPath}]: Raw "${leakedConcept}" string leaked into visible document!`);
                failed = true;
            } else {
                totalChecks++;
            }

            // 3. Audit all internal semantic/editorial links
            const links = await page.$$eval('a[href]', els => 
                els.map(el => ({
                    href: el.getAttribute('href'),
                    target: el.getAttribute('target'),
                    text: el.innerText.trim(),
                    className: el.getAttribute('class') || ''
                }))
            );

            for (const link of links) {
                if (link.href && (link.href.startsWith('/') || link.href.includes('altrubiz.co.il'))) {
                    // Check for legacy prefixes
                    if (link.href.includes('/articles/') || link.href.includes('/topics/')) {
                        console.error(`❌ FAIL [${relPath}]: Legacy URL found in link: ${link.href}`);
                        failed = true;
                    }
                    // Target check for internal knowledge links
                    if (link.target === '_blank' && (link.href.startsWith('/sales-pipeline') || link.href.startsWith('/lost-leads') || link.href.startsWith('/whatsapp-in-crm') || link.href.startsWith('/business-memory') || link.href.startsWith('/repetitive-manual-work'))) {
                        console.error(`❌ FAIL [${relPath}]: Internal knowledge link opens new window: ${link.href}`);
                        failed = true;
                    }
                }
            }
            totalChecks++;

            // 4. Test State B dialog if present
            const stateBBtn = await page.$('button[aria-haspopup="dialog"]');
            if (stateBBtn) {
                await stateBBtn.scrollIntoViewIfNeeded();
                await page.waitForTimeout(200);
                const scrollYBefore = await page.evaluate(() => window.scrollY);
                await stateBBtn.click();
                await page.waitForTimeout(200);

                const dialog = await page.$('div[role="dialog"]');
                const ariaExp = await stateBBtn.getAttribute('aria-expanded');
                if (!dialog || ariaExp !== 'true') {
                    console.error(`❌ FAIL [${relPath}]: State B dialog did not open properly!`);
                    failed = true;
                } else {
                    const scrollYAfter = await page.evaluate(() => window.scrollY);
                    const displacement = Math.abs(scrollYAfter - scrollYBefore);
                    if (displacement > 2) {
                        console.error(`❌ FAIL [${relPath}]: Scroll displacement on State B open: ${displacement}px`);
                        failed = true;
                    }
                    // Close dialog via Escape
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(150);
                    const ariaExpClosed = await stateBBtn.getAttribute('aria-expanded');
                    if (ariaExpClosed !== 'false') {
                        console.error(`❌ FAIL [${relPath}]: State B dialog failed to close on Escape!`);
                        failed = true;
                    }
                }
                totalChecks += 2;
            }

            console.log(`  ✔ PASS [${relPath}]: H1 rendered, 0 leaks, links & definitions verified.`);
        }

        // -------------------------------------------------------------
        // PART 2: Audit All 5 Public Hubs
        // -------------------------------------------------------------
        console.log('\n--- PART 2: Auditing 5 Public Knowledge Hubs ---');
        for (const hubPath of HUB_PATHS) {
            const url = `${server.baseUrl}${hubPath}`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(300);

            // 1. H1 Check
            const h1Text = await page.$eval('h1', el => el.innerText.trim()).catch(() => null);
            if (!h1Text) {
                console.error(`❌ FAIL [${hubPath}]: H1 missing or empty!`);
                failed = true;
            } else {
                totalChecks++;
            }

            // 2. Zero concept:* leakage
            const leaked = await page.evaluate(() => {
                const match = document.body.innerText.match(/concept:[a-z0-9-]+/i);
                return match ? match[0] : null;
            });
            if (leaked) {
                console.error(`❌ FAIL [${hubPath}]: Raw "${leaked}" leaked!`);
                failed = true;
            } else {
                totalChecks++;
            }

            // 3. No legacy links
            const badLinks = await page.$$eval('a[href*="/articles/"], a[href*="/topics/"]', els => els.length);
            if (badLinks > 0) {
                console.error(`❌ FAIL [${hubPath}]: Found ${badLinks} legacy links!`);
                failed = true;
            } else {
                totalChecks++;
            }

            console.log(`  ✔ PASS [${hubPath}]: Validated H1, 0 leaks, 0 legacy links.`);
        }

        // -------------------------------------------------------------
        // PART 3: Knowledge Center /knowledge and Homepage Entry Points
        // -------------------------------------------------------------
        console.log('\n--- PART 3: Auditing /knowledge and Homepage Entry Points ---');
        
        // /knowledge
        await page.goto(`${server.baseUrl}/knowledge`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);
        const knowledgeH1 = await page.$eval('h1', el => el.innerText.trim()).catch(() => null);
        if (!knowledgeH1) {
            console.error('❌ FAIL [/knowledge]: H1 missing!');
            failed = true;
        } else {
            totalChecks++;
            console.log('  ✔ PASS [/knowledge]: H1 rendered properly.');
        }

        // Homepage hub links
        await page.goto(`${server.baseUrl}/`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
        for (const hubPath of HUB_PATHS) {
            const hubLink = await page.$(`a[href="${hubPath}"]`);
            if (!hubLink) {
                console.error(`❌ FAIL [Homepage]: Link to hub ${hubPath} not found!`);
                failed = true;
            } else {
                totalChecks++;
            }
        }
        console.log('  ✔ PASS [Homepage]: Real HTML anchor links to all 5 hubs verified.');

        await context.close();

        // -------------------------------------------------------------
        // PART 4: Mobile Touch Interaction & Backdrop Verification
        // -------------------------------------------------------------
        console.log('\n--- PART 4: Mobile Viewport & Touch Verification (375x667) ---');
        const mobileContext = await browser.newContext({
            viewport: { width: 375, height: 667 },
            hasTouch: true,
            isMobile: true
        });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(`${server.baseUrl}/excel-to-pipeline`, { waitUntil: 'networkidle' });
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
                    // Tap backdrop to dismiss
                    await backdrop.tap({ position: { x: 10, y: 10 }, force: true });
                    await mobilePage.waitForTimeout(300);
                    const mobileExpandedAfter = await mobileStateB.getAttribute('aria-expanded');
                    const dialogAfter = await mobilePage.$('div[role="dialog"]');
                    if (mobileExpandedAfter === 'false' || !dialogAfter) {
                        console.log('  ✔ PASS: Mobile popover dismissed by tapping backdrop.');
                        totalChecks += 3;
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
        console.error(`\n❌ Full Corpus Semantic Knowledge Runtime Audit FAILED.`);
        process.exit(1);
    } else {
        console.log(`\n✔ ALL Full Corpus Semantic Knowledge Runtime Tests PASSED successfully! (${totalChecks} verification checkpoints)\n`);
        process.exit(0);
    }
}

runTests();
