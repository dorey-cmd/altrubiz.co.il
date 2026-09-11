---
description: AltruBiz Design OS - Responsive Rules, Mobile Adaptation, RTL/LTR Direction, Accessibility, and Performance
always_on: true
---

# AltruBiz Design OS: Responsive Design, RTL/LTR & Accessibility
## Responsive Architecture, Mobile Interaction, Bilingual Directionality & Accessibility Standards
### Version 1.1 — Companion Rule (Cross-Cutting Invariants & Standards)

---

## 1. Architectural Scope
This document is a formal companion rule to [`design-operating-system.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md). It governs responsive layout behavior across viewports, mobile interaction models, RTL/LTR directional architecture, accessibility requirements, and performance guardrails for AltruBiz.

---

## 2. Responsive Design System across Viewports

| Viewport | Container Behavior | Typography Scaling | Component Adaptation |
| :--- | :--- | :--- | :--- |
| **Desktop (≥ 1280px)** | Max-width 7xl layout; 4xl article reading column; sticky Table of Contents sidebar (`w-72`). | Full display headings (40px–60px); body 18px (`text-lg`). | 3-column grids, side-by-side step cards, dual-button CTA clusters. |
| **Tablet (768px – 1024px)** | Fluid gutters `px-6`; Table of Contents transitions to in-page top block. | Headings scale down smoothly (`clamp(1.75rem, 3vw, 2.5rem)`). | 2-column card grids; zigzag steps stack cleanly. |
| **Mobile (< 768px)** | Full-width canvas `px-4`; single-column vertical flow; sticky bottom floating jump pill. | Headings 24px–32px; body 16px (`text-base`); tight line-height. | Buttons expand to full width (`w-full`); modal sheets open from bottom (`max-h-[92vh]`). |

---

## 3. Mobile Adaptation & Interaction Model

### The Living Interface on Mobile Touchscreens
The "Living Interface" principle applies across all devices. Mobile experiences must not become cold or visually static simply because cursor interaction is absent:
- **Gentle Autonomous Drift**: StarDust particles use gentle, autonomous ambient floating on touchscreens rather than mouse-following physics.
- **Performance & Battery Protection**: Particle density and animation frequency are reduced on mobile to protect frame rates and battery life. Effects must be simplified or disabled on resource-constrained devices if they materially impact rendering performance.
- **No Cursor Simulation**: Never attempt to simulate cursor positions on touch interactions.
- **Tactile Touch Feedback**: Preserve tactile tap micro-interactions (smooth button scale depressions on touch, active state color shifts).
- **Mobile Jump Ergonomics**: In long articles, the bottom-floating jump pill allows immediate, thumb-friendly navigation to any section via a sliding bottom sheet.

---

## 4. Directional Architecture: RTL & Future LTR

The Design OS is built for seamless bilingual expansion without splitting into separate design systems:

```
┌─────────────────────────────────────────────────────────────┐
│                 GLOBAL BRAND TOKENS (Shared)                │
│  Colors • Typography Weights • Shadows • Radii • Elevations │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
       ┌──────────────────────┴──────────────────────┐
       ▼                                             ▼
┌─────────────────────────────┐       ┌─────────────────────────────┐
│    HEBREW LOCALE (dir=rtl)   │       │    ENGLISH LOCALE (dir=ltr) │
│ • Logical coordinate: start │       │ • Logical coordinate: start │
│ • Primary font: Rubik/Heebo │       │ • High-contrast Latin sans  │
│ • Natural RTL reading flow  │       │ • Natural LTR reading flow  │
└─────────────────────────────┘       └─────────────────────────────┘
```

### Logical Properties Invariant
Future layout CSS must use logical properties rather than physical left/right coordinates:
- Use `ms-*` (margin-inline-start) and `me-*` (margin-inline-end) instead of `mr-*` / `ml-*`.
- Use `ps-*` (padding-inline-start) and `pe-*` (padding-inline-end) instead of `pr-*` / `pl-*`.
- Use `border-inline-start` (`border-s-4`) for problem callouts and highlight bars instead of hardcoded `border-r-4`.
- **Directional Icons**: Icons indicating progression or direction (arrows, chevrons) must mirror automatically:
  ```tsx
  <ArrowLeft className="rtl:rotate-0 ltr:rotate-180" />
  ```

### Global Brand DNA vs. Local Experience Adaptation
Future localized versions may adapt imagery, copy density, and specific examples to local business culture, but must strictly preserve the global visual DNA (palette, contrast, clean reading measures, and the living interface).

---

## 5. Accessibility Standards & Invariants

Accessibility is an integral architectural requirement of the Design OS, not an afterthought:
1. **Contrast Standard**: All body copy and interactive labels must satisfy at least WCAG AA:
   - Body copy (Slate-700 `#334155` on White `#FFFFFF`) achieves an **8.2:1** ratio, exceeding WCAG AAA.
   - UI controls and labels must maintain at least a **4.5:1** contrast ratio against their background.
2. **Motion Sensitivity (`prefers-reduced-motion`)**:
   - Every animation, canvas particle loop, and parallax effect must strictly respect `@media (prefers-reduced-motion: reduce)`.
   - When reduced motion is requested, canvas loops must cancel their `requestAnimationFrame` cycles, and transitions must default to instant or static elegance.
3. **Touch Targets**: All interactive elements (CTA buttons, mobile menu toggles, TOC links, category tags) must measure at least **44x44px** in tappable area on touch viewports.
4. **Keyboard Navigation & Focus Traps**: Modal dialogs (`ContactModal`, `PricingModal`) must listen for `Escape` to close, trap focus while open, and restore body scroll upon exit.
5. **Semantic Heading Hierarchy**: Pages must maintain a single, logical `<h1>` followed by strictly sequential `<h2>` and `<h3>` tags without skipping levels.
6. **Descriptive Business Alt Texts (Rule 2.2)**: All image `alt` attributes must describe the business situation or CRM mechanism (e.g. `לקוח שמצלצל ולא עונים לו בטלפון ומענה לשיחות שלא נענו ב-CRM`). Describing artistic mediums (e.g. `פלסטלינה`, `איור תלת ממדי`) is strictly prohibited.

---

## 6. Performance-Aware Design

AltruBiz balances rich, living visual aesthetics with strict technical restraint:
1. **Video Background Overhead**: The Hero video background uses a preloaded poster image (`poster="...6893869aeedaf87c98bf84d1.png"`) to ensure zero Cumulative Layout Shift (CLS) during initial page load.
2. **Canvas Particle Animation**: `StarDust.tsx` runs an efficient, clean particle array. Future updates should throttle canvas rendering on mobile devices (`window.innerWidth < 768`) to prevent unnecessary CPU/GPU battery consumption.
3. **Image Optimization**: Custom 3D assets and product screenshots should be served in modern compressed formats (WebP/AVIF) with explicit width/height attributes to ensure rapid Largest Contentful Paint (LCP).
