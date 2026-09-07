/**
 * Centralized Route & SEO Registry for AltruBiz
 * 
 * Provides automated route-level SEO, canonicalization, breadcrumb generation,
 * and structured data definitions.
 * Articles from src/data/articles.ts are dynamically registered automatically.
 */

import { ARTICLES, Article } from '../data/articles';

export { ARTICLES };

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
}

export const BASE_CANONICAL_DOMAIN = 'https://altrubiz.co.il';

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
        description: 'הכירו את AltruBiz: חברת תוכנה ישראלית המפתחת מערכת CRM מתקדמת, אינטגרציות WhatsApp Business ובוטים חכמים לקביעת פגישות בעברית מלאה.',
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
    '/articles': {
        path: '/articles',
        title: 'מרכז ידע, מדריכים ומאמרים מקצועיים | AltruBiz CRM',
        description: 'מאגר המאמרים והמדריכים של AltruBiz: הנחיות לדיוור WhatsApp, מדיניות פלטפורמות, אוטומציות עסקיות וניהול לידים.',
        keywords: ['מרכז ידע CRM', 'מדריכי אוטומציה', 'דיוור וואטסאפ לעסקים', 'מאמרי שיווק דיגיטלי'],
        canonicalUrl: `${BASE_CANONICAL_DOMAIN}/articles`,
        schemaType: 'CollectionPage',
        inSitemap: true,
        sitemapPriority: 0.9,
        sitemapChangeFreq: 'weekly',
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מרכז ידע ומאמרים', path: '/articles' }
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
    }
};

/**
 * Generate dynamic route configuration for an article
 */
export function buildArticleRouteConfig(article: Article): RouteConfig {
    const articlePath = `/articles/${article.slug}`;
    return {
        path: articlePath,
        title: article.seoTitle || `${article.title} | AltruBiz CRM`,
        description: article.description,
        keywords: article.keywords,
        canonicalUrl: article.canonicalUrl || `${BASE_CANONICAL_DOMAIN}${articlePath}`,
        schemaType: 'TechArticle',
        inSitemap: true,
        sitemapPriority: 0.9,
        sitemapChangeFreq: 'monthly',
        alternateMarkdown: article.markdownUrl || `${articlePath}.md`,
        breadcrumbs: [
            { name: 'דף הבית', path: '/' },
            { name: 'מרכז ידע ומאמרים', path: '/articles' },
            { name: article.title, path: articlePath }
        ],
        article
    };
}

/**
 * Combined routes registry (static routes + all articles)
 */
export function getRoutesRegistry(): Record<string, RouteConfig> {
    const registry: Record<string, RouteConfig> = { ...STATIC_ROUTES_REGISTRY };

    // Dynamically register all articles from data/articles.ts
    for (const article of ARTICLES) {
        const articlePath = `/articles/${article.slug}`;
        if (!registry[articlePath]) {
            registry[articlePath] = buildArticleRouteConfig(article);
        }
    }

    return registry;
}

export const ROUTES_REGISTRY: Record<string, RouteConfig> = getRoutesRegistry();

/**
 * Look up RouteConfig by path (handles exact match, trailing slash, dynamic articles)
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
    const registry = getRoutesRegistry();
    if (registry[path]) return registry[path];
    const normalized = path.replace(/\/$/, '') || '/';
    if (registry[normalized]) return registry[normalized];

    // Check if path is an article
    if (normalized.startsWith('/articles/')) {
        const slug = normalized.replace('/articles/', '');
        const article = ARTICLES.find(a => a.slug === slug);
        if (article) {
            return buildArticleRouteConfig(article);
        }
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
