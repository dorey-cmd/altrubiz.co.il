import React, { useState, useEffect, useMemo } from 'react';
import { 
    Check, 
    ChevronDown, 
    Share2, 
    Copy, 
    MessageCircle, 
    Calculator, 
    Calendar, 
    ArrowLeft, 
    RotateCcw, 
    Sparkles, 
    AlertTriangle,
    ShieldCheck,
    CheckCircle2,
    Zap
} from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { 
    loadDiagnosticState, 
    clearDiagnosticState, 
    scoreAnswers, 
    examplesFor, 
    PAINS, 
    StoredDiagnosticState 
} from '../../data/diagnosticData';
import { ModalPresentationOptions } from '../../types/attribution';
import { buildAttributedWhatsAppUrl } from '../../lib/attribution';

interface DiagnosticResultPageProps {
    onNavigate: (path: string) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
    onOpenDiagnosticModal?: () => void;
}

export const DiagnosticResultPage: React.FC<DiagnosticResultPageProps> = ({
    onNavigate,
    onOpenBookingModal,
    onOpenDiagnosticModal
}) => {
    const [state, setState] = useState<StoredDiagnosticState | null>(null);
    const [openPains, setOpenPains] = useState<Record<number, boolean>>({ 1: true });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const saved = loadDiagnosticState();
        if (saved && Object.keys(saved.answers).length > 0) {
            setState(saved);
        }
    }, []);

    const score = useMemo(() => {
        if (!state) return null;
        return scoreAnswers(state.answers);
    }, [state]);

    const activePainDefs = useMemo(() => {
        if (!score) return [];
        return score.activePains
            .map(id => PAINS.find(p => p.id === id))
            .filter((p): p is typeof PAINS[number] => p !== undefined);
    }, [score]);

    const togglePain = (id: number) => {
        setOpenPains(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText('https://altrubiz.co.il/hidden-business-growth-barriers');
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleRetake = () => {
        clearDiagnosticState();
        setState(null);
        if (onOpenDiagnosticModal) {
            onOpenDiagnosticModal();
        } else {
            onNavigate('/hidden-business-growth-barriers');
        }
    };

    const breadcrumbs = [
        { name: 'דף הבית', path: '/' },
        { name: 'אבחון חסמי צמיחה', path: '/hidden-business-growth-barriers' },
        { name: 'דוח תוצאות מותאם', path: '/diagnostic-result' },
    ];

    const shareWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        'עשיתי אבחון קצר לחסמי צמיחה בעסק של AltruBiz ומאוד עזר לי לזהות איפה דברים נופלים: https://altrubiz.co.il/hidden-business-growth-barriers'
    )}`;

    const whatsappDirectUrl = buildAttributedWhatsAppUrl(
        'שלום צוות AltruBiz, עברתי על תוצאות שאלון האבחון באתר ואשמח להתייעץ איתכם על התוצאות שעלו.',
        {
            sourcePage: '/diagnostic-result',
            sourceSection: 'further_card_whatsapp',
            sourceHub: 'hidden-business-growth-barriers',
            sourceTopic: 'diagnostic-result',
            intent: 'consultation',
            ctaType: 'whatsapp',
            sourceLabel: 'diagnostic_result_whatsapp',
        }
    );

    return (
        <div className="min-h-screen bg-slate-50 py-6 sm:py-10" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
                </div>

                {!state || activePainDefs.length === 0 ? (
                    /* Empty State: Prompt to start diagnostic */
                    <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xl space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                            <Sparkles size={32} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                                טרם בוצע אבחון עסקי
                            </h1>
                            <p className="text-slate-600 text-base max-w-md mx-auto">
                                דוח התוצאות נוצר ומותאם באופן אישי על בסיס 18 שאלות קצרות של כן או לא.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (onOpenDiagnosticModal) onOpenDiagnosticModal();
                                else onNavigate('/hidden-business-growth-barriers');
                            }}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
                        >
                            <span>להתחלת שאלון האבחון (כ-2 דקות)</span>
                            <ArrowLeft size={18} />
                        </button>
                    </div>
                ) : (
                    /* Two-Column Article Template Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 xl:gap-12 items-start">
                        {/* RIGHT COLUMN (In RTL): The Action Sidebar (CTAs, Share, ROI Calculator) */}
                        <aside className="order-2 lg:order-1 space-y-6 lg:sticky lg:top-24">
                            {/* Action Block */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                                        <Sparkles size={12} className="text-amber-500" />
                                        <span>מה עושים עכשיו?</span>
                                    </div>
                                    <h2 className="text-lg font-black text-slate-900">
                                        שלוש דרכים להתקדם מפה
                                    </h2>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        לבחירת הצעד שהכי מתאים לקצב ולמוכנות של העסק שלכם:
                                    </p>
                                </div>

                                {/* The 3 Outcome CTAs */}
                                <div className="space-y-3">
                                    {/* CTA 1: Guided Meeting */}
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-400/30">
                                                המסלול המומלץ
                                            </span>
                                            <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                                                <Calendar size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-white">
                                                פגישת מיפוי ממוקדת
                                            </h3>
                                            <p className="text-xs text-slate-300 mt-1 leading-snug">
                                                מיפוי משותף של מה שעלה בשאלון ובניית תוכנית עבודה מעשית לשחרור צווארי הבקבוק.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenBookingModal) {
                                                    onOpenBookingModal({
                                                        title: 'תיאום שיחת מיפוי בעקבות האבחון',
                                                        subtitle: 'מיפוי צווארי הבקבוק שעלו בשאלון ובניית תוכנית מעשית לתשתית יציבה.',
                                                        attribution: {
                                                            sourcePage: '/diagnostic-result',
                                                            sourceSection: 'sidebar_guided_cta',
                                                            intent: 'booking',
                                                            ctaType: 'meeting',
                                                            sourceLabel: 'diagnostic_result_booking'
                                                        }
                                                    });
                                                } else {
                                                    window.open('https://link.altrubiz.co.il/widget/bookings/caldorey', '_blank');
                                                }
                                            }}
                                            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            <span>קביעת מועד ביומן</span>
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>

                                    {/* CTA 2: Self Implementation & Packages */}
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c2240] via-[#122e58] to-[#0c2240] text-white shadow-md space-y-2.5 border border-blue-700/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-400/40">
                                                הטמעה וכלים
                                            </span>
                                            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                                                <Zap size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-white">
                                                אנחנו נדע ליישם את זה לבד
                                            </h3>
                                            <p className="text-xs text-slate-300 mt-1 leading-snug">
                                                רק תנו לנו את הכלים הטכנולוגיים לזה.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate('/#pricing')}
                                            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                        >
                                            <span>צפייה בחבילות בעמוד הבית</span>
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>

                                    {/* CTA 3: Why businesses stay stuck */}
                                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 space-y-2 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                                מצב קיים
                                            </span>
                                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                                                <AlertTriangle size={14} />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">
                                                טוב לי לאבד כסף ולעבוד יותר
                                            </h4>
                                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                                הסבר על הדפוס שגורם לעסקים להמשיך להפסיד זמן והכנסות.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate('/why-businesses-stay-stuck-in-bad-processes')}
                                            className="w-full py-2 px-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>לקריאת המאמר על תהליכים תקועים</span>
                                            <ArrowLeft size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Share Card */}
                            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                        <Share2 size={16} className="text-primary" />
                                        <span>שיתוף דוח האבחון</span>
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        רוצים לשתף עם שותף, מנהל או חבר לעסק?
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <a
                                        href={shareWhatsAppUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                    >
                                        <MessageCircle size={14} />
                                        <span>שליחה בוואטסאפ</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                        <span>{copied ? 'הועתק!' : 'העתקת קישור'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* "Interested in more?" Card + ROI Calculator Link */}
                            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-md space-y-3">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                                        מעניין עוד?
                                    </span>
                                    <h3 className="font-black text-sm text-slate-900">
                                        כמה כסף נופל אצלכם בין הכיסאות?
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        בדיקה כמותית במחשבון ה-ROI חושפת כמה הכנסה מצטברת נאבדת מדי חודש בגלל חוסר במעקב ובאוטומציה.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onNavigate('/roi-calculator')}
                                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                >
                                    <Calculator size={16} />
                                    <span>למעבר למחשבון ROI ללידים</span>
                                </button>
                                <div className="text-center pt-1">
                                    <a
                                        href={whatsappDirectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                                    >
                                        <MessageCircle size={13} className="text-emerald-500" />
                                        <span>דברו איתנו בוואטסאפ לכל שאלה</span>
                                    </a>
                                </div>
                            </div>
                        </aside>

                        {/* LEFT COLUMN (In RTL): The Diagnostic Results Report */}
                        <main className="order-1 lg:order-2 space-y-8">
                            {/* Hero Header Card */}
                            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#082244] via-[#14346f] to-[#243e90] text-white shadow-xl">
                                <div className="relative z-10 space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-sky-200">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>דוח תוצאות מותאם אישית</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                                        זה מה שקורה כרגע בעסק
                                    </h1>
                                    <p className="text-slate-200 text-sm sm:text-base max-w-2xl leading-relaxed">
                                        מהתשובות עולה שיש בעסק כמה מקומות שבהם משולם מחיר אמיתי. לא בתיאוריה — אלא בזמן, בכסף, בעומס ובפספוסים שחוזרים שוב ושוב והופכים להפסד משמעותי.
                                    </p>

                                    {/* Active Areas Pills */}
                                    <div className="pt-2 flex flex-wrap gap-2">
                                        {activePainDefs.map((pain) => (
                                            <span
                                                key={pain.id}
                                                className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white"
                                            >
                                                {pain.theme}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Section: The Identified Pains Accordion */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                                        אלו הדברים שבלטו מתוך השאלון
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        לחיצה על כל אחד מהם פותחת את ההסבר המלא והדוגמאות מתוך התשובות שעניתם:
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {activePainDefs.map((pain, index) => {
                                        const isOpen = !!openPains[pain.id];
                                        const examples = score ? examplesFor(score, pain.id) : [];

                                        return (
                                            <div
                                                key={pain.id}
                                                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                                                    isOpen
                                                        ? 'border-sky-300 shadow-md ring-1 ring-sky-200/50'
                                                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => togglePain(pain.id)}
                                                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                                                >
                                                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            {index + 1}
                                                        </div>
                                                        <div className="space-y-0.5 min-w-0">
                                                            <span className="text-xs font-bold text-primary block">
                                                                {pain.theme}
                                                            </span>
                                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                                                {pain.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform ${
                                                            isOpen ? 'rotate-180 bg-slate-200 text-slate-900' : ''
                                                        }`}
                                                    >
                                                        <ChevronDown size={18} />
                                                    </div>
                                                </button>

                                                {isOpen && (
                                                    <div className="px-4 sm:px-6 pb-5 pt-1 space-y-4 border-t border-slate-100 bg-slate-50/40">
                                                        <p className="text-sm font-semibold text-slate-800 pt-3">
                                                            {pain.lead}
                                                        </p>

                                                        <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                            {pain.body.map((para, i) => (
                                                                <p key={i}>{para}</p>
                                                            ))}
                                                        </div>

                                                        {examples.length > 0 && (
                                                            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
                                                                <h4 className="text-xs font-bold text-sky-900">
                                                                    איפה זה פוגש את העסק לפי התשובות שניתנו:
                                                                </h4>
                                                                <ul className="space-y-1.5">
                                                                    {examples.map((ex, i) => (
                                                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                                                            <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                                                                            <span>{ex}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* The Whole Picture vs. Future Operational Flow (Dual Comparison) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {/* Card 1: Today's Reality */}
                                <div className="bg-gradient-to-br from-amber-50/70 to-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 text-amber-800">
                                        <AlertTriangle size={18} />
                                        <h3 className="font-bold text-base">
                                            עכשיו כדאי להסתכל על התמונה כולה
                                        </h3>
                                    </div>
                                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                            <span>עוד ליד שלא טופל בזמן.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                            <span>עוד מעקב שהיה צריך לזכור בראש.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                            <span>עוד משימה שמחכה שמישהו יתפנה אליה.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                            <span>כל אחד נראה קטן — ביחד הם יוצרים אובדן הכנסה ועומס בלתי פוסק.</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Card 2: When Infrastructure Works */}
                                <div className="bg-gradient-to-br from-sky-50/70 to-white rounded-3xl p-6 border border-sky-200/80 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 text-sky-800">
                                        <ShieldCheck size={18} />
                                        <h3 className="font-bold text-base">
                                            איך העסק עובד כשיש תשתית
                                        </h3>
                                    </div>
                                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                            <span>לידים מקבלים מענה מיידי בלי קשר לעומס.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                            <span>מעקבים קורים בעקביות בלי צורך לזכור בראש.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                            <span>המידע נמצא במקום אחד ברור ונגיש לצוות.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                            <span>העסק ממשיך להתקדם גם כשמישהו לא נמצא.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* 3 Outcome CTAs - Bottom Section */}
                            <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
                                <div className="text-center max-w-xl mx-auto space-y-2">
                                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/60">
                                        מה עושים עכשיו?
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-white">
                                        שלוש דרכים להתקדם מפה
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-300">
                                        לבחירת הצעד שהכי מתאים לקצב ולמוכנות של העסק:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Card 1: Guided Meeting */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-850 via-slate-800 to-slate-900 text-white shadow-md space-y-3 border border-slate-700 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                                                    המסלול המומלץ
                                                </span>
                                                <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                                                    <Calendar size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-white">
                                                    פגישת מיפוי ממוקדת
                                                </h3>
                                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                                    מיפוי משותף של מה שעלה בשאלון ובניית תוכנית עבודה מעשית לשחרור צווארי הבקבוק.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenBookingModal) {
                                                    onOpenBookingModal({
                                                        title: 'תיאום שיחת מיפוי בעקבות האבחון',
                                                        subtitle: 'מיפוי צווארי הבקבוק שעלו בשאלון ובניית תוכנית מעשית לתשתית יציבה.',
                                                        attribution: {
                                                            sourcePage: '/diagnostic-result',
                                                            sourceSection: 'bottom_guided_cta',
                                                            intent: 'booking',
                                                            ctaType: 'meeting',
                                                            sourceLabel: 'diagnostic_result_bottom_booking'
                                                        }
                                                    });
                                                } else {
                                                    window.open('https://link.altrubiz.co.il/widget/bookings/caldorey', '_blank');
                                                }
                                            }}
                                            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer mt-2"
                                        >
                                            <span>קביעת מועד ביומן</span>
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>

                                    {/* Card 2: Self Implementation & Packages */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c2240] via-[#122e58] to-[#0c2240] text-white shadow-md space-y-3 border border-blue-700/50 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                                                    הטמעה וכלים
                                                </span>
                                                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                                                    <Zap size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-white">
                                                    אנחנו נדע ליישם את זה לבד
                                                </h3>
                                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                                    רק תנו לנו את הכלים הטכנולוגיים לזה.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate('/#pricing')}
                                            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer mt-2"
                                        >
                                            <span>צפייה בחבילות בעמוד הבית</span>
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>

                                    {/* Card 3: Why businesses stay stuck */}
                                    <div className="p-5 rounded-2xl bg-slate-800 text-white shadow-md space-y-3 border border-slate-700 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-300 bg-slate-700 px-2.5 py-0.5 rounded-full">
                                                    מצב קיים
                                                </span>
                                                <div className="w-8 h-8 rounded-xl bg-slate-700 text-amber-400 flex items-center justify-center font-bold">
                                                    <AlertTriangle size={16} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base text-white">
                                                    טוב לי לאבד כסף ולעבוד יותר
                                                </h3>
                                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                                    הסבר על הדפוס שגורם לעסקים להמשיך להפסיד זמן והכנסות.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate('/why-businesses-stay-stuck-in-bad-processes')}
                                            className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-200 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                                        >
                                            <span>לקריאת המאמר על תהליכים תקועים</span>
                                            <ArrowLeft size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Retake Button Bar */}
                            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    רוצים לענות שוב או לעדכן תשובות?
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRetake}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    <span>התחלת אבחון מחדש</span>
                                </button>
                            </div>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
};
