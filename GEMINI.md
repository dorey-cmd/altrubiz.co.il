# AltruBiz Project Instructions (GEMINI.md)

See [AGENTS.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/AGENTS.md) and [.agents/rules/geo-llm-readiness.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/geo-llm-readiness.md) for full project architecture and GEO / AEO / LLM-readiness requirements.

### Quick Reminders:
1. **Never hardcode routes**: All routes are declared in `src/lib/routes.ts` or `src/data/articles.ts`.
2. **Never skip validation**: Always run `npm run test:geo` before completing any routing or content task.
3. **Build pipeline is strictly guarded**: `npm run build` will fail if any GEO requirement or canonical link is broken.
4. **LLM Mirrors**: When creating or modifying articles, run `npm run articles:sync-md` (or run `npm run build` which runs it automatically).
5. **Always Unisex Phrasing**: All copy, buttons, and UI must be naturally gender-neutral without slashes (no `קרא/י` etc.). See [`.agents/rules/unisex-copy-standard.md`](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/unisex-copy-standard.md).

