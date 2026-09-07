import React, { useState } from 'react';
import { 
    BookOpen, 
    Clock, 
    ArrowLeft, 
    Sparkles, 
    Tag, 
    FileText 
} from 'lucide-react';
import { ARTICLES, Article } from '../../data/articles';
import { Button } from '../ui/Button';

import { Breadcrumbs } from '../common/Breadcrumbs';

interface ArticlesIndexProps {
    onNavigate: (path: string) => void;
}

export const ArticlesIndex: React.FC<ArticlesIndexProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע ומאמרים', path: '/articles' }
    ];

    const categories = ['all', ...Array.from(new Set(ARTICLES.map(a => a.category)))];

    const filteredArticles = ARTICLES.filter(article => {
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

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-4 border border-blue-100">
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
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
                    />

                    {categories.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                        selectedCategory === cat
                                            ? 'bg-primary text-white shadow-sm'
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

            {/* Articles Grid / List */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-700">לא נמצאו מאמרים התואמים לחיפוש</h3>
                        <p className="text-sm text-gray-500 mt-1">אפשר לנסות מילת חיפוש אחרת או לאפס את הסינון.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            className="mt-4 text-xs font-bold text-primary hover:underline"
                        >
                            איפוס חיפוש
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredArticles.map((article: Article) => (
                            <div 
                                key={article.slug}
                                className="group relative bg-white border border-gray-200 hover:border-primary/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-start justify-between"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-primary border border-blue-100">
                                            {article.category}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Clock size={12} className="text-gray-400" />
                                            {article.readTime}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            • {new Date(article.datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-3">
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
                                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                        {article.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                                                <Tag size={10} className="text-gray-400" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="font-semibold text-gray-800">{article.author.name}</span>
                                        <span>•</span>
                                        <span>{article.author.role}</span>
                                    </div>
                                </div>

                                {/* Actions on Card */}
                                <div className="flex items-center w-full md:w-auto flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                    <button
                                        onClick={() => onNavigate(`/articles/${article.slug}`)}
                                        className="w-full md:w-auto"
                                    >
                                        <Button variant="primary" size="sm" className="w-full md:w-auto flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-5">
                                            <span>לקריאת המאמר</span>
                                            <ArrowLeft size={14} />
                                        </Button>
                                    </button>
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
