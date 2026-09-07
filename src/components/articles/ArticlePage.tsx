import React, { useState } from 'react';
import { 
    Calendar, 
    Clock, 
    Share2, 
    Check, 
    Copy, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    ShieldAlert, 
    ExternalLink, 
    ChevronLeft, 
    Sparkles,
    HelpCircle,
    Info
} from 'lucide-react';
import { Article, ArticleSection } from '../../data/articles';
import { Button } from '../ui/Button';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface ArticlePageProps {
    article: Article;
    onNavigate: (path: string) => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ article, onNavigate }) => {
    const [copiedLink, setCopiedLink] = useState(false);

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע ומאמרים', path: '/articles' },
        { name: article.title, path: `/articles/${article.slug}` }
    ];

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
    };

    const handleShareWhatsApp = () => {
        const text = encodeURIComponent(`${article.title}\n\n${window.location.href}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

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
                                            {para}
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
                                {para}
                            </p>
                        ))}
                    </div>
                )}

                {/* Ordered Items (numbered cards or grid) */}
                {section.orderedItems && section.orderedItems.length > 0 && (
                    section.id.includes('checklist') ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {section.orderedItems.map((item, oIdx) => (
                                <div key={oIdx} className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</div>
                                        <div className="text-xs sm:text-sm text-slate-600 mt-0.5">{item.description}</div>
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
                                                {item.description}
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
                                        <span>{item}</span>
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
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    )
                )}

                {/* Section Callout if not negative list */}
                {section.callout && !isNegativeList && renderCallout(section.callout)}

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
        <article className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            {/* Top Reading Progress & Breadcrumbs */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            {/* Article Header */}
            <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-primary border border-blue-200">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock size={13} className="text-gray-400" />
                        {article.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <Calendar size={13} className="text-gray-400" />
                        {new Date(article.datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.25] mb-6">
                    {article.title}
                </h1>

                {article.subtitle && (
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
                        {article.subtitle}
                    </p>
                )}

                {/* Author & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-b border-gray-200 py-4 bg-white/60 backdrop-blur-sm rounded-2xl px-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
                            AB
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm sm:text-base">{article.author.name}</div>
                            <div className="text-xs text-slate-500">{article.author.role}</div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            <span>{copiedLink ? 'הקישור הועתק!' : 'העתק קישור'}</span>
                        </button>

                        <button
                            onClick={handleShareWhatsApp}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 transition-colors"
                        >
                            <Share2 size={14} />
                            <span>שתף בוואטסאפ</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Intro summary box */}
                {article.heroSummary && (
                    <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/80 border border-blue-100/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-base font-bold text-slate-900 mb-2">רקע ומטרת המדריך</h2>
                                <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                                    {article.heroSummary}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table of Contents */}
                {article.sections && article.sections.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-12 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span>תוכן עניינים מקוצר</span>
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {article.sections.map((section, sIdx) => (
                                <li key={section.id}>
                                    <a 
                                        href={`#${section.id}`}
                                        className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {sIdx + 1}
                                        </span>
                                        <span className="truncate">{section.title}</span>
                                    </a>
                                </li>
                            ))}
                            {article.faqs && article.faqs.length > 0 && (
                                <li>
                                    <a 
                                        href="#article-faqs"
                                        className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-blue-100 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            ?
                                        </span>
                                        <span className="truncate">שאלות נפוצות ותשובות</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Key Takeaway Highlight (Golden Rule Callout) */}
                {article.keyTakeaway && (
                    <div id="rule-of-thumb-highlight" className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-6 sm:p-8 rounded-2xl shadow-xl shadow-amber-500/10 mb-14 border border-yellow-300">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-black/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                ⭐ עיקרון מוביל (Key Takeaway)
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black mb-4 leading-snug">
                                {article.keyTakeaway}
                            </h2>
                            <div className="bg-white/85 backdrop-blur-sm p-4 rounded-xl text-slate-900 font-medium text-base sm:text-lg leading-relaxed border border-white/50">
                                אם אתם מסתכלים על רשימת נמענים ושואלים:
                                <div className="font-bold text-amber-950 my-1 italic">
                                    &quot;האם האנשים האלה באמת יצפו לקבל מאיתנו את ההודעה הזאת?&quot;
                                </div>
                                ואתם לא בטוחים בתשובה — <span className="font-black text-rose-700 underline decoration-rose-400">עדיף לא לשלוח.</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Body Sections */}
                <div className="space-y-14 text-slate-800 leading-relaxed text-base sm:text-lg">
                    {article.sections.map((section, idx) => renderSection(section, idx))}

                    {/* Frequently Asked Questions (FAQ Section) */}
                    {article.faqs && article.faqs.length > 0 && (
                        <section id="article-faqs" className="scroll-mt-28">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <HelpCircle className="text-primary" />
                                <span>שאלות נפוצות ותשובות מעשיות</span>
                            </h2>
                            <div className="space-y-4">
                                {article.faqs.map((faq, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-lg text-slate-900 mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-slate-700 text-base leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Bottom CTA to AltruBiz */}
                <div className="mt-16 bg-gradient-to-r from-dark to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                            רוצים להכניס שיטה ואוטומציה לתקשורת בעסק שלכם?
                        </h3>
                        <p className="text-slate-300 text-sm sm:text-base mb-6">
                            מערכת AltruBiz CRM מאפשרת לכם לנהל שיחות, תבניות, לידים ובוטים חכמים בצורה מסודרת, מקצועית ובטוחה.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    onNavigate('/#pricing');
                                }}
                            >
                                <Button variant="primary" size="lg" className="font-bold">
                                    התחילו עכשיו עם AltruBiz
                                </Button>
                            </button>
                            <button
                                onClick={() => onNavigate('/articles')}
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white px-5 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-sm font-medium"
                            >
                                <ChevronLeft size={16} />
                                <span>חזרה למרכז המאמרים</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
