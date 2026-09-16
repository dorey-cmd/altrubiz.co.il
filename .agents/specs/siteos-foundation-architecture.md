# SiteOS Foundational Architecture — Phase 3 Batch 1

This spec documents the foundational type/config/compatibility layer introduced under `src/siteos/` in Phase 3 Batch 1, implementing the boundaries designed in the SiteOS Phase 2 Target Architecture & Migration Blueprint. It is additive only: nothing under `src/siteos/` is imported by any existing rendering, routing, build, or validation code path as of this batch. No existing production behavior changed.

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

## 9. What is explicitly deferred (not a gap — a sequencing decision)

- **A persisted, slug-independent Publication ID.** `articleToPublication` derives one from `slug` today. Introducing a real, generated, immutable ID on every article record is Batch 2+ work, done when it's actually needed (a rename, or a genuine second Publication) rather than as a mechanical pass over 21 articles with no behavioral payoff yet.
- **Repointing any existing consumer** at `IL_MARKET`, `articleToPublication`, `knowledgeNodeToEntity`, or `canonicalConceptToDefinition`. All are pure functions/data with zero current call sites outside this module.
- **Tooltip/popover/concept-drawer UI**, **CTA suggestion/placement UI**, **AGA/ROI Calculator migration**, **Homepage redesign**, **any second market**, **PublicationState replacing `publicationStatus`/`indexable` in `articles.ts` itself**. None of these are built in Batch 1.
- **NodeType ontology consolidation** (Phase 2 blueprint §11 — 11 of 14 `NodeType` values have zero instances). `knowledgeNodeToEntity`'s mapper is conservative and documents this explicitly; the consolidation itself is not performed here.

## 10. Validation

`src/siteos/**` type-checks under the existing `tsconfig.app.json` (`strict`, `noUnusedLocals`, `noUnusedParameters`) as part of `tsc -b` in `npm run build`. No existing script, route, or generated artifact (sitemap, llms.txt, llms-full.txt, robots.txt, markdown mirrors, Schema.org output) changes as a result of this batch — see the Batch 1 final report for the full validation run.
