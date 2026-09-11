---
description: AltruBiz Design OS - Living Interface, Motion, CTAs, Editorial Rhythm, Content Zones, and Anti-Generic SaaS Rules
always_on: true
---

# AltruBiz Design OS: Experience Architecture & Living Interface
## Living Interface, Motion, CTA Patterns, Content Zones & Editorial Rhythm
### Version 1.1 — Companion Rule (Tier 2 & Tier 4 Specifications)

---

## 1. Architectural Scope
This document is a formal companion rule to [`design-operating-system.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md). It governs the interactive personality, ambient motion, CTA presentation patterns, editorial storytelling rhythms, and anti-generic SaaS guardrails for AltruBiz.

---

## 2. The Living Interface Principle (Tier 2 Principle)
AltruBiz must feel **subtly alive, responsive, and tactile**. The interface acknowledges the visitor's presence through restrained ambient motion and micro-interactions, communicating modern technological polish and human warmth.

```
       [ Cold Corporate Staticness ]  ◄──  ELIMINATE
                     ▲
                     │
       ┌─────────────────────────────┐
       │     THE ALTRUBIZ BALANCE    │
       │   Professional & Grounded   │
       │              +              │
       │    Subtly Alive & Tactile   │
       │              +              │
       │       Warmly Playful        │
       └─────────────────────────────┘
                     │
                     ▼
       [ Game-Like Visual Chaos ]     ◄──  AVOID
```

### Approved Living Interface Expressions (Tier 4 Patterns)
1. **StarDust Particle Effect (`StarDust.tsx`)**:
   - *Status*: **Specifically approved and liked brand visual signature.**
   - *Behavior*: Microscopic golden pixie dust that gently floats and dissipates following user interaction. Conveys technological vitality and modern lightness.
2. **Cursor-Responsive Spotlight (`Spotlight.tsx`)**:
   - *Status*: **Approved directional pattern.**
   - *Behavior*: Soft ambient golden radial aura (`500px`, `opacity: 0.08`) trailing cursor movement to subtly illuminate content cards without compromising reading contrast.
3. **Tactile Micro-Interactions**:
   - Subtle spring hover elevations on cards (`hover:-translate-y-1 hover:shadow-xl`), button depressions (`active:scale-[0.98]`), and numbered badges that rotate slightly on hover.
4. **Atmospheric Motion**:
   - Subtle parallax background depth in hero headers, partner marquee with soft edge gradient masks (`mask-gradient-x`), and scroll-synced Table of Contents active states.
- **Motion Guardrail**: Motion must remain restrained so that content reading and decision-making always dominate.

---

## 3. Contextual CTA Architecture & Presentation Library (Tier 1 & Tier 4)

### The Permanent Architectural Model (Tier 1 Invariant)
Calls to action must emerge organically from the reader's narrative flow:
$$\text{Current Context} \rightarrow \text{Relevant Next Action} \rightarrow \text{Contextual Message} \rightarrow \text{Appropriate Mechanism} \rightarrow \text{Structured Attribution}$$

### The Reusable Presentation Pattern Library (Tier 4 Patterns)
Articles and guides draw from a library of tested presentation patterns based on narrative fit:
1. **`variant: 'strip'` (Subtle Inline Strip)**:
   - *Typical Placement*: Early in the reading flow, after an initial dilemma is posed.
   - *Typical Action*: Low-friction WhatsApp question (`ctaType: 'whatsapp'`).
   - *Style*: Soft horizontal blue/slate pill banner inviting an informal question without pressure.
2. **`variant: 'quote-share'` (Quote & Share Card)**:
   - *Typical Placement*: Mid-article at a high-value conceptual insight or emotional milestone.
   - *Typical Action*: Social sharing (`ctaType: 'share'`).
   - *Style*: Warm amber card with a prominent quote, 1-click WhatsApp share, and copy link button.
3. **`variant: 'text-link'` (Prominent Editorial Callout)**:
   - *Typical Placement*: Within a paragraph discussing operational friction or complex setups.
   - *Typical Action*: Fit consultation / diagnostic conversation (`ctaType: 'contact'`).
   - *Style*: Seamless inline highlighted text with an arrow icon for uninterrupted reading flow.
4. **`variant: 'pricing'` (Pricing Trigger Card)**:
   - *Typical Placement*: Where operational costs, business waste, or ROI are addressed.
   - *Typical Action*: Transparent pricing exploration (`ctaType: 'pricing'`).
   - *Style*: Highlighted card opening the `PricingModal` popup directly over the reading context.
5. **`variant: 'box'` (Rich Milestone Box)**:
   - *Typical Placement*: At major thematic conclusions or preceding the article FAQ.
   - *Typical Action*: Meeting booking & consultation (`ctaType: 'meeting'`).
   - *Style*: Structured container with title, description, primary gold button, and secondary WhatsApp link.
- **Editorial Flexibility**: No mandatory quotas, forced sequences, or rigid section-spacing constraints. Density is governed by editorial relevance and reader momentum.

---

## 4. Lead Capture Mechanisms & Structured Attribution (Tier 1 & Tier 4)
- **Shared Backend Mechanism**: Unified intake across all touchpoints into the CRM backend.
- **Contextual Presentation**:
  - **`ContactModal` Popup**: Preserves page context for off-homepage readers without page reloads.
  - **In-Page Form**: Embedded on `#contact` and dedicated conversion pages.
  - **WhatsApp Bridge**: Quick, mobile-friendly conversational bridge with prefilled context.
- **Structured Attribution Invariant**: Every mechanism must transmit complete context telemetry (source URL, section ID, topic hub, and triggering CTA variant) into the intake payload.

---

## 5. Content Zones Architecture
1. **Hero Zone**: High-contrast, confident anchor with official logo, bold headline, lead text, gold CTA, and pain-bar anchor.
2. **Reading Zone**: Bounded editorial column (`max-w-4xl`), Heebo body font, generous line height (1.75), short paragraphs, and highlighted quick wins.
3. **Discovery Zone**: Contextual inline links, editorial recommendations, and sidebar hub banners that surface related knowledge without clutter.
4. **Action Zone**: Contextual CTAs offering natural next steps tailored to visitor intent.
5. **Assessment Zone**: Self-diagnostic symptom checklists, scorecards, and interactive problem audits.
6. **System / Product Zone**: Tangible proof showing real product screenshots, pipelines, and automations resolving the friction.
7. **Sharing Zone**: Lightweight 1-click sharing of high-value insights via prefilled WhatsApp messages.

---

## 6. Editorial Storytelling Patterns (Tier 4)
- **Problem Callout Card**: `bg-rose-50/80 border-r-4 border-rose-500 rounded-l-2xl p-5 text-slate-800` highlighting operational friction.
- **Quick Win Box**: `bg-gradient-to-br from-amber-50/90 via-emerald-50/70 to-teal-50/90 border-2 border-emerald-300/80 rounded-2xl p-6` with the `Zap` icon for immediate, 5-minute practical actions.
- **Visual Break Card ("שוברים שגרה")**: Real-world workplace scenes highlighting operational friction paired with practical takeaways.
- **Persistent Desktop Right-Side Navigation, Sticky Integrity & Scroll Sovereignty**:
  - **Permanent Invariant**: *"Navigation follows the reader - never the reverse."*
  - The reader's manual document scroll position is sovereign. Passive active-section tracking may adapt the sidebar's own internal scroll viewport (`container.scrollTo`), but must NEVER alter the reader's document or window scroll position.
  - Calling `element.scrollIntoView()` on passive active-section tracking is **strictly prohibited**, as it triggers ancestor and window scrolling.
  - **Sticky Containing-Block Invariant**: The desktop sidebar relies on native CSS `position: sticky`. Ancestors in the containing block chain must NEVER set `overflow: hidden`, `overflow-x: hidden`, or `overflow-y: hidden` (in CSSOM, `overflow-x: hidden` computes `overflow-y: auto`, detaching sticky positioning from the document viewport). Use `overflow-x: clip` on `html, body` to prevent horizontal page overflow safely.
  - **Natural Content Height & Legroom Removal**: The sidebar must never use forced viewport height (`h-[calc(100vh-...)]`) with `justify-between` that creates artificial blank space ("legroom") below short TOC lists. The sidebar uses `sticky top-28 max-h-[calc(100vh-8.5rem)] space-y-3` sizing naturally to its contents, with the internal TOC list scrolling only when necessary (`max-h-[46vh] xl:max-h-[50vh] overflow-y-auto`).
  - Explicit user click on a TOC item intentionally scrolls the document to that section; passive tracking never does.
  - Integrated secondary CTA card is compact (`shrink-0`) and subordinate to the knowledge content.
- **Mobile as Distinct First-Class Knowledge Navigation Experience**:
  - Compact vertical rhythm on mobile screens (`p-5`, tighter gaps) preserving orientation throughout long knowledge articles.
  - Mobile Knowledge Navigator: bottom-floating jump pill appears at `scrollY > 200` displaying current section label, reading progress percentage (`%`), and one-tap access to the article drawer.
  - Mobile Drawer Navigation: Bottom-sheet drawer provides rapid jump buttons for all actions/sections, a prominent one-tap bridge to the parent Knowledge Hub (`/topics/<slug>`), and booking access without disrupting reading momentum.
  - Full-screen / bounded touch modals (`max-h-[90vh]`) with compact header chrome maximizing the interactive form/calendar area.
  - Inverted header hierarchy: Breadcrumbs, parent hub pill, and read time sit above H1; author, date, category, and sharing controls sit cleanly below H1 to guarantee H1 stays dominant and above the fold on mobile.

---

## 7. Imagery, Diagrams & Caption Language
- **Real Product Screenshots & Process Maps**: Preferred for system capabilities (Pipelines, Inboxes, Calendars). Displayed in an intentional frame: `rounded-2xl border border-slate-200/90 shadow-md bg-white overflow-hidden`.
- **Approved & Encouraged Captions**: Explanatory `figcaption` below figures and visual cards (preceded by `💡`) explaining the business context, symptom, or CRM mechanism in human terms.
- **Custom 3D Isometric Metaphors**: Used for conceptual themes (lead capture, multi-channel connections). Maintain consistent lighting, soft shadows, and clean backgrounds.
- **Prohibition**: Generic stock photos of smiling people in business suits are strictly prohibited.

---

## 8. Anti-Generic SaaS Template Guardrail (Qualitative Design Gate)
Before approving any new page or major component, developers and agents must apply qualitative design judgment against these warning signs:
1. **Card Grid Monotony**: Avoid stacking consecutive 3-column rounded white boxes down an entire page without layout variation.
2. **Centered Text Void**: Avoid centering every heading, subtitle, paragraph, and button. Use natural reading alignment.
3. **Meaningless Decorative Blobs**: Every gradient or atmospheric glow must serve content hierarchy and lighting, not just fill empty space.
4. **SaaS Cliché Headlines**: Replace vague buzzwords ("Next-Gen Synergy") with concrete operational language ("לכידת לידים וחיבור WhatsApp").
5. **Repetitive CTA Assault**: Vary the format and intent of next-step actions; never repeat identical sales boxes back-to-back.
6. **Feature Laundry Lists**: Connect system features directly to the business friction they resolve.
7. **Missing Quick Wins**: Educational content should offer immediate, practical takeaways that readers can implement today.

---

## 9. Knowledge Graph ≠ Card Grid (Tier 1 Invariant)
Semantic knowledge relationships must be woven naturally into the content experience via editorial links, inline anchors, next-step recommendations, visual maps, or sidebar banners. Exposing raw graph databases as endless, repetitive card grids is forbidden.
