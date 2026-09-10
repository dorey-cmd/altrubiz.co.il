# AltruBiz Project Instructions (GEMINI.md)

See [AGENTS.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/AGENTS.md) and [.agents/rules/geo-llm-readiness.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/geo-llm-readiness.md) for full project architecture and GEO / AEO / LLM-readiness requirements.

### Quick Reminders:
1. **Never hardcode routes**: All routes are declared in `src/lib/routes.ts` or `src/data/articles.ts`.
2. **Never skip validation**: Always run `npm run test:geo` before completing any routing or content task.
3. **Build pipeline is strictly guarded**: `npm run build` will fail if any GEO requirement or canonical link is broken.
4. **LLM Mirrors**: When creating or modifying articles, run `npm run articles:sync-md` (or run `npm run build` which runs it automatically).
5. **Always Unisex Phrasing**: All copy, buttons, and UI must be naturally gender-neutral without slashes (no `קרא/י` etc.). See [`.agents/rules/unisex-copy-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/unisex-copy-standard.md).
6. **Always Business-Oriented Alt-Texts**: Never describe image art mediums (no `פלסטלינה`, `איור` וכו'). Alt texts must faithfully reflect search terms, business situations, or CRM mechanisms.
7. **Strict Brand Attribution (No Personal Names)**: Never mention `דורי`, `Dori`, or individual person names. Strictly use `צוות אלטרוביז` / `צוות AltruBiz`, `אנחנו`, `נציג של אלטרוביז`, `אלטרוביז` / `AltruBiz`.
8. **Standardized CTA & ContactModal**: The primary CTA is "קביעת פגישה למטרת איך זה יכול לעבוד אצלכם בעסק". When off the homepage, contact/booking CTAs must always trigger the styled `ContactModal` popup without taking the user out of context.
9. **Strategic CTA Distribution (5-Tier Format)**: In long articles, strategically distribute varied CTAs (`strip`, `quote-share`, `text-link`, `pricing`, `box`) with at least 2 sections spacing. Never repeat identical CTAs. See [`.agents/rules/article-cta-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/article-cta-standard.md).
10. **Connected Knowledge Topology**: Operate as a connected knowledge graph centered around business pains. Classify all nodes in `src/data/knowledgeGraph.ts`, link bidirectionally (inbound + outbound), promote Hubs only with 3+ solid articles, and never leave dead-end pages. See [`.agents/rules/knowledge-topology-architecture.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/knowledge-topology-architecture.md).


