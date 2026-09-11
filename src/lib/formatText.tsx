import React from 'react';

/**
 * Parses markdown-style links [anchor text](url) in editorial paragraphs
 * and converts them into accessible, client-routed HTML anchor elements.
 * 
 * Invariants:
 * 1. Same-window navigation for internal links (target="_self")
 * 2. Unobtrusive editorial typography
 * 3. Graceful fallback to raw text if no links present
 */
export function renderFormattedText(text: string, onNavigate?: (path: string) => void): React.ReactNode {
    if (!text || typeof text !== 'string') return text;
    
    // Quick bailout if no markdown link pattern exists
    if (!text.includes('[') || !text.includes('](')) {
        return text;
    }

    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, linkUrl] = match;
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
            parts.push(text.substring(lastIndex, matchIndex));
        }

        const isInternal = linkUrl.startsWith('/');

        parts.push(
            <a
                key={`${linkUrl}-${matchIndex}`}
                href={linkUrl}
                onClick={isInternal && onNavigate ? (e) => {
                    e.preventDefault();
                    onNavigate(linkUrl);
                } : undefined}
                target={isInternal ? '_self' : '_blank'}
                rel={isInternal ? undefined : 'noopener noreferrer'}
                className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary underline-offset-4 transition-colors cursor-pointer"
            >
                {linkText}
            </a>
        );

        lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}
