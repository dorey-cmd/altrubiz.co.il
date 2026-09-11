---
description: Mandatory Governance for Knowledge Maturity, Public Page Existence, Publication Readiness, and Search Indexability
always_on: true
---

# Publication Readiness & Indexability Control Standard

This standard defines the permanent governance model separating conceptual knowledge, technical page creation, human publication approval, and search engine indexability across AltruBiz.

Authoritative Technical Specification: [`.agents/specs/publication-indexability-governance.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/publication-indexability-governance.md)

---

## 1. Core Invariant: Four Distinct States
$$\text{Knowledge Maturity} \neq \text{Public Page Existence} \neq \text{Publication Readiness} \neq \text{Indexability}$$

These states are never treated as synonyms or inferred automatically:
1. **Knowledge Maturity**: Qualitative depth of conceptual understanding. Qualifies an entity as a candidate for a public destination. Does NOT authorize page creation.
2. **Public Page Existence**: Technical instantiation of a route and component. Does NOT imply the page is ready for visitors or approved for publication.
3. **Publication Readiness**: Editorial quality gate confirming compliance with AltruBiz Design OS, accessibility, mobile usability, and zero placeholder content.
4. **Indexability**: Deliberate authorization for search engines and AI crawlers to index and cite the destination.

---

## 2. Public Projection Model
$$\text{One Unified Knowledge Graph} \xrightarrow{\text{Controlled Public Projection}} \text{Public Knowledge Surface}$$

- The internal graph contains all concepts, emerging nodes, future products, and unpublished relationships.
- The public surface exposes **only** the approved, publication-ready subset.
- Internal graph existence never authorizes generating public navigational links to unfinished destinations.

---

## 3. Qualitative Knowledge Maturity Gate
- **Zero Numerical Thresholds**: Strictly NO quotas (no "3 articles", "X links", "Y mentions").
- **Qualitative Gate**: A node becomes eligible for a public destination only when accumulated knowledge demonstrates conceptual depth, diagnostic usefulness, actionable guidance, and standalone visitor value without filler.

---

## 4. Separation of Human Access & Search Indexing
Development, review, and staging require pages to be accessible for human evaluation without being exposed to search engines:
- `Page Exists` does NOT mean `Indexable`.
- `Publication Ready` does NOT mean `Indexable Immediately`.
- Accessible review pages not yet approved for search indexing receive `robots meta: noindex, follow`.
- `robots.txt` controls crawling, **not** indexing (`Disallow` $\neq$ `Noindex`).

---

## 5. Canonical URL vs. Indexability
- Canonical identity defines: *"What is the authoritative URL for this representation?"*
- Indexability defines: *"Should search engines index this representation right now?"*
- Canonical presence does not mean indexable. `noindex` does not destroy canonical identity.

---

## 6. Sitemap Governance
- `public/sitemap.xml` contains **exclusively** canonical destinations approved for search indexing.
- Unapproved, review-only, draft, or noindex pages are **strictly excluded** from the sitemap.

---

## 7. Internal Links & Related Content Isolation
- Contextual links, Related Articles, Topic Banners, Breadcrumbs, and CTAs must only link to destinations that are **already approved for the public visitor experience**.
- If body text references an internal or unapproved node:
  - Render as clean prose (plain text), or
  - Render as an in-place definition/tooltip, but
  - NEVER generate a dead link, unfinished page link, or false redirect.

---

## 8. Machine Representations (Markdown Mirrors & llms.txt)
- Machine-readable surfaces (`public/articles/*.md`, `llms.txt`, `llms-full.txt`) constitute public dissemination.
- Machine endpoints must strictly mirror approved indexable destinations.

---

## 9. Content Ingestion Protocol
When new content matures an existing node:
$$\text{Discovery} \longrightarrow \text{Qualitative Assessment} \longrightarrow \textbf{Recommend Public Page Candidate} \longrightarrow \textbf{STOP}$$
Zero automatic page creation, zero automatic publication, zero automatic indexing.

---

## 10. The Two Mandatory Human Quality Gates
Before approving any destination for search indexing:
1. **Commercial Representation**: *"If a prospective client landed here from Google today, would we be proud of how it represents AltruBiz?"*
2. **AI Authority**: *"If an AI answer engine quoted this page today, would we be comfortable with it representing our expertise?"*
If either answer is NO, indexing approval is withheld.

---

## 11. Strict Prohibitions
- NO automatic page publishing or route indexing upon ingestion.
- NO arbitrary numerical promotion rules.
- NO `Disallow` in `robots.txt` as a substitute for `noindex`.
- NO inclusion of review, draft, or noindex pages in `sitemap.xml`.
- NO public links to unfinished or internal-only Knowledge Nodes.
