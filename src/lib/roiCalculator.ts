/**
 * AltruBiz ROI / Lost-Leads Calculator
 *
 * Pure calculation layer for the interactive ROI calculator (/roi-calculator).
 * Keeps the "money already going to waste" figure separate from the
 * "opportunity" figure (uplift + time savings, summed together) so the
 * headline numbers stay conservative and defensible.
 */

export interface RoiCalculatorInputs {
    leadsPerMonth: number;
    avgDealValue: number;
    closeRatePercent: number;
    hoursSpentPerMonth: number;
    hourlyCost: number;
    targetUpliftPercent: number;
}

export const ROI_CALCULATOR_DEFAULTS: RoiCalculatorInputs = {
    leadsPerMonth: 100,
    avgDealValue: 2000,
    closeRatePercent: 10,
    hoursSpentPerMonth: 15,
    hourlyCost: 100,
    targetUpliftPercent: 5,
};

export interface RoiCalculatorResults {
    revenueAtRisk: number;
    upliftValue: number;
    timeSavingsValue: number;
    combinedPotentialValue: number;
}

export function calculateRoi(inputs: RoiCalculatorInputs): RoiCalculatorResults {
    const revenueAtRisk = inputs.leadsPerMonth * (1 - inputs.closeRatePercent / 100) * inputs.avgDealValue;
    const upliftValue = inputs.leadsPerMonth * (inputs.targetUpliftPercent / 100) * inputs.avgDealValue;
    const timeSavingsValue = inputs.hoursSpentPerMonth * inputs.hourlyCost;
    const combinedPotentialValue = upliftValue + timeSavingsValue;

    return { revenueAtRisk, upliftValue, timeSavingsValue, combinedPotentialValue };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('he-IL').format(Math.round(value));
}

export interface RoiFaqItem {
    question: string;
    answer: string;
}

export const ROI_CALCULATOR_FAQS: RoiFaqItem[] = [
    {
        question: 'איך המחשבון מעריך את עלות הזמן האבוד בעסק?',
        answer: 'החישוב מתבסס על מכפלת שעות העבודה החודשיות המושקעות במשימות ידניות שגרתיות (תיאומי פגישות, שליחת תזכורות ידניות, העתקת פרטי לידים ועדכוני אקסל) בעלות שעת העבודה שהוזנה. מדובר בעלות כספית ישירה של שכר המשולם על משימות פקידותיות הניתנות לאוטומציה, במקום עבודה מקצועית וסגירת עסקאות.'
    },
    {
        question: 'מה נחשב שיפור יעד ריאלי באחוז הסגירה?',
        answer: 'בעסקים שבהם עדיין לא מוטמע פייפליין מסודר או שהמענה ללידים נמשך שעות ארוכות, שיפור של 3% עד 7% בשיעור הסגירה הוא יעד שמרני וריאלי לחלוטין. השיפור מושג בעיקר מקיצור זמן התגובה הראשוני ל-5 דקות, עצירת בריחת שיחות שלא נענו, ומעקב פולואפ עקבי אחרי הצעות מחיר.'
    },
    {
        question: 'למה המחשבון מפריד בין "כסף שהולך לאיבוד" לבין "הפוטנציאל המשולב"?',
        answer: 'כסף שהולך לאיבוד (Revenue at Risk) מייצג את סך כל הפוטנציאל של הלידים שלא נרכשו כיום. לעומת זאת, הפוטנציאל המשולב מציג תרחיש שמרני ומעשי של שיפור הדרגתי: מה שווה תוספת מוגדרת באחוזי הסגירה לצד השעות שנחסכות. ההפרדה שומרת על תחזית אמינה, שקופה ומבוססת מציאות.'
    },
    {
        question: 'למה לא כדאי פשוט להגדיל את תקציב הפרסום כדי לפצות על ירידה בהכנסות?',
        answer: 'הזרמת לידים נוספים למשפך שבו לידים נופלים בין הכיסאות רק מגדילה את עלויות השיווק ומחריפה את העומס על הצוות. הדרך הרווחית ביותר היא קודם לסתום את חורי הדליפה בתהליך הקיים: לשפר את זמן המענה, לייצר פולואפ שיטתי ולשמור על הקשר הלקוחות. רק לאחר שהסיסטם עובד, הגדלת התקציב מייצרת תשואה מקסימלית.'
    },
    {
        question: 'איך מערכת CRM מסייעת להפוך את הפוטנציאל החודשי למציאות?',
        answer: 'מערכת CRM מקצרת את זמן המענה באמצעות שליחת WhatsApp אוטומטי לשיחות שלא נענו, מציגה לוח פייפליין חזותי לכל שלבי העסקה, מתזמנת משימות פולואפ להצעות מחיר ומבטלת עבודה ידנית כפולה. בכך היא מחברת בין שחרור שעות עבודה של הצוות לבין הגדלת שיעורי הסגירה בפועל.'
    }
];
