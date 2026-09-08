import React, { useState } from 'react';
import { Check, Copy, Share2, Quote, Sparkles } from 'lucide-react';

export interface SocialShareBarProps {
    title: string;
    description?: string;
    keyTakeaway?: string;
    heroSummary?: string;
    slug: string;
    coverImage?: {
        src: string;
        alt: string;
    };
    variant?: 'header' | 'featured';
    className?: string;
}

// Brand SVG Icons
const WhatsAppIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.544 1.745.815 2.796.815 3.183 0 5.768-2.586 5.769-5.766.001-3.182-2.585-5.767-5.769-5.767zm7.509 5.766c-.001 4.14-3.368 7.508-7.509 7.508-1.309 0-2.545-.342-3.626-.939l-4.405 1.155 1.176-4.295c-.663-1.127-1.025-2.427-1.025-3.766 0-4.14 3.367-7.508 7.509-7.508 4.14 0 7.509 3.368 7.509 7.508z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const XTwitterIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TikTokIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.28-1.49 3.34-3.3.04-2.73.01-5.46.02-8.19l.01-10.49z" />
    </svg>
);

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
    title,
    description,
    keyTakeaway,
    heroSummary,
    slug,
    coverImage,
    variant = 'header',
    className = ''
}) => {
    const [copied, setCopied] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Dynamic clean URL
    const getShareUrl = () => {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/articles/${slug}`;
        }
        return `https://altrubiz.co.il/articles/${slug}`;
    };

    // The smart, punchy sentence to share
    const smartQuote = keyTakeaway || heroSummary || description || title;

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3200);
    };

    const handleCopyLink = async () => {
        const url = getShareUrl();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            showToast('הקישור הועתק ללוח בהצלחה!');
            setTimeout(() => setCopied(false), 2500);
        } catch {
            showToast('לא ניתן להעתיק כרגע');
        }
    };

    const handleWhatsApp = () => {
        const url = getShareUrl();
        const text = encodeURIComponent(`💡 "${smartQuote}"\n\nמתוך המאמר: *${title}*\n${url}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    const handleFacebook = () => {
        const url = getShareUrl();
        const quote = encodeURIComponent(`"${smartQuote}" - ${title}`);
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${quote}`,
            '_blank',
            'width=600,height=500,noopener,noreferrer'
        );
    };

    const handleTwitter = () => {
        const url = getShareUrl();
        const text = encodeURIComponent(`💡 "${smartQuote}"\n\nמתוך: ${title}`);
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
            '_blank',
            'width=600,height=500,noopener,noreferrer'
        );
    };

    const handleLinkedIn = () => {
        const url = getShareUrl();
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank',
            'width=600,height=600,noopener,noreferrer'
        );
    };

    const handleInstagram = async () => {
        const url = getShareUrl();
        const shareText = `💡 "${smartQuote}"\n\nלקריאה: ${url}`;
        
        // Native mobile share sheet if available
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: url
                });
                return;
            } catch {
                // fall through to clipboard copy
            }
        }

        // Desktop/Fallback: copy text & redirect to Instagram
        try {
            await navigator.clipboard.writeText(shareText);
            showToast('הציטוט והקישור הועתקו! מעבר לאינסטגרם...');
            setTimeout(() => {
                window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
            }, 800);
        } catch {
            window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
        }
    };

    const handleTikTok = async () => {
        const url = getShareUrl();
        const shareText = `💡 "${smartQuote}"\n\n${title} | ${url}`;
        
        // Native mobile share sheet if available
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: url
                });
                return;
            } catch {
                // fall through
            }
        }

        // Desktop/Fallback: copy text & redirect to TikTok
        try {
            await navigator.clipboard.writeText(shareText);
            showToast('הציטוט והקישור הועתקו! מעבר לטיקטוק...');
            setTimeout(() => {
                window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
            }, 800);
        } catch {
            window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
        }
    };

    // Compact Header Variant
    if (variant === 'header') {
        return (
            <div className={`relative flex flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}>
                {/* Toast feedback */}
                {toastMessage && (
                    <div className="absolute -top-10 left-0 sm:left-auto sm:right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap z-30 animate-fade-in font-medium flex items-center gap-1.5">
                        <Sparkles size={12} className="text-amber-400" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    title="שיתוף בוואטסאפ עם ציטוט חכם"
                    aria-label="שיתוף בוואטסאפ"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#25D366]/15 text-[#075E54] hover:bg-[#25D366]/25 transition-all shadow-xs active:scale-95"
                >
                    <WhatsAppIcon />
                    <span className="hidden xs:inline">וואטסאפ</span>
                </button>

                {/* LinkedIn */}
                <button
                    onClick={handleLinkedIn}
                    title="שיתוף בלינקדאין"
                    aria-label="שיתוף בלינקדאין"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 hover:scale-105 transition-all active:scale-95"
                >
                    <LinkedInIcon />
                </button>

                {/* Facebook */}
                <button
                    onClick={handleFacebook}
                    title="שיתוף בפייסבוק"
                    aria-label="שיתוף בפייסבוק"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 hover:scale-105 transition-all active:scale-95"
                >
                    <FacebookIcon />
                </button>

                {/* X (Twitter) */}
                <button
                    onClick={handleTwitter}
                    title="שיתוף ב-X (טוויטר)"
                    aria-label="שיתוף ב-X"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900/10 text-slate-800 hover:bg-slate-900/20 hover:scale-105 transition-all active:scale-95"
                >
                    <XTwitterIcon />
                </button>

                {/* Instagram */}
                <button
                    onClick={handleInstagram}
                    title="שיתוף באינסטגרם (העתקת ציטוט וקישור)"
                    aria-label="שיתוף באינסטגרם"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 text-[#dc2743] hover:from-[#f09433]/25 hover:to-[#bc1888]/25 hover:scale-105 transition-all active:scale-95"
                >
                    <InstagramIcon />
                </button>

                {/* TikTok */}
                <button
                    onClick={handleTikTok}
                    title="שיתוף בטיקטוק (העתקת ציטוט וקישור)"
                    aria-label="שיתוף בטיקטוק"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-black/10 text-slate-900 hover:bg-black/20 hover:scale-105 transition-all active:scale-95"
                >
                    <TikTokIcon />
                </button>

                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    title="העתקת קישור למאמר"
                    aria-label="העתקת קישור למאמר"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all active:scale-95"
                >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? 'הועתק!' : 'העתקת קישור'}</span>
                </button>
            </div>
        );
    }

    // Featured Bottom Card Variant
    return (
        <div className={`relative bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden ${className}`}>
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Toast Feedback */}
            {toastMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl shadow-2xl border border-slate-200 z-30 animate-fade-in flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="relative z-10 space-y-6">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                            <Share2 size={18} />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-extrabold text-white">
                                שיתוף התובנה עם קולגות ברשתות
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400">
                                משפט חכם וקישור ישיר מוכנים לשיתוף בלחיצה אחת
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                        💡 תובנה מתוך המאמר
                    </span>
                </div>

                {/* Smart Quote Box with Cover Image Thumbnail */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                    {coverImage && (
                        <div className="w-full md:w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                            <img
                                src={coverImage.src}
                                alt={coverImage.alt || title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                            <Quote size={18} className="text-primary flex-shrink-0 mt-0.5 opacity-80" />
                            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
                                &quot;{smartQuote}&quot;
                            </p>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 font-normal">
                            מתוך: <span className="text-slate-300 font-semibold">{title}</span>
                        </div>
                    </div>
                </div>

                {/* Social Button Grid */}
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
                    {/* WhatsApp */}
                    <button
                        onClick={handleWhatsApp}
                        aria-label="שיתוף בוואטסאפ"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#25D366]/20 active:scale-95"
                    >
                        <WhatsAppIcon />
                        <span>וואטסאפ</span>
                    </button>

                    {/* LinkedIn */}
                    <button
                        onClick={handleLinkedIn}
                        aria-label="שיתוף בלינקדאין"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#0077B5] hover:bg-[#00669c] text-white font-bold text-xs transition-all shadow-md shadow-[#0077B5]/20 active:scale-95"
                    >
                        <LinkedInIcon />
                        <span>LinkedIn</span>
                    </button>

                    {/* Facebook */}
                    <button
                        onClick={handleFacebook}
                        aria-label="שיתוף בפייסבוק"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition-all shadow-md shadow-[#1877F2]/20 active:scale-95"
                    >
                        <FacebookIcon />
                        <span>פייסבוק</span>
                    </button>

                    {/* X (Twitter) */}
                    <button
                        onClick={handleTwitter}
                        aria-label="שיתוף ב-X (טוויטר)"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700 active:scale-95"
                    >
                        <XTwitterIcon />
                        <span>X / טוויטר</span>
                    </button>

                    {/* Instagram */}
                    <button
                        onClick={handleInstagram}
                        aria-label="שיתוף באינסטגרם"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                    >
                        <InstagramIcon />
                        <span>אינסטגרם</span>
                    </button>

                    {/* TikTok */}
                    <button
                        onClick={handleTikTok}
                        aria-label="שיתוף בטיקטוק"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs transition-all border border-neutral-800 active:scale-95"
                    >
                        <TikTokIcon />
                        <span>טיקטוק</span>
                    </button>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        aria-label="העתקת קישור למאמר"
                        className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700 active:scale-95 col-span-2 xs:col-span-1 md:col-span-1"
                    >
                        {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                        <span>{copied ? 'הועתק!' : 'העתקת קישור'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
