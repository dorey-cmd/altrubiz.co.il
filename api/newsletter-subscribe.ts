/**
 * Vercel Serverless Function: Newsletter Club Signup
 *
 * Secure server-side boundary for "מועדון המהלך הבא". The browser never talks
 * to the CRM webhook directly. Every signup is checked here (origin, honeypot,
 * fill time, rate limit, Cloudflare Turnstile) and only then forwarded to the
 * CRM together with a signed double opt-in confirmation link.
 *
 * Required environment variables (server-side only):
 * - NEWSLETTER_WEBHOOK_URL       CRM inbound webhook for pending signups
 * - NEWSLETTER_CONFIRM_SECRET    Signing secret for confirmation links
 * - TURNSTILE_SECRET_KEY         Cloudflare Turnstile secret (mandatory in production)
 */

import {
    NEWSLETTER_SOURCE,
    createConfirmToken,
    getClientIp,
    getPublicBaseUrl,
    getTurnstileSecret,
    isAllowedOrigin,
    isRateLimited,
    verifyTurnstile
} from './_newsletterGuard.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_TIME_MS = 3000;
const MAX_NOTE_LENGTH = 8000;

function asString(value: unknown, maxLength: number): string {
    return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export default async function handler(req: any, res: any) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            message: 'Method Not Allowed. Only POST is accepted.'
        });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
        const ip = getClientIp(req);

        if (!isAllowedOrigin(req)) {
            return res.status(403).json({
                success: false,
                code: 'ORIGIN_NOT_ALLOWED',
                message: 'הבקשה לא התקבלה.'
            });
        }

        const email = asString(body.email, 254).trim();
        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({
                success: false,
                code: 'INVALID_EMAIL',
                message: 'נא להזין כתובת אימייל תקינה'
            });
        }

        if (body.consent !== true) {
            return res.status(400).json({
                success: false,
                code: 'CONSENT_REQUIRED',
                message: 'יש לסמן את תיבת ההסכמה לקבלת עדכונים כדי להמשיך'
            });
        }

        // Silent drops: automated submissions get a success-shaped answer and nothing is forwarded.
        const honeypot = asString(body.contact_me_by_fax_only, 200);
        const fillTimeMs = Number(body.form_elapsed_ms);
        if (honeypot || !Number.isFinite(fillTimeMs) || fillTimeMs < MIN_FILL_TIME_MS) {
            console.warn('[Newsletter] Dropped automated signup', {
                ip,
                reason: honeypot ? 'honeypot' : 'fill-time',
                fillTimeMs
            });
            return res.status(200).json({ success: true });
        }

        if (isRateLimited(ip)) {
            return res.status(429).json({
                success: false,
                code: 'RATE_LIMITED',
                message: 'התקבלו יותר מדי ניסיונות הרשמה. אפשר לנסות שוב בעוד כמה דקות.'
            });
        }

        // Fail-Closed Invariant:
        // The live form must NOT pretend success when its server configuration is incomplete.
        const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
        const confirmSecret = process.env.NEWSLETTER_CONFIRM_SECRET;
        const turnstileSecret = getTurnstileSecret();
        if (!webhookUrl || !confirmSecret || !turnstileSecret) {
            console.error('[Newsletter] Signup endpoint is not fully configured');
            return res.status(503).json({
                success: false,
                code: 'NEWSLETTER_NOT_CONFIGURED',
                message: 'ההרשמה אינה זמינה כרגע. אפשר לנסות שוב מאוחר יותר.'
            });
        }

        const turnstile = await verifyTurnstile(body.turnstile_token, turnstileSecret, ip);
        if (!turnstile.success) {
            console.warn('[Newsletter] Turnstile rejected signup', { ip, errorCodes: turnstile.errorCodes });
            return res.status(403).json({
                success: false,
                code: 'BOT_CHECK_FAILED',
                message: 'האימות לא הושלם. אפשר לרענן את העמוד ולנסות שוב.'
            });
        }

        const submissionId = asString(body.submission_id, 64) || `srv-${Date.now()}`;
        const consentVersion = asString(body.consent_version, 64);
        const submittedAt = new Date().toISOString();

        const confirmToken = createConfirmToken({ email, submissionId, consentVersion }, confirmSecret);
        const confirmUrl = `${getPublicBaseUrl(req)}/api/newsletter-confirm?token=${encodeURIComponent(confirmToken)}`;

        const country = asString(req.headers?.['x-vercel-ip-country'], 8) || 'Not available';
        const serverNote = [
            '',
            'Server verification:',
            '',
            'Bot check:',
            'Cloudflare Turnstile passed',
            '',
            'IP address:',
            ip,
            '',
            'IP country:',
            country,
            '',
            'Form fill time:',
            `${Math.round(fillTimeMs / 1000)} seconds`,
            '',
            'Double opt-in:',
            'PENDING - confirmation link sent, awaiting click',
            '--------------------------------'
        ].join('\n');

        const payload = {
            email,
            source: NEWSLETTER_SOURCE,
            sourcePage: asString(body.sourcePage, 500),
            pageTitle: asString(body.pageTitle, 300),
            submittedAt,
            consent: true,
            consent_version: consentVersion,
            submission_id: submissionId,
            double_opt_in: 'pending',
            confirm_url: confirmUrl,
            ip,
            ip_country: country,
            note: asString(body.note, MAX_NOTE_LENGTH) + serverNote
        };

        try {
            const webhookRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AltruBiz-SiteOS-Newsletter/1.0'
                },
                body: JSON.stringify(payload)
            });

            if (!webhookRes.ok) {
                console.error('[Newsletter] CRM webhook rejected signup:', webhookRes.status);
                return res.status(502).json({
                    success: false,
                    code: 'CRM_DISPATCH_FAILED',
                    message: 'לא הצלחנו להשלים את ההרשמה. אפשר לנסות שוב בעוד רגע.'
                });
            }
        } catch (err: any) {
            console.error('[Newsletter] CRM webhook unreachable:', err?.message);
            return res.status(502).json({
                success: false,
                code: 'CRM_UNREACHABLE',
                message: 'לא הצלחנו להשלים את ההרשמה. אפשר לנסות שוב בעוד רגע.'
            });
        }

        return res.status(200).json({ success: true });
    } catch (err: any) {
        console.error('[Newsletter] Processing error:', err);
        return res.status(500).json({
            success: false,
            message: 'לא הצלחנו להשלים את ההרשמה. אפשר לנסות שוב בעוד רגע.'
        });
    }
}
