/**
 * AltruBiz Conversion Engine Types
 * 
 * Defines data structures for context-aware conversion modals,
 * temporary URL states, document.title management, and attribution.
 */

import { CTAContext, CTAIntent, CTAType } from './attribution';

export type ConversionType = 'booking' | 'contact';

export type NormalizedCTAIntent = 
    | 'book-meeting'
    | 'ask-question'
    | 'discuss-solution'
    | 'pricing'
    | 'implementation-help'
    | CTAIntent;

export interface ArticleConversionConfig {
    /** Short context identifier used in temporary URL (e.g. 'pipeline', 'unified-inbox') */
    contextSlug?: string;
    /** Contextual problem summary for this article (e.g. 'excel-chaos', 'missed-calls') */
    primaryProblem?: string;
    /** Contextual promise summary (e.g. 'visual-pipeline', 'instant-response') */
    primaryPromise?: string;
    /** Contextual title when opening booking modal from this article */
    bookingTitle?: string;
    /** Contextual subtitle/description when opening booking modal */
    bookingDescription?: string;
    /** Contextual title when opening contact modal from this article */
    contactTitle?: string;
    /** Contextual subtitle/description when opening contact modal */
    contactDescription?: string;
    /** Contextual badge displayed in the modal header */
    badge?: string;
}

export interface ConversionContext {
    /** Type of conversion interaction */
    conversionType: ConversionType;
    /** Current canonical public pathname (e.g. '/excel-to-pipeline') */
    pagePath: string;
    /** Public page or article title */
    pageTitle?: string;
    /** Active section identifier (e.g. 'reality-check', 'action-03') */
    sectionId?: string;
    /** Active section title */
    sectionTitle?: string;
    /** Normalized user intent */
    intent: NormalizedCTAIntent | string;
    /** Contextual headline displayed in modal header */
    contextualTitle: string;
    /** Contextual supporting description displayed in modal */
    contextualDescription: string;
    /** Contextual badge text (e.g. 'תיאום פגישה ביומן', 'בדיקת התאמה') */
    badge: string;
    /** Short slug identifying this conversion domain in the temporary URL */
    contextSlug: string;
    /** Reversible temporary conversion URL for analytics & browser interaction */
    temporaryUrl: string;
    /** Temporary document.title while modal is active */
    documentTitle: string;
    /** Full structured telemetry transmitted to intake widgets and WhatsApp bridges */
    attribution: CTAContext;
}

export interface ResolveConversionParams {
    conversionType: ConversionType;
    pagePath: string;
    pageTitle?: string;
    sectionId?: string;
    sectionTitle?: string;
    intent?: NormalizedCTAIntent | string;
    ctaType?: CTAType;
    sourceLabel?: string;
    explicitTitle?: string;
    explicitSubtitle?: string;
    explicitBadge?: string;
    sourceArticleSlug?: string;
    sourceHubSlug?: string;
}
