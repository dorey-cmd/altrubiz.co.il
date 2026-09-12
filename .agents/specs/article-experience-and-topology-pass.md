# Article Experience & Multi-Dimensional Topology Pass
## Authoritative Technical Specification

This document defines two mandatory ingestion gates that run **after** Knowledge Graph integration and **before** an article can be marked review-ready in [`article-ingestion-protocol.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-ingestion-protocol.md): the **Visual Editorial Pass** and the **Multi-Dimensional Knowledge Topology Pass**. Together with the existing Contextual Semantic Linking spec, these form the **Article Experience Normalization** requirement referenced in `article-ingestion-protocol.md` Section 2.

Neither gate authorizes rewriting approved editorial copy. Both operate on structure, assets, and graph relationships — never on the narrative, argument, or voice of the supplied article.

---

## 1. Visual Editorial Pass

Every article ingestion must produce an explicit, written visual plan before any image is sourced or generated, and before the article is considered ready for owner preview.

### 1.1 Required evaluation
For the article as a whole, and for at least each major reading transition, answer:
- Would a visual here genuinely break a long reading sequence, make the pain recognizable, explain a mechanism, demonstrate the product, or reinforce a key insight?
- Or does the passage read cleanly without one?

**Do not mechanically force a fixed number of images.** Fewer, genuinely load-bearing visuals beat a quota filled with filler.

### 1.2 Hero / social image is a decision, not a fallback
Every article must have an explicit hero/social image decision recorded in the ingestion notes: either a specific sourced/generated image, or an explicit, reasoned decision to leave the site default in place pending an asset. Silently leaving `coverImage` unset without recording that decision is a failed pass.

### 1.3 Asset reuse rules
An existing image may be reused **only if it is honestly appropriate**:
- No baked-in text in a language that mismatches the article (e.g. English UI text on a Hebrew RTL article).
- Not narratively "owned" by another article's specific running visual metaphor or character — reusing a distinctive illustration tied to another piece's joke or motif dilutes both articles' identity, even if the filename or subject matches.
- Genuinely depicts the business situation described in the alt text, per the Image Alt-Text Standard (`AGENTS.md` 2.2).

When no honest reuse candidate and no sourced/generated asset exists yet, prefer the zero-asset **`breakRoutine`** structural device (`ArticleSection.breakRoutine`: a short illustrated scene + caption, no image file) over forcing an unrelated stock image. `breakRoutine` content is new structural copy and — like any other change to `sections` — requires the same owner sign-off as the rest of the article body before it is added to an already-approved article.

### 1.4 Diagrams and product screenshots
Where an inline visual is meant to demonstrate a real product mechanism, prefer an actual product screenshot or a clean process diagram over a decorative illustration. Never fabricate a screenshot of a feature or UI state that does not exist.

---

## 2. Multi-Dimensional Knowledge Topology Pass

Selecting one Parent Hub is necessary but **not sufficient**. Every ingestion must additionally:

### 2.1 Classify the article
Record, even though `Article` has no dedicated fields for these (they live in the reasoning, not the data model unless a Hub-level relationship is added as a result):
- Primary pain
- Secondary pains (if any)
- Processes, technologies, business objects, outcomes touched by the article

### 2.2 Audit every existing Hub, not just the obvious one
For each Hub in `src/data/knowledgeGraph.ts` (not only the chosen Parent Hub), evaluate genuine relevance. For each Hub judged relevant, decide and record:
- Why it is relevant (cite the specific overlapping content, not a keyword match)
- Whether an inbound path should be added, and where it naturally belongs: a `relatedArticleSlugs` entry, an existing `HubSection`'s `relatedArticleSlugs`, a new `HubSection` (only if no existing section already covers the manifestation), a contextual body link (`concept:` markdown link), or no public link at all
- For each Hub judged **not** relevant, a one-line reason it was rejected (e.g. "distinct concept — X is about A, this hub is about B")

### 2.3 Guardrail: Link for Understanding, Not for Occurrence
The permanent invariant from `.agents/rules/contextual-semantic-linking.md` applies here at the Hub level too. Two nodes sharing a surface word (e.g. "memory") does not make them related if they describe distinct concepts (e.g. an individual's task-reminder reliability vs. an organization's customer-history continuity). Rejecting a plausible-looking relationship for this reason is a correct outcome of the pass, not a gap in it.

### 2.4 One Parent Hub, multiple surfaces
A single-parent-Hub identity model stays intact: an article has exactly one Parent Hub (its breadcrumb / "נושא:" tag). Genuine secondary relevance is expressed only via additional `relatedArticleSlugs` entries on other Hubs — never by changing the article's Parent Hub, and never purely for graph symmetry.

---

## 3. Completion Criteria

An ingestion is not complete when the article renders, one Hub links to it, and the test suite passes. It is complete when both passes above have been performed and their findings — including genuinely rejected candidates — have been reported to the owner before any resulting structural or graph change is applied.
