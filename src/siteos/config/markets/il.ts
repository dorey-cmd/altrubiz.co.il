import type { MarketConfig } from '../marketConfig';
import { asMarketId } from '../../identity';

/**
 * Israel MarketConfig — the only active market in Batch 1.
 *
 * Every value below reproduces CURRENT production behavior exactly, as
 * verified in Phase 1/1.5 against: src/lib/seo.ts (telephone, areaServed),
 * src/components/common/BookingModal.tsx (booking widget URL),
 * src/components/common/ContactModal.tsx (contact widget URL),
 * src/components/common/PricingModal.tsx (checkout base URL),
 * src/components/Footer.tsx (terms/privacy URL), src/lib/analytics.ts
 * (GA4 measurement ID), src/lib/clarity.ts (Clarity project ID).
 *
 * This record is NOT yet consumed by any existing component — its
 * existence here changes no visible behavior. It exists so a future
 * migration batch has one place to repoint those files at, and so a
 * second market's MarketConfig has a concrete, correct template to match
 * the shape of.
 */
export const IL_MARKET: MarketConfig = {
    id: asMarketId('il'),
    country: 'Israel',
    language: 'he',
    locale: 'he-IL',
    direction: 'rtl',
    domain: 'https://altrubiz.co.il',
    currency: 'ILS',
    contactChannels: {
        whatsapp: '972544350000',
        phone: '+972-54-435-0000',
        email: 'support@altrubiz.co.il',
    },
    bookingWidget: {
        provider: 'gohighlevel',
        bookingWidgetUrl: 'https://link.altrubiz.co.il/widget/booking/afkzW0ORpY08WTgmcfqU',
        contactWidgetUrl: 'https://link.altrubiz.co.il/widget/form/QAHIbtkoD9k8JUIs8uKD',
    },
    checkoutProvider: {
        name: 'invoice4u',
        baseUrl: 'https://private.invoice4u.co.il',
    },
    legalEntity: {
        name: 'AltruBiz',
        alternateName: ['אלטרוביז', 'AltruBiz CRM'],
        termsUrl: 'https://mkt.altrubiz.co.il/terms',
        privacyUrl: 'https://mkt.altrubiz.co.il/terms',
    },
    analytics: {
        ga4MeasurementId: 'G-YHP284ETF9',
        clarityProjectId: 'yj55u92ks2',
    },
};
