---
description: Permanent Information Architecture, Knowledge Topology, Content Methodology, Internal-Linking Logic, and SEO/GEO Standard for AltruBiz
always_on: true
---

# AltruBiz Knowledge Topology, Content Architecture & Internal Linking Standard

This rule defines the permanent information architecture, content methodology, internal-linking logic, SEO/GEO structure, and content-ingestion behavior for the entire AltruBiz codebase (`altrubiz.co.il`).

---

## 1. Core Principle: Connected Knowledge Graph
The AltruBiz website is NOT a simple blog or a flat list of articles. It is a structured knowledge, persuasion, and commercial architecture operating as a connected knowledge graph.

### Primary Conceptual Journey:
```
HOME
  └── BUSINESS PAIN
        └── SUB-PAIN / REAL-WORLD MANIFESTATION
              └── KNOWLEDGE / ARTICLE
                    └── POSSIBLE SOLUTIONS
                          └── RELEVANT PRODUCT OR SERVICE
                                └── CONTEXTUAL ACTION (CTA)
```
- **Non-Linear Navigation**: Visitors must be able to move deeper into a subject, upward to a broader pain, sideways to related concepts, between articles, from pain to product, and from product to educational content.
- Every page is a knowledge node; every meaningful internal link is a relationship between nodes.

---

## 2. Business Pains Before Features
The highest-level topic architecture must be organized primarily around problems that business owners recognize in their own language—NOT technical features or software jargon.
- **Problem layer = Discovery layer** (e.g. "לידים נופלים בין הכיסאות", "תקשורת לקוחות מפוזרת בערוצים", "עבודה ידנית חוזרת על עצמה").
- **Technology layer = Solution layer** (e.g. CRM, WhatsApp API, Workflow Automation).

---

## 3. Node Types in the Architecture
1. **Home Page**: The broad map of business problems AltruBiz solves and major solution families. Contextual deep links into mature Pain Hubs and Micro Hubs.
2. **Pain Hubs (Primary Topic Pages)**: Broad business pains (e.g., `/topics/lost-leads`). Must provide standalone educational and diagnostic value:
   - What the problem is & how to recognize it
   - Common symptoms & business cost
   - Diagnostic checklist & quick questions
   - First practical action (Quick Win)
   - Relevant articles organized by manifestation
   - Related Micro Hubs & solution paths
   - Contextual CTAs (modals & WhatsApp)
3. **Sub-Pains / Real-World Manifestations**: Where articles live (e.g., "אנשי מכירות לא מעדכנים CRM", "לא עונים לשיחות שלא נענו").
4. **Articles**: Individual knowledge nodes with strong hooks, real-world stories, practical insights, Quick Wins, and contextual bidirectional links.
5. **Micro Hubs (Knowledge Tag Pages)**: Semantic concept hubs (e.g., `/topics/whatsapp-in-crm`) promoted only when they meet the Promotion Rule.
6. **Product / Solution Nodes**: Never isolated commercial pages; always connected to the pains they solve, relevant articles, and CTAs.

---

## 4. Multi-Dimensional Taxonomy
Every piece of content must be classified across semantic dimensions:
- **Pains**: e.g., lost leads, manual work, scattered communication, inconsistent sales, lack of visibility.
- **Processes**: e.g., follow-up, onboarding, sales pipeline, reactivation, appointment booking.
- **Channels**: e.g., WhatsApp, Instagram, Email, SMS, Phone.
- **Technologies**: e.g., CRM, AI, Automation, API.
- **Business Objects**: e.g., leads, customers, opportunities, appointments, tasks, reviews.
- **Outcomes**: e.g., time savings, more revenue, fewer no-shows, faster response.
- **Products**: e.g., AltruBiz CRM, WhatsApp Journeys, Follow-up Automation, AI Chat/Voice Bots.

---

## 5. Promotion Rules (Hub Quality Gates)
- **Permanent Principle**: Node Existence ≠ Public Page Existence.
- **Tri-Partite Progression**: $\text{Knowledge Maturity} \neq \text{Publication Readiness} \neq \text{Indexability}$. Qualitative maturity makes a node an eligible candidate for a public destination; publication, public exposure, sitemap inclusion, and search indexing remain separate, deliberate decisions.
- **Public Page Eligibility**: Evaluated strictly qualitatively:
  $$\text{Public Page Eligibility} = \text{Qualitative Knowledge Maturity} + \text{Genuine Standalone User Value}$$
  There are **strictly NO numerical thresholds** (no "3 articles", "3 assets", or backlink quotas).
- **Tag & Concept Promotion Gate**: An entity or tag becomes a public, indexable Hub only when:
  - It possesses sufficient conceptual depth and clear standalone visitor value.
  - It has meaningful relationship density across business pains, symptoms, and capabilities.
  - Standalone diagnostic usefulness, practical guidance, and symptom recognition can be articulated without filler.
  - It answers likely user intent coherently rather than acting as a thin SEO page.
  - Otherwise, it remains strictly internal knowledge metadata.
- **Pain Hub Promotion Gate**: Created only when recurring business pains represent distinct visitor search/pain intent supported by qualitative diagnostic depth. Never create duplicate Hubs with minor phrasing variations.

---

## 6. Mandatory Ingestion Workflow for Every New Article
Whenever new content is added to the website:
1. **Understand**: Identify primary/secondary pains, manifestations, processes, channels, technologies, outcomes.
2. **Classify**: Assign to normalized canonical taxonomy in `src/data/knowledgeGraph.ts`.
3. **Parent Relationships**: Determine parent Pain Hub and related Micro Hubs.
4. **Outbound Links**: Link from the article to its parent Hub, related articles, and contextual CTAs.
5. **Inbound Links (MANDATORY)**: Update existing pages, parent Hubs, and related articles to link contextually BACK to the new article.
6. **Update Existing Hubs**: Add new sub-problems or insights to parent Hubs.
7. **Evaluate Qualitative Maturity**: Determine whether accumulated insights on any concept now provide sufficient conceptual depth and standalone user value to justify recommending a dedicated public Hub.
8. **Check Commercial Connections**: Connect to relevant AltruBiz solutions without forced sales pitches.
9. **Check User Journey**: Ensure every page ends with clear next steps (reading, quick win, or CTA).

---

## 7. Internal Linking & CTA Standards
- **Bidirectional Connectivity**: No orphaned or dead-end pages.
- **Descriptive Anchor Texts**: Never use generic "click here" or "לחצו כאן".
- **CTA Families**: Match user intent across five primary actions: Commercial (Contact/Meeting), Diagnostic (Self-assessment), Knowledge (Deepen/clarify), Product (Solution fit), or Social (Sharing).
- **Popup Modal Rule**: Off-homepage contact/fit CTAs must open `ContactModal` or `PricingModal` without taking the reader out of context.
- **Editorial CTA Spacing**: Inline CTAs are governed by narrative flow and reading momentum rather than rigid numerical quotas.

---

## 8. Contextual Semantic Linking & Progressive Knowledge UX
The editorial text itself is an active part of the Knowledge Graph navigation.
- **Permanent Invariant**: "LINK FOR UNDERSTANDING, NOT FOR OCCURRENCE." Keywords are never linked simply because they appear.
- **Node Existence ≠ Page Existence**: Concepts (e.g. Lead, Contact, Follow-up) exist in the Knowledge Graph with canonical definitions even before earning dedicated public pages.
- **Progressive Knowledge UX**: First encounter links to canonical destination; repeated or supporting encounters offer short in-place definitions; common words remain clean prose.
- **Same Window Navigation**: Internal knowledge links open in the same window (`target="_self"` by default) to preserve reader momentum and browser history.
- Full specification: [`.agents/rules/contextual-semantic-linking.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/contextual-semantic-linking.md).

---

## 9. Single Source of Truth
The Knowledge Registry in `src/data/knowledgeGraph.ts` is the single source of truth for all content nodes, taxonomies, and topological relationships.

