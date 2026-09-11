---
description: Master Governance, Permanent Invariants, and Architecture of the AltruBiz Design Operating System (Design OS)
always_on: true
---

# AltruBiz Design Operating System (Design OS)
## Master Governance, Constitutional Hierarchy & Permanent Invariants
### Version 1.1 — Master Specification & Governance Anchor

---

## 1. Architectural Relationship: The Dual Operating System
The AltruBiz website experience is co-governed by two complementary, non-competing operating systems:

```
┌─────────────────────────────────────────────────────────────┐
│             ALTRUBIZ KNOWLEDGE OPERATING SYSTEM             │
│  Determines: WHAT EXISTS • WHAT IT MEANS • WHAT IS RELEVANT │
└─────────────────────────────────────────────────────────────┘
                              +
┌─────────────────────────────────────────────────────────────┐
│              ALTRUBIZ DESIGN OPERATING SYSTEM               │
│ Determines: HOW IT LOOKS • HOW IT FEELS • HOW IT COMMUNICATES│
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               UNIFIED ALTRUBIZ USER EXPERIENCE              │
└─────────────────────────────────────────────────────────────┘
```

- **Neither system overrides the other**: A relationship existing in the Knowledge Graph does not dictate that it must look like a card grid. A React component does not dictate semantic knowledge ontology.
- Any future page, article, hub, assessment, or feature created in this repository must comply with **both** the Knowledge OS (see [`.agents/rules/knowledge-topology-architecture.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/knowledge-topology-architecture.md)) and the Design OS documented herein.

---

## 2. The 5-Tier Architectural Classification Model
To prevent accidental implementation details from being promoted into permanent rules, every design decision must be classified into one of five distinct tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: PERMANENT DESIGN INVARIANTS                                         │
│ Durable, framework-agnostic rules that survive tech stacks or new locales.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: BRAND & EXPERIENCE PRINCIPLES                                       │
│ The visual soul, emotional posture, and interactive personality.            │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: CURRENT APPROVED DESIGN TOKENS                                      │
│ Active color hexes, typography families, layout widths, and corner radii.   │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 4: REUSABLE DESIGN & PRESENTATION PATTERNS                             │
│ Proven components, CTA formats, storytelling layouts, and modal dialogs.    │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 5: CURRENT IMPLEMENTATION DETAILS & VISUAL DEBT TARGETS                │
│ Specific React/Tailwind code, canvas scripts, temporary fixes, and debt.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tier 1: The 8 Permanent Design Invariants
These 8 rules are permanent, durable architectural laws. They remain binding regardless of framework changes, redesigns, or market localization:

### Invariant 1: Canonical Brand Asset Integrity
The official AltruBiz logo asset (`https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png`) is the canonical visual anchor of the brand. It must never be distorted, cropped, recolored, or rendered at a display size where either the brand mark or its tagline ("להכניס את השיטה לסיסטם") becomes illegible.

### Invariant 2: Comfortable Editorial Reading Measure
Long-form educational and editorial text must always maintain a comfortable, human eye-tracking reading measure (approximately 60–75 characters per line). Editorial body copy must never be stretched across unconstrained, full-width marketing viewports.

### Invariant 3: Typographic Hierarchy & RTL Contrast Philosophy
Typography must maintain a decisive structural separation between authoritative, confident display/action type and effortless, fatigue-free body type. Headings must establish clear visual contrast and hierarchy engineered specifically for natural Hebrew RTL reading rhythm.

### Invariant 4: The Living Interface Principle
AltruBiz interfaces must feel subtly alive and responsive to visitor presence through restrained ambient motion, tactile micro-interactions, and moments of visual warmth. The site must never collapse into a cold, static corporate template, nor escalate into game-like chaotic distraction.

### Invariant 5: Contextual Relevance in CTA Architecture
Calls to action must emerge organically from the visitor's reading context according to the permanent formula:
$$\text{Current Context} \rightarrow \text{Relevant Next Action} \rightarrow \text{Contextual Message} \rightarrow \text{Appropriate Mechanism} \rightarrow \text{Structured Attribution}$$
Arbitrary sales interruptions detached from the reader's immediate context are strictly prohibited.

### Invariant 6: Context Preservation & Structured Attribution
Any contact, booking, or conversion mechanism must respect the visitor's reading momentum and must transmit complete contextual attribution (originating page, section, topic hub, and intent trigger) to the intake system.

### Invariant 7: Knowledge Graph ≠ Card Grid
Semantic relationships within the Knowledge Graph must be communicated through contextual editorial links, inline anchors, next-step recommendations, or diagrams. Automatically converting the knowledge graph into repetitive, uncurated card grids is forbidden.

### Invariant 8: Anti-Generic SaaS Template Guardrail
Every page must display intentional visual rhythm and purposeful composition. Developers and AI agents must actively avoid generic SaaS tropes (monotonous card repetition, meaningless decorative blobs, centered text voids, and superficial feature lists).

---

## 4. Design OS Architecture Map & Companion Rules
The complete AltruBiz Design Operating System is partitioned across four logically specialized, Always-On rule files:

1. **[Master Governance & Invariants (`design-operating-system.md`)](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md)** *(This file)*:
   - Constitutional authority, Dual OS co-governance, 5-tier classification, and the 8 Permanent Design Invariants.
2. **[Brand DNA, Tokens & Visual Identity (`design-brand-language.md`)](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-brand-language.md)**:
   - Brand visual personality, Color palette tokens (Royal Blue, Cyan, Gold, Navy), Rubik/Heebo typography scale, Logo sizing target (~35–40% increase), Layout widths, and Pricing harmonization target.
3. **[Living Interface, Experience & Content Zones (`design-experience.md`)](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-experience.md)**:
   - StarDust particle signature, Spotlight aura, motion principles, 5-tier CTA presentation library, lead capture mechanisms, content zones, editorial storytelling patterns, and anti-generic SaaS qualitative guardrails.
4. **[Responsive, RTL/LTR & Accessibility (`design-responsive-accessibility.md`)](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-responsive-accessibility.md)**:
   - Viewport scaling (desktop, tablet, mobile), mobile ambient motion behavior, RTL/LTR logical property architecture, WCAG AA contrast, reduced motion accessibility, and performance guardrails.

---

## 5. Enforcement & Single Source of Truth Rules
- **Unity of the System**: The companion files are integral parts of the same unified Design OS. They carry identical binding authority.
- **Single Authoritative Location**: Each detailed design topic lives in its dedicated companion rule. Companion rules must not conflict with or redefine the 8 Permanent Invariants.
- **Progressive Discovery**: Every agent operating in this repository is initialized with these Always-On rules, guaranteeing full visual consistency across all development workflows.
