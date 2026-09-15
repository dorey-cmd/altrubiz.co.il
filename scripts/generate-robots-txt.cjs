#!/usr/bin/env node

/**
 * SiteOS Authoritative robots.txt Generator & Reusable Template
 * 
 * Single source of truth for robots.txt across SiteOS websites.
 * 
 * Default Policy for NEW Websites:
 * 1. Maximally open to search engines and legitimate AI crawlers.
 * 2. Does NOT block: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot,
 *    PerplexityBot, ClaudeBot, Claude-SearchBot, Applebot, Applebot-Extended, CCBot, etc.
 * 3. General open User-agent rule:
 *    User-agent: *
 *    Allow: /
 *    Disallow: /thank-you.html
 *    Content-Signal: search=yes, ai-input=yes, ai-train=yes
 * 4. Offer/sales pages (/offer) are fully crawlable by default (no Disallow).
 * 5. Dynamic domain substitution:
 *    Sitemap: https://{DOMAIN}/sitemap.xml
 *    # LLM Discovery: https://{DOMAIN}/llms.txt
 *    # LLM Full Knowledge Base: https://{DOMAIN}/llms-full.txt
 */

const fs = require('fs');
const path = require('path');

/**
 * Standard crawler groups for specialized or detailed SiteOS declarations
 */
const ALTRUBIZ_CRAWLER_GROUPS = [
    {
        category: 'Search Engine Crawlers',
        bots: ['Googlebot', 'Bingbot']
    },
    {
        category: 'Social Media & Messaging Preview Crawlers (Facebook, Instagram, LinkedIn, Twitter/X, WhatsApp, TikTok, Slack, Discord)',
        bots: [
            'facebookexternalhit',
            'Facebot',
            'Twitterbot',
            'LinkedInBot',
            'WhatsApp',
            'TelegramBot',
            'Slackbot',
            'Discordbot',
            'Pinterest',
            'ByteSpider'
        ]
    },
    {
        category: 'AI Search & Answer Engine Bots',
        bots: [
            'OAI-SearchBot',
            'ChatGPT-User',
            'PerplexityBot',
            'ClaudeBot',
            'Applebot-Extended'
        ]
    }
];

/**
 * Generates the robots.txt content for any SiteOS website.
 * 
 * @param {Object} options
 * @param {string} options.domain - Domain name (e.g. 'altrubiz.co.il' or 'example.com')
 * @param {string} [options.siteName] - Display name of the site
 * @param {string[]} [options.disallowList] - Paths to disallow (default: ['/thank-you.html'])
 * @param {boolean} [options.includeContentSignal=true] - Include AI Content-Signal directive
 * @param {boolean} [options.includeSitemap=true] - Include Sitemap directive
 * @param {boolean} [options.includeLlms=true] - Include LLM discovery comments
 * @param {boolean} [options.includeSpecificCrawlers=false] - Include detailed per-crawler sections
 * @returns {string} The formatted robots.txt content
 */
function generateSiteOsRobotsTxt(options = {}) {
    const rawDomain = options.domain || 'altrubiz.co.il';
    // Normalize domain: strip leading protocol and trailing slashes
    const domain = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    const siteName = options.siteName || (domain === 'altrubiz.co.il' ? 'AltruBiz' : domain);
    const disallowList = Array.isArray(options.disallowList) ? options.disallowList : ['/thank-you.html'];
    const includeContentSignal = options.includeContentSignal !== false;
    const includeSitemap = options.includeSitemap !== false;
    const includeLlms = options.includeLlms !== false;
    const includeSpecificCrawlers = options.includeSpecificCrawlers ?? (domain === 'altrubiz.co.il');

    const lines = [];

    // Header
    lines.push(`# Robots.txt for ${siteName} (https://${domain}/)`);
    lines.push('');

    // Default crawlers section
    lines.push('# Default crawlers');
    lines.push('User-agent: *');
    lines.push('Allow: /');
    for (const disallowPath of disallowList) {
        lines.push(`Disallow: ${disallowPath}`);
    }
    lines.push('');

    // Content Signals
    if (includeContentSignal) {
        lines.push('Content-Signal: search=yes, ai-input=yes, ai-train=yes');
        lines.push('');
    }

    // Specific crawler sections (if enabled for detailed compliance)
    if (includeSpecificCrawlers) {
        for (const group of ALTRUBIZ_CRAWLER_GROUPS) {
            lines.push(`# ${group.category}`);
            for (const bot of group.bots) {
                lines.push(`User-agent: ${bot}`);
                lines.push('Allow: /');
                lines.push('');
            }
        }
    }

    // Sitemaps and AI manifests
    if (includeSitemap || includeLlms) {
        lines.push('# Sitemaps and AI manifests');
        if (includeSitemap) {
            lines.push(`Sitemap: https://${domain}/sitemap.xml`);
        }
        if (includeLlms) {
            lines.push(`# LLM Discovery: https://${domain}/llms.txt`);
            lines.push(`# LLM Full Knowledge Base: https://${domain}/llms-full.txt`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

// Module exports for programmatic consumption by SiteOS generators
module.exports = {
    generateSiteOsRobotsTxt,
    ALTRUBIZ_CRAWLER_GROUPS
};

// CLI execution handling
if (require.main === module) {
    const args = process.argv.slice(2);
    const isPreview = args.includes('--preview');
    const domainArg = args.find(a => a.startsWith('--domain='));
    const outArg = args.find(a => a.startsWith('--out='));
    const domain = domainArg ? domainArg.split('=')[1] : 'altrubiz.co.il';
    const isGenericNewSite = Boolean(domainArg && domainArg.split('=')[1] !== 'altrubiz.co.il');

    const robotsContent = generateSiteOsRobotsTxt({
        domain,
        includeSpecificCrawlers: !isGenericNewSite
    });

    if (isPreview) {
        console.log(`\n--- Generated robots.txt preview for ${domain} ---\n`);
        console.log(robotsContent);
    } else {
        const targetPath = outArg ? path.resolve(outArg.split('=')[1]) : path.resolve(__dirname, '../public/robots.txt');
        fs.writeFileSync(targetPath, robotsContent, 'utf8');
        console.log(`✔ Successfully generated robots.txt at: ${targetPath}`);
    }
}
