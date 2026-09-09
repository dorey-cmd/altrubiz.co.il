# AltruBiz Project Governance & Architectural Guidelines

Welcome to the **AltruBiz CRM** codebase (`altrubiz.co.il`).

---

## 1. Project Overview & Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Framer Motion
- **Primary Domain**: `https://altrubiz.co.il`
- **Primary Language & Direction**: Hebrew (`lang="he"`, `dir="rtl"`)

---

## 2. Mandatory Architectural Standard: GEO / AEO / LLM-Readiness
**Generative Engine Optimization (GEO)**, **Answer Engine Optimization (AEO)**, and **Search Engine Optimization (SEO)** are permanent, non-negotiable architectural requirements.

Any new page, article, or route created in this repository must automatically inherit and comply with the 26 mandatory standards documented in [`.agents/rules/geo-llm-readiness.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/geo-llm-readiness.md).


### Enforcement Pipeline:
- **Build Pre-requisite**: `npm run build` automatically triggers `npm run prebuild`, which:
  1. `npm run articles:sync-md`: Generates & syncs plaintext Markdown mirrors (`public/articles/${slug}.md`) for all articles.
  2. `npm run sitemap:generate`: Dynamically updates `public/sitemap.xml` directly from `src/lib/routes.ts`.
  3. `npm run test:geo`: Audits 40+ criteria across routes, canonicals, robots.txt, schema graph, headings, and authorship.
- **Strict Hard Gate**: If any test fails, the build halts immediately with exit code 1. **Zero violations are allowed to deploy.**

---

## 2.1 Mandatory Copywriting Standard: Unisex / Gender-Neutral Phrasing
All text, buttons, titles, calls to action, guides, and UI labels across the website must be written in a natural, gender-neutral (Unisex) style.
- **Strict prohibition**: Never use gender slashes (e.g. `קרא/י`, `הצטרף/י`, `לחץ/י`).
- **Natural Hebrew phrasing**: Use infinitives (`להתחיל עכשיו`, `לקריאת המאמר`), nominal forms (`השארת פרטים`, `השוואת תכונות`), impersonal expressions (`מה אפשר לעשות עכשיו?`), or collective phrasing (`ברוכים הבאים`, `דברו איתנו`).
- Full specification: [`.agents/rules/unisex-copy-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/unisex-copy-standard.md).

---

## 2.2 Mandatory Image Alt-Text Standard: Search-Intent & Business Context
All image `alt` attributes must describe what the image represents in the context of user search intent, business pain points, or CRM solutions.
- **Strict prohibition**: Never describe the artistic medium or styling (e.g. never write `פלסטלינה`, `איור תלת ממדי`, `דמות פלסטלינה`). The site is not about art mediums.
- **Correct phrasing**: Describe the business situation or CRM mechanism (e.g., `לקוח שמצלצל ולא עונים לו בטלפון ומענה לשיחות שלא נענו ב-CRM`, `מעבר מניהול לידים באקסל לפייפליין מכירות חזותי`).

---

## 2.3 Mandatory Brand Attribution Standard: Zero Personal Names (Strict "No Dori" Policy)
All copywriting, metadata, authorships, guides, WhatsApp templates, and customer-facing materials must attribute expertise and communication strictly to the company/brand or team.
- **Strict prohibition**: Never use the name `דורי` (or `Dori` / `בעלולי`) anywhere on the site, in articles, or in code. There is NO individual Dori attribution currently on the website.
- **Mandatory brand phrasing**: Always attribute to:
  - `צוות אלטרוביז` / `צוות AltruBiz` (e.g., in article author objects: `name: 'צוות AltruBiz'`, `role: 'מומחי מערכות CRM ואוטומציה עסקית'`)
  - `אנחנו`
  - `נציג של אלטרוביז` / `נציגי אלטרוביז`
  - `אלטרוביז` / `AltruBiz`
- **WhatsApp prefilled messages**: When crafting WhatsApp inquiry links, always address the team respectfully (e.g., `שלום צוות AltruBiz, קראתי את המאמר... ואשמח לבדוק איך זה יכול לעבוד אצלנו בעסק`).

---

## 2.4 Mandatory Call to Action (CTA) Standard: Meeting Scheduling & Lead Modal
The primary conversion goal of every article, guide, and informational page across the site is booking an introductory/fit meeting or leaving details:
- **Core CTA Theme**: **קביעת פגישה למטרת איך זה יכול לעבוד אצלכם בעסק** (or "בדיקת התאמה לעסק שלכם", "יצירת קשר והשארת פרטים").
- **Behavioral UX Rule (Off-Homepage vs. Homepage)**:
  - **When NOT on the homepage** (e.g. in articles, about page, or other subpages): clicking any contact or meeting CTA button must open the styled modal popup ([`ContactModal.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/ContactModal.tsx)), which embeds the official homepage lead capture form (`https://link.altrubiz.co.il/widget/form/QAHIbtkoD9k8JUIs8uKD`). This preserves reader flow and prevents disruptive page reloads or harsh redirects.
  - **When on the homepage**: clicking the CTA smoothly scrolls down to `#contact` (the in-page lead capture form section).
- **Secondary CTA**: Direct WhatsApp consultation (`"התייעצות מהירה בוואטסאפ"` with prefilled message to `צוות AltruBiz`).

---

## 3. Route & Page Creation Architecture (Single Source of Truth)

### Adding a Static Page:
1. Register the route configuration in [`src/lib/routes.ts`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/lib/routes.ts) inside `STATIC_ROUTES_REGISTRY`.
2. Provide:
   - `path`: URL path (e.g. `/features`)
   - `title`: Compelling title ending with `| AltruBiz CRM`
   - `description`: 50–160 char summary answering search intent
   - `canonicalUrl`: `https://altrubiz.co.il<path>` (no `#` or `?`)
   - `schemaType`: `'WebPage' | 'AboutPage' | 'CollectionPage'`
   - `inSitemap`: `true` (or `false` + `noindex: true` if private)
   - `breadcrumbs`: Array of `{ name, path }`
3. In the page component, render `<SEOHead routeConfig={routeConfig} />` and `<Breadcrumbs items={routeConfig.breadcrumbs} />`.

### Adding an Article / Guide:
1. Simply add an object to `ARTICLES` in [`src/data/articles.ts`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/data/articles.ts).
2. The article will **automatically**:
   - Be registered in `src/lib/routes.ts` via `buildArticleRouteConfig()`
   - Generate its plaintext mirror in `public/articles/${slug}.md` via `npm run articles:sync-md`
   - Be included in `public/sitemap.xml` via `npm run sitemap:generate`
   - Be rendered dynamically by `<ArticlePage />` with full heading hierarchy, callouts, and structured data
   - Inject context-appropriate `TechArticle` / `Article` schema and `BreadcrumbList` via `<SEOHead />`
   - Inject `FAQPage` schema if `article.faqs` are provided.

---

## 4. Key Reusable Components
- [`src/components/common/SEOHead.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/SEOHead.tsx): Declarative head management with Schema.org graph and canonical URL.
- [`src/components/common/Breadcrumbs.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/Breadcrumbs.tsx): Visual and semantic breadcrumb navigation.
- [`src/components/common/AuthorBox.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/AuthorBox.tsx): E-E-A-T standardized author card.
- [`src/components/common/AnswerBox.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/AnswerBox.tsx): Highlighted, self-contained answer passage for LLMs.
- [`src/components/common/ContactModal.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/ContactModal.tsx): Styled meeting scheduling & lead capture modal popup.
- [`src/components/articles/ArticlePage.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/articles/ArticlePage.tsx): Dynamic article layout.

---

## 5. Verification Commands
- `npm run test:geo` or `npm test`: Run full GEO / AEO / SEO architectural test suite.
- `npm run articles:sync-md`: Synchronize LLM markdown mirrors.
- `npm run sitemap:generate`: Regenerate `public/sitemap.xml`.
- `npm run build`: Full build (runs prebuild checks + TypeScript compile + Vite production bundle).
