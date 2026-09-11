import { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';
import { ModalPresentationOptions } from '../types/attribution';

interface HeaderProps {
    onNavigate?: (path: string) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
}

export const Header = ({ onNavigate, onOpenBookingModal }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (onNavigate) {
            e.preventDefault();
            setIsMenuOpen(false);
            onNavigate(href);
        }
    };

    const handleBookingClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMenuOpen(false);
        if (onOpenBookingModal) {
            onOpenBookingModal({
                title: 'קביעת פגישת בדיקת התאמה אישית',
                subtitle: 'בחרו מועד שנוח לכם ביומן ונשוחח על האתגרים בעסק ואיך לחבר פתרון אוטומטי מותאם.',
                badge: 'תיאום שיחה ביומן',
                attribution: {
                    sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
                    sourceSection: 'global-header',
                    intent: 'schedule_meeting',
                    ctaType: 'meeting',
                    sourceLabel: 'קביעת פגישה ביומן (Header)'
                }
            });
        } else if (onNavigate) {
            onNavigate('/#contact');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a 
                        href="/" 
                        onClick={(e) => handleLinkClick(e, '/')}
                        className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                            alt="לוגו AltruBiz CRM - מערכת לניהול לקוחות, אוטומציה עסקית וחיבור WhatsApp חכם"
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 mx-auto">
                        <a 
                            href="/#how-it-works" 
                            onClick={(e) => handleLinkClick(e, '/#how-it-works')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            איך זה עובד
                        </a>
                        <a 
                            href="/#why-altrubiz" 
                            onClick={(e) => handleLinkClick(e, '/#why-altrubiz')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            למה אלטרוביז?
                        </a>
                        <a 
                            href="/topics/lost-leads" 
                            onClick={(e) => handleLinkClick(e, '/topics/lost-leads')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            אבחון בריחת לידים
                        </a>
                        <a 
                            href="/articles" 
                            onClick={(e) => handleLinkClick(e, '/articles')}
                            className="inline-flex items-center gap-1.5 text-primary hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3.5 py-1 rounded-full transition-colors text-sm font-semibold border border-blue-200/60"
                        >
                            <BookOpen size={14} />
                            <span>מאמרים וידע</span>
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="font-bold"
                            onClick={handleBookingClick}
                        >
                            קביעת פגישה
                        </Button>
                        <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">התחברות</Button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-primary p-2 focus:outline-none"
                            aria-label="פתח תפריט"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-xl" dir="rtl">
                    <div className="px-3 pt-3 pb-4 space-y-2">
                        <a 
                            href="/#how-it-works" 
                            onClick={(e) => handleLinkClick(e, '/#how-it-works')}
                            className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-blue-50 rounded-lg text-base font-medium"
                        >
                            איך זה עובד
                        </a>
                        <a 
                            href="/#why-altrubiz" 
                            onClick={(e) => handleLinkClick(e, '/#why-altrubiz')}
                            className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-blue-50 rounded-lg text-base font-medium"
                        >
                            למה אלטרוביז?
                        </a>
                        <a 
                            href="/topics/lost-leads" 
                            onClick={(e) => handleLinkClick(e, '/topics/lost-leads')}
                            className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-blue-50 rounded-lg text-base font-medium"
                        >
                            אבחון בריחת לידים
                        </a>
                        <a 
                            href="/articles" 
                            onClick={(e) => handleLinkClick(e, '/articles')}
                            className="block px-3 py-2 text-primary font-semibold hover:bg-blue-50 rounded-lg flex items-center gap-2 text-base"
                        >
                            <BookOpen size={16} />
                            <span>מאמרים וידע</span>
                        </a>

                        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                            <Button 
                                variant="primary" 
                                className="w-full justify-center font-bold"
                                onClick={handleBookingClick}
                            >
                                קביעת פגישה
                            </Button>
                            <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer" className="block">
                                <Button variant="ghost" className="w-full justify-center text-gray-600">
                                    התחברות
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
