import React, { useState } from 'react';
import { 
    AlertTriangle, 
    CheckCircle2, 
    ArrowLeft, 
    HelpCircle, 
    Clock, 
    Zap, 
    MessageCircle, 
    Layers, 
    ChevronDown, 
    BookOpen, 
    Target,
    Activity
} from 'lucide-react';
import { KnowledgeNode, getKnowledgeNodeBySlug } from '../../data/knowledgeGraph';
import { getArticleBySlug } from '../../data/articles';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Button } from '../ui/Button';

interface HubPageProps {
    node: KnowledgeNode;
    onNavigate: (path: string) => void;
    onOpenContactModal?: (options?: {
        title?: string;
        subtitle?: string;
        badge?: string;
        whatsappPrefill?: string;
    }) => void;
    onOpenPricingModal?: () => void;
}

export const HubPage: React.FC<HubPageProps> = ({
    node,
    onNavigate,
    onOpenContactModal,
    onOpenPricingModal
}) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע', path: '/articles' },
        { name: node.title, path: node.url }
    ];

    const hub = node.hubData;

    // Fetch related articles objects with strict type guard
    const relatedArticles = (node.relatedArticleSlugs || [])
        .map(slug => getArticleBySlug(slug))
        .filter((art): art is NonNullable<typeof art> => Boolean(art));

    return (
        <article className="min-h-screen bg-slate-50 pt-28 pb-20 selection:bg-yellow-200">
            {/* Main Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
                </div>

                {/* Hero Header */}
                <header className="mb-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-200 mb-4">
                            <Layers className="w-3.5 h-3.5 text-secondary" />
                            <span>{node.nodeType === 'pain_hub' ? 'מדריך אבחון ומענה מקיף' : 'מדריך יישום וניהול תקשורת'}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            {node.title}
                        </h1>

                        {node.subtitle && (
                            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed mb-6">
                                {node.subtitle}
                            </p>
                        )}

                        {/* Direct Answer / Problem Definition Box */}
                        {hub && (
                            <div className="bg-slate-50 border-r-4 border-primary rounded-2xl p-5 sm:p-6 mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span>הגדרת הבעיה והשפעתה על העסק:</span>
                                </h2>
                                <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-normal">
                                    {hub.problemDefinition}
                                </p>
                            </div>
                        )}

                        {/* Fast Navigation Anchors */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-sm">
                            <span className="text-slate-400 font-medium text-xs">קפיצה מהירה במדריך:</span>
                            <a href="#diagnostics" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs">
                                אבחון תסמינים
                            </a>
                            <a href="#quick-win" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs">
                                פעולה מהירה (Quick Win)
                            </a>
                            <a href="#manifestations" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs">
                                מדריכים ומאמרים תומכים
                            </a>
                            <a href="#solutions" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs">
                                דרכי פתרון ב-CRM
                            </a>
                            <a href="#faqs" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium text-xs">
                                שאלות נפוצות
                            </a>
                        </div>
                    </div>
                </header>

                {/* Section 1: Symptoms & Cost */}
                {hub && (
                    <section className="mb-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Why it happens / Symptoms */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <Activity className="w-5 h-5 text-rose-500" />
                                <span>למה הבעיה הזו מתרחשת בעסק?</span>
                            </h2>
                            <ul className="space-y-3">
                                {hub.whyItHappens.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                                        <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Business Cost */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <span>המחיר הישיר שהעסק משלם</span>
                            </h2>
                            <ul className="space-y-3">
                                {hub.businessCost.map((cost, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                                        <span>{cost}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* Section 2: Diagnostics Checklist */}
                {hub && hub.diagnosticQuestions && hub.diagnosticQuestions.length > 0 && (
                    <section id="diagnostics" className="mb-14 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm scroll-mt-24">
                        <div className="mb-6">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                כלי אבחון עצמי
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                                שאלות אבחון: האם גם אצלכם הבעיה פעילה כרגע?
                            </h2>
                            <p className="text-slate-600 text-base mt-1">
                                בחנו את שלוש השאלות הבאות כדי לגלות איפה בדיוק נתקעים הדברים:
                            </p>
                        </div>

                        <div className="space-y-4">
                            {hub.diagnosticQuestions.map((diag, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:border-slate-300 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                                                {diag.question}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                                <div className="bg-rose-50/80 border border-rose-200/60 rounded-xl p-3 text-rose-900">
                                                    <span className="font-bold block mb-1">תמרור אזהרה:</span>
                                                    {diag.warningSign}
                                                </div>
                                                <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 text-amber-900">
                                                    <span className="font-bold block mb-1">ההשפעה על התוצאה:</span>
                                                    {diag.impact}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Section 3: Primary Quick Win */}
                {hub && hub.primaryQuickWin && (
                    <section id="quick-win" className="mb-14 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden scroll-mt-24">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                            <span>Quick Win – פעולה מומלצת להיום</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                            {hub.primaryQuickWin.title}
                        </h2>
                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
                            {hub.primaryQuickWin.text}
                        </p>
                        {hub.primaryQuickWin.actionSteps && (
                            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-emerald-200/80">
                                <h3 className="text-sm font-bold text-slate-900 mb-3">צעדים מעשיים ליישום מיידי:</h3>
                                <ul className="space-y-2">
                                    {hub.primaryQuickWin.actionSteps.map((step, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-slate-800">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}

                {/* Section 4: Manifestations & Deep Knowledge Articles */}
                <section id="manifestations" className="mb-16 scroll-mt-24">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 mb-2">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>מאגר ידע מעמיק ומחקר שטח</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            איך הבעיה הזו מתבטאת בשטח – ומדריכים מעשיים
                        </h2>
                        <p className="text-slate-600 text-base mt-1">
                            סקירת תופעות השטח הנפוצות ביותר בעסקים ומדריכים יישומיים מתוך מרכז הידע של AltruBiz:
                        </p>
                    </div>

                    {/* Sub-sections / Manifestations */}
                    {hub && hub.sections && (
                        <div className="space-y-8 mb-10">
                            {hub.sections.map((sec) => (
                                <div key={sec.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                                        {sec.title}
                                    </h3>
                                    {sec.subtitle && (
                                        <p className="text-slate-500 font-medium text-sm sm:text-base mb-4">
                                            {sec.subtitle}
                                        </p>
                                    )}
                                    <div className="space-y-3 mb-6">
                                        {sec.content.map((p, idx) => (
                                            <p key={idx} className="text-slate-700 text-base leading-relaxed">
                                                {p}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Linked Articles Cards */}
                                    {sec.relatedArticleSlugs && sec.relatedArticleSlugs.length > 0 && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                מדריכים מומלצים בנושא זה:
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {sec.relatedArticleSlugs.map(slug => {
                                                    const art = getArticleBySlug(slug);
                                                    if (!art) return null;
                                                    return (
                                                        <div 
                                                            key={slug} 
                                                            onClick={() => onNavigate(`/articles/${art.slug}`)}
                                                            className="group p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-secondary/50 hover:bg-cyan-50/20 transition-all cursor-pointer flex flex-col justify-between"
                                                        >
                                                            <div>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{art.readTime || '6 דקות קריאה'}</span>
                                                                </div>
                                                                <h5 className="font-bold text-slate-900 group-hover:text-secondary transition-colors text-sm sm:text-base leading-snug mb-2">
                                                                    {art.title}
                                                                </h5>
                                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                                    {art.description}
                                                                </p>
                                                            </div>
                                                            <div className="mt-3 flex items-center text-xs font-semibold text-secondary group-hover:translate-x-[-2px] transition-transform">
                                                                <span>לקריאת המדריך המלא</span>
                                                                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* All Hub Articles Grid */}
                    <div className="bg-slate-100/70 border border-slate-200 rounded-3xl p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            כל המאמרים המקושרים לאשכול ידע זה ({relatedArticles.length}):
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {relatedArticles.map((art) => (
                                <div 
                                    key={art.slug} 
                                    onClick={() => onNavigate(`/articles/${art.slug}`)}
                                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <div className="pr-2">
                                        <h4 className="font-bold text-slate-900 hover:text-secondary text-sm leading-snug">
                                            {art.title}
                                        </h4>
                                        <span className="text-xs text-slate-500 mt-1 inline-block">
                                            {art.readTime || '7 דקות קריאה'}
                                        </span>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 5: AltruBiz Solution Paths */}
                {hub && hub.solutionPaths && (
                    <section id="solutions" className="mb-14 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden scroll-mt-24">
                        <div className="relative z-10">
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-400/20">
                                פתרון מערכתי ב-AltruBiz
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-4">
                                איך בונים פתרון קבוע בעסק כדי שהבעיה לא תחזור?
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-3xl">
                                במקום להסתמך על רצון טוב או על זיכרון של עובדים, בונים תהליך אוטומטי מבוסס מערכת:
                            </p>

                            <div className="space-y-6 mb-8">
                                {hub.solutionPaths.map((sol, idx) => (
                                    <div key={idx} className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{sol.title}</h3>
                                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                                            {sol.description}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {sol.featureHighlights.map((feat, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2.5 text-sm text-slate-200">
                                                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hub Contextual CTAs */}
                            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => onOpenContactModal ? onOpenContactModal({
                                        title: 'קביעת פגישת אבחון והתאמה אישית',
                                        subtitle: `בפגישה נמפה את תהליך העבודה שלכם ונבחן פתרון מעשי עבור: ${node.title}`,
                                        badge: 'אבחון מערכתי'
                                    }) : onNavigate('/#contact')}
                                    className="w-full sm:w-auto shadow-xl"
                                >
                                    קביעת פגישת אבחון והתאמה
                                </Button>

                                {onOpenPricingModal && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={onOpenPricingModal}
                                        className="w-full sm:w-auto border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                                    >
                                        צפייה בחבילות ומסלולי הטמעה
                                    </Button>
                                )}

                                <a
                                    href={`https://api.whatsapp.com/send/?phone=972544350000&text=${encodeURIComponent(`שלום צוות AltruBiz, קראתי את מרכז הידע בנושא "${node.title}" ואשמח להתייעץ לגבי העסק שלנו.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-emerald-400 font-medium transition-colors py-2 px-3"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                    <span>התייעצות מהירה בוואטסאפ</span>
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Section 6: FAQs */}
                {hub && hub.faqs && hub.faqs.length > 0 && (
                    <section id="faqs" className="mb-14 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm scroll-mt-24">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <HelpCircle className="w-4 h-4 text-primary" />
                            <span>שאלות ותשובות נפוצות</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
                            שאלות נפוצות בנושא זה
                        </h2>

                        <div className="space-y-3">
                            {hub.faqs.map((faq, index) => {
                                const isOpen = openFaqIndex === index;
                                return (
                                    <div 
                                        key={index}
                                        className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(index)}
                                            className="w-full p-5 text-right font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-base sm:text-lg leading-snug">{faq.question}</span>
                                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="p-5 pt-0 text-slate-600 text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Section 7: Suggested Next Hubs & Topics */}
                {node.recommendedNextSlugs && node.recommendedNextSlugs.length > 0 && (
                    <section className="mb-12 p-6 sm:p-8 bg-slate-100/80 border border-slate-200 rounded-3xl">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                            נושאי ידע נוספים שכדאי להכיר:
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {node.recommendedNextSlugs.map(slug => {
                                const nextNode = getKnowledgeNodeBySlug(slug);
                                if (nextNode) {
                                    return (
                                        <button
                                            key={slug}
                                            onClick={() => onNavigate(nextNode.url)}
                                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-medium text-sm flex items-center gap-2 hover:shadow-sm transition-all"
                                        >
                                            <Layers className="w-4 h-4 text-secondary" />
                                            <span>{nextNode.title}</span>
                                        </button>
                                    );
                                }
                                const art = getArticleBySlug(slug);
                                if (art) {
                                    return (
                                        <button
                                            key={slug}
                                            onClick={() => onNavigate(`/articles/${art.slug}`)}
                                            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-medium text-sm flex items-center gap-2 hover:shadow-sm transition-all"
                                        >
                                            <BookOpen className="w-4 h-4 text-blue-500" />
                                            <span>{art.title}</span>
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
};
