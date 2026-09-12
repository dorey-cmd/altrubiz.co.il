/**
 * Client-Side Dispatch for Review Actions
 * 
 * Securely transmits owner review actions (publish, comment, discard)
 * to the server-side API adapter (/api/review-action).
 * 
 * Invariants:
 * - Never contains API keys or tokens in frontend code.
 * - Handles offline / mock / preview fallback gracefully.
 */

import { ReviewActionPayload, ReviewActionResult, ReviewTokenValidationResult } from '../types/review';

/**
 * Validates a Capability Review Token against the serverless endpoint.
 * Fails closed if host is production, token is invalid/revoked, or server unreachable.
 */
export async function validateReviewToken(articleId: string, token: string): Promise<ReviewTokenValidationResult> {
    if (!token || typeof token !== 'string' || token.trim().length < 32) {
        return { valid: false, reason: 'Token does not meet cryptographic minimum length' };
    }

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'altrubiz.co.il' || hostname === 'www.altrubiz.co.il') {
            return { valid: false, reason: 'Production domain immunity' };
        }
    }

    try {
        const response = await fetch('/api/validate-review-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token.trim(), articleId })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                valid: Boolean(data.valid),
                articleId: data.articleId || articleId,
                reason: data.reason
            };
        }

        return { valid: false, reason: 'Validation endpoint returned error' };
    } catch (err: any) {
        // In local dev with explicit mock flag only
        const isLocalDevMockAllowed = typeof import.meta !== 'undefined' && 
            import.meta.env?.DEV && 
            import.meta.env?.VITE_ALLOW_MOCK_REVIEW === 'true';

        if (isLocalDevMockAllowed) {
            return { valid: true, articleId };
        }

        return { valid: false, reason: 'Validation service unreachable' };
    }
}

export async function sendReviewAction(payload: ReviewActionPayload): Promise<ReviewActionResult> {
    const endpoint = '/api/review-action';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                action: payload.action,
                message: data.message || 'הפעולה התקבלה בהצלחה.',
                articleId: payload.articleId,
                timestamp: payload.timestamp,
                details: data
            };
        } else {
            const errorText = await response.text();
            let parsedMessage = '';
            try {
                const parsed = JSON.parse(errorText);
                if (parsed.message) parsedMessage = parsed.message;
            } catch {
                // Keep raw text
            }
            return {
                success: false,
                action: payload.action,
                message: parsedMessage || 'מערכת האוטומציה לסקירה טרם חוברה לסביבה זו (נדרש להגדיר שירות עיבוד / Webhook).',
                articleId: payload.articleId,
                timestamp: payload.timestamp
            };
        }
    } catch (err: any) {
        // Fail-Closed Invariant:
        // Mock simulation is strictly restricted to local development with explicit opt-in flag.
        const isLocalDevMockAllowed = typeof import.meta !== 'undefined' && 
            import.meta.env?.DEV && 
            import.meta.env?.VITE_ALLOW_MOCK_REVIEW === 'true';

        if (isLocalDevMockAllowed) {
            console.warn('[ReviewCockpit] Running in EXPLICIT LOCAL MOCK mode:', err);
            return {
                success: true,
                action: payload.action,
                message: `[סימולציית פיתוח מקומית] פעולת ${payload.action} נרשמה בהצלחה.`,
                articleId: payload.articleId,
                timestamp: payload.timestamp,
                details: { simulated: true, originalPayload: payload }
            };
        }

        // On production, preview, or unconfigured environments: FAIL CLOSED
        console.error('[ReviewCockpit] API endpoint unreachable or worker not configured:', err);
        return {
            success: false,
            action: payload.action,
            message: 'מערכת האוטומציה לסקירה טרם חוברה לסביבה זו (Review automation is not connected yet).',
            articleId: payload.articleId,
            timestamp: payload.timestamp
        };
    }
}
