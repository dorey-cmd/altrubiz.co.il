#!/usr/bin/env node

/**
 * Automated Article Markdown Companion Synchronizer for AltruBiz
 * 
 * Ensures every article defined in src/data/articles.ts has a corresponding,
 * perfectly synchronized plaintext Markdown mirror in public/articles/${slug}.md
 * with YAML frontmatter, clear heading hierarchies, and machine-readable context
 * for LLMs / AI retrieval agents.
 */

const fs = require('fs');
const path = require('path');
const { getArticles } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_ARTICLES_DIR = path.join(ROOT_DIR, 'public', 'articles');

if (!fs.existsSync(PUBLIC_ARTICLES_DIR)) {
    fs.mkdirSync(PUBLIC_ARTICLES_DIR, { recursive: true });
}

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Article Markdown Mirror Sync                \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

const articles = getArticles();
console.log(`Found ${articles.length} article(s) in TypeScript registry.`);

function generateFrontmatter(article) {
    const lines = [
        '---',
        `title: ${JSON.stringify(article.title)}`,
        `description: ${JSON.stringify(article.description)}`,
        `slug: ${JSON.stringify(article.slug)}`,
        `canonical_url: ${JSON.stringify(article.canonicalUrl || `https://altrubiz.co.il/articles/${article.slug}`)}`,
        `published_date: ${JSON.stringify(article.datePublished)}`,
        `modified_date: ${JSON.stringify(article.dateModified || article.datePublished)}`,
        `author: ${JSON.stringify(article.author?.name || 'צוות AltruBiz')}`,
        `category: ${JSON.stringify(article.category || 'מאמרים ומדריכים')}`,
        `tags: ${JSON.stringify(article.tags || [])}`,
        '---',
        ''
    ];
    return lines.join('\n');
}

function buildMarkdownFromArticle(article) {
    const parts = [];
    parts.push(generateFrontmatter(article));
    parts.push(`# ${article.title}\n`);

    if (article.subtitle) {
        parts.push(`*${article.subtitle}*\n`);
    }

    if (article.heroSummary) {
        parts.push(`## תקציר ומטרה\n\n${article.heroSummary}\n`);
    }

    if (article.keyTakeaway) {
        parts.push(`> **עיקרון מוביל (Key Takeaway):**\n> ${article.keyTakeaway}\n`);
    }

    // Render sections
    if (article.sections && Array.isArray(article.sections)) {
        for (const section of article.sections) {
            parts.push(`## ${section.title}\n`);
            
            if (section.subtitle) {
                parts.push(`*${section.subtitle}*\n`);
            }

            if (section.problem) {
                parts.push(`> ❌ **הבעיה בעסק:** ${section.problem}\n`);
            }

            if (section.content && Array.isArray(section.content)) {
                for (const p of section.content) {
                    parts.push(`${p}\n`);
                }
            }

            if (section.quickWin) {
                parts.push(`> ⚡ **Quick Win (מה אפשר לעשות עכשיו):** ${section.quickWin.text}\n`);
            }

            if (section.callout) {
                const calloutPrefix = section.callout.type === 'danger' ? '⛔' : 
                                      section.callout.type === 'warning' ? '⚠️' : 
                                      section.callout.type === 'success' ? '✅' : 'ℹ️';
                parts.push(`> ${calloutPrefix} **${section.callout.title || 'שימו לב'}:** ${section.callout.text}\n`);
            }

            if (section.orderedItems && Array.isArray(section.orderedItems)) {
                for (const item of section.orderedItems) {
                    parts.push(`### ${item.title}\n${item.description}\n`);
                }
            }

            if (section.listItems && Array.isArray(section.listItems)) {
                for (const item of section.listItems) {
                    parts.push(`- ${item}`);
                }
                parts.push('');
            }
        }
    }

    // Render FAQs if present
    if (article.faqs && Array.isArray(article.faqs) && article.faqs.length > 0) {
        parts.push(`## שאלות נפוצות ותשובות מעשיות (FAQ)\n`);
        for (const faq of article.faqs) {
            parts.push(`### ש: ${faq.question}\n**ת:** ${faq.answer}\n`);
        }
    }

    parts.push(`---\n*לצפייה בגרסה המקורית של המאמר: [https://altrubiz.co.il/articles/${article.slug}](https://altrubiz.co.il/articles/${article.slug})*`);
    return parts.join('\n');
}

let createdCount = 0;
let updatedCount = 0;
let upToDateCount = 0;

for (const article of articles) {
    const mdPath = path.join(PUBLIC_ARTICLES_DIR, `${article.slug}.md`);

    if (!fs.existsSync(mdPath)) {
        // Generate new markdown file
        const mdContent = buildMarkdownFromArticle(article);
        fs.writeFileSync(mdPath, mdContent, 'utf8');
        console.log(`\x1b[32m✔ [NEW] Created LLM markdown mirror:\x1b[0m public/articles/${article.slug}.md`);
        createdCount++;
    } else {
        // File exists - check if frontmatter needs sync
        const existingContent = fs.readFileSync(mdPath, 'utf8');
        const frontmatterMatch = existingContent.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n[\s\S]*)$/);

        const generatedContent = buildMarkdownFromArticle(article);
        if (existingContent.trim() !== generatedContent.trim()) {
            fs.writeFileSync(mdPath, generatedContent, 'utf8');
            console.log(`\x1b[33m⚡ [UPDATED] Synced markdown body & metadata:\x1b[0m public/articles/${article.slug}.md`);
            updatedCount++;
        } else {
            upToDateCount++;
        }
    }
}

console.log(`\n\x1b[32m✔ Markdown sync complete: ${createdCount} created, ${updatedCount} updated, ${upToDateCount} up to date.\x1b[0m\n`);
