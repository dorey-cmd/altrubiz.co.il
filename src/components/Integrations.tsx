import React from 'react';
import { motion } from 'framer-motion';

const logos = [
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67af641f237ce2563df82508.png", alt: "WhatsApp" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a579284bbe3b6a77ac.png", alt: "Facebook" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9160435043f.png", alt: "Instagram" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a537d82f92fceb7e3d.png", alt: "LinkedIn" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a506eacd595072e016.png", alt: "TikTok" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a54325e150f16636dc.png", alt: "Google" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67abd58650fb000ed8851f30.png", alt: "Zapier" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a534b29a2b24ca6434.png", alt: "Slack" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a506eacd2a0b72e015.png", alt: "Printful" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9493235043e.png", alt: "Stripe" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5ee6da9500a35043d.png", alt: "Shopify" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a534b29a1b3eca6435.png", alt: "WooCommerce" },
    { src: "https://storage.googleapis.com/msgsndr/knES3eSWYIsc5YSZ3YLl/media/67ab96a5f3bda8b1b50e5c3e.png", alt: "Google Business Profile" }
];

export const Integrations = () => {
    return (
        <section id="integrations" className="py-24 bg-white overflow-hidden" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full w-fit mx-auto mb-8 text-sm font-medium border border-red-100 shadow-sm animate-pulse text-center block">
                    כל מערכת בשפה אחרת. חיבורים ידניים עולים זמן וכסף
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
