import React, { useEffect } from 'react';
import { X, Calendar, MessageCircle } from 'lucide-react';
import { CTAContext } from '../../types/attribution';
import { buildAttributedIframeUrl, buildAttributedWhatsAppUrl } from '../../lib/attribution';

export interface BookingModalOptions {
    title?: string;
    subtitle?: string;
    badge?: string;
    whatsappPrefill?: string;
    attribution?: CTAContext;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    badge?: string;
    whatsappPrefill?: string;
    attribution?: CTAContext;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    title = 'קביעת פגישה: בדיקת התאמה אישית',
    subtitle = 'בחרו מועד שנוח לכם ביומן ונשוחח על האתגרים בעסק ואיך לחבר פתרון אוטומטי מותאם.',
    badge = 'תיאום פגישה ביומן',
    whatsappPrefill = 'שלום צוות AltruBiz, אשמח לתאם פגישה ולבדוק התאמה לעסק שלנו',
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

            // Dynamically load the GHL iframe resizer script
            const scriptId = 'ghl-form-embed-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://link.altrubiz.co.il/js/form_embed.js';
                script.type = 'text/javascript';
                script.async = true;
                document.body.appendChild(script);
            }
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
        'https://link.altrubiz.co.il/widget/booking/afkzW0ORpY08WTgmcfqU',
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
            aria-labelledby="booking-modal-title"
        >
            {/* Dark Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog Content - Substantially wider on desktop for spacious calendar */}
            <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-200">
                {/* Accent Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-cyan-500 to-emerald-400 w-full" />

                {/* Header - Compact on mobile */}
                <div className="p-4 sm:p-7 pb-3 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-[11px] font-bold border border-blue-100">
                            <Calendar size={12} className="text-secondary" />
                            <span>{badge}</span>
                        </div>
                        <h2 
                            id="booking-modal-title"
                            className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight"
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-2xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 touch-manipulation"
                        aria-label="סגירת חלונית תיאום פגישה"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Calendar Embed Container - Spacious, no nested unnecessary borders */}
                <div className="p-1 sm:p-6 overflow-y-auto flex-1 bg-white min-h-[520px] sm:min-h-[660px]">
                    <iframe
                        src={iframeSrc}
                        allow="payment"
                        style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '640px' }}
                        scrolling="no"
                        id="afkzW0ORpY08WTgmcfqU_1789070076545"
                        title="קביעת פגישה ביומן AltruBiz"
                    />
                </div>

                {/* Footer Bar: Secondary Subtle WhatsApp Helper */}
                <div className="py-2.5 px-4 sm:px-8 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="text-slate-500 text-xs text-center sm:text-right">
                        בחרו תאריך ושעה שנוחים לכם ביומן להמשך התיאום
                    </span>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-emerald-600 font-medium transition-colors text-xs py-1"
                    >
                        <MessageCircle size={14} className="text-[#25D366]" />
                        <span>לא מצאתם מועד שנוח לכם? אפשר לתאם ישירות בוואטסאפ</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
