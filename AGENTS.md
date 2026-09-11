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

## 2.3 Brand Attribution & Authorship Standard
AltruBiz balances corporate brand consistency with authentic human authority:
- **General System Knowledge**: All general system guides, technical documentation, UI labels, and automated notifications are attributed to `צוות אלטרוביז` / `צוות AltruBiz` or `אלטרוביז` / `AltruBiz`.
- **Personal Expertise & E-E-A-T**: Personal attribution (e.g. founder expertise, named consultants, specialist engineers, personal case studies, author credentials) is fully permitted and welcomed whenever contextually valuable to reinforce authenticity, professional authority, storytelling warmth, and search engine trust.

---

## 2.4 Call to Action (CTA) Architectural Formula
All CTAs across the site follow the permanent architectural model:
$$\text{Current Context} \rightarrow \text{Relevant Next Action} \rightarrow \text{Contextual Message} \rightarrow \text{Appropriate Mechanism} \rightarrow \text{Structured Attribution}$$
- **Shared Mechanism**: Centralized backend intake across all touchpoints.
- **Contextual Presentation**: Choosing the interface vehicle that best respects visitor momentum (e.g. styled modal popup such as [`ContactModal.tsx`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/components/common/ContactModal.tsx) to prevent page reloads during reading, in-page embedded forms, prefilled WhatsApp bridges, or dedicated booking pages).
- **Structured Attribution**: The permanent requirement that every conversion mechanism transmits complete contextual attribution (originating page, section, topic hub, and intent trigger) to the intake system.

---

## 2.5 Strategic CTA Presentation Library (Reusable Patterns)
Long articles and guides draw from a library of tested, non-repetitive presentation patterns chosen based on narrative relevance:
1. `variant: 'strip'` (Subtle inline strip / banner): Early conversational question via WhatsApp.
2. `variant: 'quote-share'` (Quote & Share Card): Middle milestone high-value quote with 1-click WhatsApp/link share.
3. `variant: 'text-link'` (Prominent editorial text link): Natural inline transition to a quick fit conversation.
4. `variant: 'pricing'` (Pricing trigger card): Transparent pricing exploration opening `PricingModal` without leaving the article.
5. `variant: 'box'` (Rich milestone box): Conversion card pairing meeting booking with secondary WhatsApp.
- **Flexibility**: There is no mandatory quota, forced sequence, or rigid section-spacing constraint. CTA density and type are governed by editorial flow and user experience. Full specification: [`.agents/rules/article-cta-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/article-cta-standard.md).

---

## 2.6 Mandatory Knowledge Topology & Content Architecture Standard
The website operates as a connected knowledge graph organized primarily around **Business Pains** (discovery layer) rather than tech features (solution layer).
- **Node Types**: Home Page → Pain Hubs (`/topics/<slug>`) → Sub-Pains / Real-World Manifestations → Articles (`/articles/<slug>`) → Micro Hubs → Product Nodes → Contextual CTAs.
- **Tag & Hub Promotion Rule**: Node Existence ≠ Public Page Existence. Qualitative Knowledge Maturity ≠ Publication Readiness ≠ Indexability. Qualitative maturity makes a node eligible as a candidate for a public destination; actual creation, publication, and indexability remain separate decisions. Public Page Eligibility = Qualitative Knowledge Maturity + Genuine Standalone User Value (strictly zero numerical quotas). A concept becomes a public indexable Hub only when accumulated knowledge provides sufficient conceptual depth, diagnostic usefulness, and standalone visitor value without filler.
- **Mandatory Ingestion Workflow**: Every new article must be classified across multi-dimensional taxonomy (`src/data/knowledgeGraph.ts`), establish bidirectional links (both outbound and inward links from existing pages), and update parent Hubs.
- Full specification: [`.agents/rules/knowledge-topology-architecture.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/knowledge-topology-architecture.md).

---

## 2.7 Mandatory Canonical URL Standard: Permanent Site-Wide Invariant
Every public indexable HTML page must always have exactly one explicit, absolute, HTTPS canonical URL pointing to the preferred public HTML destination.
- **Universal Scope**: Applies to all current and future page types (Home, Situation, Hub, Concept, Feature, Journey, Assessment, Article, Product, and localized representations).
- **Core Alignments**:
  - `og:url` must represent the canonical page URL (`twitter:url` is optional/not an invariant).
  - `mainEntityOfPage` and page structured data must match the canonical page.
  - Schema entity `@id` values must be stable and consistent with canonical architecture (e.g. `${canonicalUrl}#organization`, `${canonicalUrl}#article`, `${canonicalUrl}#faq`).
  - Sitemap `public/sitemap.xml` `<loc>` entries must contain the canonical public URL.
  - Internal links must point directly to canonical URLs; canonicals must never resolve through redirects.
  - URL migrations require permanent 301 redirects from old URLs to the new canonical URL; retired URLs must not remain competing indexable destinations.
  - Multilingual principle: Canonical is per published locale representation (e.g. `he` and `en` each have their own canonical URL, linked via `hreflang`).
- Full specification: [`.agents/rules/canonical-url-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/canonical-url-standard.md).

---

## 2.8 Mandatory AltruBiz Design Operating System (Design OS)
The visual language, brand consistency, and interactive experience of the website are governed by the **AltruBiz Design Operating System**.
- **Dual Operating System Mandate**:
  - **Knowledge OS** determines: *What exists, what it means, what it connects to, and what is relevant.*
  - **Design OS** determines: *How it looks, how it feels, how it moves, and how it communicates visually.*
  - Neither system overrides the other. Together they define the AltruBiz website experience.
- **Permanent Design Invariants**:
  1. *Canonical Brand Asset Integrity*: Official logo asset is the source of truth; never distorted, cropped, or rendered so small that the tagline becomes illegible.
  2. *Comfortable Editorial Reading Measure*: Reading width must preserve eye-tracking comfort (never stretched across full-width marketing viewports).
  3. *Typographic Hierarchy & RTL Contrast*: Strong separation between display/action type and high-legibility body type in Hebrew RTL.
  4. *The Living Interface Principle*: Subtly alive and responsive (ambient motion, tactile micro-feedback, StarDust) balanced with performance and reduced-motion accessibility.
  5. *Contextual Relevance in CTA Architecture*: Formula: $\text{Context} \rightarrow \text{Action} \rightarrow \text{Message} \rightarrow \text{Mechanism} \rightarrow \text{Attribution}$.
  6. *Context Preservation & Structured Attribution*: Lead mechanisms respect reader momentum and pass source/intent context.
  7. *Knowledge Graph ≠ Card Grid*: Semantic relationships are presented editorially, never as endless card grids.
- Full specification suite:
  - Master Governance: [`.agents/rules/design-operating-system.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md)
  - Brand DNA & Tokens: [`.agents/rules/design-brand-language.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-brand-language.md)
  - Experience & Living Interface: [`.agents/rules/design-experience.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-experience.md)
  - Responsive, RTL/LTR & Accessibility: [`.agents/rules/design-responsive-accessibility.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-responsive-accessibility.md)

---

## 2.9 Mandatory Contextual Semantic Linking & Progressive Knowledge UX Standard
The editorial text itself is an active part of the Knowledge Graph navigation.
- **Permanent Invariant**: **"LINK FOR UNDERSTANDING, NOT FOR OCCURRENCE."** A word or domain concept is never linked merely because it appears.
- **Progressive Knowledge UX**:
  1. *First Meaningful Encounter*: Contextual link to canonical Knowledge Node.
  2. *Repeated / Supporting Encounter*: Unobtrusive in-place short definition / tooltip.
  3. *Quick Clarification*: Lightweight accessible popover without navigation.
  4. *Deep Exploration*: Canonical Topic Hub or Concept destination.
  5. *Clean Prose*: Common words and immediate repetitions remain plain text.
- **Node Existence ≠ Page Existence**: Concepts exist semantically with canonical definitions in `src/data/knowledgeGraph.ts` before earning public pages. Public page eligibility requires qualitative knowledge maturity and genuine standalone user value (strictly zero numerical quotas). Never force unrelated concepts into mismatched Hubs.
- **No Numerical Quotas**: Internal linking density is governed solely by editorial relevance, never arbitrary counts.
- **Same-Window Invariant**: Internal links open in the same window (`target="_self"`) to preserve browser history and reading momentum.
- **Knowledge CTA Intent**: CTAs recognize knowledge-deepening invitations (e.g. *"להבין איך פייפליין עובד"*) alongside commercial, diagnostic, product, and social actions.
- Always-On Rule: [`.agents/rules/contextual-semantic-linking.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/contextual-semantic-linking.md).
- Authoritative Technical Specification: [`.agents/specs/contextual-semantic-linking.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/contextual-semantic-linking.md).

---

## 2.10 Mandatory Publication Readiness & Indexability Control Standard
The website strictly enforces separation between conceptual knowledge, technical page instantiation, publication approval, and search indexing:
$$\text{Knowledge Maturity} \neq \text{Public Page Existence} \neq \text{Publication Readiness} \neq \text{Indexability}$$
- **Public Projection Model**: One Unified Knowledge Graph $\rightarrow$ Controlled Public Projection. Internal graph presence does not authorize public page links or indexing.
- **Zero Automatic Publication / Indexing**: Content ingestion may discover mature concepts and output "Recommend Public Page Candidate", but stops there. Zero silent publishing.
- **Sitemap & Indexing**: `public/sitemap.xml` includes exclusively pages approved for indexing. Accessible review pages receive `noindex, follow`. `robots.txt` controls crawling, not indexing.
- **Canonical Decoupling**: Canonical URL defines entity identity; it does not authorize indexing.
- Always-On Rule: [`.agents/rules/publication-indexability-governance.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/publication-indexability-governance.md).
- Authoritative Technical Specification: [`.agents/specs/publication-indexability-governance.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/publication-indexability-governance.md).

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
