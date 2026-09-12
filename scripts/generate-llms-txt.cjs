/**
 * AltruBiz Automated llms.txt & llms-full.txt Generator
 * 
 * Generates concise navigation in public/llms.txt and comprehensive machine
 * context in public/llms-full.txt directly from canonical sources of truth.
 */

const fs = require('fs');
const path = require('path');
const routesLoader = require('./routes-loader.cjs');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');
const DOMAIN = 'https://altrubiz.co.il';

const articles = routesLoader.getArticles();
const hubs = routesLoader.getAllHubs();
const canonicalConcepts = routesLoader.CANONICAL_CONCEPTS;

// Filter approved, indexable public articles
const publicArticles = articles.filter(a => !a.noindex && !a.draft);

// 1. Generate public/llms.txt (Concise machine navigation map)
function generateLlmsTxt() {
    let out = `# AltruBiz CRM

> אלטרוביז (AltruBiz) היא חברת תוכנה ישראלית המפתחת פלטפורמת CRM, אוטומציה עסקית וריכוז ערוצי תקשורת (בדגש על WhatsApp Business API, Facebook, Instagram, SMS ואימייל) המותאמת לעסקים בישראל בעברית מלאה.

## ישויות מרכזיות (Entities)
- **שם החברה/ארגון:** AltruBiz (אלטרוביז)
- **מוצר מרכזי:** AltruBiz CRM (מערכת SaaS לניהול קשרי לקוחות, לידים ואוטומציות)
- **שוק יעד ושפה:** ישראל (עברית)
- **מסלולי שירות ורישוי:**
  - **Pro:** תשתית CRM, משתמשים ורשומות ללא הגבלה, יומנים וניהול לידים (החל מ-₪297 לחודש).
  - **Smart:** שיווק, משפכים, אוטומציות, ואינטגרציית WhatsApp (החל מ-₪497 לחודש).
  - **Power:** בינה מלאכותית, בוטים AI, מענה אוטומטי חכם וקביעת פגישות (החל מ-₪747 לחודש).
- **תחומי מומחיות:** אוטומציה עסקית ושיווקית, ניהול לידים, פייפליין מכירות, בוטים מבוססי AI, רגולציית דיוור בוואטסאפ (Meta Business Messaging Policy), תיבת תקשורת אחודה (Unified Inbox) ושירות לקוחות רב-ערוצי.

## מרכזי ידע מרכזיים (Knowledge Hubs)
`;

    for (const hub of hubs) {
        const cleanHubPath = hub.url;
        out += `- [${hub.shortLabel || hub.title}](${DOMAIN}${cleanHubPath}): ${hub.description}\n`;
    }

    out += `
## מושג ליבה עצמאי: אינבוקס אחוד ותקשורת רב-ערוצית (Unified Inbox / Omnichannel)
- [אינבוקס אחוד ותקשורת רב-ערוצית ב-CRM](${DOMAIN}/unified-inbox): ריכוז כל ערוצי התקשורת (WhatsApp, Instagram, Facebook Messenger, SMS, אימייל) לשיחה אחת רציפה עבור כל לקוח, במקום אחד מנוהל. הבחנה מהותית: אינבוקס אחוד אינו שם נרדף לוואטסאפ, אלא שכבת העל הרב-ערוצית המחברת את כל ערוצי השיח של העסק.
  - גרסת מכונה: ${DOMAIN}/unified-inbox.md

## מדריכים ומאמרים מקצועיים לקריאת מכונה (.md)
`;

    for (const article of publicArticles) {
        const cleanPath = (article.publicPath || article.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
        const mdUrl = `${DOMAIN}/${cleanPath}.md`;
        const canonicalHtml = `${DOMAIN}/${cleanPath}`;
        out += `- [${article.title}](${mdUrl}): ${article.description} (גרסת HTML קנונית: ${canonicalHtml})\n`;
    }

    out += `
## קובץ ידע מלא ל-LLM (Full Context)
- [מידע עובדתי מלא על AltruBiz ל-AI](${DOMAIN}/llms-full.txt): סקירה מלאה של הפונקציונליות, התשתיות, גרף הידע, מושגי הליבה וכל גוף המאמרים בגרסת מכונה מלאה.

## קישורים רשמיים
- אתר ראשי: ${DOMAIN}/
- אודות החברה: ${DOMAIN}/about
- מרכז הידע: ${DOMAIN}/knowledge
- כניסה למערכת (Web App): https://app.altrubiz.com/
- שירות ותמיכה בוואטסאפ: https://wa.me/972544350000
- מפת אתר (HTML בלבד): ${DOMAIN}/sitemap.xml
`;

    return out;
}

// 2. Generate public/llms-full.txt (Comprehensive machine context)
function generateLlmsFullTxt() {
    let out = `# AltruBiz CRM — מידע עובדתי ומקצועי מלא ל-LLM (Full Knowledge & Context)

## 1. פרופיל הארגון (Organization Profile)
- **שם רשמי:** AltruBiz (אלטרוביז)
- **סוג פעילות:** חברת תוכנה ופתרונות ענן (SaaS)
- **שוק פעילות עיקרי:** ישראל (IL), עם ממשק מלא בעברית ותמיכה מותאמת לשוק הישראלי
- **אתר אינטרנט רשמי:** ${DOMAIN}/
- **מערכת בענן (Web Application):** https://app.altrubiz.com/
- **מוקד תקשורת וואטסאפ רשמי:** +972-54-435-0000 (wa.me/972544350000)

## 2. מהות המערכת (Product Description)
AltruBiz CRM היא מערכת מתקדמת לניהול קשרי לקוחות (CRM), אוטומציה עסקית, וריכוז ערוצי תקשורת. המערכת נועדה לפתור את בעיית אובדן הלידים, חוסר הסדר במעקב אחר לקוחות, ואיטיות המענה בעסקים קטנים, בינוניים ודיגיטליים.

המערכת מחברת בין:
1. **לכידת לידים (Lead Capture):** דפי נחיתה, טפסי הרשמה, יומני פגישות מתוזמנים, טפסי פייסבוק לידס וסקרים.
2. **טיפוח ואוטומציה (Nurturing & Automation):** שליחת מסרים מותאמים אישית בוואטסאפ (WhatsApp), SMS, אימייל ורשתות חברתיות בהתאם לטריגרים מוגדרים מראש.
3. **סגירת עסקאות (Sales Execution):** פייפליין מכירות ויזואלי, ניהול משימות, הצעות מחיר, ומעקב המרות.
4. **בוטים חכמים (AI Agents & Chatbots):** מענה מבוסס בינה מלאכותית לשאלות לקוחות, קביעת פגישות אוטומטית ביומן דרך וואטסאפ סביב השעון (24/7).
5. **דשבורדים ומדדים:** דוחות ביצועים בזמן אמת על קמפיינים ממומנים, יחסי המרה ותפוקת מכירות.

## 3. מסלולי שירות ותמחור (Plans & Pricing)
כל המסלולים במערכת כוללים משתמשים ללא הגבלה ורשומות ללא הגבלה.

### מסלול Pro
- **תמחור:** ₪297 לחודש (בתשלום שנתי) או ₪349 לחודש (בחיוב חודשי)
- **יכולות מרכזיות:** תשתית CRM מלאה, משתמשים ללא הגבלה, רשומות ללא הגבלה, יומן פגישות מתוזמן, טפסים, דפי נחיתה, פייפליין מכירות ודשבורד ניהולי.
- **קהל יעד:** עסקים בתחילת הדרך הזקוקים לסדר וארגון בסיסי בניהול הלידים והלקוחות.

### מסלול Smart (הפופולרי ביותר)
- **תמחור:** ₪497 לחודש (בתשלום שנתי) או ₪597 לחודש (בחיוב חודשי)
- **יכולות מרכזיות:** כולל את כל יכולות Pro, ובנוסף: אינטגרציית WhatsApp עם טריגרים אוטומטיים, מערך משפכים שיווקיים (Funnels), קליטת נרשמים מטפסי פייסבוק בזמן אמת, מערך תגובות אוטומטיות, תזמון פוסטים מרוכז לרשתות חברתיות, מרכז Multi-Channel לתקשורת רב-ערוצית, מנהל מודעות גוגל ופייסבוק, ניהול המלצות בגוגל, וחיבור דומיין עצמאי.
- **קהל יעד:** עסקים פעילים המנהלים קמפיינים שיווקיים וזקוקים לאוטומציה מהירה בוואטסאפ ובסושיאל.

### מסלול Power (המתקדם ביותר)
- **תמחור:** ₪747 לחודש (בתשלום שנתי) או ₪897 לחודש (בחיוב חודשי)
- **יכולות מרכזיות:** כולל את כל יכולות Smart, ובנוסף: בוטים מבוססי AI חכמים העונים ללקוחות, קביעת פגישות ביומן דרך WhatsApp באמצעות AI, שילוב יכולות AI בבניית אוטומציות וכתיבת תוכן, בונה אתרים ודפי נחיתה ב-AI, אינטגרציות API ו-Webhooks מתקדמות, מחולל דוחות מותאם אישית, וחיבורים לשירותי ענן חיצוניים (Google Docs וכו').
- **קהל יעד:** עסקים בצמיחה, מוקדי מכירות וסוכנויות דיגיטל הדורשים אוטומציה מבוססת בינה מלאכותית מלאה.

## 4. מדיניות דיוור WhatsApp וכללי Meta
אלטרוביז מחזיקה במומחיות עמוקה בנושאי רגולציית דיוור והפעלת פלטפורמת WhatsApp Business.
- **שליטה:** WhatsApp נמצאת בשליטה מלאה של Meta. AltruBiz מספקת כלים טכנולוגיים, אך אינה קובעת את מדיניות Meta.
- **כלל האצבע:** יש לשלוח הודעות WhatsApp אך ורק לנמענים שמסרו את מספרם לעסק, מצפים לשמוע מהעסק ונתנו הסכמה מפורשת לקבלת דיוור בוואטסאפ.
- **חלון 24 שעות:** שיחות יזומות דורשות תבנית מאושרת על ידי Meta (Message Template). פניות תגובה לפניות לקוח מותרות ללא תבנית במהלך חלון של 24 שעות מהודעת הלקוח האחרונה.
- **הסרה פשוטה:** חובה לאפשר לנמענים להסיר את עצמם בקלות (למשל בהשבת המילה "הסר") ולכבד בקשות הסרה באופן מיידי.
- **איסור ספאם:** חל איסור מוחלט על שימוש ברשימות שנרכשו או נאספו ללא הסכמה.

## 5. מרכזי הידע בגרף (Public Knowledge Hubs)
`;

    for (const hub of hubs) {
        const cleanHubPath = hub.url;
        const diagnosticQuestions = (hub.hubData && hub.hubData.diagnosticQuestions) || [];
        const symptoms = (hub.hubData && hub.hubData.symptoms) || [];
        out += `### ${hub.title}
- **כתובת קנונית:** ${DOMAIN}${cleanHubPath}
- **תיאור:** ${hub.description}
- **שאלות אבחון מרכזיות:**
${diagnosticQuestions.map(q => `  - ${q}`).join('\n')}
- **תסמינים עסקיים:** ${symptoms.join(', ')}

`;
    }

    out += `## 6. מושגי ליבה קנוניים (Canonical Concepts: State A vs State B)

האתר מפריד באופן מוחלט בין מושגים בעלי יעד ציבורי עצמאי (State A) לבין מושגים המוגדרים לשם הבנה והקשר ללא דף נפרד (State B).

### מושגי State A — בעלי יעד ציבורי עצמאי
`;

    const stateA = Object.entries(canonicalConcepts).filter(([_, c]) => c.hasApprovedPublicDestination && c.publicDestinationUrl);
    const stateB = Object.entries(canonicalConcepts).filter(([_, c]) => !c.hasApprovedPublicDestination);

    for (const [id, concept] of stateA) {
        out += `- **${concept.term || id}** (\`${id}\`): ${concept.canonicalDefinition}
  - **כתובת ציבורית קנונית:** ${DOMAIN}${concept.publicDestinationUrl}
  - **כינויים ומילים נרדפות:** ${(concept.synonyms || []).join(', ')}

`;
    }

    out += `### מושגי State B — מושגים מוגדרים ללא דף ציבורי נפרד
`;

    for (const [id, concept] of stateB) {
        out += `- **${concept.term || id}** (\`${id}\`): ${concept.canonicalDefinition} *(הגדרה קנונית בגרף הידע — אינו דף ציבורי נפרד)*
`;
    }

    out += `
### הבחנה מכרעת: אינבוקס אחוד (Unified Inbox) מול וואטסאפ (WhatsApp)
- **אינבוקס אחוד (Omnichannel / Unified Inbox):** שכבת העל התקשורתית המחברת שיחות מכל הערוצים (WhatsApp, Instagram, Facebook Messenger, SMS, אימייל) לציר שיחה אחד רציף עבור כל לקוח (${DOMAIN}/unified-inbox).
- **וואטסאפ ב-CRM (WhatsApp in CRM):** ערוץ תקשורת ישיר ספציפי הכולל ממשק WhatsApp Business API, תבניות דיוור מאושרות, כללי Meta וחלון 24 שעות (${DOMAIN}/whatsapp-in-crm).
- **הבחנה:** אינבוקס אחוד אינו שם נרדף לוואטסאפ, אלא הפלטפורמה המאחדת את כלל הערוצים.

## 7. מאגר המאמרים והמדריכים המקצועיים (Knowledge Articles Corpus)
`;

    for (const article of publicArticles) {
        const cleanPath = (article.publicPath || article.canonicalUrl.replace(DOMAIN, '')).replace(/^\//, '');
        const mdFilePath = path.join(PUBLIC_DIR, `${cleanPath}.md`);
        let mdContent = '';
        if (fs.existsSync(mdFilePath)) {
            let raw = fs.readFileSync(mdFilePath, 'utf8');
            // Remove frontmatter
            const match = raw.match(/^---[\s\S]*?---\n([\s\S]*)$/);
            mdContent = match ? match[1].trim() : raw.trim();
        }

        out += `### ${article.title}
- **כתובת קנונית (HTML):** ${DOMAIN}/${cleanPath}
- **כתובת מראה למכונה (.md):** ${DOMAIN}/${cleanPath}.md
- **תקציר:** ${article.description}
- **תאריך פרסום:** ${article.publishDate || '2025-02-15'}
- **זמן קריאה:** ${article.readingTimeMinutes} דקות

#### גוף המאמר:
${mdContent}

---

`;
    }

    return out;
}

// Generate files
const llmsTxtContent = generateLlmsTxt();
const llmsFullTxtContent = generateLlmsFullTxt();

fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxtContent, 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullTxtContent, 'utf8');

console.log(`\x1b[32m✔ Successfully generated public/llms.txt (${llmsTxtContent.length} bytes)\x1b[0m`);
console.log(`\x1b[32m✔ Successfully generated public/llms-full.txt (${llmsFullTxtContent.length} bytes)\x1b[0m`);
