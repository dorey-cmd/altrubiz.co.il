import React from 'react';
import { InternalLink } from '../common/InternalLink';

interface ButtonBaseProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

/** Action button: filter, open a modal, submit. Renders a real `<button>`. */
type ActionButtonProps = ButtonBaseProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; onNavigate?: undefined };

/**
 * Navigation button: same look, but renders a crawlable `<a href>`.
 * Use `href` whenever the control moves the visitor to another URL.
 */
type LinkButtonProps = ButtonBaseProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
        href: string;
        onNavigate?: (path: string) => void;
    };

export type ButtonProps = ActionButtonProps | LinkButtonProps;

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

    const variants = {
        primary: "bg-gradient-to-r from-accent to-yellow-400 text-white hover:from-yellow-400 hover:to-accent shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5",
        secondary: "bg-primary text-white hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
        ghost: "text-gray-600 hover:text-primary hover:bg-primary/5",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (typeof props.href === 'string') {
        const { href, onNavigate, ...anchorProps } = props as LinkButtonProps;
        return (
            <InternalLink href={href} onNavigate={onNavigate} className={classes} {...anchorProps}>
                {children}
            </InternalLink>
        );
    }

    const { href: _href, onNavigate: _onNavigate, ...buttonProps } = props as ActionButtonProps;
    return (
        <button className={classes} {...buttonProps}>
            {children}
        </button>
    );
};
