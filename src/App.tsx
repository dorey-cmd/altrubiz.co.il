import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Benefits, Extras } from './components/Benefits'
import { Integrations } from './components/Integrations'
import { PricingNew } from './components/PricingNew'
import { PricingOffer } from './components/PricingOffer'
import { ContactForm } from './components/ContactForm'
import { Footer } from './components/Footer'
import { Spotlight } from './components/Spotlight'
import { StarDust } from './components/StarDust'

function App() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const originalTitle = "Altrubiz CRM | המערכת המושלמת לניהול העסק";

        const handleLocationChange = () => {
            const currentPath = window.location.pathname;
            setPath(currentPath);

            // Handle noindex for /offer
            if (currentPath === '/offer') {
                document.title = "AltruBiz | Offer";
                let meta = document.querySelector('meta[name="robots"]');
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('name', 'robots');
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', 'noindex, nofollow');
            } else {
                document.title = originalTitle;
                const meta = document.querySelector('meta[name="robots"]');
                if (meta) {
                    meta.remove();
                }
            }
        };

        window.addEventListener('popstate', handleLocationChange);
        handleLocationChange(); // Run on mount

        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    const isOffer = path === '/offer';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yellow-200 overflow-x-hidden">
            <StarDust />
            <Header />
            <Spotlight />
            <main className="relative z-10 transition-colors">
                <Hero />
                <WhatsAppFloat />
                <Features />
                <HowItWorks />
                <Benefits />
                <Extras />
                <Integrations />
                {isOffer ? <PricingOffer /> : <PricingNew />}
                <ContactForm />
            </main>
            <Footer />
        </div>
    )
}

export default App
