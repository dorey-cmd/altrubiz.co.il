import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, 
    Clock, 
    ArrowLeft, 
    Sparkles, 
    FileText,
    Search,
    ChevronDown,
    Check,
    X,
    Filter
} from 'lucide-react';
import { ARTICLES, Article } from '../../data/articles';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { deriveStateFlags, isPubliclyLinkable } from '../../siteos';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Publication-state authority (SiteOS Phase 3): the public /knowledge index
// must only ever list publicly-linkable (published + indexable) articles --
// it previously listed the raw, unfiltered ARTICLES array, which meant
// review-status articles were unconditionally discoverable here. This is
// the fix for that gap.
const PUBLIC_ARTICLES = ARTICLES.filter(a => isPubliclyLinkable(deriveStateFlags(a)));

interface ArticlesIndexProps {
    onNavigate: (path: string) => void;
    onOpenContactModal?: (config?: any) => void;
    onOpenBookingModal?: (config?: any) => void;
}

// Fisher-Yates shuffle to randomize articles order on each page visit
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const ArticlesIndex: React.FC<ArticlesIndexProps> = ({ onNavigate, onOpenContactModal, onOpenBookingModal }) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    // Randomize articles on each page entry/mount
    const [shuffledArticles] = useState<Article[]>(() => shuffleArray(PUBLIC_ARTICLES));
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Close category dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: PUBLIC_ARTICLES.length };
        PUBLIC_ARTICLES.forEach(a => {
            counts[a.category] = (counts[a.category] || 0) + 1;
        });
        return counts;
    }, []);

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע ומאמרים', path: '/knowledge' }
    ];

    const categories = ['all', ...Array.from(new Set(PUBLIC_ARTICLES.map(a => a.category)))];

    const filteredArticles = shuffledArticles.filter(article => {
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchesSearch = 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            {/* Header / Hero */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
                {/* Breadcrumbs */}
                <div className="flex justify-center mb-6">
                    <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-secondary text-xs sm:text-sm font-bold mb-4 border border-cyan-100 shadow-xs">
                    <BookOpen size={16} />
                    <span>מאגר הידע והתכנים של AltruBiz</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    מדריכים, תובנות ומאמרים מקצועיים
                </h1>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                    כל מה שצריך לדעת על אוטומציה עסקית, חיבורי WhatsApp Business, שיווק אחראי ומדיניות פלטפורמות - כדי להכניס את השיטה לסיסטם.
                </p>

                {/* Unified Search & Category Filter Toolbar */}
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shadow-xs">
                        {/* Category Filter Dropdown (Right side in RTL) */}
                        <div ref={categoryDropdownRef} className="relative z-20 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                aria-expanded={isCategoryOpen}
                                aria-haspopup="listbox"
                                className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-secondary/40 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs transition-all min-w-[200px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Filter size={15} className="text-secondary flex-shrink-0" />
                                    <span className="truncate max-w-[170px]">
                                        {selectedCategory === 'all' ? 'כל הנושאים' : selectedCategory}
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-200/70 text-slate-600">
                                        {categoryCounts[selectedCategory] || filteredArticles.length}
                                    </span>
                                </div>
                                <ChevronDown 
                                    size={15} 
                                    className={`text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-secondary' : ''}`} 
                                />
                            </button>

                            <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                        transition={{ duration: 0.16, ease: 'easeOut' }}
                                        role="listbox"
                                        className="absolute right-0 top-full mt-2 w-72 max-h-72 sm:max-h-80 overflow-y-auto overscroll-contain bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-0.5 text-right z-30 divide-y divide-slate-100/50"
                                    >
                                        {categories.map((cat) => {
                                            const isSelected = selectedCategory === cat;
                                            const count = categoryCounts[cat] || 0;
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                                        isSelected
                                                            ? 'bg-cyan-50 text-secondary font-bold'
                                                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                                >
                                                    <span className="truncate">{cat === 'all' ? 'כל הנושאים והמדריכים' : cat}</span>
                                                    <div className="flex items-center gap-2 flex-shrink-0 mr-2">
                                                        <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                                                            {count}
                                                        </span>
                                                        {isSelected && <Check size={14} className="text-secondary" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Input Box (Left side in RTL) */}
                        <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
                            <Search size={16} className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="חיפוש מאמר או נושא..."
                                aria-label="חיפוש מאמר או נושא"
                                className="w-full pr-10 pl-9 py-2.5 rounded-xl border border-transparent bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary text-xs sm:text-sm transition-all"
                            />
                            {searchQuery.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                                    aria-label="איפוס חיפוש"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filter Indicator */}
                    {(selectedCategory !== 'all' || searchQuery.trim().length > 0) && (
                        <div className="flex items-center justify-between px-3 py-1.5 mt-2 text-xs text-slate-500">
                            <span>
                                נמצאו <strong className="text-slate-800 font-bold">{filteredArticles.length}</strong> מאמרים
                                {selectedCategory !== 'all' && ` בנושא "${selectedCategory}"`}
                                {searchQuery.trim().length > 0 && ` עבור "${searchQuery}"`}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchQuery('');
                                }}
                                className="font-bold text-secondary hover:underline"
                            >
                                איפוס סינון
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content: 2-Column Balanced Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Articles Stream Column (lg:col-span-8) -- a <div>, not
                        a nested <main>: the page's single <main> landmark is
                        already declared once in App.tsx (id="main-content"),
                        and HTML does not allow a <main> nested inside
                        another <main>. */}
                    <div className="lg:col-span-8">
                        {filteredArticles.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-700">לא נמצאו מאמרים התואמים לחיפוש</h3>
                                <p className="text-sm text-gray-500 mt-1">אפשר לנסות מילת חיפוש אחרת או לאפס את הסינון.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                    className="mt-4 text-xs font-bold text-secondary hover:underline"
                                >
                                    איפוס חיפוש
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredArticles.map((article: Article) => (
                                    <motion.div 
                                        key={article.slug}
                                        initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "0px 0px 20px 0px", amount: 0.05 }}
                                        transition={{ 
                                            duration: 0.5, 
                                            ease: [0.25, 1, 0.5, 1] 
                                        }}
                                        className="group relative bg-white border border-slate-200/90 hover:border-secondary/40 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-[border-color,box-shadow] duration-300 flex flex-col md:flex-row gap-5 md:gap-6 items-stretch transform-gpu"
                                    >
                                        {/* Cover Image Container */}
                                        {article.coverImage && (
                                            <div 
                                                onClick={() => onNavigate(article.publicPath)}
                                                className="w-full md:w-56 lg:w-60 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-slate-100 shadow-xs relative aspect-video md:aspect-auto min-h-[170px] animate-ambient-breath"
                                            >
                                                <img 
                                                    src={article.coverImage.src} 
                                                    alt={article.coverImage.alt} 
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                            </div>
                                        )}

                                        {/* Content Container */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-50 text-secondary border border-cyan-100">
                                                        {article.category}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {article.readTime}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        • {new Date(article.datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>

                                                <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-secondary transition-colors mb-2 leading-snug">
                                                    <button 
                                                        onClick={() => onNavigate(article.publicPath)}
                                                        className="text-right hover:underline"
                                                    >
                                                        {article.title}
                                                    </button>
                                                </h2>

                                                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                                    {article.description}
                                                </p>
                                            </div>

                                            {/* Card Bottom Container with Author & Creative Action Button in Biz Cyan */}
                                            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <span className="font-bold text-slate-800">{article.author.name}</span>
                                                    <span>•</span>
                                                    <span>{article.author.role}</span>
                                                </div>

                                                <button
                                                    onClick={() => onNavigate(article.publicPath)}
                                                    className="w-full sm:w-auto group/btn inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-[#006185] active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-secondary/20 hover:shadow-lg hover:shadow-secondary/30 transition-all duration-200"
                                                >
                                                    <span>{article.cardCta || 'איך פותרים את זה בעסק?'}</span>
                                                    <ArrowLeft size={14} className="transition-transform duration-200 group-hover/btn:-translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Topic Hub Banners Column (lg:col-span-4) */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* Topic Banner 1: Lost Leads Hub */}
                        <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                                    אבחון נקודות תורפה
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    מדריך מקיף
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 leading-snug">
                                לידים נופלים בין הכיסאות?
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
                                אבחון מהיר של צווארי הבקבוק במשפך המכירות: למה מענה מתעכב, איך שיחות מתפספסות ואיך מערכת CRM פותרת את זה לצמיתות.
                            </p>
                            <button
                                onClick={() => onNavigate('/lost-leads')}
                                className="w-full group/btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                            >
                                <span>למרכז האבחון והפתרון</span>
                                <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Topic Banner 2: WhatsApp Hub */}
                        <div className="bg-white border border-slate-200 hover:border-secondary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-primary border border-blue-200">
                                    תקשורת ומכירות
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    מדריך יישום
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 leading-snug">
                                וואטסאפ במערכת ה-CRM
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
                                איך לחבר את ערוץ התקשורת המרכזי של העסק לתיבת הודעות אחת מסודרת עם מענה ב-5 הדקות הראשונות וללא איבוד היסטוריה.
                            </p>
                            <button
                                onClick={() => onNavigate('/whatsapp-in-crm')}
                                className="w-full group/btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-[#006185] text-white text-xs sm:text-sm font-bold shadow-sm shadow-secondary/20 transition-all"
                            >
                                <span>למדריך וואטסאפ ב-CRM</span>
                                <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* CTA Banner: Meeting & Fit Consultation */}
                        <div className="bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/60 border border-blue-100 rounded-3xl p-6 shadow-sm">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-3 border border-primary/20">
                                <Sparkles size={12} className="text-primary" />
                                <span>בדיקת התאמה ללא התחייבות</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug">
                                רוצים לבדוק איך זה עובד בעסק שלכם?
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                                בשיחה קצרה נמפה את צורת העבודה הנוכחית שלכם, ונבדוק יחד איך להטמיע תהליכים אוטומטיים שיחסכו לכם שעות של עבודה ידנית.
                            </p>
                            <button
                                onClick={() => onOpenBookingModal ? onOpenBookingModal({
                                    title: 'קביעת שיחת התאמה אישית',
                                    subtitle: 'נשמח להבין את האתגרים בעסק שלכם ולהראות לכם איך המערכת עובדת בפועל.',
                                    badge: 'תיאום שיחה ביומן'
                                }) : onNavigate('/#contact')}
                                className="w-full group/btn inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#0052a3] text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/25 transition-all mb-2.5"
                            >
                                <span>קביעת שיחת התאמה</span>
                                <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </button>
                            {onOpenContactModal && (
                                <button
                                    onClick={() => onOpenContactModal({
                                        title: 'השארת פרטים ליצירת קשר',
                                        subtitle: 'מעדיפים שנחזור אליכם? השאירו פרטים ונחזור בהקדם.',
                                        badge: 'השארת פרטים'
                                    })}
                                    className="w-full text-center text-xs text-slate-500 hover:text-primary font-medium transition-colors py-1"
                                >
                                    מעדיפים שנחזור אליכם? השארת פרטים
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Bottom info banner about ongoing updates */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-6 text-center">
                    <Sparkles className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <h3 className="font-bold text-slate-800 text-base mb-1">
                        מרכז הידע ממשיך להתעדכן!
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                        אנו מוסיפים בקביעות מדריכים חדשים, דפי מדיניות, תבניות מומלצות ותובנות לשיפור הביצועים העסקיים שלכם בערוצי הדיגיטל והאוטומציה.
                    </p>
                </div>
            </div>
        </div>
    );
};
