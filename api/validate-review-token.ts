/**
 * Vercel Serverless Function: Capability Review Token Validator
 * 
 * Verifies short-lived, unguessable review capability tokens before
 * allowing Review Cockpit rendering on preview environments.
 * 
 * Invariants:
 * 1. Production domain (altrubiz.co.il) strictly fails closed (valid: false).
 * 2. Token must meet cryptographic length (min 32 chars).
 * 3. Scoped to specific article and unrevoked.
 * 4. Zero secret leakage.
 */

import { verifyReviewToken } from './_tokenStore.js';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({
            valid: false,
            message: 'Method Not Allowed.'
        });
    }

    try {
        let token: string = '';
        let articleId: string = '';

        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            token = body?.token || '';
            articleId = body?.articleId || '';
        } else {
            token = (req.query?.token || req.query?.review_token) as string || '';
            articleId = req.query?.articleId as string || '';
        }

        const host = req.headers?.host || req.headers?.['x-forwarded-host'] || '';
        const verification = verifyReviewToken(token, articleId, host);

        return res.status(200).json({
            valid: verification.valid,
            articleId,
            reason: verification.valid ? undefined : verification.reason
        });
    } catch (err: any) {
        return res.status(500).json({
            valid: false,
            message: 'Token validation error.'
        });
    }
}
