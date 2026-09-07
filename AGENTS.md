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
- [`src/components/articles/ArticlePage.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/articles/ArticlePage.tsx): Dynamic article layout.

---

## 5. Verification Commands
- `npm run test:geo` or `npm test`: Run full GEO / AEO / SEO architectural test suite.
- `npm run articles:sync-md`: Synchronize LLM markdown mirrors.
- `npm run sitemap:generate`: Regenerate `public/sitemap.xml`.
- `npm run build`: Full build (runs prebuild checks + TypeScript compile + Vite production bundle).
