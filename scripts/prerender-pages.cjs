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
const { getIndexableArticles, getAllHubs, getParentHubForArticle } = require('./routes-loader.cjs');

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
const articles = getIndexableArticles();

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

function buildFoundationHeader() {
    return `    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <a href="/" class="flex-shrink-0 flex items-center gap-2">
            <img
              src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
              alt="לוגו AltruBiz CRM - מערכת לניהול לקוחות, אוטומציה עסקית וחיבור WhatsApp חכם"
              class="h-12 md:h-16 w-auto object-contain"
              width="180"
              height="60"
            />
          </a>
          <nav aria-label="ניווט ראשי" class="hidden md:flex items-center gap-8 mx-auto">
            <a href="/#how-it-works" class="text-gray-600 hover:text-primary transition-colors text-sm font-medium">איך זה עובד</a>
            <a href="/#why-altrubiz" class="text-gray-600 hover:text-primary transition-colors text-sm font-medium">למה אלטרוביז?</a>
            <a href="/lost-leads" class="text-gray-600 hover:text-primary transition-colors text-sm font-medium">אבחון בריחת לידים</a>
            <a href="/knowledge" class="inline-flex items-center gap-1.5 text-primary bg-blue-50/80 hover:bg-blue-100/80 px-3.5 py-1 rounded-full transition-colors text-sm font-semibold border border-blue-200/60">מאמרים וידע</a>
          </nav>
          <div class="hidden md:flex items-center gap-3">
            <a href="/#contact" class="inline-flex items-center justify-center font-bold text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md">קביעת פגישה</a>
            <a href="https://app.altrubiz.com/" class="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2">התחברות</a>
          </div>
        </div>
      </div>
    </header>`;
}

function replaceRootContent(html, content) {
    const rootStart = html.indexOf('<div id="root">');
    const bodyEnd = html.lastIndexOf('</body>');
    if (rootStart !== -1 && bodyEnd !== -1) {
        const rootClose = html.lastIndexOf('</div>', bodyEnd);
        if (rootClose > rootStart) {
            return html.substring(0, rootStart) +
                `<div id="root">\n${content}\n  </div>` +
                html.substring(rootClose + 6);
        }
    }
    return html;
}

const HUB_VISUAL_ASSETS = {
    'sales-pipeline': {
        imageSrc: '/images/articles/visual-pipeline-deals.jpg',
        imageAlt: 'פייפליין מכירות חזותי לניהול שלבי עסקאות והזדמנויות ב-CRM',
        caption: 'פייפליין מכירות חזותי מאפשר לראות בכל רגע נתון איפה כל לקוח עומד, איפה עסקאות נתקעות, ומה הצעד הבא.'
    },
    'business-memory': {
        imageSrc: '/images/articles/thailand-vacation-business-memory.jpg',
        imageAlt: 'ניהול עסק מכל מקום ללא תלות בזיכרון של עובדים יחידים',
        caption: 'כשהזיכרון הארגוני שמור במערכת ולא בראש של עובדים או בוואטסאפ פרטי, העסק ממשיך לפעול גם בחופשות ובחילופי צוות.'
    },
    'repetitive-manual-work': {
        imageSrc: '/images/articles/conveyor-lead-automation.jpg',
        imageAlt: 'אוטומציה של משימות ידניות שחוזרות על עצמן וחיסכון בזמן ניהולי',
        caption: 'החלפת משימות העתקה, תיאומי יומן ותזכורות ידניות באוטומציות חכמות שחוסכות עשרות שעות ניהול בחודש.'
    },
    'lost-leads': {
        imageSrc: '/images/articles/lead-waiting-doorbell.jpg',
        imageAlt: 'מענה מהיר ללידים שמתעניינים בעסק ב-5 הדקות הראשונות',
        caption: '78% מהעסקאות נסגרות מול העסק הראשון שחוזר לליד ומספק מענה מקצועי. מענה תוך 5 דקות מגדיל את סיכויי הסגירה פי 9.'
    },
    'whatsapp-in-crm': {
        imageSrc: '/images/articles/customer-single-thread-omnichannel.jpg',
        imageAlt: 'תיבת הודעות וואטסאפ ואינבוקס לקוחות מרכזי אחד ב-CRM',
        caption: 'איחוד כל שיחות הוואטסאפ של העסק לתיבת הודעות צוותית אחת מונע שיחות אבודות ומאפשר עבודה משותפת חלקה.'
    }
};

let generatedCount = 0;

for (const article of articles) {
    const slug = article.slug;
    const articlePath = article.publicPath;
    const publicPathRel = article.publicPath.replace(/^\//, '');
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

    // 6. Inject Article Pre-rendered Semantic Foundation Body
    const parentHub = getParentHubForArticle ? getParentHubForArticle(slug) : undefined;
    const articleRootHtml = `
${buildFoundationHeader()}
    <article class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans relative" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav aria-label="פירורי לחם" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <a href="/" class="hover:text-primary transition-colors">דף הבית</a>
          <span>&gt;</span>
          <a href="/knowledge" class="hover:text-primary transition-colors">מרכז ידע ומאמרים</a>
          ${parentHub ? `<span>&gt;</span>\n          <a href="${parentHub.url}" class="hover:text-primary transition-colors">${escapeAttr(parentHub.title)}</a>` : ''}
          <span>&gt;</span>
          <span class="text-slate-900 font-medium">${escapeAttr(article.title)}</span>
        </nav>
      </div>

      <header class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div class="flex flex-wrap items-center gap-2.5 mb-4">
          <span class="px-3.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-primary border border-blue-200">
            ${escapeAttr(article.category)}
          </span>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            זמן קריאה: ${escapeAttr(article.readTime)}
          </span>
          <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            תאריך: ${escapeAttr(article.datePublished)}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] mb-4">
          ${escapeAttr(article.title)}
        </h1>

        ${parentHub ? `
        <div class="mb-6">
          <a href="${parentHub.url}" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-primary text-xs sm:text-sm font-semibold border border-blue-200/80 transition-colors">
            <span>מוקד ידע מקושר:</span>
            <span class="underline decoration-primary/40 underline-offset-2">${escapeAttr(parentHub.title)}</span>
          </a>
        </div>` : ''}

        ${article.subtitle ? `<p class="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">${escapeAttr(article.subtitle)}</p>` : ''}

        <div class="flex items-center gap-3 pt-6 border-t border-b border-gray-200 py-4 bg-white/60 backdrop-blur-sm rounded-2xl px-6 shadow-sm mb-8">
          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
            AB
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm sm:text-base">${escapeAttr(article.author.name)}</div>
            <div class="text-xs text-slate-500">${escapeAttr(article.author.role)}</div>
          </div>
        </div>

        <figure class="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white mb-8">
          <img src="${absoluteImage}" alt="${escapeAttr(imageAlt)}" class="w-full aspect-video sm:aspect-[21/9] object-cover" width="1200" height="630" />
        </figure>

        <div class="bg-cyan-50/50 border-r-4 border-r-cyan-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <h2 class="text-base font-bold text-cyan-950 mb-2">תמצית המדריך</h2>
          <p class="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed">${escapeAttr(smartSummary)}</p>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
        ${(article.sections || []).map(section => `
        <section id="${escapeAttr(section.id)}" class="prose prose-slate max-w-none">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">${escapeAttr(section.title)}</h2>
          ${section.subtitle ? `<h3 class="text-lg text-slate-600 font-medium mb-4">${escapeAttr(section.subtitle)}</h3>` : ''}
          ${(section.content || []).map(paragraph => `<p class="text-slate-700 leading-relaxed text-base sm:text-lg mb-4">${escapeAttr(paragraph.replace(/\\[(.*?)\\]\\((.*?)\\)/g, '$1'))}</p>`).join('\n          ')}
        </section>`).join('\n        ')}
      </main>
    </article>`;

    html = replaceRootContent(html, articleRootHtml);

    // Write out to dist/articles/${slug}/index.html and dist/articles/${slug}.html
    const articleDir = path.join(DIST_DIR, publicPathRel);
    if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
    }
    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, `${publicPathRel}.html`), html, 'utf8');

    console.log(`  ✔ Prerendered social preview HTML: ${article.publicPath}`);
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
        path: 'knowledge',
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

    const staticH1 = sp.path === 'about' 
        ? 'אודות AltruBiz (אלטרוביז)' 
        : 'מדריכים, תובנות ומאמרים מקצועיים';

    const staticRootHtml = sp.path === 'about' ? `
${buildFoundationHeader()}
    <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav aria-label="פירורי לחם" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <a href="/" class="hover:text-primary transition-colors">דף הבית</a>
          <span>&gt;</span>
          <span class="text-slate-900 font-medium">אודות AltruBiz</span>
        </nav>
      </div>
      <header class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-4 border border-blue-100">
          <span>פרופיל חברה ומידע ארגוני</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
          אודות AltruBiz (אלטרוביז)
        </h1>
        <p class="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
          ${escapeAttr(sp.description)}
        </p>
      </header>
    </div>` : `
${buildFoundationHeader()}
    <div class="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
        <div class="flex justify-center mb-6">
          <nav aria-label="פירורי לחם" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <a href="/" class="hover:text-primary transition-colors">דף הבית</a>
            <span>&gt;</span>
            <span class="text-slate-900 font-medium">מרכז ידע ומאמרים</span>
          </nav>
        </div>
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-secondary text-xs sm:text-sm font-bold mb-4 border border-cyan-100 shadow-xs">
          <span>מדריכים, תובנות ואסטרטגיה</span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
          מדריכים, תובנות ומאמרים מקצועיים
        </h1>
        <p class="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
          ${escapeAttr(sp.description)}
        </p>
      </div>
    </div>`;

    html = replaceRootContent(html, staticRootHtml);

    const pageDir = path.join(DIST_DIR, sp.path);
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }
    fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, `${sp.path}.html`), html, 'utf8');
    console.log(`  ✔ Prerendered hub social preview HTML: /${sp.path}`);
    generatedCount++;
}

// 8. Prerender Promoted Knowledge Hubs (/topics/<slug>)
const hubs = getAllHubs ? getAllHubs() : [];
for (const hub of hubs) {
    let html = baseTemplate;
    const hubSlug = hub.slug;
    const canonical = `${BASE_DOMAIN}${hub.url}`;
    const hubRel = hub.url.replace(/^\//, '');
    const hubTitle = `${hub.title} | AltruBiz CRM`;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(hubTitle)}</title>`);
    html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeAttr(hub.description)}" />`);
    html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
    html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeAttr(hubTitle)}" />`);
    html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeAttr(hub.description)}" />`);
    html = html.replace(/<meta name="twitter:url"[^>]*>/i, `<meta name="twitter:url" content="${canonical}" />`);
    html = html.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(hubTitle)}" />`);
    html = html.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeAttr(hub.description)}" />`);

    const visualMeta = HUB_VISUAL_ASSETS[hubSlug];
    const problemDef = hub.hubData?.problemDefinition || hub.description;
    const hubTypeLabel = hub.nodeType === 'pain_hub' ? 'מדריך אבחון ומענה מקיף' : 'מדריך יישום וניהול תקשורת';

    // Inject Hub Pre-rendered Semantic Foundation Body
    const hubRootHtml = `
${buildFoundationHeader()}
    <article class="min-h-screen bg-slate-50/70 pt-24 pb-20 selection:bg-cyan-100" dir="rtl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav aria-label="פירורי לחם" class="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <a href="/" class="hover:text-primary transition-colors">דף הבית</a>
          <span>&gt;</span>
          <a href="/knowledge" class="hover:text-primary transition-colors">מרכז ידע</a>
          <span>&gt;</span>
          <span class="text-slate-900 font-medium">${escapeAttr(hub.title)}</span>
        </nav>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto lg:mx-0 w-full">
          <header class="mb-10">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-200 mb-4">
              <span>${hubTypeLabel}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4">
              ${escapeAttr(hub.title)}
            </h1>
            ${hub.subtitle ? `<p class="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-6">${escapeAttr(hub.subtitle)}</p>` : ''}
            ${problemDef ? `
            <div class="border-r-4 border-primary pr-5 py-2 my-6 bg-transparent">
              <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">הגדרת האתגר והשפעתו על העסק</h2>
              <p class="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">${escapeAttr(problemDef)}</p>
            </div>` : ''}
            ${visualMeta ? `
            <figure class="mt-8 rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <img src="${visualMeta.imageSrc}" alt="${escapeAttr(visualMeta.imageAlt)}" class="w-full aspect-[21/10] sm:aspect-[2.2/1] object-cover" width="1200" height="545" />
              ${visualMeta.caption ? `<figcaption class="p-3.5 text-center text-xs text-slate-600 bg-slate-50 border-t border-slate-100 font-medium">💡 ${escapeAttr(visualMeta.caption)}</figcaption>` : ''}
            </figure>` : ''}
          </header>
        </div>
      </div>
    </article>`;

    html = replaceRootContent(html, hubRootHtml);

    const hubDir = path.join(DIST_DIR, hubRel);
    if (!fs.existsSync(hubDir)) {
        fs.mkdirSync(hubDir, { recursive: true });
    }
    fs.writeFileSync(path.join(hubDir, 'index.html'), html, 'utf8');
    fs.writeFileSync(path.join(DIST_DIR, `${hubRel}.html`), html, 'utf8');
    console.log(`  ✔ Prerendered knowledge hub social preview HTML: ${hub.url}`);
    generatedCount++;
}

console.log(`\n✔ Successfully generated ${generatedCount} static HTML social preview pages in dist/\n`);

