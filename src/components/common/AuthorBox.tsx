import React from 'react';
import { Calendar, Clock, UserCheck } from 'lucide-react';

interface AuthorBoxProps {
    name: string;
    role: string;
    organization?: string;
    datePublished?: string;
    dateModified?: string;
    readTime?: string;
    className?: string;
}

export const AuthorBox: React.FC<AuthorBoxProps> = ({
    name,
    role,
    organization = 'AltruBiz',
    datePublished,
    dateModified,
    readTime,
    className = ''
}) => {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`} dir="rtl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    <UserCheck size={18} />
                </div>
                <div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base">
                        {name} <span className="text-xs font-normal text-gray-500">({organization})</span>
                    </div>
                    <div className="text-xs text-slate-500">{role}</div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                {readTime && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <Clock size={12} className="text-gray-400" />
                        <span>{readTime}</span>
                    </span>
                )}
                {datePublished && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full">
                        <Calendar size={12} className="text-gray-400" />
                        <span>פורסם: {new Date(datePublished).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </span>
                )}
                {dateModified && dateModified !== datePublished && (
                    <span className="text-gray-400 text-[11px]">
                        (עודכן: {new Date(dateModified).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })})
                    </span>
                )}
            </div>
        </div>
    );
};
