import React, { useState, useEffect, useRef } from 'react';
import { 
    AlertTriangle, 
    CheckCircle2, 
    ArrowLeft, 
    HelpCircle, 
    Clock, 
    Zap, 
    MessageCircle, 
    Layers, 
    ChevronDown, 
    BookOpen, 
    Target,
    Activity,
    Calendar,
    Compass,
    ArrowUp,
    X,
    Sparkles,
    Check,
    PhoneCall,
    Database,
    Repeat,
    Users
} from 'lucide-react';
import { KnowledgeNode, getKnowledgeNodeBySlug } from '../../data/knowledgeGraph';
import { getArticleBySlug } from '../../data/articles';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Button } from '../ui/Button';
import { ModalPresentationOptions } from '../../types/attribution';
import { buildAttributedWhatsAppUrl } from '../../lib/attribution';
import { renderFormattedText } from '../../lib/formatText';

interface HubPageProps {
    node: KnowledgeNode;
    onNavigate: (path: string) => void;
    onOpenContactModal?: (options?: ModalPresentationOptions) => void;
    onOpenBookingModal?: (options?: ModalPresentationOptions) => void;
    onOpenPricingModal?: () => void;
}

// Visual storytelling assets and tailored process diagrams for canonical hubs
interface HubVisualMeta {
    imageSrc: string;
    imageAlt: string;
    caption: string;
    diagramTitle: string;
    diagramType: 'pipeline' | 'timeline' | 'lost-leads' | 'automation' | 'whatsapp';
}

const HUB_VISUAL_ASSETS: Record<string, HubVisualMeta> = {
    'sales-pipeline': {
        imageSrc: '/images/articles/visual-pipeline-deals.jpg',
        imageAlt: 'פייפליין מכירות חזותי לניהול שלבי עסקאות והזדמנויות ב-CRM',
        caption: 'פייפליין מכירות חזותי מאפשר לראות בכל רגע נתון איפה כל לקוח עומד, איפה עסקאות נתקעות, ומה הצעד הבא.',
        diagramTitle: 'מפת שלבי מכירה חכמה: איך נראה תהליך שמייצר עסקאות',
        diagramType: 'pipeline'
    },
    'business-memory': {
        imageSrc: '/images/articles/thailand-vacation-business-memory.jpg',
        imageAlt: 'ניהול עסק מכל מקום ללא תלות בזיכרון של עובדים יחידים',
        caption: 'כשהזיכרון הארגוני שמור במערכת ולא בראש של עובדים או בוואטסאפ פרטי, העסק ממשיך לפעול גם בחופשות ובחילופי צוות.',
        diagramTitle: 'המעבר ממידע מפוזר לציר זמן לקוח מרכזי (Single Timeline)',
        diagramType: 'timeline'
    },
    'repetitive-manual-work': {
        imageSrc: '/images/articles/conveyor-lead-automation.jpg',
        imageAlt: 'אוטומציה של משימות ידניות שחוזרות על עצמן וחיסכון בזמן ניהולי',
        caption: 'החלפת משימות העתקה, תיאומי יומן ותזכורות ידניות באוטומציות חכמות שחוסכות עשרות שעות ניהול בחודש.',
        diagramTitle: '5 משימות ידניות שוחקות שהופכות לפעולה אוטומטית שקטה',
        diagramType: 'automation'
    },
    'lost-leads': {
        imageSrc: '/images/articles/lead-waiting-doorbell.jpg',
        imageAlt: 'מענה מהיר ללידים שמתעניינים בעסק ב-5 הדקות הראשונות',
        caption: '78% מהעסקאות נסגרות מול העסק הראשון שחוזר לליד ומספק מענה מקצועי. מענה תוך 5 דקות מגדיל את סיכויי הסגירה פי 9.',
        diagramTitle: 'ציר הזמן של אובדן לידים: מדוע מהירות המענה קובעת את התוצאה',
        diagramType: 'lost-leads'
    },
    'whatsapp-in-crm': {
        imageSrc: '/images/articles/customer-single-thread-omnichannel.jpg',
        imageAlt: 'תיבת הודעות וואטסאפ ואינבוקס לקוחות מרכזי אחד ב-CRM',
        caption: 'איחוד כל שיחות הוואטסאפ של העסק לתיבת הודעות צוותית אחת מונע שיחות אבודות ומאפשר עבודה משותפת חלקה.',
        diagramTitle: 'וואטסאפ בטלפונים אישיים מול תיבת הודעות עסקית אחודה',
        diagramType: 'whatsapp'
    }
};

export const HubPage: React.FC<HubPageProps> = ({
    node,
    onNavigate,
    onOpenContactModal,
    onOpenBookingModal,
    onOpenPricingModal
}) => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [activeSectionId, setActiveSectionId] = useState<string>('overview');
    const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
    const activeNavRef = useRef<HTMLButtonElement>(null);
    const navContainerRef = useRef<HTMLDivElement>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'מרכז ידע', path: '/articles' },
        { name: node.title, path: node.url }
    ];

    const hub = node.hubData;
    const visualMeta = HUB_VISUAL_ASSETS[node.slug];

    // Fetch related articles objects with strict type guard
    const relatedArticles = (node.relatedArticleSlugs || [])
        .map(slug => getArticleBySlug(slug))
        .filter((art): art is NonNullable<typeof art> => Boolean(art));

    // Scrollspy navigation items
    const navSections = [
        { id: 'overview', title: 'הגדרת האתגר', icon: Target },
        { id: 'reality-check', title: 'תמונת המצב בעסק', icon: Activity },
        { id: 'visual-story', title: 'המחשת התהליך', icon: Compass },
        ...(hub?.diagnosticQuestions && hub.diagnosticQuestions.length > 0 ? [{ id: 'diagnostics', title: 'אבחון עצמי', icon: CheckCircle2 }] : []),
        ...(hub?.primaryQuickWin ? [{ id: 'quick-win', title: 'פעולה מהירה (Quick Win)', icon: Zap }] : []),
        { id: 'manifestations', title: 'מדריכים מעשיים בשטח', icon: BookOpen },
        { id: 'solutions', title: 'פתרון מערכתי ושיחה', icon: Calendar },
        ...(hub?.faqs && hub.faqs.length > 0 ? [{ id: 'faqs', title: 'שאלות ותשובות', icon: HelpCircle }] : [])
    ];

    // Track scroll for early mobile nav pill
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowMobileNav(true);
            } else {
                setShowMobileNav(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Architectural Invariant: "Navigation follows the reader - never the reverse."
    // Passive active-section tracking MUST ONLY scroll the internal TOC container if needed.
    // It must NEVER call element.scrollIntoView() which scrolls the window/document ancestors.
    useEffect(() => {
        const container = navContainerRef.current;
        const item = activeNavRef.current;
        if (!container || !item) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        const relativeTop = itemRect.top - containerRect.top;
        const relativeBottom = itemRect.bottom - containerRect.top;
        const PADDING = 8;

        if (relativeTop < PADDING) {
            container.scrollTo({
                top: container.scrollTop + relativeTop - PADDING,
                behavior: 'smooth'
            });
        } else if (relativeBottom > containerRect.height - PADDING) {
            container.scrollTo({
                top: container.scrollTop + (relativeBottom - containerRect.height) + PADDING,
                behavior: 'smooth'
            });
        }
    }, [activeSectionId]);

    useEffect(() => {
        const observedIds = navSections.map(s => s.id);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSectionId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            }
        );

        observedIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [navSections]);

    const scrollToSection = (id: string) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.replaceState(null, '', `#${id}`);
        }
        setIsMobileDrawerOpen(false);
    };

    const activeNavTitle = navSections.find(s => s.id === activeSectionId)?.title || 'ניווט במדריך';

    // Render Hub Tailored Visual Diagram
    const renderVisualDiagram = () => {
        if (!visualMeta) return null;

        if (visualMeta.diagramType === 'pipeline') {
            return (
                <div className="bg-gradient-to-br from-blue-900/90 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden my-10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={14} />
                            <span>המחשת תהליך המכירה</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
                            {visualMeta.diagramTitle}
                        </h3>
                        <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
                            במקום רשימות באקסל או פתקים, פייפליין מסודר מחלק את התהליך ל-5 שלבים ברורים שבהם כל לקוח מקבל מעקב עד לסגירה:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-right">
                            {[
                                { step: '01', title: 'פנייה חדשה', desc: 'מענה מיידי תוך 5 דקות והזנת פרטים אוטומטית', alert: 'ללא מענה מהיר הליד נשרף' },
                                { step: '02', title: 'שיחת אפיון', desc: 'מיפוי צורכי הלקוח והבנת התאמה', alert: 'מניעת שיחות סרק ללא התאמה' },
                                { step: '03', title: 'הצעת מחיר', desc: 'שליחת הצעה דיגיטלית עם מעקב פתיחה', alert: 'הצעה שנשכחת = מכירה אבודה' },
                                { step: '04', title: 'מעקב יזום', desc: 'תזכורות אוטומטיות לבירור התלבטויות', alert: 'כאן נסגרות 80% מהעסקאות' },
                                { step: '05', title: 'סגירה וקליטה', desc: 'העברה חלקה לשירות וחשבונית אוטומטית', alert: 'חוויית קליטה שמייצרת המלצות' }
                            ].map((s, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                                    <div>
                                        <span className="text-cyan-400 font-black text-xs block mb-1">שלב {s.step}</span>
                                        <h4 className="font-bold text-white text-sm mb-1.5">{s.title}</h4>
                                        <p className="text-slate-300 text-xs leading-relaxed mb-3">{s.desc}</p>
                                    </div>
                                    <div className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-lg p-1.5">
                                        💡 {s.alert}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (visualMeta.diagramType === 'lost-leads') {
            return (
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/70 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/30 relative overflow-hidden my-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Clock size={14} />
                            <span>אבחון מהירות מענה</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
                            {visualMeta.diagramTitle}
                        </h3>
                        <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
                            כל דקה שעוברת מרגע שהלקוח השאיר פרטים מורידה באופן דרמטי את סיכויי הסגירה. מענה אוטומטי עוצר את הדימום מיד:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-5 text-right">
                                <span className="text-emerald-400 font-black text-2xl block mb-1">0-5 דקות</span>
                                <div className="text-xs font-bold text-emerald-300 mb-2">חלון ההזדמנות (Peak)</div>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    הלקוח יושב ליד המסך, מעוניין וקשוב. סיכוי של פי 9 לשיחת מכירה מוצלחת.
                                </p>
                            </div>
                            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-5 text-right">
                                <span className="text-amber-400 font-black text-2xl block mb-1">30 דקות</span>
                                <div className="text-xs font-bold text-amber-300 mb-2">תחילת התקררות</div>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    הלקוח המשיך בעיסוקיו או עבר לחפש פתרונות אצל עסקים מתחרים ברשת.
                                </p>
                            </div>
                            <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-5 text-right">
                                <span className="text-rose-400 font-black text-2xl block mb-1">שעתיים+</span>
                                <div className="text-xs font-bold text-rose-300 mb-2">סיכוי נמוך לתגובה</div>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    הלקוח כבר דיבר עם ספק אחר שכבר שלח לו הצעת מחיר וקבע פגישה.
                                </p>
                            </div>
                            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-right">
                                <span className="text-slate-400 font-black text-2xl block mb-1">24 שעות</span>
                                <div className="text-xs font-bold text-slate-400 mb-2">ליד אבוד</div>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    ברוב המקרים לא יענה לשיחה או שיגיד "כבר לא רלוונטי, הסתדרתי".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (visualMeta.diagramType === 'timeline') {
            return (
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden my-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Database size={14} />
                            <span>ארכיטקטורת זיכרון ארגוני</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
                            {visualMeta.diagramTitle}
                        </h3>
                        <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
                            השוואה בין עסק שתלוי בזיכרון פרטי לבין עסק הפועל עם ציר זמן לקוח מרכזי ב-CRM:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5">
                                <h4 className="font-bold text-rose-300 text-base mb-3 flex items-center gap-2">
                                    <X className="w-5 h-5 text-rose-400" />
                                    <span>ללא זיכרון ארגוני (מפוזר ושביר)</span>
                                </h4>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-400 font-bold">•</span>
                                        <span>הודעות לקוח נשארות בוואטסאפ האישי של העובד</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-400 font-bold">•</span>
                                        <span>סיכומי שיחות נרשמים על דפים או נשכחים בראש</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-400 font-bold">•</span>
                                        <span>כשעובד יוצא לחופשה או עוזב – ההיסטוריה נמחקת</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-rose-400 font-bold">•</span>
                                        <span>לקוח צריך להסביר את הסיפור שלו שוב מחדש</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5">
                                <h4 className="font-bold text-emerald-300 text-base mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-emerald-400" />
                                    <span>עם AltruBiz (ציר זמן לקוח מוגן)</span>
                                </h4>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>כל שיחה, וואטסאפ והצעה מתועדים אוטומטית בכרטיס הלקוח</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>כל איש צוות רואה מיד מה סוכם ומה הפעולה הבאה</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>רציפות עסקית מלאה: העסק עובד גם כשאנשי מפתח לא נמצאים</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>הלקוח מרגיש שמכירים אותו אישית ומקבל יחס מקצועי</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (visualMeta.diagramType === 'automation') {
            return (
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden my-10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Repeat size={14} />
                            <span>אוטומציה עסקית שקטה</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
                            {visualMeta.diagramTitle}
                        </h3>
                        <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
                            משימות שחוזרות על עצמן לא צריכות זמן אנושי. טריגר אחד במערכת מטפל בהן ברקע באופן מושלם:
                        </p>

                        <div className="space-y-3">
                            {[
                                { task: 'תיאומי יומן', manual: '3 שיחות ו-4 הודעות למציאת שעה פנויה', auto: 'קישור יומן חי שמתעדכן ביומן ומשריין מועד בשניות' },
                                { task: 'תזכורות לפגישה', manual: 'שליחת וואטסאפ ידני יום לפני והמתנה לאישור', auto: 'תזכורת אוטומטית מותאמת אישית בוואטסאפ המונעת אי-הגעה' },
                                { task: 'העתקת לידים מטפסים', manual: 'העתקה ידנית ממייל לפייסבוק ולאקסל', auto: 'קליטה אוטומטית ויצירת כרטיס לקוח עם כל הפרטים מיד' },
                                { task: 'מעקב אחר הצעת מחיר', manual: 'תזכורת בפתק לחזור לעסקאות פתוחות', auto: 'התראה חכמה כשלקוח פותח את ההצעה וסדרת פולואפ מתוזמנת' },
                                { task: 'קליטת לקוח חדש (Onboarding)', manual: 'שליחת הסכמים וטפסים ידנית בכל עסקה', auto: 'העברה אוטומטית לשלב קליטה, שליחת חוזה והפקת קבלה' }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                                    <div className="font-bold text-cyan-300 sm:w-1/4">{item.task}</div>
                                    <div className="text-rose-300/90 sm:w-1/3 line-through sm:no-line-through">
                                        <span className="sm:hidden font-bold">ידני: </span>
                                        {item.manual}
                                    </div>
                                    <div className="text-emerald-300 font-medium sm:w-5/12 flex items-center gap-1.5">
                                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                        <span>{item.auto}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // WhatsApp diagram fallback
        return (
            <div className="bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden my-10">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <MessageCircle size={14} />
                        <span>תקשורת וואטסאפ מרכזית</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
                        {visualMeta.diagramTitle}
                    </h3>
                    <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
                        במקום שכל עובד יענה מהטלפון האישי שלו בלי פיקוח ובלי תיעוד – כל הצוות מחובר לאינבוקס משותף אחד:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                                <PhoneCall size={20} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1.5">מספר עסקי רשמי אחד</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                כל השיחות מתנהלות ממספר העסק, ללא חשיפת טלפונים אישיים של עובדים.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                                <Users size={20} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1.5">עבודת צוות שקופה</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                מספר נציגים עונים במקביל, מקצים שיחות ביניהם ורואים את כל ההיסטוריה.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                                <Zap size={20} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1.5">בוט מענה ראשוני ב-5 דק'</h4>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                מענה מיידי לשיחות שלא נענו וקליטת פרטים 24/7 ישירות לכרטיס הלקוח.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <article className="min-h-screen bg-slate-50/70 pt-24 pb-20 selection:bg-cyan-100" dir="rtl">
            {/* Top Anchor */}
            <div id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            {/* Main Two-Column Layout (RTL: Column 1 on Right, Column 2 on Left) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-10 items-start">
                    
                    {/* Desktop Sticky Navigation & Orientation Rail (Right Column in RTL, natural content height, zero artificial legroom) */}
                    <aside className="hidden lg:flex flex-col sticky top-28 max-h-[calc(100vh-8.5rem)] space-y-3">
                        <nav aria-label="ניווט במדריך" className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 shadow-sm flex flex-col min-h-0">
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 shrink-0">
                                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                                    <Compass size={17} className="text-primary" />
                                    <span>מפת המדריך</span>
                                </div>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-100">
                                    {navSections.length} מוקדים
                                </span>
                            </div>

                            <div 
                                ref={navContainerRef}
                                className="space-y-1 overflow-y-auto max-h-[46vh] xl:max-h-[50vh] pl-1 pr-0.5 custom-scrollbar"
                            >
                                {navSections.map((sec) => {
                                    const IconComponent = sec.icon;
                                    const isActive = activeSectionId === sec.id;
                                    return (
                                        <button
                                            key={sec.id}
                                            ref={isActive ? activeNavRef : null}
                                            onClick={() => scrollToSection(sec.id)}
                                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all text-right ${
                                                isActive 
                                                    ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary shadow-xs' 
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                        >
                                            <IconComponent size={14} className={isActive ? 'text-primary' : 'text-slate-400'} />
                                            <span className="truncate leading-snug">{sec.title}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="pt-2.5 mt-2 border-t border-slate-100 shrink-0">
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        window.history.replaceState(null, '', window.location.pathname);
                                    }}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs text-slate-500 hover:text-primary rounded-xl transition-colors font-semibold"
                                >
                                    <ArrowUp size={13} />
                                    <span>חזרה לראש המדריך</span>
                                </button>
                            </div>
                        </nav>

                        {/* Sticky Action Card (Contextual Booking CTA - Subordinate & Compact) */}
                        <div className="shrink-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10 space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold">
                                    <Calendar size={11} />
                                    <span>בדיקת התאמה אישית</span>
                                </div>
                                <h4 className="font-extrabold text-xs sm:text-sm text-white leading-snug">
                                    רוצים לחבר את זה לעסק?
                                </h4>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                    בפגישה קצרה נמפה את האתגר שלכם ונראה פתרון מעשי ב-CRM.
                                </p>
                                <div className="pt-0.5 space-y-1.5">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full font-bold text-xs py-2 shadow-sm shadow-primary/25 flex items-center justify-center gap-1.5"
                                        onClick={() => {
                                            if (onOpenBookingModal) {
                                                onOpenBookingModal({
                                                    title: `קביעת פגישה: ${node.title}`,
                                                    subtitle: `בפגישה נמפה את תהליך העבודה שלכם ונבחן מענה מעשי עבור ${node.title}`,
                                                    badge: 'תיאום פגישה ביומן',
                                                    attribution: {
                                                        sourcePage: node.url,
                                                        sourceSection: activeSectionId,
                                                        sourceHub: node.slug,
                                                        sourceTopic: node.slug,
                                                        intent: 'booking',
                                                        ctaType: 'sidebar_cta',
                                                        sourceLabel: `hub_sidebar_${node.slug}`
                                                    }
                                                });
                                            } else {
                                                onNavigate('/#contact');
                                            }
                                        }}
                                    >
                                        <Calendar size={13} />
                                        <span>קביעת פגישת אבחון ביומן</span>
                                    </Button>

                                    <a
                                        href={buildAttributedWhatsAppUrl(
                                            `שלום צוות AltruBiz, קראתי את מרכז הידע בנושא "${node.title}" ואשמח להתייעץ לגבי העסק שלנו.`,
                                            {
                                                sourcePage: node.url,
                                                sourceSection: activeSectionId,
                                                sourceHub: node.slug,
                                                sourceTopic: node.slug,
                                                intent: 'consultation',
                                                ctaType: 'sidebar_cta',
                                                sourceLabel: `hub_sidebar_whatsapp_${node.slug}`
                                            }
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-[11px] font-semibold transition-colors"
                                    >
                                        <MessageCircle size={13} className="text-[#25D366]" />
                                        <span>התייעצות מהירה בוואטסאפ</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Left Column: Editorial Experience (Comfortable reading measure) */}
                    <div className="min-w-0 max-w-3xl mx-auto lg:mx-0 w-full">

                        {/* Open Editorial Hero Header - Not wrapped in a box */}
                        <header className="mb-10">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-primary border border-blue-200 mb-4">
                                <Layers className="w-3.5 h-3.5 text-secondary" />
                                <span>{node.nodeType === 'pain_hub' ? 'מדריך אבחון ומענה מקיף' : 'מדריך יישום וניהול תקשורת'}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4">
                                {node.title}
                            </h1>

                            {node.subtitle && (
                                <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-6">
                                    {node.subtitle}
                                </p>
                            )}

                            {/* Pull-quote / Core Problem Definition with Sleek Accent Line */}
                            {hub?.problemDefinition && (
                                <div className="border-r-4 border-primary pr-5 py-2 my-6 bg-transparent">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                        <Target className="w-4 h-4 text-primary" />
                                        <span>הגדרת האתגר והשפעתו על העסק</span>
                                    </h2>
                                    <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
                                        {renderFormattedText(hub.problemDefinition, onNavigate)}
                                    </p>
                                </div>
                            )}

                            {/* Hero Visual Anchor */}
                            {visualMeta && (
                                <figure className="mt-8 rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
                                    <img 
                                        src={visualMeta.imageSrc} 
                                        alt={visualMeta.imageAlt} 
                                        className="w-full aspect-[21/10] sm:aspect-[2.2/1] object-cover" 
                                    />
                                    {visualMeta.caption && (
                                        <figcaption className="p-3.5 text-center text-xs text-slate-600 bg-slate-50 border-t border-slate-100 font-medium">
                                            💡 {visualMeta.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            )}
                        </header>

                        {/* Section 1: Reality Check - Symptoms & Business Cost (Asymmetrical Editorial Flow) */}
                        {hub && (
                            <section id="reality-check" className="mb-14 scroll-mt-28">
                                <div className="mb-6">
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                                        למה זה קורה בעסק – ומה המחיר שמשלמים על זה?
                                    </h2>
                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                        ברוב העסקים, הבעיה הזו לא נובעת מחוסר רצון אלא מחוסר תהליך מערכתי שמגן על העובדים ועל הלידים:
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* Why it happens: Open narrative bullets */}
                                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-rose-500" />
                                            <span>גורמי השורש שמייצרים את הבעיה:</span>
                                        </h3>
                                        <ul className="space-y-3">
                                            {hub.whyItHappens.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                                                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                                                    <span>{renderFormattedText(item, onNavigate)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Business Cost: High-contrast impact strip */}
                                    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-3xl p-6 sm:p-8">
                                        <h3 className="text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                                            <span>המחיר הישיר והסמוי שהעסק משלם:</span>
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                            {hub.businessCost.map((cost, idx) => (
                                                <div key={idx} className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-amber-200/60 flex items-start gap-2.5">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                                                    <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">{renderFormattedText(cost, onNavigate)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Section 2: Visual Process / Storytelling Diagram */}
                        <section id="visual-story" className="scroll-mt-28">
                            {renderVisualDiagram()}
                        </section>

                        {/* Section 3: Diagnostics Tool */}
                        {hub && hub.diagnosticQuestions && hub.diagnosticQuestions.length > 0 && (
                            <section id="diagnostics" className="mb-14 scroll-mt-28">
                                <div className="mb-6">
                                    <span className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
                                        כלי אבחון עצמי
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
                                        האם הבעיה הזו פעילה כרגע בעסק שלכם?
                                    </h2>
                                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                        ענו על השאלות הבאות כדי לזהות בדיוק באיזה נקודה התהליך נשבר:
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {hub.diagnosticQuestions.map((diag, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className="w-7 h-7 rounded-xl bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                                    0{idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-3">
                                                        {diag.question}
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                                        <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-3 text-rose-900">
                                                            <span className="font-bold block mb-1">תמרור אזהרה:</span>
                                                            {diag.warningSign}
                                                        </div>
                                                        <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-amber-900">
                                                            <span className="font-bold block mb-1">ההשפעה על העסק:</span>
                                                            {diag.impact}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Section 4: Primary Quick Win */}
                        {hub && hub.primaryQuickWin && (
                            <section id="quick-win" className="mb-14 scroll-mt-28 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
                                    <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                                    <span>Quick Win – פעולה מומלצת להיום</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                                    {hub.primaryQuickWin.title}
                                </h2>
                                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-5">
                                    {renderFormattedText(hub.primaryQuickWin.text, onNavigate)}
                                </p>
                                {hub.primaryQuickWin.actionSteps && (
                                    <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-emerald-200/80">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                            צעדים מעשיים שתוכלו ליישם כבר היום:
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {hub.primaryQuickWin.actionSteps.map((step, idx) => (
                                                <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span>{renderFormattedText(step, onNavigate)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Section 5: Field Manifestations & Supporting Deep Guides */}
                        <section id="manifestations" className="mb-14 scroll-mt-28">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-slate-700 bg-slate-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                                    מחקר שטח ומאגר ידע
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
                                    איך הבעיה הזו מתבטאת בשטח – ומדריכים מעשיים
                                </h2>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                    סקירת המצבים הנפוצים ביותר בעסקים ומדריכי עומק מתוך מרכז הידע של AltruBiz:
                                </p>
                            </div>

                            {/* Manifestation Sections */}
                            {hub?.sections && (
                                <div className="space-y-6 mb-8">
                                    {hub.sections.map((sec) => (
                                        <div key={sec.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                                            <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                                                {sec.title}
                                            </h3>
                                            {sec.subtitle && (
                                                <p className="text-slate-500 text-xs sm:text-sm font-medium mb-4">
                                                    {sec.subtitle}
                                                </p>
                                            )}
                                            <div className="space-y-2.5 mb-5">
                                                {sec.content.map((p, idx) => (
                                                    <p key={idx} className="text-slate-700 text-sm leading-relaxed">
                                                        {renderFormattedText(p, onNavigate)}
                                                    </p>
                                                ))}
                                            </div>

                                            {/* Linked Articles */}
                                            {sec.relatedArticleSlugs && sec.relatedArticleSlugs.length > 0 && (
                                                <div className="pt-4 border-t border-slate-100">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                        מדריכים מומלצים בנושא:
                                                    </h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {sec.relatedArticleSlugs.map(slug => {
                                                            const art = getArticleBySlug(slug);
                                                            if (!art) return null;
                                                            return (
                                                                <div 
                                                                    key={slug} 
                                                                    onClick={() => onNavigate(`/articles/${art.slug}`)}
                                                                    className="group p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-secondary/50 hover:bg-cyan-50/30 transition-all cursor-pointer flex flex-col justify-between"
                                                                >
                                                                    <div>
                                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                                                                            <Clock className="w-3 h-3 text-slate-400" />
                                                                            <span>{art.readTime || '6 דקות קריאה'}</span>
                                                                        </div>
                                                                        <h5 className="font-bold text-slate-900 group-hover:text-secondary transition-colors text-xs sm:text-sm leading-snug mb-1">
                                                                            {art.title}
                                                                        </h5>
                                                                    </div>
                                                                    <div className="mt-2.5 flex items-center text-xs font-semibold text-secondary group-hover:translate-x-[-2px] transition-transform">
                                                                        <span>{art.cardCta || 'פתרון מעשי לבעיה'}</span>
                                                                        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Connected Hub Articles Roster */}
                            {relatedArticles.length > 0 && (
                                <div className="bg-slate-100/80 border border-slate-200 rounded-3xl p-6">
                                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <BookOpen size={16} className="text-primary" />
                                        <span>כל המאמרים והמדריכים המקושרים לנושא זה ({relatedArticles.length}):</span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {relatedArticles.map((art) => (
                                            <div 
                                                key={art.slug} 
                                                onClick={() => onNavigate(`/articles/${art.slug}`)}
                                                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="pr-1 truncate">
                                                    <h4 className="font-bold text-slate-900 hover:text-secondary text-xs sm:text-sm leading-snug truncate">
                                                        {art.title}
                                                    </h4>
                                                </div>
                                                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Section 6: AltruBiz Systematic Solution & Contextual CTAs */}
                        {hub && hub.solutionPaths && (
                            <section id="solutions" className="mb-14 scroll-mt-28 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 uppercase tracking-wider">
                                        פתרון מערכתי ב-AltruBiz CRM
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 mb-3">
                                        איך בונים פתרון קבוע בעסק כדי שהבעיה לא תחזור?
                                    </h2>
                                    <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
                                        במקום להסתמך על רצון טוב וזיכרון פרטי, יוצרים תהליך מבוסס מערכת שמנהל את הלקוחות באופן עקבי:
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {hub.solutionPaths.map((sol, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                                <h3 className="text-lg font-bold text-white mb-2">{sol.title}</h3>
                                                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                                                    {renderFormattedText(sol.description, onNavigate)}
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                                                    {sol.featureHighlights.map((feat, fIdx) => (
                                                        <div key={fIdx} className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                                            <span>{feat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Box: Explicit Separation of Meeting vs. Contact */}
                                    <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={() => onOpenBookingModal ? onOpenBookingModal({
                                                title: `קביעת פגישת אבחון: ${node.title}`,
                                                subtitle: `בפגישה נמפה את צורת העבודה שלכם ונבחן פתרון מותאם עבור ${node.title}`,
                                                badge: 'תיאום פגישה ביומן',
                                                whatsappPrefill: `שלום צוות AltruBiz, קראתי את מרכז הידע בנושא "${node.title}" ואשמח לתאם פגישה`,
                                                attribution: {
                                                    sourcePage: node.url,
                                                    sourceSection: 'solutions',
                                                    sourceHub: node.slug,
                                                    sourceTopic: node.slug,
                                                    intent: 'meeting',
                                                    ctaType: 'modal_booking',
                                                    sourceLabel: `hub_solutions_meeting_${node.slug}`
                                                }
                                            }) : onNavigate('/#contact')}
                                            className="font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <Calendar className="w-5 h-5" />
                                            <span>קביעת פגישת אבחון ביומן</span>
                                        </Button>

                                        {onOpenContactModal && (
                                            <Button
                                                variant="secondary"
                                                size="lg"
                                                onClick={() => onOpenContactModal({
                                                    title: `השארת פרטים: ${node.title}`,
                                                    subtitle: 'השאירו פרטים ונחזור אליכם בהקדם כדי להבין את צורכי העסק ולבדוק התאמה.',
                                                    badge: 'השארת פרטים',
                                                    attribution: {
                                                        sourcePage: node.url,
                                                        sourceSection: 'solutions',
                                                        sourceHub: node.slug,
                                                        sourceTopic: node.slug,
                                                        intent: 'contact_general',
                                                        ctaType: 'modal_contact',
                                                        sourceLabel: `hub_solutions_contact_${node.slug}`
                                                    }
                                                })}
                                                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-sm flex items-center justify-center gap-2"
                                            >
                                                <span>השארת פרטים ליצירת קשר</span>
                                            </Button>
                                        )}

                                        {onOpenPricingModal && (
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={onOpenPricingModal}
                                                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
                                            >
                                                צפייה בחבילות
                                            </Button>
                                        )}

                                        <a
                                            href={buildAttributedWhatsAppUrl(
                                                `שלום צוות AltruBiz, קראתי את מרכז הידע בנושא "${node.title}" ואשמח להתייעץ לגבי העסק שלנו.`,
                                                {
                                                    sourcePage: node.url,
                                                    sourceSection: 'solutions',
                                                    sourceHub: node.slug,
                                                    sourceTopic: node.slug,
                                                    intent: 'consultation',
                                                    ctaType: 'footer_cta',
                                                    sourceLabel: `hub_solutions_whatsapp_${node.slug}`
                                                }
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-emerald-400 font-medium transition-colors py-2 px-3"
                                        >
                                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                                            <span>התייעצות בוואטסאפ</span>
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Section 7: FAQs */}
                        {hub && hub.faqs && hub.faqs.length > 0 && (
                            <section id="faqs" className="mb-14 scroll-mt-28">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <HelpCircle className="w-4 h-4 text-primary" />
                                    <span>שאלות ותשובות</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-5">
                                    שאלות נפוצות בנושא זה
                                </h2>

                                <div className="space-y-2.5">
                                    {hub.faqs.map((faq, index) => {
                                        const isOpen = openFaqIndex === index;
                                        return (
                                            <div 
                                                key={index} 
                                                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleFaq(index)}
                                                    className="w-full p-4 text-right font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-secondary' : ''}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="p-4 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                                        {renderFormattedText(faq.answer, onNavigate)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Section 8: Recommended Next Hubs */}
                        {node.recommendedNextSlugs && node.recommendedNextSlugs.length > 0 && (
                            <section className="mb-10 p-6 bg-slate-100/80 border border-slate-200 rounded-3xl">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                    נושאי ידע נוספים שכדאי להכיר:
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {node.recommendedNextSlugs.map(slug => {
                                        const nextNode = getKnowledgeNodeBySlug(slug);
                                        if (nextNode) {
                                            return (
                                                <button
                                                    key={slug}
                                                    onClick={() => onNavigate(nextNode.url)}
                                                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1.5 hover:shadow-xs transition-all"
                                                >
                                                    <Layers className="w-3.5 h-3.5 text-secondary" />
                                                    <span>{nextNode.title}</span>
                                                </button>
                                            );
                                        }
                                        const art = getArticleBySlug(slug);
                                        if (art) {
                                            return (
                                                <button
                                                    key={slug}
                                                    onClick={() => onNavigate(`/articles/${art.slug}`)}
                                                    className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1.5 hover:shadow-xs transition-all"
                                                >
                                                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>{art.title}</span>
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </div>

            {/* Mobile Floating Navigation Pill */}
            {showMobileNav && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden max-w-[92vw]">
                    <button
                        onClick={() => setIsMobileDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-900/95 text-white rounded-full shadow-2xl backdrop-blur-md border border-white/20 text-xs font-bold active:scale-95 transition-all"
                    >
                        <Compass size={16} className="text-secondary flex-shrink-0" />
                        <span className="truncate max-w-[190px]">
                            {activeNavTitle}
                        </span>
                        <ChevronDown size={14} className="text-slate-300 flex-shrink-0" />
                    </button>
                </div>
            )}

            {/* Mobile Bottom-Sheet Navigation Drawer */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs">
                    <div 
                        className="fixed inset-0"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                    <div className="relative z-10 bg-white rounded-t-3xl max-h-[80vh] flex flex-col p-5 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
                            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                                <Compass size={18} className="text-primary" />
                                <span>ניווט במדריך</span>
                            </div>
                            <button
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                                aria-label="סגירת תפריט ניווט"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-1.5 py-2 flex-1">
                            {navSections.map((sec) => {
                                const IconComp = sec.icon;
                                const isActive = activeSectionId === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        onClick={() => scrollToSection(sec.id)}
                                        className={`w-full text-right flex items-center gap-3 p-2.5 rounded-xl transition-colors text-xs ${
                                            isActive 
                                                ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                                                : 'text-slate-800 hover:bg-slate-50'
                                        }`}
                                    >
                                        <IconComp size={15} className={isActive ? 'text-primary' : 'text-slate-400'} />
                                        <span>{sec.title}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                            <Button
                                variant="primary"
                                size="sm"
                                className="w-full font-bold text-xs py-2.5 shadow-md shadow-primary/25 flex items-center justify-center gap-1.5"
                                onClick={() => {
                                    setIsMobileDrawerOpen(false);
                                    if (onOpenBookingModal) {
                                        onOpenBookingModal({
                                            title: `קביעת פגישת אבחון: ${node.title}`,
                                            subtitle: `בפגישה נמפה את צורת העבודה שלכם ונבחן פתרון מותאם עבור ${node.title}`,
                                            badge: 'תיאום פגישה ביומן',
                                            attribution: {
                                                sourcePage: node.url,
                                                sourceSection: activeSectionId || 'mobile_drawer',
                                                sourceHub: node.slug,
                                                sourceTopic: node.slug,
                                                intent: 'meeting',
                                                ctaType: 'modal_booking',
                                                sourceLabel: `hub_mobile_drawer_booking_${node.slug}`
                                            }
                                        });
                                    } else {
                                        onNavigate('/#contact');
                                    }
                                }}
                            >
                                <Calendar size={14} />
                                <span>קביעת פגישת אבחון ביומן</span>
                            </Button>
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setIsMobileDrawerOpen(false);
                                }}
                                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                            >
                                <ArrowUp size={13} />
                                <span>חזרה לראש המדריך</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};
