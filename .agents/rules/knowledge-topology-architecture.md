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
- **Tag Promotion Rule**: A tag becomes a public, indexable Micro Hub only when:
  - At least 3 substantial pieces of relevant content exist.
  - The concept has independent search and user value.
  - A useful standalone explanation and diagnostic value can be written without filler.
  - Otherwise, it remains strictly internal metadata.
- **Pain Hub Promotion Rule**: Created only when recurring business pains are backed by sufficient content mass and distinct user intent. Never create duplicate Hubs with minor phrasing variations.

---

## 6. Mandatory Ingestion Workflow for Every New Article
Whenever new content is added to the website:
1. **Understand**: Identify primary/secondary pains, manifestations, processes, channels, technologies, outcomes.
2. **Classify**: Assign to normalized canonical taxonomy in `src/data/knowledgeGraph.ts`.
3. **Parent Relationships**: Determine parent Pain Hub and related Micro Hubs.
4. **Outbound Links**: Link from the article to its parent Hub, related articles, and contextual CTAs.
5. **Inbound Links (MANDATORY)**: Update existing pages, parent Hubs, and related articles to link contextually BACK to the new article.
6. **Update Existing Hubs**: Add new sub-problems or insights to parent Hubs.
7. **Check Promotion Mass**: Evaluate whether any topic now has 3+ articles and qualifies as a new Hub.
8. **Check Commercial Connections**: Connect to relevant AltruBiz solutions without forced sales pitches.
9. **Check User Journey**: Ensure every page ends with clear next steps (reading, quick win, or CTA).

---

## 7. Internal Linking & CTA Standards
- **Bidirectional Connectivity**: No orphaned or dead-end pages.
- **Descriptive Anchor Texts**: Never use generic "click here" or "לחצו כאן".
- **CTA Families**: Match user intent with Diagnostic, Product, Soft contact, Content, Sharing, Self-service, or Partnership CTAs.
- **Popup Modal Rule**: Off-homepage contact/fit CTAs must open `ContactModal` or `PricingModal` without taking the reader out of context.
- **5-Tier CTA Spacing**: Maintain at least 2 sections spacing between inline CTAs in long articles.

---

## 8. Single Source of Truth
The Knowledge Registry in `src/data/knowledgeGraph.ts` is the single source of truth for all content nodes, taxonomies, and topological relationships.
