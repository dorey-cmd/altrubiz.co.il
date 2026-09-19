import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { 
    QUESTIONS, 
    QUESTION_COUNT, 
    OPEN_QUESTION, 
    Answer, 
    saveDiagnosticState, 
    loadDiagnosticState 
} from '../../data/diagnosticData';

interface DiagnosticQuestionnaireProps {
    onComplete: () => void;
    onClose?: () => void;
}

export const DiagnosticQuestionnaire: React.FC<DiagnosticQuestionnaireProps> = ({
    onComplete
}) => {
    const [step, setStep] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [openAnswer, setOpenAnswer] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize from existing session if available
    useEffect(() => {
        const saved = loadDiagnosticState();
        if (saved && Object.keys(saved.answers).length > 0) {
            setAnswers(saved.answers);
            setOpenAnswer(saved.openAnswer || '');
        }
    }, []);

    const isQuestionStep = step < QUESTION_COUNT;
    const currentQuestion = isQuestionStep ? QUESTIONS[step] : null;
    const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

    const handleAnswer = (val: Answer) => {
        if (!currentQuestion) return;
        const nextAnswers = { ...answers, [currentQuestion.id]: val };
        setAnswers(nextAnswers);

        // Advance to next step
        if (step < QUESTION_COUNT) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleFinish = () => {
        saveDiagnosticState(answers, openAnswer);
        onComplete();
    };

    const progressPercentage = Math.round(((step + 1) / (QUESTION_COUNT + 1)) * 100);

    return (
        <div ref={containerRef} className="flex flex-col h-full select-none" dir="rtl">
            {/* Top Navigation & Progress Bar */}
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                        step === 0
                            ? 'opacity-0 pointer-events-none'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer'
                    }`}
                >
                    <ArrowRight size={14} />
                    <span>שאלה קודמת</span>
                </button>

                <div className="flex items-center gap-2 flex-1 max-w-[200px] sm:max-w-[240px]">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-l from-primary to-cyan-500 transition-all duration-300 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                        {Math.min(step + 1, QUESTION_COUNT + 1)} / {QUESTION_COUNT + 1}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            {isQuestionStep && currentQuestion ? (
                <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200/60">
                            <span>שאלה {step + 1} מתוך {QUESTION_COUNT}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug min-h-[50px]">
                            {currentQuestion.text}
                        </h3>
                    </div>

                    {/* Action Buttons: Large touch targets */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
                        <button
                            type="button"
                            onClick={() => handleAnswer('yes')}
                            className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-base transition-all cursor-pointer border-2 touch-manipulation ${
                                currentAnswer === 'yes'
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[0.99]'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-primary/50'
                            }`}
                        >
                            <span>כן</span>
                            {currentAnswer === 'yes' && <Check size={18} />}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleAnswer('no')}
                            className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-base transition-all cursor-pointer border-2 touch-manipulation ${
                                currentAnswer === 'no'
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[0.99]'
                                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-primary/50'
                            }`}
                        >
                            <span>לא</span>
                            {currentAnswer === 'no' && <Check size={18} />}
                        </button>
                    </div>
                </div>
            ) : (
                /* Step 19: Open Question with Reduced 2-row Height */
                <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200/60">
                            <Sparkles size={11} className="text-amber-500" />
                            <span>שאלה אחרונה (אופציונלי)</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                            {OPEN_QUESTION.text}
                        </h3>
                    </div>

                    {/* Compact 2-row Textarea (Half Height) */}
                    <div className="my-2 space-y-1">
                        <textarea
                            id="diagnostic-open-answer"
                            rows={2}
                            value={openAnswer}
                            onChange={(e) => setOpenAnswer(e.target.value)}
                            placeholder="אפשר לכתוב כאן בקצרה במילים שלכם..."
                            className="w-full p-2.5 text-xs sm:text-sm rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-[56px] min-h-[52px] max-h-[60px] text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
                        />
                        <p className="text-[11px] text-slate-500">
                            {OPEN_QUESTION.hint}
                        </p>
                    </div>

                    {/* Submit Button - ALWAYS fully visible inside the window */}
                    <button
                        type="button"
                        onClick={handleFinish}
                        className="w-full mt-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] cursor-pointer"
                    >
                        <span>לצפייה בתוצאה המותאמת</span>
                        <ArrowLeft size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};
