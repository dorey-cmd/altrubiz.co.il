import React from 'react';
import { LegalPageLayout, LegalSection } from './LegalPageLayout';
import { IL_MARKET } from '../../siteos';
import { openCookieSettings } from '../../lib/consent';

interface CookiePolicyPageProps {
    onNavigate: (path: string) => void;
}

const LAST_UPDATED = '17 בספטמבר 2026';

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
    return (
        <LegalPageLayout
            eyebrow="עוגיות (Cookies)"
            title="מדיניות שימוש בקובצי Cookie"
            lastUpdated={LAST_UPDATED}
            onNavigate={onNavigate}
            breadcrumbs={[
                { name: 'דף הבית', path: '/' },
                { name: 'מדיניות Cookies', path: '/cookie-policy' },
            ]}
        >
            <LegalSection title="1. מה זו עוגיה (Cookie)">
                <p>
                    עוגיה היא קובץ טקסט קטן שנשמר בדפדפן שלכם בעת גלישה באתר, ומשמש לזכור מידע על הביקור שלכם - כמו העדפות, או האם ביקרתם
                    באתר בעבר.
                </p>
            </LegalSection>

            <LegalSection title="2. אילו עוגיות וכלים פועלים באתר">
                <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-xs">
                                <th className="text-right py-2 pr-1 font-bold">כלי</th>
                                <th className="text-right py-2 font-bold">סוג</th>
                                <th className="text-right py-2 font-bold">מטרה</th>
                                <th className="text-right py-2 font-bold">טעינה</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">שמירת הסכמת Cookies</td>
                                <td className="py-2.5 text-slate-600">חיונית</td>
                                <td className="py-2.5 text-slate-600">שמירת הבחירה שלכם בבאנר ה-Cookies, כדי לא להציג אותו בכל ביקור</td>
                                <td className="py-2.5 text-slate-600">תמיד</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">Google Analytics 4</td>
                                <td className="py-2.5 text-slate-600">אנליטיקה</td>
                                <td className="py-2.5 text-slate-600">מדידת כניסות, עמודים נצפים ומקורות תנועה</td>
                                <td className="py-2.5 text-slate-600">בכפוף להסכמה</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">Microsoft Clarity</td>
                                <td className="py-2.5 text-slate-600">אנליטיקה</td>
                                <td className="py-2.5 text-slate-600">מפות חום והקלטות גלישה אנונימיות להבנת חוויית המשתמש</td>
                                <td className="py-2.5 text-slate-600">בכפוף להסכמה</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">Google Fonts</td>
                                <td className="py-2.5 text-slate-600">תפעולית</td>
                                <td className="py-2.5 text-slate-600">טעינת גופנים מעוצבים לאתר משרתי Google (לא עוגיית מעקב, אך כרוכה בפנייה לשרת חיצוני)</td>
                                <td className="py-2.5 text-slate-600">תמיד</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">טופס יצירת קשר ויומן פגישות</td>
                                <td className="py-2.5 text-slate-600">תפעולית</td>
                                <td className="py-2.5 text-slate-600">הטמעת טופס יצירת הקשר ויומן הפגישות (iframe), עשוי להגדיר עוגיות משלו</td>
                                <td className="py-2.5 text-slate-600">בעת פתיחת הטופס/יומן</td>
                            </tr>
                            <tr>
                                <td className="py-2.5 pr-1 font-semibold">Invoice4U</td>
                                <td className="py-2.5 text-slate-600">תפעולית</td>
                                <td className="py-2.5 text-slate-600">עמוד סליקת תשלום חיצוני, עשוי להגדיר עוגיות משלו</td>
                                <td className="py-2.5 text-slate-600">בעת מעבר לתשלום</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500">
                    הטבלה משקפת את הכלים המוטמעים בקוד האתר של אלטרוביז. עמודי צד שלישי שנפתחים מתוכו (טופס יצירת הקשר, יומן הפגישות ומסך
                    הסליקה של Invoice4U) הם אתרים נפרדים, ועל הקובצי Cookie שהם מגדירים חלה מדיניות הפרטיות של אותו ספק ולא זו של אלטרוביז.
                </p>
            </LegalSection>

            <LegalSection title="3. כלי אנליטיקה ומעקב - הרחבה">
                <p>
                    Google Analytics 4 ו-Microsoft Clarity הם הכלים היחידים באתר שנועדו למעקב אחר התנהגות גולשים, והם נטענים <strong>אך ורק</strong>{' '}
                    לאחר שאישרתם זאת מפורשות בבאנר ה-Cookies. אם תבחרו באפשרות &quot;רק חיוניים&quot;, כלים אלו לא ייטענו כלל בדפדפן שלכם, ולא
                    יאספו נתוני שימוש או הקלטות גלישה.
                </p>
            </LegalSection>

            <LegalSection title="4. איך לשנות את ההסכמה שלכם">
                <p>
                    ניתן לשנות את בחירתכם בכל עת דרך הכפתור הבא, שיפתח מחדש את באנר ניהול ה-Cookies:
                </p>
                <button
                    type="button"
                    onClick={() => openCookieSettings()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    פתיחת הגדרות Cookies
                </button>
                <p>
                    לחלופין, ניתן לחסום או למחוק עוגיות בכל עת דרך הגדרות הדפדפן שלכם - אם כי חסימה מוחלטת עלולה לפגוע בתפקוד חלק מהאתר.
                </p>
            </LegalSection>

            <LegalSection title="5. יצירת קשר">
                <p>
                    לשאלות בנושא מדיניות זו ניתן לפנות בדוא&quot;ל{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
};
