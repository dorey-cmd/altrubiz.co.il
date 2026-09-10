/**
 * AltruBiz Knowledge Graph & Topology Registry
 * 
 * Single source of truth for the connected knowledge graph, multi-dimensional taxonomy,
 * business pains, manifestations, hubs, and bidirectional relationships.
 */

export type NodeType = 'home' | 'pain_hub' | 'micro_hub' | 'article' | 'product';

export interface DiagnosticItem {
    question: string;
    warningSign: string;
    impact: string;
}

export interface HubSection {
    id: string;
    title: string;
    subtitle?: string;
    content: string[];
    manifestationId?: string;
    relatedArticleSlugs?: string[];
    quickWin?: {
        title: string;
        text: string;
        actionSteps?: string[];
    };
    callout?: {
        type: 'info' | 'warning' | 'success' | 'danger';
        title?: string;
        text: string;
    };
}

export interface KnowledgeNode {
    id: string;
    slug: string;
    url: string;
    nodeType: NodeType;
    title: string;
    subtitle?: string;
    seoTitle: string;
    description: string;
    primaryPain: string;
    secondaryPains?: string[];
    subPainManifestation?: string;
    userIntent: string;
    processes: string[];
    channels: string[];
    technologies: string[];
    businessObjects: string[];
    outcomes: string[];
    relevantProducts: string[];
    parentHubSlug?: string;
    relatedMicroHubSlugs?: string[];
    relatedArticleSlugs?: string[];
    recommendedNextSlugs?: string[];
    availableCtas: ('meeting' | 'pricing' | 'whatsapp' | 'quick-win')[];
    isIndexable: boolean;
    maturity: 'canonical' | 'maturing' | 'emerging';
    dateCreated: string;
    dateUpdated: string;
    
    // Extended properties for Hub nodes
    hubData?: {
        problemDefinition: string;
        whyItHappens: string[];
        businessCost: string[];
        symptoms: string[];
        diagnosticQuestions: DiagnosticItem[];
        primaryQuickWin: {
            title: string;
            text: string;
            actionSteps: string[];
        };
        sections: HubSection[];
        solutionPaths: {
            title: string;
            description: string;
            featureHighlights: string[];
        }[];
        faqs: {
            question: string;
            answer: string;
        }[];
    };
}

/**
 * Canonical Business Pains taxonomy
 */
export const CANONICAL_PAINS: Record<string, { id: string; name: string; description: string; hubSlug?: string }> = {
    'lost-leads': {
        id: 'lost-leads',
        name: 'לידים בורחים ונופלים בין הכיסאות',
        description: 'לידים ששילמתם עליהם לא מקבלים מענה בזמן, שיחות שלא נענו מתאדות, ואין מעקב מסודר.',
        hubSlug: 'lost-leads'
    },
    'scattered-customer-communication': {
        id: 'scattered-customer-communication',
        name: 'תקשורת לקוחות מפוזרת בערוצים נפרדים',
        description: 'שיחות מתנהלות בוואטסאפ, אינסטגרם, מייל וטלפון ללא הקשר וללא תיעוד מרכזי.',
        hubSlug: 'scattered-customer-communication'
    },
    'sales-pipeline-crm-adoption': {
        id: 'sales-pipeline-crm-adoption',
        name: 'תהליך מכירה לא מסודר ועובדים שלא מעדכנים CRM',
        description: 'אנשי מכירות חוזרים לרשימות פרטיות ומחברות כי המערכת נבנתה ככלי מעקב מעיק במקום כלי עבודה.',
        hubSlug: 'sales-pipeline-crm-adoption'
    },
    'repetitive-manual-work': {
        id: 'repetitive-manual-work',
        name: 'עבודה ידנית שחוזרת על עצמה ובזבוז זמן ניהולי',
        description: 'תיאומי פגישות ידניים, מרדף אחרי מסמכים ובירוקרטיה שגוזלים שעות מעבודה מקצועית.',
        hubSlug: 'repetitive-manual-work'
    }
};

/**
 * Knowledge Nodes Registry
 */
export const KNOWLEDGE_NODES: Record<string, KnowledgeNode> = {
    // ==========================================
    // 1. PAIN HUB: Lost Leads
    // ==========================================
    'hub-lost-leads': {
        id: 'hub-lost-leads',
        slug: 'lost-leads',
        url: '/topics/lost-leads',
        nodeType: 'pain_hub',
        title: 'לידים נופלים בין הכיסאות: המדריך לאבחון, עצירת נטישה וסגירת עסקאות',
        subtitle: 'איך לזהות את חורי הבריחה של לקוחות בעסק, לקצר את זמני המענה ל-5 דקות, ולחבר סיסטם שלא מאפשר לאף ליד להיעלם',
        seoTitle: 'לידים נופלים בין הכיסאות: מדריך אבחון ועצירת אובדן לקוחות | AltruBiz CRM',
        description: 'מדריך מקיף לאבחון ועצירת בריחת לידים בעסק: מדוע לידים לא מקבלים מענה בזמן, מה עושים עם שיחות שלא נענו, ואיך מייצרים פייפליין אוטומטי ב-CRM.',
        primaryPain: 'lost-leads',
        userIntent: 'איך למנוע בריחת לידים, לשפר זמן תגובה ולהחזיר לידים ישנים למכירות',
        processes: ['מענה ראשוני', 'פולואפ', 'החייאת לידים', 'תיאום פגישות'],
        channels: ['WhatsApp', 'טלפון', 'טפסי אתר', 'SMS'],
        technologies: ['CRM', 'אוטומציות', 'Missed Call Text Back'],
        businessObjects: ['לידים', 'שיחות', 'פגישות', 'עסקאות'],
        outcomes: ['יותר מכירות', 'זמן תגובה מהיר', 'פחות בזבוז תקציב שיווק'],
        relevantProducts: ['AltruBiz CRM', 'מענה אוטומטי לשיחות', 'מסעות וואטסאפ'],
        relatedMicroHubSlugs: ['whatsapp-in-crm'],
        relatedArticleSlugs: [
            'lead-first-5-minutes-guide',
            'missed-call-text-back-guide',
            'lead-reactivation-guide',
            'excel-to-crm-pipeline-guide',
            'crm-quick-wins-guide'
        ],
        recommendedNextSlugs: ['whatsapp-in-crm', 'salespeople-hate-crm-adoption-guide'],
        availableCtas: ['meeting', 'pricing', 'whatsapp'],
        isIndexable: true,
        maturity: 'canonical',
        dateCreated: '2026-09-10',
        dateUpdated: '2026-09-10',
        hubData: {
            problemDefinition: 'בריחת לידים היא המצב שבו אנשים שפנו לעסק והביעו עניין פעיל בשירות או במוצר שלכם מתפוגגים בלי שנרכשה עסקה, מבלי שסירבו במפורש, ורק בגלל עיכוב במענה, שיחה שלא נענתה, חוסר מעקב או מידע מפוזר.',
            whyItHappens: [
                'זמן תגובה איטי: ליד מחכה שעות לקבלת מענה ובזמן הזה סוגר עם מתחרה שהגיב בתוך 5 דקות.',
                'שיחות טלפון שלא נענו: בשיא הלחץ הטלפון מצלצל, איש המכירות בשיחה אחרת, והמתקשר מתאדה לנצח.',
                'היעדר פולואפ שיטתי: שולחים הצעה, הלקוח מבקש לחשוב, ואף אחד לא חוזר אליו בשבוע הבא.',
                'לידים קבורים באקסלים: עשרות לידים מחודשים קודמים נשארים ללא מגע למרות שכבר שילמתם עליהם בשיווק.'
            ],
            businessCost: [
                'אובדן ישיר של 30%-50% מתקציב הפרסום שמושקע בלידים שאיש לא חוזר אליהם בזמן.',
                'עליית עלות רכישת לקוח (CAC) בגלל הצורך לקנות עוד ועוד לידים חדשים במקום לסגור את הקיימים.',
                'שחיקת אנשי מכירות שרודפים אחרי לידים שהתקררו במקום לשוחח עם פניות חמות בזמן אמת.'
            ],
            symptoms: [
                'מנהל שואל "מה קורה עם הלידים מקמפיין השבוע?" ואף אחד לא יודע לתת מספר מדויק.',
                'פניות שנכנסות בערב או בסוף שבוע זוכות למענה רק ביום ראשון בצהריים.',
                'שיחות טלפון שלא נענו נשארות ברשימת השיחות הבלתי מזוהות בטלפון הנייד.',
                'אנשי מכירות מתלוננים ש"הלידים קרים ולא עונים", בעוד שהמענה הראשוני נעשה 4 שעות אחרי הפנייה.'
            ],
            diagnosticQuestions: [
                {
                    question: 'כמה דקות בממוצע חולפות מרגע השארת פרטים באתר ועד שהלקוח מקבל מענה ראשון?',
                    warningSign: 'יותר מ-15 דקות (או אין מעקב מדוד כלל).',
                    impact: 'סיכויי יצירת הקשר והסגירה צונחים ביותר מ-390% כשהמענה מתעכב מעבר ל-5 דקות.'
                },
                {
                    question: 'מה קורה אצלכם כשללקוח מתקשר לעסק בשעה 14:30 ואתם בפגישה ולא עונים?',
                    warningSign: 'הטלפון נרשם כשיחה שלא נענתה, וחוזרים אליו "כשמתפנים".',
                    impact: 'הלקוח פשוט מקליק על התוצאה הבאה בגוגל וסוגר עם המתחרה שלכם.'
                },
                {
                    question: 'מה קרה ל-100 הלידים האחרונים שנכנסו לפני חודשיים ולא סגרו עסקה?',
                    warningSign: 'הם שוכבים באקסל או בתיבת דואר ואף אחד לא יצר איתם קשר מאז.',
                    impact: 'זהו "מכרה זהב" קפוא בעסק שיכול לייצר עסקאות ללא שקל נוסף של פרסום.'
                }
            ],
            primaryQuickWin: {
                title: 'הפעלת מענה טקסט אוטומטי בוואטסאפ לשיחות שלא נענו (Missed Call Text Back)',
                text: 'הגדירו כלל פשוט: ברגע שנרשמת שיחה שלא נענתה, ה-CRM שולח הודעת וואטסאפ מנומסת תוך 15 שניות: "שלום, ראינו שניסיתם להשיג אותנו ואנחנו כרגע בשיחה. במה אפשר לעזור?". פעולה זו בלבד מצילה עד 40% מהפניות האבודות.',
                actionSteps: [
                    'ספרו כמה שיחות שלא נענו נרשמו בטלפון העסקי בשבוע האחרון.',
                    'נסחו הודעת וואטסאפ פשוטה, אנושית ולא מתאמצת.',
                    'חברו את קו הטלפון לאוטומציית הודעה חוזרת ב-AltruBiz CRM.'
                ]
            },
            sections: [
                {
                    id: 'first-response',
                    title: '1. תופעת השטח: מענה איטי מדי ללידים חדשים',
                    subtitle: 'הקרב על הליד מוכרע ב-5 הדקות הראשונות',
                    content: [
                        'כאשר לקוח משאיר פרטים, הוא נמצא בשיא רמת העניין שלו: הוא מול המסך, הבעיה שלו בוערת, והוא מוכן לשוחח.',
                        'אם העסק ממתין שעתיים, רמת הקשב של הלקוח נעלמת והוא כבר עבר לעיסוקים אחרים. חיבור אוטומציית מענה ראשוני ב-WhatsApp תוך דקות בודדות מוודא שאתם הראשונים שמדברים איתו.'
                    ],
                    manifestationId: 'slow-first-response',
                    relatedArticleSlugs: ['lead-first-5-minutes-guide', 'crm-quick-wins-guide']
                },
                {
                    id: 'missed-calls',
                    title: '2. תופעת השטח: שיחות שלא נענו שמתאדות לאוויר',
                    subtitle: 'הלקוח חייג – למה שניתן לו לעבור למתחרה הבא ברשימה?',
                    content: [
                        'שיחת טלפון היא כוונת הרכישה החזקה ביותר בעסק. אדם שעוצר את יומו ומחייג רוצה מענה עכשיו.',
                        'במקום להסתפק בהודעה קולית שאף אחד לא מקשיב לה, מערכת אוטומטית שולחת הודעת SMS או WhatsApp מיידית, שומרת על הקשר ופותחת ערוץ שיחה כתוב שמונע ממנו לחייג הלאה.'
                    ],
                    manifestationId: 'unanswered-phone-calls',
                    relatedArticleSlugs: ['missed-call-text-back-guide']
                },
                {
                    id: 'frozen-leads',
                    title: '3. תופעת השטח: לידים קרים שקבורים באקסלים ללא מעקב',
                    subtitle: 'החייאת לידים ישנים: עסקאות חדשות ללא תוספת תקציב פרסום',
                    content: [
                        'עסקים רבים משקיעים אלפי שקלים בחודש בלידים חדשים, בזמן שבמאגר שלהם שוכבים מאות לידים שאמרו "לא כרגע" לפני חצי שנה.',
                        'קמפיין Reactivation חכם ומנומס ב-WhatsApp, המציע ערך או שואל שאלה קצרה, מעיר מחדש 5%-12% מהלידים הרדומים והופך אותם לפגישות מכירה מיידיות.'
                    ],
                    manifestationId: 'stalled-old-leads',
                    relatedArticleSlugs: ['lead-reactivation-guide', 'excel-to-crm-pipeline-guide']
                }
            ],
            solutionPaths: [
                {
                    title: 'פייפליין מכירות חזותי ואוטומטי ב-AltruBiz',
                    description: 'כל ליד מכל ערוץ (טפסים, וואטסאפ, פייסבוק, שיחות) נכנס אוטומטית לשלב "חדש", זוכה למענה תוך 60 שניות ומייצר משימת תזכורת לנציג.',
                    featureHighlights: [
                        'מענה אוטומטי רב-ערוצי ב-5 הדקות הראשונות',
                        'מנגנון Missed Call Text Back מובנה לקווי טלפון',
                        'מסעות חימום והחייאת לידים קרים ברקע ללא התערבות ידנית',
                        'שיוך נציגים חכם ומניעת לידים יתומים'
                    ]
                }
            ],
            faqs: [
                {
                    question: 'מהו הגורם מספר 1 לבריחת לידים בעסקים קטנים ובינוניים?',
                    answer: 'זמן תגובה איטי ושיחות טלפון שלא נענו. מחקרים מוכיחים כי פנייה חוזרת בתוך 5 דקות מגדילה את הסיכוי להמיר את הליד לפי 4 בהשוואה לפנייה שנעשית כעבור 30 דקות בלבד.'
                },
                {
                    question: 'איך אוטומציה של Missed Call Text Back עובדת בפועל?',
                    answer: 'המערכת מזהה שיחה נכנסת שלא נענתה, ובתוך שניות ספורות שולחת הודעת WhatsApp או SMS מותאמת אישית למתקשר, שואלת כיצד ניתן לסייע ומאפשרת לו להשיב בהודעה או לקבוע פגישה ישירות ביומן.'
                },
                {
                    question: 'האם כדאי לפנות ללידים ישנים שלא סגרו לפני כמה חודשים?',
                    answer: 'בהחלט. נסיבות החיים והעסק של הלקוח משתנות. הודעת בדיקה קצרה, רלוונטית ולא שיווקית-אגרסיבית בוואטסאפ מצליחה לעורר עסקאות רדומות ללא עלות פרסום נוספת.'
                }
            ]
        }
    },

    // ==========================================
    // 2. MICRO HUB: WhatsApp in CRM
    // ==========================================
    'hub-whatsapp-in-crm': {
        id: 'hub-whatsapp-in-crm',
        slug: 'whatsapp-in-crm',
        url: '/topics/whatsapp-in-crm',
        nodeType: 'micro_hub',
        title: 'וואטסאפ ב-CRM: איך לחבר את הערוץ הכי חזק בעסק לסיסטם אוטומטי ובטוח',
        subtitle: 'מסעות לקוח אוטומטיים, מענה מהיר, מניעת חסימות Meta וריכוז כל השיחות ב-Inbox אחוד',
        seoTitle: 'וואטסאפ ב-CRM: מדריך חיבור, אוטומציות ומניעת חסימות | AltruBiz CRM',
        description: 'כל מה שצריך לדעת על שילוב WhatsApp Business ב-CRM: הנחיות Meta, מניעת חסימות, אוטומציית הודעות ללידים חדשים, וניהול צוות מלא בתיבה אחודה.',
        primaryPain: 'scattered-customer-communication',
        secondaryPains: ['lost-leads', 'repetitive-manual-work'],
        userIntent: 'איך לחבר וואטסאפ עסקי למערכת CRM, להפעיל אוטומציות בלי להיחסם ולרכז שיחות',
        processes: ['תקשורת לקוחות', 'מענה ראשוני', 'תזכורות לפגישות', 'שירות לקוחות'],
        channels: ['WhatsApp'],
        technologies: ['CRM', 'WhatsApp Cloud API', 'Automation'],
        businessObjects: ['אנשי קשר', 'הודעות', 'תבניות וואטסאפ', 'משימות'],
        outcomes: ['חיסכון בזמן', 'אפס הודעות אבודות', 'שמירה על כללי Meta'],
        relevantProducts: ['AltruBiz CRM', 'חיבור WhatsApp רשמי', 'בוטים מבוססי AI'],
        parentHubSlug: 'scattered-customer-communication',
        relatedMicroHubSlugs: ['lost-leads'],
        relatedArticleSlugs: [
            'whatsapp-messaging-guidelines',
            'lead-first-5-minutes-guide',
            'missed-call-text-back-guide',
            'omnichannel-communication-unified-inbox-crm-guide',
            'crm-quick-wins-guide'
        ],
        recommendedNextSlugs: ['lost-leads', 'omnichannel-communication-unified-inbox-crm-guide'],
        availableCtas: ['meeting', 'pricing', 'whatsapp'],
        isIndexable: true,
        maturity: 'canonical',
        dateCreated: '2026-09-10',
        dateUpdated: '2026-09-10',
        hubData: {
            problemDefinition: 'וואטסאפ הוא ערוץ התקשורת המוביל בישראל, אך כאשר הוא מנוהל במכשירי טלפון אישיים של עובדים ללא CRM, נוצר נתק מוחלט: שיחות הולכות לאיבוד, אין תיעוד עסקאות, יש סכנת חסימות מחמירה של Meta, ושני עובדים עלולים לענות תשובות סותרות.',
            whyItHappens: [
                'שימוש במספרי טלפון אישיים: המידע העסקי כלוא אצל העובד ונעלם כשהוא מתחלף או יוצא לחופש.',
                'הצפת הודעות אוטומטיות ללא אישור: שיגור הודעות שיווקיות ללא הסכמה מוביל לדיווח כספאם וחסימת המספר ב-Meta.',
                'חוסר סנכרון עם ה-Pipeline: ההתכתבות מתנהלת בוואטסאפ אך כרטיס הליד במערכת נשאר ריק ולא מעודכן.'
            ],
            businessCost: [
                'חסימת קו הוואטסאפ הראשי של העסק ב-Meta עקב אי-עמידה בתקנות ודיווחים על ספאם.',
                'איבוד עסקאות שמתפספסות בשיחות אישיות שאינן גלויות למנהלים או לשאר הצוות.',
                'בזבוז זמן של נציגים שמעתיקים ידנית הודעות בין הוואטסאפ למערכות המידע.'
            ],
            symptoms: [
                'נציגים כותבים ללקוחות מטלפונים פרטיים בסופי שבוע ובשעות ערב ללא גיבוי.',
                'מנהל המכירות שואל "מה סוכם עם הלקוח?" והתשובה היא "רגע, אני אבדוק אצלי בוואטסאפ".',
                'העסק קיבל אזהרות או הגבלת הודעות מ-Meta בגלל דיווחים על הודעות לא רצויות.'
            ],
            diagnosticQuestions: [
                {
                    question: 'האם השיחות שמתנהלות בוואטסאפ מול לקוחות מתועדות אוטומטית בתוך כרטיס הלקוח ב-CRM?',
                    warningSign: 'לא, הן נשארות בטלפונים הניידים של העובדים.',
                    impact: 'העסק מאבד את כל הזיכרון הארגוני וההיסטוריה המסחרית שלו ברגע שעובד עוזב.'
                },
                {
                    question: 'האם יש לכם הסכמה מפורשת (Opt-in) מכל אדם שמקבל מכם הודעת וואטסאפ אוטומטית?',
                    warningSign: 'שולחים הודעות לרשימות תפוצה ישנות או ללא אישור מראש.',
                    impact: 'סיכון ממשי לחסימה מיידית לצמיתות על ידי פלטפורמת Meta.'
                },
                {
                    question: 'כמה נציגים יכולים לצפות ולהשיב במקביל לאותו מספר וואטסאפ עסקי מרכזי?',
                    warningSign: 'רק אדם אחד שמחזיק את המכשיר הפיזי (או סריקת WhatsApp Web מוגבלת).',
                    impact: 'צווארי בקבוק חמורים בשירות ובמכירות והיעדר יכולת פיקוח ניהולי.'
                }
            ],
            primaryQuickWin: {
                title: 'בניית תבנית הודעת פתיחה תואמת הנחיות Meta ללידים חדשים',
                text: 'הגדירו הודעת וואטסאפ ראשונה תמציתית המזדהה בשם העסק, מציעה ערך מיידי ומאפשרת הסרה קלה (Opt-out) בהקלדת המילה "הסר". תבנית כזו שומרת על ציון איכות גבוה ב-Meta ומונעת חסימות.',
                actionSteps: [
                    'בדקו שכל הודעה ראשונה מכילה את שם העסק באופן ברור.',
                    'הוסיפו אפשרות הסרה נוחה ומכבדת.',
                    'חברו את התבנית לאוטומציית שליחה ב-AltruBiz CRM תוך 60 שניות מרגע הפנייה.'
                ]
            },
            sections: [
                {
                    id: 'meta-policy',
                    title: '1. מדיניות Meta ומניעת חסימות וואטסאפ עסקי',
                    subtitle: 'איך לפעול נכון בלי לסכן את המספר העסקי שלכם',
                    content: [
                        'Meta מחמירה מאוד בנוגע לאיכות התקשורת בוואטסאפ. שליחת הודעות לא רלוונטיות, דיווחים מצד נמענים או היעדר אפשרות הסרה עלולים להוביל להורדת דירוג האיכות של המספר עד לחסימתו המלאה.',
                        'במדריך המלא שלנו ריכזנו את כל הכללים: שמירה על Opt-in מפורש, עבודה עם תבניות מאושרות, ומרווחי זמן נכונים ששומרים על המספר שלכם בטוח לחלוטין.'
                    ],
                    relatedArticleSlugs: ['whatsapp-messaging-guidelines']
                },
                {
                    id: 'speed-to-lead',
                    title: '2. וואטסאפ כערוץ מענה ראשוני ב-5 הדקות הראשונות',
                    subtitle: 'איך ליד שמשאיר פרטים מקבל שיחה חמה תוך שניות',
                    content: [
                        'כאשר לקוח משאיר פרטים באתר, הודעת WhatsApp מיידית יוצרת חוויית "וואו" שמבדילה אתכם מכל שאר המתחרים.',
                        'ההודעה אינה צריכה להיות ארוכה או מעיקה: ברכת שלום קצרה, אימות הפנייה ושאלת המשך פשוטה שפותחת דיאלוג מיידי.'
                    ],
                    relatedArticleSlugs: ['lead-first-5-minutes-guide', 'missed-call-text-back-guide']
                },
                {
                    id: 'unified-inbox-whatsapp',
                    title: '3. ריכוז הוואטסאפ ב-Unified Inbox לצד שאר הערוצים',
                    subtitle: 'שליטה מלאה של כל הצוות ממסך אחד בלי כפילויות מענה',
                    content: [
                        'כאשר מספר נציגים עובדים על אותו קו וואטסאפ, חובה להשתמש בתיבת דואר אחודה המאפשרת שיוך שיחות לנציגים, הוספת הערות פנימיות וצפייה בהיסטוריית הלקוח המלאה.',
                        'כך נמנע המצב המביך שבו שני נציגים עונים תשובות שונות לאותו לקוח בו-זמנית.'
                    ],
                    relatedArticleSlugs: ['omnichannel-communication-unified-inbox-crm-guide', 'crm-quick-wins-guide']
                }
            ],
            solutionPaths: [
                {
                    title: 'חיבור WhatsApp רשמי ואוטומציות מלאות ב-AltruBiz',
                    description: 'חיבור ישיר לממשק WhatsApp Cloud API הרשמי של Meta עם מספר משתמשים ללא הגבלה, מסעות אוטומטיים ותיבת הודעות אחודה.',
                    featureHighlights: [
                        'חיבור רשמי מאובטח למניעת חסימות',
                        'תיעוד מלא ואוטומטי של כל השיחות בכרטיס הלקוח',
                        'שליחת תזכורות אוטומטיות לפגישות ומניעת No-Show',
                        'מספר בלתי מוגבל של נציגים על אותו קו וואטסאפ ללא עלות נוספת לפי מושב'
                    ]
                }
            ],
            faqs: [
                {
                    question: 'מה ההבדל בין אפליקציית WhatsApp Business הרגילה לבין חיבור CRM רשמי?',
                    answer: 'אפליקציית WhatsApp Business מוגבלת למכשירים ספורים, אינה מאפשרת אוטומציות מורכבות ומנותקת מניהול הלידים והמכירות בעסק. חיבור CRM רשמי (WhatsApp Cloud API) מאפשר ריבוי משתמשים, מסעות אוטומטיים, סנכרון היסטוריה מלא בכרטיס הלקוח ושליטה ניהולית מלאה.'
                },
                {
                    question: 'איך נמנעים מחסימת מספר הוואטסאפ ב-Meta?',
                    answer: 'הקפידו על שלושה כללי ברזל: 1. שליחה רק לנמענים שנתנו הסכמה מפורשת (Opt-in). 2. הוספת אפשרות הסרה פשוטה ומכבדת בכל הודעה יזומה. 3. ניסוח הודעות מותאמות אישית בעלות ערך אמיתי, ללא שפה שיווקית אגרסיבית.'
                },
                {
                    question: 'האם ניתן לשלוח תזכורות לפגישות בוואטסאפ באופן אוטומטי ב-AltruBiz?',
                    answer: 'כן. AltruBiz שולחת אוטומטית תזכורות מותאמות אישית יום לפני הפגישה ושעתיים לפני השעה שנקבעה, כולל קישור ליומן או לזום, מה שמפחית את שיעור ההברזות מפגישות בלמעלה מ-70%.'
                }
            ]
        }
    }
};

/**
 * Helper query functions for the Knowledge Graph
 */
export function getKnowledgeNodeBySlug(slug: string): KnowledgeNode | undefined {
    return Object.values(KNOWLEDGE_NODES).find(node => node.slug === slug);
}

export function getAllHubs(): KnowledgeNode[] {
    return Object.values(KNOWLEDGE_NODES).filter(node => node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub');
}

export function getHubsForPain(painId: string): KnowledgeNode[] {
    return Object.values(KNOWLEDGE_NODES).filter(
        node => (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub') && 
                (node.primaryPain === painId || node.secondaryPains?.includes(painId))
    );
}

export function getParentHubForArticle(articleSlug: string): KnowledgeNode | undefined {
    // Check which hub includes this article
    return Object.values(KNOWLEDGE_NODES).find(
        node => (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub') &&
                node.relatedArticleSlugs?.includes(articleSlug)
    );
}
