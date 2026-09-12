/**
 * AltruBiz Post-Publish Distribution Types & Architecture
 * 
 * Defines the contract for downstream content distribution across channels
 * (GHL Email, GHL Social Planner, WhatsApp, short-form video)
 * once an article has been approved and published on the website.
 * 
 * Architectural Invariant:
 * The article is the authoritative SOURCE KNOWLEDGE. Downstream channels
 * are DERIVED REPRESENTATIONS. Downstream distribution failures must
 * NEVER roll back or invalidate website publication.
 */

export type DistributionChannel = 'website' | 'email' | 'social' | 'whatsapp';

export type ChannelDistributionStatus = 
    | 'pending'
    | 'generated'
    | 'review'
    | 'scheduled'
    | 'published'
    | 'sent'
    | 'failed'
    | 'skipped';

export interface ChannelDistributionState {
    channel: DistributionChannel;
    status: ChannelDistributionStatus;
    updatedAt: string;
    scheduledFor?: string;
    externalId?: string; // GHL campaign ID, post ID, etc.
    error?: string;
    notes?: string;
    details?: Record<string, any>;
}

export interface DistributionManifest {
    articleId: string; // internal slug
    publicPath: string;
    canonicalUrl: string;
    productionUrl: string;
    title: string;
    seoTitle: string;
    description: string;
    heroSummary: string;
    keyTakeaway: string;
    parentHub?: {
        slug: string;
        title: string;
        url: string;
    };
    relevantConcepts: string[];
    primaryImage?: {
        src: string;
        alt: string;
    };
    ogImage?: string;
    publicationDate: string;
    sourceLanguage: 'he';
    primaryCtaIntent: string;
    publishedAt: string;
    channels: {
        website: ChannelDistributionState;
        email: ChannelDistributionState;
        social: ChannelDistributionState;
        whatsapp?: ChannelDistributionState;
        [key: string]: ChannelDistributionState | undefined;
    };
}

export interface ContentPublishedEventResult {
    success: boolean;
    eventId: string;
    articleId: string;
    publishedAt: string;
    manifest: DistributionManifest;
    message: string;
    downstreamEligible: boolean;
}
