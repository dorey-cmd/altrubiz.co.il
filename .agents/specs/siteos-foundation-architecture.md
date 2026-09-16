# SiteOS Foundational Architecture — Phase 3 Batch 1 + Batch 2

This spec documents the type/config/compatibility layer under `src/siteos/`, introduced in Phase 3 Batch 1 (dormant, additive) and made live against real production data in Batch 2, implementing the boundaries designed in the SiteOS Phase 2 Target Architecture & Migration Blueprint. Batch 2 additionally migrated a small number of real, verified consumers — see §11-13 below for exactly what changed and what remains.

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

## 9. What was deferred in Batch 1 and closed in Batch 2

- ~~A persisted, slug-independent Publication ID~~ — **closed in Batch 2.** Every article in `ARTICLES` now carries a real, persisted `id` (e.g. `pub_crm-quick-wins-guide`), assigned once and never recomputed from slug. `articleToPublication()` uses it directly.
- ~~Live participation of Article/KnowledgeNode/CanonicalConcept~~ — **closed in Batch 2.** `scripts/validate-siteos-identity.cjs` (`npm run test:siteos-identity`) runs every projection function against real production data (21 articles, 5 hubs, 14 concepts) and fails the check if identity, state-derivation, or State A/B invariants ever drift.
- ~~ToolNode / Gateway Publication records~~ — **closed in Batch 2** (`src/siteos/config/tools.ts`, `config/gateway.ts`).
- ~~One real consumer migrated to `MarketConfig`~~ — **closed in Batch 2** (`src/lib/routes.ts`'s `BASE_CANONICAL_DOMAIN`, verified zero-drift via full build + artifact diff).

## 10. What remains deferred after Batch 2 (see the Batch 2 final report for full reasoning)

- **Repointing the remaining ~8 files** that still hardcode the canonical domain literal directly (`src/lib/seo.ts`, `src/lib/distributionManifest.ts`, `scripts/generate-llms-txt.cjs`, `scripts/prerender-pages.cjs`, `scripts/routes-loader.cjs`, `scripts/validate-article-ready.cjs`, `scripts/validate-geo.cjs`, `scripts/validate-machine-knowledge-surface.cjs`) at `IL_MARKET`. Each is independently verifiable and low-risk in isolation, but was not attempted in this batch to keep each migration individually reviewable rather than one large sweep.
- **Repointing CTA/booking/checkout components** (`BookingModal.tsx`, `ContactModal.tsx`, `PricingModal.tsx`, `WhatsAppFloat.tsx`, `Footer.tsx`) at `IL_MARKET.contactChannels`/`bookingWidget`/`checkoutProvider`. Deliberately not attempted: these are revenue-critical, and a migration here needs its own dedicated verification pass (manual click-through + analytics event audit per surface), not a batched sweep.
- **Prerender completeness** (shallow hub template, missing `/offer` prerender, duplicate Schema.org after hydration) — Phase 2 blueprint §9/§10/ADR-05/ADR-06 already designed the target; implementing it is real, substantial work (a template rewrite, not a config change) deferred to its own batch.
- **Publication-state becoming the single field driving `articles.ts` itself** (replacing `publicationStatus`/`indexable` as the stored fields, not just as a derived read model). `PublicationState` is fully designed and validated as a derivation (§9 above), but the stored data model itself is untouched — this is the highest-blast-radius remaining item and needs its own dedicated, carefully-sequenced batch.
- **CTA Goal/Action/Mechanism/Placement wiring into live components**, breadcrumb consolidation (`routes.ts` vs. `ArticlePage.tsx` still disagree), internal-link automation (`getRelatedArticlesByGraph` still dead code), analytics identity propagation, and the article-ingestion acceptance command (Phase 3 brief Steps 12-19). None attempted in Batch 2 — see the Batch 2 final report's explicit NOT COMPLETE verdict for the reasoning.
- **NodeType ontology consolidation** (Phase 2 blueprint §11) — still not performed.

## 11. Source-of-Truth Map (after Batch 2)

| Value | Authoritative source | Notes |
|---|---|---|
| Article semantic identity | `Article.id` (`src/data/articles.ts`) | Persisted, slug-independent, Batch 2 |
| Article slug/URL | `Article.slug` / `Article.publicPath` | Unchanged, editorial |
| Hub/concept semantic identity | `KnowledgeNode.id` / `CanonicalConcept.id` | Unchanged — already sufficient; `KnowledgeEntity`/`ConceptDefinition` reuse these as-is, never mint a competing id |
| Canonical domain (routing) | `IL_MARKET.domain` (`src/siteos/config/markets/il.ts`), consumed by `src/lib/routes.ts` | Migrated in Batch 2 |
| Canonical domain (everywhere else) | Independent literals, per file listed in §10 | **Not yet consolidated** — competing-but-identical-value sources, not competing authorities; all verified equal to `IL_MARKET.domain` |
| Canonical URL (per article/hub) | `routes.ts`'s `buildArticleRouteConfig`/`buildHubRouteConfig` (`article.canonicalUrl` wins if set, else derived) | Unchanged from Phase 1.5 findings |
| Publication state (derived read model) | `deriveStateFlags()` (`src/siteos/compat/articleToPublication.ts`), sourced from `publicationStatus`+`indexable` | Stored fields are still the write-authoritative source; the derivation is validated, not yet load-bearing |
| Market configuration (domain, currency, contact channels, GHL widgets, analytics IDs) | `IL_MARKET` (`src/siteos/config/markets/il.ts`) for the one field migrated; **legacy per-component literals remain authoritative for every other market-dependent value** until migrated | Explicitly not fully consolidated — see §10 |
| Tool identity | `src/siteos/config/tools.ts` (`TOOL_NODES`) | New in Batch 2; does not yet drive routing/rendering for either tool |
| Homepage identity | `IL_GATEWAY_PUBLICATION` (`src/siteos/config/gateway.ts`) for SiteOS identity; `STATIC_ROUTES_REGISTRY['/']` (`routes.ts`) remains authoritative for actual routing/rendering | Two records, one intentionally-compatible relationship, not competing authorities |
| Sitemap/llms/markdown eligibility | Still the three independently-coded filters described in Phase 1.5 (`isIndexable` formula, `getPublishedArticles()`, `getIndexableArticles()`) | **Not yet unified** under `PublicationState`; `test:siteos-identity` proves they currently *agree*, but they remain three separate implementations, not one |

## 12. Site-Wide Architecture Bypass Audit (Batch 2)

| Finding | Classification | Reason |
|---|---|---|
| `public/aga/.claude/` (dev-tooling config served on production) | **FIXED** | Removed from git tracking and disk in Batch 2; verified absent from a fresh `dist/aga/` build |
| Stale `EXPECTED_ARTICLES` map causing `test:url-migration`/`release:gate` to fail | **FIXED** | Batch 2 Step 0 |
| `routes.ts`'s `BASE_CANONICAL_DOMAIN` as an independent literal | **FIXED** | Migrated to `IL_MARKET.domain`, verified zero-drift |
| Remaining ~8 files with the domain literal | **DEFERRED WITH REASON** | Each needs independent verification; batching them risks an undetected drift in a build/validation script |
| Article/KnowledgeNode/Concept identity systems | **INTENTIONALLY COMPATIBLE** | `KnowledgeEntity`/`ConceptDefinition`/`Publication` are projections reusing existing ids, not new authorities — by design, not a bypass |
| CTA destinations (booking/contact/pricing/WhatsApp widgets) not yet expressed as `CtaDestination`/`MarketConfig`-resolved | **DEFERRED WITH REASON** | Revenue-critical; needs its own verified batch, not a sweep |
| `public/_redirects` (dead Netlify-syntax file Vercel never parses) | **DEFERRED WITH REASON** | Confirmed inert (Vercel uses `vercel.json`'s own `redirects` array) — low priority, harmless, not re-verified for removal safety in this batch |
| `public/thank-you.html` (no meta robots, relies solely on `robots.txt` Disallow) | **INTENTIONALLY COMPATIBLE** | Pre-existing, deliberate design per Phase 1 findings; not a SiteOS-architecture bypass, a documented SEO tradeoff |
| Shallow hub prerender / missing `/offer` prerender / duplicate Schema.org after hydration | **DEFERRED WITH REASON** | Substantial, well-designed-but-unimplemented work (Phase 2 blueprint §9-10); not attempted in Batch 2 |
| `getRelatedArticlesByGraph` and other dead Knowledge Graph helpers | **DEFERRED WITH REASON** | Phase 2 blueprint §11/§12 already designs their revival as the SUGGESTED-linking engine; not implemented yet |
| Breadcrumb divergence (`routes.ts` vs. `ArticlePage.tsx`) | **DEFERRED WITH REASON** | Real, understood, bounded fix; not attempted in Batch 2 to keep this batch's diff reviewable |
| No blockers found that would prevent any of the above from being completed in a future batch | **(no BLOCKER classification used)** | — |
