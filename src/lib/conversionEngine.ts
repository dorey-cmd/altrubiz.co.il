/**
 * AltruBiz Context-Aware Conversion Engine
 * 
 * Implements the core conversion invariant: "No Conversion Without Context".
 * Automatically resolves page context, section context, and CTA intent into
 * contextual headlines, supporting descriptions, temporary URLs, and document titles.
 * 
 * Reusable for Article #18 and all future content without custom component code.
 */

import { ConversionContext, ConversionType, ResolveConversionParams } from '../types/conversion';
import { CTAContext } from '../types/attribution';
import { Article, ARTICLES } from '../data/articles';
import { getParentHubForArticle } from '../data/knowledgeGraph';

interface DomainDefaultContext {
    contextSlug: string;
    bookingTitle: string;
    bookingDescription: string;
    contactTitle: string;
    contactDescription: string;
    badge: string;
}

const DOMAIN_DEFAULTS: Record<string, DomainDefaultContext> = {
    'pipeline': {
        contextSlug: 'pipeline',
        bookingTitle: 'בואו נבנה את הפייפליין שמתאים לעסק שלכם',
        bookingDescription: 'נמפה את תהליך המכירה הקיים שלכם, נזהה צווארי בקבוק ונבנה פייפליין ויזואלי וברור ב-AltruBiz CRM.',
        contactTitle: 'בדיקת התאמה לפייפליין מכירות',
        contactDescription: 'השאירו פרטים ונחזור אליכם לשיחה קצרה על תהליך המכירה והמעבר לפייפליין מסודר ב-CRM.',
        badge: 'בניית פייפליין מכירות'
    },
    'unified-inbox': {
        contextSlug: 'unified-inbox',
        bookingTitle: 'חיבור כל ערוצי התקשורת למקום אחד',
        bookingDescription: 'נבחן את ערוצי הפנייה של העסק (וואטסאפ, אינסטגרם, מייל) ונחבר אותם ל-Inbox אחוד ב-CRM שמונע אובדן פניות.',
        contactTitle: 'בדיקת התאמה ל-Inbox אחוד ותקשורת רב-ערוצית',
        contactDescription: 'השאירו פרטים ונחזור אליכם כדי להבין באילו ערוצים הלקוחות שלכם פונים ואיך לרכז אותם.',
        badge: 'תקשורת רב-ערוצית'
    },
    'prevent-no-shows': {
        contextSlug: 'prevent-no-shows',
        bookingTitle: 'מניעת No-Show וביטולי פגישות בעסק',
        bookingDescription: 'נבנה תהליך תזכורות ואישורים חכם בוואטסאפ שיבטיח שמתעניינים מגיעים לפגישות בזמן.',
        contactTitle: 'ייעוץ למניעת ביטולי פגישות ואוטומציית יומנים',
        contactDescription: 'השאירו פרטים ונציג לכם איך לצמצם הברזות מפגישות בלמעלה מ-70% באמצעות אוטומציה.',
        badge: 'מניעת No-Show ביומן'
    },
    'lost-leads': {
        contextSlug: 'lost-leads',
        bookingTitle: 'עוצרים את בריחת הלידים בעסק',
        bookingDescription: 'נמפה היכן פניות נופלות בין הכיסאות ונחבר מנגנון מענה ופולואפ אוטומטי ומסודר.',
        contactTitle: 'בדיקת התאמה לעצירת בריחת לידים',
        contactDescription: 'השאירו פרטים ונחזור אליכם לבחינת מהירות התגובה ואיסוף הפניות בעסק שלכם.',
        badge: 'עצירת בריחת לידים'
    },
    'business-memory': {
        contextSlug: 'business-memory',
        bookingTitle: 'שימור הזיכרון הארגוני ותיעוד הלקוחות',
        bookingDescription: 'נבנה כרטיס לקוח חכם ותהליכי תיעוד קלים ב-AltruBiz CRM שימנעו תלות בזיכרון של עובדים.',
        contactTitle: 'בדיקת התאמה לשימור ידע ותיעוד ב-CRM',
        contactDescription: 'השאירו פרטים ונראה לכם איך לרכז את כל היסטוריית השיחות במקום אחד בטוח.',
        badge: 'שימור זיכרון ארגוני'
    },
    'automation': {
        contextSlug: 'automation',
        bookingTitle: 'שחרור שעות עבודה ידנית באמצעות אוטומציות',
        bookingDescription: 'נמפה משימות חוזרות וצווארי בקבוק ונהפוך אותם לאוטומציות פשוטות שמפנות זמן לעסק.',
        contactTitle: 'בדיקת התאמה לאוטומציה עסקית',
        contactDescription: 'השאירו פרטים ונזהה אילו משימות חוזרות בעסק שלכם אפשר להעביר לאוטומציה מיידית.',
        badge: 'אוטומציה עסקית'
    },
    'whatsapp': {
        contextSlug: 'whatsapp',
        bookingTitle: 'חיבור וואטסאפ בטוח ויעיל ל-CRM',
        bookingDescription: 'נמפה את תהליך הדיוור והשיחות בוואטסאפ, נבנה תבניות מאושרות ונוודא עמידה בכללי Meta.',
        contactTitle: 'ייעוץ לחיבור WhatsApp Business ב-CRM',
        contactDescription: 'השאירו פרטים ונציג לכם איך להפעיל וואטסאפ עסקי בטוח עם מענה מהיר ללא חסימות.',
        badge: 'וואטסאפ ב-CRM'
    }
};

/**
 * Maps any page path or article slug to a canonical domain default family.
 */
function getDomainKeyForPath(pathOrSlug: string, parentHubSlug?: string): string {
    const clean = pathOrSlug.replace(/^\//, '').toLowerCase();

    if (clean.includes('pipeline') || clean.includes('excel') || clean.includes('salespeople') || clean.includes('thursday') || parentHubSlug === 'sales-pipeline') {
        return 'pipeline';
    }
    if (clean.includes('unified-inbox') || clean.includes('omnichannel')) {
        return 'unified-inbox';
    }
    if (clean.includes('no-show') || clean.includes('scheduling') || clean.includes('meeting')) {
        return 'prevent-no-shows';
    }
    if (clean.includes('lost-leads') || clean.includes('first-5-minutes') || clean.includes('missed-call') || clean.includes('reactivation') || parentHubSlug === 'lost-leads') {
        return 'lost-leads';
    }
    if (clean.includes('memory') || clean.includes('duplicate') || clean.includes('onboarding') || parentHubSlug === 'business-memory') {
        return 'business-memory';
    }
    if (clean.includes('manual') || clean.includes('automation') || clean.includes('review') || parentHubSlug === 'repetitive-manual-work') {
        return 'automation';
    }
    if (clean.includes('whatsapp') || parentHubSlug === 'whatsapp-in-crm') {
        return 'whatsapp';
    }

    return 'general';
}

/**
 * Builds the analytics and user-facing temporary conversion URL.
 * Example: /excel-to-pipeline?conversion=booking&context=pipeline
 */
export function buildTemporaryConversionUrl(
    pagePath: string,
    conversionType: ConversionType,
    contextSlug: string,
    sectionId?: string
): string {
    const base = pagePath.startsWith('/') ? pagePath : `/${pagePath}`;
    const cleanBase = base.split('?')[0].split('#')[0];
    const params = new URLSearchParams();
    params.set('conversion', conversionType);
    params.set('context', contextSlug);
    if (sectionId) {
        params.set('section', sectionId);
    }
    return `${cleanBase}?${params.toString()}`;
}

function isGenericFallbackTitle(title?: string): boolean {
    if (!title) return true;
    const t = title.trim();
    return (
        t === 'קביעת פגישה לבדיקת התאמה' ||
        t === 'קביעת פגישה: בדיקת התאמה אישית' ||
        t === 'קביעת פגישה לבדיקת התאמה אישית' ||
        t === 'קביעת פגישת בדיקת התאמה אישית' ||
        t === 'קביעת שיחת התאמה ביומן' ||
        t === 'קביעת שיחת התאמה: איך זה יכול לעבוד אצלכם בעסק' ||
        t === 'יצירת קשר והשארת פרטים' ||
        t === 'השארת פרטים' ||
        t.includes('בדיקת התאמה אישית')
    );
}

function isGenericFallbackDescription(desc?: string): boolean {
    if (!desc) return true;
    const d = desc.trim();
    return (
        d.includes('נמפה תהליך אחד בעסק ונראה איך לפשט אותו') ||
        d.includes('בחרו מועד שנוח לכם ביומן ונשוחח על האתגרים בעסק') ||
        d.includes('השאירו פרטים ונחזור אליכם בהקדם כדי להבין את צורכי העסק')
    );
}

/**
 * Builds the temporary document.title displayed while a conversion modal is open.
 * Example: "בואו נבנה את הפייפליין שמתאים לעסק שלכם | AltruBiz"
 */
export function buildTemporaryDocumentTitle(contextualTitle: string): string {
    const clean = contextualTitle.replace(/\|.*$/, '').trim();
    return `${clean} | AltruBiz`;
}

/**
 * Resolves a full ConversionContext using the 4-tier fallback hierarchy:
 * 1. Explicit CTA options (non-generic)
 * 2. Article conversionConfig
 * 3. Domain / Hub-based derivation
 * 4. Dynamic Article #18 fallback
 */
export function resolveConversionContext(params: ResolveConversionParams): ConversionContext {
    const {
        conversionType,
        pagePath,
        pageTitle,
        sectionId,
        sectionTitle,
        intent = conversionType === 'booking' ? 'book-meeting' : 'ask-question',
        ctaType = conversionType === 'booking' ? 'meeting' : 'contact',
        sourceLabel,
        explicitTitle,
        explicitSubtitle,
        explicitBadge,
        sourceArticleSlug,
        sourceHubSlug
    } = params;

    // Find article if matching pagePath or slug
    const article = ARTICLES.find((a: Article) => 
        a.publicPath === pagePath || 
        a.slug === sourceArticleSlug ||
        a.publicPath === `/${pagePath.replace(/^\//, '')}`
    );

    const parentHub = (article ? getParentHubForArticle(article.slug) : undefined);
    const effectiveHubSlug = sourceHubSlug || parentHub?.slug;
    const domainKey = getDomainKeyForPath(pagePath, effectiveHubSlug);
    const domainDefault = DOMAIN_DEFAULTS[domainKey];

    const meaningfulExplicitTitle = isGenericFallbackTitle(explicitTitle) ? undefined : explicitTitle;
    const meaningfulExplicitSubtitle = isGenericFallbackDescription(explicitSubtitle) ? undefined : explicitSubtitle;

    // Priority 1: Explicit CTA options
    // Priority 2: Article conversionConfig
    // Priority 3: Domain / Hub defaults
    // Priority 4: Dynamic Article #18 fallback

    let contextualTitle = '';
    let contextualDescription = '';
    let badge = '';
    let contextSlug = domainDefault?.contextSlug || pagePath.replace(/^\//, '').split('/')[0] || 'general';

    if (article?.conversionConfig?.contextSlug) {
        contextSlug = article.conversionConfig.contextSlug;
    }

    if (conversionType === 'booking') {
        contextualTitle = 
            meaningfulExplicitTitle ||
            article?.conversionConfig?.bookingTitle ||
            domainDefault?.bookingTitle ||
            (article ? `בדיקת התאמה: ${article.title.split(':')[0]}` : 'קביעת שיחת התאמה ביומן');

        contextualDescription = 
            meaningfulExplicitSubtitle ||
            article?.conversionConfig?.bookingDescription ||
            domainDefault?.bookingDescription ||
            (article ? `נשוחח על האתגרים בעסק שלכם ונראה איך לחבר מענה מותאם ומסודר ב-AltruBiz CRM.` : 'בחרו מועד שנוח לכם ביומן ונשוחח על האתגרים בעסק ואיך לחבר פתרון אוטומטי מותאם.');

        badge = 
            explicitBadge ||
            article?.conversionConfig?.badge ||
            domainDefault?.badge ||
            'תיאום פגישה ביומן';
    } else {
        contextualTitle = 
            meaningfulExplicitTitle ||
            article?.conversionConfig?.contactTitle ||
            domainDefault?.contactTitle ||
            (article ? `השארת פרטים: ${article.title.split(':')[0]}` : 'יצירת קשר והשארת פרטים');

        contextualDescription = 
            meaningfulExplicitSubtitle ||
            article?.conversionConfig?.contactDescription ||
            domainDefault?.contactDescription ||
            (article ? `השאירו פרטים ונחזור אליכם כדי להבין את צורכי העסק שלכם ולבדוק התאמה.` : 'השאירו פרטים ונחזור אליכם בהקדם כדי להבין את צורכי העסק שלכם ולבדוק התאמה לפתרונות AltruBiz.');

        badge = 
            explicitBadge ||
            article?.conversionConfig?.badge ||
            domainDefault?.badge ||
            'השארת פרטים';
    }

    const temporaryUrl = buildTemporaryConversionUrl(pagePath, conversionType, contextSlug, sectionId);
    const documentTitle = buildTemporaryDocumentTitle(contextualTitle);

    const attribution: CTAContext = {
        sourcePage: pagePath,
        sourceSection: sectionId,
        sourceArticle: article?.slug || sourceArticleSlug,
        sourceTopic: effectiveHubSlug,
        sourceHub: effectiveHubSlug,
        intent: intent as any,
        ctaType,
        sourceLabel: sourceLabel || contextualTitle
    };

    return {
        conversionType,
        pagePath,
        pageTitle: pageTitle || article?.title,
        sectionId,
        sectionTitle,
        intent,
        contextualTitle,
        contextualDescription,
        badge,
        contextSlug,
        temporaryUrl,
        documentTitle,
        attribution
    };
}
