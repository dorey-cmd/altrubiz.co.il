/**
 * AltruBiz Review Action Types & Provider-Agnostic Contract
 * 
 * Supports the editorial review loop:
 * - PUBLISH: Explicit owner approval -> release gate -> production
 * - COMMENT: Owner free-text feedback -> agent revision on same branch
 * - DISCARD: Abandon review direction -> close review branch
 */

export type ReviewActionType = 'publish' | 'comment' | 'discard';

export interface ReviewActionPayload {
    action: ReviewActionType;
    articleId: string; // slug
    publicPath: string;
    branch?: string;
    reviewUrl: string;
    feedback?: string;
    timestamp: string;
    author?: string;
}

export interface ReviewActionResult {
    success: boolean;
    action: ReviewActionType;
    message: string;
    articleId: string;
    timestamp: string;
    details?: Record<string, any>;
}
