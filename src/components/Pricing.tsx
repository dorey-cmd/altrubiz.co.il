import { useState, useRef } from 'react';
import CountUp from 'react-countup';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { StaggerGroup, StaggerItem, HoverCard, ParallaxLayer } from './motion';

// Updated Data with correct links
const PRICES = {
    yearly: { pro: 297, smart: 497, power: 747 },
    monthly: { pro: 349, smart: 597, power: 897 }
};

const FEATURES = {
    pro: ["CRM עם יומן מתוזמן, טפסים, דפי נחיתה ופייפליין מובנה", "ניהול בסיסי של לידים", "דוחות סטטיסטיים בסיסיים"],
    smart: ["כל מה שב־PRO, בתוספת:", "אינטגרציית וואטסאפ לא רשמי עם טריגרים אוטומטיים", "מערך Funnels שיווקיים + ניהול רשימות תפוצה", "צ'אטבוט באתר, בוט תמיכה, AI Follow-up", "Dashboard עם KPIs ודוחות מתקדמים", "פגישת התחלה עם ליווי להטמעה"],
    power: ["כל מה שב־SMART, בתוספת:", "פילוח מתקדם, תיוגים ותזמון הודעות חכם", "AI מותאם אישית לפי שלבי מסע הלקוח", "Funnels מרובי שלבים, חנות דיגיטלית, פורטל קורסים ואתר מלא", "דשבורדים מותאמים אישית ומודיעין עסקי", "אינטגרציה מלאה עם API, וובהוקים אוטומציות ואפשרות לשילוב מרכזיה טלפונית", "3 פגישות אסטרטגיה וליווי מקצועי"]
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

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true);
    const prefersReducedMotion = usePrefersReducedMotion();
    const prices = isYearly ? PRICES.yearly : PRICES.monthly;
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start']
    });

    return (
        <section ref={sectionRef} id="pricing" className="py-24 bg-[#EBF0F6] text-right font-sans relative z-20 overflow-hidden" dir="rtl">
            {/* Ambient Background Parallax Elements */}
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -80]) }}
                className="absolute top-10 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-0"
            />
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 70]) }}
                className="absolute bottom-10 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-0"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-10">
                        בחירת החבילה המתאימה לעסק שלכם
                    </h2>

                    {/* Improved Toggle Switch */}
                    <div className="flex flex-col items-center justify-center" dir="ltr">
                        {/* Forced LTR for Toggle to simplify absolute positioning coordinate system */}
                        <div 
                            className="relative inline-flex bg-white rounded-full p-1 shadow-md border border-gray-300 w-80 h-14 cursor-pointer"
                            onClick={() => setIsYearly(!isYearly)}
                        >
                            <motion.div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#0F6CBD] rounded-full shadow-sm z-0"
                                initial={false}
                                animate={{
                                    x: isYearly ? 0 : 152 // 0 = Left (Yearly), 152 = Right (Monthly) in LTR
                                }}
                                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                                style={{ left: '4px' }} // Anchor to left
                            />

                            {/* Yearly Button (Left in LTR) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsYearly(true); }}
                                className={`flex-1 relative z-10 font-bold text-lg transition-colors duration-200 ${isYearly ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                שנתי
                            </button>

                            {/* Monthly Button (Right in LTR) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsYearly(false); }}
                                className={`flex-1 relative z-10 font-bold text-lg transition-colors duration-200 ${!isYearly ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                חודשי
                            </button>
                        </div>

                        {/* Slogans for both modes */}
                        <div className="h-8 mt-4 overflow-hidden relative w-full">
                            <motion.div
                                initial={false}
                                animate={{ y: isYearly ? -32 : 0 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                                className="flex flex-col items-center"
                            >
                                <div className="h-8 flex items-center justify-center text-gray-500 font-medium">
                                    מסלול גמיש ללא התחייבות
                                </div>
                                <div className="h-8 flex items-center justify-center text-green-800 font-bold" dir="rtl">
                                    יעילות גבוהה יותר, עלות נמוכה יותר - חוסכים בענק!
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                    {/* PRO (Green) - Right Visually */}
                    <StaggerItem direction="right" distance="sideSlide">
                        <HoverCard liftDistance={8} scale={1.02} className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl p-8 flex flex-col items-center text-center relative border-2 border-[#22C55E] h-full transition-all duration-300">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22C55E] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                                התחלה קלה
                            </div>

                            <h3 className="text-2xl font-bold text-[#22C55E] mb-2 flex items-center gap-2 mt-4">
                                PRO <span className="w-5 h-5 bg-[#22C55E] rounded-sm inline-block" />
                            </h3>
                            <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                                <span className="text-3xl font-bold mt-2">₪</span>
                                <span className="text-6xl font-bold">
                                    {prefersReducedMotion ? prices.pro : <CountUp end={prices.pro} duration={0.4} preserveValue={true} />}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mb-6 font-medium">לחודש (לא כולל מע"מ)</p>

                            <p className="text-[#1E293B] font-bold mb-8 px-4 min-h-[48px] flex items-center justify-center">
                                למי זה מתאים: עסקים בתחילת הדרך שרוצים להתחיל לעבוד מסודר
                            </p>

                            <div className="w-full h-px bg-gray-100 mb-8" />

                            <ul className="space-y-4 mb-8 flex-grow w-full text-right px-4">
                                {FEATURES.pro.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="mt-1 text-green-500 font-bold">✓</span>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={isYearly ? LINKS.pro.year : LINKS.pro.month}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center rounded-lg font-bold text-white bg-[#22C55E] hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 text-lg hover:scale-[1.01]"
                            >
                                {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                            </a>
                        </HoverCard>
                    </StaggerItem>

                    {/* SMART (Yellow) - Center Visually with Parallax Floating Elevation */}
                    <StaggerItem direction="none">
                        <ParallaxLayer speed={25} className="h-full">
                            <HoverCard breathing={true} liftDistance={10} scale={1.03} className="bg-white rounded-[2rem] shadow-2xl p-8 flex flex-col items-center text-center relative md:-translate-y-4 border-4 border-[#F59E0B] z-10 h-full transition-all duration-300">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-1.5 rounded-full text-base font-black shadow-lg uppercase tracking-wide whitespace-nowrap animate-subtle-glow">
                                    המסלול הנבחר ⭐
                                </div>

                                <h3 className="text-2xl font-bold text-[#F59E0B] mb-2 flex items-center gap-2 mt-4">
                                    SMART <span className="w-5 h-5 bg-[#F59E0B] rounded-sm inline-block" />
                                </h3>
                                <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                                    <span className="text-3xl font-bold mt-2">₪</span>
                                    <span className="text-6xl font-bold">
                                        {prefersReducedMotion ? prices.smart : <CountUp end={prices.smart} duration={0.4} preserveValue={true} />}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-6 font-medium">לחודש (לא כולל מע"מ)</p>

                                <p className="text-[#1E293B] font-bold mb-8 px-4 min-h-[48px] flex items-center justify-center">
                                    למי זה מתאים: עסקים בצמיחה שרוצים אוטומציות חכמות וחיסכון אמיתי בזמן
                                </p>

                                <div className="w-full h-px bg-gray-100 mb-8" />

                                <ul className="space-y-4 mb-8 flex-grow w-full text-right px-4">
                                    {FEATURES.smart.map((feat, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm ${i === 0 ? 'font-bold text-[#1E293B]' : 'text-gray-600'}`}>
                                            <span className="mt-1 text-yellow-500 font-bold">✓</span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={isYearly ? LINKS.smart.year : LINKS.smart.month}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 text-center rounded-lg font-bold text-black bg-[#F59E0B] hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/20 text-lg hover:scale-[1.01]"
                                >
                                    {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                                </a>
                            </HoverCard>
                        </ParallaxLayer>
                    </StaggerItem>

                    {/* POWER (Blue) - Left Visually */}
                    <StaggerItem direction="left" distance="sideSlide">
                        <HoverCard liftDistance={8} scale={1.02} className="bg-white rounded-[2rem] shadow-xl hover:shadow-2xl p-8 flex flex-col items-center text-center relative border-2 border-[#0F6CBD] h-full transition-all duration-300">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0F6CBD] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                                הכל כלול
                            </div>

                            <h3 className="text-2xl font-bold text-[#0F6CBD] mb-2 flex items-center gap-2 mt-4">
                                POWER <span className="w-5 h-5 bg-[#0F6CBD] rounded-sm inline-block" />
                            </h3>
                            <div className="flex items-start justify-center gap-1 mb-2 text-[#0F6CBD]">
                                <span className="text-3xl font-bold mt-2">₪</span>
                                <span className="text-6xl font-bold">
                                    {prefersReducedMotion ? prices.power : <CountUp end={prices.power} duration={0.4} preserveValue={true} />}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mb-6 font-medium">לחודש (לא כולל מע"מ)</p>

                            <p className="text-[#1E293B] font-bold mb-8 px-4 min-h-[48px] flex items-center justify-center">
                                למי זה מתאים: עסקים מתקדמים שרוצים את המעטפת המלאה ביותר
                            </p>

                            <div className="w-full h-px bg-gray-100 mb-8" />

                            <ul className="space-y-4 mb-8 flex-grow w-full text-right px-4">
                                {FEATURES.power.map((feat, i) => (
                                    <li key={i} className={`flex items-start gap-3 text-sm ${i === 0 ? 'font-bold text-[#1E293B]' : 'text-gray-600'}`}>
                                        <span className="mt-1 text-blue-500 font-bold">✓</span>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={isYearly ? LINKS.power.year : LINKS.power.month}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 text-center rounded-lg font-bold text-white bg-[#0F6CBD] hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/20 text-lg hover:scale-[1.01]"
                            >
                                {isYearly ? '💎 מתחילים שנתי' : '✨ מתחילים חודשי'}
                            </a>
                        </HoverCard>
                    </StaggerItem>
                </StaggerGroup>

                <p className="text-center text-xs sm:text-sm text-slate-500 mt-10 font-medium">
                    * כל המחירים נקובים בש"ח ואינם כוללים מע"מ כחוק.
                </p>
            </div>
        </section>
    );
};
