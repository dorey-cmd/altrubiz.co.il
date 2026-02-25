import React, { useState } from 'react';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';

const PRICES = {
    yearly: { pro: 297, smart: 497, power: 747 },
    monthly: { pro: 349, smart: 597, power: 897 }
};

const LINKS = {
    pro: {
        year: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=c86d06fe-581d-4f12-aa37-0d7d29631167",
        month: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=7e2ad3d5-c300-4d6a-8182-ff8ff66a2a12"
    },
    smart: {
        year: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=f9c2fcb5-113e-4436-a005-78ffec156846",
        month: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=b6313fee-e79a-4249-93f3-0cf56cbb1020"
    },
    power: {
        year: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=6a48609a-da08-4a9d-abfd-b7dbfee3f1d6",
        month: "https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=51c78e8d-d8ae-43ab-9d2b-408451a21082"
    }
};

const COMPARISON_DATA = [
    {
        category: "תשתית CRM",
        features: [
            { name: "משתמשים ללא הגבלה", pro: true, smart: true, power: true },
            { name: "רשומות ללא הגבלה", pro: true, smart: true, power: true },
            { name: "CRM עם יומן מתוזמן, טפסים, דפי נחיתה ופייפליין מובנה", pro: true, smart: true, power: true },
            { name: "ניהול לידים", pro: true, smart: true, power: true },
            { name: "דשבורד איכותי", pro: true, smart: true, power: true },
        ]
    },
    {
        category: "שיווק ואוטומציות",
        features: [
            { name: "אינטגרציית וואטסאפ לא רשמי עם טריגרים אוטומטיים", pro: false, smart: true, power: true },
            { name: "מערך Funnels שיווקיים + ניהול רשימות תפוצה", pro: false, smart: true, power: true },
            { name: "קליטת נרשמים מטפסי פייסבוק במערכת ללא מאמץ", pro: false, smart: true, power: true },
            { name: "מערך תגובות אוטומטיות לנרשמים", pro: false, smart: true, power: true },
            { name: "פירסום פוסטים במרוכז ותיזמון שלהם ממקום אחד למגוון גדול של רשתות חברתיות", pro: false, smart: true, power: true },
            { name: "מתן תגובות אוטומטיות למגיבים לפוסטים", pro: false, smart: true, power: true },
            { name: "מרכז מולטיצאנל לתקשורת רב ערוצית מול לידים ולקוחות (לקוח שנרשם בטופס פייסבוק לדוגמא, מקבל הודעת וואסאפ מידית)", pro: false, smart: true, power: true },
            { name: "מנהל מודעות פייסבוק", pro: false, smart: true, power: true },
            { name: "מנהל מודעות גוגל", pro: false, smart: true, power: true },
            { name: "מרכז שליטה ודוחות מקמפיינים ממומנים והתוצאות שהם מניבים במקום אחד", pro: false, smart: true, power: true },
            { name: "מערך דיוור ואוטומציות תקשורת במייל, וואטסאפ לא רשמי, פייסבוק, ורשתות חברתיות רבות", pro: false, smart: true, power: true },
            { name: "ניהול תגובות והמלצות בגוגל", pro: false, smart: true, power: true },
            { name: "חיבור דומיין ייחודי", pro: false, smart: true, power: true },
            { name: "ניהול כתובות קצרות על גבי הדומיין הייחודי למטרות שיווק", pro: false, smart: false, power: true },
            { name: "בניית אתרים ודפי נחיתה ב-AI על גבי המערכת", pro: false, smart: false, power: true },
            { name: "בוטים AI שעונים ללקוחות ולידים נכנסים בצורה חכמה ומיידית", pro: false, smart: false, power: true },
            { name: "שילוב של AI בבניית אוטומציות בתוך המערכת, בכתיבה ובמקומות רבים אחרים", pro: false, smart: false, power: true },
            { name: "קביעת פגישות דרך הוואטסאפ ללקוחות דרך יומן על ידי בוט AI חכם", pro: false, smart: false, power: true },
            { name: "אוטומציות מתקדמות בשילוב עם מערכות רבות", pro: false, smart: false, power: true },
            { name: "API, וובהוקים אוטומציות", pro: false, smart: false, power: true },
            { name: "אוטומציות מתקדמות המשלבות יכולת AI, ושרותים שונים מגוגל דוקס ועד מערכות חיצוניות רבות אחרות", pro: false, smart: false, power: true },
            { name: "מחולל דוחות מתקדם", pro: false, smart: false, power: true },
            { name: "דשבורדים מותאמים אישית", pro: false, smart: false, power: true },
        ]
    },
    {
        category: "תמיכה שוטפת",
        features: [
            { name: "צ'אט בוט זמין 24/7", pro: true, smart: true, power: true },
            { name: "דואר אלקטרוני", pro: "זמין", smart: "זמין", power: "עדיפות גבוהה" },
            { name: "חבילות תמיכה נרחבות לכל משתמשי העסק בזום אישי", pro: false, smart: "זמין", power: "3 שעות אישיות" },
            { name: "הטמעה ופיתוח אוטומציות בהתאמה אישית", pro: false, smart: "5% הנחה", power: "10% הנחה" },
        ]
    },
    {
        category: "תמיכה בהקמה",
        features: [
            { name: "שעת תמיכה ו-OnBoarding אישית בזום אחד על אחד", pro: "שעה אחת", smart: "3 שעות", power: "3 שעות לחודש (3 חודשים)" },
        ]
    }
];

export const PricingOffer = () => {
    const [isYearly, setIsYearly] = useState(true);
    const [showComparison, setShowComparison] = useState(false);
    const prices = isYearly ? PRICES.yearly : PRICES.monthly;

    const CheckIcon = ({ className = "w-5 h-5" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    );

    return (
        <section id="pricing" className="py-24 bg-[#EBF0F6] text-right font-sans relative z-20 overflow-hidden scroll-mt-20" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-10">
                        בחרו את החבילה המושלמת עבורכם
                    </h2>

                    <div className="flex flex-col items-center justify-center" dir="ltr">
                        <div className="relative inline-flex bg-white rounded-full p-1 shadow-md border border-gray-300 w-80 h-14 cursor-pointer"
                            onClick={() => setIsYearly(!isYearly)}>

                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0F6CBD] rounded-full shadow-sm z-0"
                                initial={false}
                                animate={{
                                    x: isYearly ? 0 : 152
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ left: '4px' }}
                            />

                            <button
                                onClick={(e) => { e.stopPropagation(); setIsYearly(true); }}
                                className={`flex-1 relative z-10 font-bold text-lg transition-colors duration-200 ${isYearly ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                שנתי
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); setIsYearly(false); }}
                                className={`flex-1 relative z-10 font-bold text-lg transition-colors duration-200 ${!isYearly ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                חודשי
                            </button>
                        </div>

                        <div className="h-8 mt-4 overflow-hidden relative w-full">
                            <motion.div
                                initial={false}
                                animate={{ y: isYearly ? -32 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center"
                            >
                                <div className="h-8 flex items-center justify-center text-gray-500 font-medium">
                                    מסלול גמיש ללא התחייבות
                                </div>
                                <div className="h-8 flex items-center justify-center text-green-600 font-bold" dir="rtl">
                                    יעילות גבוהה יותר, עלות נמוכה יותר - חוסכים בענק!
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch mb-20">
                    {/* PRO Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] shadow-xl p-6 md:p-6 lg:p-7 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300 border-2 border-[#22C55E]"
                    >
                        {/* Sale Badge */}
                        <div className="absolute -top-3 -right-3 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg z-20 animate-bounce">
                            מבצע!
                        </div>

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22C55E] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                            ניהול המכירות
                        </div>

                        <h3 className="text-2xl font-bold text-[#22C55E] mb-2 flex items-center gap-2 mt-4">
                            PRO <span className="w-5 h-5 bg-[#22C55E] rounded-sm inline-block"></span>
                        </h3>
                        <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                            <span className="text-3xl font-bold mt-2">₪</span>
                            <span className="text-6xl font-bold">
                                <CountUp end={97} duration={0.5} preserveValue={true} />
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">+ מע"מ לחודש</p>

                        <p className="text-[#1E293B] font-bold mb-8 px-2 min-h-[64px] flex items-center justify-center leading-tight text-lg">
                            ניהול הלידים עד המכירה – בצורה מסודרת וברורה
                        </p>

                        <div className="w-full h-px bg-gray-100 mb-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow w-full text-right px-2">
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-green-500 font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>כל הלידים במקום אחד – בלי בלגן, בלי אקסלים, בלי פתקים</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-green-500 font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>תהליך עבודה מובנה שמוביל כל ליד קדימה עד סגירה</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-green-500 font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>יומן, פייפליין ותזכורות שעובדים בשבילך</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-green-500 font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>לראות בדיוק מה קורה בכל זמן עם כל אחד מתהליכי המכירה</span>
                            </li>
                        </ul>

                        <p className="text-[#22C55E] text-base font-bold mb-8 px-2">
                            זו החבילה שמכניסה סדר למכירות ומפסיקה את תחושת ה"כאוס".
                        </p>

                        <a
                            href="https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=1e732ce0-ca73-4acb-8044-c5bbd1984817"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center rounded-lg font-bold text-white bg-[#22C55E] hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 text-lg mb-4"
                        >
                            {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                        </a>
                    </motion.div>

                    {/* SMART Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-6 lg:p-7 flex flex-col items-center text-center relative md:-translate-y-6 border-4 border-[#F59E0B] z-10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F59E0B] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                            מוסיפים גם את ניהול השיווק למערכת
                        </div>

                        <h3 className="text-2xl font-bold text-[#F59E0B] mb-2 flex items-center gap-2 mt-2">
                            SMART <span className="w-5 h-5 bg-[#F59E0B] rounded-sm inline-block"></span>
                        </h3>
                        <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                            <span className="text-3xl font-bold mt-2">₪</span>
                            <span className="text-6xl font-bold">
                                <CountUp end={prices.smart} duration={0.5} preserveValue={true} />
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">+ מע"מ לחודש</p>

                        <p className="text-[#1E293B] font-bold mb-8 px-2 min-h-[64px] flex items-center justify-center leading-tight text-lg">
                            מערך שיווק מלא שמתחבר ישירות למכירות
                        </p>

                        <div className="w-full h-px bg-gray-100 mb-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow w-full text-right px-2">
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>כל מה שיש ב-PRO – ועוד שכבת שיווק עוצמתית מעליו</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>חיבור אמיתי לרשתות וקמפיינים</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>בניית משפכי שיווק שמייצרים זרימה קבועה של לידים</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>אוטומציות חכמות שעובדות 24/7 במקום כוח אדם</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>דיוור, הודעות, קמפיינים ומעקב ביצועים במקום אחד</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#F59E0B] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>מדידה אמיתית של מה עובד ומה מבזבז תקציב</span>
                            </li>
                        </ul>

                        <p className="text-[#F59E0B] text-base font-bold mb-8 px-2">
                            זו כבר לא רק מערכת לניהול לידים – זו מכונה שמייצרת אותם.
                        </p>

                        <a
                            href={isYearly ? LINKS.smart.year : LINKS.smart.month}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center rounded-lg font-bold text-white bg-[#F59E0B] hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-500/20 text-lg mb-4"
                        >
                            {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                        </a>
                    </motion.div>

                    {/* POWER Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2rem] shadow-xl p-6 md:p-6 lg:p-7 flex flex-col items-center text-center relative hover:-translate-y-2 transition-transform duration-300 border-2 border-[#DC2626]"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#DC2626] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                            כל הכח והטכנולוגיה במערכת עוצמתית אחת
                        </div>

                        <h3 className="text-2xl font-bold text-[#DC2626] mb-2 flex items-center gap-2 mt-4">
                            POWER <span className="w-5 h-5 bg-[#DC2626] rounded-sm inline-block"></span>
                        </h3>
                        <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                            <span className="text-3xl font-bold mt-2">₪</span>
                            <span className="text-6xl font-bold">
                                <CountUp end={prices.power} duration={0.5} preserveValue={true} />
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">+ מע"מ לחודש</p>

                        <p className="text-[#1E293B] font-bold mb-8 px-2 min-h-[64px] flex items-center justify-center leading-tight text-lg">
                            המערכת הופכת לעמוד השדרה ומנוע הצמיחה של העסק – בשילוב AI
                        </p>

                        <div className="w-full h-px bg-gray-100 mb-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow w-full text-right px-2">
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#DC2626] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>כל מה שיש ב-SMART בשילוב AI ויכולות טכנולוגיות מתקדמות</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#DC2626] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>AI שמזהה הזדמנויות, מגיב ללקוחות ומניע תהליכים בלי תלות ידנית</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#DC2626] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>שליטה מלאה בדאטה, בניתוחים ובקבלת החלטות מבוססת ביצועים</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#DC2626] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>אוטומציות המנהלות מכירות, שיווק ותפעול כמערכת אחת</span>
                            </li>
                            <li className="flex items-start gap-3 text-base text-gray-600">
                                <span className="mt-1 text-[#DC2626] font-bold"><CheckIcon className="w-6 h-6" /></span>
                                <span>אינטגרציה מלאה לכל נכס דיגיטלי והקטנת תלות בכ"א</span>
                            </li>
                        </ul>

                        <p className="text-[#DC2626] text-base font-bold mb-8 px-2">
                            זו לא עוד חבילה. זו קפיצת מדרגה תודעתית – תשתית של שליטה וסקייל אמיתי.
                        </p>

                        <a
                            href={isYearly ? LINKS.power.year : LINKS.power.month}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 text-center rounded-lg font-bold text-white bg-[#DC2626] hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 text-lg mb-4"
                        >
                            {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                        </a>
                    </motion.div>
                </div>

                {/* Compare All Features Button */}
                <div className="text-center mb-12">
                    <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#1E293B] text-[#1E293B] font-bold rounded-full hover:bg-slate-50 transition-all shadow-md group"
                    >
                        {showComparison ? 'הסתר השוואת תכונות' : 'השווה את כל התכונות'}
                        <motion.span animate={{ rotate: showComparison ? 180 : 0 }}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.span>
                    </button>
                </div>

                {/* Comparison Table */}
                <AnimatePresence>
                    {showComparison && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-8 overflow-x-auto">
                                <table className="w-full text-right border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100">
                                            <th className="py-6 px-4 text-xl font-bold text-slate-800 w-1/3">תכונות</th>
                                            <th className="py-6 px-4 text-center text-xl font-bold text-[#22C55E]">PRO</th>
                                            <th className="py-6 px-4 text-center text-xl font-bold text-[#F59E0B]">SMART</th>
                                            <th className="py-6 px-4 text-center text-xl font-bold text-[#DC2626]">POWER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COMPARISON_DATA.map((cat, idx) => (
                                            <React.Fragment key={idx}>
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan={4} className="py-4 px-4 text-lg font-black text-slate-600 text-right">
                                                        {cat.category}
                                                    </td>
                                                </tr>
                                                {cat.features.map((feat, fIdx) => (
                                                    <tr key={fIdx} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                                        <td className="py-4 px-4 text-slate-700 font-medium">{feat.name}</td>
                                                        <td className="py-4 px-4 text-center">
                                                            {typeof feat.pro === 'boolean' ? (
                                                                feat.pro ? <CheckIcon className="w-6 h-6 text-[#22C55E] mx-auto" /> : <span className="text-slate-300">-</span>
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-600">{feat.pro}</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            {typeof feat.smart === 'boolean' ? (
                                                                feat.smart ? <CheckIcon className="w-6 h-6 text-[#F59E0B] mx-auto" /> : <span className="text-slate-300">-</span>
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-600">{feat.smart}</span>
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            {typeof feat.power === 'boolean' ? (
                                                                feat.power ? <CheckIcon className="w-6 h-6 text-[#DC2626] mx-auto" /> : <span className="text-slate-300">-</span>
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-600">{feat.power}</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Additional Modules Text List */}
                                <div className="mt-16 bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
                                    <h4 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-4">
                                        מודולים נוספים בתמחור מיוחד - זמינים לחבילות שונות
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-right">
                                        {[
                                            "חיבור לוואטסאפ לא רשמי (כלול ב-SMART ו-POWER)",
                                            "יצירת אוטומציות ומודולים שונים בהתאמה אישית",
                                            "חיבור לוואטסאפ רשמי (WhatsApp Business API)",
                                            "חיבור ל-Notion, Airtable, Google Contacts",
                                            "חיבור לשירותי סליקה",
                                            "מודול קליקאפ (ClickUp)",
                                            "מודול חיבור למאנדיי (Monday.com)",
                                            "מודול חיבור ל-Typeform",
                                            "הגדלת נפח אחסון המדיה",
                                            "חבילות דיוור ענק לפי צרכיי העסק",
                                            "חבילות דיוור מאסיביות",
                                            "מרכזיה טלפונית",
                                            "מודול קורסים ופורטל למידה",
                                            "מודול חנות וסריקת מוצרים"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-slate-600 font-medium py-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#0F6CBD]"></div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-8 text-slate-500 text-sm font-medium">
                                        * ניתן לצרף את המודולים הללו בהתאם לצרכי העסק ותמחור משתנה.
                                    </p>
                                </div>

                                {/* Footer Comparison Button for Conversion */}
                                <div className="mt-12 text-center border-t border-slate-100 pt-12">
                                    <h4 className="text-2xl font-bold text-slate-800 mb-6">מצאתם את החבילה המתאימה?</h4>
                                    <button
                                        onClick={() => {
                                            setShowComparison(false);
                                            // Using setTimeout to ensure the state change starts/completes enough for the anchor to be targetable correctly
                                            setTimeout(() => {
                                                const element = document.getElementById('pricing');
                                                if (element) {
                                                    const offset = 80; // Adjust for header height
                                                    const bodyRect = document.body.getBoundingClientRect().top;
                                                    const elementRect = element.getBoundingClientRect().top;
                                                    const elementPosition = elementRect - bodyRect;
                                                    const offsetPosition = elementPosition - offset;

                                                    window.scrollTo({
                                                        top: offsetPosition,
                                                        behavior: 'smooth'
                                                    });
                                                }
                                            }, 10);
                                        }}
                                        className="inline-flex items-center gap-2 px-10 py-5 bg-[#0F6CBD] text-white font-bold rounded-full hover:bg-[#0d599c] transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-lg cursor-pointer"
                                    >
                                        <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        חזרה לבחירת חבילה ורכישה
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
