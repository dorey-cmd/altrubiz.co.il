import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Additive accessibility behavior for modal dialogs / full-screen drawers
 * that already implement role="dialog", aria-modal="true" and
 * Escape-to-close (ContactModal, BookingModal, PricingModal, and the
 * mobile bottom-sheet drawers in ArticlePage.tsx / HubPage.tsx).
 *
 * This hook only adds what those already had missing:
 *  1. Focus moves into the dialog when it opens.
 *  2. Tab / Shift+Tab is trapped inside the dialog while it is open.
 *  3. Focus returns to the element that triggered the dialog when it closes.
 *
 * It does not change any existing markup, iframe src/query params, CTA
 * attribution, or close/Escape behavior already implemented by the caller.
 */
export function useModalFocusManagement(
    containerRef: RefObject<HTMLElement | null>,
    isOpen: boolean
): void {
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        // Defer to the next tick so the dialog's children (e.g. conditionally
        // rendered iframes/buttons) are already in the DOM before we query
        // for focusable descendants.
        const focusTimer = window.setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;
            const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            if (focusable.length > 0) {
                focusable[0].focus({ preventScroll: true });
            } else {
                container.focus({ preventScroll: true });
            }
        }, 0);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const container = containerRef.current;
            if (!container) return;

            const focusable = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((node) => node.getClientRects().length > 0);

            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener('keydown', handleKeyDown, true);
            const toRestore = previouslyFocusedRef.current;
            if (toRestore && typeof toRestore.focus === 'function') {
                toRestore.focus({ preventScroll: true });
            }
            previouslyFocusedRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);
}
