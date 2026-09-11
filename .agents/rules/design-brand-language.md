---
description: AltruBiz Design OS - Brand DNA, Color System, Typography Tokens, Logo Rules, and Spacing Tokens
always_on: true
---

# AltruBiz Design OS: Brand DNA, Visual Identity & Design Tokens
## Visual Identity, Color System, Typography & Layout Measures
### Version 1.1 — Companion Rule (Tier 2, Tier 3 & Tier 5 Specifications)

---

## 1. Architectural Scope
This document is a formal companion rule to [`design-operating-system.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md). It governs the visual identity, approved design tokens, typographic hierarchy, and layout geometry for the AltruBiz website.

---

## 2. Brand DNA & Visual Personality (Tier 2)
AltruBiz combines **practical Israeli B2B business authority** with **human warmth, technological vitality, and relief-oriented clarity**:
- **Professional & Grounded (תכלס בגובה העיניים)**: We address real business friction (missed calls, leaking leads, scattered records), avoiding hollow Silicon Valley buzzwords or cold developer-terminal aesthetics.
- **Relief-Oriented (תחושת סדר והקלה)**: The visual space communicates clarity and order, relieving the overwhelm of chaotic, disconnected business tools.
- **Living & Tactile (ממשק חי ומגיב)**: The interface subtly acknowledges the user's presence through ambient motion, light, and responsive feedback.
- **Warm & Slightly Playful**: Moments of delight (golden particles, ambient light auras) make using the platform enjoyable without compromising executive credibility.
- **Anti-Corporate Directness**: Every visual element serves a communicative purpose. Decorative blobs without meaning are strictly forbidden.

---

## 3. Color System Tokens (Tier 3)

```css
/* Core Brand Tokens */
--color-brand-primary:      #0066CC;  /* AltruBiz Royal Blue - Structural anchor, headings, links */
--color-brand-secondary:    #00AEEF;  /* AltruBiz Electric Cyan - Focus rings, active states, tags */
--color-brand-accent:       #F5A623;  /* AltruBiz Warm Gold - Primary CTA buttons, value sparks */
--color-brand-dark:         #0A2E4D;  /* AltruBiz Midnight Navy - High-contrast hero/footer canvas */
--color-brand-light:        #E6EBF1;  /* AltruBiz Soft Slate - Subtle borders and container fills */

/* Canvas & Surface Tokens */
--surface-canvas-light:     #FFFFFF;  /* Pure white base */
--surface-canvas-subtle:    #F8FAFC;  /* Slate-50: alternating sections & cards */
--surface-canvas-muted:     #F1F5F9;  /* Slate-100: badges, callout backgrounds */
--surface-canvas-dark:      #0F172A;  /* Slate-900: modal dialogs, dark cards */
--surface-canvas-darker:    #020617;  /* Slate-950: deep modal headers & contrast anchors */

/* Text & Contrast Tokens */
--text-heading-dark:        #0F172A;  /* Slate-900: Primary titles & H1/H2 */
--text-body-dark:           #334155;  /* Slate-700: High-legibility editorial paragraphs */
--text-muted-dark:          #64748B;  /* Slate-500: Metadata, dates, breadcrumbs, tags */
--text-on-dark-primary:     #FFFFFF;  /* Crisp white for dark containers */
--text-on-dark-muted:       #94A3B8;  /* Slate-400 for subtext in dark modes */

/* Signal & Semantic Tokens */
--signal-pain-bg:           #FEF2F2;  /* Red-50: Pain banners, warning callouts */
--signal-pain-border:       #FECACA;  /* Red-200: Pain card borders */
--signal-pain-text:         #B91C1C;  /* Red-700: Problem headline & alert text */
--signal-pain-solid:        #DC2626;  /* Red-600: Alert badges, pulsing dots */

--signal-win-bg:            #ECFDF5;  /* Emerald-50: Quick win cards, positive callouts */
--signal-win-border:        #A7F3D0;  /* Emerald-200: Quick win card borders */
--signal-win-text:          #065F46;  /* Emerald-800: Quick win copy */
--signal-win-solid:         #10B981;  /* Emerald-500: Checkmarks, success icons */

--signal-whatsapp:          #25D366;  /* Official WhatsApp Green for direct chat triggers */
```

### The 60-30-10 Brand Harmony Rule
- **60% Canvas & Neutral Air**: Clean white (`#FFFFFF`) and slate tints (`#F8FAFC`, `#F1F5F9`). Eliminates cognitive fatigue and provides generous breathing room.
- **30% Structural Blue Authority**: Royal Blue (`#0066CC`), Electric Cyan (`#00AEEF`), and Midnight Navy (`#0A2E4D`). Defines structural headers, navigation, numbered step badges, and links.
- **10% Energetic Gold & Action Accents**: Gold (`#F5A623` / `#EAB308`). Reserved strictly for primary high-intent CTA buttons ("מתחילים כאן", "קביעת פגישה"), Quick Win outcome highlights, and subtle ambient particle lighting.

---

## 4. Typography System Tokens (Tier 3)

AltruBiz pairs **Rubik** and **Heebo** to balance structural strength with effortless reading:
- **Display & Action Font**: `'Rubik', system-ui, -apple-system, sans-serif` (weights: 700 Bold, 800 ExtraBold, 900 Black). Used for H1, H2, H3 headings, CTA buttons, numbered badges, and modal titles.
- **Editorial & Body Font**: `'Heebo', system-ui, -apple-system, sans-serif` (weights: 400 Regular, 500 Medium). Used for long-form paragraphs, bullet lists, FAQ answers, and metadata.

### Active Heading Scale
- **Hero Display**: `clamp(2.5rem, 5vw, 3.75rem)` (40px–60px); line-height: 1.15; weight: 900.
- **H1 Editorial**: `clamp(2rem, 3.5vw, 3rem)` (32px–48px); line-height: 1.2; weight: 900.
- **H2 Section**: `clamp(1.5rem, 2.5vw, 2.25rem)` (24px–36px); line-height: 1.3; weight: 800.
- **H3 Card / Sub-heading**: `clamp(1.25rem, 1.8vw, 1.5rem)` (20px–24px); line-height: 1.4; weight: 700.

### Active Body Scale & Reading Rhythm
- **Body Lead**: `1.125rem` (18px); line-height: 1.75; weight: 400/500.
- **Body Regular**: `1rem` (16px); line-height: 1.7; weight: 400.
- **Body Small / Metadata**: `0.875rem` (14px); line-height: 1.6; weight: 500.
- **Paragraph Rhythm**: Maintained with generous `space-y-5` to `space-y-6`. Paragraphs are kept concise (2–4 sentences) to support scanning.

---

## 5. Logo & Brand Asset Rules (Tier 1 Invariant & Tier 5 Target)

### Canonical Logo Asset (Source of Truth)
- **Asset URL**: `https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png`
- **Asset Composition**: The official logo contains the dual-arc cyan/blue symbol, bold "ALTRUBIZ" logotype, and the Hebrew tagline: **להכניס את השיטה לסיסטם**.
- **Favicon**: `public/favicon.svg` (Dual-arc cyan and royal blue infinity-loop mark).
- **Prohibition**: Never alter proportions, crop out the tagline, stretch, or recolor the logo mark.

### Header Logo Display Sizing (Tier 5 Implementation Target)
- **Current Observation**: In `Header.tsx`, the logo is constrained to `h-12 md:h-16`, which squishes the tagline and renders it unreadable.
- **Future Implementation Directive**: Increase the visual display size approximately **35–40%** from the current presentation while strictly preserving original proportions.
- **Visual Acceptance Criteria**:
  1. AltruBiz identity has unmistakable presence in the Header.
  2. The tagline is comfortably legible on standard desktop and mobile viewports.
  3. Original logo aspect ratio and proportions are preserved.
  4. Header navigation retains sufficient breathing room.
  5. The Header does not become unnecessarily tall.
  *Note: Specific Tailwind height classes (e.g., `h-18` or `h-20`) are implementation details, not permanent invariants.*

---

## 6. Layout & Geometry Tokens (Tier 3)
- **Max Canvas Container**: `max-w-7xl` (1280px) with `px-4 sm:px-6 lg:px-8` for full-width marketing sections.
- **Deep Hub / Overview Container**: `max-w-5xl` (1024px) for Hub and directory pages.
- **Editorial Reading Column**: `max-w-4xl` (896px) for article reading flows (comfortably bounded to preserve eye-tracking).
- **Corner Radii**:
  - Pill / Buttons / Badges: `rounded-full` (9999px).
  - Major Containers / Modals: `rounded-3xl` (24px).
  - Editorial Cards / Media Frames: `rounded-2xl` (16px).
  - Inputs / Compact Cards: `rounded-xl` (12px).

---

## 7. Pricing Palette Harmonization (Tier 5 Implementation Target)
- **Current Observation**: `PricingNew.tsx` uses traffic-light colors (`#22C55E`, `#F59E0B`, `#DC2626`).
- **Future Implementation Directive**: Harmonize the pricing table with the AltruBiz brand palette (Royal Blue, Electric Cyan, Indigo, and Warm Gold) while ensuring clear visual tier differentiation and ease of comparison. Usability must not be sacrificed for color consistency.
