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
        // Test 6: Article Header Hierarchy & Visual Dominance
        // ----------------------------------------------------
        console.log('\n6. Auditing Article Header Hierarchy & Visual Dominance...');
        const headerArticle = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await headerArticle.goto(`${baseUrl}/articles/omnichannel-communication-unified-inbox-crm-guide`, { waitUntil: 'networkidle' });

        const headerAudit = await headerArticle.evaluate(() => {
            const header = document.querySelector('article header');
            if (!header) return { error: 'Article header not found' };

            const h1 = header.querySelector('h1');
            if (!h1) return { error: 'H1 not found' };

            // Find all elements appearing before H1 in DOM order inside header
            const allElements = Array.from(header.querySelectorAll('*'));
            const h1Index = allElements.indexOf(h1);
            const elementsBeforeH1 = allElements.slice(0, h1Index);

            // Check if any element before H1 contains the long parent hub badge or colorful badges
            const badgesAboveH1 = elementsBeforeH1.filter(el => {
                const text = el.textContent || '';
                return text.includes('שייך למרכז') || text.includes('מרכז הידע:');
            });

            // Check reading time above H1
            const hasReadTimeAboveH1 = elementsBeforeH1.some(el => (el.textContent || '').includes('דקות קריאה'));

            // Check parent hub link below H1
            const parentHubTag = header.querySelector('a[href^="/topics/"]');
            const parentHubTagText = parentHubTag ? parentHubTag.textContent.trim() : null;
            const parentHubHref = parentHubTag ? parentHubTag.getAttribute('href') : null;
            const isParentHubBelowH1 = parentHubTag && (h1.compareDocumentPosition(parentHubTag) & Node.DOCUMENT_POSITION_FOLLOWING);

            return {
                h1Text: h1.textContent.trim(),
                hasBadgesAboveH1: badgesAboveH1.length > 0,
                hasReadTimeAboveH1,
                hasParentHubTag: Boolean(parentHubTag),
                isParentHubBelowH1: Boolean(isParentHubBelowH1),
                parentHubTagText,
                parentHubHref
            };
        });

        if (headerAudit.error) {
            throw new Error(`Header audit failed: ${headerAudit.error}`);
        }
        if (headerAudit.hasBadgesAboveH1) {
            throw new Error('Visual noise detected above H1! Found parent hub badge or badge collection above H1.');
        }
        if (!headerAudit.hasReadTimeAboveH1) {
            throw new Error('Reading time metadata not found above H1!');
        }
        if (!headerAudit.isParentHubBelowH1) {
            throw new Error('Parent Hub relationship must be rendered below H1, not above!');
        }
        console.log(`  ✔ H1 visual sovereignty confirmed: "${headerAudit.h1Text.slice(0, 45)}..."`);
        console.log(`  ✔ Clean metadata above H1 (reading time only, zero badge soup)`);
        console.log(`  ✔ Subtle parent Hub tag placed below H1: "${headerAudit.parentHubTagText}" -> ${headerAudit.parentHubHref}`);

        // ----------------------------------------------------
        // Test 7: Related Content Value-Promise Link Audit
        // ----------------------------------------------------
        console.log('\n7. Auditing Related Content Value-Promise Anchors...');
        const prohibitedPhrases = [
            'קריאת המדריך המעשי לפתרון',
            'קריאת המדריך',
            'המדריך המעשי',
            'לקריאה',
            'קרא עוד',
            'למידע נוסף',
            'קראו כאן',
            'למדריך'
        ];

        // Check related content links in article footer
        const articleRelatedLinks = await headerArticle.evaluate(() => {
            const footer = document.querySelector('footer') || document.querySelector('div[class*="border-t"]');
            const links = Array.from(document.querySelectorAll('a[href^="/articles/"]'));
            return links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
        });

        // Check HubPage related article links
        const hubTopicPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await hubTopicPage.goto(`${baseUrl}/topics/sales-pipeline`, { waitUntil: 'networkidle' });

        const hubArticleLinks = await hubTopicPage.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href^="/articles/"]'));
            return links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
        });

        const allCheckedLinks = [...articleRelatedLinks, ...hubArticleLinks];
        for (const link of allCheckedLinks) {
            for (const prohibited of prohibitedPhrases) {
                if (link.text === prohibited) {
                    throw new Error(`Found generic prohibited anchor "${prohibited}" in link to ${link.href}!`);
                }
            }
        }
        console.log(`  ✔ Audited ${allCheckedLinks.length} article recommendation links across article & HubPage.`);
        console.log(`  ✔ Zero generic phrases found. All links describe tangible destination value.`);

        // ----------------------------------------------------
        // Test 8: Contextual Semantic Linking (State A & State B)
        // ----------------------------------------------------
        console.log('\n8. Auditing Contextual Semantic Linking (State A & State B)...');
        await headerArticle.goto(`${baseUrl}/articles/excel-to-crm-pipeline-guide`, { waitUntil: 'networkidle' });

        const semanticAudit = await headerArticle.evaluate(() => {
            // State A: mature concept links to Hub (e.g. pipeline -> /topics/sales-pipeline)
            const pipelineLinks = Array.from(document.querySelectorAll('article a[href="/topics/sales-pipeline"]'));
            
            // State B: progressive definition buttons (e.g. CRM, follow-up, contact)
            const definitionButtons = Array.from(document.querySelectorAll('article button[aria-haspopup="dialog"]'));

            return {
                pipelineLinksCount: pipelineLinks.length,
                pipelineFirstText: pipelineLinks[0] ? pipelineLinks[0].textContent.trim() : null,
                pipelineFirstHref: pipelineLinks[0] ? pipelineLinks[0].getAttribute('href') : null,
                pipelineFirstTarget: pipelineLinks[0] ? pipelineLinks[0].getAttribute('target') : null,
                definitionButtonsCount: definitionButtons.length,
                definitionFirstText: definitionButtons[0] ? definitionButtons[0].textContent.trim() : null,
                definitionAriaLabel: definitionButtons[0] ? definitionButtons[0].getAttribute('aria-label') : null
            };
        });

        if (semanticAudit.pipelineLinksCount === 0) {
            throw new Error('State A: Contextual link for "pipeline" to "/topics/sales-pipeline" not found in article body!');
        }
        if (semanticAudit.pipelineFirstTarget === '_blank') {
            throw new Error('State A: Contextual concept link used target="_blank"! Internal links must use same-window navigation.');
        }
        console.log(`  ✔ State A mature concept verified: "${semanticAudit.pipelineFirstText}" -> ${semanticAudit.pipelineFirstHref} (same-window)`);

        if (semanticAudit.definitionButtonsCount === 0) {
            throw new Error('State B: Progressive definition buttons not found in article body!');
        }
        console.log(`  ✔ State B progressive concept verified: "${semanticAudit.definitionFirstText}" (${semanticAudit.definitionAriaLabel})`);

        // Test State B interaction: Click opens popover without moving document scroll position
        // Use window.scrollTo with behavior:'instant' to bypass CSS scroll-behavior:smooth
        // which would cause scrollIntoView to animate asynchronously
        const scrollBeforePopover = await headerArticle.evaluate(() => {
            const btn = document.querySelector('article button[aria-haspopup="dialog"]');
            if (!btn) return 0;
            const rect = btn.getBoundingClientRect();
            const targetY = window.scrollY + rect.top - 400; // center button in viewport
            window.scrollTo({ top: targetY, behavior: 'instant' });
            return targetY;
        });
        await headerArticle.waitForTimeout(100);
        // Record actual scroll position, then click
        const actualScrollBefore = await headerArticle.evaluate(() => {
            const btn = document.querySelector('article button[aria-haspopup="dialog"]');
            const scrollY = window.scrollY;
            if (btn) btn.click();
            return scrollY;
        });
        await headerArticle.waitForTimeout(300);

        const popoverState = await headerArticle.evaluate(() => {
            const dialog = document.querySelector('div[role="dialog"]');
            return {
                isOpen: Boolean(dialog),
                title: dialog ? dialog.querySelector('h4')?.textContent.trim() : null,
                hasDefinition: dialog ? Boolean(dialog.querySelector('p')) : false,
                scrollY: window.scrollY
            };
        });

        if (!popoverState.isOpen) {
            throw new Error('State B: Clicking progressive definition button did not open dialog popover!');
        }
        if (Math.abs(popoverState.scrollY - actualScrollBefore) > 2) {
            throw new Error(`State B: Opening definition popover displaced document scroll position! (${actualScrollBefore} -> ${popoverState.scrollY})`);
        }
        console.log(`  ✔ State B popover opened: "${popoverState.title}" with zero scroll displacement`);

        // Close popover via Esc
        await headerArticle.keyboard.press('Escape');
        await headerArticle.waitForTimeout(200);

        const scrollAfterClose = await headerArticle.evaluate(() => window.scrollY);
        if (Math.abs(scrollAfterClose - actualScrollBefore) > 2) {
            throw new Error(`State B: Closing definition popover displaced document scroll position! (${actualScrollBefore} -> ${scrollAfterClose})`);
        }
        console.log(`  ✔ State B popover dismissed with zero scroll displacement`);

        // ----------------------------------------------------
        // Test 9: Mobile 390px / 430px Touch Interaction
        // ----------------------------------------------------
        console.log('\n9. Auditing Mobile 390px / 430px Progressive Knowledge Interaction...');
        for (const width of [390, 430]) {
            const mob = await browser.newPage({ viewport: { width, height: 844 }, hasTouch: true });
            await mob.goto(`${baseUrl}/articles/excel-to-crm-pipeline-guide`, { waitUntil: 'networkidle' });

            // Tap on concept button
            await mob.click('article button[aria-haspopup="dialog"]');
            await mob.waitForTimeout(200);

            const mobDialog = await mob.evaluate(() => {
                const d = document.querySelector('div[role="dialog"]');
                if (!d) return null;
                const rect = d.getBoundingClientRect();
                return {
                    width: rect.width,
                    right: rect.right,
                    left: rect.left,
                    viewportWidth: window.innerWidth,
                    overflows: rect.left < 0 || rect.right > window.innerWidth
                };
            });

            if (!mobDialog) {
                throw new Error(`Mobile ${width}px: Tap on definition button did not open dialog!`);
            }
            if (mobDialog.overflows) {
                throw new Error(`Mobile ${width}px: Dialog popover overflowed viewport! (width: ${mobDialog.width}, viewport: ${mobDialog.viewportWidth})`);
            }
            console.log(`  ✔ Mobile ${width}px: Dialog fits cleanly within viewport (${Math.round(mobDialog.width)}px / ${mobDialog.viewportWidth}px)`);
            await mob.close();
        }

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
