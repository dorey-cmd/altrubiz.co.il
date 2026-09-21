---
description: AltruBiz SiteOS - Crawlable Link Semantics. Navigation must render a real <a href>; button is for actions; every indexable page needs a regular inbound internal link. Enforced by test:links.
always_on: true
---

# AltruBiz SiteOS: Crawlable Link Semantics
### Version 1.0 - Governance Rule (Tier 1 Invariant, enforced by build and release gate)

> **ניווט לכתובת אחרת חייב להפיק `<a href>` תקין וניתן לסריקה. `button` מיועד לפעולה. כל דף המיועד לאינדוקס חייב לקבל קישור פנימי רגיל מדף רלוונטי באתר.**
>
> Navigation to another URL must render a valid, crawlable `<a href>`. `button` is for actions. Every page intended for indexing must receive a regular internal link from a relevant page on the site.

---

## 1. Why This Rule Exists
A click handler is not a link. A `<button>` or `<div onClick>` that calls `onNavigate('/x')` moves a human to `/x`, but the DOM contains no `href`, so search engines cannot reliably discover or attribute the relationship, "open in new tab" and "copy link address" fail, and assistive technology announces a button instead of a link. A page reachable only through such handlers (or only through `sitemap.xml`) is not internally linked.

This rule complements, and never replaces, [`contextual-semantic-linking.md`](contextual-semantic-linking.md) (which links to add and why), [`knowledge-topology-architecture.md`](knowledge-topology-architecture.md) (inbound links are mandatory) and [`motion-system.md`](motion-system.md) (content and links exist in the DOM regardless of animation).

---

## 2. Navigation vs. Action
| Activation does this | Element |
| :--- | :--- |
| Moves the visitor to another URL (page, hub, article, `/#section` on another page, breadcrumb, card, "next step", "related article") | **`<a href>`**, rendered with `InternalLink` (or `Button href`) |
| Opens an external URL only (share intents for WhatsApp / LinkedIn / Facebook / X, external tools) | **`<a href target="_blank" rel="noopener noreferrer">`**; a plain click may still open a popup, modified clicks stay native |
| Filters or sorts a list, toggles a disclosure, opens a modal or popover, submits a form, copies to the clipboard first (Copy link, Instagram, TikTok), plays, dismisses | **`<button>`** |
| Opens a conversion modal (`BookingModal`, `ContactModal`, `PricingModal`) whose fallback is a URL | **`<button>`** (the action is primary; the URL is only a fallback) |
| Navigates AND has a side effect (closes a drawer or menu first) | **`<a href>`** whose handler runs the side effect only on a plain click (`isPlainPrimaryClick`) |

Do **not** turn every button into a link. Use a button when the job is an action.

---

## 3. Requirements for Every Internal Link
1. **Real destination:** `href` is a valid path (`/article-slug`, `/topic`, `/#pricing`). Never `href="#"`, an empty `href`, or `javascript:`.
2. **Real element:** an `<a>`. Never `<div>`, `<span>`, `<li>`, `<button>` or `role="link"` standing in for a link.
3. **Descriptive text:** the anchor states the substantive answer or destination (see the Question-to-Answer Link Policy in `AGENTS.md` 2.11). No "לחצו כאן" / "קרא עוד".
4. **No nesting:** no `<a>` inside `<a>`, `<button>` inside `<a>`, or `<a>` inside `<button>`. A button-styled link is one `<a>` (use `Button href`).
5. **Native behavior is preserved:** SPA navigation intercepts **only** a plain primary click. Ctrl / Cmd / Shift / middle click, context menu, "copy link", and Enter on a focused link must work natively. Use the shared helpers; never write a bare `e.preventDefault(); onNavigate(...)`.
6. **Same window by default** (`AGENTS.md` 2.9). External links use `target="_blank" rel="noopener noreferrer"`.
7. **Card pattern:** a card with a cover image, a title and a CTA to the same destination may expose up to three links. The title link is the primary tab stop; the cover link uses `tabIndex={-1}`. The title stays inside its heading (`<h2><a href>`).
8. Design, spacing and classes are unchanged by the conversion; only the element and its `href` change.

---

## 4. Shared Components (use these; do not re-implement)
- [`src/components/common/InternalLink.tsx`](../../src/components/common/InternalLink.tsx): `InternalLink` (renders `<a href>`, plain-click SPA navigation), `handleClientNavClick` (for existing anchors), `isPlainPrimaryClick`.
- [`src/components/ui/Button.tsx`](../../src/components/ui/Button.tsx): pass `href` (and optionally `onNavigate`) to render the same button styling as a real link. Without `href` it renders a `<button>` for actions.
- `Breadcrumbs`, `ArticlesIndex`, `HubPage`, `ArticlePage`, `RoiCalculatorPage`, `AboutPage` and the homepage sections already follow this rule; new templates must too.
- Markdown links (`[anchor](/url)`) are rendered through `formatText.tsx` as real anchors with the same click semantics.

---

## 5. Every Indexable Page Needs a Regular Inbound Link
- Every page intended for indexing (every URL in `sitemap.xml`) must be reachable through ordinary `<a href>` links crawled from the homepage.
- Every indexable **article** must receive a contextual `<a href>` from `/knowledge` or a relevant topic hub. The sitemap alone is not an internal link, and a footer link alone is not a contextual link.
- Policy, terms, cookie and accessibility pages may be linked from the footer only; they need not appear as articles.
- Article ingestion: the inbound-linking audit in [`article-ingestion-protocol.md`](../specs/article-ingestion-protocol.md) section 4.2 is complete only when these links exist as real anchors in the rendered DOM.
- Utility routes and legal pages keep their existing `robots`, `canonical` and `noindex` state; this rule never changes indexability.

---

## 6. Enforcement (Automated)
`scripts/validate-crawlable-links.cjs`:
- **Source guard** (`npm run test:links:source`, runs inside `prebuild` and therefore blocks `npm run build` and Vercel builds): fails on any `<button>`, `<div>`, `<span>`, `<li>` or `<Button>` whose click handler only calls `onNavigate(...)`, `window.open(...)` or assigns `window.location`, and on `href="#"`, empty `href`, `javascript:` and `role="link"`.
- **Rendered-DOM audit** (`npm run test:links`, part of `npm test` and `release:gate` Step 12): every article card on `/knowledge` has a real `<a href="<publicPath>">` on title and CTA; filter controls remain buttons and still filter; no empty / `#` / `javascript:` hrefs; no nested interactive elements; breadcrumb ancestors are links; the article share bar's WhatsApp / LinkedIn / Facebook / X intents are real `<a target="_blank">` links; a crawl over `<a href>` only reaches every `sitemap.xml` URL and gives each indexable article a contextual inbound link; a plain click navigates client-side, Ctrl+click opens a new tab, and Enter on a focused link navigates.

A change that adds navigation without a real `href` fails the build. Do not weaken or bypass the guard; fix the element.

---

## 7. New Page / Component Checklist
1. Does activation move the visitor to another URL? Use `InternalLink` / `Button href`. Otherwise use `<button>`.
2. Is the link text descriptive, and does the destination exist in `routes.ts` / `articles.ts`?
3. Does the new indexable page receive a real inbound `<a href>` from `/knowledge` or a relevant hub?
4. Run `npm run test:links` after `npm run build`.

---

## 8. Guardrails
This rule improves crawlability. It does not guarantee indexing (that remains Google's decision), and it does not authorize changing content, URLs, canonicals, `robots.txt`, `noindex` or the sitemap.
