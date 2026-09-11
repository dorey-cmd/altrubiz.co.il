import React, { useEffect } from 'react';
import { X, MessageCircle, Sparkles } from 'lucide-react';
import { CTAContext } from '../../types/attribution';
import { buildAttributedIframeUrl, buildAttributedWhatsAppUrl } from '../../lib/attribution';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    badge?: string;
    whatsappPrefill?: string;
    attribution?: CTAContext;
}

export const ContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    onClose,
    title = 'יצירת קשר והשארת פרטים',
    subtitle = 'השאירו פרטים ונחזור אליכם בהקדם כדי להבין את צורכי העסק שלכם ולבדוק התאמה לפתרונות AltruBiz.',
    badge = 'השארת פרטים',
    whatsappPrefill = 'שלום צוות AltruBiz, השארתי פרטים באתר ואשמח שנשוחח',
    attribution
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const iframeSrc = buildAttributedIframeUrl(
        'https://link.altrubiz.co.il/widget/form/QAHIbtkoD9k8JUIs8uKD',
        attribution
    );

    const whatsappUrl = buildAttributedWhatsAppUrl(
        '972544350000',
        whatsappPrefill,
        attribution
    );

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
        >
            {/* Dark Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog Content */}
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-200">
                {/* Accent Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-blue-500 to-amber-400 w-full" />

                {/* Header - Compact on mobile */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-[11px] font-bold border border-blue-100">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>{badge}</span>
                        </div>
                        <h2 
                            id="contact-modal-title"
                            className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight"
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-2xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 touch-manipulation"
                        aria-label="סגירת חלונית יצירת קשר"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Container (Homepage Iframe) */}
                <div className="p-2 sm:p-5 overflow-y-auto flex-1 bg-white">
                    <div className="bg-slate-50/50 rounded-2xl p-1 border border-slate-100 h-[520px] sm:h-[590px]">
                        <iframe
                            src={iframeSrc}
                            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }}
                            id="modal-inline-QAHIbtkoD9k8JUIs8uKD"
                            data-layout="{'id':'INLINE'}"
                            data-trigger-type="alwaysShow"
                            data-activation-type="alwaysActivated"
                            data-deactivation-type="neverDeactivate"
                            data-form-name="קביעת פגישה באתר"
                            data-height="557"
                            data-form-id="QAHIbtkoD9k8JUIs8uKD"
                            title="טופס יצירת קשר והשארת פרטים AltruBiz"
                        />
                    </div>
                </div>

                {/* Footer Bar: WhatsApp Fast Channel */}
                <div className="p-3 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs sm:text-sm">
                    <div className="text-slate-500 text-center sm:text-right text-xs">
                        מעדיפים לשוחח ישירות? צוות AltruBiz זמין עבורכם
                    </div>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 text-xs sm:text-sm w-full sm:w-auto"
                    >
                        <MessageCircle size={15} />
                        <span>פנייה ישירה בוואטסאפ</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
