# AltruBiz Content Distribution Pipeline & Post-Publish Architecture

This document defines the architecture and contracts for distributing canonical website content to downstream marketing and operational channels (GHL Email, GHL Social Planner, WhatsApp, short-form video).

---

## 1. Architectural Principles

1. **The Article is the Authoritative Source Knowledge**:
   Every downstream asset (newsletter, social thread, WhatsApp broadcast snippet) is a derived channel-specific representation of an approved canonical article. Downstream channels do NOT maintain independent knowledge bases.
2. **Failure Isolation**:
   The website is the permanent anchor. If an external distribution channel fails (e.g. GHL API error, network timeout, rate limit), the website publication remains 100% intact and published. The channel status transitions to `failed` and is queued for retry.
3. **Event Timing Guardrail**:
   The `content.published` event must NEVER be emitted before successful verification of the deployed production website article.
4. **Provider-Agnostic Contract**:
   The distribution foundation does not hardcode vendor-specific APIs into frontend code. Contracts remain durable whether orchestrated via Claude Code, Gemini, GitHub Actions, Make, or custom workers.

---

## 2. The content.published Event

Emitted when an article transitions from review to verified production status:

```typescript
export interface ContentPublishedEventResult {
    success: boolean;
    eventId: string;
    articleId: string;
    publishedAt: string;
    manifest: DistributionManifest;
    message: string;
    downstreamEligible: boolean;
}
```

---

## 3. The Distribution Manifest Contract

The `DistributionManifest` encapsulates all contextual metadata required for multi-channel derivation:

```typescript
export interface DistributionManifest {
    articleId: string; // slug
    publicPath: string; // e.g. /excel-to-pipeline
    canonicalUrl: string; // https://altrubiz.co.il/excel-to-pipeline
    productionUrl: string;
    title: string;
    seoTitle: string;
    description: string;
    heroSummary: string;
    keyTakeaway: string;
    parentHub?: {
        slug: string;
        title: string;
        url: string;
    };
    relevantConcepts: string[];
    primaryImage?: {
        src: string;
        alt: string;
    };
    ogImage?: string;
    publicationDate: string;
    sourceLanguage: 'he';
    primaryCtaIntent: string;
    publishedAt: string;
    channels: {
        website: ChannelDistributionState;
        email: ChannelDistributionState;
        social: ChannelDistributionState;
        whatsapp?: ChannelDistributionState;
    };
}
```

---

## 4. Downstream Channel Status Lifecycle

Each distribution channel maintains its own independent state:

| Status | Meaning |
| :--- | :--- |
| `pending` | Eligible for derivation; waiting for worker pickup |
| `generated` | Channel copy created (email body, social post text) |
| `review` | Optional editorial review of channel draft |
| `scheduled` | Scheduled in provider calendar (e.g. GHL Social Planner) |
| `published` / `sent` | Delivered or published on the destination network |
| `failed` | Processing error occurred; website remains published; retry eligible |
| `skipped` | Channel intentionally bypassed for this content type |

---

## 5. Extension Points (Ready for Future Implementation)

### 5.1 GHL Email Campaign Extension Point:
- **Trigger**: `manifest.channels.email.status === 'pending'`
- **Derivation**: AI agent or worker synthesizes a focused newsletter in Hebrew highlighting the core business dilemma, the article's 10-minute test or quick win, and a direct CTA link back to the canonical HTML route.
- **Attribution**: Preserves `utm_source=ghl_email`, `utm_medium=newsletter`, and `sourceArticle` context.
- **Status Update**: Transitions from `pending` to `scheduled` or `sent`.

### 5.2 GHL Social Planner Extension Point:
- **Trigger**: `manifest.channels.social.status === 'pending'`
- **Derivation**: Generates network-adapted copy (LinkedIn professional narrative, Facebook discussion prompt, Instagram carousel summary).
- **Attribution**: Includes canonical article link and OpenGraph image reference.
- **Status Update**: Transitions to `scheduled` in GHL Social Planner.
