import React, { useState } from 'react';
import { 
    BookOpen, 
    Clock, 
    ArrowLeft, 
    Sparkles, 
    Tag, 
    FileText,
    Layers 
} from 'lucide-react';
import { ARTICLES, Article } from '../../data/articles';
import { getAllHubs } from '../../data/knowledgeGraph';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface ArticlesIndexProps {
    onNavigate: (path: string) => void;
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

export const ArticlesIndex: React.FC<ArticlesIndexProps> = ({ onNavigate }) => {
    // Randomize articles on each page entry/mount
    const [shuffledArticles] = useState<Article[]>(() => shuffleArray(ARTICLES));
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const hubs = getAllHubs();

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע ומאמרים', path: '/articles' }
    ];

    const categories = ['all', ...Array.from(new Set(ARTICLES.map(a => a.category)))];

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

                {/* Filter and Search Bar */}
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="חיפוש מאמר או נושא..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-sm shadow-sm"
                    />

                    {categories.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {cat === 'all' ? 'הכל' : cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Knowledge Topology & Pain Hubs Showcase */}
            {searchQuery === '' && selectedCategory === 'all' && hubs.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-500/25">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black mb-3">
                                        <Layers size={14} />
                                        <span>טופולוגיית ידע עסקית (Pain & Topic Hubs)</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                                        באיזה אתגר עסקי נתמקד היום?
                                    </h2>
                                    <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl font-normal leading-relaxed">
                                        במקום מאמרים מבודדים, הידע ב-AltruBiz מאורגן סביב בעיות עסקיות אמיתיות: אבחון מקיף, תסמינים בשטח, צעדים מעשיים ופתרונות מערכתיים.
                                    </p>
                                </div>
                            </div>

                            {/* Hubs Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {hubs.map((hub) => (
                                    <div 
                                        key={hub.slug}
                                        onClick={() => onNavigate(hub.url)}
                                        className="group bg-white/10 hover:bg-white/[0.16] border border-white/15 hover:border-amber-400/60 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-md shadow-sm hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3.5">
                                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                                    hub.nodeType === 'pain_hub' 
                                                        ? 'bg-rose-500/25 text-rose-200 border border-rose-400/40' 
                                                        : 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                                                }`}>
                                                    {hub.nodeType === 'pain_hub' ? 'מרכז אבחון כאב עסקי' : 'מדריך מקיף וקונספט ידע (Micro Hub)'}
                                                </span>
                                                <span className="text-xs text-slate-300 font-medium">
                                                    {hub.relatedArticleSlugs?.length || 5} מאמרים מקושרים
                                                </span>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors mb-2 leading-snug">
                                                {hub.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                                                {hub.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-bold text-amber-300 group-hover:text-amber-200">
                                            <span>כניסה למרכז האבחון והפתרון</span>
                                            <ArrowLeft size={16} className="group-hover:translate-x-[-4px] transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles Grid / List */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="space-y-8">
                        {filteredArticles.map((article: Article) => (
                            <div 
                                key={article.slug}
                                className="group relative bg-white border border-slate-200/90 hover:border-secondary/40 rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch"
                            >
                                {/* Cover Image Container */}
                                {article.coverImage && (
                                    <div 
                                        onClick={() => onNavigate(`/articles/${article.slug}`)}
                                        className="w-full md:w-64 lg:w-72 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-slate-100 shadow-xs relative aspect-video md:aspect-auto min-h-[190px]"
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
                                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-cyan-50 text-secondary border border-cyan-100">
                                                {article.category}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                <Clock size={12} className="text-slate-400" />
                                                {article.readTime}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                • {new Date(article.datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>

                                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-secondary transition-colors mb-3 leading-snug">
                                            <button 
                                                onClick={() => onNavigate(`/articles/${article.slug}`)}
                                                className="text-right hover:underline"
                                            >
                                                {article.title}
                                            </button>
                                        </h2>

                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                                            {article.description}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap items-center gap-1.5 mb-5">
                                            {article.tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                                                    <Tag size={10} className="text-slate-400" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Bottom Container with Author & Creative Action Button in Biz Cyan */}
                                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto">
                                        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                                            <span className="font-bold text-slate-800">{article.author.name}</span>
                                            <span>•</span>
                                            <span>{article.author.role}</span>
                                        </div>

                                        <button
                                            onClick={() => onNavigate(`/articles/${article.slug}`)}
                                            className="w-full sm:w-auto group/btn inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-secondary hover:bg-[#009cd7] active:scale-[0.98] text-white text-xs sm:text-sm font-black shadow-md shadow-secondary/25 hover:shadow-lg hover:shadow-secondary/35 transition-all duration-200"
                                        >
                                            <span>{article.cardCta || 'למעבר למדריך המלא'}</span>
                                            <ArrowLeft size={15} className="transition-transform duration-200 group-hover/btn:-translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom info banner about ongoing updates */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-6 text-center">
                    <Sparkles className="w-6 h-6 text-amber-500 mx-auto mb-2" />
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
