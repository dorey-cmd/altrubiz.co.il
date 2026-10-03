import { NEWSLETTER_CONSENT_CONFIG } from '../data/newsletterConsent';

/**
 * Session storage key for initial first-touch attribution capture
 */
const SESSION_ATTRIBUTION_KEY = 'altrubiz_session_attribution_v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;

export interface SessionAttributionRecord {
    firstLandingUrl?: string;
    firstLandingPath?: string;
    firstReferrer?: string;
    firstSource?: string;
    firstUtm?: Record<string, string>;
    firstClickIds?: Record<string, string>;
    firstTouchTimestamp?: string;
}

/**
 * Generates an RFC4122 v4 compliant submission UUID
 */
export function generateSubmissionId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback RFC4122 v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Formats date into readable Israel local time (Asia/Jerusalem)
 * Example output: 03/10/2026 19:41:23 Asia/Jerusalem
 */
export function formatIsraelDateTime(date: Date = new Date()): string {
    try {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Jerusalem',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(date);

        const get = (type: string) => parts.find(p => p.type === type)?.value || '';
        return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}:${get('second')} Asia/Jerusalem`;
    } catch {
        return `${date.toISOString()} (Asia/Jerusalem)`;
    }
}

/**
 * Captures or retrieves first-touch attribution from sessionStorage.
 * Safe in SSR / prerender environments.
 */
export function getOrInitSessionAttribution(): SessionAttributionRecord {
    if (typeof window === 'undefined') return {};

    try {
        const stored = window.sessionStorage.getItem(SESSION_ATTRIBUTION_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        }
    } catch {
        // Storage restricted / private mode
    }

    // Capture first touch
    const utm: Record<string, string> = {};
    const clickIds: Record<string, string> = {};

    try {
        const params = new URLSearchParams(window.location.search);
        for (const k of UTM_KEYS) {
            const v = params.get(k);
            if (v && v.trim()) utm[k] = v.trim();
        }
        for (const k of CLICK_ID_KEYS) {
            const v = params.get(k);
            if (v && v.trim()) clickIds[k] = v.trim();
        }
    } catch {
        // Query parse error
    }

    const referrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;
    const initialSource = utm['utm_source'] || (referrer ? new URL(referrer, window.location.href).hostname : 'Direct');

    const record: SessionAttributionRecord = {
        firstLandingUrl: window.location.href,
        firstLandingPath: window.location.pathname,
        firstReferrer: referrer,
        firstSource: initialSource,
        firstUtm: Object.keys(utm).length > 0 ? utm : undefined,
        firstClickIds: Object.keys(clickIds).length > 0 ? clickIds : undefined,
        firstTouchTimestamp: new Date().toISOString()
    };

    try {
        window.sessionStorage.setItem(SESSION_ATTRIBUTION_KEY, JSON.stringify(record));
    } catch {
        // Storage quota / restricted
    }

    return record;
}

/**
 * Standard browser & operating system detection without invasive fingerprinting
 */
export interface DeviceInfo {
    browser: string;
    operatingSystem: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    userAgent: string;
    language: string;
    timezone: string;
    screenSize: string;
    viewportSize: string;
    host: string;
    path: string;
}

export function detectDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        return {
            browser: 'Server / Prerender',
            operatingSystem: 'Unknown',
            deviceType: 'desktop',
            userAgent: 'Server',
            language: 'he',
            timezone: 'Asia/Jerusalem',
            screenSize: 'Not available',
            viewportSize: 'Not available',
            host: 'altrubiz.co.il',
            path: '/'
        };
    }

    const ua = navigator.userAgent || '';
    
    // 1. Browser Detection
    let browser = 'Unknown Browser';
    let browserVersion = '';

    const edgeMatch = ua.match(/Edg\/([0-9.]+)/);
    const operaMatch = ua.match(/OPR\/([0-9.]+)/);
    const samsungMatch = ua.match(/SamsungBrowser\/([0-9.]+)/);
    const chromeMatch = ua.match(/Chrome\/([0-9.]+)/);
    const safariMatch = ua.match(/Version\/([0-9.]+).*Safari/);
    const firefoxMatch = ua.match(/Firefox\/([0-9.]+)/);

    if (edgeMatch) {
        browser = 'Microsoft Edge';
        browserVersion = edgeMatch[1];
    } else if (operaMatch) {
        browser = 'Opera';
        browserVersion = operaMatch[1];
    } else if (samsungMatch) {
        browser = 'Samsung Internet';
        browserVersion = samsungMatch[1];
    } else if (chromeMatch) {
        browser = 'Google Chrome';
        browserVersion = chromeMatch[1];
    } else if (firefoxMatch) {
        browser = 'Mozilla Firefox';
        browserVersion = firefoxMatch[1];
    } else if (safariMatch) {
        browser = 'Apple Safari';
        browserVersion = safariMatch[1];
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Apple Safari';
    }

    const fullBrowser = browserVersion ? `${browser} ${browserVersion}` : browser;

    // 2. OS Detection
    let os = 'Unknown OS';
    if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
    else if (/Windows NT/i.test(ua)) os = 'Windows';
    else if (/iPhone OS ([0-9_]+)/i.test(ua)) {
        const v = ua.match(/iPhone OS ([0-9_]+)/i);
        os = v ? `iOS ${v[1].replace(/_/g, '.')}` : 'iOS';
    } else if (/iPad/i.test(ua)) os = 'iPadOS';
    else if (/Mac OS X ([0-9_]+)/i.test(ua)) {
        const v = ua.match(/Mac OS X ([0-9_]+)/i);
        os = v ? `macOS ${v[1].replace(/_/g, '.')}` : 'macOS';
    } else if (/Android ([0-9.]+)/i.test(ua)) {
        const v = ua.match(/Android ([0-9.]+)/i);
        os = v ? `Android ${v[1]}` : 'Android';
    } else if (/Linux/i.test(ua)) os = 'Linux';

    // 3. Device Category
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/iPad|Tablet/i.test(ua)) {
        deviceType = 'tablet';
    } else if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
        deviceType = 'mobile';
    }

    // 4. Dimensions & Environment
    const language = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'Not available';
    let timezone = 'Not available';
    try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not available';
    } catch {}

    const screenSize = window.screen ? `${window.screen.width}x${window.screen.height}` : 'Not available';
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;

    return {
        browser: fullBrowser,
        operatingSystem: os,
        deviceType,
        userAgent: ua,
        language,
        timezone,
        screenSize,
        viewportSize,
        host: window.location.hostname || 'altrubiz.co.il',
        path: window.location.pathname || '/'
    };
}

export interface BuildNewsletterNoteParams {
    email: string;
    sourcePagePath?: string;
    pageTitle?: string;
    submissionId?: string;
    consentConfirmed: boolean;
    componentLocation?: string;
}

/**
 * Builds the complete, formatted, human-readable multiline note
 * ready to be piped directly into a CRM Note in GoHighLevel.
 */
export function buildNewsletterNote({
    email,
    sourcePagePath,
    pageTitle,
    submissionId = generateSubmissionId(),
    consentConfirmed,
    componentLocation = 'מועדון המהלך הבא (Footer Banner)'
}: BuildNewsletterNoteParams): string {
    const now = new Date();
    const utcTime = now.toISOString();
    const israelTime = formatIsraelDateTime(now);

    const fullSignupUrl = typeof window !== 'undefined' ? window.location.href : `https://altrubiz.co.il${sourcePagePath || '/'}`;
    const currentTitle = pageTitle || (typeof document !== 'undefined' ? document.title : 'AltruBiz CRM');
    const currentReferrer = typeof document !== 'undefined' && document.referrer ? document.referrer : undefined;
    
    // Retrieve attribution
    const sessionAttr = getOrInitSessionAttribution();
    const deviceInfo = detectDeviceInfo();

    // Current URL query parameters
    const currentUtm: Record<string, string> = {};
    const currentClickIds: Record<string, string> = {};

    if (typeof window !== 'undefined') {
        try {
            const params = new URLSearchParams(window.location.search);
            for (const k of UTM_KEYS) {
                const v = params.get(k);
                if (v && v.trim()) currentUtm[k] = v.trim();
            }
            for (const k of CLICK_ID_KEYS) {
                const v = params.get(k);
                if (v && v.trim()) currentClickIds[k] = v.trim();
            }
        } catch {}
    }

    // Merge UTMs: current takes precedence, fallback to first-touch
    const mergedUtm = { ...(sessionAttr.firstUtm || {}), ...currentUtm };
    const mergedClickIds = { ...(sessionAttr.firstClickIds || {}), ...currentClickIds };

    // Determine landing page & referrer
    const landingPage = sessionAttr.firstLandingUrl || fullSignupUrl;
    const effectiveReferrer = currentReferrer || sessionAttr.firstReferrer || 'Not available (Direct visit)';

    // Build lines cleanly without any undefined/null/[object Object]
    const lines: string[] = [];

    lines.push('--------------------------------');
    lines.push('NEWSLETTER SIGNUP - מועדון המהלך הבא');
    lines.push('--------------------------------');
    lines.push('');
    lines.push('Submission ID:');
    lines.push(submissionId);
    lines.push('');
    lines.push('Consent:');
    lines.push(consentConfirmed ? 'YES - checkbox manually selected by user' : 'NO - consent missing');
    lines.push('');
    lines.push('Consent version:');
    lines.push(NEWSLETTER_CONSENT_CONFIG.consentVersion);
    lines.push('');
    lines.push('Consent text:');
    lines.push(`"${NEWSLETTER_CONSENT_CONFIG.consentText}"`);
    lines.push('');
    lines.push('Signup time UTC:');
    lines.push(utcTime);
    lines.push('');
    lines.push('Signup time Israel:');
    lines.push(israelTime);
    lines.push('');
    lines.push('Signup page:');
    lines.push(fullSignupUrl);
    lines.push('');
    lines.push('Page title:');
    lines.push(currentTitle);
    lines.push('');
    lines.push('Host:');
    lines.push(deviceInfo.host);
    lines.push('');
    lines.push('Path:');
    lines.push(sourcePagePath || deviceInfo.path);
    lines.push('');
    lines.push('Component location:');
    lines.push(componentLocation);
    lines.push('');
    lines.push('Landing page:');
    lines.push(landingPage);
    lines.push('');
    lines.push('Referrer:');
    lines.push(effectiveReferrer);
    lines.push('');
    lines.push('Email:');
    lines.push(email);
    lines.push('');

    // Acquisition / Attribution section
    lines.push('Acquisition / Attribution:');
    lines.push('');
    if (sessionAttr.firstSource) {
        lines.push('First source:');
        lines.push(sessionAttr.firstSource);
        lines.push('');
    }
    lines.push('Current source:');
    lines.push(NEWSLETTER_CONSENT_CONFIG.clubName);
    lines.push('');

    // UTM parameters
    if (mergedUtm['utm_source']) {
        lines.push('UTM Source:');
        lines.push(mergedUtm['utm_source']);
        lines.push('');
    }
    if (mergedUtm['utm_medium']) {
        lines.push('UTM Medium:');
        lines.push(mergedUtm['utm_medium']);
        lines.push('');
    }
    if (mergedUtm['utm_campaign']) {
        lines.push('UTM Campaign:');
        lines.push(mergedUtm['utm_campaign']);
        lines.push('');
    }
    if (mergedUtm['utm_content']) {
        lines.push('UTM Content:');
        lines.push(mergedUtm['utm_content']);
        lines.push('');
    }
    if (mergedUtm['utm_term']) {
        lines.push('UTM Term:');
        lines.push(mergedUtm['utm_term']);
        lines.push('');
    }

    // Click IDs
    lines.push('Click IDs:');
    lines.push('');
    const hasClickIds = Object.keys(mergedClickIds).length > 0;
    if (hasClickIds) {
        for (const [k, v] of Object.entries(mergedClickIds)) {
            if (v) {
                lines.push(`${k}:`);
                lines.push(v);
                lines.push('');
            }
        }
    } else {
        lines.push('None');
        lines.push('');
    }

    // Browser / Device section
    lines.push('Browser / Device:');
    lines.push('');
    lines.push('Browser:');
    lines.push(deviceInfo.browser);
    lines.push('');
    lines.push('Operating system:');
    lines.push(deviceInfo.operatingSystem);
    lines.push('');
    lines.push('Device type:');
    lines.push(deviceInfo.deviceType);
    lines.push('');
    lines.push('User Agent:');
    lines.push(deviceInfo.userAgent);
    lines.push('');
    lines.push('Browser language:');
    lines.push(deviceInfo.language);
    lines.push('');
    lines.push('Timezone:');
    lines.push(deviceInfo.timezone);
    lines.push('');
    lines.push('Screen size:');
    lines.push(deviceInfo.screenSize);
    lines.push('');
    lines.push('Viewport size:');
    lines.push(deviceInfo.viewportSize);
    lines.push('');
    lines.push('Consent capture:');
    lines.push('Manual checkbox interaction');
    lines.push('--------------------------------');

    return lines.join('\n');
}
