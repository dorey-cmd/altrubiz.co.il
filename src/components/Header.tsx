import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo - Clickable to altrubiz.co.il */}
                    <a href="https://altrubiz.co.il" className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <img
                            src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                            alt="AltruBiz Logo"
                            className="h-12 md:h-16 w-auto object-contain"
                        />
                        {/* Text hidden as logo likely contains brand name, keeping span just in case but hidden on all breakpoints if needed, or just standard md:hidden */}
                        <span className="text-2xl font-bold text-primary md:hidden">
                            AltruBiz
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 mx-auto">
                        <a href="#benefits" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">יתרונות</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">איך זה עובד</a>
                        <a href="#why-altrubiz" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">למה אלטרוביז?</a>
                        <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">מחירים</a>
                    </nav>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">התחברות</Button>
                        </a>
                        <a href="#pricing">
                            <Button variant="primary" size="sm">התחל עכשיו</Button>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-primary p-2"
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
                        <a href="#benefits" className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md">יתרונות</a>
                        <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md">איך זה עובד</a>
                        <a href="#why-altrubiz" className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md">למה אלטרוביז?</a>
                        <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-md">מחירים</a>
                        <div className="mt-4 flex flex-col gap-3 px-3">
                            <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" className="justify-start text-gray-600 w-full">התחברות</Button>
                            </a>
                            <a href="#pricing">
                                <Button variant="primary" className="justify-center w-full">התחל עכשיו</Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
