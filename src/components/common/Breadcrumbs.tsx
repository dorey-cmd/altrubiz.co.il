import React from 'react';
import { RouteBreadcrumb } from '../../lib/routes';

interface BreadcrumbsProps {
    items: RouteBreadcrumb[];
    onNavigate: (path: string) => void;
    className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, className = '' }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="פירורי לחם" className={`py-2 text-sm text-gray-500 font-sans ${className}`} dir="rtl">
            <ol className="flex items-center flex-wrap gap-2">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={item.path} className="flex items-center gap-2">
                            {idx > 0 && <span className="text-gray-300 select-none">/</span>}
                            {isLast ? (
                                <span className="text-gray-700 font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md" aria-current="page">
                                    {item.name}
                                </span>
                            ) : (
                                <button
                                    onClick={() => onNavigate(item.path)}
                                    className="hover:text-primary transition-colors font-medium focus:outline-none focus:underline"
                                >
                                    {item.name}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
