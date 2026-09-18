---
description: AltruBiz Design OS - Motion & Dynamic Experience System. Encouraged modern motion, shared primitives, and the Progressive-Enhancement Law (motion never gates content).
always_on: true
---

# AltruBiz Design OS: Motion & Dynamic Experience System
### Version 1.0 - Companion Rule (Tier 1 Law, Tier 2 Principles, Tier 4 Patterns)

> **Bots receive the complete site. Humans receive the complete site plus motion.**

---

## 1. Scope & Relationship to Existing Rules
This rule extends, and never replaces:
- Design Invariant 4, *The Living Interface Principle*, in [`design-operating-system.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-operating-system.md).
- The approved expressions (StarDust, Spotlight, tactile micro-interactions, atmospheric motion) in [`design-experience.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-experience.md) section 2. They stay approved.
- Reduced-motion, keyboard, contrast and performance standards in [`design-responsive-accessibility.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-responsive-accessibility.md) sections 5-6.
- The No-JS crawlability, prerender, markdown-mirror, sitemap, `llms.txt` and Knowledge Graph invariants in [`geo-llm-readiness.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/geo-llm-readiness.md) and `machine-knowledge-surface.md`.

The Progressive-Enhancement Law (section 2) is a Tier 1 invariant that refines Invariant 4. It does not add a ninth numbered invariant.

**This rule governs what is allowed for future work.** It does not by itself authorize a site-wide motion rollout; applying it to existing pages is a separate, explicitly requested task.

---

## 2. The Progressive-Enhancement Law (Tier 1 Invariant)
**Motion is progressive enhancement only.** Nothing may depend on animation, JavaScript, scroll position, or user interaction in order to exist or to be readable.

### 2.1 Hard prohibitions
1. **All content exists from the start.** Every heading, paragraph, list, link, `figcaption`, FAQ answer and CTA label is present in the HTML and readable without any animation having run.
2. **Structure stays real.** Semantic HTML, JSON-LD structured data, canonical URLs and internal `<a href>` links are never produced, delayed or altered by a motion library or effect.
3. **Prerender is complete.** The prerendered / raw HTML shows the full content. Machine surfaces (markdown mirrors, `sitemap.xml`, `llms.txt`, `llms-full.txt`, Knowledge Graph) are generated from data and are independent of any animation.
4. **No scroll-gated content.** No text, link or section may first appear in the DOM because the reader scrolled, hovered, clicked or reached a viewport threshold.
5. **No lazy rendering of substance.** Substantive DOM (article body, FAQ, hub links, related-reading links) is never mounted only after an interaction or an `IntersectionObserver` callback. Lazy-loading of heavy *media* (images, video) with reserved dimensions is allowed; lazy-mounting of *text and links* is not.
6. **No hidden-by-default in static output.** `display: none`, `visibility: hidden` or `opacity: 0` must never appear in prerendered HTML, in static CSS defaults, or in server payloads as a condition of showing content.
7. **JS-off test.** With JavaScript fully disabled, content must be complete, readable and navigable (links work, headings in order, text selectable, print-ready).
8. **Content-bearing elements may not start invisible.** An entrance start state for text- or link-bearing elements may displace or scale (`transform`) and may fade from partial opacity, but may never start at `opacity: 0` or `visibility: hidden`. Only purely decorative layers (glows, particles, ornaments, background depth; no text, no links) may start fully transparent.

### 2.2 The mandatory shape of a reveal / stagger / entrance effect
1. **Visible baseline.** The default state (no JS, unsupported browser, print, crawler, reduced motion, first paint) equals the final visible state.
2. **Enhancement is opt-in at runtime.** A start state is applied only by the runtime enhancer after mount, and only to elements not yet in the viewport at that moment. It is never written into HTML or CSS defaults.
3. **Fail-safe.** Every enhanced element reaches its final state by a time-based fallback (not only by an intersection event). The fallback also fires on `print`, when `IntersectionObserver` is unavailable, and when the element receives focus or is the target of a `#hash` / TOC jump.
4. **Reachable by every path.** In-page find (Ctrl+F), anchor links, keyboard focus and screen readers reach visible content without needing to scroll first.
5. **Never the LCP.** The above-the-fold hero, `<h1>` and the LCP element are never animated in from a hidden state.
6. **No layout shift.** Effects use `transform` and `opacity` on elements whose layout box is already reserved (CLS = 0 attributable to motion).

If an effect cannot satisfy sections 2.1-2.2, it is not permitted, however good it looks.

---

## 3. Encouraged Motion Vocabulary (Tier 2 / Tier 4)
The site should feel alive, modern and tactile. Controlled use of the following is **allowed and encouraged**, provided it serves hierarchy, story, rhythm or reading and stays elegant:
- Subtle **parallax** and layered depth (hero headers, section backgrounds, illustration layers).
- **Section reveal on scroll** and **staggered entrances** for grouped items (steps, cards, list rows), in the shape defined by section 2.2.
- **Transitions** with `translate` / `scale` / `opacity`; state-change transitions (accordion, tab, drawer).
- **Micro-interactions**: hover lift, press depression, badge tilt, icon nudge, focus rings, toggle and copy-confirmation feedback.
- **Subtle background motion**: slow gradients, drifting light, ambient particles (existing StarDust / Spotlight remain the reference).
- **Subtle card and CTA animation** that draws the eye to the next relevant action without shouting.
- **Modern CSS first**: `@starting-style`, `transition-behavior`, CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`), `@property`, `view-transition` where progressively enhanced, with a visible non-animated baseline in browsers that lack support.

**Taste guardrails:** motion is subordinate to content (Design OS anti-generic and "game-like chaos" guardrails apply). One clear idea per view, no competing simultaneous effects, no motion for its own sake, and consistent easing and duration across the site.

---

## 4. Shared Motion Primitives, Not Ad Hoc Animation
Prefer a small set of reusable primitives over per-page, per-component bespoke animation.
- **Designated home (to be created by the rollout task, not yet present):** shared primitives under `src/components/motion/` and shared tokens (durations, easings, distances, stagger step, thresholds) in one module such as `src/lib/motionTokens.ts`.
- **Reuse existing infrastructure:** `src/hooks/usePrefersReducedMotion.ts` is the single reduced-motion hook. Do not re-implement `matchMedia` locally.
- Expected primitive families: reveal-on-scroll, staggered group, parallax layer, hover/press surface, ambient background, animated disclosure.
- Every primitive must embed the section 2.2 shape (visible baseline, fail-safe, reduced-motion path) so that consumers cannot violate the Law by accident.
- **Rule of three:** before writing a new one-off effect, check for an existing primitive; if the effect will be used in more than one place, promote it to a primitive instead of duplicating it.

---

## 5. Framer Motion Policy
`framer-motion` is already a dependency. Use it **only when it adds real value over plain CSS**.
- **Use it for:** presence / exit animation (`AnimatePresence`), layout and shared-element transitions, gestures and drag, orchestrated multi-step sequences, spring physics, interruptible animations, and animating values that CSS cannot express cleanly.
- **Do not use it for:** simple hover, focus, fade, color, or basic reveal effects that CSS transitions, `@starting-style` or scroll-driven animations handle. CSS ships zero JS and is the default.
- **Bundle discipline:** prefer `LazyMotion` with `domAnimation` and the `m` component so the animation feature set is not paid for on the critical path.
- **The Law still applies:** Framer's `initial={{ opacity: 0 }}` on a content-bearing element is a violation of section 2.1(8). Wrap Framer usage inside the shared primitives so the visible-baseline and fail-safe shape is preserved.

---

## 6. Accessibility, Keyboard & Performance Requirements
### 6.1 Accessibility
- **`prefers-reduced-motion: reduce`** is honored by every effect, via both CSS (`@media`) and `usePrefersReducedMotion`. Under reduce: no parallax, no stagger, no autoplaying ambient motion, no large translations; at most an instant state change or a gentle opacity crossfade.
- **Auto-moving content** lasting more than 5 seconds (marquees, ambient loops) must be pausable or purely decorative, per WCAG 2.2.2. **No flashing** more than three times per second.
- **Keyboard parity:** every hover-driven effect has a `:focus-visible` equivalent. Focus rings are never removed or hidden by motion. Motion never moves, traps or steals focus.
- **Scroll sovereignty** (`design-experience.md` section 6) is unchanged: no scroll-jacking, no forced smooth-scroll, no `scrollIntoView()` on passive tracking. Parallax may translate layers but must never change the document scroll position or scroll speed.
- Animated elements retain their semantics and reading order; screen readers must not announce animation-only duplicates.

### 6.2 Performance & Core Web Vitals
- Animate **`transform` and `opacity` only** (compositor-friendly). Never animate `width`, `height`, `top`, `left`, `margin` or other layout-affecting properties.
- Use `will-change` sparingly and remove it after the effect ends. Prefer CSS and `IntersectionObserver` over scroll listeners; any scroll handler must be passive and `requestAnimationFrame`-throttled.
- Pause or skip ambient loops when the tab is hidden or the element is off-screen. Reduce density on mobile (`design-responsive-accessibility.md` section 3).
- Motion must not degrade **LCP, CLS or INP**. No JS-driven motion sits on the critical render path. Bundles for motion stay code-split where they are not needed above the fold.

---

## 7. Verification Checklist (every change that adds or alters motion)
1. **Bot test:** raw HTTP GET (`curl`) of the affected page shows the complete content, headings, links, JSON-LD and canonical. Nothing depends on the effect.
2. **JS-off test:** with JavaScript disabled the page is complete, readable and navigable.
3. **Reduced-motion test:** with `prefers-reduced-motion: reduce` the page is fully usable and free of parallax, stagger and ambient motion.
4. **Keyboard test:** every interactive element is reachable and visibly focused; no hover-only functionality.
5. **Fail-safe test:** with `IntersectionObserver` disabled and with no scrolling, all enhanced content still reaches its final visible state.
6. **Performance check:** no new layout shift; LCP element not animated in; no long tasks introduced by motion.
7. **Print / find / anchor check:** Ctrl+F, `#hash` jumps and print show all content.

Automated enforcement is a future hardening step. Until then these checks are a review obligation, reported in the batch summary ([`delivery-workflow.md`](delivery-workflow.md)).

---

## 8. Known Implementation Debt (Tier 5, at rule creation)
Homepage and pricing sections start content-bearing elements at `opacity: 0` via Framer Motion `initial` / `whileInView` (`Hero.tsx`, `HowItWorks.tsx`, `Features.tsx`, `Pricing.tsx`, `PricingOffer.tsx`, `Benefits.tsx`; verify with a fresh search). These predate the Law and are migration targets of the rollout task, not exceptions to it.
