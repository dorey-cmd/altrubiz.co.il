/**
 * Vercel Serverless Function: Secure Review Action Adapter
 * 
 * Secure server-side boundary for the AltruBiz Review Cockpit.
 * Receives owner review actions (publish, comment, discard) from authorized
 * preview environments and forwards them to configured worker webhooks / CI triggers.
 * 
 * Security Invariant:
 * All tokens, API keys, and repository credentials exist ONLY in server-side
 * environment variables (e.g. REVIEW_WEBHOOK_URL, REVIEW_SECRET_KEY, GITHUB_TOKEN).
 * Zero credentials leak into client bundles.
 */

import { verifyReviewToken, revokeReviewToken } from './_tokenStore.js';

export default async function handler(req: any, res: any) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            success: false,
            message: 'Method Not Allowed. Only POST is accepted.'
        });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { action, articleId, publicPath, branch, reviewUrl, feedback, timestamp, reviewToken } = body || {};

        if (!action || !['publish', 'comment', 'discard'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing review action. Must be publish, comment, or discard.'
            });
        }

        if (!articleId) {
            return res.status(400).json({
                success: false,
                message: 'Missing articleId parameter.'
            });
        }

        // Validate Capability Review Token (Fail Closed)
        const host = req.headers?.host || req.headers?.['x-forwarded-host'] || '';
        const tokenVerification = verifyReviewToken(reviewToken, articleId, host);
        if (!tokenVerification.valid) {
            return res.status(403).json({
                success: false,
                code: 'INVALID_CAPABILITY_TOKEN',
                message: 'קישור הסקירה אינו תקף, פג תוקף, או בוטל (Invalid or revoked review capability token).',
                reason: tokenVerification.reason
            });
        }

        // Check optional authorization header if REVIEW_SECRET_KEY is configured
        const expectedSecret = process.env.REVIEW_SECRET_KEY;
        if (expectedSecret) {
            const authHeader = req.headers['x-review-secret'] || req.headers['authorization'];
            if (!authHeader || authHeader !== expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized review action. Invalid review secret.'
                });
            }
        }

        // Capability Token Lifecycle Invariant:
        // Token is valid ONLY for the current cycle. Invalidate immediately upon decision.
        revokeReviewToken(reviewToken);

        const reviewEvent = {
            action,
            articleId,
            publicPath: publicPath || `/${articleId}`,
            branch: branch || `content/review/${articleId}`,
            reviewUrl: reviewUrl || '',
            reviewToken: reviewToken || '',
            feedback: feedback || '',
            timestamp: timestamp || new Date().toISOString(),
            environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
        };

        // Fail-Closed Invariant:
        // A real review deployment must NOT pretend success if the automation worker is not configured.
        const webhookUrl = process.env.REVIEW_WEBHOOK_URL;
        if (!webhookUrl) {
            return res.status(503).json({
                success: false,
                code: 'WORKER_NOT_CONFIGURED',
                message: 'מערכת האוטומציה לסקירה טרם חוברה (נדרש להגדיר REVIEW_WEBHOOK_URL). הפעולה לא נשלחה.',
                articleId,
                timestamp: reviewEvent.timestamp
            });
        }

        try {
            const webhookRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AltruBiz-SiteOS-ReviewCockpit/1.0'
                },
                body: JSON.stringify(reviewEvent)
            });

            if (!webhookRes.ok) {
                return res.status(502).json({
                    success: false,
                    code: 'WORKER_DISPATCH_FAILED',
                    message: `שגיאה בתקשורת עם שירות האוטומציה (${webhookRes.status}). הפעולה לא הושלמה.`,
                    articleId,
                    timestamp: reviewEvent.timestamp
                });
            }
        } catch (err: any) {
            console.error('[ReviewAction] Failed to notify REVIEW_WEBHOOK_URL:', err.message);
            return res.status(502).json({
                success: false,
                code: 'WORKER_UNREACHABLE',
                message: 'שירות האוטומציה אינו זמין כעת. הפעולה לא הושלמה.',
                articleId,
                timestamp: reviewEvent.timestamp,
                error: err.message
            });
        }

        let actionMessage = '';
        if (action === 'publish') {
            actionMessage = 'בקשת הפרסום הועברה בהצלחה לשירות האוטומציה. Release Gate יופעל לפני מיזוג ל-Master.';
        } else if (action === 'comment') {
            actionMessage = 'ההערות נשלחו בהצלחה לשירות האוטומציה לעדכון הטיוטה.';
        } else if (action === 'discard') {
            actionMessage = 'בקשת הפסילה נשלחה בהצלחה לשירות האוטומציה.';
        }

        return res.status(200).json({
            success: true,
            action,
            articleId,
            timestamp: reviewEvent.timestamp,
            message: actionMessage,
            webhookDispatched: true
        });
    } catch (err: any) {
        console.error('[ReviewAction] Processing error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error processing review action.',
            error: err.message
        });
    }
}
