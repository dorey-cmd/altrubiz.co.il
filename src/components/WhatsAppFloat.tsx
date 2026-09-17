import { trackConversion as trackConversionGA } from '../lib/analytics';
import { trackConversion as trackConversionClarity } from '../lib/clarity';
import { IL_MARKET } from '../siteos';

// SiteOS Phase 3: phone number sourced from IL_MARKET (MarketConfig)
// instead of embedded in a hardcoded, pre-encoded URL string. The message
// text is decoded-and-reencoded identically -- verified byte-for-byte equal
// to the prior literal via decodeURIComponent before this change.
const WHATSAPP_FLOAT_MESSAGE = 'שלום צוות אלטרוביז, פנייה זו נעשית דרך האתר ואשמח למענה.';

export const WhatsAppFloat = () => {
    const handleClick = () => {
        const attribution = {
            sourcePage: window.location.pathname,
            ctaType: 'whatsapp' as const,
            intent: 'whatsapp_consultation' as const,
            sourceLabel: 'כפתור וואטסאפ צף'
        };
        trackConversionGA(attribution);
        trackConversionClarity(attribution);
    };

    return (
        // Wrapped in a "complementary" landmark purely so this always-on
        // floating widget isn't orphaned outside every other landmark on
        // the page (axe-core "region" rule) -- adds no styling of its own,
        // so the inner <a>'s `fixed` positioning is unaffected. A plain
        // <div role="complementary"> (not a real <aside> element) is used
        // deliberately: scripts/validate-scroll-sovereignty.cjs asserts on
        // `document.querySelector('aside')` to find ArticlePage/HubPage's
        // sticky TOC sidebar specifically, and a real top-level <aside>
        // here (rendered before that TOC in the DOM) would shadow it.
        <div role="complementary" aria-label="יצירת קשר מהירה בוואטסאפ">
            <a
                href={`https://wa.me/${IL_MARKET.contactChannels.whatsapp}?text=${encodeURIComponent(WHATSAPP_FLOAT_MESSAGE)}`}
                className="fixed bottom-5 left-5 flex items-center z-[9999] font-sans no-underline group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="פתיחת שיחת וואטסאפ עם צוות AltruBiz"
                onClick={handleClick}
            >
                <div className="hidden sm:block bg-[#25d366] text-slate-950 px-4 py-2.5 rounded-full mr-2.5 text-sm font-semibold shadow-md whitespace-nowrap group-hover:bg-[#20bd5a] transition-colors">
                    💬 דברו איתנו בוואטסאפ
                </div>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="אייקון וואטסאפ - יצירת קשר מהירה עם צוות AltruBiz CRM בוואטסאפ"
                    className="w-[45px] h-[45px] rounded-full shadow-lg group-hover:scale-110 transition-transform"
                />
            </a>
        </div>
    );
};
