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
   - **Ingestion is not finished without the bidirectional internal-linking audit** (outbound + inbound; blocking): [article-ingestion-protocol.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/specs/article-ingestion-protocol.md) §4.2.
5. **Delivery Workflow** ([delivery-workflow.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/delivery-workflow.md)):
   - Every work branch is temporary. After merge to `master` + passing tests + post-deployment verification, delete it locally and on GitHub and prune. Merge is not complete until branch cleanup is complete.
   - After every significant batch: build and test, upload a Preview Deployment, return a live direct URL and a short summary, then STOP and ask: "האם לבצע merge ל-master, או שיש הערות / תיקונים?". Never merge before explicit owner approval.
6. **Motion & Visual Storytelling** (Design OS):
   - Motion is progressive enhancement only; nothing depends on animation, JS or scroll to exist or be readable: [motion-system.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/motion-system.md).
   - Brand images follow the witty, idea-first, clay / stop-motion visual language; declare each image's role first; style words never go in `alt`: [visual-storytelling.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/visual-storytelling.md).
7. **Crawlable Link Semantics** ([crawlable-link-semantics.md](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/.agents/rules/crawlable-link-semantics.md)):
   - Navigation to another URL must render a valid, crawlable `<a href>` (use `InternalLink` / `Button href`). `button` is for actions. Every page intended for indexing must receive a regular internal link from a relevant page. Enforced by `npm run test:links:source` (prebuild) and `npm run test:links` (release gate Step 12).
8. **Architectural Invariant**:
   - Do not casually modify Site OS infrastructure, tests, or routing schemas during routine article ingestion. The Site OS automatically derives routes, sitemaps, Markdown mirrors, and LLM indices from `src/data/articles.ts` and `src/data/knowledgeGraph.ts`.
