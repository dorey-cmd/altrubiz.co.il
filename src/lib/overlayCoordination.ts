/**
 * Tracks whether any full-screen, in-page overlay (e.g. the mobile
 * bottom-sheet navigation drawers in ArticlePage.tsx / HubPage.tsx) is
 * currently open, so always-on root-level fixed UI - specifically the
 * cookie consent banner - can get out of the way while one is open.
 *
 * Why this exists: those drawers render inside `<main className="relative
 * z-10">`, which creates its own CSS stacking context. A root-level sibling
 * with a higher z-index (needed for the banner to sit above ordinary
 * scrolling page content) will therefore always paint above the ENTIRE
 * main subtree, including a nested element the drawer gives a locally
 * higher z-index - there is no z-index value that stacks above regular
 * page content but below that specific nested overlay. Hiding the banner
 * for the overlay's lifetime sidesteps the conflict without touching that
 * layout.
 */

let openCount = 0;
const EVENT = 'altrubiz:overlay-count-changed';

function dispatch() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { openCount } }));
}

export function setOverlayOpen(isOpen: boolean): void {
    openCount = Math.max(0, openCount + (isOpen ? 1 : -1));
    dispatch();
}

export function isAnyOverlayOpen(): boolean {
    return openCount > 0;
}

export function onOverlayCountChanged(callback: (isAnyOpen: boolean) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback(isAnyOverlayOpen());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
}
