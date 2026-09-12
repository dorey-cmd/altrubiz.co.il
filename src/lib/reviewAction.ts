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

import { ReviewActionPayload, ReviewActionResult } from '../types/review';

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
