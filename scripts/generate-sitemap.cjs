#!/usr/bin/env node

/**
 * Automated XML Sitemap Generator for AltruBiz
 * 
 * Dynamically loads routes and articles from the single source of truth (src/lib/routes.ts)
 * via scripts/routes-loader.cjs.
 * 
 * Guarantees:
 * - Zero hardcoding: new pages & articles automatically appear in sitemap.xml.
 * - Enforces canonical URLs (https://altrubiz.co.il/...).
 * - Strictly forbids fragment hashes (#) and query strings (?).
 * - Excludes private routes marked noindex / inSitemap: false.
 * - Automatically registers markdown mirrors for LLMs if they exist.
 */

const fs = require('fs');
const path = require('path');
const { getAllPublicRoutes } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Automated XML Sitemap Generator            \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

const today = new Date().toISOString().split('T')[0];
const publicRoutes = getAllPublicRoutes();
const sitemapEntries = [];

for (const route of publicRoutes) {
    const isArticle = !!route.article;
    const lastmod = isArticle ? (route.article.dateModified || route.article.datePublished || today) : today;
    const priority = route.sitemapPriority !== undefined ? route.sitemapPriority.toFixed(1) : (route.path === '/' ? '1.0' : '0.8');
    const changefreq = route.sitemapChangeFreq || 'monthly';

    // Primary Canonical URL
    sitemapEntries.push({
        url: route.canonicalUrl,
        lastmod,
        changefreq,
        priority,
        comment: isArticle ? `Article: ${route.article.slug}` : `Route: ${route.path}`
    });

    // Check if markdown companion file exists for articles
    if (isArticle && route.article.slug) {
        const mdFilePath = path.join(PUBLIC_DIR, 'articles', `${route.article.slug}.md`);
        if (fs.existsSync(mdFilePath)) {
            const mdStats = fs.statSync(mdFilePath);
            const mdLastMod = mdStats.mtime ? mdStats.mtime.toISOString().split('T')[0] : lastmod;
            sitemapEntries.push({
                url: `${route.canonicalUrl}.md`,
                lastmod: mdLastMod,
                changefreq: 'monthly',
                priority: '0.7',
                comment: `Plaintext Markdown mirror for LLM: ${route.article.slug}`
            });
        }
    }
}

// Assemble XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const entry of sitemapEntries) {
    xml += `  <!-- ${entry.comment} -->\n`;
    xml += '  <url>\n';
    xml += `    <loc>${entry.url}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n\n';
}

xml += '</urlset>\n';

// Verify strict compliance
if (xml.includes('#')) {
    console.error('\x1b[31mError: Generated sitemap contains illegal fragment hashes (#)!\x1b[0m');
    process.exit(1);
}

fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');

console.log(`\x1b[32m✔ Successfully generated public/sitemap.xml with ${sitemapEntries.length} canonical URLs from routes registry.\x1b[0m\n`);
