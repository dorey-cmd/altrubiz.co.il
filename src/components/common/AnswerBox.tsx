import React from 'react';
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface AnswerBoxProps {
    title: string;
    answer: string;
    type?: 'highlight' | 'definition' | 'takeaway';
    className?: string;
}

export const AnswerBox: React.FC<AnswerBoxProps> = ({
    title,
    answer,
    type = 'takeaway',
    className = ''
}) => {
    const icons = {
        highlight: <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />,
        definition: <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />,
        takeaway: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    };

    const borders = {
        highlight: 'border-amber-200 bg-gradient-to-br from-amber-50/70 to-yellow-50/40 text-amber-950',
        definition: 'border-blue-200 bg-gradient-to-br from-blue-50/70 to-sky-50/40 text-slate-900',
        takeaway: 'border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 text-emerald-950'
    };

    return (
        <div className={`p-6 rounded-2xl border shadow-sm my-6 font-sans ${borders[type]} ${className}`} dir="rtl">
            <div className="flex items-start gap-3">
                {icons[type]}
                <div>
                    <h4 className="font-bold text-base sm:text-lg mb-2">
                        {title}
                    </h4>
                    <p className="text-sm sm:text-base leading-relaxed opacity-95">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};
