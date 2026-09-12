---
description: Permanent Canonical URL Standard & Site-Wide Knowledge OS Invariant for AltruBiz
always_on: true
---

# AltruBiz Permanent Canonical URL Standard

This standard defines the permanent, non-negotiable canonical URL architecture and lifecycle protocol across the AltruBiz website (`altrubiz.co.il`).

---

## 1. Core Principle: One Explicit Canonical Destination
Every public indexable HTML page must always identify **one and only one** explicit, absolute, HTTPS canonical URL.

This rule is a permanent Knowledge Operating System invariant and does NOT depend on whether a URL has ever changed. It applies automatically to all current and future page types:
- **Home Page** (`/`)
- **Knowledge Center** (`/knowledge`)
- **Topic / Hub pages** (e.g. `/lost-leads`, `/sales-pipeline`)
- **Articles & Guides** (e.g. `/excel-to-pipeline`, `/unified-inbox`)
- **Business Situation & Concept pages**
- **Feature & Capability pages**
- **Sales Journey, Diagnostic & Assessment pages**
- **Product pages**
- **Future knowledge-node page types & localized representations**

---

## 1.1 Permanent URL Architecture Principles (Flat & Semantic)

1. **Shortest Meaningful Stable URL**:
   - Every public URL must be concise, expressive, and durable over the multi-year business lifecycle.
   - Strip filler words and bureaucratic suffixes (e.g. `-guide`, `-in-crm-overview`).
2. **Flat by Default**:
   - Content lives at the root level (`/<slug>`) unless a hierarchical folder represents a real, distinct user-facing destination/workflow.
   - **No `/articles/` prefix**: Content is not nested under `/articles/` merely because its internal data type is an article.
   - **No `/topics/` prefix**: Hubs are not nested under `/topics/` merely because they act as knowledge aggregators.
3. **English Lowercase ASCII & Hyphens**:
   - Only lowercase English letters (`a-z`), numbers (`0-9`), and hyphens (`-`).
   - Strictly forbidden: underscores (`_`), camelCase, uppercase characters, or percent-encoded non-ASCII characters.
4. **Identity Belongs in the URL; Relationships Belong in the Knowledge Graph**:
   - The URL identifies *what the entity is* (e.g. `/lead-reactivation`).
   - Topic clustering, parent hubs, and conceptual relationships are managed in the Knowledge Graph (`src/data/knowledgeGraph.ts`), not forced into nested directory paths.
5. **Topic Similarity Does Not Justify Nesting**:
   - Similar or related topics remain flat peers in the URL space. Nesting creates brittle URLs that break when editorial taxonomy shifts.
6. **Parent Path Meaning & The "Parent Deletion Test"**:
   - A subfolder exists *only* if the parent path is itself a valuable, independently browseable destination.
   - If deleting the slug segment leaves a parent URL that has no standalone user purpose, flat routing must be used instead.
7. **Human, SEO, AI & Sharing Invariants**:
   - A human must be able to read, speak, or type the URL cleanly.
   - Answer engines (LLMs) and search engines must infer subject matter directly from the slug.
   - Social messaging previews (WhatsApp, Slack) must look authoritative and clean when shared.
8. **Title Intent Guides Slug**:
   - Slugs should reflect the user search intent or core business problem solved by the page, not incidental drafting artifacts.
9. **Real Permanent Redirects on Migration**:
   - Any migrated URL must receive a direct, permanent redirect (`permanent: true` / 308 on Vercel) to its final canonical URL.
   - Strictly zero redirect chains (A -> B directly, never A -> B -> C).

---

## 2. Canonical URL Technical Invariants

1. **Absolute & HTTPS**:
   - Must always be absolute and use secure HTTPS (e.g. `https://altrubiz.co.il/articles/example`).
   - Must never be relative (`/articles/example`) or insecure (`http://`).
   - Must never contain query parameters (`?`) or fragment hashes (`#`).

2. **Preferred HTML Destination**:
   - Points strictly to the preferred public HTML version of the page.
   - Declared in the `<head>` via `<link rel="canonical" href="https://altrubiz.co.il/..." />`.

3. **OpenGraph Alignment**:
   - `og:url` must represent the canonical page URL.
   - Note: `twitter:url` is not a required canonical invariant.

4. **Structured Data Consistency**:
   - `mainEntityOfPage` and page-level structured-data references must remain consistent with the canonical page URL.
   - Schema entity `@id` values must be stable and consistent with the canonical architecture, but legitimately use scoped identifiers such as:
     - `${canonicalUrl}#page`
     - `${canonicalUrl}#article`
     - `${canonicalUrl}#organization`
     - `${canonicalUrl}#faq`
     - `${canonicalUrl}#breadcrumb`

5. **Sitemap Synchronization**:
   - `public/sitemap.xml` `<loc>` entries must contain the canonical public URL.
   - Accidental `noindex` or private pages must never be listed in the sitemap.

6. **Direct Internal Linking**:
   - Internal links across the website (navigation, breadcrumbs, hubs, contextual body links, CTAs) must point directly to the canonical URL.

7. **Zero Redirect Canonicals**:
   - A canonical URL must never resolve through a redirect (no 301/302 hops).

8. **Zero Competing Entities**:
   - Never create competing canonical destinations for the same knowledge entity.

---

## 3. URL Migration & Retirement Protocol

When an existing URL must change, the migration must follow this strict protocol:

```
OLD URL
  └── Permanent 301 Redirect
        └── NEW Canonical URL
```

1. **Self-Declaration**: The new page declares itself as the new canonical destination.
2. **Non-Competition**: The retired URL must not remain as a competing indexable destination.
3. **Sitemap Cleanliness**: The sitemap must contain the new canonical URL, not the retired URL.
4. **Direct Link Updating**: All internal links across the codebase must be updated to point directly to the new canonical URL rather than relying on the 301 redirect.
5. **Machine Representation Alignment**: Plaintext Markdown mirrors (`/articles/*.md`), `llms.txt`, and alternate links must maintain an explicit relationship to the new canonical HTML knowledge destination.

---

## 4. Multilingual Principle (Per-Locale Representation)

- Canonical URLs are defined **per published locale representation**.
- A future Hebrew (`he`) and English (`en`) representation of the same Knowledge Node may each have its own distinct canonical URL (e.g. `https://altrubiz.co.il/articles/slug` and `https://altrubiz.co.il/en/articles/slug`).
- The relationship between localized equivalents will be handled through the multilingual architecture, including bidirectional `hreflang` annotations where appropriate, without violating single-canonical integrity per locale.
