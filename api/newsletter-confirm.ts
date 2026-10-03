/**
 * Vercel Serverless Function: Newsletter Club Double Opt-In Confirmation
 *
 * Target of the confirmation link sent by email after a signup.
 * - GET  renders a confirmation page with a single button. Nothing is confirmed
 *        on GET, so mail scanners that pre-open links cannot confirm for anyone.
 * - POST verifies the signed token and notifies the CRM that the subscriber
 *        confirmed. Only then does the CRM add the club tag and send the welcome.
 *
 * Required environment variables (server-side only):
 * - NEWSLETTER_CONFIRM_SECRET          Signing secret for confirmation links
 * - NEWSLETTER_CONFIRMED_WEBHOOK_URL   CRM inbound webhook for confirmed signups
 */

import { NEWSLETTER_SOURCE, PRODUCTION_ORIGIN, getClientIp, verifyConfirmToken } from './_newsletterGuard.js';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderPage(title: string, bodyHtml: string): string {
    return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} | AltruBiz</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;
         box-sizing: border-box; background: #091b33; color: #fff;
         font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif; }
  main { width: 100%; max-width: 460px; text-align: center; background: rgba(255,255,255,.06);
         border: 1px solid rgba(255,255,255,.14); border-radius: 24px; padding: 36px 28px; box-sizing: border-box; }
  .badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700;
           color: #fcd34d; background: rgba(251,191,36,.15); border: 1px solid rgba(251,191,36,.3); }
  h1 { font-size: 26px; line-height: 1.25; margin: 18px 0 10px; }
  p { font-size: 15px; line-height: 1.7; color: #cbd5e1; margin: 0 0 18px; }
  .email { direction: ltr; unicode-bidi: embed; color: #bae6fd; font-weight: 700; }
  button, a.action { display: inline-block; border: 0; cursor: pointer; text-decoration: none; font: inherit;
           font-weight: 800; font-size: 15px; color: #0f172a; background: #fbbf24; padding: 14px 28px; border-radius: 16px; }
  button:focus-visible, a.action:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
</style>
</head>
<body>
<main>
<span class="badge">מועדון המהלך הבא</span>
${bodyHtml}
</main>
</body>
</html>`;
}

function sendPage(res: any, status: number, title: string, bodyHtml: string) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(status).send(renderPage(title, bodyHtml));
}

const HOME_LINK = `<a class="action" href="${PRODUCTION_ORIGIN}/">חזרה לאתר AltruBiz</a>`;

export default async function handler(req: any, res: any) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Referrer-Policy', 'no-referrer');

    if (req.method !== 'GET' && req.method !== 'POST') {
        res.setHeader('Allow', ['GET', 'POST']);
        return sendPage(res, 405, 'הפעולה לא נתמכת', `<h1>הפעולה לא נתמכת</h1>${HOME_LINK}`);
    }

    const confirmSecret = process.env.NEWSLETTER_CONFIRM_SECRET;
    const confirmedWebhookUrl = process.env.NEWSLETTER_CONFIRMED_WEBHOOK_URL;
    if (!confirmSecret || !confirmedWebhookUrl) {
        console.error('[Newsletter] Confirmation endpoint is not fully configured');
        return sendPage(
            res,
            503,
            'אישור ההרשמה אינו זמין כרגע',
            `<h1>אישור ההרשמה אינו זמין כרגע</h1><p>אפשר לנסות שוב מאוחר יותר דרך אותו קישור.</p>${HOME_LINK}`
        );
    }

    const body = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body || {};
    const token = req.method === 'POST' ? body.token : req.query?.token;
    const verification = verifyConfirmToken(token, confirmSecret);

    if (!verification.valid) {
        return sendPage(
            res,
            400,
            'קישור האישור אינו תקף',
            `<h1>קישור האישור אינו תקף</h1><p>ייתכן שהקישור פג תוקף או הועתק חלקית. אפשר להירשם מחדש בתחתית האתר ולקבל קישור חדש.</p>${HOME_LINK}`
        );
    }

    const { email, submissionId, consentVersion } = verification.payload;

    if (req.method === 'GET') {
        return sendPage(
            res,
            200,
            'אישור הרשמה',
            `<h1>נשאר רק לאשר</h1>
<p>לחיצה על הכפתור תשלים את ההרשמה של <span class="email">${escapeHtml(email)}</span> למועדון המהלך הבא.</p>
<form method="post" action="/api/newsletter-confirm">
<input type="hidden" name="token" value="${escapeHtml(String(token))}">
<button type="submit">אישור ההרשמה</button>
</form>`
        );
    }

    const confirmedAt = new Date().toISOString();
    const ip = getClientIp(req);
    const userAgent = typeof req.headers?.['user-agent'] === 'string' ? req.headers['user-agent'].slice(0, 400) : 'Not available';

    const note = [
        '--------------------------------',
        'NEWSLETTER DOUBLE OPT-IN CONFIRMED - מועדון המהלך הבא',
        '--------------------------------',
        '',
        'Submission ID:',
        submissionId,
        '',
        'Consent version:',
        consentVersion || 'Not available',
        '',
        'Confirmed at UTC:',
        confirmedAt,
        '',
        'Email:',
        email,
        '',
        'IP address:',
        ip,
        '',
        'User Agent:',
        userAgent,
        '',
        'Confirmation capture:',
        'Button click on the confirmation page reached from the email link',
        '--------------------------------'
    ].join('\n');

    try {
        const webhookRes = await fetch(confirmedWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'AltruBiz-SiteOS-Newsletter/1.0'
            },
            body: JSON.stringify({
                email,
                source: NEWSLETTER_SOURCE,
                submission_id: submissionId,
                consent_version: consentVersion,
                double_opt_in: 'confirmed',
                confirmedAt,
                ip,
                note
            })
        });

        if (!webhookRes.ok) {
            throw new Error(`CRM webhook responded ${webhookRes.status}`);
        }
    } catch (err: any) {
        console.error('[Newsletter] Failed to dispatch confirmation:', err?.message);
        return sendPage(
            res,
            502,
            'האישור לא הושלם',
            `<h1>האישור לא הושלם</h1><p>משהו השתבש בדרך. אפשר לחזור לקישור שבמייל ולנסות שוב בעוד רגע.</p>${HOME_LINK}`
        );
    }

    return sendPage(
        res,
        200,
        'ההרשמה אושרה',
        `<h1>ההרשמה אושרה</h1><p>כיף שהצטרפתם. המהלך הבא יישלח ישירות אל תיבת הדואר.</p>${HOME_LINK}`
    );
}
