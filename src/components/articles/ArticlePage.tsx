import React, { useState, useEffect, useRef } from 'react';
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    ShieldAlert, 
    ExternalLink, 
    ChevronLeft, 
    Sparkles, 
    HelpCircle, 
    Info, 
    Zap, 
    ArrowUp, 
    ChevronDown, 
    Compass, 
    X, 
    MessageCircle, 
    Copy, 
    Quote, 
    Layers 
} from 'lucide-react';
import { Article, ArticleSection } from '../../data/articles';
import { getParentHubForArticle } from '../../data/knowledgeGraph';
import { Button } from '../ui/Button';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { SocialShareBar } from './SocialShareBar';
import { ModalPresentationOptions } from '../../types/attribution';
import { buildAttributedWhatsAppUrl } from '../../lib/attribution';
import { renderFormattedText } from '../../lib/formatText';

interface ArticlePageProps {
    article: Article;
    onNavigate: (path: string) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
    onOpenPricingModal?: () => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ 
    article, 
    onNavigate, 
    onOpenContactModal,
    onOpenBookingModal,
    onOpenPricingModal 
}) => {
    const [activeSectionId, setActiveSectionId] = useState<string>(article.sections[0]?.id || '');
    const [showMobileJump, setShowMobileJump] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const activeTocRef = useRef<HTMLAnchorElement>(null);
    const tocContainerRef = useRef<HTMLDivElement>(null);

    const parentHub = getParentHubForArticle(article.slug);

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע', path: '/articles' },
        ...(parentHub ? [{ name: parentHub.title, path: parentHub.url }] : []),
        { name: article.title, path: `/articles/${article.slug}` }
    ];

    const scrollToSection = (id: string) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${id}`);
        }
        setIsMobileDrawerOpen(false);
    };

    const [scrollProgress, setScrollProgress] = useState(0);

    // Track scroll for mobile jump button, reading progress & active section observer
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 200) {
                setShowMobileJump(true);
            } else {
                setShowMobileJump(false);
            }

            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                const progress = Math.min(100, Math.max(0, Math.round((currentScroll / docHeight) * 100)));
                setScrollProgress(progress);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Architectural Invariant: "Navigation follows the reader - never the reverse."
    // Passive active-section tracking MUST ONLY scroll the internal TOC container if needed.
    // It must NEVER call element.scrollIntoView() which scrolls the window/document ancestors.
    useEffect(() => {
        const container = tocContainerRef.current;
        const item = activeTocRef.current;
        if (!container || !item) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const relativeTop = itemRect.top - containerRect.top;
        const relativeBottom = itemRect.bottom - containerRect.top;
        const PADDING = 8;

        if (relativeTop < PADDING) {
            container.scrollTo({
                top: container.scrollTop + relativeTop - PADDING,
                behavior: 'smooth'
            });
        } else if (relativeBottom > containerRect.height - PADDING) {
            container.scrollTo({
                top: container.scrollTop + (relativeBottom - containerRect.height) + PADDING,
                behavior: 'smooth'
            });
        }
    }, [activeSectionId]);

    // IntersectionObserver for scrollspy active state
    useEffect(() => {
        const observedIds = article.sections.map(s => s.id);
        if (article.faqs && article.faqs.length > 0) {
            observedIds.push('article-faqs');
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSectionId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-15% 0px -60% 0px',
                threshold: 0
            }
        );

        observedIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [article]);

    const totalActions = article.sections.filter(s => s.actionNumber).length;
    const activeSection = article.sections.find(s => s.id === activeSectionId);
    const activeLabel = activeSection?.actionNumber 
        ? `פעולה ${activeSection.actionNumber}${totalActions > 0 ? `/${totalActions}` : ''}` 
        : activeSection?.isTenMinuteTest 
            ? 'מבחן 10 הדקות' 
            : activeSectionId === 'article-faqs' 
                ? 'שאלות נפוצות' 
                : 'תוכן המאמר';

    const renderCallout = (callout: NonNullable<ArticleSection['callout']>) => {
        if (callout.type === 'danger') {
            return (
                <div className="mt-6 pt-5 border-t border-rose-200/80 text-rose-950 font-bold text-base sm:text-lg flex items-center gap-2.5">
                    <AlertTriangle className="text-rose-600 flex-shrink-0" size={22} />
                    <span>{callout.title ? `${callout.title}: ` : ''}{callout.text}</span>
                </div>
            );
        }

        if (callout.type === 'warning') {
            return (
                <div className="mt-6 bg-amber-100/70 border border-amber-300 rounded-xl p-4 text-amber-950 text-sm sm:text-base font-semibold flex items-center gap-2.5">
                    <AlertTriangle className="text-amber-700 flex-shrink-0" size={20} />
                    <span>{callout.title ? `${callout.title}: ` : ''}{callout.text}</span>
                </div>
            );
        }

        if (callout.type === 'success') {
            return (
                <div className="mt-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-emerald-950">
                    <h3 className="font-extrabold text-xl mb-2 text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-600 flex-shrink-0" size={22} />
                        <span>{callout.title || 'המטרה פשוטה'}</span>
                    </h3>
                    <p className="text-emerald-900/90 leading-relaxed text-base sm:text-lg">
                        {callout.text}
                    </p>
                </div>
            );
        }

        // Default: info
        return (
            <div className="mt-6 bg-blue-50/70 border-r-4 border-primary p-5 rounded-l-xl text-slate-800 text-sm sm:text-base">
                <h4 className="font-bold text-primary mb-1 flex items-center gap-1.5">
                    <Info size={18} />
                    <span>{callout.title || 'הבהרה חשובה'}</span>
                </h4>
                <p className="text-slate-600 leading-relaxed">
                    {callout.text}
                </p>
            </div>
        );
    };

    const renderInlineCta = (inlineCta: NonNullable<ArticleSection['inlineCta']>) => {
        const variant = inlineCta.variant || 'box';

        // 1. Subtle Inline Strip / Banner (e.g. asking a question directly via WhatsApp or quick fit check)
        if (variant === 'strip') {
            const isWhatsApp = inlineCta.ctaType === 'whatsapp' || !inlineCta.ctaType;
            return (
                <div className="my-8 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            {isWhatsApp ? <MessageCircle size={20} className="text-[#25D366]" /> : <Sparkles size={20} className="text-primary" />}
                        </div>
                        <div>
                            <p className="text-slate-900 text-sm sm:text-base font-bold leading-snug">
                                {inlineCta.title}
                            </p>
                            {inlineCta.description && (
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-normal">
                                    {inlineCta.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                        {isWhatsApp ? (
                            <a
                                href={buildAttributedWhatsAppUrl(
                                    inlineCta.whatsappText || `שלום צוות AltruBiz, קראתי את המאמר "${article.title}" ואשמח להתייעץ.`,
                                    {
                                        sourcePage: `/articles/${article.slug}`,
                                        sourceSection: activeSectionId,
                                        sourceArticle: article.slug,
                                        sourceTopic: parentHub?.slug,
                                        intent: 'consultation',
                                        ctaType: 'whatsapp',
                                        sourceLabel: inlineCta.title
                                    }
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm"
                            >
                                <MessageCircle size={15} />
                                <span>{inlineCta.buttonText || 'פנייה ישירה בוואטסאפ'}</span>
                            </a>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                className="w-full sm:w-auto font-bold text-xs sm:text-sm px-4 py-2.5"
                                onClick={() => {
                                    if (onOpenContactModal) {
                                        onOpenContactModal({
                                            title: inlineCta.title,
                                            subtitle: inlineCta.description,
                                            badge: inlineCta.badge || 'בדיקת התאמה',
                                            attribution: {
                                                sourcePage: `/articles/${article.slug}`,
                                                sourceSection: activeSectionId,
                                                sourceArticle: article.slug,
                                                sourceTopic: parentHub?.slug,
                                                intent: 'assessment',
                                                ctaType: 'inline_cta',
                                                sourceLabel: inlineCta.title
                                            }
                                        });
                                    } else {
                                        onNavigate('/#contact');
                                    }
                                }}
                            >
                                <span>{inlineCta.buttonText || 'בדיקת התאמה ←'}</span>
                            </Button>
                        )}
                    </div>
                </div>
            );
        }

        // 2. Quote & Quick Share Card
        if (variant === 'quote-share') {
            const quoteText = inlineCta.quote || inlineCta.title;
            const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://altrubiz.co.il/articles/${article.slug}`;
            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                `💡 "${quoteText}"\n\nמתוך המאמר: *${article.title}*\n${articleUrl}`
            )}`;

            return (
                <div className="my-10 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-yellow-50/70 border-2 border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-black">
                            <Quote size={13} className="text-amber-800" />
                            <span>{inlineCta.badge || 'תובנה ששווה לשתף'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">שיתוף מהיר</span>
                    </div>

                    <blockquote className="text-slate-900 text-base sm:text-lg font-black leading-relaxed mb-3 italic">
                        &quot;{quoteText}&quot;
                    </blockquote>

                    {inlineCta.description && (
                        <p className="text-slate-700 text-xs sm:text-sm mb-5 leading-relaxed">
                            {inlineCta.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-amber-200/70">
                        <a
                            href={whatsappShareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm"
                        >
                            <MessageCircle size={16} />
                            <span>{inlineCta.buttonText || 'שיתוף בוואטסאפ'}</span>
                        </a>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await navigator.clipboard.writeText(`${quoteText}\n\n${articleUrl}`);
                                    alert('הציטוט והקישור הועתקו בהצלחה!');
                                } catch {
                                    // fallback
                                }
                            }}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-3.5 py-2.5 rounded-xl transition-all text-xs sm:text-sm"
                        >
                            <Copy size={14} />
                            <span>העתקת תובנה וקישור</span>
                        </button>
                    </div>
                </div>
            );
        }

        // 3. Prominent Editorial Text Callout / Link
        if (variant === 'text-link') {
            return (
                <div className="my-8 bg-slate-50 hover:bg-blue-50/70 border-r-4 border-primary rounded-l-2xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="text-slate-800 text-sm sm:text-base">
                        <span className="font-bold text-slate-900">{inlineCta.title} </span>
                        {inlineCta.description && (
                            <span className="text-slate-600 font-normal">{inlineCta.description}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            if (inlineCta.ctaType === 'pricing') {
                                if (onOpenPricingModal) onOpenPricingModal();
                                else onNavigate('/#pricing');
                            } else {
                                if (onOpenContactModal) {
                                    onOpenContactModal({
                                        title: inlineCta.title,
                                        subtitle: inlineCta.description,
                                        badge: inlineCta.badge || 'בדיקת התאמה',
                                        attribution: {
                                            sourcePage: `/articles/${article.slug}`,
                                            sourceSection: activeSectionId,
                                            sourceArticle: article.slug,
                                            sourceTopic: parentHub?.slug,
                                            intent: 'assessment',
                                            ctaType: 'inline_cta',
                                            sourceLabel: inlineCta.title
                                        }
                                    });
                                } else {
                                    onNavigate('/#contact');
                                }
                            }
                        }}
                        className="inline-flex items-center gap-1.5 text-primary hover:text-secondary font-black text-sm flex-shrink-0 transition-colors group cursor-pointer"
                    >
                        <span>{inlineCta.buttonText || 'לשיחת בדיקת התאמה ←'}</span>
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            );
        }

        // 4. Pricing Trigger Card (Transparency in pricing & subscription)
        if (variant === 'pricing') {
            return (
                <div className="my-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-black mb-3">
                            <Sparkles size={14} className="text-emerald-400" />
                            <span>{inlineCta.badge || 'שקיפות מלאה – חבילות ומחירים'}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white leading-snug">
                            {inlineCta.title}
                        </h3>
                        {inlineCta.description && (
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
                                {inlineCta.description}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                variant="primary"
                                size="md"
                                className="font-bold text-sm sm:text-base px-5 py-3 shadow-lg shadow-primary/30 flex items-center gap-2"
                                onClick={() => {
                                    if (onOpenPricingModal) {
                                        onOpenPricingModal();
                                    } else {
                                        onNavigate('/#pricing');
                                    }
                                }}
                            >
                                <Zap size={16} className="fill-white" />
                                <span>{inlineCta.buttonText || 'צפייה בחבילות ובמחירים (Popup)'}</span>
                            </Button>

                            <Button
                                variant="secondary"
                                size="md"
                                className="font-bold text-sm sm:text-base px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2"
                                onClick={() => {
                                    if (onOpenBookingModal) {
                                        onOpenBookingModal({
                                            title: 'קביעת שיחת התאמה: איך זה יכול לעבוד אצלכם בעסק',
                                            subtitle: 'נשמח להכיר את הפעילות ולהתאים את המענה המדויק.',
                                            badge: 'תיאום שיחה ביומן',
                                            attribution: {
                                                sourcePage: `/articles/${article.slug}`,
                                                sourceSection: activeSectionId,
                                                sourceArticle: article.slug,
                                                sourceTopic: parentHub?.slug,
                                                intent: 'booking',
                                                ctaType: 'inline_cta',
                                                sourceLabel: 'pricing_card_booking'
                                            }
                                        });
                                    } else {
                                        onNavigate('/#contact');
                                    }
                                }}
                            >
                                <Calendar size={16} />
                                <span>{inlineCta.secondaryButtonText || 'קביעת שיחת התאמה'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        // 5. Rich In-Content Milestone Box (Default / 'box')
        return (
            <div className="my-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    {inlineCta.badge && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black mb-3">
                            <Sparkles size={14} />
                            <span>{inlineCta.badge}</span>
                        </div>
                    )}
                    <h3 className="text-xl sm:text-2xl font-black mb-2 text-white leading-snug">
                        {inlineCta.title}
                    </h3>
                    {inlineCta.description && (
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
                            {inlineCta.description}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant="primary"
                            size="md"
                            className="font-bold text-sm sm:text-base px-5 py-3 shadow-lg shadow-primary/30 flex items-center gap-2"
                            onClick={() => {
                                if (onOpenBookingModal) {
                                    onOpenBookingModal({
                                        title: inlineCta.title,
                                        subtitle: inlineCta.description,
                                        badge: inlineCta.badge || 'תיאום פגישה ביומן',
                                        attribution: {
                                            sourcePage: `/articles/${article.slug}`,
                                            sourceSection: activeSectionId,
                                            sourceArticle: article.slug,
                                            sourceTopic: parentHub?.slug,
                                            intent: 'booking',
                                            ctaType: 'inline_cta',
                                            sourceLabel: inlineCta.title
                                        }
                                    });
                                } else {
                                    onNavigate('/#contact');
                                }
                            }}
                        >
                            <Calendar size={16} />
                            <span>{inlineCta.buttonText || 'קביעת פגישה ביומן'}</span>
                        </Button>

                        <a
                            href={buildAttributedWhatsAppUrl(
                                inlineCta.whatsappText || `שלום צוות AltruBiz, קראתי את המאמר "${article.title}" ואשמח לבדוק איך זה יכול לעבוד אצלנו בעסק`,
                                {
                                    sourcePage: `/articles/${article.slug}`,
                                    sourceSection: activeSectionId,
                                    sourceArticle: article.slug,
                                    sourceTopic: parentHub?.slug,
                                    intent: 'consultation',
                                    ctaType: 'whatsapp',
                                    sourceLabel: inlineCta.title
                                }
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 font-bold px-4 py-3 rounded-xl transition-all text-xs sm:text-sm"
                        >
                            <MessageCircle size={16} className="text-[#25D366]" />
                            <span>{inlineCta.secondaryButtonText || 'התייעצות מהירה בוואטסאפ'}</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    const renderSection = (section: ArticleSection, idx: number) => {
        // Special styling for legal & policy liability sections
        const isDarkPolicy = section.id.includes('liability') || section.id.includes('policy-and-liability');

        if (isDarkPolicy) {
            return (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold mb-3">
                                <ShieldAlert size={20} />
                                <span>הבהרה משפטית ומדיניות שירות</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black mb-6 text-white">
                                {section.title}
                            </h2>

                            {section.content && (
                                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                                    {section.content.map((para, pIdx) => (
                                        <p key={pIdx} className={pIdx === 1 ? "text-white font-semibold" : ""}>
                                            {renderFormattedText(para, onNavigate)}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {section.callout && renderCallout(section.callout)}
                        </div>
                    </div>
                </section>
            );
        }

        // Special styling for "The 10-Minute Test"
        if (section.isTenMinuteTest) {
            return (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-indigo-500/30">
                        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-black mb-4">
                                <Clock size={16} />
                                <span>עקרון ברזל לבחירת אוטומציה</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 text-white">
                                {section.title}
                            </h2>
                            {section.subtitle && (
                                <p className="text-indigo-200 text-base sm:text-lg mb-6">
                                    {section.subtitle}
                                </p>
                            )}

                            {section.content && (
                                <div className="space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed mb-6">
                                    {section.content.map((para, pIdx) => (
                                        <p key={pIdx}>
                                            {renderFormattedText(para, onNavigate)}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {section.callout && (
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 text-white">
                                    <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-2">
                                        <Sparkles size={20} />
                                        <span>{section.callout.title}</span>
                                    </div>
                                    <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed">
                                        {renderFormattedText(section.callout.text, onNavigate)}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
                                <a 
                                    href="#article-toc"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection('article-toc');
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-white/10"
                                >
                                    <ArrowUp size={14} />
                                    <span>חזרה לתוכן העניינים ↑</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        // Action Section (Quick Wins)
        if (section.actionNumber) {
            return (
                <section key={section.id} id={section.id} className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm transition-shadow hover:shadow-md">
                    {/* Action Number Badge */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-black border border-emerald-200 shadow-xs">
                            <Zap size={14} className="fill-emerald-600 text-emerald-600" />
                            <span>פעולה 0{section.actionNumber}{totalActions > 0 ? ` מתוך ${totalActions}` : ''}</span>
                        </span>
                        <a 
                            href="#article-toc"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('article-toc');
                            }}
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-50"
                            title="חזרה לתוכן העניינים"
                        >
                            <ArrowUp size={13} />
                            <span className="hidden sm:inline">לתוכן העניינים</span>
                        </a>
                    </div>

                    {/* H2 Title */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {section.title}
                    </h2>

                    {/* Subtitle */}
                    {section.subtitle && (
                        <p className="text-slate-600 text-sm sm:text-base mb-6 font-normal">
                            {section.subtitle}
                        </p>
                    )}

                    {/* The Problem Box */}
                    {section.problem && (
                        <div className="bg-rose-50/80 border-r-4 border-rose-500 rounded-l-2xl p-4 sm:p-5 mb-6 text-slate-800">
                            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm sm:text-base mb-1">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span>הבעיה בעסק:</span>
                            </div>
                            <p className="text-slate-700 text-base leading-relaxed font-medium">
                                {renderFormattedText(section.problem, onNavigate)}
                            </p>
                        </div>
                    )}

                    {/* Content Paragraphs */}
                    {section.content && section.content.length > 0 && (
                        <div className="space-y-4 text-slate-700 mb-6 text-base sm:text-lg">
                            {section.content.map((para, pIdx) => (
                                <p key={pIdx} className="leading-relaxed">
                                    {renderFormattedText(para, onNavigate)}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Highlighted Quick Win Component */}
                    {section.quickWin && (
                        <div className="bg-gradient-to-br from-amber-50/90 via-emerald-50/70 to-teal-50/90 border-2 border-emerald-300/80 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm">
                            <div className="flex items-center gap-2.5 text-emerald-900 font-black text-base sm:text-lg mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                                    <Zap className="w-5 h-5 fill-white" />
                                </div>
                                <span>{section.quickWin.title || 'מה אפשר לעשות עכשיו? (Quick Win)'}</span>
                            </div>
                            <p className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed">
                                {renderFormattedText(section.quickWin.text, onNavigate)}
                            </p>
                        </div>
                    )}

                    {/* Atmospheric Image or Break Routine Visual Card */}
                    {section.image ? (
                        <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white">
                            {section.image.layout === 'side' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                    <img 
                                        src={section.image.src} 
                                        alt={section.image.alt} 
                                        loading="lazy" 
                                        className="w-full h-full min-h-[260px] max-h-[340px] object-cover" 
                                    />
                                    <div className="p-6 bg-slate-50/90 flex flex-col justify-center h-full">
                                        <div className="text-xs uppercase tracking-wider font-extrabold text-primary mb-2 flex items-center gap-1.5">
                                            <Sparkles size={14} />
                                            <span>תובנה מעשית מהשטח</span>
                                        </div>
                                        <p className="text-slate-800 text-base leading-relaxed font-medium">
                                            {renderFormattedText(section.image.caption || section.image.alt, onNavigate)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <img 
                                        src={section.image.src} 
                                        alt={section.image.alt} 
                                        loading="lazy" 
                                        className="w-full aspect-video object-cover" 
                                    />
                                    {section.image.caption && (
                                        <figcaption className="p-3.5 sm:p-4 text-center text-xs sm:text-sm text-slate-600 bg-slate-50 border-t border-slate-100 font-medium">
                                            💡 {section.image.caption}
                                        </figcaption>
                                    )}
                                </>
                            )}
                        </figure>
                    ) : section.breakRoutine ? (
                        <div className="my-8 rounded-2xl overflow-hidden border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-100/60 p-6 sm:p-7 shadow-sm">
                            <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-black mb-3">
                                <span className="p-1.5 rounded-lg bg-amber-200/90 text-amber-950 shadow-xs">
                                    <Sparkles size={16} />
                                </span>
                                <span>📸 שוברים שגרה</span>
                            </div>
                            <div className="bg-white/85 backdrop-blur-xs border border-amber-200/80 rounded-xl p-4 sm:p-5 mb-3 text-slate-800 text-base sm:text-lg font-medium leading-relaxed italic shadow-xs">
                                "{section.breakRoutine.scene}"
                            </div>
                            <div className="inline-flex items-center gap-2 bg-amber-900 text-amber-50 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs">
                                <span>💡 כיתוב:</span>
                                <span className="font-extrabold">{section.breakRoutine.caption}</span>
                            </div>
                        </div>
                    ) : null}

                    {/* Inline Contextual CTA */}
                    {section.inlineCta && renderInlineCta(section.inlineCta)}

                    {/* Return link to TOC */}
                    <div className="flex justify-end pt-2">
                        <a 
                            href="#article-toc"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection('article-toc');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 font-medium"
                        >
                            <ArrowUp size={13} />
                            <span>חזרה לתוכן העניינים ↑</span>
                        </a>
                    </div>
                </section>
            );
        }

        // Standard Article Section Fallback
        const isNegativeList = section.id.includes('not-to-do') || section.id.includes('mistakes') || section.id.includes('forbidden');

        return (
            <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    {isNegativeList ? (
                        <span className="text-rose-600">✕</span>
                    ) : (
                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {idx + 1}
                        </span>
                    )}
                    <span>{section.title}</span>
                </h2>

                {section.subtitle && (
                    <p className="text-slate-600 mb-6 font-normal">
                        {section.subtitle}
                    </p>
                )}

                {/* Paragraphs */}
                {section.content && section.content.length > 0 && (
                    <div className="space-y-4 text-slate-700 mb-6">
                        {section.content.map((para, pIdx) => (
                            <p key={pIdx} className="leading-relaxed">
                                {renderFormattedText(para, onNavigate)}
                            </p>
                        ))}
                    </div>
                )}

                {/* Ordered Items */}
                {section.orderedItems && section.orderedItems.length > 0 && (
                    section.id.includes('checklist') ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {section.orderedItems.map((item, oIdx) => (
                                <div key={oIdx} className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</div>
                                        <div className="text-xs sm:text-sm text-slate-600 mt-0.5">{renderFormattedText(item.description, onNavigate)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-5 mb-6">
                            {section.orderedItems.map((item, oIdx) => (
                                <div key={oIdx} className="bg-white border border-emerald-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                                            {oIdx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-700 text-base leading-relaxed">
                                                {renderFormattedText(item.description, onNavigate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* List Items */}
                {section.listItems && section.listItems.length > 0 && (
                    isNegativeList ? (
                        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 sm:p-8 mb-6">
                            <ul className="space-y-3.5">
                                {section.listItems.map((item, lIdx) => (
                                    <li key={lIdx} className="flex items-start gap-3 text-slate-800 text-base">
                                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                                        <span>{renderFormattedText(item, onNavigate)}</span>
                                    </li>
                                ))}
                            </ul>
                            {section.callout && renderCallout(section.callout)}
                        </div>
                    ) : (
                        <ul className="space-y-3 mb-6">
                            {section.listItems.map((item, lIdx) => (
                                <li key={lIdx} className="flex items-start gap-3 text-slate-800 text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                                    <span>{renderFormattedText(item, onNavigate)}</span>
                                </li>
                            ))}
                        </ul>
                    )
                )}

                {/* Quick Win in fallback section */}
                {section.quickWin && (
                    <div className="bg-gradient-to-br from-amber-50/90 via-emerald-50/70 to-teal-50/90 border-2 border-emerald-300/80 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm">
                        <div className="flex items-center gap-2.5 text-emerald-900 font-black text-base sm:text-lg mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                                <Zap className="w-5 h-5 fill-white" />
                            </div>
                            <span>{section.quickWin.title || 'מה אפשר לעשות עכשיו? (Quick Win)'}</span>
                        </div>
                        <p className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed">
                            {renderFormattedText(section.quickWin.text, onNavigate)}
                        </p>
                    </div>
                )}

                {/* Section Image in fallback section */}
                {section.image && (
                    <figure className="my-8 rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-white">
                        {section.image.layout === 'side' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                                <img 
                                    src={section.image.src} 
                                    alt={section.image.alt} 
                                    loading="lazy" 
                                    className="w-full h-full min-h-[260px] max-h-[340px] object-cover" 
                                />
                                <div className="p-6 bg-slate-50/90 flex flex-col justify-center h-full">
                                    <div className="text-xs uppercase tracking-wider font-extrabold text-primary mb-2 flex items-center gap-1.5">
                                        <Sparkles size={14} />
                                        <span>תובנה מעשית מהשטח</span>
                                    </div>
                                    <p className="text-slate-800 text-base leading-relaxed font-medium">
                                        {section.image.caption || section.image.alt}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img 
                                    src={section.image.src} 
                                    alt={section.image.alt} 
                                    loading="lazy" 
                                    className="w-full aspect-video object-cover" 
                                />
                                {section.image.caption && (
                                    <figcaption className="p-3.5 sm:p-4 text-center text-xs sm:text-sm text-slate-600 bg-slate-50 border-t border-slate-100 font-medium">
                                        💡 {section.image.caption}
                                    </figcaption>
                                )}
                            </>
                        )}
                    </figure>
                )}

                {/* Section Callout if not negative list */}
                {section.callout && !isNegativeList && renderCallout(section.callout)}

                {/* Inline Contextual CTA */}
                {section.inlineCta && renderInlineCta(section.inlineCta)}

                {/* External policy links for official resources section */}
                {section.id.includes('official') && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 mb-8">
                        <a
                            href="https://www.whatsapp.com/legal/business-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 hover:border-primary rounded-xl text-primary font-bold shadow-sm hover:shadow transition-all group"
                        >
                            <span>WhatsApp Business Messaging Policy</span>
                            <ExternalLink size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                        <a
                            href="https://www.whatsapp.com/legal/commerce-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between gap-3 p-4 bg-white border border-gray-200 hover:border-primary rounded-xl text-primary font-bold shadow-sm hover:shadow transition-all group"
                        >
                            <span>WhatsApp Commerce Policy</span>
                            <ExternalLink size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                    </div>
                )}
            </section>
        );
    };

    return (
        <article className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans relative" dir="rtl">
            {/* Top Anchor for back to top buttons */}
            <div id="article-top" className="absolute top-0 left-0 w-full h-px pointer-events-none -mt-24" />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            {/* Article Header */}
            <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
                {/* Quiet Meta Above H1: Only Reading Time */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock size={13} className="text-slate-400" />
                        <span>{article.readTime}</span>
                    </span>
                </div>

                {/* H1 - Immediate, Dominant and High-Legibility */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-3 sm:mb-4">
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-5 font-normal">
                        {article.subtitle}
                    </p>
                )}

                {/* Contextual Knowledge Relationship (Subtle & Quiet Below H1) */}
                {parentHub && (
                    <div className="mb-4">
                        <a
                            href={parentHub.url}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(parentHub.url);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary transition-colors font-medium bg-slate-100 hover:bg-slate-200/80 px-3 py-1 rounded-lg border border-slate-200/60"
                        >
                            <Compass size={13} className="text-primary/70 shrink-0" />
                            <span>נושא: <strong className="font-semibold text-slate-800 hover:text-primary">{parentHub.title}</strong></span>
                            <ChevronLeft size={12} className="text-slate-400" />
                        </a>
                    </div>
                )}

                {/* Below H1: Streamlined Meta, Author & Share Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-b border-slate-200 py-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 sm:px-6 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            AB
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{article.author.name}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span>{article.author.role}</span>
                                <span>•</span>
                                <span>{new Date(article.datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span>•</span>
                                <span className="text-primary font-semibold">{article.category}</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Share Bar in Header */}
                    <SocialShareBar
                        title={article.title}
                        description={article.description}
                        keyTakeaway={article.keyTakeaway}
                        heroSummary={article.heroSummary}
                        slug={article.slug}
                        coverImage={article.coverImage}
                        variant="header"
                    />
                </div>
            </header>

            {/* Main Article Container with Desktop Two-Column Layout (RTL: Column 1 is Right side, Column 2 is Left side) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr] gap-10 items-start">
                    
                    {/* Desktop Sticky Table of Contents Sidebar (Right Column in RTL, natural content height, zero artificial legroom) */}
                    <aside className="hidden lg:flex flex-col sticky top-28 max-h-[calc(100vh-8.5rem)] space-y-3">
                        <nav aria-label="תוכן עניינים דביק" className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col min-h-0">
                            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 shrink-0">
                                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                                    <Compass size={17} className="text-primary" />
                                    <span>תוכן הפעולות</span>
                                </div>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    {totalActions > 0 ? `${totalActions} שלבים` : 'סעיפי תוכן'}
                                </span>
                            </div>

                            <div 
                                ref={tocContainerRef}
                                className="space-y-1 overflow-y-auto max-h-[46vh] xl:max-h-[50vh] pl-1 pr-0.5 custom-scrollbar"
                            >
                                {article.sections.map((sec) => {
                                    const isActive = activeSectionId === sec.id;
                                    return (
                                        <a
                                            key={sec.id}
                                            ref={isActive ? activeTocRef : null}
                                            href={`#${sec.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection(sec.id);
                                            }}
                                            className={`flex items-start gap-2 p-2 rounded-xl text-xs transition-all ${
                                                isActive 
                                                    ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary shadow-xs' 
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                        >
                                            {sec.actionNumber ? (
                                                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black flex-shrink-0 text-[10px] ${
                                                    isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    0{sec.actionNumber}
                                                </span>
                                            ) : sec.isTenMinuteTest ? (
                                                <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                                                    ⏱️
                                                </span>
                                            ) : (
                                                <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                                                    •
                                                </span>
                                            )}
                                            <span className="line-clamp-2 leading-snug pt-0.5">
                                                {sec.title}
                                            </span>
                                        </a>
                                    );
                                })}

                                {article.faqs && article.faqs.length > 0 && (
                                    <a
                                        href="#article-faqs"
                                        ref={activeSectionId === 'article-faqs' ? activeTocRef : null}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollToSection('article-faqs');
                                        }}
                                        className={`flex items-start gap-2 p-2 rounded-xl text-xs transition-all ${
                                            activeSectionId === 'article-faqs' 
                                                ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary shadow-xs' 
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="w-5 h-5 rounded-md bg-blue-100 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                                            ?
                                        </span>
                                        <span className="leading-snug pt-0.5">
                                            שאלות נפוצות (FAQ)
                                        </span>
                                    </a>
                                )}
                            </div>

                            <div className="pt-2.5 mt-2 border-t border-slate-100 shrink-0">
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        window.history.replaceState(null, '', window.location.pathname);
                                    }}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition-colors font-semibold"
                                >
                                    <ArrowUp size={13} />
                                    <span>חזרה לראש המאמר</span>
                                </button>
                            </div>
                        </nav>

                        {/* Sticky Desktop Sidebar CTA Card - Compact & Subordinate to Knowledge */}
                        <div className="shrink-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10 space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                                    <Sparkles size={11} />
                                    <span>בדיקת התאמה לעסק</span>
                                </div>
                                <h4 className="font-extrabold text-xs sm:text-sm text-white leading-snug">
                                    רוצים לראות איך זה עובד אצלכם?
                                </h4>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                    נמפה תהליך אחד בעסק ונראה איך לפשט אותו עם AltruBiz CRM.
                                </p>
                                <div className="pt-0.5 space-y-1.5">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full font-bold text-xs py-2 shadow-sm shadow-primary/25 flex items-center justify-center gap-1.5"
                                        onClick={() => {
                                            if (onOpenBookingModal) {
                                                onOpenBookingModal({
                                                    title: 'קביעת פגישה לבדיקת התאמה',
                                                    subtitle: 'נמפה תהליך אחד בעסק ונראה איך לפשט אותו עם AltruBiz CRM.',
                                                    badge: 'תיאום פגישה ביומן',
                                                    attribution: {
                                                        sourcePage: `/articles/${article.slug}`,
                                                        sourceSection: activeSectionId,
                                                        sourceArticle: article.slug,
                                                        sourceTopic: parentHub?.slug,
                                                        intent: 'booking',
                                                        ctaType: 'sidebar_cta',
                                                        sourceLabel: 'desktop_sidebar_booking'
                                                    }
                                                });
                                            } else {
                                                onNavigate('/#contact');
                                            }
                                        }}
                                    >
                                        <Calendar size={13} />
                                        <span>קביעת פגישה ביומן</span>
                                    </Button>
                                    <a
                                        href={buildAttributedWhatsAppUrl(
                                            `שלום צוות AltruBiz, קראתי את המאמר "${article.title}" ואשמח להתייעץ לגבי העסק שלנו.`,
                                            {
                                                sourcePage: `/articles/${article.slug}`,
                                                sourceSection: activeSectionId,
                                                sourceArticle: article.slug,
                                                sourceTopic: parentHub?.slug,
                                                intent: 'consultation',
                                                ctaType: 'sidebar_cta',
                                                sourceLabel: 'desktop_sidebar_whatsapp'
                                            }
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-[11px] font-semibold transition-colors"
                                    >
                                        <MessageCircle size={13} className="text-[#25D366]" />
                                        <span>התייעצות בוואטסאפ</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onOpenPricingModal) {
                                                onOpenPricingModal();
                                            } else {
                                                onNavigate('/#pricing');
                                            }
                                        }}
                                        className="w-full text-center text-[10px] text-slate-400 hover:text-white pt-1 transition-colors font-medium flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <Zap size={10} className="text-amber-400 fill-amber-400" />
                                        <span>חבילות ומחירים ←</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Primary Content Column (Left Column in RTL, comfortable reading width) */}
                    <div className="min-w-0 max-w-3xl mx-auto lg:mx-0 w-full">
                        
                        {/* Article Cover Image */}
                        {article.coverImage && (
                            <figure className="mb-10 rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-white">
                                <img 
                                    src={article.coverImage.src} 
                                    alt={article.coverImage.alt} 
                                    className="w-full aspect-[21/9] sm:aspect-[2.2/1] object-cover" 
                                />
                            </figure>
                        )}

                        {/* Intro summary box */}
                        {article.heroSummary && (
                            <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 border border-blue-100/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 mb-2">רקע ומטרת המדריך</h2>
                                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                                            {renderFormattedText(article.heroSummary, onNavigate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Top Table of Contents Grid (Hero Anchor Hub) */}
                        {article.sections && article.sections.length > 0 && (
                            <nav id="article-toc" aria-label="תוכן עניינים מהיר" className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
                                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Compass className="text-primary w-5 h-5" />
                                        <span>{totalActions > 0 ? `תוכן המדריך: ${totalActions} שלבים לפעולה מיידית` : 'תוכן המדריך: ניווט מהיר בין הסעיפים'}</span>
                                    </h2>
                                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                                        לחצו לקפיצה ישירה לסעיף
                                    </span>
                                </div>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                                    {article.sections.map((section, sIdx) => (
                                        <li key={section.id}>
                                            <a 
                                                href={`#${section.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    scrollToSection(section.id);
                                                }}
                                                className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all ${
                                                    activeSectionId === section.id 
                                                        ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                                        : 'text-slate-700 hover:text-primary hover:bg-slate-50 border border-transparent'
                                                }`}
                                            >
                                                {section.actionNumber ? (
                                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                                                        activeSectionId === section.id 
                                                            ? 'bg-primary text-white' 
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        0{section.actionNumber}
                                                    </span>
                                                ) : section.isTenMinuteTest ? (
                                                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black flex-shrink-0">
                                                        ⏱️
                                                    </span>
                                                ) : (
                                                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                        {sIdx + 1}
                                                    </span>
                                                )}
                                                <span className="text-xs sm:text-sm leading-tight pt-0.5">
                                                    {section.title}
                                                </span>
                                            </a>
                                        </li>
                                    ))}

                                    {article.faqs && article.faqs.length > 0 && (
                                        <li>
                                            <a 
                                                href="#article-faqs"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    scrollToSection('article-faqs');
                                                }}
                                                className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all ${
                                                    activeSectionId === 'article-faqs' 
                                                        ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                                        : 'text-slate-700 hover:text-primary hover:bg-slate-50 border border-transparent'
                                                }`}
                                            >
                                                <span className="w-6 h-6 rounded-lg bg-blue-100 text-primary flex items-center justify-center text-xs font-black flex-shrink-0">
                                                    ?
                                                </span>
                                                <span className="text-xs sm:text-sm leading-tight pt-0.5">
                                                    שאלות נפוצות ותשובות מעשיות (FAQ)
                                                </span>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}

                        {/* Key Takeaway Highlight */}
                        {article.keyTakeaway && (
                            <div id="rule-of-thumb-highlight" className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-xl shadow-amber-500/10 mb-14 border border-yellow-300">
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                        ⭐ עיקרון מוביל (Key Takeaway)
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-snug">
                                        {article.keyTakeaway}
                                    </h2>
                                    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl text-slate-900 font-medium text-base sm:text-lg leading-relaxed border border-white/50">
                                        {article.interactiveTheme ? (
                                            <div>
                                                <span>אין צורך לנסות להפעיל את כל 10 הפעולות בבת אחת. </span>
                                                <span className="font-extrabold text-amber-950">מומלץ להתחיל מפעולה אחת בלבד </span>
                                                <span>שפותרת את המכשול הכי מתסכל בעסק השבוע. לאחר שהיא עובדת בצורה חלקה ומייצרת שקט נפשי, מתקדמים לפעולה הבאה.</span>
                                            </div>
                                        ) : (
                                            <div>
                                                אם אתם מסתכלים על רשימת נמענים ושואלים:
                                                <div className="font-bold text-amber-950 my-1 italic">
                                                    &quot;האם האנשים האלה באמת יצפו לקבל מאיתנו את ההודעה הזאת?&quot;
                                                </div>
                                                ואתם לא בטוחים בתשובה - <span className="font-black text-rose-700 underline decoration-rose-400">עדיף לא לשלוח.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Article Body Sections */}
                        <div className="space-y-12 text-slate-800 leading-relaxed text-base sm:text-lg">
                            {article.sections.map((section, idx) => renderSection(section, idx))}

                            {/* Featured Social Share Card */}
                            <SocialShareBar
                                title={article.title}
                                description={article.description}
                                keyTakeaway={article.keyTakeaway}
                                heroSummary={article.heroSummary}
                                slug={article.slug}
                                coverImage={article.coverImage}
                                variant="featured"
                            />

                            {/* Frequently Asked Questions */}
                            {article.faqs && article.faqs.length > 0 && (
                                <section id="article-faqs" className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                        <HelpCircle className="text-primary" />
                                        <span>שאלות נפוצות ותשובות מעשיות</span>
                                    </h2>
                                    <div className="space-y-4">
                                        {article.faqs.map((faq, idx) => (
                                            <div key={idx} className="bg-slate-50/70 border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-shadow">
                                                <h3 className="font-bold text-lg text-slate-900 mb-2">
                                                    {faq.question}
                                                </h3>
                                                <p className="text-slate-700 text-base leading-relaxed">
                                                    {renderFormattedText(faq.answer, onNavigate)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <a 
                                            href="#article-toc"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('article-toc');
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 font-medium"
                                        >
                                            <ArrowUp size={13} />
                                            <span>חזרה לתוכן העניינים ↑</span>
                                        </a>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Bottom CTA to AltruBiz */}
                        <div className="mt-16 bg-gradient-to-r from-slate-900 via-dark to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden border border-slate-800">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 text-white">
                                    {article.cta ? article.cta.title : 'רוצים לבדוק איך זה יכול לעבוד אצלכם בעסק?'}
                                </h3>
                                <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                    {article.cta ? article.cta.description : 'צוות AltruBiz יסייע לכם לחבר את התהליכים, הלידים והאוטומציה העסקית בצורה מותאמת אישית לפעילות שלכם.'}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onOpenBookingModal) {
                                                onOpenBookingModal({
                                                    title: article.cta ? article.cta.buttonText : 'קביעת פגישה: איך זה יכול לעבוד אצלכם בעסק',
                                                    subtitle: article.cta ? article.cta.description : 'צוות AltruBiz יסייע לכם לחבר את התהליכים, הלידים והאוטומציה העסקית בצורה מותאמת אישית לפעילות שלכם.',
                                                    badge: 'תיאום פגישה ביומן',
                                                    attribution: {
                                                        sourcePage: `/articles/${article.slug}`,
                                                        sourceSection: 'article-footer-cta',
                                                        sourceArticle: article.slug,
                                                        sourceTopic: parentHub?.slug,
                                                        intent: 'booking',
                                                        ctaType: 'bottom_banner',
                                                        sourceLabel: 'article_footer_booking'
                                                    }
                                                });
                                            } else if (article.cta?.buttonLink.startsWith('/#')) {
                                                onNavigate(article.cta.buttonLink);
                                            } else {
                                                onNavigate('/#contact');
                                            }
                                        }}
                                    >
                                        <Button variant="primary" size="lg" className="font-bold text-base px-6 py-3.5 shadow-lg shadow-primary/25 flex items-center gap-2">
                                            <Calendar size={18} />
                                            <span>{article.cta ? article.cta.buttonText : 'קביעת פגישה: איך זה יכול לעבוד אצלכם בעסק'}</span>
                                        </Button>
                                    </button>

                                    <a
                                        href={buildAttributedWhatsAppUrl(
                                            article.cta?.whatsappText || `שלום צוות AltruBiz, קראתי את המאמר "${article.title}" ואשמח לבדוק איך זה יכול לעבוד אצלנו בעסק`,
                                            {
                                                sourcePage: `/articles/${article.slug}`,
                                                sourceSection: 'article-footer-cta',
                                                sourceArticle: article.slug,
                                                sourceTopic: parentHub?.slug,
                                                intent: 'consultation',
                                                ctaType: 'bottom_banner',
                                                sourceLabel: 'article_footer_whatsapp'
                                            }
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-base"
                                    >
                                        <MessageCircle size={18} />
                                        <span>התייעצות מהירה בוואטסאפ</span>
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onOpenPricingModal) {
                                                onOpenPricingModal();
                                            } else {
                                                onNavigate('/#pricing');
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-xl border border-white/20 transition-all text-base shadow-sm"
                                    >
                                        <Zap size={18} className="text-amber-400 fill-amber-400" />
                                        <span>צפייה בחבילות ומחירים</span>
                                    </button>

                                    {parentHub && (
                                        <button
                                            type="button"
                                            onClick={() => onNavigate(parentHub.url)}
                                            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3.5 rounded-xl transition-all text-sm sm:text-base shadow-sm"
                                        >
                                            <Layers size={16} />
                                            <span>למרכז האבחון: {parentHub.title}</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => onNavigate('/articles')}
                                        className="inline-flex items-center gap-2 text-white/80 hover:text-white px-5 py-3.5 rounded-xl border border-white/20 hover:border-white/40 transition-colors text-sm font-medium"
                                    >
                                        <ChevronLeft size={16} />
                                        <span>חזרה למרכז המאמרים</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Mobile Floating Sticky Pill */}
            {showMobileJump && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 lg:hidden max-w-[92vw]">
                    <button
                        onClick={() => setIsMobileDrawerOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/95 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20 text-xs font-bold active:scale-95 transition-all"
                    >
                        <Compass size={14} className="text-amber-400 flex-shrink-0" />
                        <span className="truncate max-w-[170px] sm:max-w-[240px]">
                            {parentHub ? `${parentHub.title} • ` : ''}{activeLabel}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono font-semibold flex-shrink-0">
                            {scrollProgress}%
                        </span>
                        <ChevronDown size={13} className="text-slate-300 flex-shrink-0" />
                    </button>
                </div>
            )}

            {/* Mobile Bottom-Sheet Drawer */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs">
                    <div 
                        className="fixed inset-0"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                    <div className="relative z-10 bg-white rounded-t-3xl max-h-[82vh] flex flex-col p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                            <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
                                <Compass size={20} className="text-primary" />
                                <span>בחירת פעולה לקפיצה מהירה</span>
                            </div>
                            <button
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                                aria-label="סגירת תפריט פעולות"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-2 py-2 flex-1 pr-1">
                            {article.sections.map((sec) => {
                                const isActive = activeSectionId === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full text-right flex items-start gap-3 p-3 rounded-2xl transition-colors ${
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                                : 'text-slate-800 hover:bg-slate-50'
                                        }`}
                                    >
                                        {sec.actionNumber ? (
                                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-xs ${
                                                isActive ? 'bg-primary text-white' : 'bg-emerald-100 text-emerald-800'
                                            }`}>
                                                0{sec.actionNumber}
                                            </span>
                                        ) : sec.isTenMinuteTest ? (
                                            <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black flex-shrink-0 text-xs">
                                                ⏱️
                                            </span>
                                        ) : (
                                            <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                                                •
                                            </span>
                                        )}
                                        <div className="text-xs sm:text-sm leading-tight pt-1">
                                            {sec.title}
                                        </div>
                                    </button>
                                );
                            })}

                            {article.faqs && article.faqs.length > 0 && (
                                <button
                                    onClick={() => scrollToSection('article-faqs')}
                                    className={`w-full text-right flex items-start gap-3 p-3 rounded-2xl transition-colors ${
                                        activeSectionId === 'article-faqs' 
                                            ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                            : 'text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="w-7 h-7 rounded-xl bg-blue-100 text-primary flex items-center justify-center font-black flex-shrink-0 text-xs">
                                        ?
                                    </span>
                                    <div className="text-xs sm:text-sm leading-tight pt-1">
                                        שאלות נפוצות ותשובות מעשיות (FAQ)
                                    </div>
                                </button>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                            {parentHub ? (
                                <a
                                    href={`/topics/${parentHub.slug}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMobileDrawerOpen(false);
                                        onNavigate(`/topics/${parentHub.slug}`);
                                    }}
                                    className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-colors"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Compass size={15} className="text-amber-600 shrink-0" />
                                        <span className="truncate">מרכז ידע: {parentHub.title}</span>
                                    </div>
                                    <span className="text-[10px] text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full font-bold shrink-0">חזרה לנושא ←</span>
                                </a>
                            ) : (
                                <a
                                    href="/articles"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMobileDrawerOpen(false);
                                        onNavigate('/articles');
                                    }}
                                    className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-between gap-2 transition-colors"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Compass size={15} className="text-slate-600 shrink-0" />
                                        <span className="truncate">כל המדריכים ומרכזי הידע</span>
                                    </div>
                                    <span className="text-[10px] text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full font-bold shrink-0">לכל המאמרים ←</span>
                                </a>
                            )}
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full font-bold text-xs sm:text-sm py-2.5 shadow-md shadow-primary/25 flex items-center justify-center gap-2"
                                onClick={() => {
                                    setIsMobileDrawerOpen(false);
                                    if (onOpenBookingModal) {
                                        onOpenBookingModal({
                                            title: 'קביעת פגישה לבדיקת התאמה',
                                            subtitle: 'נמפה תהליך אחד בעסק ונראה איך לפשט אותו עם AltruBiz CRM.',
                                            badge: 'תיאום פגישה ביומן',
                                            attribution: {
                                                sourcePage: `/articles/${article.slug}`,
                                                sourceSection: activeSectionId,
                                                sourceArticle: article.slug,
                                                sourceTopic: parentHub?.slug,
                                                intent: 'booking',
                                                ctaType: 'mobile_nav',
                                                sourceLabel: 'mobile_drawer_booking'
                                            }
                                        });
                                    } else {
                                        onNavigate('/#contact');
                                    }
                                }}
                            >
                                <Calendar size={15} />
                                <span>קביעת פגישה לבדיקת התאמה</span>
                            </Button>
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setIsMobileDrawerOpen(false);
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <ArrowUp size={13} />
                                <span>חזרה לראש המאמר</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

