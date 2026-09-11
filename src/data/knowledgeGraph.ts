/**
 * AltruBiz Knowledge Graph & Topology Registry
 * 
 * Single source of truth for the connected knowledge graph, multi-dimensional taxonomy,
 * business situations, concepts, capabilities, journey stages, hubs, and bidirectional relationships.
 */

export type NodeType = 
    | 'business_situation' 
    | 'symptom' 
    | 'topic' 
    | 'concept' 
    | 'capability' 
    | 'journey_stage' 
    | 'article' 
    | 'guide' 
    | 'assessment' 
    | 'solution' 
    | 'product' 
    | 'home' 
    | 'pain_hub' 
    | 'micro_hub';

export type NextActionType = 
    | 'contact' 
    | 'meeting' 
    | 'whatsapp' 
    | 'pricing' 
    | 'assessment' 
    | 'guide' 
    | 'concept' 
    | 'capability' 
    | 'solution' 
    | 'share';

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
    hasPublicPage: boolean;
    title: string;
    shortLabel?: string;
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
    relevantNextActions?: NextActionType[];
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
        hubSlug: 'whatsapp-in-crm'
    },
    'sales-pipeline-crm-adoption': {
        id: 'sales-pipeline-crm-adoption',
        name: 'תהליך מכירה לא מסודר ועובדים שלא מעדכנים CRM',
        description: 'אנשי מכירות חוזרים לרשימות פרטיות ומחברות כי המערכת נבנתה ככלי מעקב מעיק במקום כלי עבודה.',
        hubSlug: 'sales-pipeline'
    },
    'business-memory': {
        id: 'business-memory',
        name: 'אובדן זיכרון ארגוני ותיעוד לקוחות',
        description: 'מידע עסקי והיסטוריית לקוח נשארים בראש של העובד או בוואטסאפ האישי ואובדים כשהצוות מתחלף.',
        hubSlug: 'business-memory'
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
        hasPublicPage: true,
        title: 'לידים נופלים בין הכיסאות: המדריך לאבחון, עצירת נטישה וסגירת עסקאות',
        shortLabel: 'לידים שנופלים בין הכיסאות',
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
        recommendedNextSlugs: ['whatsapp-in-crm', 'sales-pipeline', 'salespeople-hate-crm-adoption-guide'],
        relevantNextActions: ['meeting', 'whatsapp', 'pricing', 'guide', 'assessment'],
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
        hasPublicPage: true,
        title: 'וואטסאפ ב-CRM: איך לחבר את הערוץ הכי חזק בעסק לסיסטם אוטומטי ובטוח',
        shortLabel: 'וואטסאפ ב-CRM',
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
        recommendedNextSlugs: ['lost-leads', 'business-memory', 'omnichannel-communication-unified-inbox-crm-guide'],
        relevantNextActions: ['meeting', 'whatsapp', 'pricing', 'guide', 'assessment'],
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
    },

    // ==========================================
    // 3. PAIN HUB: Sales Pipeline
    // ==========================================
    'hub-sales-pipeline': {
        id: 'hub-sales-pipeline',
        slug: 'sales-pipeline',
        url: '/topics/sales-pipeline',
        nodeType: 'pain_hub',
        hasPublicPage: true,
        title: 'תהליך מכירה ופייפליין חזותי: המדריך המעשי לבניית משפך שלא תלוי בזיכרון',
        shortLabel: 'פייפליין ותהליך מכירה',
        subtitle: 'איך לבנות משפך מכירות ברור, לחבר מעברי שלבים חכמים ולהעביר את הצוות ממחברות ואקסלים למערכת CRM שמייצרת תוצאות',
        seoTitle: 'תהליך מכירה ופייפליין CRM: מדריך מעשי לניהול משפך עסקאות | AltruBiz',
        description: 'מדריך מעשי לבניית תהליך מכירה ופייפליין חזותי ב-CRM: הגדרת שלבים מנצחים, מניעת צווארי בקבוק, שיטות אימוץ לצוות ומעבר מנוהל ידני לסיסטם עבודה מנצח.',
        primaryPain: 'sales-pipeline-crm-adoption',
        secondaryPains: ['lost-leads', 'repetitive-manual-work'],
        userIntent: 'איך לבנות פייפליין מכירות נכון ב-CRM, לשפר אימוץ של אנשי מכירות ולנהל עסקאות בשלבים ברורים',
        processes: ['ניהול משפך מכירות', 'הסמכת עסקאות', 'בקרת שלבים', 'פולואפ מכירות'],
        channels: ['טלפון', 'WhatsApp', 'פגישות'],
        technologies: ['Visual Pipeline CRM', 'אוטומציות מעברי שלבים', 'לוחות בקרה'],
        businessObjects: ['עסקאות (Opportunities)', 'שלבי פייפליין', 'משימות מעקב', 'יעדי מכירות'],
        outcomes: ['שליטה בהכנסות הצפויות', 'אפס עסקאות שנשכחות', 'אימוץ מלא של אנשי המכירות'],
        relevantProducts: ['AltruBiz CRM', 'פייפליין מכירות חזותי', 'אוטומציות מעקב שלבים'],
        recommendedNextSlugs: ['lost-leads', 'business-memory', 'repetitive-manual-work'],
        relatedArticleSlugs: [
            'excel-to-crm-pipeline-guide',
            'salespeople-hate-crm-adoption-guide',
            'crm-adoption-thursday-test-guide',
            'follow-up-tasks-crm-guide',
            'crm-quick-wins-guide'
        ],
        relevantNextActions: ['meeting', 'whatsapp', 'pricing', 'guide', 'assessment'],
        availableCtas: ['meeting', 'pricing', 'whatsapp'],
        isIndexable: true,
        maturity: 'canonical',
        dateCreated: '2026-09-10',
        dateUpdated: '2026-09-10',
        hubData: {
            problemDefinition: 'תהליך מכירה ללא פייפליין חזותי מנוהל כרצף שיחות ומחברות פרטיות. עסקאות נתקעות ללא שלב ברור, מנהלים לא יודעים מה הצפי לסוף החודש, ואנשי המכירות רואים ב-CRM "עול דיווח" במקום כלי שמייצר להם עמלות.',
            whyItHappens: [
                'מערכות שנבנות ככלי פיקוח מעיק: דרישה למילוי עשרות שדות חובה מייאשת את אנשי המכירות ודוחפת אותם חזרה למחברות.',
                'היעדר הגדרת שלבים חדה: שימוש בשלבים עמומים כגון "בטיפול" במקום פעולות מוגדרות עם תאריך יעד והגדרה ברורה של מעבר שלב.',
                'פער בין שיחות המכירה לעדכון: שיחות מתנהלות בנייד או בוואטסאפ ללא תיעוד אוטומטי בכרטיס העסקה.',
                'חוסר מעקב אחרי הצעות מחיר: שולחים הצעה, הלקוח מבקש לחשוב, ואין משימת תזכורת אוטומטית שקופצת לנציג.'
            ],
            businessCost: [
                'אי-יכולת לחזות הכנסות ותזרים חודשי עקב היעדר תמונת מצב אמינה על עסקאות בצנרת.',
                'בריחת עסקאות גדולות שנשכחות בין שלב ההצעה לשלב הסגירה ללא פולואפ מסודר.',
                'תלות מוחלטת באיש המכירות הספציפי – אם הוא אינו נוכח, איש בארגון אינו יודע היכן הדברים עומדים.'
            ],
            symptoms: [
                'בישיבת צוות מנהל שואל "איפה עומדת ההצעה של חברת X?" והנציג עונה "אני צריך לבדוק ביומן או במייל".',
                'עסקאות יושבות שבועות ארוכים באותו שלב ללא תזוזה וללא תאריך יעד מוגדר.',
                'אנשי מכירות מנהלים את העסקאות הפעילות על פתקים דביקים או באקסלים נפרדים.',
                'מנהל העסק מופתע בסוף החודש מנפח הכנסות נמוך חרף תחושה של "המון שיחות טובות".'
            ],
            diagnosticQuestions: [
                {
                    question: 'האם כל איש מכירות בעסק יודע בכל רגע נתון בדיוק כמה עסקאות פתוחות יש לו ומה הצעד הבא בכל אחת?',
                    warningSign: 'מסתמכים על זיכרון, דפים או חיפוש בהודעות וואטסאפ.',
                    impact: 'עסקאות בשווי עשרות ומאות אלפי שקלים מתאדות ללא מעקב שיטתי.'
                },
                {
                    question: 'כמה שדות חובה נדרש נציג למלא כדי ליצור עסקה חדשה או להעביר אותה שלב?',
                    warningSign: 'יותר מ-3 שדות בכל שלב.',
                    impact: 'הצוות מפסיק לעדכן את המערכת וה-CRM הופך למאגר נתונים ישן שאינו משקף את המציאות.'
                },
                {
                    question: 'מה קורה לעסקה שנשלחה אליה הצעת מחיר ועברו 48 שעות ללא מענה מהלקוח?',
                    warningSign: 'שום פעולה יזומה – ממתינים שהנציג יזכור להתקשר בעצמו.',
                    impact: 'המומנטום של העסקה מתפוגג ואחוזי הסגירה יורדים בחדות.'
                }
            ],
            primaryQuickWin: {
                title: 'צמצום הפייפליין ל-4 שלבים חדים וביטול שדות חובה מעיקים',
                text: 'בנו פייפליין רזה: "חדש" -> "פגישה נקבעה" -> "הצעת מחיר" -> "זכייה / הפסד". בטלו כל שדה שאינו חיוני להשלמת השיחה. כשהמערכת דורשת רק 10 שניות לעדכון, שיעור האימוץ של הצוות מזנק.',
                actionSteps: [
                    'מחקו שלבים מעורפלים כגון "בטיפול", "בבדיקה" או "ממתין לתשובה".',
                    'הגדירו לכל שלב פעולת מעבר ברורה (למשל: נשלחה הצעה = מעבר לשלב הצעת מחיר).',
                    'קבעו כלל עבודה: אין עסקה פתוחה ללא משימת תזכורת פעילה ביומן.'
                ]
            },
            sections: [
                {
                    id: 'sales-adoption',
                    title: '1. תופעת השטח: למה אנשי מכירות מתעבים מערכות CRM?',
                    subtitle: 'כשה-CRM נבנה כשוט פיקוח במקום כלי עבודה שמייצר עמלות',
                    content: [
                        'רוב מערכות ה-CRM נכשלות לא בגלל טכנולוגיה חלשה, אלא בגלל אפיון יתר שמתעלם מחוויית איש המכירות בשטח.',
                        'כאשר מציגים לנציגים מערכת שחוסכת להם כתיבת הודעות, מזכירה להם למי לחזור ומקצרת את זמן הטיפול בכל עסקה – ההתנגדות נעלמת והופכת לשיתוף פעולה מלא.'
                    ],
                    manifestationId: 'sales-resistance',
                    relatedArticleSlugs: ['salespeople-hate-crm-adoption-guide', 'crm-adoption-thursday-test-guide']
                },
                {
                    id: 'excel-to-pipeline',
                    title: '2. תופעת השטח: מעבר מניהול לידים באקסל לפייפליין חזותי',
                    subtitle: 'לראות את כל העסק במבט-על אחד מבלי לאבד הקשר',
                    content: [
                        'אקסל הוא כלי מצוין לחישובים, אך אסון לניהול תהליכי מכירה. שורות ארוכות ללא התראות, ללא היסטוריית שיחות וללא תמונת שלבים גורמות לעסקאות ליפול בין השורות.',
                        'מעבר ללוח פייפליין חזותי (Kanban) מאפשר לגרור עסקאות משלב לשלב, לראות את צווארי הבקבוק בשניות ולחבר אוטומציות בכל מעבר שלב.'
                    ],
                    manifestationId: 'excel-chaos',
                    relatedArticleSlugs: ['excel-to-crm-pipeline-guide', 'crm-quick-wins-guide']
                },
                {
                    id: 'follow-up-system',
                    title: '3. תופעת השטח: פולואפ מסודר ומניעת שקיעת הצעות מחיר',
                    subtitle: 'רוב העסקאות נסגרות בפולואפ החמישי – אך ננטשות כבר בראשון',
                    content: [
                        'מרבית אנשי המכירות מוותרים אחרי ניסיון התקשרות אחד או שניים. לקוחות אינם מסרבים – הם פשוט עסוקים.',
                        'בניית מנגנון פולואפ שיטתי ב-CRM המשלב משימות נציג עם הודעות WhatsApp עדינות מבטיחה נוכחות מקצועית עד לקבלת החלטה סופית.'
                    ],
                    manifestationId: 'forgotten-follow-up',
                    relatedArticleSlugs: ['follow-up-tasks-crm-guide']
                }
            ],
            solutionPaths: [
                {
                    title: 'פייפליין מכירות חזותי ב-AltruBiz CRM',
                    description: 'לוח עסקאות חזותי גמיש ומהיר, עם חיבור אוטומטי ל-WhatsApp, תזכורות פולואפ אוטומטיות ואפס שדות מיותרים.',
                    featureHighlights: [
                        'לוח Kanban אינטואיטיבי עם גרירת עסקאות ומעבר שלבים מהיר',
                        'יצירת משימות פולואפ אוטומטיות לכל שלב למניעת שכחה',
                        'שליחת הודעות וואטסאפ ותבניות מתוך כרטיס העסקה בקליק אחד',
                        'דוחות המרה שקופים שמראים בדיוק איפה עסקאות נתקעות'
                    ]
                }
            ],
            faqs: [
                {
                    question: 'איך גורמים לאנשי מכירות לעדכן את ה-CRM מרצונם החופשי?',
                    answer: 'המפתח הוא תועלת אישית מיידית: כשה-CRM מקל על חייהם (שולח הודעות מוכנות, מתאם פגישות ומזכיר מתי לחזור) במקום רק לדרוש דיווחים, הנציגים מבינים שהמערכת מגדילה להם את העמלות ומאמצים אותה ברצון.'
                },
                {
                    question: 'כמה שלבים צריכים להיות בפייפליין מכירות אידיאלי?',
                    answer: 'בעסקים קטנים ובינוניים מומלץ להתחיל עם 4 עד 6 שלבים ברורים בלבד. כל שלב חייב לייצג פעולה מוכחת ולא סטטוס פסיבי. שלבים מועטים ומדויקים מקלים על המעקב ומונעים בלבול.'
                },
                {
                    question: 'מה ההבדל בין ניהול לידים באקסל לניהול פייפליין ב-CRM?',
                    answer: 'אקסל הוא רשימה סטטית ללא זיכרון פעיל, ללא התראות וללא חיבור לערוצי התקשורת. פייפליין ב-CRM מניע תהליכים: הוא מתזכר נציגים, שולח הודעות אוטומטיות, מתעד שיחות ומספק תמונת מצב חיה על שווי העסקאות בכל שלב.'
                }
            ]
        }
    },

    // ==========================================
    // 4. PAIN HUB: Business Memory
    // ==========================================
    'hub-business-memory': {
        id: 'hub-business-memory',
        slug: 'business-memory',
        url: '/topics/business-memory',
        nodeType: 'pain_hub',
        hasPublicPage: true,
        title: 'זיכרון ארגוני ותיעוד לקוחות: איך להפסיק לאבד מידע קריטי כשהעובדים מתחלפים',
        shortLabel: 'זיכרון ארגוני ותיעוד לקוחות',
        subtitle: 'מרכזים את כל היסטוריית השיחות, הוואטסאפים והסיכומים בכרטיס לקוח אחוד – כך שהעסק שלכם שומר על נכס המידע שלו לנצח',
        seoTitle: 'זיכרון ארגוני ותיעוד לקוחות ב-CRM: מניעת אובדן מידע עסקי | AltruBiz',
        description: 'מדריך אבחון ושיטות עבודה לשימור הזיכרון הארגוני בעסק: ריכוז שיחות והתכתבויות, מניעת כפילויות אנשי קשר, והעברת מקל חלקה כשהצוות מתחלף.',
        primaryPain: 'scattered-customer-communication',
        secondaryPains: ['sales-pipeline-crm-adoption', 'repetitive-manual-work'],
        userIntent: 'איך לשמור על היסטוריית לקוחות, למנוע אובדן מידע כשהעובד עוזב ולמנוע כפילויות אנשי קשר',
        processes: ['תיעוד לקוחות', 'העברת מקל בין עובדים', 'מניעת כפילויות', 'שירות לקוחות מתמשך'],
        channels: ['WhatsApp', 'טלפון', 'Email'],
        technologies: ['Unified Contact Card', 'Smart Deduplication', 'Audit Trail'],
        businessObjects: ['כרטיס איש קשר (Contact)', 'ציר זמן (Timeline)', 'הערות פנימיות', 'היסטוריית רכישות'],
        outcomes: ['שימור הידע בבעלות העסק', 'העברת לקוח מיידית בין נציגים', 'אפס כפילויות ובלגן בדאטה'],
        relevantProducts: ['AltruBiz CRM', 'כרטיס לקוח אחוד 360', 'מנגנון מניעת כפילויות חכם'],
        recommendedNextSlugs: ['whatsapp-in-crm', 'sales-pipeline', 'lost-leads'],
        relatedArticleSlugs: [
            'business-memory-crm-guide',
            'crm-duplicate-contacts-prevention-guide',
            'omnichannel-communication-unified-inbox-crm-guide',
            'client-onboarding-process-guide'
        ],
        relevantNextActions: ['meeting', 'whatsapp', 'pricing', 'guide', 'assessment'],
        availableCtas: ['meeting', 'pricing', 'whatsapp'],
        isIndexable: true,
        maturity: 'canonical',
        dateCreated: '2026-09-10',
        dateUpdated: '2026-09-10',
        hubData: {
            problemDefinition: 'הזיכרון הארגוני הוא הנכס היקר ביותר בעסק: מידע על העדפות לקוח, סיכומים מסחריים והבטחות שניתנו. כשהמידע כלוא בראשי העובדים או בהודעות וואטסאפ פרטיות, כל עזיבת עובד או חופשה מוחקת חלק מהעסק ומייצרת נזק ישיר למכירות ולשירות.',
            whyItHappens: [
                'תיעוד מפוזר בערוצים אישיים: שיחות בוואטסאפ הפרטי של הנציג ומיילים בתיבות אישיות שאינן נגישות לשאר הצוות.',
                'היעדר כרטיס לקוח יחיד ומסונכרן: לקוח פונה שוב ומקבל מענה כאילו זו פנייתו הראשונה בעסק.',
                'היווצרות כפילויות רבות: אותו לקוח מוזן מספר פעמים בשמות או טלפונים שונים, מה שקורע את ציר הזמן.',
                'חוסר נוהל מסירה וקליטה (Handover): כשעובד מסיים את תפקידו, אין תהליך שיטתי להעברת תיקי הלקוחות למחליפו.'
            ],
            businessCost: [
                'פגיעה חמורה באמון הלקוח כשהוא נדרש לחזור על סיפורו מול כל נציג חדש.',
                'אובדן עסקאות חוזרות (Retention) בגלל חוסר מעקב אחר התחייבויות קודמות.',
                'בזבוז שעות עבודה שבועיות בחיפוש סיכומים, הצעות ישנות והתכתבויות במכשירים פרטיים.'
            ],
            symptoms: [
                'לקוח ותיק מתקשר והנציג שואל אותו "ספר לי במה מדובר, לא מופיע לי כלום".',
                'עובד יוצא לחופשה או עוזב והטיפול בלקוחותיו נעצר לחלוטין.',
                'חיפוש שם לקוח בתוכנה מציג 4 כרטיסים שונים עם נתונים סותרים.',
                'מנהלים מגלים הבטחות ומחירים מיוחדים שניתנו ללקוח רק כשהוא מציג צילום מסך מוואטסאפ פרטי.'
            ],
            diagnosticQuestions: [
                {
                    question: 'אם נציג שירות או מכירות מוביל עוזב מחר בבוקר – האם כל ההיסטוריה והסיכומים שלו נשארים בעסק בצורה נגישה?',
                    warningSign: 'המידע שמור בטלפון הנייד שלו או בזיכרונו האישי בלבד.',
                    impact: 'העסק מאבד לקוחות ונכסי ידע מסחריים שנבנו במשך חודשים ושנים.'
                },
                {
                    question: 'כשללקוח יש שאלה דחופה והנציג האישי שלו אינו זמין – האם כל נציג אחר יכול להמשיך את השיחה בדיוק מאותה נקודה?',
                    warningSign: 'אומרים ללקוח "תמתין שיחזור מהחופש, רק הוא מכיר את התיק".',
                    impact: 'תסכול עמוק של הלקוח ופגיעה ישירה במוניטין המקצועי של העסק.'
                },
                {
                    question: 'האם קיימת במערכת בדיקה אוטומטית שמונעת פתיחת כרטיס כפול לאותו לקוח?',
                    warningSign: 'יש כפילויות רבות ואין מנגנון איחוד אוטומטי.',
                    impact: 'מידע מקוטע, הצעות סותרות והטרדה של לקוחות בפניות כפולות.'
                }
            ],
            primaryQuickWin: {
                title: 'איחוד כל מספרי הטלפון והוואטסאפ לכרטיס לקוח יחיד והפעלת זיהוי כפילויות',
                text: 'הגדירו כלל מרכזי: מספר טלפון הוא המזהה החד-ערכי של הלקוח. כל שיחה, הודעת וואטסאפ, טופס והזמנה מתנקזים אוטומטית לציר זמן אחד שגלוי לכל מורשי הגישה בעסק.',
                actionSteps: [
                    'סרקו את מאגר אנשי הקשר ובצעו איחוד כפילויות ראשוני.',
                    'הגדירו חובת תיעוד סיכום שיחה תמציתי (עד 2 משפטים) בכרטיס הלקוח.',
                    'חברו את קווי הוואטסאפ העסקיים למערכת ה-CRM המרכזית.'
                ]
            },
            sections: [
                {
                    id: 'employee-departure',
                    title: '1. תופעת השטח: העובד עזב ולקח איתו את כל הידע על הלקוחות',
                    subtitle: 'למה עסקים מגלים באיחור שהלקוחות היו קשורים לנציג ולא למערכת',
                    content: [
                        'כאשר הקשר מול הלקוח מתנהל באופן פרטי, הלקוח מרגיש נאמנות לנציג ולא לחברה. כשהנציג עוזב, הלקוחות עשויים לעזוב יחד איתו.',
                        'ריכוז כל המידע בכרטיס לקוח ששייך לחברה מגן על הזיכרון הארגוני ומאפשר לכל נציג חדש להיכנס לתמונה ברמת בקיאות מושלמת.'
                    ],
                    manifestationId: 'lost-institutional-knowledge',
                    relatedArticleSlugs: ['business-memory-crm-guide']
                },
                {
                    id: 'duplicate-contacts',
                    title: '2. תופעת השטח: כפילויות אנשי קשר ופיצול היסטוריה',
                    subtitle: 'אותו לקוח מופיע 3 פעמים בעסק – בכל פעם עם מספר או מייל שונה',
                    content: [
                        'כפילויות נוצרות כשלקוח משאיר פרטים בקמפיין, מתקשר ממספר אחר וכותב גם בוואטסאפ. ללא מנגנון איחוד חכם, המידע מתפצל לשלושה כרטיסים נפרדים.',
                        'מערכת CRM חכמה מזהה הצלבות של טלפון ומייל, מאחדת את הנתונים לציר זמן אחד ומבטיחה שהצוות רואה תמונה מלאה ונקייה.'
                    ],
                    manifestationId: 'contact-duplication-chaos',
                    relatedArticleSlugs: ['crm-duplicate-contacts-prevention-guide']
                },
                {
                    id: 'onboarding-handoff',
                    title: '3. תופעת השטח: קליטת לקוח חדש (Onboarding) ללא תיעוד',
                    subtitle: 'המעבר בין שלב המכירה לשלב השירות: החור השחור של המידע',
                    content: [
                        'הרגע המסוכן ביותר בחיי לקוח הוא המעבר מאיש המכירות שסגר את העסקה לצוות השירות או התפעול שצריך לספק את העבודה.',
                        'אם ההבטחות, הדגשים המיוחדים והמסמכים אינם מתועדים במקום אחד, הלקוח חווה ירידה מיידית ברמת השירות ומפתח חרטת קנייה.'
                    ],
                    manifestationId: 'onboarding-blindspot',
                    relatedArticleSlugs: ['client-onboarding-process-guide', 'omnichannel-communication-unified-inbox-crm-guide']
                }
            ],
            solutionPaths: [
                {
                    title: 'כרטיס לקוח אחוד 360 ב-AltruBiz CRM',
                    description: 'ציר זמן מלא של כל שיחות הטלפון, הודעות הוואטסאפ, המיילים, המסמכים וההערות הפנימיות במקום אחד מסודר.',
                    featureHighlights: [
                        'ציר זמן מרכזי שמתעד כל אינטראקציה עם הלקוח באופן אוטומטי',
                        'מנגנון מניעת כפילויות חכם שמתריע ומאחד נתונים אוטומטית',
                        'הערות פנימיות ותיוג עובדים בתוך כרטיס הלקוח להעברת משימות',
                        'הרשאות גישה מדורגות לשמירה על אבטחת מידע ופרטיות'
                    ]
                }
            ],
            faqs: [
                {
                    question: 'איך מרגילים את הצוות לתעד שיחות באופן קבוע?',
                    answer: 'מפשטים את התהליך למינימום האפשרי: במקום דוחות ארוכים, מאפשרים הקלטת שיחות אוטומטית, תיעוד וואטסאפ מובנה ושדה הערה קצר של משפט אחד בלבד בסיום שיחה.'
                },
                {
                    question: 'מה קורה אם לקוח פונה ממספר טלפון חדש שלא מופיע במערכת?',
                    answer: 'המערכת מאפשרת בלחיצת כפתור אחת לחבר את המספר החדש לכרטיס הלקוח הקיים, מבלי לפתוח כרטיס חדש ומבלי לאבד את ההיסטוריה הקודמת.'
                },
                {
                    question: 'האם תיעוד מסודר באמת מפחית עזיבת לקוחות?',
                    answer: 'חד-משמעית כן. לקוח שמרגיש שמכירים אותו, זוכרים את העדפותיו ואינם מבקשים ממנו לחזור על דבריו חווה שירות ברמה פרימיום ונשאר נאמן לעסק לאורך זמן.'
                }
            ]
        }
    },

    // ==========================================
    // 5. PAIN HUB: Repetitive Manual Work
    // ==========================================
    'hub-repetitive-manual-work': {
        id: 'hub-repetitive-manual-work',
        slug: 'repetitive-manual-work',
        url: '/topics/repetitive-manual-work',
        nodeType: 'pain_hub',
        hasPublicPage: true,
        title: 'עבודה ידנית שחוזרת על עצמה: המדריך לשחרור צווארי בקבוק באמצעות אוטומציות חכמות',
        shortLabel: 'עבודה ידנית שחוזרת על עצמה',
        subtitle: 'תיאום פגישות, תזכורות למניעת הברזות, איסוף מסמכים ומרדף אחרי משימות – כך תפנו שעות יקרות של הצוות לעבודה שמייצרת הכנסה',
        seoTitle: 'אוטומציה עסקית וביטול עבודה ידנית: שחרור צווארי בקבוק | AltruBiz',
        description: 'מדריך לאבחון וחיסול עבודה ידנית שחוזרת על עצמה: אוטומציית תיאום פגישות, מניעת No-Show, איסוף מסמכים בקליטת לקוח ומעבר חכם לבינה מלאכותית.',
        primaryPain: 'repetitive-manual-work',
        secondaryPains: ['lost-leads', 'sales-pipeline-crm-adoption'],
        userIntent: 'איך לחסוך שעות עבודה ידנית בעסק, לתאם פגישות באוטומציה ולמנוע הברזות של לקוחות',
        processes: ['תיאום פגישות אוטומטי', 'תזכורות ומניעת No-Show', 'קליטת לקוחות ומסמכים', 'אוטומציית משימות'],
        channels: ['WhatsApp', 'יומנים (Google / Outlook)', 'SMS', 'טפסים'],
        technologies: ['Smart Booking Calendars', 'Automated Workflows', 'AI Assistant'],
        businessObjects: ['פגישות (Appointments)', 'יומנים', 'תזכורות', 'תהליכי עבודה (Workflows)'],
        outcomes: ['חיסכון של 10-20 שעות שבועיות', 'צמצום הברזות מפגישות בלמעלה מ-70%', 'תגובה מיידית ללא מעמס אנושי'],
        relevantProducts: ['AltruBiz CRM', 'יומן תיאום פגישות אוטומטי', 'בוט AI לקביעת פגישות'],
        recommendedNextSlugs: ['lost-leads', 'whatsapp-in-crm', 'sales-pipeline'],
        relatedArticleSlugs: [
            'automated-meeting-scheduling-guide',
            'preventing-meeting-no-shows-guide',
            'client-onboarding-process-guide',
            'non-technical-to-ai-automation-guide',
            'customer-reviews-reputation-crm-guide'
        ],
        relevantNextActions: ['meeting', 'whatsapp', 'pricing', 'guide', 'assessment'],
        availableCtas: ['meeting', 'pricing', 'whatsapp'],
        isIndexable: true,
        maturity: 'canonical',
        dateCreated: '2026-09-10',
        dateUpdated: '2026-09-10',
        hubData: {
            problemDefinition: 'עבודה ידנית סיזיפית – פינג-פונג של "מתי נוח לך להיפגש?", שליחת תזכורות ידניות, העתקת נתונים בין מערכות ומרדף אחרי איסוף מסמכים – גוזלת שעות ניהוליות יקרות, שוחקת את הצוות ומייצרת טעויות אנוש בלתי נמנעות.',
            whyItHappens: [
                'חוסר חיבור בין היומן לתקשורת: תיאום פגישות נעשה בהודעות טקסט ידניות במקום שליחת קישור ליומן מסונכרן.',
                'היעדר תזכורות אוטומטיות: לקוחות שוכחים מפגישות שנקבעו שבוע מראש כי איש אינו שולח תזכורת בזמן.',
                'איסוף מסמכים ידני בקליטת לקוח: שליחת הודעות אישיות בבקשת קבצים במקום טופס העלאה דיגיטלי מובנה.',
                'חשש מורכבות טכנולוגית: תפיסה מוטעית שאוטומציה דורשת מתכנתים יקרים או ידע טכני מורכב.'
            ],
            businessCost: [
                'בזבוז של 10 עד 20 שעות עבודה שבועיות של עובדים יקרים על משימות פקידותיות שניתנות לאוטומציה.',
                'הפסד כספי ישיר מביטולי פגישות של הרגע האחרון (No-Show) ללא מילוי המשבצת ביומן.',
                'עיכוב באספקת שירותים ובגביית תשלומים בגלל צווארי בקבוק באיסוף פרטים ומסמכים.'
            ],
            symptoms: [
                'נציגים מתכתבים 6 פעמים כדי לקבוע שעה אחת לפגישת זום או פגישה פרונטלית.',
                'יומן הפגישות מלא אך 30% מהלקוחות לא מגיעים לפגישה שנקבעה.',
                'עובדים מתלוננים ש"אין זמן למכור או לתת שירות כי טבועים בבירוקרטיה והעתקות נתונים".',
                'איסוף חומרים מלקוח חדש נמשך שבועות ארוכים ודורש תזכורות ידניות מתישות.'
            ],
            diagnosticQuestions: [
                {
                    question: 'כמה שעות שבועיות משקיע הצוות בתיאום פגישות, שליחת תזכורות והעתקת נתונים?',
                    warningSign: 'יותר מ-5 שעות בשבוע לכל עובד.',
                    impact: 'העסק משלם משכורות על עבודה פקידותית במקום על צמיחה, מכירות ופיתוח עסקי.'
                },
                {
                    question: 'מה שיעור הלקוחות שאינם מגיעים לפגישות שנקבעו אצלכם (No-Show)?',
                    warningSign: 'מעל 15% מהפגישות מתבטלות או שהלקוח פשוט לא מופיע.',
                    impact: 'בזבוז זמן יקר של מנהלים ומומחים וחור של אלפי שקלים בהכנסות החודשיות.'
                },
                {
                    question: 'האם תהליך קליטת לקוח חדש (איסוף פרטים, פתיחת תיק, שליחת חומרי פתיחה) מתבצע אוטומטית?',
                    warningSign: 'הכול ידני ותלוי בזיכרון של עובד ספציפי.',
                    impact: 'עיכובים, טעויות בהזנת נתונים וחוויית לקוח ראשונית מאכזבת.'
                }
            ],
            primaryQuickWin: {
                title: 'מעבר ליומן תיאום פגישות אוטומטי עם תזכורת WhatsApp דו-שלבית',
                text: 'חברו קישור יומן חכם (Calendar) המציג ללקוח רק משבצות פנויות ומאפשר לו לבחור מועד ב-30 שניות. ברגע התיאום נשלחת הודעת אישור, ותזכורת מותאמת אישית מגיעה 24 שעות ושעתיים לפני המועד.',
                actionSteps: [
                    'פתחו יומן תיאום פגישות אינטרנטי מסונכרן ליומן העבודה שלכם ב-AltruBiz.',
                    'הגדירו תזכורת וואטסאפ אוטומטית יום לפני הפגישה עם כפתור אישור הגעה.',
                    'החליפו את שיחות הפינג-פונג בשליחת קישור היומן ללקוח.'
                ]
            },
            sections: [
                {
                    id: 'scheduling-ping-pong',
                    title: '1. תופעת השטח: פינג-פונג תיאום פגישות ובזבוז שעות בשיחות סרק',
                    subtitle: 'למה עסק מבזבז 5 שיחות רק כדי למצוא משבצת פנויה ביומן',
                    content: [
                        'תיאום פגישות ידני הוא אחד מזללני הזמן הגדולים ביותר בעסק. שאלות של "מתי נוח לך?", בדיקות יומן ידניות ואי-הבנות גוזלות זמן יקר משני הצדדים.',
                        'שליחת קישור יומן ייעודי שמשקף זמינות חיה מאפשרת ללקוח לתאם בזמן שנוח לו, חוסכת עשרות שיחות סרק ומבטיחה שהפגישה נרשמת מיד ביומן הנכון.'
                    ],
                    manifestationId: 'scheduling-friction',
                    relatedArticleSlugs: ['automated-meeting-scheduling-guide']
                },
                {
                    id: 'no-show-prevention',
                    title: '2. תופעת השטח: לקוחות שלא מגיעים לפגישות שנקבעו (No-Show)',
                    subtitle: 'איך תזכורת WhatsApp אוטומטית מצילה עד 75% מביטולי הפגישות',
                    content: [
                        'לקוחות שמתאמים פגישה שבוע מראש פשוט שוכחים ממנה. כשמנהל או נציג מפנים שעה ביומן והלקוח אינו עונה, נוצר הפסד כספי ומורלי ישיר.',
                        'רצף תזכורות אוטומטי בוואטסאפ הכולל אפשרות שינוי מועד קלה מחזיר את השליטה לעסק ומצמצם את שיעור ההברזות למינימום אפסי.'
                    ],
                    manifestationId: 'no-show-epidemic',
                    relatedArticleSlugs: ['preventing-meeting-no-shows-guide']
                },
                {
                    id: 'practical-ai-automation',
                    title: '3. תופעת השטח: מעבר לאוטומציה ובינה מלאכותית בלי ידע טכני',
                    subtitle: 'מתי שווה להכניס בוט ומתי מספיקה אוטומציה פשוטה',
                    content: [
                        'עסקים רבים נרתעים מבינה מלאכותית כי הם חושבים שמדובר בפרויקט טכנולוגי מסובך ויקר.',
                        'בפועל, אוטומציות פשוטות של מענה, ניתוב שיחות, תזכורות ואיסוף חוות דעת מלקוחות מייצרות 80% מהתועלת בתוך ימים בודדים, ללא צורך בשורת קוד אחת.'
                    ],
                    manifestationId: 'automation-fear',
                    relatedArticleSlugs: ['non-technical-to-ai-automation-guide', 'customer-reviews-reputation-crm-guide', 'client-onboarding-process-guide']
                }
            ],
            solutionPaths: [
                {
                    title: 'סיסטם אוטומציות ויומנים חכמים ב-AltruBiz CRM',
                    description: 'יומני פגישות מסונכרנים, מסעות תזכורת אוטומטיים בוואטסאפ, טפסים דיגיטליים ובוטים לקביעת פגישות שפועלים 24/7.',
                    featureHighlights: [
                        'יומן תיאום פגישות אינטרנטי שמסונכרן דו-כיוונית עם Google ו-Outlook',
                        'תזכורות WhatsApp אוטומטיות דו-שלביות למניעת הברזות (No-Show)',
                        'טפסים דיגיטליים חכמים לקליטת מסמכים וחתימות ישירות לכרטיס הלקוח',
                        'בוט שיחות חכם לתיאום פגישות ראשוניות מסביב לשעון'
                    ]
                }
            ],
            faqs: [
                {
                    question: 'האם לקוחות לא מעדיפים שיתאמו איתם פגישה בטלפון?',
                    answer: 'המציאות מראה את ההפך: רוב הלקוחות מעדיפים לקבל קישור פשוט ולבחור בעצמם את השעה הנוחה להם בשקט ובמהירות, מבלי להיגרר לשיחות טלפון ממושכות באמצע יום עבודה.'
                },
                {
                    question: 'איך אוטומציית תזכורות מונעת הברזה מפגישה?',
                    answer: 'הודעת וואטסאפ אישית שמגיעה שעתיים לפני הפגישה כוללת קישור לזום ואפשרות להודיע מראש אם חל עיכוב. לקוחות שמקבלים תזכורת מכבדת מרגישים מחויבות גבוהה בהרבה ומגיעים בזמן.'
                },
                {
                    question: 'האם נדרש ידע טכני כדי להפעיל אוטומציות ב-AltruBiz?',
                    answer: 'ממש לא. המערכת מגיעה עם תבניות עבודה מוכנות מראש לכל סוגי העסקים. כל האוטומציות נבנות בממשק חזותי פשוט ואינטואיטיבי בעברית מלאה.'
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
    return Object.values(KNOWLEDGE_NODES).filter(node => 
        node.hasPublicPage && (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub' || node.nodeType === 'topic')
    );
}

export function getHubsForPain(painId: string): KnowledgeNode[] {
    return Object.values(KNOWLEDGE_NODES).filter(
        node => (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub' || node.nodeType === 'topic') && 
                (node.primaryPain === painId || node.secondaryPains?.includes(painId))
    );
}

export function getParentHubForArticle(articleSlug: string): KnowledgeNode | undefined {
    // Check which hub includes this article
    return Object.values(KNOWLEDGE_NODES).find(
        node => (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub' || node.nodeType === 'topic') &&
                node.relatedArticleSlugs?.includes(articleSlug)
    );
}

/**
 * Returns all Hubs that reference a given article slug (supports multi-hub articles)
 */
export function getAllHubsForArticle(articleSlug: string): KnowledgeNode[] {
    return Object.values(KNOWLEDGE_NODES).filter(
        node => (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub' || node.nodeType === 'topic') &&
                node.relatedArticleSlugs?.includes(articleSlug)
    );
}

/**
 * Discovers contextually related articles from the Knowledge Graph topology
 */
export function getRelatedArticlesByGraph(articleSlug: string, limit: number = 3): string[] {
    const parentHubs = getAllHubsForArticle(articleSlug);
    const related = new Set<string>();
    
    parentHubs.forEach(hub => {
        (hub.relatedArticleSlugs || []).forEach(slug => {
            if (slug !== articleSlug) {
                related.add(slug);
            }
        });
    });

    return Array.from(related).slice(0, limit);
}

/**
 * Candidate Future Concepts & Micro-Hubs (Data Layer Mapping Only)
 * Unambiguous semantic clusters prepared for future Knowledge Graph expansion.
 * NOT registered as public routes or pages.
 */
export const CANDIDATE_FUTURE_CONCEPTS = {
    'crm-adoption-psychology': {
        slug: 'crm-adoption-psychology',
        title: 'פסיכולוגיית אימוץ CRM והתנגדות עובדים',
        primaryPain: 'sales-pipeline-crm-adoption',
        relatedArticleSlugs: [
            'salespeople-hate-crm-adoption-guide',
            'crm-adoption-thursday-test-guide',
            'excel-to-crm-pipeline-guide'
        ]
    },
    'client-onboarding-system': {
        slug: 'client-onboarding-system',
        title: 'סיסטם קליטת לקוחות (Onboarding) ושימור',
        primaryPain: 'business-memory',
        relatedArticleSlugs: [
            'client-onboarding-process-guide',
            'customer-reviews-reputation-crm-guide',
            'business-memory-crm-guide'
        ]
    },
    'meeting-reliability-framework': {
        slug: 'meeting-reliability-framework',
        title: 'מודל אמינות פגישות ומניעת No-Show',
        primaryPain: 'repetitive-manual-work',
        relatedArticleSlugs: [
            'automated-meeting-scheduling-guide',
            'preventing-meeting-no-shows-guide'
        ]
    },
    'unified-inbox-architecture': {
        slug: 'unified-inbox-architecture',
        title: 'ארכיטקטורת תיבת דואר אחודה (Unified Inbox) ותקשורת רב-ערוצית',
        primaryPain: 'scattered-customer-communication',
        relatedArticleSlugs: [
            'omnichannel-communication-unified-inbox-crm-guide',
            'whatsapp-messaging-guidelines',
            'missed-call-text-back-guide'
        ]
    },
    'crm-data-hygiene': {
        slug: 'crm-data-hygiene',
        title: 'היגיינת נתונים, מניעת כפילויות ושלמות מידע',
        primaryPain: 'business-memory',
        relatedArticleSlugs: [
            'crm-duplicate-contacts-prevention-guide',
            'business-memory-crm-guide'
        ]
    }
} as const;

/**
 * First-Class Canonical Concepts Registry
 * 
 * Formal semantic definitions for foundational business objects and mechanisms.
 * Enforces the invariant: NODE EXISTENCE != PUBLIC PAGE EXISTENCE.
 */
export interface CanonicalConcept {
    id: string;
    term: string;
    canonicalDefinition: string;
    maturity: 'canonical' | 'maturing' | 'emerging';
    hasApprovedPublicDestination: boolean;
    publicDestinationUrl?: string;
    primaryParentHubSlug: string;
    recommendedBehavior: 'contextual_link' | 'plain_text_or_context';
}

export const CANONICAL_CONCEPTS: Record<string, CanonicalConcept> = {
    'crm': {
        id: 'crm',
        term: 'CRM',
        canonicalDefinition: 'מערכת לניהול קשרי לקוחות ותהליכי מכירה שמחברת בין פניות, ערוצי תקשורת, תיעוד והמשכיות עסקית.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/sales-pipeline',
        primaryParentHubSlug: 'sales-pipeline',
        recommendedBehavior: 'contextual_link'
    },
    'pipeline': {
        id: 'pipeline',
        term: 'פייפליין מכירות (Pipeline)',
        canonicalDefinition: 'משפך וציר עבודה חזותי המציג בכל רגע נתון היכן עומדת כל עסקה, מה הצעד הבא ומתי נדרש מעקב.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/sales-pipeline',
        primaryParentHubSlug: 'sales-pipeline',
        recommendedBehavior: 'contextual_link'
    },
    'lead': {
        id: 'lead',
        term: 'ליד (Lead)',
        canonicalDefinition: 'פנייה עסקית מאדם או חברה שהביעו עניין בשירות או במוצר וממתינים למענה ולבדיקת התאמה.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/lost-leads',
        primaryParentHubSlug: 'lost-leads',
        recommendedBehavior: 'contextual_link'
    },
    'contact': {
        id: 'contact',
        term: 'איש קשר וכרטיס לקוח (Contact)',
        canonicalDefinition: 'רשומת לקוח מרכזית המרכזת את כל היסטוריית הפניות, ההודעות, הפגישות וההסכמים במקום אחד.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/business-memory',
        primaryParentHubSlug: 'business-memory',
        recommendedBehavior: 'contextual_link'
    },
    'follow-up': {
        id: 'follow-up',
        term: 'פולואפ (Follow-up)',
        canonicalDefinition: 'רצף פעולות מעקב מתוזמנות ומותאמות אישית לאחר שליחת הצעה או שיחה כדי לקדם עסקה מבלי להיות מעיקים.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/lost-leads',
        primaryParentHubSlug: 'lost-leads',
        recommendedBehavior: 'contextual_link'
    },
    'workflow': {
        id: 'workflow',
        term: 'זרימת עבודה (Workflow)',
        canonicalDefinition: 'סדרת שלבים ופעולות קבועות בעסק הקובעות בדיוק מה קורה מרגע כניסת פנייה ועד סיום השירות.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/repetitive-manual-work',
        primaryParentHubSlug: 'repetitive-manual-work',
        recommendedBehavior: 'contextual_link'
    },
    'automation': {
        id: 'automation',
        term: 'אוטומציה עסקית (Automation)',
        canonicalDefinition: 'טריגרים ופעולות מערכת שפועלים ברקע ללא צורך בהתערבות אנושית חוזרת (מענה מהיר, תזכורות ועדכונים).',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/repetitive-manual-work',
        primaryParentHubSlug: 'repetitive-manual-work',
        recommendedBehavior: 'contextual_link'
    },
    'unified-inbox': {
        id: 'unified-inbox',
        term: 'תיבת דואר אחודה (Unified Inbox)',
        canonicalDefinition: 'אינבוקס צוותי המרכז שיחות וואטסאפ, אינסטגרם, פייסבוק, SMS ומייל לציר תקשורת אחיד לכל לקוח.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/whatsapp-in-crm',
        primaryParentHubSlug: 'whatsapp-in-crm',
        recommendedBehavior: 'contextual_link'
    },
    'no-show': {
        id: 'no-show',
        term: 'אי-הגעה לפגישה (No-Show)',
        canonicalDefinition: 'תופעה שבה לקוח מתאם פגישה ביומן ולא מופיע אליה עקב שכחה, חוסר תזכורת או היעדר מחויבות.',
        maturity: 'canonical',
        hasApprovedPublicDestination: true,
        publicDestinationUrl: '/topics/repetitive-manual-work',
        primaryParentHubSlug: 'repetitive-manual-work',
        recommendedBehavior: 'contextual_link'
    }
};

/**
 * Returns all approved public Hubs for navigation, footers, and sitemaps.
 */
export function getApprovedPublicHubs(): KnowledgeNode[] {
    return Object.values(KNOWLEDGE_NODES).filter(node => 
        node.hasPublicPage && node.isIndexable && (node.nodeType === 'pain_hub' || node.nodeType === 'micro_hub' || node.nodeType === 'topic')
    );
}

/**
 * Canonical Recognition Situations for the Homepage and assessment triggers.
 * Derived directly from the core pain hubs in the Knowledge Graph.
 */
export interface RecognitionSituation {
    id: string;
    text: string;
    hubSlug: string;
    url: string;
}

export function getCanonicalRecognitionSituations(): RecognitionSituation[] {
    return [
        { id: 'lost-leads', text: 'לידים שלא מקבלים מענה בזמן', hubSlug: 'lost-leads', url: '/topics/lost-leads' },
        { id: 'whatsapp-in-crm', text: 'וואטסאפ שלא מחובר לתהליך', hubSlug: 'whatsapp-in-crm', url: '/topics/whatsapp-in-crm' },
        { id: 'sales-pipeline', text: 'לא ברור איפה כל עסקה עומדת', hubSlug: 'sales-pipeline', url: '/topics/sales-pipeline' },
        { id: 'business-memory', text: 'מידע שנשאר בראש של העובד', hubSlug: 'business-memory', url: '/topics/business-memory' },
        { id: 'repetitive-manual-work', text: 'עבודה ידנית שחוזרת על עצמה', hubSlug: 'repetitive-manual-work', url: '/topics/repetitive-manual-work' }
    ];
}

/**
 * Resolves feature card knowledge destination from the Knowledge Graph.
 */
export function getFeatureKnowledgeLink(featureKey: string): { url: string; label: string } {
    const mappings: Record<string, { url: string; label: string }> = {
        'lead-management': {
            url: '/topics/lost-leads',
            label: 'מדריך לאבחון ועצירת בריחת לידים'
        },
        'omnichannel': {
            url: '/topics/whatsapp-in-crm',
            label: 'איך לחבר וואטסאפ ל-CRM בצורה נכונה'
        },
        'sales-pipeline': {
            url: '/topics/sales-pipeline',
            label: 'מדריך לבניית פייפליין מכירות חזותי'
        },
        'automations': {
            url: '/topics/repetitive-manual-work',
            label: 'איך לשחרר את הצוות מעבודה ידנית'
        },
        'ai-bots': {
            url: '/articles/non-technical-to-ai-automation-guide',
            label: 'איך מתחילים עם אוטומציה ו-AI בלי להסתבך'
        },
        'dashboard': {
            url: '/topics/business-memory',
            label: 'איך לשמור על הזיכרון הארגוני והנתונים'
        }
    };

    return mappings[featureKey] || { url: '/topics/sales-pipeline', label: 'למרכז הידע' };
}

/**
 * Resolves How-It-Works step knowledge destination from the Knowledge Graph.
 */
export function getHowItWorksStepKnowledge(stepNum: string): { url: string; label: string } {
    const mappings: Record<string, { url: string; label: string }> = {
        '1': { url: '/topics/lost-leads', label: 'איך עוצרים בריחת לידים?' },
        '2': { url: '/topics/whatsapp-in-crm', label: 'איך לחבר וואטסאפ לתהליך?' },
        '3': { url: '/topics/sales-pipeline', label: 'איך בונים פייפליין חזותי?' },
        '4': { url: '/topics/business-memory', label: 'איך שומרים על הזיכרון הארגוני?' }
    };

    return mappings[stepNum] || { url: '/topics/sales-pipeline', label: 'להעמקה במרכז הידע' };
}
