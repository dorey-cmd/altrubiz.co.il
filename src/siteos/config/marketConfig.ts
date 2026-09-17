import type { MarketId } from '../identity';

/**
 * MarketConfig — the authoritative configuration boundary for a market
 * (domain, locale, currency, contact channels, commercial defaults).
 * CENTRAL BY DEFAULT; EXPLICIT OVERRIDE ONLY WHEN JUSTIFIED (Phase 3
 * brief sec.6-7). Batch 1 populates Israel only (see markets/il.ts),
 * reproducing current production values exactly. No existing consumer
 * (SEOHead.tsx, BookingModal.tsx, ContactModal.tsx, PricingModal.tsx,
 * analytics.ts, clarity.ts, etc.) is repointed at this config in this
 * batch — see .agents/specs/siteos-foundation-architecture.md for the
 * intended migration sequencing.
 */
export interface MarketContactChannels {
    /** Raw digits for wa.me links, e.g. "972544350000". */
    whatsapp: string;
    /** Human-readable form of `whatsapp`, for display next to a WhatsApp link/label. */
    whatsappDisplay: string;
    /** The business's general published phone number (e.g. as listed on Google) - distinct from `whatsapp`. */
    phone: string;
    email: string;
}

export interface MarketBookingWidget {
    provider: 'gohighlevel';
    bookingWidgetUrl: string;
    contactWidgetUrl: string;
}

export interface MarketCheckoutProvider {
    name: string;
    baseUrl: string;
}

export interface MarketLegalEntity {
    name: string;
    alternateName?: string[];
    termsUrl: string;
    privacyUrl: string;
}

export interface MarketAnalyticsConfig {
    ga4MeasurementId: string;
    clarityProjectId: string;
}

export interface MarketConfig {
    id: MarketId;
    country: string;
    language: string;
    locale: string;
    direction: 'ltr' | 'rtl';
    domain: string;
    currency: string;
    contactChannels: MarketContactChannels;
    bookingWidget: MarketBookingWidget;
    checkoutProvider: MarketCheckoutProvider;
    legalEntity: MarketLegalEntity;
    analytics: MarketAnalyticsConfig;
}
