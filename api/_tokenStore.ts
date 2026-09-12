/**
 * AltruBiz Review Capability Token Store & Revocation Registry
 * 
 * Manages active review capability tokens and enforces instant revocation
 * upon PUBLISH, COMMENT, or DISCARD actions.
 * 
 * Invariant:
 * Possession of the valid, unrevoked capability URL (?review_token=...)
 * is the sole authorization. When invalidated, the token cannot be reused.
 */

// In-memory revocation registry for active runtime
const revokedTokens = new Set<string>();

export function revokeReviewToken(token: string): void {
    if (token && typeof token === 'string') {
        revokedTokens.add(token.trim());
    }
}

export function isReviewTokenRevoked(token: string): boolean {
    if (!token || typeof token !== 'string') return true;
    return revokedTokens.has(token.trim());
}

/**
 * Validates whether a given review token is cryptographically strong,
 * properly scoped to the article, not revoked, and valid for the environment.
 */
export function verifyReviewToken(token: string, articleId: string, host?: string): { valid: boolean; reason?: string } {
    // 1. Strict production domain immunity
    if (host) {
        const cleanHost = host.split(':')[0].toLowerCase();
        if (cleanHost === 'altrubiz.co.il' || cleanHost === 'www.altrubiz.co.il') {
            return { valid: false, reason: 'Production domain immunity enforced' };
        }
    }

    // 2. Format & cryptographic length validation
    if (!token || typeof token !== 'string') {
        return { valid: false, reason: 'Missing or empty token' };
    }

    const trimmed = token.trim();
    if (trimmed.length < 32) {
        return { valid: false, reason: 'Token does not meet cryptographic minimum length (32 chars)' };
    }

    // 3. Revocation check
    if (isReviewTokenRevoked(trimmed)) {
        return { valid: false, reason: 'Token has been revoked' };
    }

    // 4. Article-scoped token check (if token format is rev_<slug>_<entropy>)
    if (trimmed.startsWith('rev_')) {
        const parts = trimmed.split('_');
        if (parts.length >= 3) {
            const tokenSlug = parts[1];
            if (tokenSlug && tokenSlug !== articleId) {
                return { valid: false, reason: 'Token scoped to a different article' };
            }
        }
    }

    // 5. Environment-level active token binding (if configured)
    const activeTokensEnv = process.env.REVIEW_ACTIVE_TOKENS;
    if (activeTokensEnv) {
        try {
            const tokenMap = JSON.parse(activeTokensEnv);
            const expectedToken = tokenMap[articleId];
            if (expectedToken && expectedToken !== trimmed) {
                return { valid: false, reason: 'Token does not match active review cycle' };
            }
        } catch {
            // Not valid JSON, check single value
            if (activeTokensEnv !== trimmed) {
                return { valid: false, reason: 'Token mismatch with active configuration' };
            }
        }
    } else if (process.env.REVIEW_TOKEN && process.env.REVIEW_TOKEN !== trimmed) {
        return { valid: false, reason: 'Token mismatch with REVIEW_TOKEN' };
    }

    return { valid: true };
}
