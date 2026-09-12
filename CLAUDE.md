# AltruBiz Agent Bridge (CLAUDE.md)

Welcome. You are operating inside the **AltruBiz Site OS** (`altrubiz.co.il`).
The repository is the durable source of truth. Always comply with existing rules and specifications.

---

## Operating Instructions for AI Agents:

1. **Read Core Governance First**:
   - Master rules & invariants: [AGENTS.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/AGENTS.md)
   - Detailed rules: `.agents/rules/*.md`
2. **Read the Authoritative Article Protocol**:
   - Follow: [article-ingestion-protocol.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-ingestion-protocol.md)
   - Downstream distribution: [content-distribution-pipeline.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/content-distribution-pipeline.md)
3. **Lifecycle Semantics**:
   - All new articles start strictly in `publicationStatus: 'review'` and `indexable: false`.
   - Work on a dedicated review branch: `content/review/<public-slug>`.
   - Never publish or index content without explicit owner approval.
4. **Editorial Review Loop Actions**:
   - **COMMENTS**: Revise the content on the *same* review branch according to the owner's feedback.
   - **DISCARD**: Abandon the candidate branch cleanly. Never touch `master`.
   - **PUBLISH**: Explicit owner approval received. Run `npm run release:gate` *before* merging to `master` and deploying to production.
5. **Architectural Invariant**:
   - Do not casually modify Site OS infrastructure, tests, or routing schemas during routine article ingestion. The Site OS automatically derives routes, sitemaps, Markdown mirrors, and LLM indices from `src/data/articles.ts` and `src/data/knowledgeGraph.ts`.
