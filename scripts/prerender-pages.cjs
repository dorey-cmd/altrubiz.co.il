#!/usr/bin/env node

/**
 * AltruBiz Static HTML Prerenderer for Social Sharing Previews
 * 
 * Generates route-specific HTML files in dist/ so that all social scrapers
 * (Facebook, WhatsApp, LinkedIn, Twitter/X, Instagram, Threads, TikTok, Telegram, Slack, Google SMB)
 * get instant, razor-sharp 1200x630 previews with complete OpenGraph and Twitter Card metadata.
 */

const fs = require('fs');
const path = require('path');
const { getArticles } = require('./routes-loader.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
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
    
    // Check for dedicated 1200x630 OG image, fallback to coverImage
    const ogFileRel = `/images/articles/og/${slug}.jpg`;
    const hasDedicatedOg = fs.existsSync(path.join(PUBLIC_DIR, 'images', 'articles', 'og', `${slug}.jpg`));
    const coverRel = hasDedicatedOg ? ogFileRel : (article.coverImage?.src || '/images/og-altrubiz-main.jpg');
    const absoluteImage = coverRel.startsWith('http') ? coverRel : `${BASE_DOMAIN}${coverRel}`;
    const imageAlt = article.coverImage?.alt || article.title;

    let html = baseTemplate;

    // 1. Ensure RDFa Prefix on HTML tag
    html = html.replace(/<html[^>]*>/i, `<html lang="he" dir="rtl" prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# article: https://ogp.me/ns/article#">`);

    // 2. Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`);

    // 3. Replace Canonical & image_src
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    if (html.includes('rel="image_src"')) {
        html = html.replace(/<link rel="image_src"[^>]*>/i, `<link rel="image_src" href="${absoluteImage}" />`);
    } else {
        html = html.replace('</head>', `  <link rel="image_src" href="${absoluteImage}" />\n</head>`);
    }

    // 4. Replace Meta Description
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttr(description)}" />`);

    // 5. Build comprehensive OpenGraph Block
    const tagsMeta = article.tags && article.tags.length > 0 
        ? article.tags.map(t => `  <meta property="article:tag" content="${escapeAttr(t)}" />`).join('\n') + '\n'
        : '';

    const ogBlock = `<!-- Open Graph / Facebook / WhatsApp / LinkedIn / Instagram / Threads / TikTok -->
  <meta property="og:site_name" content="AltruBiz CRM" />
  <meta property="og:locale" content="he_IL" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(smartSummary)}" />
  <meta property="og:image" content="${absoluteImage}" />
  <meta property="og:image:secure_url" content="${absoluteImage}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(imageAlt)}" />
  <meta property="article:published_time" content="${article.datePublished}" />
  <meta property="article:modified_time" content="${article.dateModified}" />
  <meta property="article:author" content="${escapeAttr(article.author.name)}" />
  <meta property="article:section" content="${escapeAttr(article.category)}" />
${tagsMeta}
  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@AltruBiz" />
  <meta name="twitter:creator" content="@AltruBiz" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeAttr(title)}" />
  <meta name="twitter:description" content="${escapeAttr(smartSummary)}" />
  <meta name="twitter:image" content="${absoluteImage}" />
  <meta name="twitter:image:alt" content="${escapeAttr(imageAlt)}" />`;

    // Replace the OG & Twitter blocks from baseTemplate
    const ogRegex = /<!-- Open Graph[\s\S]*?<!-- Base Entity Structured Data/i;
    if (ogRegex.test(html)) {
        html = html.replace(ogRegex, `${ogBlock}\n\n  <!-- Base Entity Structured Data`);
    }

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
          <img src="${absoluteImage}" alt="${escapeAttr(imageAlt)}" width="1200" height="630" style="max-width: 100%; height: auto; border-radius: 16px; border: 1px solid #e2e8f0;" />
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

// 7. Prerender Static Hub Pages (/about and /articles)
const staticPages = [
    {
        path: 'about',
        title: 'אודות AltruBiz (אלטרוביז) | CRM, אוטומציות ובוטים מבוססי AI',
        description: 'היכרות עם AltruBiz: חברת תוכנה ישראלית המפתחת מערכת CRM מתקדמת, אינטגרציות WhatsApp Business ובוטים חכמים לקביעת פגישות בעברית מלאה.',
        image: `${BASE_DOMAIN}/images/og-altrubiz-main.jpg`
    },
    {
        path: 'articles',
        title: 'מרכז ידע, מדריכים ומאמרים מקצועיים | AltruBiz CRM',
        description: 'מאגר המאמרים והמדריכים של AltruBiz: הנחיות לדיוור WhatsApp, מדיניות פלטפורמות, אוטומציות עסקיות, מניעת No-Show וניהול לידים.',
        image: `${BASE_DOMAIN}/images/og-altrubiz-main.jpg`
    }
];

for (const sp of staticPages) {
    let html = baseTemplate;
    const canonical = `${BASE_DOMAIN}/${sp.path}`;
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(sp.title)}</title>`);
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttr(sp.description)}" />`);
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
    html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeAttr(sp.title)}" />`);
    html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeAttr(sp.description)}" />`);
    html = html.replace(/<meta name="twitter:url"[^>]*>/i, `<meta name="twitter:url" content="${canonical}" />`);
    html = html.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(sp.title)}" />`);
    html = html.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(sp.description)}" />`);

    const pageDir = path.join(DIST_DIR, sp.path);
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }
    fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, `${sp.path}.html`), html, 'utf8');
    console.log(`  ✔ Prerendered hub social preview HTML: /${sp.path}`);
    generatedCount++;
}

console.log(`\n✔ Successfully generated ${generatedCount} static HTML social preview pages in dist/\n`);
