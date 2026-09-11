import { motion } from 'framer-motion';

const logos = [
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67af641f237ce2563df82508.png", alt: "אינטגרציית WhatsApp Business עם AltruBiz CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a579284bbe3b6a77ac.png", alt: "חיבור קמפיינים ולידים מפייסבוק (Facebook Leads) ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9160435043f.png", alt: "חיבור לידים והודעות מאינסטגרם (Instagram) ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a537d82f92fceb7e3d.png", alt: "חיבור לידים מ-LinkedIn ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a506eacd595072e016.png", alt: "חיבור קמפיינים ולידים מ-TikTok ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a54325e150f16636dc.png", alt: "חיבור Google Ads ויומני פגישות ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67abd58650fb000ed8851f30.png", alt: "אינטגרציית Zapier לאוטומציה עסקית" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a534b29a2b24ca6434.png", alt: "אינטגרציית Slack להתראות צוות מ-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a506eacd2a0b72e015.png", alt: "אינטגרציית Printful למסחר אלקטרוני" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9493235043e.png", alt: "סליקת אשראי ותשלומים באמצעות Stripe" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9500a35043d.png", alt: "חיבור חנות Shopify לניהול לקוחות ב-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a534b29a1b3eca6435.png", alt: "חיבור חנות WooCommerce ל-CRM" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5f3bda8b1b50e5c3e.png", alt: "ניהול ביקורות וכרטיס עסק ב-Google Business Profile" }
];

interface IntegrationsProps {
    onNavigate?: (path: string) => void;
}

export const Integrations: React.FC<IntegrationsProps> = ({ onNavigate }) => {
    return (
        <section id="integrations" className="py-24 bg-white overflow-hidden" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="flex justify-center mb-8">
                    <a
                        href="/topics/repetitive-manual-work"
                        onClick={(e) => {
                            if (onNavigate) {
                                e.preventDefault();
                                onNavigate('/topics/repetitive-manual-work');
                            }
                        }}
                        className="bg-red-50 hover:bg-red-100/80 text-red-700 px-5 py-2 rounded-full text-xs sm:text-sm font-medium border border-red-200/80 shadow-xs hover:shadow-sm transition-all text-center inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 group cursor-pointer"
                    >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>כל מערכת בשפה אחרת. חיבורים ידניים עולים זמן וכסף</span>
                        <span className="text-xs bg-red-200/70 group-hover:bg-red-300/70 text-red-900 px-2.5 py-0.5 rounded-full font-bold transition-colors mr-1 inline-flex items-center gap-1 whitespace-nowrap">
                            <span>איך משחררים את הצוות?</span>
                            <span className="group-hover:-translate-x-0.5 transition-transform font-bold">←</span>
                        </span>
                    </a>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-8">
                    עולם מחובר
                </h2>

                <div className="text-center max-w-3xl mx-auto text-gray-600 text-lg">
                    <p>
                        המערכת חיה בעולם מחובר. אלטרוביז מדברת API עם Make, Zapier, n8n, מערכות דיוור, כלי ניתוח ופלטפורמות סושיאל כדי לשמור על תהליך רציף וחכם.
                    </p>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-gradient-x py-8">
                <div className="flex">
                    <motion.div
                        className="flex flex-shrink-0 items-center space-x-16 space-x-reverse px-8"
                        initial={{ x: 0 }}
                        animate={{ x: "50%" }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...logos, ...logos].map((logo, idx) => (
                            <img
                                key={idx}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-12 w-auto object-contain md:h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0"
                                loading="lazy"
                            />
                        ))}
                    </motion.div>
                    <motion.div
                        className="flex flex-shrink-0 items-center space-x-16 space-x-reverse px-8"
                        initial={{ x: 0 }}
                        animate={{ x: "50%" }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {[...logos, ...logos].map((logo, idx) => (
                            <img
                                key={`d-${idx}`}
                                src={logo.src}
                                alt={logo.alt}
                                className="h-12 w-auto object-contain md:h-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0"
                                loading="lazy"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Custom Styles for Mask */}
            <style>{`
    .mask-gradient-x {
        mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
            `}</style>
        </section>
    );
};
