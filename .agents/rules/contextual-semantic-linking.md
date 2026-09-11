---
description: Mandatory Standard for Contextual Semantic Linking, Progressive Knowledge UX, and In-Body Entity Navigation
always_on: true
---

# Contextual Semantic Linking & Progressive Knowledge UX Standard

This standard governs how Knowledge Graph concepts are expressed naturally inside editorial body text across articles, Topic Hubs, guides, diagnostic tools, and future product pages.

Authoritative Technical Specification: [`.agents/specs/contextual-semantic-linking.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/contextual-semantic-linking.md)

---

## 1. Scope & Applicability
This rule applies whenever creating, editing, auditing, or ingesting editorial content across the website. The body text itself is an active participant in Knowledge Graph exploration—not merely cards, menus, or footer widgets.

---

## 2. Core Invariant: Link for Understanding, Not for Occurrence
> **"LINK FOR UNDERSTANDING, NOT FOR OCCURRENCE."**

The mere presence of a keyword or domain term is **never** sufficient reason to insert a link or trigger an interaction. A link or definition interaction exists exclusively when it genuinely helps the human reader:
- Clarify an unfamiliar business concept in context.
- Orient the reader within the wider operational framework.
- Deepen knowledge without interrupting narrative flow.

The human reading experience is the supreme governing criterion. If an interaction does not serve human comprehension, it is prohibited.

---

## 3. Node Existence ≠ Public Page Existence (Qualitative Maturity Invariant)
Concepts (e.g. `Lead`, `Contact`, `Follow-up`, `No-Show`) exist as first-class semantic nodes in `src/data/knowledgeGraph.ts` before earning a public URL.

### Permanent Maturity Rule:
$$\text{Knowledge Maturity} \neq \text{Publication Readiness} \neq \text{Indexability}$$
$$\text{Public Page Eligibility} = \text{Qualitative Knowledge Maturity} + \text{Genuine Standalone User Value}$$

- **Tri-Partite Separation**: Qualitative maturity qualifies a node as a candidate for a public page; actual creation, public exposure, and search indexing are separate decisions.
- **Zero Numerical Thresholds**: There are **strictly NO numerical quotas** (no "3 articles", "3 assets", or backlink counts).
- **Qualitative Promotion Criteria**: A node earns a public page only when accumulated knowledge supports a rich, standalone destination with:
  1. Sufficient conceptual depth (not a thin overview).
  2. Clear standalone user value and practical guidance.
  3. Meaningful relationship density across pains, symptoms, and capabilities.
  4. Actionable diagnostic usefulness and symptom recognition.
- **Prohibition on False Collapsing**: Never redirect or link an emerging concept to an inferior or mismatched Hub merely because a dedicated page does not yet exist (e.g. do not collapse `Lead` into `Pipeline Hub`).
- **Fallback**: Concepts without a public page (`hasPublicPage: false`) provide in-place definitions/tooltips, never dead links or forced redirects.

---

## 4. Question-to-Answer & Value-Promise Link Policy
Every contextual semantic link or related-content recommendation must function as the substantive answer or value promise satisfying reader intent:
- **Strict Prohibition**: Never use generic anchor text, button labels, or mechanical templates such as:
  - `לקריאה` / `קרא עוד` / `למידע נוסף` / `קראו כאן`
  - `קריאת המדריך` / `המדריך המעשי לפתרון` / `למדריך` / `לפתרון`
- **Self-Standing Anchor Test**: If a reader saw ONLY the anchor text without the surrounding card or question, they must have a clear understanding of the destination and what they will learn.
- **Natural Value-Promise Anchors**: Anchor text must concisely describe the tangible takeaway:
  - *Correct*: `איך בונים תגובה מהירה למתעניין חדש`
  - *Correct*: `כללי שימוש בטוח בוואטסאפ ללא חסימות`
  - *Correct*: `מעבר מניהול לידים באקסל לפייפליין חזותי`
  - *Prohibited*: `קריאת המדריך המעשי לפתרון` / `לקריאה לחצו כאן`

---

## 5. Markdown Links & In-Text Client Navigation
- **Dynamic Parsing**: In-text markdown links formatted as `[anchor](url)` are parsed and rendered via `renderFormattedText` into accessible internal client `<a>` tags.
- **Same-Window Navigation**: Internal links must use `target="_self"` (intercepting client navigation) to preserve reading momentum and browser Back history. External URLs open in new tabs with `rel="noopener noreferrer"`.

---

## 6. Progressive Knowledge UX Hierarchy
Depending on reader familiarity, context, and cognitive depth, interactions follow a progressive model:
1. **First Meaningful Encounter**: Contextual semantic link to the canonical destination (when mature public destination exists).
2. **Repeated / Supporting Encounter**: Unobtrusive short in-place definition (tooltip/popover) when useful, preserving reading momentum.
3. **Quick Clarification**: Lightweight definition explaining the term in plain business language with optional path to deep reading.
4. **Deep Exploration**: Canonical Topic Hub or Concept destination.
5. **Clean Prose (No Interaction)**: Common words (`לקוח`, `עסק`, `מכירה`, `טלפון`), immediate repetitions, or dense passages remain plain text.

---

## 7. Knowledge Graph as Single Source of Truth
Presentation components must never maintain hardcoded, duplicate knowledge mappings:
- All canonical hubs, concepts, problem relationships, and navigation selectors reside in `src/data/knowledgeGraph.ts`.
- Components query the graph through dedicated selectors:
  - `getApprovedPublicHubs()`
  - `getCanonicalRecognitionSituations()`
  - `getFeatureKnowledgeLink()`
  - `getHowItWorksStepKnowledge()`
- Updating a node or relation in `src/data/knowledgeGraph.ts` automatically propagates across Features, HowItWorks, Footers, and Hub views.

---

## 8. Tooltip & Quick Definition UX Invariants
The tooltip/popover layer exists strictly to **remind, clarify, and support**—never to interrupt:
1. **Never unprompted**: Opens only on deliberate user intent (hover with intentional delay on desktop, tap on touch).
2. **Never blocking**: Must not shift layout, obscure adjacent lines, or trap scrolling.
3. **Never essential**: The host sentence must remain fully comprehensible without opening the definition.
4. **Zero hover-traps**: Cleanly dismissible via pointer exit, outside tap, or `Escape`.
5. **No ordinary words**: Only domain concepts qualify (`Pipeline`, `CRM`, `Workflow`, `Unified Inbox`).
6. **No documentation clutter**: Must not look like code documentation or an encyclopedia.

---

## 9. Navigational & Density Invariants
- **Same-Window Invariant**: Internal knowledge links **must open in the same tab** (`target="_self"` by default) so browser Back restores reading position.
- **No Numerical Quotas**: Rules such as "3 links per article" or "1 link per 200 words" are strictly prohibited. Density is governed by editorial relevance.
- **Stable Destinations**: Semantic links always point to the canonical destination for that entity.
- **Natural Anchors**: Anchor text must integrate seamlessly into Hebrew syntax without awkward keyword targeting.

---

## 10. Knowledge CTA Intent
The CTA architecture explicitly recognizes **Knowledge Action** alongside Commercial, Diagnostic, Product, and Social actions:
- An editorial invitation to learn (e.g. *"לא בטוחים מה זה Pipeline ואיך הוא עובד אצלכם? להבין איך פייפליין עובד"*).
- Distinct from commercial booking or contact requests.

---

## 11. The Two Mandatory Experience Tests
Before adding any semantic link or interaction, apply both tests:
1. **The Human Reader Test**: *"If I were reading this as a human business owner rather than crawling it as an SEO bot, would I be glad this word was interactive?"* (If NO $\rightarrow$ do not link).
2. **The Visual Density Test**: *"If all interactive elements were highlighted at once, would this page still feel like an elegant article written for humans?"* (If NO $\rightarrow$ over-linked).

---

## 12. Four-Layer Operational Separation
1. **Knowledge Architecture**: Defines canonical entities, definitions, and relationships in `src/data/knowledgeGraph.ts`.
2. **Relevance Engine**: Determines whether an encounter represents a genuine learning moment.
3. **Experience Architecture**: Selects presentation (link, tooltip, Knowledge CTA, or clean prose).
4. **Implementation Engine**: Renders accessible (WCAG 2.1 AA, RTL, keyboard-friendly) UI.

---

## 13. Permanent Prohibitions
- NO numerical maturity thresholds or link quotas.
- NO automatic regex keyword replacement.
- NO generic anchor texts (`לקריאה`, `קרא עוד`, `למידע נוסף`, `קריאת המדריך המעשי לפתרון`).
- NO `target="_blank"` on internal knowledge links.
- NO false hub collapsing or mismatched redirects.
- NO hardcoded duplicate topic/concept maps in UI components.
- NO badge soup or visual clutter above the H1.
- NO visitor tracking, cookies, or localStorage state for knowledge progression at this stage.

---

## 14. Round 3 Refinements & Governance Invariants
1. **Recognition $\neq$ Presentation**:
   - The Knowledge Graph maintains rich synonym maps (`pipeline` $\rightarrow$ פייפליין, Sales Pipeline, תהליך מכירה).
   - Recognition identifies concepts; editorial judgment alone decides whether a specific encounter receives a link/definition or remains clean prose.
   - Synonyms belong to Concepts, not URLs. We never manufacture thin pages for keywords.
2. **H1 Visual Sovereignty & Quiet Entry Environment**:
   - The H1 is the supreme visual anchor of the page. The area above H1 must remain clean and quiet (breadcrumbs, reading time only; no competing badges).
   - *Semantic importance does not require visual prominence*: Parent Hub connections are displayed subtly below the H1 as contextual tags (`נושא: ... ←`), preserving graph relationships without headline competition.
3. **Mobile Touch-First Progressive UX**:
   - Progressive definitions must work flawlessly on mobile touch devices (accessible tap-to-open dialog with backdrop, zero hover dependency, preserved scroll position).


