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
import { getArticleBySlug } from './data/articles'
import { getRouteConfig } from './lib/routes'

function App() {
    const [path, setPath] = useState(window.location.pathname);

    const handleNavigate = useCallback((targetPath: string) => {
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
    const isArticlesIndex = path === '/articles';
    const isArticlePage = path.startsWith('/articles/');

    let currentArticle = null;
    if (isArticlePage) {
        const slug = path.replace('/articles/', '').replace(/\/$/, '');
        currentArticle = getArticleBySlug(slug);
    }

    const routeConfig = getRouteConfig(path);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200 overflow-x-hidden">
            {/* Declarative SEO, Canonicals, Open Graph & Structured Data Engine */}
            <SEOHead routeConfig={routeConfig} article={currentArticle} />

            <StarDust />
            <Header onNavigate={handleNavigate} />
            <WhatsAppFloat />

            {/* Page Views */}
            {isAbout ? (
                <main className="relative z-10">
                    <AboutPage onNavigate={handleNavigate} />
                </main>
            ) : isArticlesIndex ? (
                <main className="relative z-10">
                    <ArticlesIndex onNavigate={handleNavigate} />
                </main>
            ) : isArticlePage && currentArticle ? (
                <main className="relative z-10">
                    <ArticlePage article={currentArticle} onNavigate={handleNavigate} />
                </main>
            ) : (
                <main className="relative z-10 transition-colors">
                    <Spotlight />
                    <Hero />
                    <Features />
                    <HowItWorks />
                    <Benefits />
                    <Extras />
                    <Integrations />
                    {isOffer ? <PricingOffer /> : <PricingNew />}
                    <FAQSection />
                    <ContactForm />
                </main>
            )}

            <Footer onNavigate={handleNavigate} />
        </div>
    )
}

export default App
