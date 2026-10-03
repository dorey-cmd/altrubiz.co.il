import React from 'react';
import { BookOpen, Sparkles, ExternalLink, ChevronLeft } from 'lucide-react';
import type { ResolvedCtaPlacement } from '../../data/ctaRegistry';

interface ManagedCtaBlockProps {
    placement: ResolvedCtaPlacement;
    className?: string;
}

export const ManagedCtaBlock: React.FC<ManagedCtaBlockProps> = ({ placement, className = '' }) => {
    if (!placement.enabled) {
        return null;
    }

    const {
        placementType,
        destination,
        badge,
        title,
        description,
        buttonText,
        secondaryButtonText
    } = placement;

    // 1. Strip Variant
    if (placementType === 'strip') {
        return (
            <aside 
                aria-label={title}
                className={`my-8 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-blue-50/80 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs ${className}`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100/90 text-emerald-800 rounded-xl flex-shrink-0">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            {badge && (
                                <span className="inline-block text-[11px] font-black text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md mb-1">
                                    {badge}
                                </span>
                            )}
                            <h4 className="text-slate-900 font-bold text-sm sm:text-base leading-snug">
                                {title}
                            </h4>
                            {description && (
                                <p className="text-slate-600 text-xs sm:text-sm font-normal mt-0.5">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    <a
                        href={destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm flex-shrink-0"
                    >
                        <span>{buttonText}</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
            </aside>
        );
    }

    // 2. Text Link Variant
    if (placementType === 'text-link') {
        return (
            <aside
                aria-label={title}
                className={`my-8 bg-slate-50 hover:bg-emerald-50/60 border-r-4 border-emerald-500 rounded-l-2xl p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${className}`}
            >
                <div className="text-slate-800 text-sm sm:text-base">
                    <span className="font-bold text-slate-900">{title} </span>
                    {description && <span className="text-slate-600 font-normal">{description}</span>}
                </div>
                <a
                    href={destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-black text-sm flex-shrink-0 transition-colors group"
                >
                    <span>{buttonText}</span>
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </a>
            </aside>
        );
    }

    // 3. Banner Variant
    if (placementType === 'banner') {
        return (
            <aside
                aria-label={title}
                className={`my-12 relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30 ${className}`}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        {badge && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/40 text-xs font-black mb-3">
                                <Sparkles size={14} className="text-teal-400" />
                                <span>{badge}</span>
                            </div>
                        )}
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-2">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                        <a
                            href={destination}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-900/40 transition-all text-sm sm:text-base"
                        >
                            <span>{buttonText}</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </aside>
        );
    }

    // 4. Rich Box Variant (Default)
    return (
        <aside
            aria-label={title}
            className={`my-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-teal-500/30 ${className}`}
        >
            <div className="absolute -top-12 -right-12 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                    {badge && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/40 text-xs font-black">
                            <BookOpen size={14} className="text-teal-400" />
                            <span>{badge}</span>
                        </div>
                    )}
                    <span className="text-xs text-slate-400 font-medium">כלי עבודה יישומי</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug mb-3">
                    {title}
                </h3>

                {description && (
                    <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
                        {description}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                        href={destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-500/25 transition-all text-sm sm:text-base hover:scale-[1.02]"
                    >
                        <span>{buttonText}</span>
                        <ExternalLink size={17} className="text-slate-950" />
                    </a>

                    {secondaryButtonText && (
                        <a
                            href={destination}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <span>{secondaryButtonText}</span>
                            <ChevronLeft size={15} />
                        </a>
                    )}
                </div>
            </div>
        </aside>
    );
};
