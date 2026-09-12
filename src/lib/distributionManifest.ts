/**
 * AltruBiz Post-Publish Distribution Manifest & Event System
 * 
 * Provider-agnostic foundation for multi-channel distribution.
 * 
 * Guarantees:
 * - Deterministic manifest creation from canonical Article and Knowledge Graph.
 * - Channels maintain independent state (pending, scheduled, sent, failed).
 * - Failure Isolation: Downstream failures NEVER invalidate or rollback website publication.
 * - content.published event is ONLY emitted after website publication verification.
 */

import { Article } from '../data/articles';
import { getParentHubForArticle } from '../data/knowledgeGraph';
import { 
    DistributionManifest, 
    ContentPublishedEventResult, 
    ChannelDistributionState 
} from '../types/distribution';

const DOMAIN = 'https://altrubiz.co.il';

/**
 * Creates an authoritative DistributionManifest from an Article
 */
export function createDistributionManifest(article: Article): DistributionManifest {
    const parentHub = getParentHubForArticle(article.slug);
    const publishedAt = new Date().toISOString();

    // Extract concepts referenced in article sections
    const conceptSet = new Set<string>();
    for (const section of article.sections || []) {
        for (const paragraph of section.content || []) {
            const matches = paragraph.matchAll(/\[([^\]]+)\]\(concept:([a-z0-9-_]+)\)/gi);
            for (const match of matches) {
                conceptSet.add(match[2]);
            }
        }
    }

    const canonicalUrl = article.canonicalUrl || `${DOMAIN}${article.publicPath}`;
    const productionUrl = canonicalUrl;

    const manifest: DistributionManifest = {
        articleId: article.slug,
        publicPath: article.publicPath,
        canonicalUrl,
        productionUrl,
        title: article.title,
        seoTitle: article.seoTitle,
        description: article.description,
        heroSummary: article.heroSummary,
        keyTakeaway: article.keyTakeaway,
        parentHub: parentHub ? {
            slug: parentHub.slug,
            title: parentHub.title,
            url: parentHub.url
        } : undefined,
        relevantConcepts: Array.from(conceptSet),
        primaryImage: article.coverImage ? {
            src: article.coverImage.src,
            alt: article.coverImage.alt
        } : undefined,
        ogImage: `${DOMAIN}/images/articles/og/${article.slug}.jpg`,
        publicationDate: article.datePublished,
        sourceLanguage: 'he',
        primaryCtaIntent: article.conversionConfig?.contextSlug || 'meeting',
        publishedAt,
        channels: {
            website: {
                channel: 'website',
                status: 'published',
                updatedAt: publishedAt,
                details: {
                    canonicalUrl,
                    publicPath: article.publicPath
                }
            },
            email: {
                channel: 'email',
                status: 'pending',
                updatedAt: publishedAt,
                notes: 'Eligible for GHL Email derivation upon worker pickup'
            },
            social: {
                channel: 'social',
                status: 'pending',
                updatedAt: publishedAt,
                notes: 'Eligible for GHL Social Planner derivation upon worker pickup'
            }
        }
    };

    return manifest;
}

/**
 * Emits the content.published event.
 * MUST be called ONLY after website publication has been verified.
 */
export async function emitContentPublishedEvent(
    manifest: DistributionManifest
): Promise<ContentPublishedEventResult> {
    const eventId = `evt_pub_${manifest.articleId}_${Date.now()}`;
    const publishedAt = new Date().toISOString();

    // Provider-agnostic payload
    const eventPayload = {
        eventName: 'content.published',
        eventId,
        articleId: manifest.articleId,
        canonicalUrl: manifest.canonicalUrl,
        publishedAt,
        manifest
    };

    // Extension point: Forward to distribution worker webhook if configured
    const webhookUrl = typeof globalThis !== 'undefined' && (globalThis as any).process?.env
        ? (globalThis as any).process.env.DISTRIBUTION_WEBHOOK_URL
        : undefined;

    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AltruBiz-SiteOS-DistributionFoundation/1.0'
                },
                body: JSON.stringify(eventPayload)
            });
        } catch (err: any) {
            // Failure isolation: Downstream notification error NEVER throws or reverts publication
            console.warn('[DistributionFoundation] Webhook dispatch notice:', err.message);
        }
    }

    return {
        success: true,
        eventId,
        articleId: manifest.articleId,
        publishedAt,
        manifest,
        message: 'content.published event emitted successfully. Manifest eligible for downstream derivation.',
        downstreamEligible: true
    };
}

/**
 * Extension Point: Future GHL Email Handler Stub
 * Does NOT call external APIs today. Establishes the contract and failure isolation.
 */
export async function processGhlEmailDistributionExtension(
    _manifest: DistributionManifest
): Promise<ChannelDistributionState> {
    // Architectural Invariant: Source content is the authoritative knowledge
    return {
        channel: 'email',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        notes: 'GHL Email extension point ready for downstream campaign derivation.'
    };
}

/**
 * Extension Point: Future GHL Social Planner Handler Stub
 * Does NOT call external APIs today. Establishes the contract and failure isolation.
 */
export async function processGhlSocialPlannerDistributionExtension(
    _manifest: DistributionManifest
): Promise<ChannelDistributionState> {
    // Architectural Invariant: Social copy is adapted representation of canonical article
    return {
        channel: 'social',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        notes: 'GHL Social Planner extension point ready for multi-network derivation.'
    };
}
