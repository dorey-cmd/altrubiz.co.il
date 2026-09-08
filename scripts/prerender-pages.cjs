#!/usr/bin/env node

/**
 * AltruBiz Static HTML Prerenderer for Social Sharing Previews
 * 
 * Generates route-specific HTML files in dist/ so that social scrapers
 * (Facebook, WhatsApp, LinkedIn, Twitter/X, Telegram, Slack) get the exact
 * article title, smart summary, and 3D clay diorama cover image without needing
 * client-side JavaScript execution.
 */

const fs = require('fs');
const path = require('path');
const { getArticles } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const BASE_DOMAIN = 'https://altrubiz.co.il';

if (!fs.existsSync(DIST_DIR)) {
    console.log('Dist directory does not exist yet. Run vite build first.');
    process.exit(0);
}

const templatePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found!');
    process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, 'utf8');
const articles = getArticles();

console.log('\n========================================================');
console.log('   AltruBiz Social Share & OpenGraph HTML Prerenderer   ');
console.log('========================================================\n');

function escapeAttr(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

let generatedCount = 0;

for (const article of articles) {
    const slug = article.slug;
    const articlePath = `/articles/${slug}`;
    const canonicalUrl = `${BASE_DOMAIN}${articlePath}`;
    const title = `${article.title} | AltruBiz CRM`;
    const description = article.description || '';
    const smartSummary = article.keyTakeaway || article.heroSummary || article.description || '';
    
    // Ensure absolute image URL
    const coverSrc = article.coverImage?.src || '/images/articles/read-the-room-robot.jpg';
    const absoluteImage = coverSrc.startsWith('http') ? coverSrc : `${BASE_DOMAIN}${coverSrc}`;
    const imageAlt = article.coverImage?.alt || article.title;

    let html = baseTemplate;

    // 1. Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`);

    // 2. Replace Canonical
    html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${canonicalUrl}"`);

    // 3. Replace Meta Description
    html = html.replace(/<meta name="description"[\s\S]*?content="[^"]*"/i, `<meta name="description" content="${escapeAttr(description)}"`);

    // 4. Replace OpenGraph Tags
    html = html.replace(/<meta property="og:type" content="[^"]*"/i, `<meta property="og:type" content="article"`);
    html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonicalUrl}"`);
    html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${escapeAttr(title)}"`);
    html = html.replace(/<meta property="og:description"[\s\S]*?content="[^"]*"/i, `<meta property="og:description" content="${escapeAttr(smartSummary)}"`);
    html = html.replace(/<meta property="og:image"[\s\S]*?content="[^"]*"/i, `<meta property="og:image" content="${absoluteImage}" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="${escapeAttr(imageAlt)}"`);

    // 5. Replace Twitter Tags
    html = html.replace(/<meta property="twitter:url" content="[^"]*"/i, `<meta property="twitter:url" content="${canonicalUrl}"`);
    html = html.replace(/<meta property="twitter:title" content="[^"]*"/i, `<meta property="twitter:title" content="${escapeAttr(title)}"`);
    html = html.replace(/<meta property="twitter:description" content="[^"]*"/i, `<meta property="twitter:description" content="${escapeAttr(smartSummary)}"`);
    html = html.replace(/<meta property="twitter:image"[\s\S]*?content="[^"]*"/i, `<meta property="twitter:image" content="${absoluteImage}" />\n  <meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}"`);

    // 6. Inject Article Pre-rendered Semantic Body for Non-JS scrapers & LLMs
    const articleMainContent = `
    <main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; line-height: 1.7;">
      <nav aria-label="פירורי לחם" style="font-size: 14px; margin-bottom: 20px;">
        <a href="/">דף הבית</a> &gt; <a href="/articles">מרכז ידע</a> &gt; <span>${escapeAttr(article.title)}</span>
      </nav>
      <article>
        <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">${escapeAttr(article.title)}</h1>
        ${article.subtitle ? `<p style="font-size: 18px; color: #475569; margin-bottom: 20px;"><strong>${escapeAttr(article.subtitle)}</strong></p>` : ''}
        <figure style="margin: 24px 0;">
          <img src="${absoluteImage}" alt="${escapeAttr(imageAlt)}" style="max-width: 100%; height: auto; border-radius: 16px; border: 1px solid #e2e8f0;" />
        </figure>
        <div style="background: #f8fafc; border-right: 4px solid #0284c7; padding: 16px 20px; border-radius: 12px; margin: 24px 0;">
          <h2 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0;">תמצית המדריך</h2>
          <p style="font-size: 16px; margin: 0; color: #0f172a;">${escapeAttr(smartSummary)}</p>
        </div>
        ${article.heroSummary ? `<p style="font-size: 17px; margin-bottom: 24px;">${escapeAttr(article.heroSummary)}</p>` : ''}
        <p style="font-size: 15px; color: #64748b;">
          מחבר: ${escapeAttr(article.author.name)} | תאריך פרסום: ${escapeAttr(article.datePublished)} | זמן קריאה: ${escapeAttr(article.readTime)}
        </p>
      </article>
    </main>`;

    html = html.replace(/<main style="max-width: 900px; margin: 0 auto; padding: 40px 20px; line-height: 1.7;">[\s\S]*?<\/main>/i, articleMainContent);

    // Write out to dist/articles/${slug}/index.html and dist/articles/${slug}.html
    const articleDir = path.join(DIST_DIR, 'articles', slug);
    if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
    }
    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, 'articles', `${slug}.html`), html, 'utf8');

    console.log(`  ✔ Prerendered social preview HTML: /articles/${slug}`);
    generatedCount++;
}

console.log(`\n✔ Successfully generated ${generatedCount} static HTML social preview pages in dist/\n`);
