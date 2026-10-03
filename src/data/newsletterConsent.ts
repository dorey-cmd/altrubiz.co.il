/**
 * AltruBiz Central Newsletter Consent Registry (SiteOS)
 * 
 * Single Source of Truth for "מועדון המהלך הבא" (Next Move Club) newsletter consent:
 * - Version identifier
 * - Authoritative legal consent phrasing
 * - Legal routes (Privacy Policy, Terms of Use)
 * - Metadata definitions
 */

export interface NewsletterConsentDefinition {
    consentVersion: string;
    consentText: string;
    privacyUrl: string;
    termsUrl: string;
    privacyLinkText: string;
    termsLinkText: string;
    clubName: string;
}

export const NEWSLETTER_CONSENT_CONFIG: NewsletterConsentDefinition = {
    consentVersion: 'newsletter-consent-v1',
    consentText: 'אני מאשר/ת לקבל מ-AltruBiz עדכונים, מידע ותוכן חשוב ורלוונטי. פרטיי לא יימסרו לצדדים שלישיים לצורכי שיווק שלהם, והשימוש בהם ייעשה בהתאם למדיניות הפרטיות ולתנאי האתר.',
    privacyUrl: '/privacy-policy',
    termsUrl: '/terms-of-use',
    privacyLinkText: 'מדיניות הפרטיות',
    termsLinkText: 'תנאי האתר',
    clubName: 'מועדון המהלך הבא'
};
