# Machine Knowledge Surface & LLM Representation Specification

## 1. Architectural Principles

### 1.1 HTML is Primary, Markdown is Companion
- **Primary Public Representation**: Canonical HTML page (`https://altrubiz.co.il/<publicPath>`).
- **Machine Retrieval Companion**: Plaintext Markdown mirror (`https://altrubiz.co.il/<publicPath>.md`).
- **Identity Invariant**: The machine companion is an alternate view of the exact same underlying knowledge entity, NEVER a competing canonical page.
- **Canonical Attribution**: Every Markdown mirror's YAML frontmatter must specify `canonical_url: "https://altrubiz.co.il/<publicPath>"`.

### 1.2 Deterministic Machine Translation of Semantic Concepts
Editorial content utilizes internal semantic tags (`[פייפליין](concept:pipeline)`). The generator (`scripts/sync-articles-md.cjs`) translates these deterministically:
1. **State A (Approved Public Destination)**:
   - Replaced with absolute canonical Markdown link: `[פייפליין](https://altrubiz.co.il/sales-pipeline)`.
   - Never outputs relative or internal pseudo-syntax.
2. **State B (Defined Concept Without Standalone Page)**:
   - Replaced with clean prose: `מערכת CRM`.
   - Never invents pseudo-pages (e.g. `/crm` or `/lead`).
   - Appends a compact machine glossary (`## מושגים שמופיעים במאמר`) at the bottom with definitions derived strictly from `src/data/knowledgeGraph.ts`.
3. **State C (Plain Prose)**:
   - Remains plain prose without links ("Link for understanding, not for occurrence").
4. **Zero Pseudo-Links**:
   - `concept:*` is strictly forbidden from appearing in any public Markdown artifact, `llms.txt`, or `llms-full.txt`.

### 1.3 Machine Companion URL Routing & Indexability
- Public machine mirrors are generated directly to `public/<cleanPublicPath>.md` (matching `publicPath`).
- Legacy machine paths (`/articles/:slug.md`) are permanently redirected via 301/308 in `vercel.json` and `public/_redirects` to `/:cleanPublicPath.md`.
- **Search Engine Indexing Control**:
  - `vercel.json` applies HTTP header `X-Robots-Tag: noindex, follow` to all `/(.*)\.md` files.
  - Companion Markdown files are NEVER included in `public/sitemap.xml`.
  - Crawling is allowed for AI retrieval; index competition with HTML is eliminated.

### 1.4 XML Sitemap Invariant
- `public/sitemap.xml` contains EXCLUSIVELY approved canonical indexable HTML destinations (zero `.md`, zero `.txt`, zero hash fragments).

### 1.5 LLM Discovery Architecture
1. **`public/llms.txt`**:
   - Concise machine navigation map.
   - Summarizes organization profile, 5 Knowledge Hubs, Unified Inbox / Omnichannel distinction, and links to article `.md` machine companions.
2. **`public/llms-full.txt`**:
   - Comprehensive machine context document.
   - Contains organization overview, 5 Hubs with diagnostic questions, canonical concepts (State A vs State B), and the full clean Markdown bodies of all approved public articles.
   - Completely synchronized and deterministically generated via `scripts/generate-llms-txt.cjs`.

### 1.6 Unified Inbox vs. WhatsApp Separation
- **Unified Inbox / Omnichannel**: Canonical concept (`unified-inbox`) with approved public destination `/unified-inbox` (`/unified-inbox.md`). Represents the multi-channel customer conversation unifying WhatsApp, Instagram, Facebook Messenger, SMS, and email.
- **WhatsApp in CRM**: Dedicated channel topic (`whatsapp-in-crm`) with public destination `/whatsapp-in-crm` (`/whatsapp-in-crm.md`). Represents the specific WhatsApp Business API messaging channel, Meta policies, and template rules.
