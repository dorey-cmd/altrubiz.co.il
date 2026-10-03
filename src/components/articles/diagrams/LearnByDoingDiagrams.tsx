import React from 'react';
import { 
    BookOpen, 
    Zap, 
    ArrowLeft, 
    RefreshCw, 
    CheckCircle2, 
    Coins, 
    Lightbulb, 
    TrendingUp, 
    Layers, 
    Target,
    Compass
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

/**
 * Diagram 1: Two Types of Knowledge (שני סוגי ידע)
 * ידע לפני העשייה מול ידע שנוצר מתוך העשייה
 */
export const TwoTypesOfKnowledgeDiagram: React.FC = () => {
    return (
        <figure className="my-10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
                <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black mb-2">
                        <Layers size={13} />
                        <span>מיפוי אפיסטמולוגי עסקי</span>
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black text-white">
                        שני סוגי הידע בעסק: מה לומדים מראש ומה נוצר בעשייה
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1">
                        מדריך יכול לחסוך טעויות, אך רק פעולה עם לקוחות אמיתיים מייצרת ניסיון
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Side A: Pre-action knowledge */}
                    <div className="md:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/70">
                            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                                <BookOpen size={16} />
                            </div>
                            <div>
                                <h5 className="font-bold text-white text-sm sm:text-base">ידע לפני הפעולה</h5>
                                <span className="text-[11px] text-slate-400">מה שניתן לקבל מראש</span>
                            </div>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>עקרונות, מושגי יסוד ומסגרת עבודה</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>מדריכים טכניים והיכרות עם הממשק</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>כללי בטיחות ומניעת טעויות מיותרות</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <span>מחקר שוק וניסיון של מפרסמים אחרים</span>
                            </li>
                        </ul>
                    </div>

                    {/* Middle connector */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                        <div className="flex md:flex-col items-center gap-1.5 bg-indigo-600/40 border border-indigo-400/40 text-indigo-200 px-3 py-2 rounded-xl text-xs font-black shadow-xs">
                            <span className="hidden md:inline">מתחילים</span>
                            <ArrowLeft size={16} className="text-indigo-300 rotate-90 md:rotate-0" />
                            <span className="md:hidden">מתחילים</span>
                        </div>
                    </div>

                    {/* Side B: Action-generated knowledge */}
                    <div className="md:col-span-5 bg-gradient-to-br from-teal-950/70 to-emerald-950/70 border border-teal-500/40 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-teal-500/30">
                            <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg">
                                <Zap size={16} />
                            </div>
                            <div>
                                <h5 className="font-bold text-white text-sm sm:text-base">ידע שנולד מתוך הפעולה</h5>
                                <span className="text-[11px] text-teal-300">מה שרק המציאות חושפת</span>
                            </div>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>תגובת לקוחות אמיתית מול כסף אמיתי</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>נתוני המרה ואיכות הלידים בעסק שלכם</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>איזה מסר, מחיר והצעה באמת תופסים</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>ניסיון אישי שלא ניתן להוריד משום אתר</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <figcaption className="text-center text-xs text-slate-400 mt-5 pt-3 border-t border-slate-800">
                💡 שני סוגי הידע נחוצים: הראשון נותן רשת ביטחון, השני מייצר את היתרון התחרותי האמיתי.
            </figcaption>
        </figure>
    );
};

/**
 * Diagram 2: The Continuous Business Learning Loop (לולאת הלמידה בעשייה)
 * לומדים מספיק -> עושים -> מודדים -> מבינים -> משנים -> עושים שוב
 */
export const BusinessLearningLoopDiagram: React.FC = () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    const steps = [
        { num: '1', title: 'לומדים מספיק', desc: 'מסגרת יסוד להפחתת סיכון', icon: BookOpen, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
        { num: '2', title: 'עושים', desc: 'ניסוי קטן בעלות מבוקרת', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
        { num: '3', title: 'מודדים', desc: 'עוקבים אחרי נתוני אמת ב-CRM', icon: Target, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
        { num: '4', title: 'מבינים', desc: 'מפענחים איזה מסר וקהל עבדו', icon: Lightbulb, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
        { num: '5', title: 'משנים ומדייקים', desc: 'מתקנים את מה שנפל', icon: RefreshCw, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
        { num: '6', title: 'עושים שוב', desc: 'נכנסים לסיבוב הבא חכמים יותר', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
    ];

    return (
        <figure className="my-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white">
            <div className="text-center max-w-xl mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-black mb-2">
                    <RefreshCw size={13} className={prefersReducedMotion ? '' : 'animate-spin-slow'} />
                    <span>מנגנון למידה מבוקר (Learning Loop)</span>
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white">
                    איך הופכים עשייה בעסק לנכס ידע מתמשך?
                </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {steps.map((s, idx) => {
                    const IconComponent = s.icon;
                    return (
                        <div key={idx} className={`rounded-2xl border p-4 text-center flex flex-col items-center justify-between ${s.color}`}>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs mb-2">
                                {s.num}
                            </div>
                            <IconComponent size={20} className="mb-2" />
                            <div className="font-extrabold text-sm sm:text-base text-white mb-1">
                                {s.title}
                            </div>
                            <div className="text-[11px] text-slate-300 font-normal leading-tight">
                                {s.desc}
                            </div>
                        </div>
                    );
                })}
            </div>

            <figcaption className="text-center text-xs text-slate-400 mt-5 pt-3 border-t border-slate-800">
                💡 היעד הוא לא להגיע לניסוי הראשון בלי שאלות, אלא לדעת מספיק כדי שהטעות תהיה קטנה, מדידה ושימושית.
            </figcaption>
        </figure>
    );
};

/**
 * Diagram 4: What Did We Buy with the First Budget? (מה קנינו בתקציב הראשון?)
 * כרטיס המחשה: תקציב ראשון כמבחן למידה וקניית מידע בזול
 */
export const FirstBudgetInformationCard: React.FC = () => {
    return (
        <aside 
            aria-label="מה קנינו בתקציב הניסוי הראשון"
            className="my-10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
                    <Coins size={18} />
                </div>
                <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">שינוי תפיסה תקציבי</span>
                    <h4 className="text-lg sm:text-xl font-black text-white">
                        מה באמת קונים בתקציב השיווק הראשון בערוץ חדש?
                    </h4>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5">
                    <div className="text-xs text-rose-400 font-bold mb-1">מה שילמנו (עלות הניסוי)</div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                        <li>• תקציב מבוקר שאפשר להרשות לעצמנו לטעות בו</li>
                        <li>• מספר ימי פעילות של קמפיין ממוקד</li>
                        <li>• זמן הגדרה ראשוני ולמידת הממשק</li>
                    </ul>
                </div>

                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5">
                    <div className="text-xs text-emerald-400 font-bold mb-1">מה קיבלנו (נכס הידע שנרכש)</div>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                        <li>• איזה מסר מעורר עניין ואיזה גורם להתעלמות</li>
                        <li>• איזה סוג לקוחות מגיב ומה רמת הכוונה שלהם</li>
                        <li>• איפה בדיוק נפל תהליך המכירה ומה לתקן בסיבוב הבא</li>
                    </ul>
                </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 italic pt-2 border-t border-slate-800/90">
                &quot;קמפיין ראשון הוא לא רק מבחן רווח. הוא הדרך הזולה ביותר לקנות מידע אמיתי על הלקוחות שלכם.&quot;
            </p>
        </aside>
    );
};

/**
 * Diagram 5: Data Lives Post-Click (הנתונים נמצאים אחרי הקליק)
 * השרשרת השלמה: מודעה -> קליק -> דף נחיתה -> CRM -> שיחה -> עסקה -> למידה
 */
export const PostClickDataFlowDiagram: React.FC = () => {
    const flowSteps = [
        { title: 'מודעה', subtitle: 'חשיפה ומסר' },
        { title: 'קליק', subtitle: 'עניין ראשוני' },
        { title: 'דף נחיתה', subtitle: 'הסבר והצעה' },
        { title: 'ליד ב-CRM', subtitle: 'איסוף הקשר' },
        { title: 'שיחה / פגישה', subtitle: 'בדיקת התאמה' },
        { title: 'עסקה / החלטה', subtitle: 'ערך אמיתי' },
        { title: 'למידה ושיפור', subtitle: 'דיוק הקמפיין' }
    ];

    return (
        <figure className="my-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
            <div className="text-center max-w-xl mx-auto mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black mb-2">
                    <Target size={13} />
                    <span>זרימת המידע המלאה</span>
                </span>
                <h4 className="text-lg sm:text-2xl font-black text-white">
                    למה ה-CTR הוא רק חצי מהסיפור? הידע נמצא אחרי הקליק
                </h4>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {flowSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-center min-w-[90px] sm:min-w-[110px] shadow-xs">
                            <div className="font-extrabold text-xs sm:text-sm text-white">{step.title}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{step.subtitle}</div>
                        </div>
                        {idx < flowSteps.length - 1 && (
                            <ArrowLeft size={16} className="text-indigo-400 hidden sm:inline flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <figcaption className="text-center text-xs text-slate-400 mt-6 pt-3 border-t border-slate-800">
                💡 אם איש המכירות לא יודע מאיזה קמפיין הגיע הליד ומה כאב לו בשיחה, שום כלי פרסום לא יעזור לשפר את התוצאות.
            </figcaption>
        </figure>
    );
};

/**
 * Recap Card: The 5 Rules for Entering New Business Territory
 * סיכום חמשת הכללים לכניסה לשטח חדש
 */
export const FiveRulesRecapCard: React.FC = () => {
    const rules = [
        { num: '1', title: 'אל תחכו להרגיש מוכנים', text: 'היעד הוא לא לדעת מספיק כדי לא לטעות, אלא לדעת מספיק כדי שהטעות תהיה קטנה ומדידה.' },
        { num: '2', title: 'התחילו בניסוי שאפשר להרשות לעצמכם לטעות בו', text: 'לא מהמרים על כל התקציב. מתחילים קטן, רוכשים מידע בזול ובונים תחושת ידיים.' },
        { num: '3', title: 'הגדירו מראש מה אתם רוצים ללמוד', text: 'קמפיין שלא לימד אתכם כלום הוא קמפיין יקר. חלק גדול מהידע נמצא ב-CRM לאחר הקליק.' },
        { num: '4', title: 'אל תמסרו לאחרים משהו שאתם לא מבינים בכלל', text: 'לא צריך לנהל קמפיינים בעצמכם לנצח, אבל מי שהתנסה בעצמו כבר לעולם לא עיוור מול ספקים.' },
        { num: '5', title: 'התחילו לצבור ניסיון לפני שהוא הופך לחובה', text: 'היתרון האמיתי אינו להיות ראשון במרוץ, אלא להחזיק בחצי שנה של ניסיון מעשי כשהמתחרים רק פותחים מדריך.' }
    ];

    return (
        <aside 
            aria-label="חמשת הכללים לכניסה לשטח חדש"
            className="my-12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
                        <Compass size={20} />
                    </div>
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">סיכום עקרונות ניהוליים</span>
                </div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug mb-6">
                    חמשת הכללים לכניסה לשטח חדש בעסק
                </h3>

                <div className="space-y-4">
                    {rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 sm:p-5">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center mt-0.5 shadow-xs">
                                {rule.num}
                            </span>
                            <div>
                                <h4 className="font-bold text-white text-sm sm:text-base mb-1">
                                    {rule.title}
                                </h4>
                                <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                                    {rule.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
