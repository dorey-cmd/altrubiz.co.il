import React from 'react';
import { ContextualConcept } from '../components/common/ContextualConcept';
import { handleClientNavClick } from '../components/common/InternalLink';

/**
 * Parses markdown-style links [anchor text](url) and concepts [anchor text](concept:id)
 * in editorial paragraphs and converts them into accessible, client-routed HTML elements.
 * 
 * Invariants:
 * 1. Same-window navigation for internal links (target="_self")
 * 2. Unobtrusive editorial typography
 * 3. Progressive definition popovers for knowledge concepts
 * 4. Graceful fallback to raw text if no links present
 */
export function renderFormattedText(text: string, onNavigate?: (path: string) => void): React.ReactNode {
    if (!text || typeof text !== 'string') return text;
    
    // Quick bailout if no markdown pattern exists
    if (!text.includes('[') && !text.includes('**') && !text.includes('*')) {
        return text;
    }

    const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*[^*]+?\*)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(text)) !== null) {
        const fullMatch = match[0];
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
            parts.push(text.substring(lastIndex, matchIndex));
        }

        if (fullMatch.startsWith('[') && fullMatch.includes('](')) {
            const linkMatch = /^\[(.*?)\]\((.*?)\)$/.exec(fullMatch);
            if (linkMatch) {
                const [, linkText, linkUrl] = linkMatch;
                if (linkUrl.startsWith('concept:')) {
                    const conceptId = linkUrl.replace('concept:', '');
                    parts.push(
                        <ContextualConcept
                            key={`concept-${conceptId}-${matchIndex}`}
                            conceptId={conceptId}
                            displayText={linkText}
                            onNavigate={onNavigate}
                        />
                    );
                } else {
                    const isInternal = linkUrl.startsWith('/');
                    parts.push(
                        <a
                            key={`${linkUrl}-${matchIndex}`}
                            href={linkUrl}
                            onClick={isInternal && onNavigate ? (e) => handleClientNavClick(e, linkUrl, onNavigate) : undefined}
                            target={isInternal ? '_self' : '_blank'}
                            rel={isInternal ? undefined : 'noopener noreferrer'}
                            className="text-primary font-bold underline decoration-primary/30 hover:decoration-primary underline-offset-4 transition-colors cursor-pointer"
                        >
                            {linkText}
                        </a>
                    );
                }
            } else {
                parts.push(fullMatch);
            }
        } else if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
            const innerText = fullMatch.slice(2, -2);
            parts.push(
                <strong key={`bold-${matchIndex}`} className="font-bold text-slate-900">
                    {renderFormattedText(innerText, onNavigate)}
                </strong>
            );
        } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
            const innerText = fullMatch.slice(1, -1);
            parts.push(
                <em key={`italic-${matchIndex}`} className="italic">
                    {renderFormattedText(innerText, onNavigate)}
                </em>
            );
        } else {
            parts.push(fullMatch);
        }

        lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}
