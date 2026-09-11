import React from 'react';
import { 
    Building2, 
    CheckCircle2, 
    ShieldCheck, 
    MessageSquare, 
    Phone, 
    ExternalLink, 
    Layers, 
    ChevronLeft, 
    Calendar,
    Award
} from 'lucide-react';

import { Breadcrumbs } from './common/Breadcrumbs';

interface AboutPageProps {
    onNavigate: (path: string) => void;
    onOpenContactModal?: () => void;
    onOpenBookingModal?: (options?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenContactModal, onOpenBookingModal }) => {
    const breadcrumbItems = [
        { name: 'דף הבית', path: '/' },
        { name: 'אודות AltruBiz', path: '/about' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-24 pb-20 font-sans" dir="rtl">
            {/* Breadcrumb Navigation */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Breadcrumbs items={breadcrumbItems} onNavigate={onNavigate} />
            </div>

            {/* Header Hero */}
            <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-primary text-xs sm:text-sm font-semibold mb-4 border border-blue-100">
                    <Building2 size={16} />
                    <span>פרופיל חברה ומידע ארגוני</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    אודות AltruBiz (אלטרוביז)
                </h1>

                <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
                    אלטרוביז היא חברת טכנולוגיה ותוכנה ישראלית המפתחת מערכת CRM מתקדמת, פתרונות אוטומציה עסקית, וחיבורי תקשורת רב-ערוציים מבוססי WhatsApp ובינה מלאכותית - מתוך מטרה לעזור לעסקים להכניס את השיטה לסיסטם.
                </p>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* 1. Identity & Mission */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-base font-bold">1</span>
                        <span>מה אנחנו עושים ומה המומחיות שלנו</span>
                    </h2>

                    <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed mb-8">
                        <p>
                            עסקים רבים מאבדים לקוחות לא בגלל היעדר פניות, אלא בגלל היעדר סיסטם מסודר: לידים שמתפספסים בין טפסים, פניות שלא נענות בזמן, מעקב ידני מסורבל, והיעדר אחידות בתהליך המכירה.
                        </p>
                        <p>
                            ב-AltruBiz אנחנו מתמחים בבניית תשתית עסקית שלמה: החל מחיבור ערוצי התקשורת (בדגש על וואטסאפ רשמי), דרך ניהול הפייפליין והאוטומציות, ועד להטמעה מעשית שהצוות באמת משתמש בה ביומיום.
                        </p>
                    </div>

                    {/* Deep-Linked Rubrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                        {/* Rubric 1: Lost Leads */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span>עצירת בריחת לידים</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    מרכוז כל הפניות מכל המקורות, מניעת כפילויות, טיפול בשיחות שלא נענו ומעקב רציף אחר כל שלב בפייפליין המכירות.
                                </p>
                            </div>
                            <a 
                                href="/topics/lost-leads"
                                onClick={(e) => { e.preventDefault(); onNavigate('/topics/lost-leads'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>למדריך האבחון המלא לבריחת לידים</span>
                                <span>←</span>
                            </a>
                        </div>

                        {/* Rubric 2: WhatsApp CRM */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <span>תקשורת WhatsApp חכמה</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    חיבור רשמי ל-WhatsApp Cloud API, שליחת תבניות מאושרות, תזכורות אוטומטיות לפגישות ותיעוד מלא של ההתכתבות בכרטיס הלקוח.
                                </p>
                            </div>
                            <a 
                                href="/topics/whatsapp-in-crm"
                                onClick={(e) => { e.preventDefault(); onNavigate('/topics/whatsapp-in-crm'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>למדריך המקיף לוואטסאפ ב-CRM</span>
                                <span>←</span>
                            </a>
                        </div>

                        {/* Rubric 3: Speed to Lead */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    <span>מענה ב-5 הדקות הראשונות</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    אוטומציות מענה מיידי שמבטיחות שכל ליד חדש מקבל התייחסות מכבדת ואישית בדקות שבהן כוונת הרכישה שלו נמצאת בשיא.
                                </p>
                            </div>
                            <a 
                                href="/articles/lead-first-5-minutes-guide"
                                onClick={(e) => { e.preventDefault(); onNavigate('/articles/lead-first-5-minutes-guide'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>לקריאת המדריך למענה מהיר</span>
                                <span>←</span>
                            </a>
                        </div>

                        {/* Rubric 4: Unified Inbox */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <Layers className="w-5 h-5 text-primary" />
                                    <span>תיבת הודעות אחודה (Inbox)</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    ריכוז כל הודעות הוואטסאפ, האינסטגרם, הפייסבוק, ה-SMS והמייל תחת ממשק אחד – בלי לאבד הקשר ובלי לזגזג בין מכשירים.
                                </p>
                            </div>
                            <a 
                                href="/articles/omnichannel-communication-unified-inbox-crm-guide"
                                onClick={(e) => { e.preventDefault(); onNavigate('/articles/omnichannel-communication-unified-inbox-crm-guide'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>למדריך התקשורת הרב-ערוצית</span>
                                <span>←</span>
                            </a>
                        </div>

                        {/* Rubric 5: Sales Adoption */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    <span>אימוץ CRM בצוות המכירות</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    ממשק פשוט ומהיר שמסיר חיכוך מאנשי המכירות, כדי שהם יעדכנו את הסטטוסים בזמן אמת ולא ינהלו עסקאות במחברות ובראש.
                                </p>
                            </div>
                            <a 
                                href="/articles/salespeople-hate-crm-adoption-guide"
                                onClick={(e) => { e.preventDefault(); onNavigate('/articles/salespeople-hate-crm-adoption-guide'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>למדריך אימוץ ה-CRM במכירות</span>
                                <span>←</span>
                            </a>
                        </div>

                        {/* Rubric 6: Unlimited Users */}
                        <div className="bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 border border-slate-200/80 transition-all flex flex-col justify-between group">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-2 text-lg">
                                    <Award className="w-5 h-5 text-primary" />
                                    <span>משתמשים ללא הגבלה</span>
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    מודל רישוי הוגן המאפשר לכל הצוות לעבוד על אותה מערכת ללא תוספת תשלום פר משתמש, כדי שהעסק יוכל לגדול בחופשיות.
                                </p>
                            </div>
                            <a 
                                href="/#pricing"
                                onClick={(e) => { e.preventDefault(); onNavigate('/#pricing'); }}
                                className="text-xs font-bold text-primary group-hover:text-blue-700 flex items-center gap-1 mt-auto pt-3 border-t border-slate-200/60"
                            >
                                <span>לצפייה במסלולים ובתמחור</span>
                                <span>←</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. Contact & Channels */}
                <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-primary/30 text-amber-400 flex items-center justify-center text-base font-bold">2</span>
                        <span>פרטי קשר וערוצים רשמיים</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-300 text-sm sm:text-base">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-slate-400">תמיכה בוואטסאפ</div>
                                    <a href="https://wa.me/972544350000" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                                        +972-54-435-0000
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-slate-400">תיאום פגישת היכרות והדגמה</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {onOpenBookingModal ? (
                                            <button 
                                                type="button" 
                                                onClick={() => onOpenBookingModal({
                                                    title: 'קביעת פגישת היכרות והדגמה',
                                                    subtitle: 'נשמח להכיר את העסק שלכם, להבין את האתגרים ולהציג הדגמה חיה של AltruBiz CRM.',
                                                    badge: 'תיאום פגישה ביומן'
                                                })}
                                                className="text-white font-bold hover:underline cursor-pointer"
                                            >
                                                לקביעת פגישה ביומן
                                            </button>
                                        ) : (
                                            <a href="https://link.altrubiz.co.il/widget/booking/afkzW0ORpY08WTgmcfqU" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                                                לקביעת פגישה ביומן
                                            </a>
                                        )}
                                        {onOpenContactModal && (
                                            <>
                                                <span className="text-slate-500">|</span>
                                                <button 
                                                    type="button" 
                                                    onClick={onOpenContactModal}
                                                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
                                                >
                                                    השארת פרטים בטופס
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <ExternalLink className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-slate-400">כניסה למערכת (Web App)</div>
                                    <a href="https://app.altrubiz.com/" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                                        app.altrubiz.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-xs text-slate-400">תנאי שירות ומדיניות פרטיות</div>
                                    <a href="https://mkt.altrubiz.co.il/terms" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                                        תנאי שימוש ומדיניות
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note regarding official business input */}
                    <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>AltruBiz CRM • כל הזכויות שמורות</span>
                        <button 
                            onClick={() => onNavigate('/')}
                            className="text-primary hover:text-white transition-colors flex items-center gap-1 font-semibold"
                        >
                            <span>חזרה לדף הבית</span>
                            <ChevronLeft size={14} />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};
