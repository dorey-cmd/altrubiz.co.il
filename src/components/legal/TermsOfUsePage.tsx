import React from 'react';
import { LegalPageLayout, LegalSection } from './LegalPageLayout';
import { IL_MARKET } from '../../siteos';

interface TermsOfUsePageProps {
    onNavigate: (path: string) => void;
}

const LAST_UPDATED = '17 בספטמבר 2026';

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onNavigate }) => {
    return (
        <LegalPageLayout
            eyebrow="תנאי שימוש"
            title="תנאי שימוש"
            lastUpdated={LAST_UPDATED}
            onNavigate={onNavigate}
            breadcrumbs={[
                { name: 'דף הבית', path: '/' },
                { name: 'תנאי שימוש', path: '/terms-of-use' },
            ]}
        >
            <LegalSection title="1. כללי והסכמה לתנאים">
                <p>
                    תנאי שימוש אלו חלים על הגלישה והשימוש באתר {IL_MARKET.domain.replace('https://', '')} ("<strong>האתר</strong>"), המופעל
                    על ידי {IL_MARKET.legalEntity.name}. גלישה ושימוש באתר מהווים הסכמה לתנאים אלו. אם אינכם מסכימים לתנאי השימוש, אנא הימנעו
                    משימוש באתר.
                </p>
                <p>
                    תנאים אלו מסדירים את השימוש <strong>באתר השיווקי-מידעי</strong> בלבד ולא את השימוש במערכת ה-CRM עצמה (לאחר רכישת מנוי,
                    בכתובת app.altrubiz.com).
                </p>
            </LegalSection>

            <LegalSection title="2. השירות המוצג באתר">
                <p>
                    האתר מציג מידע שיווקי על מוצר ה-CRM של אלטרוביז, מאפשר תיאום פגישות, השארת פרטים ורכישת מנוי. האתר אינו מוכר מוצרים
                    פיזיים, ואין באתר תהליך משלוח פיזי או מדיניות החזרת מוצרים - שכן מדובר בשירות תוכנה (SaaS) בלבד.
                </p>
            </LegalSection>

            <LegalSection title="3. קניין רוחני">
                <p>
                    כל הזכויות בתכני האתר - לרבות טקסטים, עיצוב, לוגו, איורים וקוד - שייכות לאלטרוביז או לצדדים שלישיים שהעניקו לה רישיון
                    שימוש, ואין להעתיק, לשכפל או להפיץ אותם ללא אישור מראש ובכתב.
                </p>
                <p>
                    סימני המסחר והלוגואים של צדדים שלישיים המוצגים באתר (לרבות WhatsApp, Meta, Facebook, Instagram ו-Google) שייכים לבעליהם
                    בלבד, ומוצגים אך ורק לצורך תיאור עובדתי של יכולות אינטגרציה עם אותם שירותים - ואין בהצגתם כדי להעיד על מיזוג, שיתוף פעולה
                    רשמי או מתן חסות מצד אותם גופים.
                </p>
            </LegalSection>

            <LegalSection title="4. הזמנת מנוי, מחיר ותשלום">
                <p>
                    המחירים המוצגים באתר עבור מסלולי המנוי הם לצורכי המחשה ואינם מהווים הצעה מחייבת - המחיר הסופי, תנאי התשלום ומועד החיוב
                    ייקבעו במסך הסליקה מול חברת הסליקה Invoice4U בעת ביצוע ההזמנה בפועל.
                </p>
            </LegalSection>

            <LegalSection title="5. ביטול עסקה">
                <p>
                    ניתן לבקש ביטול מנוי בכל עת בפנייה לצוות התמיכה בכתובת{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>.
                </p>
            </LegalSection>

            <LegalSection title="6. שימוש מותר באתר">
                <ul className="list-disc pr-5 space-y-1.5">
                    <li>חל איסור לעשות שימוש באתר לכל מטרה בלתי חוקית או למטרה הפוגעת באלטרוביז או בצד שלישי כלשהו.</li>
                    <li>חל איסור לנסות לפרוץ, לשבש או להעמיס את מערכות האתר, או לאסוף מידע מהאתר באמצעים אוטומטיים ללא רשות.</li>
                </ul>
            </LegalSection>

            <LegalSection title="7. הגבלת אחריות">
                <p>
                    כלים אינטראקטיביים באתר, לרבות מחשבון ה-ROI, מציגים הערכות בלבד המבוססות על נתונים שהוזנו על ידי המשתמש והנחות עבודה
                    כלליות. אין בהם משום התחייבות, הבטחה או ייעוץ עסקי, פיננסי או מקצועי, ואין להסתמך עליהם כתחליף לבדיקה עצמאית.
                </p>
                <p>
                    האתר והשירותים המוצגים בו ניתנים כמות שהם (&quot;AS IS&quot;), ואלטרוביז אינה מתחייבת שהאתר יהיה זמין ללא הפרעה או נקי מטעויות.
                </p>
            </LegalSection>

            <LegalSection title="8. שינויים בתנאי השימוש">
                <p>
                    אנו רשאים לעדכן תנאים אלו מעת לעת. המשך השימוש באתר לאחר פרסום עדכון מהווה הסכמה לתנאים המעודכנים.
                </p>
            </LegalSection>

            <LegalSection title="9. יצירת קשר">
                <p>
                    לשאלות בנוגע לתנאי שימוש אלו ניתן לפנות בדוא&quot;ל{' '}
                    <a href={`mailto:${IL_MARKET.contactChannels.email}`} className="text-primary font-semibold hover:underline">{IL_MARKET.contactChannels.email}</a>{' '}
                    או בטלפון {IL_MARKET.contactChannels.phone}.
                </p>
            </LegalSection>
        </LegalPageLayout>
    );
};
