
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WhatsAppFloat } from './components/WhatsAppFloat'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Benefits, Extras } from './components/Benefits'
import { Integrations } from './components/Integrations'
import { Pricing } from './components/Pricing'
import { ContactForm } from './components/ContactForm'
import { Footer } from './components/Footer'
import { Spotlight } from './components/Spotlight'

import { StarDust } from './components/StarDust'

function App() {
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
                <Pricing />
                <ContactForm />
            </main>
            <Footer />
        </div>
    )
}

export default App
