#!/usr/bin/env node

/**
 * Automated Article Markdown Companion Synchronizer for AltruBiz
 * 
 * Generates and synchronizes canonical plaintext Markdown mirrors at:
 * public/<publicPath>.md (e.g. public/excel-to-pipeline.md)
 * 
 * Guarantees:
 * - Deterministic transformation from TypeScript single source of truth.
 * - State A concepts transformed to absolute canonical HTTPS URLs.
 * - State B concepts rendered as clean editorial prose with auto-generated machine glossary.
 * - Unknown concept safety (fails immediately if unresolvable concept: syntax found).
 * - Exact canonical_url frontmatter pointing to the public HTML route.
 * - Zero raw concept:* pseudo-links in output.
 */

const fs = require('fs');
const path = require('path');
const { getPublishedArticles, resolveCanonicalConcept } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUBLIC_ARTICLES_LEGACY_DIR = path.join(PUBLIC_DIR, 'articles');

console.log('\n\x1b[1m\x1b[36m========================================================\x1b[0m');
console.log('\x1b[1m   AltruBiz Article Markdown Mirror Sync (Round 3C)     \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================\x1b[0m\n');

const articles = getPublishedArticles();
console.log(`Found ${articles.length} published article(s) eligible for machine mirror sync.`);

function generateFrontmatter(article) {
    const canonicalUrl = article.canonicalUrl || `https://altrubiz.co.il${article.publicPath}`;
    const lines = [
        '---',
        `title: ${JSON.stringify(article.title)}`,
        `description: ${JSON.stringify(article.description)}`,
        `slug: ${JSON.stringify(article.slug)}`,
        `canonical_url: ${JSON.stringify(canonicalUrl)}`,
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
    const stateBConceptsFound = new Map();

    function transformText(text) {
        if (!text || typeof text !== 'string') return text;

        // Transform [anchor](concept:id)
        let transformed = text.replace(/\[([^\]]+)\]\(concept:([a-z0-9-_]+)\)/gi, (match, anchor, conceptId) => {
            const concept = resolveCanonicalConcept(conceptId);
            if (!concept) {
                throw new Error(`[CRITICAL] Unresolved concept "${conceptId}" in article "${article.slug}"!`);
            }

            if (concept.hasApprovedPublicDestination && concept.publicDestinationUrl) {
                // State A: Absolute canonical HTTPS URL
                return `[${anchor}](https://altrubiz.co.il${concept.publicDestinationUrl})`;
            }

            // State B: Track for glossary and render as clean prose
            stateBConceptsFound.set(concept.id, concept);
            return anchor;
        });

        // Ensure no raw concept: remains
        if (/concept:[a-z0-9-_]+/i.test(transformed)) {
            throw new Error(`[CRITICAL] Raw concept:* pseudo-link leaked in transformed text: "${transformed}"`);
        }

        // Make internal relative links absolute for markdown portability
        transformed = transformed.replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, (match, anchor, relPath) => {
            return `[${anchor}](https://altrubiz.co.il${relPath})`;
        });

        return transformed;
    }

    const parts = [];
    parts.push(generateFrontmatter(article));
    parts.push(`# ${article.title}\n`);

    if (article.subtitle) {
        parts.push(`*${transformText(article.subtitle)}*\n`);
    }

    if (article.coverImage) {
        parts.push(`![${article.coverImage.alt}](${article.coverImage.src})\n`);
    }

    if (article.heroSummary) {
        parts.push(`## תקציר ומטרה\n\n${transformText(article.heroSummary)}\n`);
    }

    if (article.keyTakeaway) {
        parts.push(`> **עיקרון מוביל (Key Takeaway):**\n> ${transformText(article.keyTakeaway)}\n`);
    }

    // Render sections
    if (article.sections && Array.isArray(article.sections)) {
        for (const section of article.sections) {
            parts.push(`## ${section.title}\n`);
            
            if (section.subtitle) {
                parts.push(`*${transformText(section.subtitle)}*\n`);
            }

            if (section.problem) {
                parts.push(`> ❌ **הבעיה בעסק:** ${transformText(section.problem)}\n`);
            }

            if (section.content && Array.isArray(section.content)) {
                for (const p of section.content) {
                    parts.push(`${transformText(p)}\n`);
                }
            }

            if (section.quickWin) {
                parts.push(`> ⚡ **Quick Win (מה אפשר לעשות עכשיו):** ${transformText(section.quickWin.text)}\n`);
            }

            if (section.image) {
                parts.push(`![${section.image.alt}](${section.image.src})\n`);
                if (section.image.caption) {
                    parts.push(`*💡 ${transformText(section.image.caption)}*\n`);
                }
            }

            if (section.breakRoutine) {
                parts.push(`> 📸 **שוברים שגרה:** *${transformText(section.breakRoutine.scene)}*\n> 💡 *כיתוב: ${transformText(section.breakRoutine.caption)}*\n`);
            }

            if (section.callout) {
                const calloutPrefix = section.callout.type === 'danger' ? '⛔' : 
                                      section.callout.type === 'warning' ? '⚠️' : 
                                      section.callout.type === 'success' ? '✅' : 'ℹ️';
                parts.push(`> ${calloutPrefix} **${section.callout.title || 'שימו לב'}:** ${transformText(section.callout.text)}\n`);
            }

            if (section.orderedItems && Array.isArray(section.orderedItems)) {
                for (const item of section.orderedItems) {
                    parts.push(`### ${item.title}\n${transformText(item.description)}\n`);
                }
            }

            if (section.listItems && Array.isArray(section.listItems)) {
                for (const item of section.listItems) {
                    parts.push(`- ${transformText(item)}`);
                }
                parts.push('');
            }

            if (section.inlineCta) {
                parts.push(`> 🎯 **${section.inlineCta.title}**\n> ${transformText(section.inlineCta.description)}\n> [${section.inlineCta.buttonText}](https://altrubiz.co.il/#contact)\n`);
            }
        }
    }

    // Render FAQs if present
    if (article.faqs && Array.isArray(article.faqs) && article.faqs.length > 0) {
        parts.push(`## שאלות נפוצות ותשובות מעשיות (FAQ)\n`);
        for (const faq of article.faqs) {
            parts.push(`### ש: ${transformText(faq.question)}\n**ת:** ${transformText(faq.answer)}\n`);
        }
    }

    // Append State B Machine Glossary if any State B concepts appeared
    if (stateBConceptsFound.size > 0) {
        parts.push(`## מושגים שמופיעים במאמר\n`);
        for (const concept of stateBConceptsFound.values()) {
            parts.push(`- **${concept.term}** — ${concept.canonicalDefinition}`);
        }
        parts.push('');
    }

    const canonicalUrl = article.canonicalUrl || `https://altrubiz.co.il${article.publicPath}`;
    parts.push(`---\n*לצפייה בגרסה המקורית של המאמר: [${canonicalUrl}](${canonicalUrl})*`);
    return parts.join('\n');
}

let createdCount = 0;
let updatedCount = 0;
let upToDateCount = 0;

for (const article of articles) {
    const cleanPublicPath = article.publicPath.replace(/^\//, '');
    const mdPath = path.join(PUBLIC_DIR, `${cleanPublicPath}.md`);

    const generatedContent = buildMarkdownFromArticle(article);

    if (!fs.existsSync(mdPath)) {
        fs.writeFileSync(mdPath, generatedContent, 'utf8');
        console.log(`\x1b[32m✔ [NEW] Created public machine mirror:\x1b[0m public/${cleanPublicPath}.md`);
        createdCount++;
    } else {
        const existingContent = fs.readFileSync(mdPath, 'utf8');
        if (existingContent.trim() !== generatedContent.trim()) {
            fs.writeFileSync(mdPath, generatedContent, 'utf8');
            console.log(`\x1b[33m⚡ [UPDATED] Synced machine body & metadata:\x1b[0m public/${cleanPublicPath}.md`);
            updatedCount++;
        } else {
            upToDateCount++;
        }
    }
}

// Clean up legacy files from public/articles/ if present
if (fs.existsSync(PUBLIC_ARTICLES_LEGACY_DIR)) {
    const legacyFiles = fs.readdirSync(PUBLIC_ARTICLES_LEGACY_DIR);
    for (const f of legacyFiles) {
        if (f.endsWith('.md')) {
            fs.unlinkSync(path.join(PUBLIC_ARTICLES_LEGACY_DIR, f));
        }
    }
    try {
        fs.rmdirSync(PUBLIC_ARTICLES_LEGACY_DIR);
        console.log('✔ Cleaned up legacy public/articles/ directory.');
    } catch (e) {
        // Ignored if directory has other files
    }
}

console.log(`\n\x1b[32m✔ Public machine mirror sync complete: ${createdCount} created, ${updatedCount} updated, ${upToDateCount} up to date.\x1b[0m\n`);
