import React from 'react';
import { LegalPageLayout, LegalSection } from './LegalPageLayout';
import { IL_MARKET } from '../../siteos';

interface AccessibilityStatementPageProps {
    onNavigate: (path: string) => void;
}

const LAST_UPDATED = '17 בספטמבר 2026';

/**
 * Real, fact-based accessibility statement (not a placeholder). Every claim
 * here reflects work actually implemented and verified in this SiteOS
 * accessibility hardening pass -- see scripts/validate-accessibility.cjs for
 * the automated test suite referenced below. Follows the exact same
 * governed static-route pattern as PrivacyPolicyPage / TermsOfUsePage /
 * CookiePolicyPage (LegalPageLayout, routes.ts STATIC_ROUTES_REGISTRY,
 * scripts/prerender-pages.cjs).
 */
export const AccessibilityStatementPage: React.FC<AccessibilityStatementPageProps> = ({ onNavigate }) => {
    return (
        <LegalPageLayout
            eyebrow="נגישות"
            title="הצהרת נגישות"
            lastUpdated={LAST_UPDATED}
            onNavigate={onNavigate}
            breadcrumbs={[
                { name: 'דף הבית', path: '/' },
                { name: 'הצהרת נגישות', path: '/accessibility-statement' },
            ]}
        >
            <LegalSection title="1. מחויבות לנגישות">
                <p>
                    {IL_MARKET.legalEntity.name} (אלטרוביז) רואה חשיבות רבה בהנגשת האתר שלה לכלל הציבור, לרבות אנשים עם מוגבלויות, ופועלת
                    להנגיש את האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, ולתקנות שהותקנו מכוחו.
                </p>
            </LegalSection>

            <LegalSection title="2. התקן והרמה המחייבים">
                <p>
                    התאמות הנגישות באתר בוצעו תוך התייחסות לדרישות תקן ישראלי ת&quot;י 5568 חלק 1 (קווים מנחים לנגישות תכנים באינטרנט), המבוסס
                    על הנחיות WCAG (Web Content Accessibility Guidelines) של קונסורציום W3C ברמת AA - הרמה המחייבת בישראל. מעבר לכך, ובאופן
                    יזום, אימצנו כיעד הנדסי פנימי נוסף גם קריטריונים מגרסת WCAG 2.2 ברמת AA, הכוללת דרישות עדכניות יותר (כגון גודל מזערי
                    ליעדי לחיצה, ומיקום מוקד מקלדת שאינו מוסתר).
                </p>
            </LegalSection>

            <LegalSection title="3. התאמות הנגישות שבוצעו באתר">
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>קישור &quot;דילוג לתוכן הראשי&quot; בתחילת כל עמוד, הפעיל גם לאחר ניווט פנימי באתר (SPA) ולא רק בטעינה ראשונית.</li>
                    <li>מבנה סמנטי של אזורי עמוד (כותרת עליונה, ניווט, תוכן ראשי, כותרת תחתונה) והעברת מוקד המקלדת אל תוכן העמוד החדש בכל מעבר דף.</li>
                    <li>תמיכה מלאה בניווט מקלדת (Tab / Shift+Tab / Enter / Escape) בכל התפריטים, הטפסים, המחוונים (Sliders) והכפתורים.</li>
                    <li>חלוניות (Modals) של יצירת קשר, קביעת פגישה ותמחור, וכן תפריטי הניווט הנפתחים במובייל - כוללים ניהול מוקד: העברת המוקד לתוך החלונית עם פתיחתה, כליאת המוקד (Focus Trap) בתוכה בזמן שהיא פתוחה, והחזרת המוקד לרכיב המפעיל עם סגירתה.</li>
                    <li>שם נגיש (Accessible Name) תקין לכל כפתור המכיל אייקון בלבד, ותוויות (labels) מקושרות פורמלית לכל שדה קלט.</li>
                    <li>ערכי טווח (aria-valuetext) קריאים בעברית עבור מחווני מספרים (Sliders) שאינם ליניאריים, כגון מחשבון ה-ROI.</li>
                    <li>יחס ניגודיות טקסט משופר מול הרקע במספר רכיבים באתר, וטבעת מוקד (focus ring) גלויה ועקבית על רכיבים אינטראקטיביים.</li>
                    <li>תמיכה בהעדפת &quot;הפחתת תנועה&quot; (prefers-reduced-motion) של מערכת ההפעלה: אפקטים ויזואליים תחושתיים בלבד (כגון אנימציית רקע עוקבת עכבר) מושבתים כאשר המשתמש ביקש זאת בהגדרות הדפדפן/המערכת.</li>
                    <li>גודל יעד לחיצה מינימלי (24x24 פיקסלים) עבור כפתורי אייקון קטנים, כגון בקרות ההוספה/הפחתה במחשבון ה-ROI.</li>
                    <li>כל התמונות באתר (כולל תמונות נושא למאמרים) כוללות טקסט חלופי (alt) המתאר את ההקשר העסקי של התמונה.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. כיצד נבדקה הנגישות">
                <p>
                    האתר נבדק באמצעות כלי בדיקה אוטומטיים (ספריית axe-core בשילוב Playwright, הרצה על כל תבניות העמודים המרכזיות באתר) וכן
                    באמצעות בדיקה ידנית של מבנה עץ הנגישות (Accessibility Tree), ניווט מקלדת מלא, והתאמת תצוגה ברוחב 320 פיקסלים ובתקריב
                    (Zoom) של 200%.
                </p>
                <p>
                    <strong>חשוב לציין בשקיפות:</strong> נכון למועד עדכון הצהרה זו, לא בוצעה בדיקה ידנית עם תוכנת קורא מסך אמיתית (כגון NVDA,
                    JAWS או VoiceOver) על ידי משתמש אנושי. ממצאי כלי הבדיקה האוטומטיים ובדיקת עץ הנגישות מספקים רמת ביטחון גבוהה אך אינם
                    תחליף מלא לבדיקת קורא מסך אנושית, ואנו רואים בכך צעד המשך רצוי.
                </p>
            </LegalSection>

            <LegalSection title="5. מגבלות ידועות">
                <p>
                    טופס יצירת הקשר ולוח קביעת הפגישות באתר מוטמעים באמצעות iframe מספק חיצוני (GoHighLevel). אין באפשרותנו לשלוט או לשנות
                    את הקוד הפנימי של אותם טפסים חיצוניים. פעלנו לוודא שלכל iframe כזה יש כותרת (title) מדויקת ותיאורית, ושניתן להיכנס
                    ולצאת ממנו במקלדת בלבד, אך אין ביכולתנו להתחייב לעמידה מלאה בתקן עבור התוכן הפנימי של אותם טפסים חיצוניים.
                </p>
            </LegalSection>

            <LegalSection title="6. פנייה בנושא נגישות">
                <p>
                    נתקלתם בבעיית נגישות באתר, או שיש לכם הצעה לשיפור? נשמח שתפנו אלינו בדוא&quot;ל{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>{' '}
                    ונטפל בפנייה בהקדם האפשרי.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
};
