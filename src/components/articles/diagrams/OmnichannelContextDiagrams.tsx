import React from 'react';
import { 
    Phone, 
    MessageSquare, 
    Mail, 
    FileText, 
    Globe, 
    Share2, 
    ArrowDown, 
    User, 
    Calendar, 
    CheckCircle2, 
    Sparkles, 
    Clock, 
    Layers, 
    AlertCircle,
    XCircle,
    Check
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';

/**
 * Core Omnichannel Flow Diagram
 * "כל הדרכים מובילות לאותו לקוח"
 * 
 * Channels in the background -> AltruBiz Unified Context -> Salesperson at the frontline
 */
export const OmnichannelFlowDiagram: React.FC = () => {
    const prefersReducedMotion = usePrefersReducedMotion();

    const channels = [
        { name: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        { name: 'טפסים באתר', icon: Globe, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
        { name: 'Facebook', icon: Share2, color: 'text-blue-700 bg-blue-50 border-blue-200' },
        { name: 'Instagram', icon: Share2, color: 'text-pink-700 bg-pink-50 border-pink-200' },
        { name: 'Google', icon: Globe, color: 'text-amber-700 bg-amber-50 border-amber-200' },
        { name: 'אימייל', icon: Mail, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
        { name: 'SMS', icon: MessageSquare, color: 'text-violet-700 bg-violet-50 border-violet-200' },
        { name: 'שיחות טלפון', icon: Phone, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    ];

    const contextLayers = [
        { label: 'פרטי קשר וזהות מאומתת', icon: User },
        { label: 'מקור הפנייה והקמפיין', icon: Globe },
        { label: 'Timeline אירועים מכל הערוצים', icon: Clock },
        { label: 'היסטוריית שיחות והודעות', icon: MessageSquare },
        { label: 'הערות ותובנות משיחות קודמות', icon: FileText },
        { label: 'שלב בפייפליין ונציג אחראי (Owner)', icon: Layers },
        { label: 'משימות פתוחות ו-Next Step', icon: CheckCircle2 },
        { label: 'פגישות ביומן ותזכורות Follow-Up', icon: Calendar },
    ];

    return (
        <figure 
            className="my-10 rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50 p-5 sm:p-8 shadow-sm"
            role="region"
            aria-label="דיאגרמת זרימת מידע רב-ערוצית לכרטיס לקוח אחוד"
        >
            <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-2">
                    <Layers size={14} />
                    <span>ארכיטקטורת רציפות לקוח</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    כל הדרכים מובילות לאותו לקוח
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    הערוצים נמצאים ברקע. האדם נמצא בחזית: כרטיס לקוח אחוד שמזין את איש המכירות בכל ההקשר ברגע השיחה.
                </p>
            </div>

            {/* Step 1: Channels row */}
            <div className="space-y-2">
                <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    שלב 1: כניסות וערוצי תקשורת (ברקע)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {channels.map((ch, idx) => {
                        const Icon = ch.icon;
                        return (
                            <div 
                                key={idx}
                                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold shadow-2xs ${ch.color}`}
                            >
                                <Icon size={14} className="flex-shrink-0" />
                                <span>{ch.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Connecting flow indicator */}
            <div className="flex justify-center my-3 text-slate-400">
                <div className={`p-1.5 rounded-full bg-slate-100 border border-slate-200 ${prefersReducedMotion ? '' : 'animate-bounce'}`}>
                    <ArrowDown size={16} className="text-secondary" />
                </div>
            </div>

            {/* Step 2: Center Hub - AltruBiz CRM */}
            <div className="rounded-2xl border-2 border-secondary/40 bg-gradient-to-br from-cyan-50/60 via-white to-blue-50/60 p-4 sm:p-6 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center shadow-xs">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-semibold">התשתית המרכזית</div>
                            <div className="text-base sm:text-lg font-black text-slate-900">AltruBiz CRM — תמונת לקוח אחודה (Customer Context)</div>
                        </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-secondary border border-cyan-200 shadow-2xs">
                        כרטיס לקוח אחד רציף
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {contextLayers.map((layer, idx) => {
                        const Icon = layer.icon;
                        return (
                            <div 
                                key={idx}
                                className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-slate-200/80 text-xs text-slate-800 font-semibold shadow-2xs"
                            >
                                <Icon size={13} className="text-secondary flex-shrink-0" />
                                <span className="truncate">{layer.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Connecting flow indicator */}
            <div className="flex justify-center my-3 text-slate-400">
                <div className={`p-1.5 rounded-full bg-slate-100 border border-slate-200 ${prefersReducedMotion ? '' : 'animate-bounce'}`}>
                    <ArrowDown size={16} className="text-emerald-600" />
                </div>
            </div>

            {/* Step 3: Frontline - Salesperson */}
            <div className="rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                            <Phone size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">בחזית השיחה</div>
                            <div className="text-base sm:text-lg font-black text-emerald-950">
                                איש המכירות / בעל העסק עונה לטלפון
                            </div>
                            <div className="text-xs sm:text-sm text-emerald-800 font-medium">
                                כל המידע, הצרכים, ההצעות והשלב הבא כבר פתוחים מול העיניים לפני אמירת המילה הראשונה.
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                            <Check size={14} />
                            <span>שיחה חלקה ללא "דיג" מידע</span>
                        </span>
                    </div>
                </div>
            </div>

            <figcaption className="mt-4 text-center text-xs text-slate-500 font-medium">
                💡 <strong className="text-slate-700">העיקרון:</strong> במקום לחפש הודעות בחמש אפליקציות, המערכת מציגה לאיש המכירות את כל הסיפור בשנייה שהוא עונה.
            </figcaption>
        </figure>
    );
};

/**
 * Before / After Diagram
 * "לא יותר ערוצים. יותר הקשר."
 */
export const OmnichannelBeforeAfterDiagram: React.FC = () => {
    return (
        <div 
            className="my-10 rounded-3xl overflow-hidden border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm"
            role="region"
            aria-label="השוואת לפני ואחרי: שיחות מפוזרות מול תמונת לקוח אחת"
        >
            <div className="text-center max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
                    <span>הבדל בין ערוצים להקשר</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    לא יותר ערוצים. יותר הקשר.
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* Before Column */}
                <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-rose-800 font-black text-base mb-3 pb-2 border-b border-rose-200/80">
                            <XCircle size={18} className="text-rose-600" />
                            <span>לפני: שיחות מפוזרות ללא הקשר</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium mb-4">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span><strong>Facebook</strong> ← יושב במנהל המודעות</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span><strong>WhatsApp</strong> ← שמור בטלפון האישי של עובד</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span><strong>אימייל</strong> ← קבור בתיבת דואר נפרדת</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span><strong>שיחת טלפון קודמת</strong> ← רק בזיכרון של מי שדיבר</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-400" />
                                <span><strong>טופס אתר</strong> ← התראה ישנה ב-Gmail</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/90 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 font-bold flex items-center gap-2">
                        <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                        <span>התוצאה: הלקוח מצלצל, ואיש המכירות פותח ב"תזכיר לי מי אתה ומה רצית".</span>
                    </div>
                </div>

                {/* After Column */}
                <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-900 font-black text-base mb-3 pb-2 border-b border-emerald-200/80">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                            <span>אחרי: תמונת לקוח אחת בזמן אמת</span>
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium mb-4">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span><strong>כרטיס Contact אחוד</strong> ← כל הערוצים מתנקזים לאותו אדם</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span><strong>Timeline מלא</strong> ← טפסים, הודעות, שיחות והצעות קודמות</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span><strong>שלב בפייפליין</strong> ← ברור איפה העסקה עומדת ולאן ממשיכים</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span><strong>הבטחות ותובנות</strong> ← שום פרט לא הולך לאיבוד או תלוי בזיכרון</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span><strong>Next Step מוגדר</strong> ← יודעים בדיוק מה צריך לקרות בשיחה</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/95 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-950 font-bold flex items-center gap-2">
                        <Check size={16} className="text-emerald-600 flex-shrink-0" />
                        <span>התוצאה: איש המכירות ממשיך בדיוק מהנקודה שבה הלקוח עצר – במקצועיות ובביטחון.</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    💡 <strong>השורה התחתונה:</strong> המטרה אינה לאסוף ערוצים, אלא להעביר את ההקשר אל מי שמדבר עם הלקוח.
                </span>
            </div>
        </div>
    );
};
