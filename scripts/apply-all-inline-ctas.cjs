const fs = require('fs');
const path = require('path');

const articlesFilePath = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
let content = fs.readFileSync(articlesFilePath, 'utf8');

const ctaConfig = {
    'whatsapp-messaging-guidelines': {
        'rule-of-thumb': {
            badge: 'חיבור וואטסאפ רשמי',
            title: 'רוצים לחבר WhatsApp Business רשמי ל-CRM בלי להסתכן בחסימות?',
            description: 'בשיחה קצרה נבדוק את מבנה ההודעות והתבניות שלכם, ונוודא שהעסק עומד במדיניות Meta המעודכנת לעבודה רציפה ובטוחה.',
            buttonText: 'בדיקת תאימות לוואטסאפ לעסק',
            whatsappText: 'שלום צוות AltruBiz, קראתי את המדריך לדיוור בטוח בוואטסאפ, ואשמח לבדוק תאימות לחשבון שלנו.'
        },
        'recommended-practices': {
            badge: 'אוטומציה שיווקית בטוחה',
            title: 'מוכנים לייצר אוטומציות וואטסאפ חכמות שעובדות 24/7?',
            description: 'צוות AltruBiz מחבר לכם בוטים חכמים, מענה מיידי ללידים ותבניות מאושרות – בראש שקט ובהתאמה מלאה למדיניות.',
            buttonText: 'קביעת פגישה: איך זה עובד אצלכם',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק איך לחבר אוטומציות וואטסאפ מאושרות לעסק שלנו.'
        }
    },
    'crm-quick-wins-guide': {
        'reignite-cold-leads': {
            badge: 'הכנסות ממאגר קיים',
            title: 'יושבים על מאות לידים שלא עשו איתם כלום בחודש שעבר?',
            description: 'בפגישת אפיון קצרה נראה לכם איך מהלך פנייה אוטומטי אחד בוואטסאפ מחזיר עסקאות סגורות בלי שקל נוסף על מודעות.',
            buttonText: 'בדיקת פוטנציאל להחייאת לידים',
            whatsappText: 'שלום צוות AltruBiz, קראתי על החייאת לידים קרים, ואשמח לבדוק איך ליישם את זה אצלנו בעסק.'
        },
        'pipeline-follow-up-stages': {
            badge: 'שליטה בפייפליין',
            title: 'רוצים שכל עסקה תתקדם בפייפליין ויזואלי ברור?',
            description: 'נבנה יחד לוח מכירות פשוט וממוקד עם התראות פולואפ אוטומטיות שמונעות מלידים להישכח.',
            buttonText: 'קביעת פגישה לבדיקת התאמה',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך פייפליין מכירות ויזואלי של AltruBiz יכול לעבוד אצלנו.'
        }
    },
    'lead-first-5-minutes-guide': {
        'confirmation': {
            badge: 'מענה מיידי ללידים',
            title: 'רוצים להגיב לכל ליד בתוך 60 שניות – גם בלי להיות צמודים למסך?',
            description: 'חיבור AltruBiz שולח הודעת וואטסאפ מותאמת אישית ברגע כניסת הליד ומקפיץ את סיכויי הסגירה פי 4.',
            buttonText: 'בדיקת התאמה למענה מהיר',
            whatsappText: 'שלום צוות AltruBiz, קראתי על חשיבות 5 הדקות הראשונות, ואשמח לחבר מענה מהיר בוואטסאפ ללידים שלנו.'
        },
        'after-hours': {
            badge: 'עבודה מחוץ לשעות הפעילות',
            title: 'לידים נכנסים בלילה או בסופ"ש ומתקררים עד הבוקר?',
            description: 'נחבר בוט חכם ומכבד שמתאם שיחה ליום שלמחרת ישירות ליומן, כדי שכל פנייה תטופל בזמן אמת.',
            buttonText: 'קביעת פגישה: איך זה יכול לעבוד אצלכם',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק איך לנהל לידים שנכנסים מחוץ לשעות הפעילות בעסק.'
        }
    },
    'missed-call-text-back-guide': {
        'instant-text': {
            badge: 'הצלת שיחות שלא נענו',
            title: 'כמה לקוחות מתקשרים אליכם ביום וממשיכים למתחרה כי הייתם תפוסים?',
            description: 'מנגנון Missed Call Text-Back שולח הודעת וואטסאפ מיידית למי שלא נענה ומשאיר את הלקוח אצלכם בשיחה.',
            buttonText: 'בדיקת התאמה למנגנון שיחות שלא נענו',
            whatsappText: 'שלום צוות AltruBiz, קראתי על מנגנון Missed Call Text-Back ואשמח לחבר אותו למספר העסק שלנו.'
        },
        'booking': {
            badge: 'תיאום ישיר מהודעה',
            title: 'רוצים ששיחה שלא נענתה תהפוך לפגישה סגורה ביומן?',
            description: 'שילוב הודעת החזרה האוטומטית עם קישור ליומן AltruBiz מאפשר ללקוח לקבוע שיחה חוזרת בקליק אחד.',
            buttonText: 'קביעת פגישה לאפיון תהליך מענה',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך לחבר תיאום פגישות אוטומטי לשיחות שלא נענו.'
        }
    },
    'excel-to-crm-pipeline-guide': {
        'list-vs-process': {
            badge: 'מעבר מאקסל לסיסטם',
            title: 'מרגישים שהאקסל כבר לא עומד בקצב של העסק?',
            description: 'צוות AltruBiz דואג לייבוא הנתונים, מיפוי הסטטוסים ובניית הפייפליין – בלי שתאבדו אף לקוח בדרך.',
            buttonText: 'שיחת בדיקת התאמה למעבר ל-CRM',
            whatsappText: 'שלום צוות AltruBiz, קראתי את המדריך למעבר מאקסל ל-CRM, ואשמח לבדוק מעבר מסודר אצלנו בעסק.'
        },
        'cleanup': {
            badge: 'סדר וניקיון בנתונים',
            title: 'רוצים ליווי אישי במעבר מגיליונות אקסל למערכת חכמה?',
            description: 'נעבור יחד על קובץ הלקוחות שלכם ונראה לכם איך הוא הופך לפייפליין מכירות חזותי תוך ימים ספורים.',
            buttonText: 'קביעת פגישת אפיון ומעבר',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק ליווי למעבר מקבצי אקסל לפייפליין מסודר.'
        }
    },
    'business-memory-crm-guide': {
        'memory': {
            badge: 'זיכרון ארגוני מנוהל',
            title: 'רוצים להבטיח שכל המידע על הלקוחות שמור בעסק ולא רק בראש של העובדים?',
            description: 'כרטיס לקוח חכם ב-AltruBiz מרכז שיחות, סיכומים, הצעות מחיר ומשימות במקום אחד שנגיש תמיד.',
            buttonText: 'בדיקת התאמה לשימור ידע בעסק',
            whatsappText: 'שלום צוות AltruBiz, קראתי את המאמר על זיכרון עסקי, ואשמח לבדוק איך לבנות כרטיס לקוח מרכזי אצלנו.'
        },
        'typing': {
            badge: 'מינימום הקלדות, מקסימום תוצאות',
            title: 'רוצים תיעוד שיחות מהיר בלי להפוך את הצוות לקלדנים?',
            description: 'בפגישת התאמה קצרה נראה לכם איך AltruBiz ובינה מלאכותית מסכמות שיחות ומייצרות משימות ב-20 שניות בלבד.',
            buttonText: 'קביעת פגישה: איך זה יכול לעבוד אצלכם',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך תיעוד שיחות חכם יכול לפעול אצלנו בעסק.'
        }
    },
    'lead-reactivation-guide': {
        'not-dead': {
            badge: 'אוצר נסתר בארכיון',
            title: 'רוצים לייצר עסקאות נוספות מהמאגר שכבר שילמתם עליו?',
            description: 'מהלך Reactivation מתוזמן ומנומס בוואטסאפ מחזיר עד 14% מהלידים הקרים לשיחת מכירה פעילה.',
            buttonText: 'בדיקת פוטנציאל להחייאת לידים',
            whatsappText: 'שלום צוות AltruBiz, קראתי על החייאת לידים ישנים, ואשמח לבדוק איך לבצע קמפיין כזה אצלנו.'
        },
        'message': {
            badge: 'פנייה אנושית ומכבדת',
            title: 'רוצים שננסח יחד תסריט פנייה חם ומדויק ללידים ישנים?',
            description: 'נמפה את קבוצות הלידים בעסק שלכם, נגדיר את תזמון ההודעות ונחבר אוטומציה שמנהלת את המענה.',
            buttonText: 'קביעת פגישה לאפיון מהלך החייאה',
            whatsappText: 'שלום צוות AltruBiz, אשמח לאפיין מהלך פנייה חוזרת ללידים ישנים בעסק שלנו.'
        }
    },
    'follow-up-tasks-crm-guide': {
        'remember-think': {
            badge: 'שחרור עומס מהראש',
            title: 'נמאס לכם להחזיק עשרות משימות ומועדי פולואפ בראש?',
            description: 'מערכת המשימות של AltruBiz מתזמנת תזכורות אוטומטיות לכל שלב בעסקה ומבטיחה שאף לקוח לא יתפספס.',
            buttonText: 'בדיקת התאמה לניהול פולואפ חכם',
            whatsappText: 'שלום צוות AltruBiz, קראתי על ניהול פולואפ ב-CRM, ואשמח לבדוק איך להכניס את זה לפעילות שלנו.'
        },
        'automation': {
            badge: 'סיסטם עבודה מסודר',
            title: 'מוכנים להכניס שיטה עקבית שמעלה את אחוזי הסגירה?',
            description: 'בפגישת התאמה קצרה נראה לכם איך רצף מעקב פשוט ב-CRM הופך מתלבטים ללקוחות משלמים.',
            buttonText: 'קביעת פגישה: איך זה יכול לעבוד אצלכם',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך לבנות רצף פולואפ מנצח בעסק שלנו.'
        }
    },
    'automated-meeting-scheduling-guide': {
        'flight-board': {
            badge: 'סוף לפינג פונג התיאומים',
            title: 'מבזבזים זמן יקר על תיאום שעות הלוך וחזור בוואטסאפ?',
            description: 'דף תיאום אישי ומסונכרן ליומן מאפשר ללקוחות לבחור משבצת פנויה תוך שניות בודדות, בלי טלפונים והודעות.',
            buttonText: 'בדיקת התאמה ליומן פגישות דיגיטלי',
            whatsappText: 'שלום צוות AltruBiz, קראתי על תיאום פגישות אוטומטי, ואשמח לחבר יומן כזה לפעילות שלי.'
        },
        'reminders': {
            badge: 'אפס ביטולים ביומן',
            title: 'רוצים לוודא שכל מי שקבע פגישה אכן יופיע בזמן?',
            description: 'חיבור יומן הפגישות לתזכורות וואטסאפ חכמות עם אישורי הגעה מוריד את שיעור ה-No-Show כמעט לאפס.',
            buttonText: 'קביעת פגישה לבדיקת התאמה',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק איך לחבר תזכורות וואטסאפ ליומן הפגישות בעסק.'
        }
    },
    'crm-duplicate-contacts-prevention-guide': {
        'story': {
            badge: 'מאגר לקוחות נקי',
            title: 'מוצאים את אותו לקוח מספר פעמים עם נתונים סותרים?',
            description: 'מנגנון זיהוי ואיחוד כפילויות ב-AltruBiz שומר על כרטיס לקוח אחד ויחיד עם כל היסטוריית השיחות והרכישות.',
            buttonText: 'בדיקת התאמה למניעת כפילויות',
            whatsappText: 'שלום צוות AltruBiz, קראתי על מניעת כפילויות אנשי קשר, ואשמח לבדוק פתרון למאגר שלנו.'
        },
        'cleanup': {
            badge: 'סדר ארגוני קבוע',
            title: 'רוצים לנקות את מאגר הנתונים בעסק פעם אחת ולתמיד?',
            description: 'נמפה את מקורות הלידים שלכם ונגדיר חוקיות חכמה שמונעת יצירת כפילויות חדשות באופן אוטומטי.',
            buttonText: 'קביעת פגישה: איך זה עובד אצלכם',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך AltruBiz מנקה כפילויות ושומרת על מאגר נקי.'
        }
    },
    'crm-adoption-thursday-test-guide': {
        'three-actions': {
            badge: 'הטמעה שעובדת באמת',
            title: 'השקעתם במערכת והעובדים עדיין מתעדים בפתקים או בוואטסאפ?',
            description: 'אנחנו ב-AltruBiz מתאימים את התהליך לצוות: מתמקדים ב-3 פעולות פשוטות שחוסכות זמן ויוצרות אימוץ מיידי.',
            buttonText: 'בדיקת התאמה להטמעה פשוטה',
            whatsappText: 'שלום צוות AltruBiz, קראתי על מבחן יום חמישי לאימוץ CRM, ואשמח לבדוק איך לייצר אימוץ מלא אצלנו.'
        },
        'work': {
            badge: 'שינוי הרגלים קל',
            title: 'רוצים ליווי בהטמעת CRM שהעובדים שלכם ישמחו להשתמש בו?',
            description: 'בפגישת התאמה קצרה נמפה את סדר היום של הצוות ונראה לכם איך לייצר שגרת עבודה חלקה תוך פחות משבועיים.',
            buttonText: 'קביעת פגישת התאמה עם צוות AltruBiz',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק ליווי להטמעה קלה ונעימה של CRM בעסק.'
        }
    },
    'customer-reviews-reputation-crm-guide': {
        'timing': {
            badge: 'מוניטין וביקורות 5 כוכבים',
            title: 'לקוחות מרוצים נעלמים בלי לכתוב ביקורת בגוגל?',
            description: 'בקשת ביקורת אוטומטית שיוצאת בדיוק ברגע הנכון בוואטסאפ מעלה את כמות הדירוגים החיוביים ביותר מפי 5.',
            buttonText: 'בדיקת התאמה לאיסוף ביקורות אוטומטי',
            whatsappText: 'שלום צוות AltruBiz, קראתי על איסוף ביקורות בגוגל, ואשמח לחבר אוטומציה כזו לעסק.'
        },
        'negative': {
            badge: 'סינון חכם ומניעת פגיעה במוניטין',
            title: 'רוצים לזהות חוסר שביעות רצון לפני שהיא הופכת לביקורת פומבית?',
            description: 'שאלון שביעות רצון חכם מפנה לקוחות מתלהבים לגוגל ומנתב לקוחות מאוכזבים לטיפול פנימי מהיר.',
            buttonText: 'קביעת פגישה: איך זה עובד אצלכם בעסק',
            whatsappText: 'שלום צוות AltruBiz, אשמח לראות איך מנגנון ניהול מוניטין של AltruBiz יכול לעבוד אצלנו.'
        }
    },
    'preventing-meeting-no-shows-guide': {
        'reminders': {
            badge: 'אפס הברזות ביומן',
            title: 'נמאס לכם לחכות בזום לאנשים שלא מופיעים?',
            description: 'מערך אישורי הגעה ותזכורות מותאמות בוואטסאפ חותך את שיעור ה-No-Show מתחת ל-5% ומייצר שקט בלו"ז.',
            buttonText: 'בדיקת התאמה למניעת No-Show',
            whatsappText: 'שלום צוות AltruBiz, קראתי על מניעת הברזות לפגישות, ואשמח לחבר תזכורות כאלה ליומן שלי.'
        },
        'recovery': {
            badge: 'הצלת פגישות שפוספסו',
            title: 'רוצים מנגנון אוטומטי שמחזיר פגישות שבוטלו ליומן בלי מבוכה?',
            description: 'הודעת Recovery עדינה בוואטסאפ מחזירה מעל 30% מהפגישות שלא התקיימו למועד חדש בקליק אחד.',
            buttonText: 'קביעת פגישה לאפיון תהליך מעקב',
            whatsappText: 'שלום צוות AltruBiz, אשמח לבדוק איך לחבר מנגנון Recovery לפגישות ביומן.'
        }
    }
};

let injectedCount = 0;

for (const [slug, sectionsMap] of Object.entries(ctaConfig)) {
    // Locate article boundary in content
    const slugStr = `slug: '${slug}'`;
    const slugPos = content.indexOf(slugStr);
    if (slugPos === -1) {
        console.error(`Could not find article slug: ${slug}`);
        continue;
    }

    // Find end of this article (either next slug: ' or end of ARTICLES)
    const nextSlugPos = content.indexOf(`slug: '`, slugPos + slugStr.length);
    const articleEndPos = nextSlugPos !== -1 ? nextSlugPos : content.lastIndexOf('];');
    
    let articleBlock = content.slice(slugPos, articleEndPos);

    for (const [secId, cta] of Object.entries(sectionsMap)) {
        const secIdMarker = `id: '${secId}',`;
        const secPosInArticle = articleBlock.indexOf(secIdMarker);

        if (secPosInArticle === -1) {
            console.error(`Could not find section ${secId} in article ${slug}`);
            continue;
        }

        // Within this section object in articleBlock, find where the section ends
        const nextSecMarker = articleBlock.indexOf(`id: '`, secPosInArticle + secIdMarker.length);
        const searchBound = nextSecMarker !== -1 ? nextSecMarker : articleBlock.length;

        // Find the section's closing brace `\n            },` before searchBound
        const secSub = articleBlock.slice(secPosInArticle, searchBound);
        if (secSub.includes('inlineCta:')) {
            console.log(`inlineCta already exists in ${slug} -> ${secId}`);
            continue;
        }

        const closeIdxInSub = secSub.lastIndexOf('\n            },');
        if (closeIdxInSub === -1) {
            console.error(`Could not find closing brace for section ${secId} in ${slug}`);
            continue;
        }

        const absClosePosInArticle = secPosInArticle + closeIdxInSub;

        const ctaString = `,\n                inlineCta: {\n                    badge: '${cta.badge}',\n                    title: '${cta.title}',\n                    description: '${cta.description}',\n                    buttonText: '${cta.buttonText}',\n                    whatsappText: '${cta.whatsappText}'\n                }`;

        articleBlock = articleBlock.slice(0, absClosePosInArticle) + ctaString + articleBlock.slice(absClosePosInArticle);
        injectedCount++;
        console.log(`✔ Injected inlineCta into ${slug} -> ${secId}`);
    }

    // Put modified article block back into content
    content = content.slice(0, slugPos) + articleBlock + content.slice(articleEndPos);
}

fs.writeFileSync(articlesFilePath, content, 'utf8');
console.log(`\nSuccessfully injected ${injectedCount} inline CTAs!`);
