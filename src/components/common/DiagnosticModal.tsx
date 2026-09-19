import React, { useEffect, useRef } from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react';
import { useModalFocusManagement } from '../../hooks/useModalFocusManagement';
import { DiagnosticQuestionnaire } from '../diagnostic/DiagnosticQuestionnaire';

interface DiagnosticModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate?: (path: string) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
    isOpen,
    onClose,
    onNavigate
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Accessibility: manage focus trap inside modal and restore upon close
    useModalFocusManagement(dialogRef, isOpen);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnostic-modal-title"
        >
            {/* Dark Backdrop with Blur */}
            <div 
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog Content */}
            <div
                ref={dialogRef}
                tabIndex={-1}
                className="relative z-10 w-full max-w-[640px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col my-auto max-h-[96vh] animate-in zoom-in-95 duration-200 focus:outline-none"
            >
                {/* Accent Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-primary to-secondary w-full" />

                {/* Header - Compact & Clean */}
                <div className="p-3.5 sm:p-4 pb-2 sm:pb-2.5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/80">
                    <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200/60">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>אבחון עצמי מהיר</span>
                        </div>
                        <h2 
                            id="diagnostic-modal-title"
                            className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight leading-snug"
                        >
                            איפה העסק מאבד זמן, כסף ואנרגיה?
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm font-medium">
                            18 שאלות קצרות של כן או לא.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-2xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                        aria-label="סגירת שאלון אבחון"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Native Questionnaire Container */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
                    <DiagnosticQuestionnaire
                        onComplete={() => {
                            onClose();
                            if (onNavigate) {
                                onNavigate('/diagnostic-result');
                            } else {
                                window.location.href = '/diagnostic-result';
                            }
                        }}
                        onClose={onClose}
                    />
                </div>

                {/* Minimal Footer */}
                <div className="p-3 px-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>כלי אבחון מבית AltruBiz</span>
                    <a
                        href="/hidden-business-growth-barriers"
                        onClick={(e) => {
                            if (onNavigate) {
                                e.preventDefault();
                                onClose();
                                onNavigate('/hidden-business-growth-barriers');
                            }
                        }}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:text-secondary transition-colors"
                    >
                        <span>למאמר המלא על חסמי צמיחה בעסק</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
};
