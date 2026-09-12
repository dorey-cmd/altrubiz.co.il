import React, { useState, useEffect } from 'react';
import { 
    CheckCircle2, 
    MessageSquare, 
    Trash2, 
    X, 
    AlertCircle, 
    Loader2, 
    Send, 
    ShieldCheck, 
    ChevronUp, 
    ChevronDown 
} from 'lucide-react';
import { Article } from '../../data/articles';
import { ReviewActionType, ReviewActionPayload } from '../../types/review';
import { sendReviewAction } from '../../lib/reviewAction';

interface ReviewCockpitProps {
    article: Article;
    branchName?: string;
    onActionCompleted?: (action: ReviewActionType, resultMessage: string) => void;
}

/**
 * Fail-Closed Authorization Guard for Review Cockpit
 * 
 * Invariants:
 * 1. Production domain (altrubiz.co.il / www.altrubiz.co.il) can NEVER render Review Cockpit under any circumstance.
 * 2. URL query parameters (?review=true) alone can NEVER authorize Review Cockpit.
 * 3. Requires BOTH:
 *    A. The article itself is strictly in 'review' status (never published or draft).
 *    AND
 *    B. The deployment environment is explicitly configured as Review Mode (VITE_REVIEW_MODE === 'true').
 */
export function isReviewModeAuthorized(articleStatus: string): boolean {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'altrubiz.co.il' || hostname === 'www.altrubiz.co.il') {
            return false;
        }
    }

    const isExplicitReviewDeployment = typeof import.meta !== 'undefined' && import.meta.env?.VITE_REVIEW_MODE === 'true';
    const isReviewArticle = articleStatus === 'review';

    return isExplicitReviewDeployment && isReviewArticle;
}

export const ReviewCockpit: React.FC<ReviewCockpitProps> = ({ 
    article, 
    branchName = `content/review/${article.slug}`,
    onActionCompleted 
}) => {
    const [isReviewMode, setIsReviewMode] = useState<boolean>(() => isReviewModeAuthorized(article.publicationStatus));
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    
    // Modals
    const [activeModal, setActiveModal] = useState<ReviewActionType | null>(null);
    const [feedbackText, setFeedbackText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        setIsReviewMode(isReviewModeAuthorized(article.publicationStatus));
    }, [article.publicationStatus]);

    if (!isReviewMode) {
        return null;
    }

    const handleExecuteAction = async (action: ReviewActionType, feedback?: string) => {
        setIsSubmitting(true);
        setStatusMessage(null);

        const payload: ReviewActionPayload = {
            action,
            articleId: article.slug,
            publicPath: article.publicPath,
            branch: branchName,
            reviewUrl: typeof window !== 'undefined' ? window.location.href : '',
            feedback: feedback || '',
            timestamp: new Date().toISOString()
        };

        try {
            const result = await sendReviewAction(payload);
            setIsSubmitting(false);
            setActiveModal(null);
            setFeedbackText('');

            if (result.success) {
                setStatusMessage({ type: 'success', text: result.message });
                if (onActionCompleted) {
                    onActionCompleted(action, result.message);
                }
            } else {
                setStatusMessage({ type: 'error', text: result.message || 'הפעולה נכשלה' });
            }
        } catch (err: any) {
            setIsSubmitting(false);
            setStatusMessage({ type: 'error', text: err.message || 'שגיאה לא צפויה' });
        }
    };

    return (
        <>
            {/* Main Floating Review Cockpit Dock */}
            <aside 
                aria-label="מרכז בקרת סקירת מאמר"
                className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:left-6 sm:right-6 max-w-2xl sm:mx-auto z-[9990] bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 transition-all duration-300 font-sans"
                dir="rtl"
            >
                {/* Header Strip */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span className="font-bold text-slate-200">מרכז בקרת סקירה (Review Mode)</span>
                        <span className="hidden sm:inline-block text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                            טיוטת עריכה
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 hidden sm:inline truncate max-w-[180px]">
                            {branchName}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
                            aria-label={isCollapsed ? 'הרחבת תפריט סקירה' : 'צמצום תפריט סקירה'}
                        >
                            {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                {!isCollapsed && (
                    <div className="p-3 sm:p-4">
                        {statusMessage && (
                            <div className={`mb-3 p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                                statusMessage.type === 'success' 
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' 
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {statusMessage.type === 'success' ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                                    <span>{statusMessage.text}</span>
                                </div>
                                <button 
                                    onClick={() => setStatusMessage(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="text-right">
                                <div className="text-xs text-slate-400 font-medium">מאמר נבדק:</div>
                                <div className="text-sm font-bold text-slate-100 truncate max-w-sm">
                                    {article.title}
                                </div>
                            </div>

                            {/* Three Owner Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* 1. PUBLISH */}
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('publish')}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
                                >
                                    <CheckCircle2 size={15} />
                                    <span>אישור ופרסום</span>
                                </button>

                                {/* 2. COMMENTS */}
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('comment')}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-950/40 active:scale-95"
                                >
                                    <MessageSquare size={15} />
                                    <span>הערות ותיקונים</span>
                                </button>

                                {/* 3. DISCARD */}
                                <button
                                    type="button"
                                    onClick={() => setActiveModal('discard')}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-95"
                                >
                                    <Trash2 size={14} />
                                    <span>פסילת כיוון</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </aside>

            {/* Modal: PUBLISH CONFIRMATION */}
            {activeModal === 'publish' && (
                <div 
                    role="dialog" 
                    aria-modal="true" 
                    className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
                    dir="rtl"
                >
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-right animate-in fade-in zoom-in-95">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">אישור פרסום מאמר</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            באישור פרסום זה, המאמר יקודם לסטטוס <span className="font-bold text-emerald-700">Published</span> ויעבור בדיקת מוכנות (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">release:gate</code>) מלאה לפני מיזוג ל-Master ופריסה בייצור.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 mb-5">
                            <span className="font-bold">נתיב קנוני: </span>
                            <span className="font-mono text-slate-900">{article.publicPath}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium rounded-xl transition-colors"
                            >
                                חזרה לסקירה
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteAction('publish')}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                <span>אישור ופרסום</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: COMMENTS & FEEDBACK */}
            {activeModal === 'comment' && (
                <div 
                    role="dialog" 
                    aria-modal="true" 
                    className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
                    dir="rtl"
                >
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-right animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">הערות ותיקונים לעריכה</h3>
                                    <p className="text-xs text-slate-500">המשוב יישלח לעדכון הטיוטה באותו ה-Review branch</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="review-feedback-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                                תוכן המשוב לעדכון:
                            </label>
                            <textarea
                                id="review-feedback-input"
                                rows={5}
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="לדוגמה:&#10;• הפתיחה חלשה, תמצא Hook יותר חזק סביב שיחת טלפון שלא נענתה.&#10;• קצר את הפסקה השנייה בחלק על WhatsApp.&#10;• הוסף דוגמה מספרית מעסק של 3 עובדים."
                                className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-slate-900 placeholder:text-slate-400 resize-none leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium rounded-xl transition-colors"
                            >
                                ביטול
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteAction('comment', feedbackText)}
                                disabled={isSubmitting || !feedbackText.trim()}
                                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                                <span>שליחת הערות לסבב תיקונים</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: DISCARD CONFIRMATION */}
            {activeModal === 'discard' && (
                <div 
                    role="dialog" 
                    aria-modal="true" 
                    className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
                    dir="rtl"
                >
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-right animate-in fade-in zoom-in-95">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">פסילת טיוטת מאמר</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            האם לוותר על כיוון המאמר הזה? פעולה זו תסגור את ה-Review branch ותבטל את הטיוטה. תוכן קיים ב-Master לא יושפע.
                        </p>
                        <div className="flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium rounded-xl transition-colors"
                            >
                                המשך סקירה
                            </button>
                            <button
                                type="button"
                                onClick={() => handleExecuteAction('discard')}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                <span>אישור פסילה וביטול</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
