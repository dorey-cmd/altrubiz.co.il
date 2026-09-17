/**
 * Centralized Route & SEO Registry for AltruBiz
 * 
 * Provides automated route-level SEO, canonicalization, breadcrumb generation,
 * and structured data definitions.
 * Articles from src/data/articles.ts are dynamically registered automatically.
 */

import { 
    ARTICLES, 
    Article, 
    getAllArticles, 
    getPublishedArticles, 
    getIndexableArticles, 
    getReviewArticles, 
    getDraftArticles, 
    getMachineEligibleArticles, 
    getArticleBySlug, 
    getArticleByPublicPath 
} from '../data/articles';
import { KnowledgeNode, getAllHubs, getParentHubForArticle, CANONICAL_CONCEPTS, resolveCanonicalConcept } from '../data/knowledgeGraph';
import { IL_MARKET } from '../siteos/config/markets/il';
import { deriveStateFlags, isSitemapEligible } from '../siteos';

export { 
    ARTICLES, 
    getAllArticles, 
    getPublishedArticles, 
    getIndexableArticles, 
    getReviewArticles, 
    getDraftArticles, 
    getMachineEligibleArticles, 
    getArticleBySlug, 
    getArticleByPublicPath, 
    getAllHubs, 
    getParentHubForArticle, 
    CANONICAL_CONCEPTS, 
    resolveCanonicalConcept 
};

export interface RouteBreadcrumb {
    name: string;
    path: string;
}

export interface RouteConfig {
    path: string;
    title: string;
    description: string;
    keywords?: string[];
    canonicalUrl: string;
    schemaType: 'WebPage' | 'AboutPage' | 'CollectionPage' | 'TechArticle' | 'Article';
    inSitemap: boolean;
    sitemapPriority?: number;
    sitemapChangeFreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    noindex?: boolean;
    alternateMarkdown?: string;
    breadcrumbs?: RouteBreadcrumb[];
    article?: Article;
    hubNode?: KnowledgeNode;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
}

/**
 * Sourced from the IL MarketConfig (SiteOS Phase 3 Batch 2) rather than a
 * second hardcoded literal. IL_MARKET.domain === 'https://altrubiz.co.il'
 * exactly, so this is a zero-behavior-change migration — verified via a
 * full build + generated-artifact diff, not assumed.
 */
export const BASE_CANONICAL_DOMAIN = IL_MARKET.domain;

export const STATIC_ROUTES_REGISTRY: Record<string, RouteConfig> = {
    '/': {
        path: '/',
        title: 'Altrubiz CRM | להכניס את השיטה לסיסטם - אוטומציה ובינה מלאכותית',
        description: 'המערכת האחת שמרכזת את כל הכלים כדי לגדל את העסק הדיגיטלי - CRM, חיבורי WhatsApp, בוטים חכמים מבוססי AI, ואוטומציות שחוסכות זמן.',
        keywords: ['CRM', 'ניהול עסק', 'אוטומציה', 'בינה מלאכותית', 'ניהול לידים', 'בוטים', 'וואטסאפ לעסקים'],
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/`,
        schemaType: 'WebPage',
        inSitemap: true,
        sitemapPriority: 1.0,
        sitemapChangeFreq: 'weekly'
    },
    '/about': {
        path: '/about',
        title: 'אודות AltruBiz (אלטרוביז) | CRM, אוטומציות ובוטים מבוססי AI',
        description: 'היכרות עם AltruBiz: חברת תוכנה ישראלית המפתחת מערכת CRM מתקדמת, אינטגרציות WhatsApp Business ובוטים חכמים לקביעת פגישות בעברית מלאה.',
        keywords: ['אודות אלטרוביז', 'AltruBiz CRM', 'תוכנת CRM ישראלית', 'אוטומציה עסקית בישראל'],
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/about`,
        schemaType: 'AboutPage',
        inSitemap: true,
        sitemapPriority: 0.8,
        sitemapChangeFreq: 'monthly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'אודות AltruBiz', path: '/about' }
        ]
    },
    '/knowledge': {
        path: '/knowledge',
        title: 'מרכז ידע, מדריכים ומאמרים מקצועיים | AltruBiz CRM',
        description: 'מאגר המאמרים והמדריכים של AltruBiz: הנחיות לדיוור WhatsApp, מדיניות פלטפורמות, אוטומציות עסקיות וניהול לידים.',
        keywords: ['מרכז ידע CRM', 'מדריכי אוטומציה', 'דיוור וואטסאפ לעסקים', 'מאמרי שיווק דיגיטלי'],
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/knowledge`,
        schemaType: 'CollectionPage',
        inSitemap: true,
        sitemapPriority: 0.9,
        sitemapChangeFreq: 'weekly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מרכז ידע ומאמרים', path: '/knowledge' }
        ]
    },
    '/offer': {
        path: '/offer',
        title: 'AltruBiz | Offer',
        description: 'הצעת מחיר מיוחדת למערכת AltruBiz CRM',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/offer`,
        schemaType: 'WebPage',
        inSitemap: false,
        noindex: true
    },
    '/privacy-policy': {
        path: '/privacy-policy',
        title: 'מדיניות פרטיות | AltruBiz CRM',
        description: 'מדיניות הפרטיות של אתר AltruBiz: אילו נתונים נאספים, לשם מה, עם אילו ספקי צד שלישי הם משותפים וכיצד לממש זכויות פרטיות.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/privacy-policy`,
        schemaType: 'WebPage',
        inSitemap: true,
        sitemapPriority: 0.3,
        sitemapChangeFreq: 'yearly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מדיניות פרטיות', path: '/privacy-policy' }
        ]
    },
    '/terms-of-use': {
        path: '/terms-of-use',
        title: 'תנאי שימוש | AltruBiz CRM',
        description: 'תנאי השימוש באתר AltruBiz: תנאי הזמנת מנוי, קניין רוחני, ביטול עסקה והגבלת אחריות.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/terms-of-use`,
        schemaType: 'WebPage',
        inSitemap: true,
        sitemapPriority: 0.3,
        sitemapChangeFreq: 'yearly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'תנאי שימוש', path: '/terms-of-use' }
        ]
    },
    '/cookie-policy': {
        path: '/cookie-policy',
        title: 'מדיניות Cookies | AltruBiz CRM',
        description: 'אילו קובצי Cookie וכלי אנליטיקה פועלים באתר AltruBiz, ואיך לנהל את ההסכמה שלכם אליהם.',
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/cookie-policy`,
        schemaType: 'WebPage',
        inSitemap: true,
        sitemapPriority: 0.3,
        sitemapChangeFreq: 'yearly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מדיניות Cookies', path: '/cookie-policy' }
        ]
    },
    '/roi-calculator': {
        path: '/roi-calculator',
        title: 'מחשבון ROI ללידים: כמה כסף הולך לאיבוד כל חודש? | AltruBiz CRM',
        description: 'מחשבון ROI אינטראקטיבי לעסקים: בדיקת כמות הלידים, שווי עסקה ושיעור הסגירה לחשיפת פוטנציאל המכירה שהולך לאיבוד וחישוב שווי החיסכון בזמן.',
        keywords: [
            'מחשבון ROI',
            'מחשבון לידים',
            'עלות לידים אבודים',
            'חישוב אובדן עסקאות',
            'שיפור אחוז סגירה',
            'CRM ROI',
            'חיסכון בזמן עבודה',
            'AltruBiz CRM'
        ],
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/roi-calculator`,
        schemaType: 'WebPage',
        inSitemap: true,
        sitemapPriority: 0.8,
        sitemapChangeFreq: 'monthly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מחשבון ROI ללידים', path: '/roi-calculator' }
        ]
    }
};

/**
 * Single authoritative breadcrumb trail for an article, consumed by both
 * the visible UI (ArticlePage.tsx) and the BreadcrumbList Schema.org output
 * (via buildArticleRouteConfig below) -- SiteOS Phase 3. Previously these
 * were two independent implementations that disagreed whenever an article
 * had a parent hub (ArticlePage.tsx included it, routes.ts's schema-facing
 * breadcrumbs did not) -- Phase 1.5 traced this divergence explicitly.
 */
export function buildArticleBreadcrumbs(article: Article): RouteBreadcrumb[] {
    const parentHub = getParentHubForArticle(article.slug);
    return [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע', path: '/knowledge' },
        ...(parentHub ? [{ name: parentHub.title, path: parentHub.url }] : []),
        { name: article.title, path: article.publicPath }
    ];
}

/**
 * Generate dynamic route configuration for an article
 */
export function buildArticleRouteConfig(article: Article): RouteConfig {
    const articlePath = article.publicPath;
    const coverSrc = article.coverImage?.src;
    const absoluteOgImage = coverSrc
        ? (coverSrc.startsWith('http') ? coverSrc : `${BASE_CANONICAL_DOMAIN}${coverSrc}`)
        : `${BASE_CANONICAL_DOMAIN}/images/articles/og/${article.slug}.jpg`;
    const smartOgDescription = article.keyTakeaway || article.heroSummary || article.description;
    // SiteOS Phase 3: sourced from the single PublicationState derivation
    // (src/siteos/types/publication.ts) instead of an independently-coded
    // formula, so this can never drift from what
    // scripts/validate-siteos-identity.cjs validates against real data.
    const isIndexable = isSitemapEligible(deriveStateFlags(article));

    return {
        path: articlePath,
        title: article.seoTitle || `${article.title} | AltruBiz CRM`,
        description: article.description,
        keywords: article.keywords,
        canonicalUrl: article.canonicalUrl || `${BASE_CANONICAL_DOMAIN}${articlePath}`,
        schemaType: 'TechArticle',
        inSitemap: isIndexable,
        noindex: !isIndexable,
        sitemapPriority: isIndexable ? 0.9 : undefined,
        sitemapChangeFreq: 'monthly',
        alternateMarkdown: isIndexable ? (article.markdownUrl || `${articlePath}.md`) : undefined,
        ogImage: absoluteOgImage,
        ogTitle: `${article.title} | AltruBiz CRM`,
        ogDescription: smartOgDescription,
        breadcrumbs: buildArticleBreadcrumbs(article),
        article
    };
}

/**
 * Generate dynamic route configuration for a Knowledge Hub (Pain Hub or Micro Hub)
 */
export function buildHubRouteConfig(node: KnowledgeNode): RouteConfig {
    const hubPath = node.url;
    return {
        path: hubPath,
        title: node.seoTitle || `${node.title} | AltruBiz CRM`,
        description: node.description,
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}${hubPath}`,
        schemaType: 'CollectionPage',
        inSitemap: node.isIndexable,
        sitemapPriority: 0.9,
        sitemapChangeFreq: 'weekly',
        ogTitle: `${node.title} | AltruBiz CRM`,
        ogDescription: node.description,
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מרכז ידע', path: '/knowledge' },
            { name: node.title, path: hubPath }
        ],
        hubNode: node
    };
}

/**
 * Combined routes registry (static routes + all articles + all hubs)
 */
export function getRoutesRegistry(): Record<string, RouteConfig> {
    const registry: Record<string, RouteConfig> = { ...STATIC_ROUTES_REGISTRY };

    // Dynamically register all articles from data/articles.ts
    for (const article of ARTICLES) {
        const articlePath = article.publicPath;
        if (!registry[articlePath]) {
            registry[articlePath] = buildArticleRouteConfig(article);
        }
    }

    // Dynamically register all promoted knowledge hubs from data/knowledgeGraph.ts
    for (const hub of getAllHubs()) {
        if (!registry[hub.url]) {
            registry[hub.url] = buildHubRouteConfig(hub);
        }
    }

    return registry;
}

export const ROUTES_REGISTRY: Record<string, RouteConfig> = getRoutesRegistry();

/**
 * Look up RouteConfig by path (handles exact match, trailing slash, dynamic articles, and hubs)
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
    const registry = getRoutesRegistry();
    if (registry[path]) return registry[path];
    const normalized = path.replace(/\/$/, '') || '/';
    if (registry[normalized]) return registry[normalized];

    // Fallback: try matching article by publicPath or hub by url
    const matchedArticle = ARTICLES.find(a => a.publicPath === normalized);
    if (matchedArticle) {
        return buildArticleRouteConfig(matchedArticle);
    }

    const matchedHub = getAllHubs().find(h => h.url === normalized);
    if (matchedHub) {
        return buildHubRouteConfig(matchedHub);
    }

    return undefined;
}

/**
 * Returns all public, indexable routes configured for sitemap inclusion
 */
export function getAllPublicRoutes(): RouteConfig[] {
    const registry = getRoutesRegistry();
    return Object.values(registry).filter(route => route.inSitemap && !route.noindex);
}
