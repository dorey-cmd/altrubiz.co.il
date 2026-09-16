import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import { AlertTriangle, TrendingUp, Clock, PiggyBank, Calendar, MessageCircle } from 'lucide-react';
import { Slider } from '../ui/Slider';
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

interface ResultCardProps {
    variant: 'risk' | 'gold' | 'blue' | 'win';
    icon: React.ReactNode;
    eyebrow: string;
    value: number;
    valueSuffix?: string;
    description: string;
    reduceMotion: boolean;
}

const VARIANT_STYLES: Record<ResultCardProps['variant'], { bg: string; border: string; text: string; eyebrow: string }> = {
    risk: {
        bg: 'bg-gradient-to-br from-red-50 to-transparent',
        border: 'border-red-200',
        text: 'text-red-700',
        eyebrow: 'text-red-600',
    },
    gold: {
        bg: 'bg-gradient-to-br from-amber-50 to-transparent',
        border: 'border-amber-300',
        text: 'text-accent',
        eyebrow: 'text-amber-600',
    },
    blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-transparent',
        border: 'border-blue-200',
        text: 'text-primary',
        eyebrow: 'text-primary',
    },
    win: {
        bg: 'bg-gradient-to-br from-emerald-50 to-transparent',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        eyebrow: 'text-emerald-700',
    },
};

const ResultCard: React.FC<ResultCardProps> = ({ variant, icon, eyebrow, value, valueSuffix, description, reduceMotion }) => {
    const styles = VARIANT_STYLES[variant];
    return (
        <div className={`rounded-2xl border p-5 sm:p-6 ${styles.bg} ${styles.border}`}>
            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide mb-3 ${styles.eyebrow}`}>
                {icon}
                <span>{eyebrow}</span>
            </div>
            <div className={`text-3xl sm:text-4xl font-black mb-2 ${styles.text}`} dir="ltr">
                {reduceMotion ? (
                    <span>{formatCurrency(value)}{valueSuffix ? ` ${valueSuffix}` : ''}</span>
                ) : (
                    <CountUp end={value} duration={0.6} preserveValue formattingFn={(n) => formatCurrency(n)} />
                )}
                {!reduceMotion && valueSuffix && <span> {valueSuffix}</span>}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
};

export const RoiCalculatorTool: React.FC<RoiCalculatorToolProps> = ({ onOpenBookingModal }) => {
    const [inputs, setInputs] = useState<RoiCalculatorInputs>(ROI_CALCULATOR_DEFAULTS);
    const reduceMotion = usePrefersReducedMotion();

    const results = useMemo(() => calculateRoi(inputs), [inputs]);

    const setField = (field: keyof RoiCalculatorInputs) => (value: number) => {
        setInputs((prev) => ({ ...prev, [field]: value }));
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

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            {/* Inputs */}
            <div className="p-6 sm:p-10 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                    הזנת נתוני העסק לבדיקת הפוטנציאל
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                    <Slider
                        id="leadsPerMonth"
                        label="לידים חדשים בחודש"
                        value={inputs.leadsPerMonth}
                        min={5}
                        max={1000}
                        step={5}
                        editable
                        suffixLabel="לידים"
                        onChange={setField('leadsPerMonth')}
                    />
                    <Slider
                        id="avgDealValue"
                        label="שווי עסקה ממוצעת"
                        value={inputs.avgDealValue}
                        min={100}
                        max={50000}
                        step={100}
                        editable
                        suffixLabel="₪"
                        onChange={setField('avgDealValue')}
                    />
                    <Slider
                        id="closeRatePercent"
                        label="אחוז סגירה נוכחי"
                        value={inputs.closeRatePercent}
                        min={1}
                        max={60}
                        step={1}
                        unit="%"
                        onChange={setField('closeRatePercent')}
                    />
                    <Slider
                        id="hoursSpentPerMonth"
                        label="שעות בחודש על מעקב, תזכורות ועדכוני אקסל"
                        value={inputs.hoursSpentPerMonth}
                        min={0}
                        max={100}
                        step={1}
                        unit="שעות"
                        onChange={setField('hoursSpentPerMonth')}
                    />
                    <Slider
                        id="hourlyCost"
                        label="עלות שעת עבודה ממוצעת"
                        value={inputs.hourlyCost}
                        min={20}
                        max={500}
                        step={10}
                        formatValue={(v) => `${formatCurrency(v)} ₪`}
                        onChange={setField('hourlyCost')}
                    />
                    <div className="pt-2 border-t border-slate-100">
                        <Slider
                            id="targetUpliftPercent"
                            label="שיפור יעד באחוז הסגירה שרוצים לבדוק"
                            value={inputs.targetUpliftPercent}
                            min={2}
                            max={50}
                            step={1}
                            unit="נקודות אחוז"
                            onChange={setField('targetUpliftPercent')}
                            helperText="שיפור ריאלי בתהליך - לא הבטחה, רק בדיקה של הפוטנציאל."
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="p-6 sm:p-10 bg-slate-50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                    מה הנתונים האלה אומרים על העסק שלכם
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <ResultCard
                        variant="risk"
                        icon={<AlertTriangle className="w-4 h-4" />}
                        eyebrow="כסף שהולך לאיבוד כל חודש"
                        value={results.revenueAtRisk}
                        valueSuffix="₪"
                        description="לפי הנתונים שהזנתם, זהו פוטנציאל המכירה החודשי שהולך לאיבוד היום, מהלידים שלא נסגרים בפועל."
                        reduceMotion={reduceMotion}
                    />
                    <ResultCard
                        variant="gold"
                        icon={<TrendingUp className="w-4 h-4" />}
                        eyebrow={`ערך שיפור של ${inputs.targetUpliftPercent}% בסגירה`}
                        value={results.upliftValue}
                        valueSuffix="₪ בחודש"
                        description="כך נראה הערך של שיפור בסגירה, בלי צורך בליד אחד נוסף."
                        reduceMotion={reduceMotion}
                    />
                    <ResultCard
                        variant="blue"
                        icon={<Clock className="w-4 h-4" />}
                        eyebrow="חיסכון פוטנציאלי בזמן עבודה"
                        value={results.timeSavingsValue}
                        valueSuffix="₪ בחודש"
                        description={`שווה ל-${inputs.hoursSpentPerMonth} שעות עבודה בחודש שמושקעות היום במעקב ידני ותזכורות.`}
                        reduceMotion={reduceMotion}
                    />
                    <ResultCard
                        variant="win"
                        icon={<PiggyBank className="w-4 h-4" />}
                        eyebrow="סך הפוטנציאל החודשי המשולב"
                        value={results.combinedPotentialValue}
                        valueSuffix="₪ בחודש"
                        description="שיפור הסגירה וחיסכון הזמן ביחד - כך נראה הפוטנציאל החודשי המשולב שלכם."
                        reduceMotion={reduceMotion}
                    />
                </div>

                <p className="text-center text-slate-700 font-bold mt-6 text-sm sm:text-base">
                    וכל זה עוד לפני שהגיע ליד אחד נוסף לעסק.
                </p>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-center">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleOpenBooking}
                        className="font-bold shadow-xl flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        <span>לתיאום שיחת מיפוי תהליך הלידים</span>
                    </Button>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-[#25D366] border-2 border-[#25D366]/30 hover:bg-[#25D366]/5 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>לשלוח את התוצאות בוואטסאפ</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
