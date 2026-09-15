import React from 'react';
import { Calculator } from 'lucide-react';
import { Breadcrumbs } from './common/Breadcrumbs';
import { AnswerBox } from './common/AnswerBox';
import { RoiCalculatorTool } from './calculator/RoiCalculatorTool';
import { ModalPresentationOptions } from '../types/attribution';

interface RoiCalculatorPageProps {
    onNavigate: (path: string) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
}

export const RoiCalculatorPage: React.FC<RoiCalculatorPageProps> = ({ onNavigate, onOpenBookingModal }) => {
    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מחשבון ROI ללידים', path: '/roi-calculator' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-4 border border-blue-100">
                    <Calculator size={16} />
                    <span>מחשבון אינטראקטיבי</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    כמה כסף כבר נמצא אצלכם - ונופל בין הכיסאות?
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
                    מחשבון קצר לבעלי עסקים: הזינו כמה לידים נכנסים לעסק שלכם היום ואיך אתם סוגרים אותם, וגלו כמה פוטנציאל מכירה כבר קיים אצלכם - לפני שמדברים בכלל על הבאת לידים נוספים.
                </p>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <RoiCalculatorTool onOpenBookingModal={onOpenBookingModal} />
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
                    איך המחשבון מחשב את המספרים האלה
                </h2>
                <p className="text-slate-700 text-base leading-relaxed">
                    המחשבון מציג שני סוגי מספרים בנפרד, בלי לערבב ביניהם: כמה כסף{' '}
                    <button
                        type="button"
                        onClick={() => onNavigate('/lost-leads')}
                        className="text-primary font-semibold hover:underline"
                    >
                        הולך לאיבוד היום
                    </button>
                    {' '}מהלידים שלא נסגרים, וכמה שווה יחד שיפור ריאלי באחוז הסגירה בשילוב עם הזמן שאפשר לחסוך בחודש. שני המספרים האלה לא מתערבבים - הפוטנציאל שהולך לאיבוד נשאר נפרד, כדי שהתמונה תישאר אמינה ומדויקת לעסק שלכם.
                </p>

                <AnswerBox
                    type="definition"
                    title="למה המחשבון מפריד בין הכסף שהולך לאיבוד לבין הפוטנציאל המשולב?"
                    answer="כסף שהולך לאיבוד היום וההזדמנות המשולבת (שיפור בסגירה + חיסכון בזמן) הם שני תרחישים שונים, לא סכום אחד. המחשבון מציג אותם בנפרד כדי שהמספרים יישארו שמרניים, ריאליים וניתנים להצדקה - ולא ינפחו את התוצאה כדי להרשים."
                />
            </div>
        </div>
    );
};
