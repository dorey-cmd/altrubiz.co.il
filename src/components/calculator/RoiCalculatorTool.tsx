import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import { 
    Calendar, 
    MessageCircle, 
    Minus, 
    Plus,
    Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ModalPresentationOptions } from '../../types/attribution';
import { buildAttributedWhatsAppUrl } from '../../lib/attribution';
import {
    ROI_CALCULATOR_DEFAULTS,
    RoiCalculatorInputs,
    calculateRoi,
    formatCurrency,
} from '../../lib/roiCalculator';

interface RoiCalculatorToolProps {
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return reduced;
}

// -------------------------------------------------------------
// Piecewise scaling math for small businesses & high-precision
// -------------------------------------------------------------

// Leads: 50% of the slider is dedicated to 5-100 leads
function leadsToPos(leads: number): number {
    if (leads <= 100) {
        return Math.max(0, Math.min(50, ((leads - 5) / 95) * 50));
    }
    return Math.max(50, Math.min(100, 50 + ((leads - 100) / 900) * 50));
}

function posToLeads(pos: number): number {
    if (pos <= 50) {
        const val = 5 + (pos / 50) * 95;
        if (val <= 25) return Math.round(val);
        return Math.round(val / 5) * 5;
    }
    const val = 100 + ((pos - 50) / 50) * 900;
    if (val <= 300) return Math.round(val / 10) * 10;
    return Math.round(val / 25) * 25;
}

// Deal Value: 50% of the slider is dedicated to 500 - 10,000 NIS
function dealValueToPos(val: number): number {
    if (val <= 10000) {
        return Math.max(0, Math.min(50, ((val - 500) / 9500) * 50));
    }
    return Math.max(50, Math.min(100, 50 + ((val - 10000) / 40000) * 50));
}

function posToDealValue(pos: number): number {
    if (pos <= 50) {
        const val = 500 + (pos / 50) * 9500;
        if (val <= 3000) return Math.round(val / 100) * 100;
        return Math.round(val / 250) * 250;
    }
    const val = 10000 + ((pos - 50) / 50) * 40000;
    return Math.round(val / 1000) * 1000;
}

export const RoiCalculatorTool: React.FC<RoiCalculatorToolProps> = ({ onOpenBookingModal }) => {
    const [inputs, setInputs] = useState<RoiCalculatorInputs>(ROI_CALCULATOR_DEFAULTS);
    const reduceMotion = usePrefersReducedMotion();

    const results = useMemo(() => calculateRoi(inputs), [inputs]);

    const lostLeadsCount = Math.max(0, Math.round(inputs.leadsPerMonth * (1 - inputs.closeRatePercent / 100)));
    const upliftDeals = ((inputs.leadsPerMonth * inputs.targetUpliftPercent) / 100).toFixed(1);

    const setField = (field: keyof RoiCalculatorInputs) => (value: number) => {
        setInputs((prev) => ({ ...prev, [field]: value }));
    };

    const stepLeads = (delta: number) => {
        const step = inputs.leadsPerMonth <= 25 ? 1 : inputs.leadsPerMonth <= 100 ? 5 : 25;
        const next = Math.max(5, Math.min(1000, inputs.leadsPerMonth + delta * step));
        setField('leadsPerMonth')(next);
    };

    const stepDealValue = (delta: number) => {
        const step = inputs.avgDealValue <= 3000 ? 100 : inputs.avgDealValue <= 10000 ? 250 : 1000;
        const next = Math.max(500, Math.min(50000, inputs.avgDealValue + delta * step));
        setField('avgDealValue')(next);
    };

    const stepCloseRate = (delta: number) => {
        const next = Math.max(1, Math.min(50, inputs.closeRatePercent + delta));
        setField('closeRatePercent')(next);
    };

    const stepHours = (delta: number) => {
        const next = Math.max(0, Math.min(60, inputs.hoursSpentPerMonth + delta));
        setField('hoursSpentPerMonth')(next);
    };

    const stepHourlyCost = (delta: number) => {
        const next = Math.max(30, Math.min(600, inputs.hourlyCost + delta * 25));
        setField('hourlyCost')(next);
    };

    const whatsappUrl = buildAttributedWhatsAppUrl(
        `שלום צוות AltruBiz, השתמשתי במחשבון ה-ROI באתר וזיהיתי כ-${formatCurrency(results.revenueAtRisk)} ₪ בחודש שהולכים לאיבוד, וכ-${formatCurrency(results.combinedPotentialValue)} ₪ פוטנציאל משיפור בסגירה וחיסכון בזמן. אשמח להתייעץ.`,
        {
            sourcePage: '/roi-calculator',
            sourceSection: 'calculator-results',
            sourceHub: 'lost-leads',
            sourceTopic: 'lost-leads',
            intent: 'assessment',
            ctaType: 'whatsapp',
            sourceLabel: 'roi_calculator_whatsapp',
        }
    );

    const handleOpenBooking = () => {
        onOpenBookingModal?.({
            title: 'בואו נמפה את תהליך הלידים שלכם',
            subtitle: `לפי הנתונים שהוזנו במחשבון, זוהו כ-${formatCurrency(results.revenueAtRisk)} ₪ בחודש שהולכים כיום לאיבוד. נשוחח על התהליך הקיים ונבנה תוכנית ממוקדת לעצירת הנזילה.`,
            badge: 'תוצאות מחשבון ה-ROI',
            whatsappPrefill: `שלום צוות AltruBiz, מילאתי את מחשבון ה-ROI ואשמח לתאם שיחה לגבי התוצאות.`,
            attribution: {
                sourcePage: '/roi-calculator',
                sourceSection: 'calculator-results',
                sourceHub: 'lost-leads',
                sourceTopic: 'lost-leads',
                intent: 'assessment',
                ctaType: 'meeting',
                sourceLabel: 'מיפוי תהליך הלידים לפי תוצאות מחשבון ROI',
            },
        });
    };

    const leadsSliderPos = leadsToPos(inputs.leadsPerMonth);
    const dealSliderPos = dealValueToPos(inputs.avgDealValue);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start" dir="rtl">
            {/* Left Column: Segmented & Bounded Inputs Cards */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>הגדרת נתוני העסק</span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        התאמה מלאה גם למיעוט לידים
                    </span>
                </div>

                {/* Field 1: Leads per Month Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 hover:border-blue-200/90 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="leads-range" className="text-xs sm:text-sm font-bold text-slate-900">
                            לידים חדשים בחודש:
                        </label>
                        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-2xs" dir="ltr">
                            <button
                                type="button"
                                onClick={() => stepLeads(-1)}
                                aria-label="הפחתת מספר לידים"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <input
                                id="leads-input"
                                type="number"
                                inputMode="numeric"
                                min={5}
                                max={1000}
                                value={inputs.leadsPerMonth}
                                onChange={(e) => {
                                    const n = parseInt(e.target.value, 10);
                                    if (!isNaN(n)) setField('leadsPerMonth')(Math.max(5, Math.min(1000, n)));
                                }}
                                className="w-11 text-center font-black text-primary text-xs sm:text-sm bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => stepLeads(1)}
                                aria-label="הוספת מספר לידים"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div dir="ltr" className="py-1">
                        <input
                            id="leads-range"
                            type="range"
                            min={0}
                            max={100}
                            step={0.5}
                            value={leadsSliderPos}
                            onChange={(e) => {
                                const nextLeads = posToLeads(parseFloat(e.target.value));
                                setField('leadsPerMonth')(nextLeads);
                            }}
                            style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${leadsSliderPos}%, #e2e8f0 ${leadsSliderPos}%, #e2e8f0 100%)`,
                            }}
                            aria-label="מספר לידים חדשים בחודש"
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-1 mt-1 pt-0.5">
                        <span className="text-[11px] font-bold text-primary">
                            {formatCurrency(inputs.leadsPerMonth)} לידים
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                            {[10, 25, 50, 100, 250, 500].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setField('leadsPerMonth')(preset)}
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                                        inputs.leadsPerMonth === preset
                                            ? 'bg-primary text-white shadow-2xs'
                                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                >
                                    {preset === 500 ? '500+' : preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Field 2: Average Deal Value Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 hover:border-blue-200/90 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="deal-range" className="text-xs sm:text-sm font-bold text-slate-900">
                            שווי עסקה ממוצעת:
                        </label>
                        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-2xs" dir="ltr">
                            <button
                                type="button"
                                onClick={() => stepDealValue(-1)}
                                aria-label="הפחתת שווי עסקה"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <div className="flex items-center">
                                <span className="text-[10px] font-bold text-primary pe-0.5">₪</span>
                                <input
                                    id="deal-input"
                                    type="number"
                                    inputMode="numeric"
                                    min={500}
                                    max={50000}
                                    value={inputs.avgDealValue}
                                    onChange={(e) => {
                                        const n = parseInt(e.target.value, 10);
                                        if (!isNaN(n)) setField('avgDealValue')(Math.max(500, Math.min(50000, n)));
                                    }}
                                    className="w-14 text-center font-black text-primary text-xs sm:text-sm bg-transparent focus:outline-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => stepDealValue(1)}
                                aria-label="הוספת שווי עסקה"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div dir="ltr" className="py-1">
                        <input
                            id="deal-range"
                            type="range"
                            min={0}
                            max={100}
                            step={0.5}
                            value={dealSliderPos}
                            onChange={(e) => {
                                const nextVal = posToDealValue(parseFloat(e.target.value));
                                setField('avgDealValue')(nextVal);
                            }}
                            style={{
                                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${dealSliderPos}%, #e2e8f0 ${dealSliderPos}%, #e2e8f0 100%)`,
                            }}
                            aria-label="שווי עסקה ממוצעת"
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-1 mt-1 pt-0.5">
                        <span className="text-[11px] font-bold text-primary">
                            ₪{formatCurrency(inputs.avgDealValue)} לעסקה
                        </span>
                        <div className="flex items-center gap-1 flex-wrap">
                            {[1000, 2500, 5000, 10000, 25000].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setField('avgDealValue')(preset)}
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                                        inputs.avgDealValue === preset
                                            ? 'bg-primary text-white shadow-2xs'
                                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                >
                                    {preset >= 1000 ? `₪${preset.toLocaleString('he-IL')}` : `₪${preset}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Field 3: Current Close Rate Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 hover:border-blue-200/90 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="close-range" className="text-xs sm:text-sm font-bold text-slate-900">
                            אחוז סגירה נוכחי מתוך הלידים:
                        </label>
                        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-2xs" dir="ltr">
                            <button
                                type="button"
                                onClick={() => stepCloseRate(-1)}
                                aria-label="הפחתת אחוז סגירה"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-black text-primary text-xs sm:text-sm">
                                {inputs.closeRatePercent}%
                            </span>
                            <button
                                type="button"
                                onClick={() => stepCloseRate(1)}
                                aria-label="הוספת אחוז סגירה"
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5">
                        {[5, 10, 15, 20, 25, 35].map((rate) => (
                            <button
                                key={rate}
                                type="button"
                                onClick={() => setField('closeRatePercent')(rate)}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                                    inputs.closeRatePercent === rate
                                        ? 'bg-primary text-white shadow-2xs'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                            >
                                {rate}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Field 4: Combined Hours & Employer Hourly Cost (Side by Side in 2 Columns) */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 hover:border-blue-200/90 transition-colors">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Sub-field 4A: Hours Spent */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="hours-range" className="text-xs sm:text-sm font-bold text-slate-900">
                                    שעות בחודש על עבודה ידנית:
                                </label>
                                <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-2xs" dir="ltr">
                                    <button
                                        type="button"
                                        onClick={() => stepHours(-1)}
                                        aria-label="הפחתת שעות"
                                        className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-primary rounded-full"
                                    >
                                        <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="w-9 text-center font-black text-primary text-xs">
                                        {inputs.hoursSpentPerMonth} ש'
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => stepHours(1)}
                                        aria-label="הוספת שעות"
                                        className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-primary rounded-full"
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { label: '2 ש\'', val: 2 },
                                    { label: '5 ש\'', val: 5 },
                                    { label: '10 ש\'', val: 10 },
                                    { label: '20 ש\'', val: 20 },
                                ].map((item) => (
                                    <button
                                        key={item.val}
                                        type="button"
                                        onClick={() => setField('hoursSpentPerMonth')(item.val)}
                                        className={`py-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                                            inputs.hoursSpentPerMonth === item.val
                                                ? 'bg-primary text-white shadow-2xs'
                                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sub-field 4B: Employer Hourly Cost */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="cost-range" className="text-xs sm:text-sm font-bold text-slate-900">
                                    עלות שעת עבודה (מעביד):
                                </label>
                                <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-2xs" dir="ltr">
                                    <button
                                        type="button"
                                        onClick={() => stepHourlyCost(-1)}
                                        aria-label="הפחתת עלות שעה"
                                        className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-primary rounded-full"
                                    >
                                        <Minus className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="w-12 text-center font-black text-primary text-xs">
                                        ₪{inputs.hourlyCost}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => stepHourlyCost(1)}
                                        aria-label="הוספת עלות שעה"
                                        className="w-4 h-4 flex items-center justify-center text-slate-600 hover:text-primary rounded-full"
                                    >
                                        <Plus className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-1">
                                {[100, 150, 200, 300].map((cost) => (
                                    <button
                                        key={cost}
                                        type="button"
                                        onClick={() => setField('hourlyCost')(cost)}
                                        className={`py-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                                            inputs.hourlyCost === cost
                                                ? 'bg-primary text-white shadow-2xs'
                                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}
                                    >
                                        ₪{cost}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Field 5: Target Uplift Card */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3 sm:p-3.5 hover:border-blue-200/90 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs sm:text-sm font-bold text-slate-900">
                            שיפור יעד מבוקש בסגירה לבדיקה:
                        </label>
                        <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            +{inputs.targetUpliftPercent}% בסגירה
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[
                            { label: '+3% (זהיר)', val: 3 },
                            { label: '+5% (ריאלי)', val: 5 },
                            { label: '+8% (משמעותי)', val: 8 },
                            { label: '+12% (שאפתני)', val: 12 },
                        ].map((pill) => (
                            <button
                                key={pill.val}
                                type="button"
                                onClick={() => setField('targetUpliftPercent')(pill.val)}
                                className={`py-1.5 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all text-center ${
                                    inputs.targetUpliftPercent === pill.val
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Compact Stack of 3 Result & Conversion Cards (Bites style) */}
            <div className="lg:col-span-5 space-y-3.5 lg:sticky lg:top-28">
                {/* Card 1: Breakdown of Metrics */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs">
                    <div className="space-y-4">
                        {/* Metric 1 */}
                        <div>
                            <div className="text-2xl sm:text-3xl font-serif italic font-black text-slate-900 mb-0.5" dir="ltr">
                                {reduceMotion ? (
                                    <span>₪{formatCurrency(results.revenueAtRisk)}</span>
                                ) : (
                                    <span>₪<CountUp end={results.revenueAtRisk} duration={0.6} preserveValue formattingFn={(n) => formatCurrency(n)} /></span>
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800">
                                פוטנציאל מכירה שנמצא כיום בסיכון
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                מתוך {inputs.leadsPerMonth} לידים, כ-{lostLeadsCount} לא הגיעו לסגירה.
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <div className="text-2xl sm:text-3xl font-serif italic font-black text-emerald-700 mb-0.5" dir="ltr">
                                {reduceMotion ? (
                                    <span>₪{formatCurrency(results.upliftValue)}</span>
                                ) : (
                                    <span>₪<CountUp end={results.upliftValue} duration={0.6} preserveValue formattingFn={(n) => formatCurrency(n)} /></span>
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800">
                                תוספת הכנסה משיפור סגירה (+{inputs.targetUpliftPercent}%)
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                שווה ערך לכ-{upliftDeals} עסקאות נוספות בכל חודש ללא ליד נוסף.
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                            <div className="text-2xl sm:text-3xl font-serif italic font-black text-primary mb-0.5" dir="ltr">
                                {reduceMotion ? (
                                    <span>₪{formatCurrency(results.timeSavingsValue)}</span>
                                ) : (
                                    <span>₪<CountUp end={results.timeSavingsValue} duration={0.6} preserveValue formattingFn={(n) => formatCurrency(n)} /></span>
                                )}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-slate-800">
                                חיסכון חודשי ישיר בשעות עבודה ידנית
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {inputs.hoursSpentPerMonth} שעות לפי עלות מעביד של ₪{inputs.hourlyCost} לשעה.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Total Opportunity / Bottom Line */}
                <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-blue-50/90 border border-blue-200/90 rounded-3xl p-4 sm:p-5 shadow-xs text-center">
                    <div className="text-3xl sm:text-4xl font-serif italic font-black text-primary mb-0.5" dir="ltr">
                        {reduceMotion ? (
                            <span>₪{formatCurrency(results.combinedPotentialValue)}</span>
                        ) : (
                            <span>₪<CountUp end={results.combinedPotentialValue} duration={0.6} preserveValue formattingFn={(n) => formatCurrency(n)} /></span>
                        )}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-800 tracking-wide uppercase mt-0.5">
                        סך שווי ההזדמנות החודשי בעסק
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                        כ-₪{formatCurrency(results.combinedPotentialValue * 12)} בשנה של פוטנציאל מצרפי
                    </div>
                </div>

                {/* Card 3: Contextual Conversion CTA */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                        רוצים לראות פירוט מלא של המספרים בעסק?
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mb-3.5 leading-relaxed">
                        בשיחת מיפוי קצרה של 20 דקות נעבור על התהליך הקיים ונזהה בדיוק מאיפה כדאי להתחיל לעצור את הנזילה.
                    </p>
                    <div className="space-y-2">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleOpenBooking}
                            className="w-full font-bold shadow-xs flex items-center justify-center gap-1.5 py-2.5 text-xs sm:text-sm"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>לתיאום שיחת מיפוי תהליך הלידים</span>
                        </Button>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors"
                        >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>לשלוח את הנתונים לוואטסאפ</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
