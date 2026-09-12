import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Benefits, Extras } from './components/Benefits'
import { Integrations } from './components/Integrations'
import { PricingNew } from './components/PricingNew'
import { PricingOffer } from './components/PricingOffer'
import { FAQSection } from './components/FAQSection'
import { ContactForm } from './components/ContactForm'
import { Footer } from './components/Footer'
import { Spotlight } from './components/Spotlight'
import { StarDust } from './components/StarDust'
import { ArticlesIndex } from './components/articles/ArticlesIndex'
import { ArticlePage } from './components/articles/ArticlePage'
import { AboutPage } from './components/AboutPage'
import { SEOHead } from './components/common/SEOHead'
import { HubPage } from './components/knowledge/HubPage'
import { getRouteConfig } from './lib/routes'
import { ContactModal } from './components/common/ContactModal'
import { PricingModal } from './components/common/PricingModal'
import { BookingModal } from './components/common/BookingModal'
import { ModalPresentationOptions } from './types/attribution'

function App() {
    const [path, setPath] = useState(window.location.pathname);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactModalOptions, setContactModalOptions] = useState<ModalPresentationOptions | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingModalOptions, setBookingModalOptions] = useState<ModalPresentationOptions | null>(null);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    const handleOpenContactModal = useCallback((options?: ModalPresentationOptions) => {
        if (options) {
            setContactModalOptions(options);
        } else {
            setContactModalOptions(null);
        }
        setIsContactModalOpen(true);
    }, []);

    const handleCloseContactModal = useCallback(() => {
        setIsContactModalOpen(false);
    }, []);

    const handleOpenBookingModal = useCallback((options?: ModalPresentationOptions) => {
        if (options) {
            setBookingModalOptions(options);
        } else {
            setBookingModalOptions(null);
        }
        setIsBookingModalOpen(true);
    }, []);

    const handleCloseBookingModal = useCallback(() => {
        setIsBookingModalOpen(false);
    }, []);

    const handleOpenPricingModal = useCallback(() => {
        setIsPricingModalOpen(true);
    }, []);

    const handleClosePricingModal = useCallback(() => {
        setIsPricingModalOpen(false);
    }, []);

    const handleNavigate = useCallback((targetPath: string) => {
        // If requesting contact form while not on homepage, open the styled popup modal
        if (targetPath === '/#contact' || targetPath === '#contact') {
            if (window.location.pathname !== '/') {
                setIsContactModalOpen(true);
                return;
            }
        }

        // If hash on home page, handle scroll or navigate
        if (targetPath.startsWith('/#')) {
            if (window.location.pathname !== '/') {
                window.history.pushState({}, '', targetPath);
                setPath('/');
                setTimeout(() => {
                    const id = targetPath.replace('/#', '');
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const id = targetPath.replace('/#', '');
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        window.history.pushState({}, '', targetPath);
        setPath(targetPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const handleLocationChange = () => {
            setPath(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const isOffer = path === '/offer';
    const isAbout = path === '/about';
    const isKnowledgeIndex = path === '/knowledge';

    const routeConfig = getRouteConfig(path);
    const currentArticle = routeConfig?.article || null;
    const currentHubNode = routeConfig?.hubNode || null;
    const isArticlePage = !!currentArticle;
    const isHubPage = !!currentHubNode;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200">
            {/* Declarative SEO, Canonicals, Open Graph & Structured Data Engine */}
            <SEOHead routeConfig={routeConfig} article={currentArticle} />

            <StarDust />
            <Header onNavigate={handleNavigate} onOpenBookingModal={handleOpenBookingModal} />
            <WhatsAppFloat />

            {/* Page Views */}
            {isAbout ? (
                <main className="relative z-10">
                    <AboutPage 
                        onNavigate={handleNavigate} 
                        onOpenContactModal={handleOpenContactModal} 
                        onOpenBookingModal={handleOpenBookingModal} 
                    />
                </main>
            ) : isKnowledgeIndex ? (
                <main className="relative z-10">
                    <ArticlesIndex 
                        onNavigate={handleNavigate} 
                        onOpenContactModal={handleOpenContactModal} 
                        onOpenBookingModal={handleOpenBookingModal} 
                    />
                </main>
            ) : isArticlePage && currentArticle ? (
                <main className="relative z-10">
                    <ArticlePage 
                        article={currentArticle} 
                        onNavigate={handleNavigate} 
                        onOpenContactModal={handleOpenContactModal}
                        onOpenBookingModal={handleOpenBookingModal}
                        onOpenPricingModal={handleOpenPricingModal}
                    />
                </main>
            ) : isHubPage && currentHubNode ? (
                <main className="relative z-10">
                    <HubPage 
                        node={currentHubNode} 
                        onNavigate={handleNavigate} 
                        onOpenContactModal={handleOpenContactModal}
                        onOpenBookingModal={handleOpenBookingModal}
                        onOpenPricingModal={handleOpenPricingModal}
                    />
                </main>
            ) : (
                <main className="relative z-10 transition-colors">
                    <Spotlight />
                    <Hero onNavigate={handleNavigate} onOpenBookingModal={handleOpenBookingModal} />
                    <Features onNavigate={handleNavigate} />
                    <HowItWorks onNavigate={handleNavigate} />
                    <Benefits onNavigate={handleNavigate} />
                    <Extras />
                    <Integrations onNavigate={handleNavigate} />
                    {isOffer ? <PricingOffer /> : <PricingNew />}
                    <FAQSection />
                    <ContactForm />
                </main>
            )}

            <Footer 
                onNavigate={handleNavigate} 
                onOpenBookingModal={handleOpenBookingModal}
                onOpenContactModal={handleOpenContactModal}
            />
            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={handleCloseContactModal} 
                title={contactModalOptions?.title}
                subtitle={contactModalOptions?.subtitle}
                badge={contactModalOptions?.badge}
                whatsappPrefill={contactModalOptions?.whatsappPrefill}
                attribution={contactModalOptions?.attribution}
            />
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={handleCloseBookingModal}
                title={bookingModalOptions?.title}
                subtitle={bookingModalOptions?.subtitle}
                badge={bookingModalOptions?.badge}
                whatsappPrefill={bookingModalOptions?.whatsappPrefill}
                attribution={bookingModalOptions?.attribution}
            />
            <PricingModal
                isOpen={isPricingModalOpen}
                onClose={handleClosePricingModal}
                onOpenContactModal={() => handleOpenContactModal({
                    title: 'השארת פרטים לבחירת חבילה',
                    subtitle: 'נשמח להכיר את הפעילות שלכם ולהתאים את החבילה והאוטומציות המדויקות ביותר.',
                    badge: 'בדיקת התאמה',
                    attribution: {
                        sourcePage: path,
                        sourceSection: 'pricing-modal',
                        intent: 'pricing_inquiry',
                        ctaType: 'contact',
                        sourceLabel: 'השארת פרטים לבחירת חבילה'
                    }
                })}
                onOpenBookingModal={() => handleOpenBookingModal({
                    title: 'קביעת שיחת התאמה לבחירת חבילה',
                    subtitle: 'נשמח להכיר את הפעילות שלכם ולהתאים את החבילה והאוטומציות המדויקות ביותר.',
                    badge: 'תיאום שיחה ביומן',
                    attribution: {
                        sourcePage: path,
                        sourceSection: 'pricing-modal',
                        intent: 'schedule_meeting',
                        ctaType: 'meeting',
                        sourceLabel: 'קביעת שיחת התאמה לבחירת חבילה'
                    }
                })}
            />
        </div>
    )
}

export default App
