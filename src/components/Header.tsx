import { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
    onNavigate?: (path: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (onNavigate) {
            e.preventDefault();
            setIsMenuOpen(false);
            onNavigate(href);
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
                            alt="AltruBiz Logo"
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 mx-auto">
                        <a 
                            href="/#benefits" 
                            onClick={(e) => handleLinkClick(e, '/#benefits')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            יתרונות
                        </a>
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
                            href="/#pricing" 
                            onClick={(e) => handleLinkClick(e, '/#pricing')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            מחירים
                        </a>
                        <a 
                            href="/#faq" 
                            onClick={(e) => handleLinkClick(e, '/#faq')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            שאלות נפוצות
                        </a>
                        <a 
                            href="/about" 
                            onClick={(e) => handleLinkClick(e, '/about')}
                            className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                        >
                            אודות
                        </a>
                        <a 
                            href="/articles" 
                            onClick={(e) => handleLinkClick(e, '/articles')}
                            className="inline-flex items-center gap-1.5 text-primary hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1 rounded-full transition-colors text-sm font-semibold border border-blue-200/60"
                        >
                            <BookOpen size={14} />
                            <span>מאמרים וידע</span>
                        </a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">התחברות</Button>
                        </a>
                        <a href="/#pricing" onClick={(e) => handleLinkClick(e, '/#pricing')}>
                            <Button variant="primary" size="sm">התחל עכשיו</Button>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-primary p-2"
                            aria-label="תפריט ניווט"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-200 shadow-xl">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a 
                            href="/#benefits" 
                            onClick={(e) => handleLinkClick(e, '/#benefits')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            יתרונות
                        </a>
                        <a 
                            href="/#how-it-works" 
                            onClick={(e) => handleLinkClick(e, '/#how-it-works')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            איך זה עובד
                        </a>
                        <a 
                            href="/#why-altrubiz" 
                            onClick={(e) => handleLinkClick(e, '/#why-altrubiz')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            למה אלטרוביז?
                        </a>
                        <a 
                            href="/#pricing" 
                            onClick={(e) => handleLinkClick(e, '/#pricing')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            מחירים
                        </a>
                        <a 
                            href="/#faq" 
                            onClick={(e) => handleLinkClick(e, '/#faq')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            שאלות נפוצות
                        </a>
                        <a 
                            href="/about" 
                            onClick={(e) => handleLinkClick(e, '/about')}
                            className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md"
                        >
                            אודות AltruBiz
                        </a>
                        <a 
                            href="/articles" 
                            onClick={(e) => handleLinkClick(e, '/articles')}
                            className="block px-3 py-2 text-primary font-semibold hover:bg-blue-50 rounded-md flex items-center gap-2"
                        >
                            <BookOpen size={16} />
                            <span>מרכז ידע ומאמרים</span>
                        </a>

                        <div className="mt-4 flex flex-col gap-3 px-3">
                            <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" className="justify-start text-gray-600 w-full">התחברות</Button>
                            </a>
                            <a href="/#pricing" onClick={(e) => handleLinkClick(e, '/#pricing')}>
                                <Button variant="primary" className="justify-center w-full">התחל עכשיו</Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
