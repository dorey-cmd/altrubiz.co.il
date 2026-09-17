import React from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { RouteBreadcrumb } from '../../lib/routes';

interface LegalPageLayoutProps {
    eyebrow: string;
    title: string;
    lastUpdated: string;
    breadcrumbs: RouteBreadcrumb[];
    onNavigate: (path: string) => void;
    children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
    eyebrow,
    title,
    lastUpdated,
    breadcrumbs,
    onNavigate,
    children,
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
            </div>

            <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-4 border border-blue-100">
                    <span>{eyebrow}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                    {title}
                </h1>
                <p className="text-sm text-slate-500">עדכון אחרון: {lastUpdated}</p>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-[15px] leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{title}</h2>
        <div className="space-y-3">{children}</div>
    </section>
);
