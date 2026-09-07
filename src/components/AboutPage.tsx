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
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
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
                    אלטרוביז היא חברת טכנולוגיה ותוכנה ישראלית המפתחת מערכת CRM מתקדמת, פתרונות אוטומציה עסקית, וחיבורי תקשורת רב-ערוציים מבוססי WhatsApp ובינה מלאכותית — מתוך מטרה לעזור לעסקים להכניס את השיטה לסיסטם.
                </p>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* 1. Identity & Mission */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-base font-bold">1</span>
                        <span>מה אנחנו עושים ומה המומחיות שלנו</span>
                    </h2>

                    <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
                        <p>
                            עסקים רבים מאבדים לקוחות לא בגלל היעדר פניות, אלא בגלל היעדר סיסטם מסודר: לידים שמתפספסים בין טפסים, פניות שלא נענות בזמן, מעקב ידני מסורבל, והיעדר אחידות בתהליך המכירה.
                        </p>
                        <p>
                            <strong>AltruBiz CRM</strong> פותחה במיוחד כדי לגשר על הפער הזה. המערכת מרכזת את כל הפעילות העסקית תחת קורת גג אחת — החל מקליטת לידים אוטומטית מכל פלטפורמה (פייסבוק, אינסטגרם, גוגל, אתרי אינטרנט), דרך טיפוח מיידי בוואטסאפ ובמייל, ועד לבוטים חכמים שקובעים פגישות ביומן ומנהלים תהליכי שירות ומכירה 24/7.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <span>תקשורת WhatsApp חכמה</span>
                            </h3>
                            <p className="text-sm text-slate-600">
                                אוטומציות דיוור, הודעות תגובה מהירות ושיחות מרוכזות בממשק אחיד התואם למדיניות Meta.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" />
                                <span>משתמשים ורשומות ללא הגבלה</span>
                            </h3>
                            <p className="text-sm text-slate-600">
                                מודל רישוי הוגן: אין תשלום לפי עובד או כמות נתונים. כל המסלולים כוללים משתמשים בלתי מוגבלים.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span>מותאם לשוק הישראלי</span>
                            </h3>
                            <p className="text-sm text-slate-600">
                                ממשק מלא בעברית (RTL), התאמה ליומנים מקומיים, ועמידה בחוקי התקשורת והספאם.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Products & Services */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-base font-bold">2</span>
                        <span>מוצרים ומסלולי שירות</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">מסלול בסיסי</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">AltruBiz Pro</h3>
                                <div className="text-2xl font-black text-primary mb-4">₪297 <span className="text-xs font-normal text-gray-500">/ לחודש</span></div>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                    תשתית CRM מלאה לניהול לידים, יומנים מתוזמנים, טפסים, דפי נחיתה ופייפליין מכירות.
                                </p>
                            </div>
                            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg">
                                ✓ משתמשים ורשומות ללא הגבלה
                            </div>
                        </div>

                        <div className="border-2 border-primary rounded-2xl p-6 flex flex-col justify-between relative bg-blue-50/20 shadow-md">
                            <div>
                                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">הנבחר ביותר</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">AltruBiz Smart</h3>
                                <div className="text-2xl font-black text-primary mb-4">₪497 <span className="text-xs font-normal text-gray-500">/ לחודש</span></div>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                    כולל את כל תכונות Pro ובנוסף אינטגרציית WhatsApp, משפכים שיווקיים, קליטת לידים מפייסבוק ואוטומציות סושיאל.
                                </p>
                            </div>
                            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg">
                                ✓ חיבורי WhatsApp ואוטומציות
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">בינה מלאכותית מלאה</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">AltruBiz Power</h3>
                                <div className="text-2xl font-black text-primary mb-4">₪747 <span className="text-xs font-normal text-gray-500">/ לחודש</span></div>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                    כולל את כל תכונות Smart ובנוסף בוטים מבוססי AI חכמים, קביעת פגישות ביומן דרך וואטסאפ, בונה אתרים ב-AI וחיבורי API.
                                </p>
                            </div>
                            <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg">
                                ✓ סוכני AI ואוטומציות מתקדמות
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Target Audience & Market */}
                <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-100 text-primary flex items-center justify-center text-base font-bold">3</span>
                        <span>קהל יעד ואזור פעילות</span>
                    </h2>

                    <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
                        <p>
                            המערכת מותאמת באופן ייעודי ל<strong>שוק הישראלי</strong> ומשרתת:
                        </p>
                        <ul className="space-y-2 mr-4">
                            {[
                                'עסקים קטנים ובינוניים (SMBs) הזקוקים לסדר, מעקב ואוטומציה יומיומית.',
                                'עסקים דיגיטליים וסוכנויות שיווק המנהלות קמפיינים ממומנים ומספר רב של לידים במקביל.',
                                'יועצים, נותני שירותים ומטפלים המעוניינים לתאם פגישות ביומן באופן אוטונומי.',
                                'מוקדי מכירות ושירות הזקוקים לתיעוד שיחות מרוכז בוואטסאפ, SMS ובמייל.'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 4. Contact & Channels */}
                <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-primary/30 text-amber-400 flex items-center justify-center text-base font-bold">4</span>
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
                                    <a href="https://link.altrubiz.co.il/widget/bookings/caldorey" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:underline">
                                        לחצו לקביעת פגישה ביומן
                                    </a>
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
