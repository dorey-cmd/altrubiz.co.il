# Authoritative Article Ingestion Protocol & Editorial Operating System

Welcome to the **AltruBiz Site OS Article Ingestion Protocol**.
This document defines the permanent, authoritative workflow for producing, reviewing, publishing, and distributing every article added to `altrubiz.co.il`.

---

## 1. Core Operating Principles & Permanent Invariants

1. **The Knowledge Graph Serves the Content; The Content Does Not Serve the Knowledge Graph**:
   Write naturally for human business readers facing acute operational pains. Never distort prose to force-feed graph nodes or concepts.
2. **Link for Understanding, Not for Occurrence**:
   Never link a word merely because it appears. Only link when the connection provides genuine diagnostic or conceptual depth to the reader's current thought.
3. **Identity Belongs in the URL; Relationships Belong in the Knowledge Graph**:
   Public URLs are flat, stable, and readable (`/<publicPath>`). Hierarchical taxonomy and semantic edges live entirely in the Knowledge Graph (`src/data/knowledgeGraph.ts`).
4. **No Conversion Without Context**:
   Every conversion mechanism must reflect the specific pain point, promise, and situation of the page. Never use generic, disconnected CTAs.
5. **Node Existence != Public Page Existence != Publication Readiness != Indexability**:
   A concept or article node may exist in code or draft without being indexable or published on the public web.
6. **Release Gate Before Production**:
   NEVER publish first and validate afterward. The complete automated `release:gate` must pass with zero errors before merging to `master`.
7. **Downstream Failure Isolation**:
   The website is the canonical source of truth. Post-publish distribution failures (e.g. email or social scheduling) must NEVER roll back or invalidate website publication.

---

## 2. End-to-End Workflow Pipeline

```
RESEARCH / RAW CONTENT
        ↓
EDITORIAL ARTICLE WRITING (Natural Hebrew, Unisex, Business Pains)
        ↓
METADATA & PUBLIC IDENTITY (slug, publicPath, canonicalUrl, markdownUrl)
        ↓
SEMANTIC ANALYSIS (State A destinations vs State B definitions)
        ↓
KNOWLEDGE GRAPH INTEGRATION (Taxonomy, Parent Hub, Bidirectional Edges)
        ↓
CONTEXTUAL CONVERSION CONFIGURATION (Lead magnet, CTA intent)
        ↓
CONTENT REVIEW BRANCH (content/review/<slug>)
        ↓
PREVIEW DEPLOYMENT (Production-equivalent Vercel preview)
        ↓
OWNER REVIEW IN-SITU (Real website experience + Review Cockpit)
        ↓
DECISION:
  ├── COMMENTS  → Agent revises same review branch → Preview updates → Repeat loop
  ├── DISCARD   → Abandon review branch → Nothing touches master
  └── PUBLISH   → Explicit Owner Approval:
                        ↓
                 RELEASE GATE (npm run release:gate)
                        ↓
                 MERGE TO MASTER & PRODUCTION DEPLOYMENT
                        ↓
                 PRODUCTION VERIFICATION (Live URL check)
                        ↓
                 EMIT content.published EVENT
                        ↓
                 DOWNSTREAM MULTI-CHANNEL DISTRIBUTION (GHL Email, Social Planner)
```

---

## 3. Division of Responsibility: Author Supplies vs. Site OS Derives

### The Author / AI Agent Supplies (Editorial Judgment):
- **Topic Research & Operational Narrative**: Grounded in real Israeli SMB challenges.
- **Article Copy & Headings**: Written in high-legibility, unisex Hebrew with clear hierarchy (H1 dominant, H2s, H3s).
- **Proposed Identity**: `slug` and `publicPath` (e.g. `/my-new-topic`).
- **Semantic Classification**: Identifying concepts as State A (public destination) or State B (inline definition/tooltip).
- **Parent Hub & Related Content**: Mapping to the relevant Pain Hub in `src/data/knowledgeGraph.ts`.
- **Contextual Conversion Intent**: Selecting appropriate lead magnet, booking promise, or prefilled WhatsApp message.
- **Initial Lifecycle**: Setting `publicationStatus: 'review'` and `indexable: false`.

### The Site OS Automatically Derives & Enforces (Zero Manual Maintenance):
- **Route Registration**: Automatically populated via `src/lib/routes.ts`.
- **Canonical HTTPS URL**: Strict derivation `https://altrubiz.co.il + publicPath`.
- **Schema.org Structured Data**: Automatic `TechArticle`, `BreadcrumbList`, and `FAQPage` graphs via `<SEOHead />`.
- **Markdown Machine Mirror**: Generated dynamically at `public/<publicPath>.md`.
- **Machine Discovery**: Dynamic inclusion in `llms.txt`, `llms-full.txt`, and exclusion of unapproved drafts.
- **Sitemap Inclusion**: Strict inclusion of published + indexable articles in `public/sitemap.xml`.
- **Prerendered Social HTML**: 1200x630 OpenGraph and Twitter card HTML prerendering in `dist/`.
- **Conversion Fallback**: Context fallback inheritance if explicit configuration is omitted.
- **Review Cockpit**: Automatic injection on review branches without affecting production visitors.

---

## 4. Review Branch & Preview Experience

1. **One Branch Per Article**:
   Every new article is authored on a dedicated review branch:
   `content/review/<public-slug>`
2. **Production-Equivalent Preview**:
   Branch pushes trigger a Vercel Preview deployment with identical typography, components, navigation, and conversion modals as production.
3. **Authorized Review Cockpit**:
   When viewed in Review Mode (`publicationStatus === 'review'` or `?review=true`), the bottom dock appears offering the owner three actions:
   - **PUBLISH**: Approves the article for production deployment.
   - **COMMENTS**: Opens free-text feedback input; updates the same branch.
   - **DISCARD**: Abandons the candidate and closes the review branch.
4. **Zero Production Leakage**:
   While in `review` status, the article is configured with `noindex: true` and is strictly excluded from `sitemap.xml`, `llms.txt`, and `llms-full.txt`.

---

## 5. Post-Publish Distribution Foundation

1. **The content.published Trigger**:
   Emitted strictly AFTER:
   - Owner approval
   - Passing `release:gate`
   - Master deployment
   - Live URL verification
2. **Distribution Manifest**:
   A provider-agnostic snapshot capturing canonical article identity, Knowledge Graph concepts, parent Hub, excerpt, images, and channel distribution states.
3. **Downstream Status Lifecycle**:
   Each channel (`website`, `email`, `social`) manages independent state:
   `pending` → `generated` → `review` → `scheduled` → `published` / `failed`.
4. **Channel Derivation Principle**:
   Email newsletters and social posts are derived adaptations of the canonical article, never separate knowledge bases.
