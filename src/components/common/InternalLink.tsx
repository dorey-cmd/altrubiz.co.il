import React from 'react';

/**
 * Crawlable Internal Navigation (SiteOS Link Semantics)
 *
 * Permanent rule: navigation to another URL must render a real, crawlable
 * `<a href>`. `<button>` is for actions (filter, open a modal, submit).
 *
 * `InternalLink` always emits `<a href="...">`. A plain left-click is handled
 * client-side through `onNavigate` (SPA navigation, no reload); every other
 * interaction is left to the browser, so "open in new tab" (Ctrl/Cmd/Shift/
 * middle click, context menu), "copy link address" and keyboard activation
 * (Enter on a focused link) keep working natively.
 */

export interface InternalLinkProps
    extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string;
    /** Client-side navigation handler. When omitted the browser navigates normally. */
    onNavigate?: (path: string) => void;
}

/** True for an unmodified primary-button click (the only click we may intercept). */
export function isPlainPrimaryClick(e: React.MouseEvent): boolean {
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/**
 * Click handler for an `<a href>` that navigates client-side.
 * Intercepts only a plain primary click on a same-window link; modified clicks,
 * `target="_blank"` and links without a navigation handler fall through to the
 * browser's default behavior.
 */
export function handleClientNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    onNavigate?: (path: string) => void
): void {
    if (e.defaultPrevented || !onNavigate) return;
    if (!isPlainPrimaryClick(e)) return;
    const target = e.currentTarget.getAttribute('target');
    if (target && target !== '_self') return;
    e.preventDefault();
    onNavigate(href);
}

export const InternalLink = React.forwardRef<HTMLAnchorElement, InternalLinkProps>(
    ({ href, onNavigate, onClick, children, ...rest }, ref) => (
        <a
            ref={ref}
            href={href}
            onClick={(e) => {
                onClick?.(e);
                handleClientNavClick(e, href, onNavigate);
            }}
            {...rest}
        >
            {children}
        </a>
    )
);

InternalLink.displayName = 'InternalLink';
