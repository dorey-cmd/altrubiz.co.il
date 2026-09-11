import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, BookOpen } from 'lucide-react';
import { CANONICAL_CONCEPTS, CanonicalConcept } from '../../data/knowledgeGraph';

interface ContextualConceptProps {
    conceptId: string;
    displayText?: string;
    onNavigate?: (path: string) => void;
}

export const ContextualConcept: React.FC<ContextualConceptProps> = ({
    conceptId,
    displayText,
    onNavigate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

    const concept: CanonicalConcept | undefined = CANONICAL_CONCEPTS[conceptId];
    const textToShow = displayText || (concept ? concept.term : conceptId);

    // Dismiss on click outside or Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (
                popoverRef.current && 
                !popoverRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Fallback if concept is unrecognized
    if (!concept) {
        return <span>{textToShow}</span>;
    }

    // STATE 1: Mature Canonical Concept with Approved Public Destination (e.g. Topic Hub)
    if (concept.hasApprovedPublicDestination && concept.publicDestinationUrl) {
        return (
            <span className="relative inline-block group">
                <a
                    ref={triggerRef as React.RefObject<HTMLAnchorElement>}
                    href={concept.publicDestinationUrl}
                    onClick={(e) => {
                        if (onNavigate) {
                            e.preventDefault();
                            onNavigate(concept.publicDestinationUrl!);
                        }
                    }}
                    target="_self"
                    title={`${concept.term}: ${concept.canonicalDefinition}`}
                    className="text-primary font-bold underline decoration-primary/35 hover:decoration-primary underline-offset-4 transition-all hover:text-blue-700 cursor-pointer inline-flex items-center gap-0.5"
                >
                    <span>{textToShow}</span>
                </a>
            </span>
        );
    }

    // STATE 2: Emerging/Maturing Concept without Public Page -> In-place Accessible Definition Popover
    return (
        <span className="relative inline-block align-baseline">
            <button
                ref={triggerRef as React.RefObject<HTMLButtonElement>}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={`הסבר על המונח: ${concept.term}`}
                className="inline-flex items-center gap-1 border-b border-dotted border-primary/60 text-slate-900 hover:text-primary font-medium hover:border-primary transition-colors cursor-help px-0.5"
            >
                <span>{textToShow}</span>
                <HelpCircle size={12} className="text-primary/70 shrink-0 inline" />
            </button>

            {isOpen && (
                <>
                    {/* Mobile Backdrop */}
                    <div 
                        className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-2xs" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Definition Card (Desktop Float / Mobile Centered Card) */}
                    <div
                        ref={popoverRef}
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-x-4 top-1/3 -translate-y-1/2 z-50 lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:translate-y-2 lg:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-slate-800 text-right animate-in fade-in zoom-in-95 duration-150"
                        dir="rtl"
                    >
                        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                                <BookOpen size={14} className="text-primary" />
                                <span>{concept.term}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                aria-label="סגירת הסבר"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                            {concept.canonicalDefinition}
                        </p>
                    </div>
                </>
            )}
        </span>
    );
};
