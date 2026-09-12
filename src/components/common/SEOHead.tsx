import React, { useEffect } from 'react';
import { RouteConfig, BASE_CANONICAL_DOMAIN } from '../../lib/routes';
import { 
    ORGANIZATION_ENTITY, 
    WEBSITE_ENTITY, 
    SOFTWARE_APPLICATION_ENTITY, 
    HOMEPAGE_FAQS, 
    generateFAQSchema, 
    BASE_URL,
    FAQItem
} from '../../lib/seo';
import { Article } from '../../data/articles';

interface SEOHeadProps {
    routeConfig?: RouteConfig;
    article?: Article | null;
    faqs?: FAQItem[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({ routeConfig, article, faqs }) => {
    useEffect(() => {
        if (!routeConfig) return;

        // 1. Set Document Title (preserve temporary conversion titles when modal is active)
        if (!window.history.state?.isConversionModal) {
            document.title = routeConfig.title;
        }

        // Helper to set or update meta tag
        const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
            let meta = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(nameAttr, attrValue);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // Helper to set or update link tag
        const setLink = (rel: string, href: string, extraAttrs?: Record<string, string>) => {
            const selector = extraAttrs?.type 
                ? `link[rel="${rel}"][type="${extraAttrs.type}"]` 
                : `link[rel="${rel}"]`;
            let link = document.querySelector(selector) as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                if (extraAttrs) {
                    Object.entries(extraAttrs).forEach(([k, v]) => link.setAttribute(k, v));
                }
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        const removeElement = (selector: string) => {
            const el = document.querySelector(selector);
            if (el) el.remove();
        };

        // 2. Meta Description & Keywords
        setMeta('name', 'description', routeConfig.description);
        if (routeConfig.keywords && routeConfig.keywords.length > 0) {
            setMeta('name', 'keywords', routeConfig.keywords.join(', '));
        }

        // 3. Canonical Link (guaranteed absolute HTTPS)
        setLink('canonical', routeConfig.canonicalUrl);

        // 4. Robots Directives
        if (routeConfig.noindex) {
            setMeta('name', 'robots', 'noindex, nofollow');
        } else {
            removeElement('meta[name="robots"]');
        }

        // 5. Alternate Markdown for LLM Retrieval Agents
        if (routeConfig.alternateMarkdown) {
            setLink('alternate', routeConfig.alternateMarkdown, {
                type: 'text/markdown',
                title: 'גרסת Markdown לסוכני בינה מלאכותית (LLM)'
            });
        } else {
            removeElement('link[rel="alternate"][type="text/markdown"]');
        }

        // 6. Open Graph & Social Cards
        const isArticle = routeConfig.schemaType === 'TechArticle' || routeConfig.schemaType === 'Article';
        const defaultOgImage = `${BASE_CANONICAL_DOMAIN}/images/og-altrubiz-main.jpg`;
        const articleOgImage = article ? `${BASE_CANONICAL_DOMAIN}/images/articles/og/${article.slug}.jpg` : defaultOgImage;
        const ogImage = routeConfig.ogImage || articleOgImage;
        const ogTitle = routeConfig.ogTitle || (article?.title ? `${article.title} | AltruBiz CRM` : routeConfig.title);
        const ogDescription = routeConfig.ogDescription || article?.keyTakeaway || article?.heroSummary || routeConfig.description;

        setMeta('property', 'og:type', isArticle ? 'article' : 'website');
        setMeta('property', 'og:title', ogTitle);
        setMeta('property', 'og:description', ogDescription);
        setMeta('property', 'og:url', routeConfig.canonicalUrl);
        setMeta('property', 'og:site_name', 'AltruBiz CRM');
        setMeta('property', 'og:locale', 'he_IL');
        setMeta('property', 'og:image', ogImage);
        setMeta('property', 'og:image:secure_url', ogImage);
        setMeta('property', 'og:image:type', 'image/jpeg');
        setMeta('property', 'og:image:width', '1200');
        setMeta('property', 'og:image:height', '630');
        if (article?.coverImage?.alt) {
            setMeta('property', 'og:image:alt', article.coverImage.alt);
        }

        // Twitter Cards (both name and property for maximum scraper compatibility)
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:site', '@AltruBiz');
        setMeta('name', 'twitter:creator', '@AltruBiz');
        setMeta('name', 'twitter:url', routeConfig.canonicalUrl);
        setMeta('name', 'twitter:title', ogTitle);
        setMeta('name', 'twitter:description', ogDescription);
        setMeta('name', 'twitter:image', ogImage);
        if (article?.coverImage?.alt) {
            setMeta('name', 'twitter:image:alt', article.coverImage.alt);
        }

        // Article-specific social tags
        if (article) {
            setMeta('property', 'article:published_time', article.datePublished);
            setMeta('property', 'article:modified_time', article.dateModified);
            setMeta('property', 'article:author', article.author.name);
            setMeta('property', 'article:section', article.category);
        }

        // Image link fallback for older scrapers
        setLink('image_src', ogImage);

        // 7. Context-Appropriate Schema.org Graph with Stable @id References
        const graph: object[] = [
            ORGANIZATION_ENTITY,
            WEBSITE_ENTITY
        ];

        if (routeConfig.schemaType === 'AboutPage') {
            graph.push({
                "@type": "AboutPage",
                "@id": `${routeConfig.canonicalUrl}#page`,
                "url": routeConfig.canonicalUrl,
                "name": routeConfig.title,
                "description": routeConfig.description,
                "inLanguage": "he-IL",
                "mainEntity": {
                    "@id": `${BASE_URL}/#organization`
                }
            });
        } else if (routeConfig.schemaType === 'CollectionPage') {
            graph.push({
                "@type": "CollectionPage",
                "@id": `${routeConfig.canonicalUrl}#page`,
                "url": routeConfig.canonicalUrl,
                "name": routeConfig.title,
                "description": routeConfig.description,
                "inLanguage": "he-IL",
                "publisher": {
                    "@id": `${BASE_URL}/#organization`
                }
            });
        } else if (routeConfig.schemaType === 'TechArticle' || routeConfig.schemaType === 'Article') {
            const targetArticle = article || routeConfig.article;
            if (targetArticle) {
                graph.push({
                    "@type": "TechArticle",
                    "@id": `${targetArticle.canonicalUrl}#article`,
                    "headline": targetArticle.title,
                    "description": targetArticle.description,
                    "inLanguage": "he-IL",
                    "datePublished": targetArticle.datePublished,
                    "dateModified": targetArticle.dateModified,
                    "author": {
                        "@type": "Organization",
                        "@id": `${BASE_URL}/#organization`,
                        "name": targetArticle.author?.name || "צוות AltruBiz"
                    },
                    "publisher": {
                        "@id": `${BASE_URL}/#organization`
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": targetArticle.canonicalUrl
                    }
                });

                // Visible FAQs for this article if applicable
                const articleFaqs = faqs || targetArticle.faqs;
                if (articleFaqs && articleFaqs.length > 0) {
                    graph.push(generateFAQSchema(articleFaqs));
                }
            }
        } else if (routeConfig.path === '/') {
            graph.push(SOFTWARE_APPLICATION_ENTITY);
            graph.push({
                "@type": "WebPage",
                "@id": `${BASE_URL}/#webpage`,
                "url": `${BASE_URL}/`,
                "name": routeConfig.title,
                "description": routeConfig.description,
                "inLanguage": "he-IL",
                "about": {
                    "@id": `${BASE_URL}/#software`
                }
            });
            graph.push(generateFAQSchema(HOMEPAGE_FAQS));
        }

        // BreadcrumbList Schema (if breadcrumbs are defined)
        if (routeConfig.breadcrumbs && routeConfig.breadcrumbs.length > 0) {
            graph.push({
                "@type": "BreadcrumbList",
                "@id": `${routeConfig.canonicalUrl}#breadcrumb`,
                "itemListElement": routeConfig.breadcrumbs.map((b, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": b.name,
                    "item": b.path.startsWith('http') ? b.path : `${BASE_CANONICAL_DOMAIN}${b.path}`
                }))
            });
        }

        // Inject Dynamic Schema Script
        removeElement('#schema-dynamic');
        const script = document.createElement('script');
        script.id = 'schema-dynamic';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@graph": graph
        });
        document.head.appendChild(script);

    }, [routeConfig, article, faqs]);

    return null; // Head manager only performs DOM side effects
};
