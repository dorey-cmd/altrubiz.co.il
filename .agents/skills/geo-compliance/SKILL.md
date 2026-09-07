---
name: geo-compliance
description: Step-by-step operational guide for implementing and verifying GEO, AEO, and SEO compliance for AltruBiz pages and articles.
---

# GEO / AEO / SEO Compliance Skill for AltruBiz

Use this skill whenever creating, modifying, or auditing public routes, articles, landing pages, or components on `altrubiz.co.il`.

---

## 1. When to Use This Skill
- Adding a new static page or landing page to the site.
- Adding or editing an article, guide, or tutorial.
- Auditing site crawlability, sitemap coverage, or LLM-readiness.
- Resolving prebuild or deployment audit failures.

---

## 2. Core Operational Workflows

### Workflow A: Adding a New Static Page
1. **Declare the Route**:
   Open `src/lib/routes.ts` and add an entry to `STATIC_ROUTES_REGISTRY`:
   ```typescript
   '/features': {
       path: '/features',
       title: 'יכולות ותכונות המערכת | AltruBiz CRM',
       description: 'גלו את היכולות המתקדמות של AltruBiz: חיבור לוואטסאפ, בוטים חכמים, ניהול לידים ואוטומציות.',
       canonicalUrl: 'https://altrubiz.co.il/features',
       schemaType: 'WebPage',
       inSitemap: true,
       sitemapPriority: 0.8,
       sitemapChangeFreq: 'monthly',
       breadcrumbs: [
           { name: 'דף הבית', path: '/' },
           { name: 'יכולות המערכת', path: '/features' }
       ]
   }
   ```
2. **Implement Page Component**:
   Ensure the page:
   - Contains exactly one `<h1>`.
   - Uses `<SEOHead routeConfig={routeConfig} />`.
   - Uses `<Breadcrumbs items={routeConfig.breadcrumbs} />`.
   - Sets `dir="rtl"` and Hebrew copy.
3. **Verify Compliance**:
   Run `npm run test:geo`.

---

### Workflow B: Adding a New Article
1. **Add Article to `src/data/articles.ts`**:
   Add an `Article` object to the `ARTICLES` array:
   ```typescript
   {
       slug: 'lead-management-automation-guide',
       title: 'מדריך לניהול לידים ואוטומציות חכמות בעסק',
       seoTitle: 'מדריך ניהול לידים ואוטומציות בעסק | AltruBiz CRM',
       description: 'איך לנהל לידים בצורה מסודרת, לקצר זמני מענה ולסגור יותר עסקאות באמצעות אוטומציה.',
       keywords: ['ניהול לידים', 'CRM לעסקים', 'אוטומציה שיווקית'],
       category: 'מדריכים וניהול',
       tags: ['לידים', 'אוטומציה', 'מכירות'],
       datePublished: '2025-03-01',
       dateModified: '2025-03-01',
       readTime: '5 דקות קריאה',
       author: {
           name: 'צוות AltruBiz',
           role: 'מומחי CRM ואוטומציה'
       },
       canonicalUrl: 'https://altrubiz.co.il/articles/lead-management-automation-guide',
       markdownUrl: '/articles/lead-management-automation-guide.md',
       heroSummary: 'תקציר ברור וקצר של נושא המאמר ומטרתו.',
       keyTakeaway: 'כלל מנחה תמציתי ומדויק שקל למנועי תשובות לצטט.',
       sections: [
           {
               id: 'introduction',
               title: 'מבוא וחשיבות ניהול הלידים',
               content: ['פסקה ראשונה...', 'פסקה שנייה...'],
               callout: {
                   type: 'info',
                   title: 'נקודה למחשבה',
                   text: 'טקסט הבהרה...'
               }
           }
       ],
       faqs: [
           {
               question: 'כמה זמן לוקח להטמיע אוטומציה לניהול לידים?',
               answer: 'במערכת AltruBiz ניתן להפעיל תרחישי מענה בסיסיים בתוך מספר דקות.'
           }
       ]
   }
   ```
2. **Synchronize Plaintext LLM Mirror**:
   Run:
   ```bash
   npm run articles:sync-md
   ```
   This generates `public/articles/${slug}.md` with YAML frontmatter, headings, key takeaways, and FAQs.
3. **Regenerate Sitemap**:
   Run:
   ```bash
   npm run sitemap:generate
   ```
4. **Audit and Build**:
   Run:
   ```bash
   npm run test:geo
   npm run build
   ```

---

## 3. Mandatory Rules & Common Pitfalls
- **No URL Fragment Hashes (#)** in canonical URLs or `sitemap.xml`.
- **Unique Metadata**: Every title and meta description must be unique across all routes.
- **Description Length**: Must be between 50 and 180 characters.
- **Author Attribution**: Every article must include author name and role.
- **Answer Engine Takeaways**: Every article must have a concise, quotable `keyTakeaway`.
- **Pre-deployment Rule**: Never bypass `npm run build` or push code when `npm run test:geo` fails.
