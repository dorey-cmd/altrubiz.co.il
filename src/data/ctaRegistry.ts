/**
 * AltruBiz Central CTA & External Placement Registry (SiteOS Tier 4)
 * 
 * Source of Truth for all managed outbound CTAs, specifically the GPT Playbook
 * (https://handbook.altrubiz.co.il/join) and other external or strategic conversion touchpoints.
 * 
 * Architectural Invariants:
 * 1. Single Destination Source of Truth: Modifying `destination` here updates the entire site.
 * 2. Global Control: Setting `enabled: false` on a CTA definition disables it site-wide.
 * 3. Separation of Concerns: CTA Definition != Placement Registry != Presentation.
 * 4. Deduplication & Precedence: Manual Placement Override > Content-Driven Recommendation > Auto Rule.
 * 5. Full Auditability: Programmatic audit functions & CLI script without manual regex scanning.
 */

export type CtaRelevance = 'high' | 'medium' | 'low';
export type CtaPlacementType = 'box' | 'banner' | 'strip' | 'text-link' | 'button';
export type CtaPosition = 'start' | 'mid' | 'end' | 'section';
export type CtaPlacementSource = 'manual' | 'content-recommendation' | 'auto';

export interface CtaCopyVariant {
    id: string;
    name: string;
    title: string;
    description?: string;
    buttonText: string;
    badge?: string;
    secondaryButtonText?: string;
    whatsappText?: string;
    quote?: string;
}

export interface CtaDefinition {
    id: string;
    name: string;
    destination: string;
    enabled: boolean;
    trackingId: string;
    description?: string;
    defaultCopy: {
        badge?: string;
        title: string;
        description?: string;
        buttonText: string;
        secondaryButtonText?: string;
        whatsappText?: string;
    };
    availableVariants: Record<string, CtaCopyVariant>;
}

export interface CtaPlacementRecord {
    id: string;
    ctaId: string;
    target: {
        page: string;      // Canonical public path, e.g. '/chatgpt-ads-israel-launch'
        contentId?: string; // Article slug or ID
    };
    context: string;
    relevance: CtaRelevance;
    placementType: CtaPlacementType;
    position: CtaPosition;
    sectionId?: string;
    copyVariant: string;
    source: 'manual' | 'auto';
    enabled: boolean;
    priority?: number;
}

export interface CtaAutoRule {
    id: string;
    ctaId: string;
    enabled: boolean;
    relevance: CtaRelevance;
    placementType: CtaPlacementType;
    position: CtaPosition;
    copyVariant: string;
    match: {
        tags?: string[];
        categories?: string[];
        slugPatterns?: string[];
    };
    context: string;
}

export interface ResolvedCtaPlacement {
    ctaId: string;
    ctaName: string;
    placementId: string;
    destination: string;
    relevance: CtaRelevance;
    placementType: CtaPlacementType;
    position: CtaPosition;
    sectionId?: string;
    source: CtaPlacementSource;
    variantId: string;
    badge?: string;
    title: string;
    description?: string;
    buttonText: string;
    secondaryButtonText?: string;
    trackingId: string;
    pagePath: string;
    enabled: boolean;
}

// ====================================================================
// 1. CTA DEFINITIONS (Source of Truth)
// ====================================================================

export const CTA_DEFINITIONS: Record<string, CtaDefinition> = {
    'gpt-playbook': {
        id: 'gpt-playbook',
        name: 'GPT Playbook - המדריך המעשי לפרסום ב-ChatGPT',
        // --- MASTER DESTINATION SOURCE OF TRUTH ---
        // Change this single URL to update all links to the Handbook across the site.
        destination: 'https://handbook.altrubiz.co.il/join',
        // --- MASTER ENABLED TOGGLE ---
        // Set to false to disable GPT Playbook everywhere across the site instantly.
        enabled: true,
        trackingId: 'gpt-playbook',
        description: 'המדריך המעשי של AltruBiz לפרסום מבוסס כוונה ב-ChatGPT Ads, ניסוח Context Hints, ומערכי קליטה ל-CRM.',
        defaultCopy: {
            badge: 'מדריך מעשי להורדה',
            title: 'רוצים לראות איך פרסום ב-ChatGPT עובד הלכה למעשה?',
            description: 'הצטרפו ל-GPT Playbook: מדריך מקיף ויישומי לפרסום מבוסס כוונה ב-ChatGPT, כולל כתיבת Context Hints, מבנה מודעות וקליטה ישירה ל-CRM.',
            buttonText: 'להצטרפות ל-GPT Playbook ←',
            secondaryButtonText: 'לפרטים נוספים'
        },
        availableVariants: {
            'practical-next-step': {
                id: 'practical-next-step',
                name: 'צעד מעשי הבא (השקת פרסום)',
                badge: 'הצעד המעשי הבא',
                title: 'מוכנים לעבור מחדשות ליישום? מדריך הפרסום ב-ChatGPT',
                description: 'הצטרפו ל-GPT Playbook וקבלו גישה לשיטות העבודה, הדוגמאות המעשיות והתהליכים המלאים לניהול קמפיינים ב-ChatGPT.',
                buttonText: 'להצטרפות ל-GPT Playbook ←'
            },
            'intent-fit-playbook': {
                id: 'intent-fit-playbook',
                name: 'קהל, כוונה והתאמה ב-Playbook',
                badge: 'יישום מתקדם',
                title: 'איך לתרגם כוונת קנייה ב-ChatGPT ללקוחות משלמים ב-CRM?',
                description: 'ב-GPT Playbook תמצאו את הנוסחאות המדויקות לסינון לידים, ניסוח Context Hints, וחיבור ישיר של מתעניינים לתהליכי המכירה שלכם.',
                buttonText: 'לקבלת גישה ל-Playbook ←'
            },
            'context-hints-mastery': {
                id: 'context-hints-mastery',
                name: 'שליטה ב-Context Hints',
                badge: 'מדריך מעשי',
                title: 'המדריך לכתיבת Context Hints מדויקים ב-ChatGPT Ads',
                description: 'בלי לנחש מילות מפתח: איך לכוון את ה-AI בדיוק לשיחות ולצרכים שהעסק שלכם פותר.',
                buttonText: 'למדריך המלא ב-Playbook ←'
            },
            'compact-strip': {
                id: 'compact-strip',
                name: 'פס עדין מקוצר',
                badge: 'מדריך מעשי',
                title: 'הצטרפו ל-GPT Playbook: המדריך המעשי לפרסום ב-ChatGPT',
                description: 'כלים, תבניות ושיטות עבודה מעשיות לפרסום מבוסס כוונה.',
                buttonText: 'להצטרפות ←'
            }
        }
    }
};

// ====================================================================
// 2. PLACEMENT REGISTRY (Explicit Placement Declarations)
// ====================================================================

export const CTA_PLACEMENTS: CtaPlacementRecord[] = [
    {
        id: 'gpt-playbook-israel-launch-end',
        ctaId: 'gpt-playbook',
        target: {
            page: '/chatgpt-ads-israel-launch',
            contentId: 'chatgpt-ads-israel-launch'
        },
        context: 'סיום מאמר השקת פרסום ב-ChatGPT בישראל - הנעה להעמקה מעשית ב-Playbook',
        relevance: 'high',
        placementType: 'box',
        position: 'end',
        copyVariant: 'practical-next-step',
        source: 'manual',
        enabled: true
    },
    {
        id: 'gpt-playbook-intent-fit-end',
        ctaId: 'gpt-playbook',
        target: {
            page: '/chatgpt-ads-intent-fit',
            contentId: 'chatgpt-ads-intent-fit'
        },
        context: 'סיום מאמר קהל, כוונה והתאמה - הדרכה מעשית לסינון וקליטת לידים מ-ChatGPT',
        relevance: 'high',
        placementType: 'box',
        position: 'end',
        copyVariant: 'intent-fit-playbook',
        source: 'manual',
        enabled: true
    },
    {
        id: 'gpt-playbook-practical-ai-sample-disabled',
        ctaId: 'gpt-playbook',
        target: {
            page: '/practical-ai-for-business',
            contentId: 'practical-ai-for-business'
        },
        context: 'דוגמת placement מושבת (Disabled) לצרכי בקרה ו-Audit - שמור לשימוש עתידי',
        relevance: 'medium',
        placementType: 'banner',
        position: 'end',
        copyVariant: 'compact-strip',
        source: 'manual',
        enabled: false // Explicitly disabled for granular control demonstration & audit
    }
];

// ====================================================================
// 3. AUTO PLACEMENT RULES (Topic / Tag / Intent Driven)
// ====================================================================

export const CTA_AUTO_RULES: CtaAutoRule[] = [
    {
        id: 'auto-gpt-playbook-chatgpt-ads',
        ctaId: 'gpt-playbook',
        enabled: true,
        relevance: 'high',
        placementType: 'box',
        position: 'end',
        copyVariant: 'practical-next-step',
        match: {
            tags: ['ChatGPT', 'פרסום ב-ChatGPT', 'ChatGPT Ads', 'OpenAI'],
            categories: ['AI ופרסום', 'שיווק דיגיטלי'],
            slugPatterns: ['chatgpt-ads-*']
        },
        context: 'כלל SiteOS אוטומטי לתכנים ומאמרים העוסקים בפרסום ב-ChatGPT'
    }
];

// ====================================================================
// 4. RESOLUTION ENGINE & ATTRIBUTION BUILDER
// ====================================================================

/**
 * Returns the authoritative destination URL for a CTA, optionally decorated with attribution tracking.
 */
export function getCtaDestination(ctaId: string, placementId?: string): string {
    const cta = CTA_DEFINITIONS[ctaId];
    if (!cta) {
        throw new Error(`[CtaRegistry] Unknown CTA ID: "${ctaId}"`);
    }

    if (!placementId) {
        return cta.destination;
    }

    try {
        const url = new URL(cta.destination);
        url.searchParams.set('utm_source', 'altrubiz');
        url.searchParams.set('utm_medium', 'site_cta');
        url.searchParams.set('utm_campaign', cta.trackingId);
        url.searchParams.set('utm_content', placementId);
        return url.toString();
    } catch {
        // Fallback if destination is relative or not a full URL
        const sep = cta.destination.includes('?') ? '&' : '?';
        return `${cta.destination}${sep}utm_source=altrubiz&utm_medium=site_cta&utm_campaign=${encodeURIComponent(cta.trackingId)}&utm_content=${encodeURIComponent(placementId)}`;
    }
}

/**
 * Checks whether a CTA is active globally.
 */
export function isCtaGloballyEnabled(ctaId: string): boolean {
    return Boolean(CTA_DEFINITIONS[ctaId]?.enabled);
}

export interface ArticleEvaluationContext {
    slug: string;
    publicPath: string;
    tags?: string[];
    category?: string;
    recommendedCtas?: string[];
}

/**
 * Resolves the single highest-priority CTA placement for a given article,
 * enforcing: Manual Placement > Content Recommendation > Auto Rule.
 * 
 * Returns null if disabled globally, manually suppressed, or no placement applies.
 */
export function resolveCtaForArticle(article: ArticleEvaluationContext, ctaId: string = 'gpt-playbook'): ResolvedCtaPlacement | null {
    const cta = CTA_DEFINITIONS[ctaId];
    if (!cta || !cta.enabled) {
        return null;
    }

    const pagePath = article.publicPath;
    const articleSlug = article.slug;

    // 1. Manual Placement (Highest Priority)
    const manualPlacement = CTA_PLACEMENTS.find(
        p => p.ctaId === ctaId && p.source === 'manual' && (p.target.page === pagePath || p.target.contentId === articleSlug)
    );

    if (manualPlacement) {
        if (!manualPlacement.enabled) {
            // Manual override: explicitly disabled for this page!
            return null;
        }

        const variant = cta.availableVariants[manualPlacement.copyVariant] || cta.defaultCopy;

        return {
            ctaId: cta.id,
            ctaName: cta.name,
            placementId: manualPlacement.id,
            destination: getCtaDestination(cta.id, manualPlacement.id),
            relevance: manualPlacement.relevance,
            placementType: manualPlacement.placementType,
            position: manualPlacement.position,
            sectionId: manualPlacement.sectionId,
            source: 'manual',
            variantId: manualPlacement.copyVariant,
            badge: variant.badge || cta.defaultCopy.badge,
            title: variant.title,
            description: variant.description || cta.defaultCopy.description,
            buttonText: variant.buttonText,
            secondaryButtonText: variant.secondaryButtonText || cta.defaultCopy.secondaryButtonText,
            trackingId: cta.trackingId,
            pagePath,
            enabled: true
        };
    }

    // 2. Content-driven placement via article.recommendedCtas
    if (article.recommendedCtas && article.recommendedCtas.includes(ctaId)) {
        const defaultVariantId = Object.keys(cta.availableVariants)[0] || 'default';
        const variant = cta.availableVariants[defaultVariantId] || cta.defaultCopy;
        const placementId = `${ctaId}-${articleSlug}-recommended`;

        return {
            ctaId: cta.id,
            ctaName: cta.name,
            placementId,
            destination: getCtaDestination(cta.id, placementId),
            relevance: 'high',
            placementType: 'box',
            position: 'end',
            source: 'content-recommendation',
            variantId: defaultVariantId,
            badge: variant.badge || cta.defaultCopy.badge,
            title: variant.title,
            description: variant.description || cta.defaultCopy.description,
            buttonText: variant.buttonText,
            secondaryButtonText: variant.secondaryButtonText || cta.defaultCopy.secondaryButtonText,
            trackingId: cta.trackingId,
            pagePath,
            enabled: true
        };
    }

    // 3. Auto Rule (Lowest Priority, evaluated only if no manual placement exists)
    for (const rule of CTA_AUTO_RULES) {
        if (rule.ctaId !== ctaId || !rule.enabled) continue;

        let isMatch = false;

        // Check slug pattern
        if (rule.match.slugPatterns?.some(pattern => {
            const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
            return regex.test(articleSlug);
        })) {
            isMatch = true;
        }

        // Check tags
        if (!isMatch && rule.match.tags && article.tags) {
            const tagSet = new Set(article.tags.map(t => t.toLowerCase()));
            if (rule.match.tags.some(t => tagSet.has(t.toLowerCase()))) {
                isMatch = true;
            }
        }

        // Check category
        if (!isMatch && rule.match.categories && article.category) {
            if (rule.match.categories.includes(article.category)) {
                isMatch = true;
            }
        }

        if (isMatch) {
            const variant = cta.availableVariants[rule.copyVariant] || cta.defaultCopy;
            const placementId = `${rule.id}-${articleSlug}`;

            return {
                ctaId: cta.id,
                ctaName: cta.name,
                placementId,
                destination: getCtaDestination(cta.id, placementId),
                relevance: rule.relevance,
                placementType: rule.placementType,
                position: rule.position,
                source: 'auto',
                variantId: rule.copyVariant,
                badge: variant.badge || cta.defaultCopy.badge,
                title: variant.title,
                description: variant.description || cta.defaultCopy.description,
                buttonText: variant.buttonText,
                secondaryButtonText: variant.secondaryButtonText || cta.defaultCopy.secondaryButtonText,
                trackingId: cta.trackingId,
                pagePath,
                enabled: true
            };
        }
    }

    return null;
}

/**
 * Resolves a placement for a generic page route.
 */
export function resolveCtaForPage(pagePath: string, ctaId: string = 'gpt-playbook'): ResolvedCtaPlacement | null {
    const cta = CTA_DEFINITIONS[ctaId];
    if (!cta || !cta.enabled) {
        return null;
    }

    const manualPlacement = CTA_PLACEMENTS.find(
        p => p.ctaId === ctaId && p.source === 'manual' && p.target.page === pagePath
    );

    if (!manualPlacement || !manualPlacement.enabled) {
        return null;
    }

    const variant = cta.availableVariants[manualPlacement.copyVariant] || cta.defaultCopy;

    return {
        ctaId: cta.id,
        ctaName: cta.name,
        placementId: manualPlacement.id,
        destination: getCtaDestination(cta.id, manualPlacement.id),
        relevance: manualPlacement.relevance,
        placementType: manualPlacement.placementType,
        position: manualPlacement.position,
        sectionId: manualPlacement.sectionId,
        source: 'manual',
        variantId: manualPlacement.copyVariant,
        badge: variant.badge || cta.defaultCopy.badge,
        title: variant.title,
        description: variant.description || cta.defaultCopy.description,
        buttonText: variant.buttonText,
        secondaryButtonText: variant.secondaryButtonText || cta.defaultCopy.secondaryButtonText,
        trackingId: cta.trackingId,
        pagePath,
        enabled: true
    };
}
