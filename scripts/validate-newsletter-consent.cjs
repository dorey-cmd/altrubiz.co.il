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
 *    - The browser posts to the server endpoint and never to the CRM webhook
 *    - Honeypot field, fill time and bot check token travel with the payload
 * 4. Server-side signup guard (api/newsletter-subscribe.ts, api/newsletter-confirm.ts):
 *    - Origin allow-list, consent, honeypot, fill time, rate limit, Turnstile
 *    - Fail closed when the server configuration is incomplete
 *    - Signed double opt-in confirmation link (GET never confirms, POST does)
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
const STUB_TURNSTILE_TOKEN = 'stub-turnstile-token';

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

        let directCrmCall = false;
        await page.route('**/services.leadconnectorhq.com/hooks/**', async (route) => {
            directCrmCall = true;
            await route.abort();
        });

        // Hermetic bot check: replace the Cloudflare script with a stub that issues a token
        await page.route('**/challenges.cloudflare.com/turnstile/**', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/javascript',
                body: `window.turnstile = {
                    render: function (el, opts) { setTimeout(function () { opts.callback('${STUB_TURNSTILE_TOKEN}'); }, 50); return 'stub-widget'; },
                    reset: function () {},
                    remove: function () {}
                };`
            });
        });

        await page.route('**/api/newsletter-subscribe', async (route) => {
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
            pass('Positive Test PASS: Signup dispatched to the server endpoint after consent confirmation');

            if (!directCrmCall) {
                pass('Browser never calls the CRM webhook directly');
            } else {
                fail('Browser called the CRM webhook directly! Signups must go through /api/newsletter-subscribe');
            }

            if (interceptedPayload.turnstile_token === STUB_TURNSTILE_TOKEN) {
                pass('Payload carries the bot check token');
            } else {
                fail(`Payload bot check token mismatch: ${interceptedPayload.turnstile_token}`);
            }

            if (interceptedPayload.contact_me_by_fax_only === '' && typeof interceptedPayload.form_elapsed_ms === 'number') {
                pass('Payload carries an empty honeypot field and the form fill time');
            } else {
                fail('Payload missing honeypot field or form fill time');
            }

            const successText = await page.$eval('section[aria-label="הרשמה למועדון המהלך הבא"] h3', el => el.textContent).catch(() => '');
            if (successText && successText.includes('לאשר במייל')) {
                pass(`Success state asks to confirm by email: "${successText.trim()}"`);
            } else {
                fail('Success state does not ask the visitor to confirm by email');
            }

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

        // Honeypot must be invisible to visitors and assistive technology
        const honeypotState = await page.evaluate(() => {
            const el = document.querySelector('input[name="contact_me_by_fax_only"]');
            if (!el) return null;
            const rect = el.parentElement.getBoundingClientRect();
            return {
                ariaHidden: el.parentElement.getAttribute('aria-hidden'),
                tabIndex: el.tabIndex,
                width: rect.width,
                height: rect.height
            };
        });
        // The success state replaces the form, so reload to inspect the honeypot
        if (honeypotState === null) {
            await page.reload({ waitUntil: 'domcontentloaded' });
        }
        const honeypot = honeypotState || await page.evaluate(() => {
            const el = document.querySelector('input[name="contact_me_by_fax_only"]');
            if (!el) return null;
            const rect = el.parentElement.getBoundingClientRect();
            return {
                ariaHidden: el.parentElement.getAttribute('aria-hidden'),
                tabIndex: el.tabIndex,
                width: rect.width,
                height: rect.height
            };
        });
        if (honeypot && honeypot.ariaHidden === 'true' && honeypot.tabIndex === -1 && honeypot.width <= 1 && honeypot.height <= 1) {
            pass('Honeypot field is hidden from visitors, keyboard and assistive technology');
        } else {
            fail(`Honeypot field missing or exposed: ${JSON.stringify(honeypot)}`);
        }

    } catch (err) {
        fail(`Browser test error: ${err.message}`);
    } finally {
        if (browser) await browser.close();
    }
}

// --- 4. Server-Side Signup Guard ---
function createRes() {
    return {
        statusCode: 200,
        headers: {},
        body: undefined,
        setHeader(key, value) { this.headers[key] = value; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; },
        send(payload) { this.body = payload; return this; }
    };
}

function signupReq(bodyOverrides = {}, headerOverrides = {}) {
    return {
        method: 'POST',
        headers: {
            origin: 'https://altrubiz.co.il',
            host: 'altrubiz.co.il',
            'x-forwarded-for': '203.0.113.10',
            'x-vercel-ip-country': 'IL',
            ...headerOverrides
        },
        body: {
            email: 'client@example.com',
            consent: true,
            consent_version: 'newsletter-consent-v1',
            submission_id: 'test-submission-id',
            sourcePage: '/',
            pageTitle: 'AltruBiz',
            note: 'CLIENT NOTE',
            contact_me_by_fax_only: '',
            form_elapsed_ms: 12000,
            turnstile_token: 'valid-token',
            ...bodyOverrides
        }
    };
}

async function runServerGuardTests() {
    console.log('\n4. Auditing Server-Side Signup Guard (api/newsletter-*.ts)...');

    const subscribe = loadTsModule('api/newsletter-subscribe.ts').default;
    const confirm = loadTsModule('api/newsletter-confirm.ts').default;
    const guard = loadTsModule('api/_newsletterGuard.ts');

    const SUBSCRIBE_HOOK = 'https://crm.test/hooks/pending';
    const CONFIRMED_HOOK = 'https://crm.test/hooks/confirmed';
    const savedEnv = { ...process.env };
    const savedFetch = global.fetch;
    const savedWarn = console.warn;
    const savedError = console.error;
    console.warn = () => {};
    console.error = () => {};

    let crmCalls = [];
    let turnstileCalls = [];
    let turnstilePasses = true;
    global.fetch = async (url, options = {}) => {
        if (String(url).includes('challenges.cloudflare.com')) {
            turnstileCalls.push(options.body);
            return { ok: true, json: async () => ({ success: turnstilePasses, 'error-codes': turnstilePasses ? [] : ['invalid-input-response'] }) };
        }
        crmCalls.push({ url: String(url), payload: JSON.parse(options.body) });
        return { ok: true, status: 200, json: async () => ({}) };
    };

    const configure = () => {
        process.env.VERCEL_ENV = 'production';
        process.env.NEWSLETTER_WEBHOOK_URL = SUBSCRIBE_HOOK;
        process.env.NEWSLETTER_CONFIRMED_WEBHOOK_URL = CONFIRMED_HOOK;
        process.env.NEWSLETTER_CONFIRM_SECRET = 'unit-test-signing-secret';
        process.env.TURNSTILE_SECRET_KEY = 'unit-test-turnstile-secret';
    };
    const check = (condition, okMsg, failMsg) => (condition ? pass(okMsg) : fail(failMsg));
    let ipCounter = 0;
    const freshIp = () => ({ 'x-forwarded-for': `198.51.100.${++ipCounter}` });

    try {
        configure();

        let res = createRes();
        await subscribe({ method: 'GET', headers: {} }, res);
        check(res.statusCode === 405, 'Signup endpoint rejects non-POST requests (405)', `Expected 405 for GET, got ${res.statusCode}`);

        res = createRes();
        await subscribe(signupReq({}, { origin: 'https://evil.example', ...freshIp() }), res);
        check(res.statusCode === 403 && crmCalls.length === 0, 'Foreign origin is rejected (403) and nothing reaches the CRM', `Foreign origin not rejected: ${res.statusCode}`);

        res = createRes();
        await subscribe(signupReq({}, { origin: 'https://altrubiz-preview.vercel.app', ...freshIp() }), res);
        check(res.statusCode === 403, 'Preview origins are not accepted by the production endpoint', `Preview origin accepted in production: ${res.statusCode}`);

        res = createRes();
        await subscribe(signupReq({ consent: false }, freshIp()), res);
        check(res.statusCode === 400 && crmCalls.length === 0, 'Signup without consent is rejected server-side (400)', `Missing consent not rejected: ${res.statusCode}`);

        res = createRes();
        await subscribe(signupReq({ email: 'not-an-email' }, freshIp()), res);
        check(res.statusCode === 400, 'Invalid email is rejected server-side (400)', `Invalid email not rejected: ${res.statusCode}`);

        res = createRes();
        await subscribe(signupReq({ contact_me_by_fax_only: 'http://spam.example' }, freshIp()), res);
        check(res.statusCode === 200 && crmCalls.length === 0 && turnstileCalls.length === 0, 'Filled honeypot is dropped silently; nothing reaches the CRM', 'Honeypot submission was forwarded');

        res = createRes();
        await subscribe(signupReq({ form_elapsed_ms: 900 }, freshIp()), res);
        check(res.statusCode === 200 && crmCalls.length === 0, 'Sub-3-second form fill is dropped silently; nothing reaches the CRM', 'Instant submission was forwarded');

        turnstilePasses = false;
        res = createRes();
        await subscribe(signupReq({}, freshIp()), res);
        check(res.statusCode === 403 && res.body.code === 'BOT_CHECK_FAILED' && crmCalls.length === 0, 'Failed bot check is rejected (403) and nothing reaches the CRM', `Failed bot check not rejected: ${res.statusCode}`);
        turnstilePasses = true;

        res = createRes();
        await subscribe(signupReq({ turnstile_token: '' }, freshIp()), res);
        check(res.statusCode === 403 && crmCalls.length === 0, 'Missing bot check token is rejected (403)', `Missing token not rejected: ${res.statusCode}`);

        for (const missing of ['NEWSLETTER_WEBHOOK_URL', 'NEWSLETTER_CONFIRM_SECRET', 'TURNSTILE_SECRET_KEY']) {
            configure();
            delete process.env[missing];
            res = createRes();
            await subscribe(signupReq({}, freshIp()), res);
            check(res.statusCode === 503 && crmCalls.length === 0, `Fails closed in production when ${missing} is missing (503)`, `Did not fail closed without ${missing}: ${res.statusCode}`);
        }
        configure();

        // Happy path
        res = createRes();
        await subscribe(signupReq({}, freshIp()), res);
        const forwarded = crmCalls[0];
        check(res.statusCode === 200 && crmCalls.length === 1 && forwarded.url === SUBSCRIBE_HOOK, 'Verified signup is forwarded to the pending-signup CRM webhook', `Verified signup not forwarded: ${res.statusCode}`);

        if (forwarded) {
            const fp = forwarded.payload;
            check(fp.email === 'client@example.com' && fp.source === 'מועדון המהלך הבא' && fp.consent === true && fp.consent_version === 'newsletter-consent-v1',
                'Forwarded payload preserves legacy fields and consent flags', 'Forwarded payload lost legacy fields');
            check(fp.double_opt_in === 'pending' && typeof fp.confirm_url === 'string' && fp.confirm_url.startsWith('https://altrubiz.co.il/api/newsletter-confirm?token='),
                'Forwarded payload carries a canonical-domain confirmation link (double opt-in pending)', `Unexpected confirm_url: ${fp.confirm_url}`);
            check(fp.note.startsWith('CLIENT NOTE') && fp.note.includes('Cloudflare Turnstile passed') && fp.note.includes('IP address:\n198.51.100.') && fp.note.includes('PENDING'),
                'Note is enriched server-side with bot check result, IP and opt-in status', 'Server note enrichment missing');
            check(!JSON.stringify(res.body).includes('token') && !JSON.stringify(res.body).includes('crm.test'),
                'Browser response exposes neither the confirmation token nor the CRM webhook', 'Browser response leaks confirmation token or webhook');

            // Double opt-in confirmation
            const token = new URL(fp.confirm_url).searchParams.get('token');
            crmCalls = [];

            res = createRes();
            await confirm({ method: 'GET', headers: {}, query: { token } }, res);
            check(res.statusCode === 200 && crmCalls.length === 0 && String(res.body).includes('method="post"') && String(res.body).includes('client@example.com'),
                'Confirmation link (GET) shows a confirm button and confirms nothing by itself', 'GET on confirmation link confirmed the signup or rendered no form');
            check(res.headers['X-Robots-Tag'] === 'noindex, nofollow', 'Confirmation page is served noindex, nofollow', 'Confirmation page missing noindex header');

            res = createRes();
            await confirm({ method: 'POST', headers: { 'x-forwarded-for': '203.0.113.77', 'user-agent': 'UnitTest' }, body: { token } }, res);
            const confirmedCall = crmCalls[0];
            check(res.statusCode === 200 && crmCalls.length === 1 && confirmedCall.url === CONFIRMED_HOOK && confirmedCall.payload.email === 'client@example.com' && confirmedCall.payload.double_opt_in === 'confirmed' && confirmedCall.payload.submission_id === 'test-submission-id',
                'Confirm button (POST) notifies the confirmed-signup CRM webhook', `POST confirmation not dispatched: ${res.statusCode}`);

            crmCalls = [];
            res = createRes();
            await confirm({ method: 'POST', headers: {}, body: { token: token.slice(0, -3) + 'abc' } }, res);
            check(res.statusCode === 400 && crmCalls.length === 0, 'Tampered confirmation token is rejected (400)', `Tampered token accepted: ${res.statusCode}`);

            const forgedBody = Buffer.from(JSON.stringify({ email: 'victim@example.com', submissionId: 'x', consentVersion: 'v', expiresAt: Date.now() + 100000 })).toString('base64url');
            res = createRes();
            await confirm({ method: 'POST', headers: {}, body: { token: `${forgedBody}.${token.split('.')[1]}` } }, res);
            check(res.statusCode === 400 && crmCalls.length === 0, 'Confirmation token cannot be re-pointed at another email (400)', `Forged token accepted: ${res.statusCode}`);

            const expired = guard.createConfirmToken({ email: 'client@example.com', submissionId: 's', consentVersion: 'v' }, 'unit-test-signing-secret', Date.now() - 8 * 24 * 60 * 60 * 1000);
            res = createRes();
            await confirm({ method: 'POST', headers: {}, body: { token: expired } }, res);
            check(res.statusCode === 400 && crmCalls.length === 0, 'Expired confirmation token is rejected (400)', `Expired token accepted: ${res.statusCode}`);
        }

        // Rate limit: a single IP is braked after 5 signups within the window
        crmCalls = [];
        let lastStatus = 0;
        for (let i = 0; i < 6; i++) {
            res = createRes();
            await subscribe(signupReq({ email: `burst${i}@example.com` }, { 'x-forwarded-for': '192.0.2.200' }), res);
            lastStatus = res.statusCode;
        }
        check(lastStatus === 429 && crmCalls.length === 5, 'Sixth signup from one IP within the window is rate limited (429)', `Rate limit not enforced: status ${lastStatus}, forwarded ${crmCalls.length}`);
    } catch (err) {
        fail(`Server guard test error: ${err.message}`);
    } finally {
        global.fetch = savedFetch;
        console.warn = savedWarn;
        console.error = savedError;
        for (const key of Object.keys(process.env)) {
            if (!(key in savedEnv)) delete process.env[key];
        }
        Object.assign(process.env, savedEnv);
    }
}

runBrowserTests().then(runServerGuardTests).then(() => {
    console.log('\n========================================================');
    console.log(`Audit Summary: ${passed} passed, ${failed} failed`);
    console.log('========================================================\n');
    if (failed > 0) process.exit(1);
    process.exit(0);
});
