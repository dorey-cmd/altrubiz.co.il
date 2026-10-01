import React from 'react';
import { 
    Video, 
    Volume2, 
    HardDrive, 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    Sparkles, 
    Layers, 
    ExternalLink, 
    ShieldCheck, 
    Zap,
    Smartphone,
    Laptop,
    Film,
    Bot
} from 'lucide-react';

/**
 * Diagram 1: "MP4 הוא לא בהכרח MP4"
 * Explains Container vs. Video Codec vs. Audio Codec vs. File Size requirements in WhatsApp Business API.
 */
export const MP4ContainerBreakdownDiagram: React.FC = () => {
    return (
        <figure 
            className="my-10 rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50 p-5 sm:p-8 shadow-sm"
            role="region"
            aria-label="דיאגרמת מבנה קובץ MP4 ודרישות WhatsApp Business API"
        >
            <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                    <Layers size={14} />
                    <span>אנטומיה של קובץ וידאו</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    למה סיומת MP4 היא רק העטיפה החיצונית?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    WhatsApp Business Platform בודקת את הקידוד הפנימי, האודיו וגודל הקובץ – לא רק את שלוש האותיות בסוף השם.
                </p>
            </div>

            {/* Outer Box representing the .mp4 container */}
            <div className="relative rounded-2xl border-2 border-dashed border-primary/40 bg-blue-50/40 p-5 sm:p-7">
                {/* Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-blue-200/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-sm">
                            MP4
                        </div>
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider block">עטיפה חיצונית (Container)</span>
                            <span className="text-sm sm:text-base font-extrabold text-slate-900">video.mp4 (נראה תקין לחלוטין במחשב ובטלפון)</span>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 size={13} />
                        <span>נפתח בנגן מקומי</span>
                    </span>
                </div>

                {/* Inside Layers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Layer 1: Video Codec */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                            <Video size={16} className="text-primary" />
                            <span>1. קידוד וידאו (Video Codec)</span>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center justify-between">
                                <span>H.264 (AVC) Main / Baseline</span>
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                            </div>
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
                                <span>H.265 (HEVC) / VP9 / AV1</span>
                                <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                                    <XCircle size={13} /> נדחה ב-API
                                </span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                            הטלפון מנגן HEVC בקלות, אך שרת ה-API של WhatsApp דוחה אותו.
                        </p>
                    </div>

                    {/* Layer 2: Audio Codec */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                            <Volume2 size={16} className="text-primary" />
                            <span>2. קידוד אודיו (Audio Codec)</span>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center justify-between">
                                <span>AAC (44.1kHz Stereo)</span>
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                            </div>
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
                                <span>AC3 / PCM / Opus / MP3</span>
                                <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                                    <XCircle size={13} /> נדחה ב-API
                                </span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                            אודיו לא תואם עלול לגרום לסרטון להישלח שקט או להיכשל בשליחה.
                        </p>
                    </div>

                    {/* Layer 3: File Size & Constraints */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                            <HardDrive size={16} className="text-primary" />
                            <span>3. משקל ורזולוציה</span>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold flex items-center justify-between">
                                <span>עד 16MB ב-Cloud API</span>
                                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                            </div>
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
                                <span>קובץ מעל 16MB או 4K כבד</span>
                                <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                                    <XCircle size={13} /> חוסם שליחה
                                </span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                            התאמה ל-720p ו-30fps מבטיחה איכות מעולה לצד משקל קל.
                        </p>
                    </div>
                </div>

                {/* API Gatekeeper Conclusion Bar */}
                <div className="rounded-xl bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                        <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
                        <span>
                            <strong>התוצאה:</strong> אם אחד הרכיבים הפנימיים אינו תואם בדיוק – האוטומציה נכשלת גם אם הקובץ מסתיים ב-<code>.mp4</code>.
                        </span>
                    </div>
                </div>
            </div>

            <figcaption className="mt-3 text-center text-xs text-slate-500 font-medium">
                💡 בדיקת התאימות של WhatsApp Business API אינה מתחשבת רק בסיומת הקובץ, אלא בודקת קידוד ספציפי של וידאו ואודיו.
            </figcaption>
        </figure>
    );
};

/**
 * Diagram 2: "איך AltruBiz Render מכין סרטון לאוטומציה"
 * Flow diagram: Input files -> AltruBiz Render (browser-side WASM transcode) -> WhatsApp ready MP4 -> Workflow.
 */
export const RenderFlowDiagram: React.FC = () => {
    return (
        <figure 
            className="my-10 rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50 p-5 sm:p-8 shadow-sm"
            role="region"
            aria-label="דיאגרמת זרימת עיבוד והמרת סרטון ב-AltruBiz Render"
        >
            <div className="text-center max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                    <Zap size={14} className="text-emerald-600" />
                    <span>זרימת העבודה של AltruBiz Render</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    מכל מקור לקובץ שמוכן לשליחה
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    במקום להסתבך עם הגדרות קידוד, גוררים את הסרטון ומקבלים קובץ שעובר חלק בכל אוטומציה.
                </p>
            </div>

            {/* Desktop Horizontal / Mobile Vertical Stepper */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
                {/* Step 1: Input sources */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-slate-400">שלב 1</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">קובץ מקור</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mb-2">מכל מכשיר או תוכנה</h4>
                        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                            <div className="flex items-center gap-2">
                                <Smartphone size={14} className="text-slate-400" />
                                <span>מצלמת סמארטפון (iPhone / Android)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Laptop size={14} className="text-slate-400" />
                                <span>הקלטת מסך (Loom, Zoom, OBS)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Film size={14} className="text-slate-400" />
                                <span>CapCut, Premiere, Canva</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">MOV</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">MKV</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">WEBM</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">MP4</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-primary">עד 500MB</span>
                    </div>
                </div>

                {/* Step 2: The Core - AltruBiz Render */}
                <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-indigo-500/30 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-cyan-400">שלב 2 • ליבת הכלי</span>
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                                <ShieldCheck size={12} />
                                <span>פרטי בדפדפן (WASM)</span>
                            </span>
                        </div>
                        <h4 className="font-black text-white text-lg sm:text-xl mb-2 flex items-center gap-2">
                            <span>AltruBiz Render</span>
                            <Sparkles size={18} className="text-cyan-400" />
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                            מבצע המרה והתאמה מדויקת ישירות בדפדפן שלכם, ללא צורך בהעלאת הקובץ לשרת חיצוני.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-4">
                            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                                <span className="block text-[10px] text-cyan-300 font-bold mb-0.5">וידאו</span>
                                <span className="font-extrabold text-white text-xs">H.264 Main</span>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                                <span className="block text-[10px] text-cyan-300 font-bold mb-0.5">אודיו</span>
                                <span className="font-extrabold text-white text-xs">AAC Stereo</span>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                                <span className="block text-[10px] text-cyan-300 font-bold mb-0.5">רזולוציה</span>
                                <span className="font-extrabold text-white text-xs">עד 720p / 30fps</span>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
                                <span className="block text-[10px] text-cyan-300 font-bold mb-0.5">ניגון מהיר</span>
                                <span className="font-extrabold text-white text-xs">Faststart Flags</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                        <span>עיבוד מקומי בטוח ופרטי</span>
                        <a 
                            href="https://render.altrubiz.co.il/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                        >
                            <span>למעבר לכלי</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>

                {/* Step 3: Destination */}
                <div className="bg-white rounded-2xl border border-emerald-200 p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-emerald-600">שלב 3</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">מוכן לשימוש</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base mb-2">נשלח חלק ב-WhatsApp</h4>
                        <div className="space-y-2 text-xs text-slate-600 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-950 font-medium">
                                <Bot size={15} className="text-emerald-600 flex-shrink-0" />
                                <span>אוטומציות ו-Workflows ב-CRM</span>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-950 font-medium">
                                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                                <span>WhatsApp Cloud API מאושר</span>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-2 text-emerald-950 font-medium">
                                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                                <span>ניגון מיידי ללא עיכובים אצל הלקוח</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-center">
                        <span className="text-xs font-extrabold text-emerald-700">0 שגיאות שליחה</span>
                    </div>
                </div>
            </div>

            <figcaption className="mt-4 text-center text-xs text-slate-500 font-medium">
                💡 התהליך ב-AltruBiz Render לוקח כל קובץ וידאו ומייצר ממנו קובץ MP4 תקני המותאם בדיוק למפרט של WhatsApp Business.
            </figcaption>
        </figure>
    );
};
