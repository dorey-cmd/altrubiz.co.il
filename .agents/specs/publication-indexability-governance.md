# AltruBiz Publication Readiness & Indexability Control Governance
## Authoritative Technical & Architectural Specification

This document defines the permanent governance architecture for managing Knowledge Maturity, Public Page Existence, Publication Readiness, and Search Indexability across the AltruBiz codebase (`altrubiz.co.il`).

---

## 1. Core Foundational Principle

The AltruBiz Knowledge Operating System permanently establishes that:
$$\text{Knowledge Maturity} \neq \text{Public Page Existence} \neq \text{Publication Readiness} \neq \text{Indexability}$$

These four states represent distinct operational, architectural, and quality milestones. They must **never** be treated as synonyms, collapsed into a single boolean, or inferred automatically from one another.

---

## 2. Four-Stage State Definition

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. KNOWLEDGE MATURITY (Conceptual Understanding)                       │
│    "Do we understand this subject well enough for it to become a       │
│    meaningful knowledge destination?"                                  │
│    - Evaluated strictly QUALITATIVELY. ZERO numerical thresholds.     │
│    - Conceptual depth, diagnostic utility, standalone human value.     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Makes node an ELIGIBLE CANDIDATE
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. PUBLIC PAGE EXISTENCE (Technical Route Reality)                     │
│    "Does a dedicated public URL / route component exist in the app?"   │
│    - Node Existence ≠ Page Existence.                                  │
│    - Route creation does NOT equal publication approval.               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requires deliberate quality review
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. PUBLICATION READINESS & APPROVAL (Human Quality Gate)               │
│    "Is this page ready for a real human visitor to encounter?"         │
│    - Design OS compliance, editorial flow, mobile, a11y, CTAs.         │
│    - No placeholders, no machine dumps, no unfinished sections.        │
│    - Approved for human consumption (accessible via UI/navigation).     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requires deliberate indexing policy
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. INDEXABILITY (Search & Machine Crawler Authorization)               │
│    "Do we intentionally want search engines & AI crawlers to index it?"│
│    - Explicitly approved canonical destination.                        │
│    - Included in public sitemap.xml; robots meta set to index, follow. │
└────────────────────────────────────────────────────────────────────────┘
```

### State Distinctions:
1. **Knowledge Maturity**: Qualitative depth of business understanding. Qualifies an entity as a candidate for a public destination. Does **not** authorize page creation or deployment.
2. **Public Page Existence**: The technical instantiation of a route and component. Does **not** imply the page is finished or approved for visitors.
3. **Publication Readiness & Approval**: A comprehensive quality assessment verifying that the page meets AltruBiz Design OS and editorial standards. A page may be publication ready for human review without being authorized for search indexing.
4. **Indexability**: Deliberate permission granted for search engines (Google, Bing) and AI crawlers (Perplexity, ChatGPT, Claude) to discover, index, and cite the destination as an authoritative AltruBiz reference.

---

## 3. Public Projection Model: One Knowledge Graph, Controlled Projection

The system maintains a single, unified Knowledge Graph but projects it selectively:

$$\text{One Unified Knowledge Graph} \xrightarrow{\text{Controlled Public Projection}} \text{Public Knowledge Surface}$$

- **Internal Knowledge Graph**: Contains all entities, emerging concepts, draft relationships, future product architectures, diagnostic maps, and definitions without public pages.
- **Public Knowledge Surface**: The strictly filtered subset of mature, approved, and publication-ready destinations exposed to visitors and search engines.
- **Governing Invariant**: Internal graph connectivity never justifies exposing unfinished or unapproved destinations to visitors.

---

## 4. Qualitative Knowledge Maturity Standard

### Strict Prohibition of Numerical Quotas
Maturity is evaluated strictly qualitatively. The following are **explicitly prohibited** as automated promotion rules:
- *NO article count thresholds* (e.g. "3 articles", "5 guides").
- *NO relationship counts* (e.g. "X edges", "Y tags").
- *NO backlink or word count quotas*.

### Qualitative Promotion Criteria:
A node achieves maturity when accumulated organizational knowledge provides:
1. **Conceptual Depth**: Thorough explanation of core business mechanisms without thin generalizations.
2. **Diagnostic Utility**: Clear, actionable symptoms and self-assessment questions.
3. **Actionable Guidance**: Concrete first steps and practical "Quick Wins" for the business owner.
4. **Real-World Manifestations**: Authentic case scenarios, pitfalls, and workflow examples.
5. **Standalone Human Value**: Comprehensive answers to likely visitor questions without filler.

---

## 5. The Two Mandatory Human-First Quality Gates

Before any Knowledge destination is approved for public indexing, it must pass both tests:

### Test 1: The Commercial Representation Test
> *"If a potential business client discovered this page directly from a Google search today, would we be proud and confident that it represents AltruBiz's high professional standard?"*
> $\rightarrow$ If **NO**, the page is not ready for indexing.

### Test 2: The AI Authority Test
> *"If this page were ingested, synthesized, and quoted by Perplexity, ChatGPT, or Google SGE today, would we be comfortable with it standing as an authoritative representation of our expertise?"*
> $\rightarrow$ If **NO**, the page must not be approved for indexing.

---

## 6. Technical Implementation Principles (Architecture Reference)

### A. Sitemap Inclusion Principle
- **Governing Rule**: `sitemap.xml` represents **only** canonical destinations approved for search indexing.
- Unapproved, review-only, or draft destinations must **never** be included in `public/sitemap.xml`.
- Formulation:
  $$\text{Page Approved for Indexing} \iff \text{Eligible for Sitemap Inclusion}$$

### B. Indexing Control vs. Crawling Control
The architecture enforces strict separation between crawling (access) and indexing (search inclusion):
- **`robots.txt`**: Controls crawler access to URI paths. It is **never** used as a substitute for indexability control (`Disallow` $\neq$ `Noindex`).
- **`meta name="robots"`**: The primary technical mechanism for indexing control. Pages accessible for testing or human review that are not yet indexable receive `noindex, follow`.

### C. Canonical URL vs. Indexability
- Canonical identity defines: *"What is the authoritative URL for this representation?"*
- Indexability defines: *"Should search engines index this representation right now?"*
- **Invariant**: The presence of an absolute canonical URL does **not** imply indexability. Conversely, setting `noindex` does **not** invalidate or remove the canonical URL.

### D. Internal Linking & Related Content Isolation
- Contextual Semantic Links, Related Articles, Topic Banners, Breadcrumbs, and Knowledge CTAs must only generate standard hyperlinks to destinations that are **already approved for public exploration**.
- When editorial text references an internal, emerging, or non-public Knowledge Node:
  - Render as **clean body text** (unlinked), or
  - Render as an **in-place short definition / tooltip**, but
  - **NEVER** generate a dead link, an unfinished page link, or a false redirect to an unrelated Hub.

### E. Machine-Readable Surfaces (Markdown Mirrors & llms.txt)
- Public machine-readable mirrors (`public/articles/*.md`, `llms.txt`, `llms-full.txt`) constitute public dissemination.
- Machine endpoints must strictly mirror public indexability approval. Unapproved or review-only nodes must not appear in public AI text bundles.

---

## 7. Content Ingestion Lifecycle Workflow

When a new article is ingested into the Knowledge OS:
```
New Article Content
       │
       ▼
[1. Discovery] ──────► Ingestion engine detects concept & maps relationships
       │
       ▼
[2. Maturity] ───────► Evaluates whether accumulated knowledge achieves qualitative maturity
       │
       ▼
[3. Recommendation] ─► System outputs: "RECOMMEND PUBLIC PAGE CANDIDATE"
       │               (STOPS HERE - Zero automatic creation, publication, or indexing)
       ▼
[4. Decision] ───────► Editorial human decision to architect a dedicated page
       │
       ▼
[5. Creation] ───────► Route & components created in review/preview state
       │
       ▼
[6. Approval] ───────► Editorial sign-off against Design OS & Quality Gates
       │
       ▼
[7. Indexing] ───────► Route approved for public sitemap & search engine indexing
```

---

## 8. Multi-Dimensional Decoupling

### A. Localization Independence
Publication and indexability are managed **per locale representation**:
- A Hebrew destination may be `published + indexable`.
- Its English counterpart may be `not created`, `review-only`, or `published + noindex`.
- `hreflang` tags must only connect mutually approved, published locale alternatives.

### B. Environment vs. Editorial State
Environment (`localhost`, `staging`, `preview`, `production`) and Editorial State (`draft`, `review`, `approved`, `indexable`) are independent axes. Staging environments must never be indexed.

### C. Product Nodes
Commercial product nodes follow identical governance. Products exist semantically in the Knowledge Graph long before public packaging, pricing tiers, and indexable landing pages are authorized.
