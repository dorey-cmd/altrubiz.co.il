/**
 * Structured Data (Schema.org JSON-LD) and Entity Graph Generator for AltruBiz
 * Designed for SEO, AEO, and GEO (Generative Engine Optimization) with stable @id references.
 */

export const BASE_URL = 'https://altrubiz.co.il';
export const LOGO_URL = 'https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png';

export const ORGANIZATION_ENTITY = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "AltruBiz",
    "alternateName": ["אלטרוביז", "AltruBiz CRM"],
    "url": BASE_URL,
    "logo": {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        "url": LOGO_URL,
        "caption": "לוגו אלטרוביז CRM"
    },
    "description": "חברת טכנולוגיה ישראלית המספקת מערכת CRM מתקדמת, פתרונות אוטומציה עסקית, אינטגרציות WhatsApp ובוטים חכמים לעסקים דיגיטליים.",
    "email": "support@altrubiz.co.il",
    "telephone": "+972-54-435-0000",
    "areaServed": {
        "@type": "Country",
        "name": "Israel"
    },
    "knowsLanguage": ["he", "en"],
    "knowsAbout": [
        "CRM Software",
        "WhatsApp Business Automation",
        "Marketing Automation",
        "AI Chatbots",
        "Lead Management",
        "Meta Business Messaging Policy"
    ],
    "sameAs": [
        "https://app.altrubiz.com/",
        "https://mkt.altrubiz.co.il/terms"
    ],
    "contactPoint": [
        {
            "@type": "ContactPoint",
            "telephone": "+972-54-435-0000",
            "contactType": "customer support",
            "availableLanguage": ["Hebrew", "English"],
            "url": "https://wa.me/972544350000"
        }
    ]
};

export const WEBSITE_ENTITY = {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": BASE_URL,
    "name": "AltruBiz CRM",
    "description": "להכניס את השיטה לסיסטם - מערכת CRM, אוטומציה ובינה מלאכותית לעסקים",
    "inLanguage": "he-IL",
    "publisher": {
        "@id": `${BASE_URL}/#organization`
    }
};

export const SOFTWARE_APPLICATION_ENTITY = {
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#software`,
    "name": "AltruBiz CRM",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, Cloud",
    "description": "מערכת CRM מתקדמת לניהול לידים, אוטומציה עסקית, חיבורי WhatsApp ובוטים חכמים ללא הגבלת משתמשים ורשומות.",
    "url": BASE_URL,
    "publisher": {
        "@id": `${BASE_URL}/#organization`
    },
    "featureList": [
        "משתמשים ורשומות ללא הגבלה",
        "ניהול לידים ופייפליין מכירות חזותי",
        "תקשורת רב-ערוצית (וואטסאפ, SMS, אימייל, פייסבוק, אינסטגרם)",
        "בוטים מבוססי בינה מלאכותית לקביעת פגישות ומענה סביב השעון",
        "משפכים שיווקיים ודפי נחיתה",
        "אינטגרציות Webhooks, API ומערכות חיצוניות"
    ],
    "offers": [
        {
            "@type": "Offer",
            "name": "מסלול Pro",
            "price": "297",
            "priceCurrency": "ILS",
            "priceValidUntil": "2026-12-31",
            "description": "תשתית CRM מלאה, משתמשים ללא הגבלה, רשומות ללא הגבלה, יומנים וניהול לידים."
        },
        {
            "@type": "Offer",
            "name": "מסלול Smart",
            "price": "497",
            "priceCurrency": "ILS",
            "priceValidUntil": "2026-12-31",
            "description": "כולל אינטגרציית WhatsApp, פאנלים שיווקיים, קליטת לידים מפייסבוק ואוטומציות סושיאל."
        },
        {
            "@type": "Offer",
            "name": "מסלול Power",
            "price": "747",
            "priceCurrency": "ILS",
            "priceValidUntil": "2026-12-31",
            "description": "כולל בוטים מבוססי AI, קביעת פגישות אוטומטית בוואטסאפ, בונה אתרים ב-AI ו-API מתקדם."
        }
    ]
};

export interface FAQItem {
    question: string;
    answer: string;
}

export const HOMEPAGE_FAQS: FAQItem[] = [
    {
        question: "מה זה AltruBiz CRM ובשביל מי המערכת מתאימה?",
        answer: "AltruBiz CRM היא מערכת תוכנה בענן המרכזת את כל הפעילות העסקית: ניהול לידים, מעקב מכירות, אוטומציות תקשורת בוואטסאפ ובמייל, ובוטים חכמים. המערכת מיועדת לעסקים בישראל, יזמים, נותני שירותים, סוכנויות ומוקדי מכירות ושירות שרוצים למנוע אובדן לידים ולייצר תהליך עבודה אחיד ומדויק."
    },
    {
        question: "איך עובד החיבור לוואטסאפ (WhatsApp) בתוך המערכת?",
        answer: "המערכת מתחברת לוואטסאפ ומאפשרת לשלוח הודעות תגובה מיידיות לנרשמים, לתזמן הודעות מעקב, לנהל שיחות מרוכזות מממשק אחד, ולהפעיל בוט AI שמסוגל לענות על שאלות נפוצות ולתאם פגישות ביומן באופן אוטומטי בהתאם לכללי הדיוור ומדיניות Meta."
    },
    {
        question: "האם יש הגבלה על כמות המשתמשים או הרשומות בחשבון?",
        answer: "לא! כל המסלולים באלטרוביז (Pro, Smart, Power) כוללים משתמשים ללא הגבלה ורשומות ללא הגבלה. אין צורך לשלם תוספת מחיר עבור כל עובד או משתמש חדש שמצטרף לצוות."
    },
    {
        question: "מה ההבדל העיקרי בין המסלולים Pro, Smart ו-Power?",
        answer: "מסלול Pro מעניק תשתית CRM מעולה לניהול לקוחות, לידים ויומנים; מסלול Smart מוסיף אוטומציות שיווקיות, אינטגרציית וואטסאפ, משפכים (Funnels) וקליטת לידים מפייסבוק; ומסלול Power כולל את יכולות הבינה המלאכותית (AI) המתקדמות - בוטים חכמים, קביעת פגישות ביומן דרך וואטסאפ, בונה אתרים ב-AI וחיבורי API."
    },
    {
        question: "האם ניתן לקלוט לידים מפייסבוק, טיקטוק, גוגל ודפי נחיתה באופן אוטומטי?",
        answer: "כן. אלטרוביז מתממשקת באופן מובנה לטפסי לידים של פייסבוק, אינסטגרם, גוגל, ודפי נחיתה. כל ליד שנרשם נכנס ישירות למערכת וניתן להפעיל טריגר מיידי ששולח אליו וואטסאפ או מייל ומעדכן את צוות המכירות."
    },
    {
        question: "איך בוט ה-AI של אלטרוביז קובע פגישות ביומן באופן עצמאי?",
        answer: "בוט ה-AI מקושר ליומן הפגישות של העסק ומתוכנת להבין את השירותים והזמינות שלו. כאשר ליד מתעניין בפגישה, הבוט בודק חלונות פנויים, מציע שעות לבחירה בשיחת וואטסאפ טבעית, ומשריין את הפגישה ביומן תוך שליחת תזכורות אוטומטיות."
    }
];

export const ARTICLE_WHATSAPP_FAQS: FAQItem[] = [
    {
        question: "האם מותר לשלוח הודעת WhatsApp למי שהשאירו פרטים בטופס באתר?",
        answer: "כן, בתנאי שהטופס ציין בבירור שהפנייה תיעשה באמצעות WhatsApp והלקוח נתן לכך הסכמה מתאימה. ההודעה חייבת להיות קשורה ישירות לנושא שלשמו הושארו הפרטים (למשל: 'תודה שפנית בנוגע ל-X, איך נוכל לעזור?')."
    },
    {
        question: "מהו חלון 24 השעות של Meta ומתי חובה להשתמש בתבנית מאושרת?",
        answer: "כאשר לקוח יוזם פנייה לעסק, נפתח חלון שירות של 24 שעות שבו העסק רשאי להשיב באופן חופשי ללא תבנית. ברגע שחלפו 24 שעות מההודעה האחרונה של הלקוח, או כאשר העסק הוא זה שיוזם את השיחה ראשון, חובה להשתמש בתבנית הודעה מאושרת (Message Template) על ידי Meta."
    },
    {
        question: "מה גורם לחסימה או הורדת דירוג של מספר WhatsApp Business?",
        answer: "הסיבות הנפוצות ביותר הן: דיווחים של נמענים כספאם, שיעור חסימות גבוה, שליחת הודעות ללא הסכמה מוקדמת, דיוור לרשימות תפוצה ישנות או קרות, ואי-כיבוד בקשות הסרה. מספר דיווחים בודדים עלול להוריד את דירוג האיכות של המספר ולהוביל להשעיה."
    },
    {
        question: "האם מותר לדוור לרשימת טלפונים ישנה שנמצאת ב-CRM כבר שנים?",
        answer: "מומלץ מאוד שלא. אם הלקוחות ברשימה אינם זוכרים את העסק או לא מצפים לקבל פנייה בוואטסאפ, הסיכוי לדיווח כספאם הוא גבוה ביותר. לפני דיוור לרשימה ישנה יש לבחון מחדש את תוקף ההסכמה והציפייה של הנמען."
    }
];

export function generateFAQSchema(faqs: FAQItem[]) {
    return {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}
