import React from 'react';
import { getApprovedPublicHubs } from '../data/knowledgeGraph';
import { ModalPresentationOptions } from '../types/attribution';

interface FooterProps {
    onNavigate?: (path: string) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBookingModal, onOpenContactModal }) => {
    const approvedHubs = getApprovedPublicHubs();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (onNavigate && href.startsWith('/')) {
            e.preventDefault();
            onNavigate(href);
        }
    };

    return (
        <footer id="footer" className="py-14 bg-white text-center border-t border-gray-100" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <a 
                    href="/" 
                    onClick={(e) => handleLinkClick(e, '/')}
                    className="hover:opacity-80 transition-opacity mb-6 inline-block"
                >
                    <img
                        className="h-12 w-auto"
                        src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                        alt="לוגו אלטרוביז CRM - מערכת לניהול לקוחות, שיווק ואוטומציה עסקית"
                    />
                </a>

                <p className="text-gray-600 mb-6 font-medium max-w-md">
                    אלטרוביז CRM. כל מה שצריך כדי להכניס את השיטה לסיסטם - בוטים, אוטומציות וחיבורי WhatsApp חכמים.
                </p>

                {/* Approved Knowledge Hubs Bar - Centralized from Knowledge Graph */}
                <div className="border-t border-slate-100 pt-5 pb-3 w-full max-w-4xl mb-6">
                    <div className="text-xs text-slate-500 font-bold mb-3">
                        נושאי ידע ופתרונות עומק:
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
                        {approvedHubs.map(hub => (
                            <a 
                                key={hub.slug}
                                href={hub.url} 
                                onClick={(e) => handleLinkClick(e, hub.url)}
                                className="text-slate-700 hover:text-primary transition-colors font-medium bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs"
                            >
                                {hub.shortLabel || hub.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigation and Resources links */}
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mb-6 text-sm">
                    <button 
                        type="button"
                        onClick={() => {
                            if (onOpenBookingModal) {
                                onOpenBookingModal({
                                    title: 'קביעת פגישה לבדיקת התאמה אישית',
                                    subtitle: 'נשמח להכיר את הפעילות שלכם ולבדוק התאמה לפתרונות AltruBiz CRM.',
                                    badge: 'תיאום פגישה ביומן',
                                    attribution: {
                                        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
                                        sourceSection: 'footer',
                                        intent: 'schedule_meeting',
                                        ctaType: 'meeting',
                                        sourceLabel: 'קביעת פגישה ביומן (Footer)'
                                    }
                                });
                            } else if (onNavigate) {
                                onNavigate('/#contact');
                            }
                        }}
                        className="text-primary hover:text-blue-700 transition-colors font-bold cursor-pointer"
                    >
                        קביעת פגישה ביומן
                    </button>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="/#contact" 
                        onClick={(e) => {
                            if (onOpenContactModal && window.location.pathname !== '/') {
                                e.preventDefault();
                                onOpenContactModal();
                            } else {
                                handleLinkClick(e, '/#contact');
                            }
                        }}
                        className="text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer"
                    >
                        יצירת קשר
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="/about" 
                        onClick={(e) => handleLinkClick(e, '/about')}
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        אודות AltruBiz
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="/#faq" 
                        onClick={(e) => handleLinkClick(e, '/#faq')}
                        className="text-gray-600 hover:text-primary transition-colors"
                    >
                        שאלות נפוצות
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="/articles" 
                        onClick={(e) => handleLinkClick(e, '/articles')}
                        className="text-primary font-semibold hover:underline"
                    >
                        מרכז ידע ומאמרים
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="/articles/whatsapp-messaging-guidelines" 
                        onClick={(e) => handleLinkClick(e, '/articles/whatsapp-messaging-guidelines')}
                        className="text-gray-600 hover:text-primary transition-colors"
                    >
                        מדריך דיוור WhatsApp ו-Meta
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="https://mkt.altrubiz.co.il/terms" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-primary transition-colors"
                    >
                        מדיניות פרטיות
                    </a>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <a 
                        href="https://mkt.altrubiz.co.il/terms" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-500 hover:text-primary transition-colors"
                    >
                        תנאי שימוש
                    </a>
                </div>

                <p className="text-gray-400 text-xs">
                    © AltruBiz CRM. כל הזכויות שמורות.
                </p>
            </div>
        </footer>
    );
};
