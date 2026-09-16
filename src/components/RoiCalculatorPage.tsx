import React, { useState } from 'react';
import { 
    Calculator, 
    TrendingUp, 
    Clock, 
    AlertTriangle, 
    ArrowLeft, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    ShieldCheck, 
    Sparkles, 
    MessageCircle, 
    Calendar,
    PhoneCall,
    FileText,
    Layers
} from 'lucide-react';
import { Breadcrumbs } from './common/Breadcrumbs';
import { AnswerBox } from './common/AnswerBox';
import { RoiCalculatorTool } from './calculator/RoiCalculatorTool';
import { SocialShareBar } from './articles/SocialShareBar';
import { ROI_CALCULATOR_FAQS } from '../lib/roiCalculator';
import { ModalPresentationOptions } from '../types/attribution';
import { buildAttributedWhatsAppUrl } from '../lib/attribution';

interface RoiCalculatorPageProps {
    onNavigate: (path: string) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
}

export const RoiCalculatorPage: React.FC<RoiCalculatorPageProps> = ({ 
    onNavigate, 
    onOpenBookingModal 
}) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מחשבון ROI ללידים', path: '/roi-calculator' },
    ];

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(prev => prev === index ? null : index);
    };

    const whatsappBottomUrl = buildAttributedWhatsAppUrl(
        'שלום צוות AltruBiz, עיינתי במחשבון ה-ROI באתר ואשמח להתייעץ איך לבנות תוכנית פעולה מעשית לעצירת בריחת לידים אצלנו בעסק.',
        {
            sourcePage: '/roi-calculator',
            sourceSection: 'bottom-milestone-cta',
            sourceHub: 'lost-leads',
            sourceTopic: 'lost-leads',
            intent: 'assessment',
            ctaType: 'whatsapp',
            sourceLabel: 'roi_calculator_bottom_whatsapp',
        }
    );

    const handleBottomBooking = () => {
        onOpenBookingModal?.({
            title: 'בואו נמפה את תהליך הלידים שלכם',
            subtitle: 'בשיחת מיפוי ממוקדת של 30 דקות, נסקור את תהליך כניסת הפניות, נזהה איפה כסף נופל בין הכיסאות, ונבנה תוכנית עבודה לעצירת הנזילה.',
            badge: 'מיפוי תהליך עסקי',
            whatsappPrefill: 'שלום צוות AltruBiz, אשמח לתאם פגישת מיפוי לעצירת בריחת לידים ושיפור תהליך המכירה בעסק.',
            attribution: {
                sourcePage: '/roi-calculator',
                sourceSection: 'bottom-milestone-cta',
                sourceHub: 'lost-leads',
                sourceTopic: 'lost-leads',
                intent: 'assessment',
                ctaType: 'meeting',
                sourceLabel: 'תיאום פגישת מיפוי מתחתית מחשבון ROI',
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            {/* Breadcrumbs */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            {/* Hero Header */}
            <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-bold mb-4 border border-blue-100 shadow-sm">
                    <Calculator size={16} className="text-accent" />
                    <span>כלי אבחון וחישוב ROI מבית AltruBiz</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    כמה כסף כבר נמצא אצלכם בעסק – ונופל בין הכיסאות?
                </h1>

                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed mb-8">
                    מחשבון אבחון מהיר: הזנת כמות הלידים, שווי העסקה ושיעור הסגירה הקיים חושפת כמה פוטנציאל מכירה כבר נמצא כיום בתוך העסק – עוד לפני שמשקיעים שקל אחד נוסף בקמפיינים ובהבאת לידים חדשים.
                </p>

                {/* Below H1: Streamlined Meta, Author & Share Row (Identical to Articles) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-b border-slate-200 py-3 bg-white/70 backdrop-blur-sm rounded-2xl px-4 sm:px-6 shadow-xs max-w-4xl mx-auto mb-8 text-right">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                            AB
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">צוות AltruBiz</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                                <span>כלי אבחון וחישוב</span>
                                <span>•</span>
                                <span>אבחון פוטנציאל עסקי</span>
                            </div>
                        </div>
                    </div>

                    <SocialShareBar
                        title="מחשבון ROI ללידים: כמה כסף הולך לאיבוד כל חודש?"
                        description="מחשבון אבחון מהיר לחישוב פוטנציאל המכירה בסיכון, עלות הזמן המבוזבז ושווי שיפור הסגירה בעסק."
                        keyTakeaway="לפני שמוסיפים תקציב שיווק, עוצרים את בריחת הלידים: קיצור זמן המענה ומעקב שיטתי מגדילים את ההכנסות מהפניות שכבר קיימות."
                        heroSummary="מחשבון ROI לחישוב מדויק של בריחת לידים, חיסכון בזמן עבודה ידנית ופוטנציאל שיפור סגירה בעסק."
                        slug="roi-calculator"
                        publicPath="/roi-calculator"
                        variant="header"
                    />
                </div>
            </header>

            {/* Interactive Tool Component */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <RoiCalculatorTool onOpenBookingModal={onOpenBookingModal} />
            </div>

            {/* Educational Depth & Methodological Clarity */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
                
                {/* 1. Formula Breakdown */}
                <section className="space-y-6">
                    <div className="text-center sm:text-right">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">מתודולוגיית החישוב</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                            איך המחשבון מחשב את המספרים האלה?
                        </h2>
                    </div>

                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                        המחשבון מציג שני סוגי מספרים בנפרד, בלי לערבב ביניהם: כמה כסף{' '}
                        <button
                            type="button"
                            onClick={() => onNavigate('/lost-leads')}
                            className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:text-blue-700"
                        >
                            הולך לאיבוד היום
                        </button>
                        {' '}מהלידים שלא נסגרים בפועל, וכמה שווה יחד שיפור ריאלי ומדוד באחוז הסגירה בשילוב עם הזמן שנחסך מדי חודש. שני המספרים נשארים מופרדים כדי שהתמונה תישאר אמינה, שמרנית ומדויקת לעסק שלכם.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                                <AlertTriangle size={18} />
                                <span>1. כסף בסיכון (Revenue at Risk)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                מכפלת הלידים שלא נסגרים בשווי העסקה הממוצע. זהו שווי ההזדמנויות שעברו בעסק בחודש האחרון אך לא הבשילו לרכישה.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                                <TrendingUp size={18} />
                                <span>2. שווי שיפור בסגירה (Uplift)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                כמה שווה תוספת של נקודות אחוז בודדות לאחוז הסגירה הנוכחי – על בסיס אותם לידים קיימים, ללא עלות פרסום נוספת.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                <Clock size={18} />
                                <span>3. חיסכון בזמן עבודה (Time Savings)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                שעות עבודה חודשיות המושקעות בהקלדות כפולות, תיאומים ידניים ומרדף אחרי פולואפ, המומרות לשווי כספי לפי עלות שעה.
                            </p>
                        </div>
                    </div>

                    <AnswerBox
                        type="definition"
                        title="מדוע המחשבון מפריד בין הכסף שהולך לאיבוד לבין הפוטנציאל המשולב?"
                        answer="כסף שהולך לאיבוד כיום וההזדמנות המשולבת (שיפור בסגירה + חיסכון בזמן) הם שני תרחישים שונים, לא סכום אחד. המחשבון מציג אותם בנפרד כדי שהמספרים יישארו שמרניים, ריאליים וניתנים להצדקה – ולא ינפחו את התוצאה לצורכי שיווק."
                    />
                </section>

                {/* 2. Four Real-World Leak Holes */}
                <section className="space-y-6">
                    <div className="text-center sm:text-right">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">אבחון צווארי בקבוק</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                            איפה הכסף הזה בורח במציאות? 4 חורי הבריחה הנפוצים
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            ברוב העסקים, אובדן ההכנסות אינו נובע מחוסר רצון של לקוחות, אלא מחיכוך מבני בתהליך:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-base">
                                    <Clock size={20} className="text-accent" />
                                    <span>1. זמני מענה איטיים (חוק 5 הדקות)</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    ליד שנכנס מחכה שעות למענה. מחקרים מראים כי מענה בתוך 5 דקות מגדיל את סיכויי הסגירה בעשרות מונים לעומת מענה לאחר 30 דקות.
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('/lead-first-5-minutes')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                >
                                    <span>איך לענות לליד ב-5 דקות ראשונות?</span>
                                    <ArrowLeft size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-base">
                                    <PhoneCall size={20} className="text-accent" />
                                    <span>2. שיחות שלא נענו שמתאדות</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    שיחה נכנסת כשהצוות בפגישה או בנסיעה. הלקוח ממשיך הלאה למתחרה הבא בגוגל, בלי שהעסק יודע בכלל מי התקשר.
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('/missed-call-text-back')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                >
                                    <span>איך מענה אוטומטי בוואטסאפ מציל שיחות?</span>
                                    <ArrowLeft size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-base">
                                    <FileText size={20} className="text-accent" />
                                    <span>3. הצעות מחיר ששוקעות בשקט</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    הצעה נשלחה במייל או בוואטסאפ, ואז מתחיל השקט. בהיעדר משימת תזכורת אוטומטית ב-CRM, ההצעה נשכחת והעסקה דועכת.
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('/lost-leads')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                >
                                    <span>מה עושים בשלב שאחרי הצעת המחיר?</span>
                                    <ArrowLeft size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-primary font-bold text-base">
                                    <Layers size={20} className="text-accent" />
                                    <span>4. שעות עבודה על תיאומים ידניים</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    פינג-פונג של "מתי נוח לך?", העתקות נתונים בין אקסלים ותזכורות ידניות שואבים שעות ניהוליות יקרות מאיש המכירות.
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => onNavigate('/repetitive-manual-work')}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                                >
                                    <span>איך לשחרר את הצוות מעבודה ידנית?</span>
                                    <ArrowLeft size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Action Steps Hierarchy */}
                <section className="p-8 rounded-3xl bg-blue-50/60 border border-blue-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary text-white">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                סולם הפעולות לעצירת הנזילה: מאיפה מתחילים?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                                לא צריך להפוך את כל העסק בבת אחת. מתקדמים בשלושה צעדים מדורגים:
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                    שלב 1: מפסיקים לשפוך מים לדלי מנוקב
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                    לפני שמעלים תקציבי פרסום, סותמים את החורים המיידיים: מוודאים שכל שיחה שלא נענתה מקבלת מענה וואטסאפ מיידי, ושליד נכנס מקבל תגובה ראשונית תוך 5 דקות.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                    שלב 2: מעבירים את הצעות המחיר למנגנון פולואפ שיטתי
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                    הגדרת כלל עבודה קבוע ב-CRM: אין הצעת מחיר פתוחה ללא משימת תזכורת פעילה ביומן. שלב זה לבדו מציל בממוצע 15% עד 25% מההצעות שננטשו בעבר.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                    שלב 3: מחברים את כל הערוצים ל-CRM עם פייפליין חזותי
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                    מרכזים את הוואטסאפ, המיילים והשיחות בתיבת שיחה אחת אחודה (Unified Inbox), כדי ששום לקוח לא ילך לאיבוד במעבר בין אנשי צוות.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Social Share Card (Identical to Articles) */}
                <div className="pt-2">
                    <SocialShareBar
                        title="מחשבון ROI ללידים: כמה כסף הולך לאיבוד כל חודש?"
                        description="מחשבון אבחון מהיר לחישוב פוטנציאל המכירה בסיכון, עלות הזמן המבוזבז ושווי שיפור הסגירה בעסק."
                        keyTakeaway="לפני שמוסיפים תקציב שיווק, עוצרים את בריחת הלידים: קיצור זמן המענה ומעקב שיטתי מגדילים את ההכנסות מהפניות שכבר קיימות."
                        heroSummary="מחשבון ROI לחישוב מדויק של בריחת לידים, חיסכון בזמן עבודה ידנית ופוטנציאל שיפור סגירה בעסק."
                        slug="roi-calculator"
                        publicPath="/roi-calculator"
                        variant="featured"
                    />
                </div>

                {/* 4. Frequently Asked Questions (Accordion) */}
                <section className="space-y-6">
                    <div className="text-center sm:text-right">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">שאלות ותשובות</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                            שאלות נפוצות על חישוב ה-ROI ועצירת בריחת לידים
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {ROI_CALCULATOR_FAQS.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div 
                                    key={index}
                                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-5 text-right font-bold text-slate-900 hover:bg-slate-50 transition-colors gap-4"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="text-base sm:text-lg">{faq.question}</span>
                                        <div className="p-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </div>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 5. Bottom Milestone Conversion Box */}
                <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-primary-dark to-slate-900 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-bold border border-white/20">
                        <ShieldCheck size={16} className="text-accent" />
                        <span>שיחת מיפוי ללא עלות וללא התחייבות</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                        רוצים להפוך את המספרים האלה למציאות בעסק שלכם?
                    </h2>

                    <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
                        בפגישת מיפוי ממוקדת של 30 דקות, ננתח יחד את תהליך הלידים הקיים, נזהה איפה מתרחש אובדן ההזדמנויות הגדול ביותר, ונציג מתווה מדויק לעצירת הנזילה באמצעות מערכת AltruBiz CRM.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={handleBottomBooking}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-slate-950 bg-accent hover:bg-accent/90 shadow-xl transition-all"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>לתיאום פגישת מיפוי ביומן ←</span>
                        </button>
                        <a
                            href={whatsappBottomUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <MessageCircle className="w-5 h-5 text-[#25D366]" />
                            <span>התייעצות קצרה בוואטסאפ</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};
