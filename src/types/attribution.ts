/**
 * AltruBiz CTA Context & Structured Attribution Model
 * 
 * Defines the permanent schema for carrying contextual attribution
 * across all interactive touchpoints (ContactModal, BookingModal,
 * PricingModal, WhatsApp bridges, and GoHighLevel embeds).
 */

export type CTAIntent = 
    | 'lead_capture' 
    | 'schedule_meeting' 
    | 'booking'
    | 'meeting'
    | 'assessment'
    | 'pricing_inquiry' 
    | 'whatsapp_consultation' 
    | 'consultation'
    | 'contact_general'
    | 'knowledge_exploration';

export type CTAType = 
    | 'contact' 
    | 'meeting' 
    | 'pricing' 
    | 'whatsapp' 
    | 'knowledge' 
    | 'share'
    | 'inline_cta'
    | 'sidebar_cta'
    | 'bottom_banner'
    | 'mobile_nav'
    | 'modal_booking'
    | 'modal_contact'
    | 'footer_cta';

export interface CTAContext {
    /** The originating public URL or pathname (e.g. '/', '/articles/excel-to-crm-pipeline-guide') */
    sourcePage: string;
    /** The specific section ID or milestone name (e.g. 'action-03', 'hero-pain-bar', 'reality-check') */
    sourceSection?: string;
    /** The Knowledge Node slug or topic ID (e.g. 'sales-pipeline', 'lost-leads') */
    sourceNode?: string;
    /** The parent Topic Hub name or slug */
    sourceTopic?: string;
    /** The article slug if originating from an article */
    sourceArticle?: string;
    /** The hub slug if originating from a Hub */
    sourceHub?: string;
    /** The user intent trigger */
    intent?: CTAIntent;
    /** The technical CTA mechanism */
    ctaType: CTAType;
    /** Human-readable button or link text that triggered the action */
    sourceLabel?: string;
    /** Optional campaign or variant identifier */
    campaign?: string;
}

export interface ModalPresentationOptions {
    title?: string;
    subtitle?: string;
    badge?: string;
    whatsappPrefill?: string;
    attribution?: CTAContext;
}
