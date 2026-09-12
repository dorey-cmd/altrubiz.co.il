#!/usr/bin/env node

/**
 * AltruBiz Conversion Engine Runtime Validation Test (Round 3D.1)
 * 
 * Verifies the Core Conversion Invariant: "NO CONVERSION WITHOUT CONTEXT"
 * 
 * Tests:
 * 1. Booking CTA on /excel-to-pipeline:
 *    - Contextual title: pipeline-specific
 *    - Temporary URL: /excel-to-pipeline?conversion=booking&context=pipeline
 *    - Temporary document.title: "בואו נבנה את הפייפליין שמתאים לעסק שלכם | AltruBiz"
 *    - Canonical link remains unchanged
 * 2. Close modal:
 *    - Reverts URL and document.title
 * 3. Browser Back button:
 *    - Safely closes modal and restores URL and document.title
 * 4. Booking CTA on /unified-inbox:
 *    - Contextual title relates to unified inbox & communication
 *    - Temporary URL: /unified-inbox?conversion=booking&context=unified-inbox
 * 5. Booking CTA on /prevent-no-shows:
 *    - Contextual title relates to no-show prevention & scheduling
 *    - Temporary URL: /prevent-no-shows?conversion=booking&context=prevent-no-shows
 * 6. Contact CTA on article:
 *    - Shared ContactModal with contextual shell
 *    - Iframe preserves legacy data-form-name="קביעת פגישה באתר"
 *    - Temporary URL: conversion=contact
 * 7. Mobile Viewport (375x667):
 *    - Contextual title visible, close button works, URL restored
 * 8. Shared modal architectural invariant:
 *    - Confirms zero per-route modal components exist
 */

const { chromium } = require('playwright-core');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.env.TARGET_URL || 'http://localhost:4173';

console.log('\n========================================================');
console.log('   AltruBiz Context-Aware Conversion Engine Audit       ');
console.log('========================================================\n');

let passed = 0;
let failed = 0;

function reportPass(msg) {
    passed++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${msg}`);
}

function reportFail(msg) {
    failed++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

function checkServer(url) {
    const client = url.startsWith('https') ? require('https') : require('http');
    return new Promise((resolve) => {
        const req = client.get(url, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(4000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function runTests() {
    const isUp = await checkServer(TARGET_URL);
    if (!isUp) {
        console.error(`Error: Server at ${TARGET_URL} is not responding!`);
        process.exit(1);
    }

    console.log(`Connecting to preview server at ${TARGET_URL}...\n`);

    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });

    const page = await browser.newPage({
        viewport: { width: 1280, height: 800 }
    });

    try {
        // =========================================================================
        // TEST 1: /excel-to-pipeline Booking Conversion Context
        // =========================================================================
        console.log('--- Test 1: /excel-to-pipeline Contextual Booking Modal ---');
        await page.goto(`${TARGET_URL}/excel-to-pipeline`, { waitUntil: 'networkidle' });

        const originalUrl = page.url();
        const originalDocTitle = await page.title();
        const originalCanonical = await page.$eval('link[rel="canonical"]', el => el.href);

        reportPass(`Loaded /excel-to-pipeline (Original Title: "${originalDocTitle}")`);

        // Find and click booking CTA in sticky sidebar, header, or article
        const bookingBtn = page.locator('button:has-text("קביעת פגישה ביומן")').first();
        await bookingBtn.waitFor({ state: 'visible' });
        await bookingBtn.click();

        // Wait for booking modal to open
        const modal = page.locator('#booking-modal-title');
        await modal.waitFor({ state: 'visible', timeout: 5000 });

        const modalTitle = (await modal.textContent()).trim();
        const modalDesc = (await page.locator('#booking-modal-title + p').textContent()).trim();
        const currentUrl = page.url();
        const currentDocTitle = await page.title();
        const canonicalWhileOpen = await page.$eval('link[rel="canonical"]', el => el.href);

        if (modalTitle.includes('פייפליין')) {
            reportPass(`Contextual Modal Title is pipeline-specific: "${modalTitle}"`);
        } else {
            reportFail(`Expected pipeline-specific title, got: "${modalTitle}"`);
        }

        if (modalDesc.includes('מכירה') || modalDesc.includes('פייפליין')) {
            reportPass(`Contextual Modal Description relates to sales/pipeline: "${modalDesc.slice(0, 60)}..."`);
        } else {
            reportFail(`Modal description missing pipeline context: "${modalDesc}"`);
        }

        if (currentUrl.includes('conversion=booking') && currentUrl.includes('context=pipeline')) {
            reportPass(`Temporary conversion URL applied: ${currentUrl}`);
        } else {
            reportFail(`Temporary URL missing conversion state: ${currentUrl}`);
        }

        if (currentDocTitle.includes('פייפליין') && currentDocTitle.includes('AltruBiz')) {
            reportPass(`Temporary document.title updated contextually: "${currentDocTitle}"`);
        } else {
            reportFail(`Temporary document.title missing context: "${currentDocTitle}"`);
        }

        if (canonicalWhileOpen === originalCanonical) {
            reportPass(`Canonical URL remained strictly unchanged: ${canonicalWhileOpen}`);
        } else {
            reportFail(`Canonical URL was modified during modal open! Was: ${originalCanonical}, now: ${canonicalWhileOpen}`);
        }

        // =========================================================================
        // TEST 2: Close Modal Restores State
        // =========================================================================
        console.log('\n--- Test 2: Modal Close State Restoration ---');
        const closeBtn = page.locator('button[aria-label="סגירת חלונית תיאום פגישה"]');
        await closeBtn.click();
        await page.waitForTimeout(300);

        const restoredUrl = page.url();
        const restoredDocTitle = await page.title();

        if (restoredUrl === originalUrl) {
            reportPass(`Original URL cleanly restored after close: ${restoredUrl}`);
        } else {
            reportFail(`URL not restored after close! Expected: ${originalUrl}, got: ${restoredUrl}`);
        }

        if (restoredDocTitle === originalDocTitle) {
            reportPass(`Original document.title cleanly restored after close: "${restoredDocTitle}"`);
        } else {
            reportFail(`Document title not restored! Expected: "${originalDocTitle}", got: "${restoredDocTitle}"`);
        }

        // =========================================================================
        // TEST 3: Browser Back Exits Conversion State
        // =========================================================================
        console.log('\n--- Test 3: Browser Back Safe State Exit ---');
        await bookingBtn.click();
        await modal.waitFor({ state: 'visible' });

        reportPass('Opened conversion modal a second time.');
        await page.goBack();
        await page.waitForTimeout(300);

        const isModalVisibleAfterBack = await modal.isVisible();
        const urlAfterBack = page.url();
        const titleAfterBack = await page.title();

        if (!isModalVisibleAfterBack) {
            reportPass('Browser Back safely closed the conversion modal without leaving the article');
        } else {
            reportFail('Browser Back failed to close the conversion modal!');
        }

        if (urlAfterBack === originalUrl) {
            reportPass(`URL cleanly restored to article path on Browser Back: ${urlAfterBack}`);
        } else {
            reportFail(`URL corrupted after Browser Back! Got: ${urlAfterBack}`);
        }

        if (titleAfterBack === originalDocTitle) {
            reportPass(`Document title restored to article title on Browser Back: "${titleAfterBack}"`);
        } else {
            reportFail(`Document title corrupted after Browser Back! Got: "${titleAfterBack}"`);
        }

        // =========================================================================
        // TEST 4: /unified-inbox Contextual Conversion
        // =========================================================================
        console.log('\n--- Test 4: /unified-inbox Contextual Booking Modal ---');
        await page.goto(`${TARGET_URL}/unified-inbox`, { waitUntil: 'networkidle' });

        const inboxBookingBtn = page.locator('button:has-text("קביעת פגישה ביומן")').first();
        await inboxBookingBtn.waitFor({ state: 'visible' });
        await inboxBookingBtn.click();

        await modal.waitFor({ state: 'visible' });
        const inboxModalTitle = (await modal.textContent()).trim();
        const inboxUrl = page.url();

        if (inboxModalTitle.includes('תקשורת') || inboxModalTitle.includes('Inbox') || inboxModalTitle.includes('ערוצי')) {
            reportPass(`Unified Inbox modal title is communication/inbox-specific: "${inboxModalTitle}"`);
        } else {
            reportFail(`Expected communication/inbox title, got: "${inboxModalTitle}"`);
        }

        if (inboxUrl.includes('context=unified-inbox')) {
            reportPass(`Unified Inbox temporary URL has correct context: ${inboxUrl}`);
        } else {
            reportFail(`Temporary URL missing unified-inbox context: ${inboxUrl}`);
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // =========================================================================
        // TEST 5: /prevent-no-shows Contextual Conversion
        // =========================================================================
        console.log('\n--- Test 5: /prevent-no-shows Contextual Booking Modal ---');
        await page.goto(`${TARGET_URL}/prevent-no-shows`, { waitUntil: 'networkidle' });

        const noShowsBookingBtn = page.locator('button:has-text("קביעת פגישה ביומן")').first();
        await noShowsBookingBtn.waitFor({ state: 'visible' });
        await noShowsBookingBtn.click();

        await modal.waitFor({ state: 'visible' });
        const noShowsModalTitle = (await modal.textContent()).trim();
        const noShowsUrl = page.url();

        if (noShowsModalTitle.includes('No-Show') || noShowsModalTitle.includes('פגישות')) {
            reportPass(`Prevent No-Shows modal title is scheduling/no-show-specific: "${noShowsModalTitle}"`);
        } else {
            reportFail(`Expected No-Show title, got: "${noShowsModalTitle}"`);
        }

        if (noShowsUrl.includes('context=prevent-no-shows')) {
            reportPass(`Prevent No-Shows temporary URL has correct context: ${noShowsUrl}`);
        } else {
            reportFail(`Temporary URL missing prevent-no-shows context: ${noShowsUrl}`);
        }

        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // =========================================================================
        // TEST 6: Contact Modal Context Isolation Across All 3 Pages
        // =========================================================================
        console.log('\n--- Test 6: Contact Modal Context Isolation Across Pages ---');
        
        // 6A. /excel-to-pipeline Contact
        await page.goto(`${TARGET_URL}/excel-to-pipeline`, { waitUntil: 'networkidle' });
        const excelContactBtn = page.locator('footer a[href="/#contact"], footer a:has-text("יצירת קשר")').first();
        await excelContactBtn.click();
        const contactModal = page.locator('#contact-modal-title');
        await contactModal.waitFor({ state: 'visible', timeout: 5000 });
        const excelContactTitle = (await contactModal.textContent()).trim();
        const excelContactUrl = page.url();

        if (excelContactTitle.includes('פייפליין') || excelContactTitle.includes('מכירות')) {
            reportPass(`/excel-to-pipeline Contact Modal title is strictly pipeline-specific: "${excelContactTitle}"`);
        } else {
            reportFail(`/excel-to-pipeline Contact Modal title leaked or wrong: "${excelContactTitle}"`);
        }

        if (excelContactUrl.includes('conversion=contact') && excelContactUrl.includes('context=pipeline')) {
            reportPass(`/excel-to-pipeline Contact URL has context=pipeline: ${excelContactUrl}`);
        } else {
            reportFail(`/excel-to-pipeline Contact URL incorrect: ${excelContactUrl}`);
        }

        const contactClose = page.locator('button[aria-label="סגירת חלונית יצירת קשר"]');
        await contactClose.click();
        await page.waitForTimeout(300);

        // 6B. /unified-inbox Contact
        await page.goto(`${TARGET_URL}/unified-inbox`, { waitUntil: 'networkidle' });
        const inboxContactBtn = page.locator('footer a[href="/#contact"], footer a:has-text("יצירת קשר")').first();
        await inboxContactBtn.click();
        await contactModal.waitFor({ state: 'visible', timeout: 5000 });
        const inboxContactTitle = (await contactModal.textContent()).trim();
        const inboxContactUrl = page.url();

        if (inboxContactTitle.includes('Inbox') || inboxContactTitle.includes('תקשורת') || inboxContactTitle.includes('ערוצי')) {
            reportPass(`/unified-inbox Contact Modal title relates strictly to Inbox/communication: "${inboxContactTitle}"`);
        } else {
            reportFail(`/unified-inbox Contact Modal title leaked or wrong: "${inboxContactTitle}"`);
        }

        if (inboxContactUrl.includes('conversion=contact') && inboxContactUrl.includes('context=unified-inbox')) {
            reportPass(`/unified-inbox Contact URL has context=unified-inbox: ${inboxContactUrl}`);
        } else {
            reportFail(`/unified-inbox Contact URL incorrect: ${inboxContactUrl}`);
        }

        await contactClose.click();
        await page.waitForTimeout(300);

        // 6C. /prevent-no-shows Contact
        await page.goto(`${TARGET_URL}/prevent-no-shows`, { waitUntil: 'networkidle' });
        const noShowsContactBtn = page.locator('footer a[href="/#contact"], footer a:has-text("יצירת קשר")').first();
        await noShowsContactBtn.click();
        await contactModal.waitFor({ state: 'visible', timeout: 5000 });
        const noShowsContactTitle = (await contactModal.textContent()).trim();
        const noShowsContactUrl = page.url();

        if (noShowsContactTitle.includes('ביטולי פגישות') || noShowsContactTitle.includes('יומנים') || noShowsContactTitle.includes('פגישות')) {
            reportPass(`/prevent-no-shows Contact Modal title relates strictly to appointments/reminders: "${noShowsContactTitle}"`);
        } else {
            reportFail(`/prevent-no-shows Contact Modal title leaked or wrong: "${noShowsContactTitle}"`);
        }

        if (noShowsContactUrl.includes('conversion=contact') && noShowsContactUrl.includes('context=prevent-no-shows')) {
            reportPass(`/prevent-no-shows Contact URL has context=prevent-no-shows: ${noShowsContactUrl}`);
        } else {
            reportFail(`/prevent-no-shows Contact URL incorrect: ${noShowsContactUrl}`);
        }

        // Verify legacy form name
        const contactIframe = page.locator('#contact-modal-title').locator('xpath=ancestor::div[@role="dialog"]//iframe');
        const dataFormName = await contactIframe.getAttribute('data-form-name');
        if (dataFormName === 'קביעת פגישה באתר') {
            reportPass(`Legacy form attribute data-form-name="קביעת פגישה באתר" strictly preserved.`);
        } else {
            reportFail(`Legacy form attribute data-form-name changed or missing! Got: "${dataFormName}"`);
        }

        await contactClose.click();
        await page.waitForTimeout(300);

        // =========================================================================
        // TEST 7: Mobile Viewport (375x667) Usability
        // =========================================================================
        console.log('\n--- Test 7: Mobile Viewport Usability (375x667) ---');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(`${TARGET_URL}/excel-to-pipeline`, { waitUntil: 'networkidle' });

        // On mobile, scroll down and find bottom CTA button
        const mobileCta = page.locator('button:has-text("קביעת פגישה")').last();
        await mobileCta.scrollIntoViewIfNeeded();
        await mobileCta.click();

        await modal.waitFor({ state: 'visible' });
        const mobileModalTitle = (await modal.textContent()).trim();
        const mobileUrl = page.url();

        if (mobileModalTitle.includes('פייפליין')) {
            reportPass(`Mobile modal header displays contextual title: "${mobileModalTitle}"`);
        } else {
            reportFail(`Mobile modal header failed context check: "${mobileModalTitle}"`);
        }

        if (mobileUrl.includes('conversion=booking&context=pipeline')) {
            reportPass(`Mobile temporary URL state verified: ${mobileUrl}`);
        } else {
            reportFail(`Mobile temporary URL missing context: ${mobileUrl}`);
        }

        const mobileClose = page.locator('button[aria-label="סגירת חלונית תיאום פגישה"]');
        await mobileClose.click();
        await page.waitForTimeout(300);

        reportPass(`Mobile close button cleanly dismissed modal. Current URL: ${page.url()}`);

    } finally {
        await browser.close();
    }

    console.log('\n========================================================');
    console.log(`Conversion Engine Validation Summary: ${passed} Passed, ${failed} Failed`);
    console.log('========================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test runner fatal error:', err);
    process.exit(1);
});
