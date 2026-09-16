# SiteOS Foundational Architecture — Phase 3 Batch 1 + Batch 2

This spec documents the type/config/compatibility layer under `src/siteos/`, introduced in Phase 3 Batch 1 (dormant, additive) and made the genuine site-wide governing architecture in Batch 2 — see §9-12 below for exactly what changed, what remains deferred (and why), the final source-of-truth map, and the final bypass audit.

Read this alongside (not instead of): `AGENTS.md`, `.agents/rules/knowledge-topology-architecture.md`, `.agents/rules/publication-indexability-governance.md`, `.agents/rules/canonical-url-standard.md`, `.agents/specs/article-ingestion-protocol.md`.

---

## 1. Why this layer exists

Phase 1/1.5 verified that `Article` (`src/data/articles.ts`) conflates knowledge, identity, presentation, market assumptions, and publication state into one flat object, and that `publicationStatus` + `indexable` can express contradictory states with no build-time detection. Phase 2 designed the target separation; this batch introduces the types and read-only compatibility projections that make that separation representable, without migrating any existing data or rewiring any existing consumer.

## 2. KnowledgeEntity (`src/siteos/types/knowledgeEntity.ts`)

A stable, market-neutral, language-neutral semantic identity: WHAT a piece of knowledge is, never where or how it's published. This is the same pattern `KnowledgeNode.id` already proves (`src/data/knowledgeGraph.ts`) — semantic identity independent of URL — extended to a shape that can eventually cover articles too, which today have no equivalent.

`src/siteos/compat/knowledgeNodeToEntity.ts` provides a pure, read-only projection from the live `KnowledgeNode` registry. It reuses `KnowledgeNode.id` directly as the `KnowledgeEntityId` — this is **not** a competing identity system.

## 3. Publication (`src/siteos/types/publication.ts`)

One market's public expression of a `KnowledgeEntity`. Deliberately 1:many-capable (a future second market, or a genuinely different format of the same knowledge, is a second `Publication` referencing the same `knowledgeEntityId`) without implying automatic duplication — nothing in this batch creates a second Publication for anything, and most `KnowledgeEntity` records are expected to keep exactly one.

**PublicationState** collapses today's independently-settable `publicationStatus` + `indexable` fields into one 4-value field (`internal | draft | review | published`), with every other flag (`isRoutable`, `isPubliclyRenderable`, `isPubliclyLinkable`, `isSitemapEligible`, `isLlmSurfaceEligible`, `isMarkdownMirrorEligible`, `isSchemaEligible`) a **pure derivation** of it — never independently settable. This is the direct fix for the contradictory-state gap Phase 1.5 §6 traced (a technically-possible `draft + indexable:true` article being fully live with zero gating today).

`src/siteos/compat/articleToPublication.ts` provides `deriveStateFlags(article)` and `articleToPublication(article)` — pure, read-only mappings from today's `Article` shape. **Known, intentional limitation**: `Publication.id` is currently derived from `Article.slug` (there is no persisted, slug-independent article ID yet). This is an honest, temporary proxy, not a claim that identity is solved — see §9.

## 4. ToolNode (`src/siteos/types/toolNode.ts`)

A first-class interactive SiteOS knowledge surface (ROI Calculator, AGA/Growth Analyzer, future assessments/simulators) — not an external side application. Every `ToolNode` declares a `governance` status (`governed | private | experiment | legacy`), directly implementing the standalone-public-tool governance boundary from Phase 2 blueprint §19 (the `public/aga/` finding: a page-producing file must never sit outside SiteOS governance silently).

Batch 1 does not migrate, rewire, or rewrite the ROI Calculator or AGA. No `ToolNode` records are created for them yet.

## 5. ConceptDefinition (`src/siteos/types/conceptDefinition.ts`)

A reusable semantic definition for a term that may need in-context explanation later (tooltip/popover/card — **not built in this batch**). `NODE EXISTENCE != PUBLIC PAGE EXISTENCE` is preserved exactly as `CANONICAL_CONCEPTS`/`ContextualConcept.tsx` already enforce it: a `ConceptDefinition` is never automatically a public page, and `deeperPublicationId` is only populated when the underlying concept has an approved public destination.

`src/siteos/compat/canonicalConceptToDefinition.ts` provides the read-only projection from the live `CANONICAL_CONCEPTS` registry. This is a projection, not a third representation of concept identity — `CanonicalConcept.id` remains authoritative.

## 6. MarketConfig (`src/siteos/config/marketConfig.ts`, `config/markets/il.ts`)

The authoritative configuration boundary for a market: domain, locale, currency, contact channels, booking/checkout provider, legal entity, analytics account. **CENTRAL BY DEFAULT; EXPLICIT OVERRIDE ONLY WHEN JUSTIFIED.**

`IL_MARKET` is the only populated record in this batch, and every value reproduces current production behavior exactly (verified against `src/lib/seo.ts`, `BookingModal.tsx`, `ContactModal.tsx`, `PricingModal.tsx`, `Footer.tsx`, `analytics.ts`, `clarity.ts`). **No existing component reads from `IL_MARKET` yet** — repointing those ~14+ hardcoded-literal call sites at it is Batch 2+ work, sequenced in the Phase 2 blueprint's migration plan (Phase M1/M5).

## 7. Gateway Publication (concept only — not implemented)

The Homepage is architecturally a `Publication` of `format: 'gateway'` — a top-level, market-specific entry point into the deeper knowledge environment, localized rather than merely translated. No `gateway`-format `Publication` record exists yet; the Homepage is untouched in this batch. This entry exists so a future market's homepage is representable as configuration + content, not a structural fork of the whole app.

## 8. CTA foundation (`src/siteos/types/cta.ts`)

Establishes four distinct dimensions per the Phase 3 brief: **Goal** (business objective), **Action** (what the visitor does), **Mechanism** (how it's executed), and **Placement** (where on the page, with an optional **Variant** for copy/presentation). Collapsing these into one field is explicitly disallowed by the governing brief.

This module does **not** replace or rewire `CTAContext`/`ConversionContext` (`src/types/attribution.ts`, `src/types/conversion.ts`, `src/lib/conversionEngine.ts`). Every `CtaPlacement` carries optional `legacyCtaType`/`legacyIntent` fields as an explicit bridge to today's live vocabulary, so the two models can coexist once a migration adapter is built. No existing CTA component is touched in this batch — booking, contact, pricing, WhatsApp, and inline-article CTAs behave identically to before.

## 9. What Batch 2 closed (site-wide architecture completion)

- **Persisted, slug-independent Publication IDs** on all 21 articles; `articleToPublication()` uses them directly.
- **Live participation** of Article/KnowledgeNode/CanonicalConcept, continuously enforced by `npm run test:siteos-identity` (build-blocking via `prebuild`).
- **ToolNode / Gateway Publication records** for ROI Calculator, AGA, and the Homepage.
- **Machine-surface unification**: sitemap, llms.txt/llms-full.txt, and markdown mirrors now derive from the *same* `getIndexableArticles()` eligibility formula (previously two genuinely different filters that only coincidentally agreed); `routes.ts`'s own `isIndexable` computation is now `isSitemapEligible(deriveStateFlags(article))`, sourced from `src/siteos`, not a fourth independent copy.
- **Public/private navigation boundary enforced**: `HubPage.tsx`, `ArticlesIndex.tsx` (`/knowledge`), and a hardcoded `RoiCalculatorPage.tsx` link all now gate on `isPubliclyLinkable(deriveStateFlags(article))` — a review-status article can no longer be linked from any of these three surfaces (previously the un-filtered path Phase 1.5 traced).
- **`/offer` prerendering**: has its own title/canonical/`noindex` metadata in the static build output for the first time, instead of inheriting the homepage's.
- **Duplicate Schema.org after hydration**: fixed at the root (`SEOHead.tsx` now removes the static baseline block before injecting its own) — verified live, exactly one `application/ld+json` script per route post-hydration.
- **Breadcrumb consolidation**: one `buildArticleBreadcrumbs()` in `routes.ts`, consumed by both the visible UI and the `BreadcrumbList` schema — they can no longer disagree.
- **`MarketConfig` (`IL_MARKET`) is now genuinely consumed**, not just populated: `routes.ts`'s canonical domain; `BookingModal`/`ContactModal`'s widget URLs and phone; `Footer`/`AboutPage`'s legal/WhatsApp links; `WhatsAppFloat`/`PricingModal`'s phone number; `attribution.ts`'s shared WhatsApp-URL-builder default (covers 8 further call sites at once); `seo.ts`'s Organization schema (telephone, email, areaServed, legal name, terms URL, WhatsApp contact point — plus a `knowsLanguage`/`availableLanguage` correction); `analytics.ts`/`clarity.ts`'s GA4/Clarity account IDs; and the remaining `.cjs` generator scripts' domain literals (`routes-loader.cjs`'s own re-export was itself a second hardcoded copy, now a live getter; `prerender-pages.cjs`, `generate-llms-txt.cjs`, `sync-articles-md.cjs`, `distributionManifest.ts`).
- **Release enforcement**: `test:article-ready`, `test:url-migration`, and the new `test:siteos-identity`/`test:public-governance` are now in `prebuild`, so `npm run build` (Vercel's actual resolved command) genuinely fails on a real invariant violation — proven with a live negative test.
- **Public-surface governance is enforced, not just documented**: `scripts/validate-public-surface-governance.cjs` (build-blocking) requires every `.html` file under `public/` to be a known static page or a registered `ToolNode`, and forbids any dotfile/dotdirectory under `public/` — the exact `public/aga/.claude/` exposure class (fixed in this batch) can no longer recur silently.
- **Inbound attribution capture**: `captureInboundAttribution()` reads the visitor's own UTM/referrer once at the conversion choke point; forwarded to GA4/Clarity. Deliberately does not touch `buildAttributedIframeUrl()`'s existing outbound `utm_source='altrubiz_web'` convention toward GHL.
- **Stable semantic identity in analytics**: `CTAContext` carries `publicationId`/`knowledgeEntityId` (reusing existing stable IDs, no new lookups) alongside the pre-existing slug-based fields, forwarded to both GA4 and Clarity.
- **Article Acceptance Test**: `npm run test:article-acceptance` traces a positive and a negative synthetic fixture through the entire pipeline, proving non-public content cannot leak into any public/machine surface.

## 10. What remains deferred (real, bounded, non-blocking future work)

- **PricingModal's 6 invoice4u checkout GUIDs** are not expressed in `MarketConfig`. Modeling per-tier checkout destinations is a genuine design decision (how pricing/tier structure should generalize to a future market), not a mechanical swap, and checkout is the single highest-stakes revenue surface in the app.
- **Full CTA Goal/Action/Mechanism/Placement wiring** into live component props/click handlers. The types (`src/siteos/types/cta.ts`) exist and are safe to build on, but no component currently constructs a `CtaPlacement`/`CtaDestination` — this remains a real refactor of every CTA render path (`ArticlePage.tsx`'s 5 inline-CTA variants, `HubPage.tsx`, `PricingModal.tsx`), sized similarly to what was already completed in this batch and deferred to protect visual/behavioral stability across many render paths at once.
- **Attribution NORMALIZATION and DESTINATION PROPAGATION stages** (Step 11) beyond CAPTURE — inbound UTM is captured and reaches analytics, but is not (yet, deliberately) forwarded into the GHL iframe URLs alongside the existing outbound convention.
- **Internal-link SUGGESTED engine** — `getRelatedArticlesByGraph()` remains real, correct, and unused; reviving it as an editorial suggestion surface (not auto-injected links) is designed in the Phase 2 blueprint §12 but not built.
- **NodeType ontology consolidation** (Phase 2 blueprint §11) — no real data exists for the 11 zero-instance types, so there is nothing to migrate; `knowledgeNodeToEntity()`'s conservative mapper already handles this correctly.
- **Playwright-driven release-gate stages** (`test:conversion`, `test:scroll`, `test:semantic`, `test:review-cockpit`, `test:distribution`) remain `release:gate`-only, not build-blocking on every deploy — they need a live preview server, which doesn't exist during Vercel's build phase. Full per-deploy enforcement of these would require a different mechanism (e.g. a post-deploy check against the live preview URL) needing Vercel/GitHub account configuration outside this repository's reach.
- **`public/_redirects`** (dead Netlify-syntax file Vercel never parses) — confirmed inert, low-priority cleanup, not attempted.

## 11. Source-of-Truth Map (final, after Batch 2)

| Value | Authoritative source |
|---|---|
| Article semantic identity | `Article.id` (persisted, slug-independent) |
| Article slug/URL | `Article.slug` / `Article.publicPath` (editorial) |
| Hub/concept semantic identity | `KnowledgeNode.id` / `CanonicalConcept.id` (unchanged, already sufficient) |
| Canonical domain (everywhere) | `IL_MARKET.domain` — 8 files migrated to derive from it directly or via `routes-loader.cjs`'s live getter |
| Canonical URL (per article/hub) | `routes.ts`'s `buildArticleRouteConfig`/`buildHubRouteConfig` |
| Breadcrumbs (articles) | `buildArticleBreadcrumbs()` (`routes.ts`) — one function, two consumers |
| Publication state | `deriveStateFlags()` (`src/siteos`), sourced from the stored `publicationStatus`+`indexable` fields; drives sitemap/llms/markdown/internal-linking eligibility uniformly |
| Schema.org (base Organization/WebSite/SoftwareApplication) | Generated once by `SEOHead.tsx` post-hydration; the static `index.html` copy is actively removed, never left to coexist |
| Market configuration (domain, currency, contact channels, GHL widgets, legal, analytics IDs) | `IL_MARKET` — genuinely consumed by the live components listed in §9, not just populated |
| Tool identity | `src/siteos/config/tools.ts` (`TOOL_NODES`) — identity/governance only, does not yet drive routing for either tool |
| Homepage identity | `IL_GATEWAY_PUBLICATION` for SiteOS identity; `STATIC_ROUTES_REGISTRY['/']` remains authoritative for actual routing/rendering (intentionally compatible, not competing) |
| Public-surface governance | `scripts/validate-public-surface-governance.cjs` — enforced, not just documented |
| Analytics identity | `CTAContext.publicationId`/`knowledgeEntityId` (stable) alongside `sourceArticle`/`sourceHub` (slug-based, unchanged) |
| Checkout destinations (PricingModal) | Still independent literals — explicitly deferred, see §10 |

## 12. Site-Wide Architecture Bypass Audit (final, after Batch 2)

| Finding | Classification |
|---|---|
| `public/aga/.claude/` exposure | **FIXED** |
| Stale `EXPECTED_ARTICLES` map | **FIXED** |
| Canonical domain literal duplication (all reachable files) | **FIXED** |
| Hub/knowledge-index/ROI-calculator unfiltered public links to non-indexable content | **FIXED** |
| `/offer` missing prerendered metadata | **FIXED** |
| Duplicate Schema.org after hydration | **FIXED** |
| Breadcrumb divergence (routes.ts vs. ArticlePage.tsx) | **FIXED** |
| Sitemap/llms/markdown independently-coded eligibility filters | **FIXED** |
| No inbound UTM capture | **FIXED** (capture + analytics only, not GHL destination propagation) |
| Unmanaged public HTML / dev-tooling exposure under `public/` | **FIXED**, and now a standing enforced invariant |
| Article/KnowledgeNode/Concept identity systems | **INTENTIONALLY COMPATIBLE** (projections, not competing authorities) |
| `public/thank-you.html`'s robots.txt-only exclusion | **INTENTIONALLY COMPATIBLE** (pre-existing, deliberate) |
| PricingModal checkout GUIDs not in MarketConfig | **DEFERRED WITH REASON** — real design decision, highest-stakes revenue surface |
| CTA Goal/Action/Mechanism/Placement not wired into live components | **DEFERRED WITH REASON** — large, visually-sensitive refactor |
| Attribution normalization/destination-propagation beyond capture | **DEFERRED WITH REASON** |
| Internal-link SUGGESTED engine | **DEFERRED WITH REASON** |
| NodeType ontology consolidation | **DEFERRED WITH REASON** — no real data to migrate |
| Playwright-stage release enforcement | **DEFERRED WITH REASON** — external CI mechanism needed |
| `public/_redirects` dead file | **DEFERRED WITH REASON** — low priority, confirmed inert |
| **Blockers found** | **None** |
