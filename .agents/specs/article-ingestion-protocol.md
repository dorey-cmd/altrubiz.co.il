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
8. **Ingestion Is Not Finished Without an Explicit Inbound-Linking Audit**:
   A new article is connected in BOTH directions. The outbound and inbound internal-linking audit (section 4.2) is a blocking pre-review checkpoint, not a nicety.

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
MULTI-DIMENSIONAL TOPOLOGY PASS (audit every Hub, not just the Parent Hub)
        ↓
BIDIRECTIONAL INTERNAL-LINKING AUDIT (outbound + inbound; blocking; section 4.2)
        ↓
VISUAL EDITORIAL PASS (hero/social decision + inline visual plan; role per image; see below)
        ↓
CONTEXTUAL CONVERSION CONFIGURATION (Lead magnet, CTA intent)
        ↓
CONTENT REVIEW BRANCH (content/review/<slug>)
        ↓
PREVIEW DEPLOYMENT (Production-equivalent Vercel preview; live direct URL + short summary)
        ↓
ISSUE EPHEMERAL CAPABILITY URL (?review_token=<unguessable-token>)
        ↓
OWNER REVIEW IN-SITU (Real website experience + Review Cockpit)
        ↓
OWNER DECISION:
  ├── COMMENTS  → Invalidate old token → Revise branch → Deploy → Issue NEW token & URL
  ├── DISCARD   → Invalidate token permanently → Close review branch
  └── PUBLISH   → Invalidate token permanently → Explicit Owner Approval:
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
- **Review Cockpit Capability Guard**: Ephemeral injection on review previews via capability token without affecting production.

---

## 4. Capability URL Review Authorization & Token Lifecycle

AltruBiz enforces a **Capability URL Model** for owner review. No user login, password, identity account, or Vercel Deployment Protection is required.

### 1. Capability URL Principle
Each review cycle receives one cryptographically strong, unguessable, scoped review token:
```
https://<preview-host>/<article-path>?review_token=<strong-random-token>
```
Possession of the valid review capability URL is the sole authorization.

### 2. Strict Security & Production Immunity
- **Production Host Hard Rule**: `altrubiz.co.il` and `www.altrubiz.co.il` NEVER render Review Cockpit under any circumstance, regardless of query parameters or tokens.
- **No Query-Parameter Bypass**: `?review=true` or any arbitrary parameter is strictly rejected.
- **Cryptographic Strength**: Tokens must be at least 32 characters of high-entropy randomness.
- **Article Scoping**: A token generated for Article A cannot authorize Article B.
- **Server-Side Validation**: Tokens are verified server-side (`/api/validate-review-token` and `/api/review-action`). Worker secrets remain server-only.

### 3. Token Lifecycle & Immediate Invalidation
Tokens are strictly single-cycle credentials:
- **PUBLISH**: Invalidate token permanently; trigger release gate and proceed to production.
- **DISCARD**: Invalidate token permanently; abandon review branch.
- **COMMENTS**: Invalidate current token immediately; agent revises content on branch; preview updates; a fresh, newly minted capability token is issued; owner receives a NEW review link.
- Old review links become instantly useless.

### 4. Ephemeral Review URLs (Zero Permanent Artifacts)
Review capability URLs are strictly ephemeral:
- They are NEVER canonical.
- They are NEVER included in sitemaps, `llms.txt`, or Knowledge Graph nodes.
- They exist only for the duration of the owner review cycle.


---

## 4.1. Article Experience Normalization: Mandatory Pre-Review Gates

An ingestion is not review-ready merely because the article renders, one Parent Hub links to it, and the test suite passes. Before a review branch is opened, all of the following must be performed and their findings reported to the owner:

- **Visual Editorial Pass**: an explicit visual plan (hero/social decision + inline visual evaluation, with a declared role for every image per [`visual-storytelling.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/visual-storytelling.md)), never a silent fallback to the global default image and never mechanically forced imagery.
- **Multi-Dimensional Knowledge Topology Pass**: classification across primary/secondary pain, processes, technologies, business objects, outcomes, and an audit of every existing Hub (not only the chosen Parent Hub) for genuine secondary relevance, with rejected candidates documented.

- **Bidirectional Internal-Linking Audit**: outbound AND inbound contextual links, checked and reported explicitly (section 4.2).

Full authoritative specification of the first two gates: [`article-experience-and-topology-pass.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-experience-and-topology-pass.md).

No gate authorizes rewriting approved editorial copy — they govern structure, assets, and graph relationships, reported before implementation, never applied silently to already-approved article content.

---

## 4.2. Mandatory Bidirectional Internal-Linking Audit (Blocking Ingestion Checkpoint)

Every new-article ingestion performs a contextual internal-linking audit in **both directions**. **Ingestion is NOT finished without an explicit inbound-linking audit.** Where natural, relevant places exist, the links must be added as part of ingestion, not deferred.

### 4.2.1 Direction A — Outbound (from the new article to existing content)
Find the existing articles, Hubs, concepts and pages that genuinely help the reader at the point they are reading, and add natural links from the new article to them (Parent Hub, related articles, concept destinations, product or tool pages, relevant CTAs).

### 4.2.2 Direction B — Inbound (from existing content to the new article), equally important
After the article exists, scan existing content and the Knowledge Graph for every place where a link to the new article would help a reader, and act on each:
1. **Existing articles**: add contextual in-body links where the new article answers the question the reader has at that exact point.
2. **Relevant Hubs**: add the article to the appropriate `relatedArticleSlugs` / `HubSection` (Parent Hub and any secondary Hub found by the Topology Pass).
3. **Knowledge Graph relationships**: add or update the edges in `src/data/knowledgeGraph.ts` (parent, related, concept links) so discovery paths are derived from the graph, not hand-duplicated.
4. **Secondary hubs and adjacent topics**: check neighbouring pain hubs, concepts and journey pages, not only the obvious one.
5. **Natural discovery paths**: confirm a reader can reach the new article from at least one crawlable, contextually sensible path in addition to the sitemap, and that the article's own ending routes onward.

### 4.2.3 Quality bar (applies to both directions)
- **No keyword-only links.** A link must help the reader at the moment it appears (Link for Understanding, Not for Occurrence; Question-to-Answer anchor labels; never generic "קרא עוד" / "לחצו כאן").
- **No quotas, no padding.** Density is set by editorial relevance. A plausible-looking candidate that only shares a surface word is correctly rejected; record it with a one-line reason.
- **Minimal edits to approved copy.** Adding an inbound link to an existing approved article may touch only the sentence needed to carry the link; any wording change beyond that is reported to the owner before it is applied.
- **Publication safety.** Inbound links to a `review` / non-indexable article live only on the review branch and become effective only when that article is published. Never merge a public link to a non-publicly-linkable article (`test:public-governance`, `isPubliclyLinkable`).
- **Same-window links** (`target="_self"`) and Markdown-link rendering rules are unchanged.
- **Real anchors only.** Every link added by this audit renders as `<a href>` in the DOM (`InternalLink` / Markdown link), never as a `<button>` or click handler. Inbound links must be crawlable from `/knowledge` or a relevant hub, not only listed in the sitemap. `npm run test:links` verifies this; see [`crawlable-link-semantics.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/crawlable-link-semantics.md).

### 4.2.4 Required audit report (delivered with the review preview)
1. Outbound links added (source location, target, why it helps the reader).
2. Inbound links added (source page or Hub, target, why it helps the reader).
3. Knowledge Graph edges and Hub entries added or changed.
4. Candidates examined and rejected, each with a one-line reason.
5. Explicit statement that no natural inbound place was left unaddressed, or the reason one was deferred.

An ingestion whose report lacks item 2 or item 5 is not review-ready.

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
