import React, { useEffect, useState } from 'react';

interface SliderProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    formatValue?: (value: number) => string;
    unit?: string;
    helperText?: string;
    /** When true, the value badge becomes a typable number input (in addition to the slider). */
    editable?: boolean;
    /** Suffix shown next to the typed number when editable (e.g. '₪', 'לידים'). */
    suffixLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
    id,
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    formatValue,
    unit,
    helperText,
    editable = false,
    suffixLabel,
}) => {
    const displayValue = formatValue ? formatValue(value) : `${value}${unit ? ` ${unit}` : ''}`;
    const percent = max > min ? ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100 : 0;

    const [text, setText] = useState(String(value));
    useEffect(() => {
        setText(String(value));
    }, [value]);

    const commit = (raw: string) => {
        const n = Number(raw);
        if (raw.trim() === '' || Number.isNaN(n)) {
            setText(String(value));
            return;
        }
        const clamped = Math.min(max, Math.max(min, n));
        onChange(clamped);
        setText(String(clamped));
    };

    return (
        <div className="w-full" dir="rtl">
            <div className="flex items-center justify-between mb-2.5 gap-3">
                <label htmlFor={editable ? `${id}-input` : id} className="text-sm sm:text-base font-bold text-slate-800">
                    {label}
                </label>
                {editable ? (
                    <div className="flex items-center gap-1.5 bg-blue-50 rounded-full ps-3 pe-1 py-1" dir="ltr">
                        <input
                            id={`${id}-input`}
                            type="number"
                            inputMode="numeric"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onBlur={(e) => commit(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    commit((e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                            aria-label={label}
                            className="w-16 sm:w-20 text-sm sm:text-base font-black text-primary bg-transparent text-center focus:outline-none"
                        />
                        {suffixLabel && (
                            <span className="text-xs font-bold text-primary pe-1 whitespace-nowrap">{suffixLabel}</span>
                        )}
                    </div>
                ) : (
                    <span
                        dir="ltr"
                        className="text-sm sm:text-base font-black text-primary bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap"
                    >
                        {displayValue}
                    </span>
                )}
            </div>
            <div dir="ltr">
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    aria-label={label}
                    aria-valuetext={displayValue}
                    className="w-full h-11 sm:h-3 appearance-none bg-slate-200 rounded-full cursor-pointer accent-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                    style={{
                        background: `linear-gradient(to right, #F5A623 0%, #F5A623 ${percent}%, #E2E8F0 ${percent}%, #E2E8F0 100%)`,
                    }}
                />
            </div>
            {helperText && (
                <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
            )}
        </div>
    );
};
