---
description: Permanent GEO / AEO / LLM-Readiness standards and architectural requirements for AltruBiz
always_on: true
---

# AltruBiz Permanent GEO / AEO / LLM-Readiness Architectural Standards

> **PERMANENT ARCHITECTURAL POLICY**: Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), and traditional Search Engine Optimization (SEO) are permanent architectural requirements for all public, indexable pages on `altrubiz.co.il`.
>
> This is **NOT** a one-time audit or an afterthought. Every new public page, article, landing page, service page, product page, resource, guide, or indexable content added to this website must automatically comply with these standards.

---

## 1. Core Principles

1. **Human-First, Machine-Clear**: Optimize for genuine human utility, clarity, trust, and business conversion. Never keyword-stuff, generate thin AI spam, or degrade user experience for search algorithms.
2. **Deterministic Entity Graph & Stable `@id` Identifiers**:
   - Organization: `AltruBiz` (אלטרוביז) | `@id: "https://altrubiz.co.il/#organization"`
   - WebSite: `AltruBiz CRM` | `@id: "https://altrubiz.co.il/#website"`
   - SoftwareApplication: `AltruBiz CRM` | `@id: "https://altrubiz.co.il/#software"`
   - Always link pages, authors, articles, and services back to these canonical `@id` identifiers.
3. **Machine-Accessible HTML (No-JS Crawlability)**:
   - Important public content must be accessible as meaningful, semantic HTML without requiring client-side JavaScript execution.
   - AI search agents (Perplexity, ChatGPT Search, Claude, Gemini, Googlebot) must receive clear semantic structure on raw HTTP GET.
4. **Answerability & Citation-Worthy Structure**:
   - Structure key insights so that answer engines can easily extract factual, self-contained, attributable answers.
   - Use direct answer passages, process steps, comparison tables, and highlighted takeaways (`<AnswerBox />`).

---

## 2. Mandatory Architectural Requirements Checklist

Every new or materially modified public/indexable page must satisfy the following 26 technical and content requirements:

1. **Crawlability**: Accessible without infinite redirect loops, blocking scripts, or crawler barriers.
2. **Indexability**: Permitted by robots rules (no accidental `noindex` or `nofollow` on public content).
3. **Correct HTTP Behavior**: Responds with valid status codes (200 OK for live content, 404 for missing).
4. **Correct Canonical URL**: Absolute HTTPS URL pointing to `https://altrubiz.co.il/<path>`, strictly without query parameters, trailing fragments, or session IDs.
5. **Sitemap Inclusion**: Automatically included in `public/sitemap.xml` with appropriate `<lastmod>`, `<changefreq>`, and `<priority>`. Strictly no `#` URL fragments.
6. **Robots Directives**: Compliant with `public/robots.txt`, explicitly permitting AI search bots (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`, `Googlebot`, `Bingbot`).
7. **Server-Rendered / Machine-Accessible HTML**: Semantic HTML fallback pre-rendered in `index.html` or served directly so non-JS crawlers receive complete content.
8. **Unique and Accurate Title & Description**:
   - Title: Unique, descriptive, under 70 characters, ending with `| AltruBiz CRM` or `| AltruBiz`.
   - Description: Compelling summary, 50–160 characters, answering search intent.
9. **Correct Heading Hierarchy**: Exactly one `<h1>` per page. Logical nesting of `<h2>` (sections) and `<h3>` (subsections). Never skip levels.
10. **Clear Page Subject and Search Intent**: Immediate opening paragraph identifying the topic, target audience, and solution.
11. **Clear Entity Relationships**: Explicitly connected to the AltruBiz Organization entity graph.
12. **Appropriate Schema.org Structured Data**: Context-appropriate JSON-LD graph matching visible page content.
13. **Consistent Entity IDs**: All Schema entities must use stable URI identifiers (`#organization`, `#website`, `#software`, `#article`, `#breadcrumb`).
14. **Breadcrumbs**: Hierarchical visual breadcrumbs on page and corresponding Schema `BreadcrumbList`.
15. **Contextual Internal Links**: Descriptive anchor text linking back to related articles, home, or services (no vague "click here").
16. **Author Attribution**: Clearly identified author/publisher strictly at company/team entity level (`צוות AltruBiz`, `אנחנו`, `נציג של אלטרוביז`, `AltruBiz`, linked to Organization `#organization`). Never use individual personal names (strictly no `דורי` / Dori).
17. **datePublished & dateModified**: Explicit ISO 8601 publication and modification timestamps on all editorial and article pages.
18. **Clear Factual Statements**: Direct, unambiguous declarative statements suitable for quote and synthesis.
19. **Extractable Answer Passages**: Self-contained answers to core questions positioned under clear headings.
20. **Useful Original Information**: Authentic operational experience, original analysis, and practical workflows that add net-new web value.
21. **Citation-Worthy Structure**: Structured lists, bullet points, callout boxes, and tables that search engines can easily cite.
22. **Source/Reference Attribution**: Links to official external authorities where relevant (e.g., Meta WhatsApp Business Messaging Policy, official documentation).
23. **Accessibility**: RTL support (`dir="rtl"`, `lang="he"`), semantic HTML5 tags, high color contrast, accessible buttons, and ARIA labels.
24. **Mobile Compatibility**: Fully responsive layout across all breakpoints (mobile, tablet, desktop).
25. **Page Performance**: Fast load times, lightweight assets, lazy-loaded offscreen media.
26. **Analytics & Conversion Integrity**: Preserve conversion CTAs centered on meeting scheduling to see how it can work in the business ("קביעת פגישה למטרת איך זה יכול לעבוד אצלכם בעסק"). When off-homepage, always trigger the styled popup `ContactModal` without disrupting reader context. Support direct WhatsApp inquiry to `צוות AltruBiz`.

---

## 3. Semantic Schema.org Rules (Context-Appropriate, Not One-Size-Fits-All)

Schema markup **MUST describe the actual visible content of the page**. Do not blindly inject irrelevant schemas:

| Page Type | Required Schemas | Forbidden / Inappropriate Schemas |
| :--- | :--- | :--- |
| **Homepage (`/`)** | `WebPage`, `Organization`, `WebSite`, `SoftwareApplication` (with `Offer` catalog), `FAQPage` (matching visible FAQs) | `Article`, `TechArticle`, `CollectionPage` |
| **About Page (`/about`)** | `AboutPage` with `mainEntity: {"@id": "https://altrubiz.co.il/#organization"}` | `Product`, `Offer`, `TechArticle` |
| **Knowledge Base (`/articles`)** | `CollectionPage`, `BreadcrumbList` | `Article`, `Product`, `SoftwareApplication` |
| **Guides & Articles (`/articles/:slug`)**| `TechArticle` / `Article` (with `author`, `publisher`, `datePublished`, `dateModified`, `headline`), `BreadcrumbList`, plus `FAQPage` **only if** visible FAQ section exists | `SoftwareApplication`, `Product`, `Offer` |
| **Private Offer / Landing (`/offer`)** | `WebPage`, `noindex: true` | `FAQPage` (unless visible), `Article`, public sitemap inclusion |

---

## 4. Reusable Site Architecture & Component Inheritance

All public pages inherit GEO/SEO functionality at the component and layout level:

- **Centralized Route Registry (`src/lib/routes.ts`)**:
  - Every route is defined with canonical URL, metadata, schemaType, sitemap priority, and breadcrumbs.
  - Articles from `src/data/articles.ts` are dynamically merged into the route registry automatically.
- **Declarative Head & Schema Manager (`src/components/common/SEOHead.tsx`)**:
  - Automatically injects document `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags, Twitter cards, markdown alternates, and the unified Schema.org JSON-LD graph.
- **Visual & Structural Breadcrumbs (`src/components/common/Breadcrumbs.tsx`)**:
  - Renders user-facing breadcrumb navigation and pairs with Schema `BreadcrumbList`.
- **Author Attribution Box (`src/components/common/AuthorBox.tsx`)**:
  - Standardized author profile, publish date, update date, and reading time.
- **Extractable Answer Passages (`src/components/common/AnswerBox.tsx`)**:
  - Standardized AEO answer highlights, definitions, and takeaways.
- **Automated Sitemap Generation (`scripts/generate-sitemap.cjs`)**:
  - Builds `public/sitemap.xml` directly from the route registry with zero manual XML editing.
- **Machine-Readable LLM Mirrors (`public/llms.txt`, `public/llms-full.txt`, `public/articles/*.md`)**:
  - Plaintext markdown companions for LLM discovery and web retrieval agents.

---

## 5. Three-Tier New Page Checklist

Whenever a new public or indexable page is created, verify all three tiers:

### Tier 1: AUTOMATIC (Enforced by Architecture & Layout Components)
- [x] **Canonical URL**: Dynamic, absolute HTTPS URL pointing to `https://altrubiz.co.il/...` (registered in `src/lib/routes.ts`).
- [x] **Entity Graph Injection**: Auto-generated Schema.org JSON-LD graph linking `@id` entities.
- [x] **Open Graph & Twitter Cards**: Auto-populated `og:title`, `og:description`, `og:url`, `og:type`, and image.
- [x] **Breadcrumbs**: Hierarchical visual breadcrumbs and Schema `BreadcrumbList`.
- [x] **RTL & Hebrew Language**: Document `lang="he"` and `dir="rtl"`.
- [x] **Permanent URL Scheme**: Canonical slugs remain fixed even if menus or taxonomy change.

### Tier 2: VALIDATED (Enforced by `npm run test:geo`)
- [ ] **HTTP & Status Check**: The route is registered and returns 200 OK.
- [ ] **Meta Title**: Unique, accurate, 20–70 characters, with brand suffix.
- [ ] **Meta Description**: Compelling, informative, 50–160 characters.
- [ ] **Heading Hierarchy**: Exactly one `<h1>` per page; logical `<h2>` and `<h3>` order.
- [ ] **Sitemap Inclusion**: Included in `public/sitemap.xml` with valid lastmod and priority (no `#` hashes).
- [ ] **Robots Directive**: Allowed by `robots.txt` (unless an internal/staging page explicitly marked `noindex`).
- [ ] **AI Crawlers Allowed**: Accessible to `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`, `Googlebot`, `Bingbot`.
- [ ] **Structured Data Validity**: Valid JSON-LD without syntax errors or missing required fields.
- [ ] **Article Metadata (if applicable)**: Contains `datePublished`, `dateModified`, `author`, and corresponding `.md` file in `public/articles/`.
- [ ] **Machine-Readable Support**: Updated in `public/llms.txt` if it represents a major topical resource.
- [ ] **Internal Links**: No broken internal links pointing to non-existent routes.

### Tier 3: EDITORIAL (Requires Human & Editorial Judgment)
- [ ] **Genuine Information Gain**: Does this page provide authentic, practical insights or original frameworks, rather than generic filler?
- [ ] **Factual Accuracy**: Are all claims verifiable? No fabricated credentials, statistics, reviews, or relationships.
- [ ] **Extractable Answer Passages**: Are there direct answers, step-by-step processes, tables, or callouts that make sense when cited independently?
- [ ] **Clear Attribution**: Is the author, organization, or source of the information clearly identified?
- [ ] **Topical Authority**: Does this page strengthen AltruBiz's genuine expertise in CRM, WhatsApp automation, or business operations?
- [ ] **Would this page actually be worth citing?**: If an LLM answers a user question using this page, does it provide unique value?

---

## 6. Continuous Validation & CI/CD Integration

To ensure no regression occurs, the project provides automated auditing scripts:

```bash
# Run full automated GEO / AEO / LLM-readiness validation
npm run test:geo

# Run full audit
npm run geo:audit

# Regenerate sitemap from route registry
npm run sitemap:generate
```

Any critical technical violation will **fail the audit with exit code 1** and block production builds.

---

## 7. Architectural Preservation Rule

Whenever the website architecture, UI framework, routing library, CMS, or build tooling changes in the future:
1. **Preserve all GEO / AEO requirements** intact.
2. **Never remove GEO validation scripts or bypass tests.**
3. **Keep `src/lib/routes.ts` and `src/components/common/SEOHead.tsx` updated with any route or schema additions.**
4. **Update this permanent rule (`.agents/rules/geo-llm-readiness.md`) whenever architectural migrations require new patterns.**
