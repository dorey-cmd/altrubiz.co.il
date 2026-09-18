---
description: AltruBiz Design OS - Visual Storytelling System. The brand image language (witty, idea-driven, clay / stop-motion world), image roles, variation rules, and text-in-image policy.
always_on: true
---

# AltruBiz Design OS: Visual Storytelling System
### Version 1.0 - Companion Rule (Tier 2 Brand Language, Tier 4 Patterns)

---

## 1. Scope & Relationship to Existing Rules
This is the permanent **brand image language** for narrative and metaphor imagery on AltruBiz (hero / cover images, visual metaphors, story beats, comic moments, explanatory scenes).
- It extends `design-experience.md` section 7 (Imagery, Diagrams & Caption Language) and the **Visual Editorial Pass** in [`article-experience-and-topology-pass.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-experience-and-topology-pass.md) section 1. Where section 7 of `design-experience.md` describes "custom 3D isometric metaphors", this rule is the authoritative, more specific language for narrative imagery.
- **Unchanged and still binding:** the Image Alt-Text Standard (`AGENTS.md` 2.2), real product screenshots and process diagrams for demonstrating product mechanisms (spec 1.4: never fabricate a UI that does not exist), the asset-reuse rules (spec 1.3), the ban on generic stock photos, and the logo integrity invariant.
- This rule governs **new** images. It does not authorize regenerating the existing site's images; that is a separate, explicitly requested task.

---

## 2. Core Style: A Smart, Witty, Slightly Humorous Invented World
AltruBiz tells its ideas through **illustrated storytelling set in an invented world**, not through photography or generic corporate visuals.
- **Preferred vocabulary:** clay / plasticine characters, stop-motion aesthetic, comic characters, stylized 3D scenes, tactile handmade textures, slightly exaggerated proportions, expressive faces and body language, strong character.
- **Richly detailed invented work environments:** workshops, control rooms, offices built from unlikely materials, miniature dioramas with small telling details (pinned notes, cables, labels, tools, mugs, everyday clutter).
- **Clever visual metaphors and gentle visual humor.** The story happens **inside the frame**.
- **Deliberately stylized, never photorealistic.** No realistic human portraits, no stock-photo look, no glossy "AI-generic" render feel.

---

## 3. Idea First: Every Scene Carries the Article's Core Idea
The goal is to convert the article's central idea into an **original scene that a viewer can understand even without the headline**.
- **Not** a generic "person at a desk in an office", a handshake, a lightbulb, or a floating-icons collage.
- **Metaphor examples:**
  - Business chaos -> a maze, a mountain of sticky notes, a character trying to control dozens of strings at once.
  - Automation -> a smart mechanical system, a chain of actions (marble-run / Rube Goldberg logic), a helpful robot assistant.
  - Lost follow-up -> a character searching a sea of identical folders; a leaking pipe of leads; a bell nobody answers.
- Start from the *idea*, then choose the metaphor, then the world, then the characters. Do not start from "what looks nice".
- **Characters need not be human:** animals, tools, machines, blobs, objects, or hybrids are welcome when they express the idea better.
- **Tone:** smart, witty, idea-driven, warm, full of personality, professional without being corporate, funny where it fits but never childish, never mocking the reader.

---

## 4. Consistency of Language, Not Repetition of Assets
The family resemblance comes from **shared visual language** (materials, lighting, warmth, level of craft, wit), not from re-using the same scene, character or composition.
**Vary deliberately across images:** camera angle and perspective, number of characters, environment, metaphor, situation, humor style, secondary color accents, scale and depth (macro close-up vs. wide diorama).
- A distinctive character, joke or motif belongs to the article it was made for (spec 1.3). Do not recycle it into another article.
- Consecutive articles must not look like re-skins of the same picture.

---

## 5. Subtle Israeli Feel (Situation & Character, Not Symbols)
Express local authenticity through **situation, warmth, density, directness and everyday details** (a crowded desk, a phone buzzing on three channels, a pragmatic expression, a family-business energy).
- **Prohibited:** national flags, national symbols, Stars of David, clichéd blue-and-white schemes, or any decoration that turns the image into a national emblem.
- The feel must be recognizable to an Israeli business owner and never forced or stereotyped.

---

## 6. Color, Light, Texture & Materials
Preserve the existing visual family:
- **Warm lighting, earthy colors and tactile textures** as the base.
- **Blues and the AltruBiz brand colors as accents** (Royal Blue, Electric Cyan, Warm Gold per [`design-brand-language.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/design-brand-language.md)), used as accents, not as a flood.
- **Depth of field and a diorama / miniature feel** (shallow focus, small scale, layered foreground and background).
- **Tactile materials:** clay, wood, fabric, paper, metal, molded plastic. Visible fingerprints, seams, stitching and grain are features.

---

## 7. Text Inside Images
The image must **work without text**. Minimize text.
- Text is allowed only when it is a **natural part of the story**: a note, screen, sign, small headline, UI fragment, task, or a joke word.
- It must be **short, relevant, and legible**. Hebrew text must be correct, real, and right-to-left; garbled, mirrored or pseudo-letters are a rejection reason. If legible text cannot be guaranteed, remove the text.
- It must **not turn the image into a cluttered infographic**. If the job needs labeled steps or data, use a diagram or a screenshot instead (see roles, section 8).
- No baked-in English UI text on Hebrew articles (spec 1.3).

---

## 8. Image Role Declaration (Before Generating Anything)
Before any image is generated or sourced, **declare its role** in the Visual Editorial Pass notes:
| Role | Purpose |
| :--- | :--- |
| Hero / Cover | Identity of the piece; also the social share image (1200x630-safe composition) |
| Visual metaphor | One clear idea carried by one scene |
| Explanation | Makes a mechanism understandable |
| Process | Shows a sequence or chain of actions |
| Comparison | Before / after, this vs. that |
| Diagram | Structure or relationship; prefer a real diagram over illustration |
| Story beat | A moment in the article's narrative |
| Comic moment | A light relief that still reinforces the point |

**Every image must earn its place.** Never add an image only to break up a text block. If the passage reads cleanly without one, add none. Fewer, load-bearing images beat a filled quota (spec 1.1).
The declared role also chooses the medium: a *Diagram* or *Explanation of a real product mechanism* uses a screenshot or clean diagram, not a clay scene.

---

## 9. Boundary with Alt Text, Captions & Metadata
- **Style vocabulary lives only in image prompts and design notes.** Words such as `פלסטלינה`, `איור תלת ממדי`, `דמות פלסטלינה`, "clay" or "stop-motion" never appear in `alt` attributes (`AGENTS.md` 2.2; enforced by `validate-article-ready.cjs`).
- `alt` describes the **business situation or CRM mechanism** in search-intent language. The scene's metaphor is described by what it means for the business, not by how it is made.
- Explanatory `figcaption` (preceded by `💡`) remains encouraged and explains the business context in human terms.

---

## 10. Pre-Generation Checklist
1. Role declared (section 8) and the image earns its place.
2. Core idea stated in one sentence; the scene is understandable without the headline.
3. Metaphor is original (not "person in an office"); characters serve the idea.
4. Varies from the recent images in angle, cast, environment, metaphor and accent color.
5. Israeli feel is situational only (no flags, symbols, Stars of David, clichéd blue-white).
6. Warm light, earthy palette, tactile materials, brand blues as accents, diorama depth.
7. Text minimal, natural to the story, short and legible (or removed).
8. Not photorealistic; not stock-like; not childish; not a cluttered infographic.
9. Alt text written per `AGENTS.md` 2.2 with no art-medium words.
10. Delivery follows the existing performance rules (modern format, explicit width and height, reserved space).
