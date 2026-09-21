import React from 'react';
import { LegalPageLayout, LegalSection } from './LegalPageLayout';
import { IL_MARKET } from '../../siteos';
import { handleClientNavClick } from '../common/InternalLink';

interface PrivacyPolicyPageProps {
    onNavigate: (path: string) => void;
}

const LAST_UPDATED = '17 בספטמבר 2026';

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
    return (
        <LegalPageLayout
            eyebrow="פרטיות"
            title="מדיניות פרטיות"
            lastUpdated={LAST_UPDATED}
            onNavigate={onNavigate}
            breadcrumbs={[
                { name: 'דף הבית', path: '/' },
                { name: 'מדיניות פרטיות', path: '/privacy-policy' },
            ]}
        >
            <LegalSection title="1. כללי">
                <p>
                    מדיניות פרטיות זו חלה על אתר האינטרנט השיווקי-מידעי שבכתובת {IL_MARKET.domain.replace('https://', '')} ("<strong>האתר</strong>"),
                    המופעל על ידי {IL_MARKET.legalEntity.name} ("<strong>אלטרוביז</strong>", "<strong>אנחנו</strong>"). המדיניות מסבירה איזה מידע נאסף
                    ממבקרים באתר, לשם מה, עם מי הוא עשוי להיות משותף וכיצד ניתן לממש זכויות ביחס אליו.
                </p>
                <p>
                    מדיניות זו אינה חלה על מערכת ה-CRM עצמה (השירות המופעל בכתובת app.altrubiz.com) ועל המידע שלקוחות עסקיים
                    של אלטרוביז מזינים ומנהלים בתוכה על הלקוחות והלידים שלהם.
                </p>
            </LegalSection>

            <LegalSection title="2. מי אנחנו ומי אחראי על המידע">
                <p>
                    בעל השליטה במידע הנאסף באתר הוא {IL_MARKET.legalEntity.name} ({(IL_MARKET.legalEntity.alternateName || []).join(' / ')}).
                </p>
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>דוא&quot;ל ליצירת קשר: <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a></li>
                    <li>טלפון: {IL_MARKET.contactChannels.phone}</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. איזה מידע אנחנו אוספים">
                <p>אנחנו אוספים את סוגי המידע הבאים במסגרת השימוש באתר:</p>
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>
                        <strong>פרטים שאתם משאירים ביוזמתכם:</strong> שם, טלפון, כתובת דוא&quot;ל, ופרטים נוספים שתבחרו למסור בטופס יצירת הקשר,
                        בטופס תיאום הפגישה, בשיחת WhatsApp, או בעת רכישת מנוי.
                    </li>
                    <li>
                        <strong>מידע טכני ושימוש באתר:</strong> כתובת IP, סוג דפדפן ומכשיר, עמודים שנצפו, זמן שהייה ומקור ההגעה לאתר -
                        נאסף באופן אוטומטי כחלק מתפעול רגיל של האתר, ובאמצעות כלי אנליטיקה (ראו סעיף 5) בכפוף להסכמתכם.
                    </li>
                    <li>
                        <strong>מידע תשלום:</strong> פרטי כרטיס האשראי והתשלום עצמם מוזנים ומעובדים ישירות מול חברת הסליקה Invoice4U ואינם
                        עוברים דרך שרתי אלטרוביז ואינם נשמרים אצלנו.
                    </li>
                    <li>
                        <strong>עוגיות (Cookies):</strong> ראו את <a href="/cookie-policy" onClick={(e) => handleClientNavClick(e, '/cookie-policy', onNavigate)} className="text-primary font-semibold hover:underline">מדיניות ה-Cookies</a> המלאה שלנו.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="4. לשם מה נאסף המידע">
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>מענה לפניות, תיאום פגישות והכנת הצעות מחיר.</li>
                    <li>אספקת השירות שנרכש (מנוי ל-AltruBiz CRM) והפעלת תהליך החיוב מולו.</li>
                    <li>שיפור האתר והבנת אופן השימוש בו - רק בכפוף להסכמה לעוגיות אנליטיקה.</li>
                    <li>
                        דיוור ופניות שיווקיות - רק בהתאם להסכמה שניתנה, ובהתאם לדרישות סעיף 30א לחוק התקשורת (בזק ושידורים), התשמ&quot;ב-1982
                        (חוק הספאם), לרבות אפשרות הסרה מכל פנייה שיווקית.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="5. עם מי המידע עשוי להיות משותף">
                <p>
                    אלטרוביז אינה מוכרת מידע אישי לצדדים שלישיים. לצורך הפעלת האתר והשירות, מידע מסוים מועבר לספקי שירות הפועלים עבורנו:
                </p>
                <ul className="list-disc pr-5 space-y-1.5">
                    <li><strong>ספק תשתית לטפסים, יומן פגישות ותקשורת אוטומטית</strong> - מפעיל את טפסי יצירת הקשר, יומן הפגישות והאינטגרציה עם WhatsApp באתר.</li>
                    <li><strong>Google (Google Analytics 4, Google Fonts)</strong> - ניתוח שימוש באתר (בכפוף להסכמה) וטעינת גופנים.</li>
                    <li><strong>Microsoft (Clarity)</strong> - ניתוח התנהגות גולשים, כולל הקלטות מסך אנונימיות של גלישה באתר (בכפוף להסכמה).</li>
                    <li><strong>Invoice4U</strong> - סליקת תשלומים והפקת חשבוניות עבור מנויי AltruBiz CRM.</li>
                    <li><strong>Meta / WhatsApp</strong> - כאשר אתם פונים אלינו דרך WhatsApp, ההתכתבות מתבצעת בפלטפורמת WhatsApp בכפוף למדיניות הפרטיות שלה.</li>
                </ul>
                <p>
                    חלק מהספקים הללו הם חברות בינלאומיות שעשויות לאחסן מידע גם מחוץ לישראל (ארה&quot;ב ואירופה בעיקר), בהתאם לתקנות הגנת
                    הפרטיות (העברת מידע אל מחוץ לגבולות המדינה), התשס&quot;א-2001.
                </p>
            </LegalSection>

            <LegalSection title="6. תקופת שמירת המידע">
                <p>
                    אנו שומרים מידע אישי רק לפרק הזמן הנדרש לצורך המטרה שלשמה נאסף, או ככל שנדרש על פי דין. לדוגמה, מסמכי הנהלת חשבונות
                    וחשבוניות נשמרים בהתאם לדרישות פקודת מס הכנסה ותקנות ניהול פנקסי חשבונות (בדרך כלל 7 שנים).
                </p>
            </LegalSection>

            <LegalSection title="7. הזכויות שלכם">
                <p>בהתאם לסעיפים 13-14 לחוק הגנת הפרטיות, התשמ&quot;א-1981, עומדות לכם הזכויות הבאות ביחס למידע שנאסף עליכם:</p>
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>זכות לעיין במידע שנשמר עליכם.</li>
                    <li>זכות לבקש תיקון או מחיקה של מידע שגוי, לא שלם או לא מעודכן.</li>
                </ul>
                <p>
                    לצורך מימוש זכויות אלו ניתן לפנות אלינו בכתובת{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>.
                </p>
            </LegalSection>

            <LegalSection title="8. אבטחת מידע">
                <p>
                    אנו נוקטים אמצעי אבטחה סבירים כדי להגן על המידע הנאסף מפני גישה, שימוש או חשיפה בלתי מורשים, בהתאם לתקנות הגנת הפרטיות
                    (אבטחת מידע), התשע&quot;ז-2017. עם זאת, אין אפשרות להבטיח הגנה מוחלטת מפני כל פגיעה, ואיננו יכולים להתחייב כי מידע המועבר
                    דרך האינטרנט חסין באופן מוחלט מפני גישה בלתי מורשית.
                </p>
            </LegalSection>

            <LegalSection title="9. קטינים">
                <p>
                    האתר מיועד לבעלי עסקים ולאנשי מקצוע בגירים, ואינו מיועד לשימוש על ידי קטינים. איננו אוספים ביודעין מידע מקטינים מתחת לגיל 18.
                </p>
            </LegalSection>

            <LegalSection title="10. שינויים במדיניות זו">
                <p>
                    אנו עשויים לעדכן מדיניות זו מעת לעת. גרסה מעודכנת תפורסם בעמוד זה עם תאריך עדכון חדש. המשך השימוש באתר לאחר פרסום
                    עדכון מהווה הסכמה לתנאים המעודכנים.
                </p>
            </LegalSection>

            <LegalSection title="11. יצירת קשר">
                <p>
                    לשאלות או בקשות בנושא פרטיות ניתן לפנות אלינו בדוא&quot;ל{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>{' '}
                    או בטלפון {IL_MARKET.contactChannels.phone}.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
};
