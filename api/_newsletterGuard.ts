/**
 * AltruBiz Newsletter Club: Server-Side Signup Guard
 *
 * Shared helpers for the newsletter serverless boundary
 * (api/newsletter-subscribe.ts, api/newsletter-confirm.ts):
 * - Origin allow-list
 * - Best-effort per-IP rate limiting
 * - Cloudflare Turnstile verification
 * - Signed double opt-in confirmation tokens (HMAC-SHA256)
 *
 * Security Invariant:
 * The CRM API token, the Turnstile secret and the confirmation signing
 * secret exist ONLY in server-side environment variables. Zero credentials
 * leak into client bundles.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const NEWSLETTER_SOURCE = 'מועדון המהלך הבא';
export const PRODUCTION_ORIGIN = 'https://altrubiz.co.il';

/** Cloudflare's published always-pass test secret, used only outside production. */
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const CONFIRM_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export function isProduction(): boolean {
    return process.env.VERCEL_ENV === 'production';
}

export function getClientIp(req: any): string {
    const forwarded = req.headers?.['x-forwarded-for'];
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    if (typeof raw === 'string' && raw.trim()) {
        return raw.split(',')[0].trim();
    }
    return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

/**
 * Only the site itself may call the signup endpoint from a browser:
 * production domain, Vercel previews of this project, and local development.
 */
export function isAllowedOrigin(req: any): boolean {
    const source = req.headers?.origin || req.headers?.referer;
    if (!source || typeof source !== 'string') return false;

    let hostname = '';
    try {
        hostname = new URL(source).hostname.toLowerCase();
    } catch {
        return false;
    }

    if (hostname === 'altrubiz.co.il' || hostname === 'www.altrubiz.co.il') return true;
    if (isProduction()) return false;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.vercel.app');
}

// In-memory per-instance registry. Serverless instances are not shared, so this
// is a best-effort brake on bursts, not a hard quota.
const rateLimitHits = new Map<string, number[]>();

export function isRateLimited(ip: string, now: number = Date.now()): boolean {
    const recent = (rateLimitHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
        rateLimitHits.set(ip, recent);
        return true;
    }
    recent.push(now);
    rateLimitHits.set(ip, recent);

    if (rateLimitHits.size > 5000) {
        for (const [key, hits] of rateLimitHits) {
            if (hits.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) rateLimitHits.delete(key);
        }
    }
    return false;
}

/**
 * Resolves the Turnstile secret. Fail closed in production: a missing secret
 * never silently disables verification on the live site.
 */
export function getTurnstileSecret(): string | null {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (secret) return secret;
    return isProduction() ? null : TURNSTILE_TEST_SECRET;
}

export async function verifyTurnstile(
    token: unknown,
    secret: string,
    ip: string
): Promise<{ success: boolean; errorCodes: string[] }> {
    if (!token || typeof token !== 'string' || token.length > 4096) {
        return { success: false, errorCodes: ['missing-input-response'] };
    }

    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (ip && ip !== 'unknown') form.set('remoteip', ip);

    try {
        const verifyRes = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
        const data: any = await verifyRes.json();
        return {
            success: data?.success === true,
            errorCodes: Array.isArray(data?.['error-codes']) ? data['error-codes'] : []
        };
    } catch (err: any) {
        console.error('[Newsletter] Turnstile verification unreachable:', err?.message);
        return { success: false, errorCodes: ['verification-unreachable'] };
    }
}

export interface ConfirmTokenPayload {
    email: string;
    submissionId: string;
    consentVersion: string;
    expiresAt: number;
}

function sign(data: string, secret: string): string {
    return createHmac('sha256', secret).update(data).digest('base64url');
}

export function createConfirmToken(
    payload: Omit<ConfirmTokenPayload, 'expiresAt'>,
    secret: string,
    now: number = Date.now()
): string {
    const body: ConfirmTokenPayload = { ...payload, expiresAt: now + CONFIRM_TOKEN_TTL_MS };
    const encoded = Buffer.from(JSON.stringify(body), 'utf8').toString('base64url');
    return `${encoded}.${sign(encoded, secret)}`;
}

export function verifyConfirmToken(
    token: unknown,
    secret: string,
    now: number = Date.now()
): { valid: true; payload: ConfirmTokenPayload } | { valid: false; reason: string } {
    if (!token || typeof token !== 'string' || token.length > 2048) {
        return { valid: false, reason: 'Missing or malformed token' };
    }

    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false, reason: 'Missing or malformed token' };

    const [encoded, signature] = parts;
    const expected = Buffer.from(sign(encoded, secret));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
        return { valid: false, reason: 'Signature mismatch' };
    }

    try {
        const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as ConfirmTokenPayload;
        if (!payload?.email || !payload?.submissionId || typeof payload.expiresAt !== 'number') {
            return { valid: false, reason: 'Incomplete token payload' };
        }
        if (now > payload.expiresAt) return { valid: false, reason: 'Token expired' };
        return { valid: true, payload };
    } catch {
        return { valid: false, reason: 'Unreadable token payload' };
    }
}

/** Base URL for links sent by email: canonical domain in production, request host elsewhere. */
export function getPublicBaseUrl(req: any): string {
    if (isProduction()) return PRODUCTION_ORIGIN;
    const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost:3000';
    const proto = req.headers?.['x-forwarded-proto'] || (String(host).startsWith('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
}
