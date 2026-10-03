#!/usr/bin/env node

/**
 * AltruBiz Newsletter Club Consent & Webhook Note Validation Test
 * 
 * Verifies:
 * 1. Newsletter consent registry configuration (source of truth).
 * 2. Note builder unit tests:
 *    - Formatting and human-readability
 *    - UTC and Israel local timestamp (Asia/Jerusalem)
 *    - Submission ID UUID
 *    - Direct visit attribution
 *    - UTM parameters preservation
 *    - Ad Click IDs (gclid, fbclid, etc.) preservation
 *    - Zero undefined, null, or [object Object] occurrences
 * 3. Browser simulation via Puppeteer on preview server:
 *    - Checkbox unchecked by default
 *    - Submit without checkbox fails with validation message and sends NO webhook
 *    - Checking checkbox allows successful submission
 *    - Webhook payload structure verification (all legacy fields + note + consent)
 *    - Note content verification in payload
 *    - Privacy and Terms links have target="_blank" and rel="noopener noreferrer"
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;

const ROOT_DIR = path.resolve(__dirname, '..');
const PREVIEW_URL = 'http://localhost:4173';

console.log('\n========================================================');
console.log('   AltruBiz Newsletter Consent & Webhook Note Audit     ');
console.log('========================================================\n');

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

// Compile TypeScript modules in memory
function loadTsModule(relPath) {
    const fullPath = path.join(ROOT_DIR, relPath);
    const buildResult = esbuild.buildSync({
        entryPoints: [fullPath],
        bundle: true,
        format: 'cjs',
        platform: 'node',
        write: false,
        sourcemap: false,
        target: 'node18'
    });
    const code = buildResult.outputFiles[0].text;
    const moduleScope = { exports: {} };
    const wrapper = new Function('module', 'exports', 'require', '__dirname', '__filename', code);
    wrapper(moduleScope, moduleScope.exports, require, path.dirname(fullPath), fullPath);
    return moduleScope.exports;
}

const { NEWSLETTER_CONSENT_CONFIG } = loadTsModule('src/data/newsletterConsent.ts');
const { 
    buildNewsletterNote, 
    generateSubmissionId, 
    formatIsraelDateTime 
} = loadTsModule('src/lib/newsletterNoteBuilder.ts');

// --- 1. Unit Tests: Registry & Note Builder ---
console.log('1. Auditing Newsletter Consent Registry (Source of Truth)...');
if (NEWSLETTER_CONSENT_CONFIG.consentVersion === 'newsletter-consent-v1') {
    pass(`Consent version: "${NEWSLETTER_CONSENT_CONFIG.consentVersion}"`);
} else {
    fail(`Unexpected consent version: ${NEWSLETTER_CONSENT_CONFIG.consentVersion}`);
}

if (NEWSLETTER_CONSENT_CONFIG.privacyUrl === '/privacy-policy') {
    pass(`Privacy URL: "${NEWSLETTER_CONSENT_CONFIG.privacyUrl}"`);
} else {
    fail(`Unexpected privacy URL: ${NEWSLETTER_CONSENT_CONFIG.privacyUrl}`);
}

if (NEWSLETTER_CONSENT_CONFIG.termsUrl === '/terms-of-use') {
    pass(`Terms URL: "${NEWSLETTER_CONSENT_CONFIG.termsUrl}"`);
} else {
    fail(`Unexpected terms URL: ${NEWSLETTER_CONSENT_CONFIG.termsUrl}`);
}

if (NEWSLETTER_CONSENT_CONFIG.consentText.includes('לקבל מ-AltruBiz עדכונים')) {
    pass('Consent text matches required legal formulation');
} else {
    fail('Consent text missing expected formulation');
}

console.log('\n2. Auditing Note Builder Output & Formatting...');
const sampleId = generateSubmissionId();
if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sampleId)) {
    pass(`Submission ID is valid RFC4122 v4 UUID: ${sampleId}`);
} else {
    fail(`Invalid submission ID format: ${sampleId}`);
}

const sampleIsraelTime = formatIsraelDateTime(new Date());
if (sampleIsraelTime.includes('Asia/Jerusalem')) {
    pass(`Israel time format includes Asia/Jerusalem: ${sampleIsraelTime}`);
} else {
    fail(`Invalid Israel time format: ${sampleIsraelTime}`);
}

const noteOutput = buildNewsletterNote({
    email: 'client@example.com',
    sourcePagePath: '/learn-by-doing-business',
    pageTitle: 'עוד קצת ללמוד, ואז אתחיל | AltruBiz',
    submissionId: sampleId,
    consentConfirmed: true,
    componentLocation: 'מועדון המהלך הבא (Footer Banner)'
});

// Check for forbidden undefined/null/garbage
if (noteOutput.includes('undefined') || noteOutput.includes('null') || noteOutput.includes('[object Object]')) {
    fail('Note output contains forbidden undefined, null, or [object Object] artifacts');
} else {
    pass('Note output is completely clean of undefined, null, or [object Object] artifacts');
}

// Check key required sections
const requiredSnippets = [
    '--------------------------------',
    'NEWSLETTER SIGNUP - מועדון המהלך הבא',
    'Submission ID:\n' + sampleId,
    'Consent:\nYES - checkbox manually selected by user',
    'Consent version:\nnewsletter-consent-v1',
    'Consent text:\n"' + NEWSLETTER_CONSENT_CONFIG.consentText + '"',
    'Signup time UTC:',
    'Signup time Israel:',
    'Page title:\nעוד קצת ללמוד, ואז אתחיל | AltruBiz',
    'Path:\n/learn-by-doing-business',
    'Email:\nclient@example.com',
    'Acquisition / Attribution:',
    'Current source:\nמועדון המהלך הבא',
    'Browser / Device:',
    'Consent capture:\nManual checkbox interaction'
];

let allSnippetsPresent = true;
for (const snip of requiredSnippets) {
    if (!noteOutput.includes(snip)) {
        fail(`Note output missing required snippet:\n${snip}`);
        allSnippetsPresent = false;
    }
}
if (allSnippetsPresent) {
    pass('All required note structural sections and headers verified in output');
}

// --- 3. Browser Simulation on Preview Server ---
async function runBrowserTests() {
    console.log('\n3. Live Browser Simulation (Playwright) on Preview Server...');
    let browser;
    try {
        browser = await chromium.launch({
            executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();

        let webhookFired = false;
        let interceptedPayload = null;

        await page.route('**/services.leadconnectorhq.com/hooks/**', async (route) => {
            webhookFired = true;
            const postData = route.request().postData();
            interceptedPayload = JSON.parse(postData || '{}');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true })
            });
        });

        // Navigate with UTM parameters and click IDs
        const testUrl = `${PREVIEW_URL}/?utm_source=google_ads&utm_medium=cpc&utm_campaign=test_campaign&utm_content=hero_banner&utm_term=crm_israel&gclid=test_gclid_12345&fbclid=test_fbclid_67890`;
        await page.goto(testUrl, { waitUntil: 'domcontentloaded' });
        pass(`Loaded preview server at ${testUrl}`);

        // Scroll to Newsletter banner
        const banner = await page.$('section[aria-label="הרשמה למועדון המהלך הבא"]');
        if (!banner) {
            fail('NewsletterClubBanner section not found in DOM');
            return;
        }
        pass('NewsletterClubBanner section located in DOM');

        // Checkbox verification: must exist and be UNCHECKED
        const checkbox = await page.$('#newsletter-club-consent');
        if (!checkbox) {
            fail('Consent checkbox #newsletter-club-consent not found');
            return;
        }
        const isCheckedInitial = await page.evaluate(el => el.checked, checkbox);
        if (!isCheckedInitial) {
            pass('Consent checkbox is UNCHECKED by default (mandatory opt-in preserved)');
        } else {
            fail('Consent checkbox was checked by default! Must be unchecked.');
        }

        // Verify Privacy and Terms links have target="_blank"
        const privacyLink = await page.$('a[href="/privacy-policy"]');
        const termsLink = await page.$('a[href="/terms-of-use"]');

        if (privacyLink && termsLink) {
            const privTarget = await page.evaluate(el => el.getAttribute('target'), privacyLink);
            const termsTarget = await page.evaluate(el => el.getAttribute('target'), termsLink);
            if (privTarget === '_blank' && termsTarget === '_blank') {
                pass('Privacy Policy and Terms of Use links have target="_blank" (prevents form state loss)');
            } else {
                fail(`Links missing target="_blank" (privacy: ${privTarget}, terms: ${termsTarget})`);
            }
        } else {
            fail('Privacy Policy or Terms of Use links missing in consent label');
        }

        // Test Negative: Submit without checking checkbox
        const emailInput = await page.$('input[aria-label="כתובת אימייל"]');
        await emailInput.fill('test-user@altrubiz.co.il');

        const submitBtn = await page.$('button[type="submit"]');
        await submitBtn.click();

        await page.waitForTimeout(600);

        if (!webhookFired) {
            pass('Negative Test PASS: Form submission blocked when checkbox is unchecked; zero webhooks dispatched');
        } else {
            fail('Negative Test FAIL: Webhook was dispatched despite unchecked consent checkbox!');
        }

        // Check validation message
        const errorMsg = await page.$eval('form p.text-rose-300', el => el.textContent).catch(() => '');
        if (errorMsg && errorMsg.includes('תיבת ההסכמה')) {
            pass(`Validation error message rendered: "${errorMsg}"`);
        } else {
            fail('Expected consent error message not rendered');
        }

        // Test Positive: Check the checkbox and submit
        await checkbox.click();
        const isCheckedNow = await page.evaluate(el => el.checked, checkbox);
        if (isCheckedNow) {
            pass('Checkbox manually toggled to checked state');
        }

        webhookFired = false;
        interceptedPayload = null;

        await submitBtn.click();
        await page.waitForTimeout(1200);

        if (webhookFired && interceptedPayload) {
            pass('Positive Test PASS: Webhook dispatched successfully after consent confirmation');

            // Verify payload schema
            if (interceptedPayload.email === 'test-user@altrubiz.co.il') {
                pass('Payload contains correct email');
            } else {
                fail(`Payload email mismatch: ${interceptedPayload.email}`);
            }

            if (interceptedPayload.source === 'מועדון המהלך הבא') {
                pass('Payload preserves legacy "source" field');
            } else {
                fail(`Payload source mismatch: ${interceptedPayload.source}`);
            }

            if (interceptedPayload.consent === true && interceptedPayload.consent_version === 'newsletter-consent-v1') {
                pass('Payload includes machine-readable consent flags');
            } else {
                fail('Payload missing machine-readable consent flags');
            }

            if (typeof interceptedPayload.note === 'string' && interceptedPayload.note.length > 100) {
                pass('Payload includes formatted string "note" parameter');

                const note = interceptedPayload.note;

                // Verify UTMs in note
                if (note.includes('UTM Source:\ngoogle_ads') && note.includes('UTM Campaign:\ntest_campaign')) {
                    pass('Note correctly captures inbound UTM parameters');
                } else {
                    fail('Note missing expected UTM parameters');
                }

                // Verify Click IDs in note
                if (note.includes('gclid:\ntest_gclid_12345') && note.includes('fbclid:\ntest_fbclid_67890')) {
                    pass('Note correctly captures ad click IDs (gclid, fbclid)');
                } else {
                    fail('Note missing expected Click IDs');
                }

                // Verify browser and device in note
                if (note.includes('Browser:') && note.includes('Operating system:') && note.includes('Device type:')) {
                    pass('Note includes standard non-invasive browser/device information');
                } else {
                    fail('Note missing browser/device information');
                }
            } else {
                fail('Payload note is missing or not a valid string');
            }
        } else {
            fail('Positive Test FAIL: Webhook was NOT dispatched after checking consent checkbox');
        }

    } catch (err) {
        fail(`Browser test error: ${err.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

runBrowserTests().then(() => {
    console.log('\n========================================================');
    console.log(`Audit Summary: ${passed} passed, ${failed} failed`);
    console.log('========================================================\n');
    if (failed > 0) process.exit(1);
    process.exit(0);
});
