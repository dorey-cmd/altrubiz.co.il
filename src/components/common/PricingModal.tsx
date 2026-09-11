import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, MessageCircle, Calendar, ShieldCheck, Zap } from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenContactModal?: () => void;
    onOpenBookingModal?: () => void;
}

const PRICES = {
    yearly: { pro: 297, smart: 497, power: 747 },
    monthly: { pro: 349, smart: 597, power: 897 }
};

const CHECKOUT_LINKS = {
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

export const PricingModal: React.FC<PricingModalProps> = ({
    isOpen,
    onClose,
    onOpenContactModal,
    onOpenBookingModal
}) => {
    const [isYearly, setIsYearly] = useState(true);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const currentPrices = isYearly ? PRICES.yearly : PRICES.monthly;
    const currentPeriod = isYearly ? 'year' : 'month';

    const tiers = [
        {
            key: 'pro',
            name: 'Pro',
            hebrewTitle: 'תשתית CRM מקצועית',
            badge: 'התחלה חלקה',
            popular: false,
            price: currentPrices.pro,
            description: 'אידיאלי לעסקים שרוצים לעשות סדר מלא בלידים, ביומן ובמעקב לקוחות.',
            features: [
                'משתמשים ורשומות ללא הגבלה',
                'CRM עם יומן פגישות ופייפליין מכירות חזותי',
                'טפסים ודפי נחיתה מובנים',
                'ניהול משימות ודשבורד בקרה',
                'שעת Onboarding אישית בזום'
            ],
            checkoutUrl: CHECKOUT_LINKS.pro[currentPeriod]
        },
        {
            key: 'smart',
            name: 'Smart',
            hebrewTitle: 'צמיחה ואוטומציות שיווק',
            badge: 'הפופולרי ביותר ⭐',
            popular: true,
            price: currentPrices.smart,
            description: 'החבילה המובילה לחיבור וואטסאפ, מענה אוטומטי ללידים וסגירת עסקאות מהירה.',
            features: [
                'כל מה שכלול בחבילת Pro',
                'אינטגרציית WhatsApp עם טריגרים אוטומטיים',
                'מענה אוטומטי ללידים מפייסבוק, אינסטגרם ואתר',
                'מערך Funnels וניהול רשימות תפוצה',
                'מרכז תקשורת רב-ערוצי (Omnichannel)',
                '3 שעות הטמעה ו-Onboarding בזום'
            ],
            checkoutUrl: CHECKOUT_LINKS.smart[currentPeriod]
        },
        {
            key: 'power',
            name: 'Power',
            hebrewTitle: 'עוצמת AI ובוטים מתקדמים',
            badge: 'אוטומציה מלאה',
            popular: false,
            price: currentPrices.power,
            description: 'לעסקים מתקדמים שרוצים בוטים חכמים ב-AI, אוטומציות מורכבות וחיבורי API.',
            features: [
                'כל מה שכלול בחבילת Smart',
                'בוטי AI חכמים למענה וקביעת פגישות ביומן',
                'בניית אתרים ודפי נחיתה ב-AI',
                'אינטגרציות API, וובהוקים ואוטומציות מתקדמות',
                'חיבור דומיין ייחודי ומחולל דוחות מתקדם',
                'ליווי והטמעה מקיפה (3 שעות חודשיות)'
            ],
            checkoutUrl: CHECKOUT_LINKS.power[currentPeriod]
        }
    ];

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-modal-title"
        >
            {/* Dark Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog Box */}
            <div className="relative z-10 w-full max-w-5xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in zoom-in-95 duration-200">
                {/* Accent Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-indigo-500 to-amber-400 w-full" />

                {/* Header */}
                <div className="p-5 sm:p-7 pb-5 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/60 relative">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-indigo-300 border border-primary/30 text-xs font-bold">
                            <Sparkles size={14} className="text-amber-400" />
                            <span>שקיפות מלאה – חבילות AltruBiz CRM</span>
                        </div>
                        <h2 
                            id="pricing-modal-title"
                            className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug"
                        >
                            בחירת החבילה המתאימה לעסק שלכם
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            ללא עלויות נסתרות, ללא הגבלת משתמשים או רשומות, ועם ליווי והדרכה אישית כדי לוודא שאתם רואים ערך מיידי.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0"
                        aria-label="סגירת חלונית תמחור"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
                    {/* Period Toggle */}
                    <div className="flex items-center justify-center gap-3">
                        <span className={`text-xs sm:text-sm font-semibold ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
                            תשלום חודשי
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-8 bg-slate-800 rounded-full p-1 border border-slate-700 relative transition-colors focus:outline-none"
                            aria-label="החלפת תקופת תשלום"
                        >
                            <div 
                                className={`w-6 h-6 bg-gradient-to-r from-primary to-indigo-500 rounded-full shadow-md transition-transform duration-200 ${
                                    isYearly ? 'translate-x-0' : '-translate-x-6'
                                }`}
                            />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <span className={`text-xs sm:text-sm font-semibold ${isYearly ? 'text-white font-bold' : 'text-slate-400'}`}>
                                תשלום שנתי
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black px-2 py-0.5 rounded-full">
                                חיסכון של עד 1800 ₪
                            </span>
                        </div>
                    </div>

                    {/* Tier Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {tiers.map((tier) => (
                            <div 
                                key={tier.key}
                                className={`relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all ${
                                    tier.popular 
                                        ? 'bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                                        : 'bg-slate-950/50 border border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white text-[11px] font-black shadow-md">
                                        {tier.badge}
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-black text-white">{tier.name}</h3>
                                        <span className="text-xs text-slate-400 font-medium">{tier.hebrewTitle}</span>
                                    </div>

                                    <p className="text-xs text-slate-300 mb-5 leading-relaxed min-h-[36px]">
                                        {tier.description}
                                    </p>

                                    {/* Price Box */}
                                    <div className="bg-slate-900/90 rounded-2xl p-3.5 mb-5 border border-slate-800 text-center">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-3xl sm:text-4xl font-black text-white">₪{tier.price}</span>
                                            <span className="text-xs text-slate-400">/ לחודש</span>
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-1 font-medium">
                                            {isYearly ? 'בחיוב שנתי מראש (כולל מע"מ כחוק)' : 'בחיוב חודשי מתחדש ללא התחייבות'}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-2.5 mb-6 text-xs sm:text-sm">
                                        {tier.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2 text-slate-200">
                                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                    <a
                                        href={tier.checkoutUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                                            tier.popular
                                                ? 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-lg shadow-primary/25'
                                                : 'bg-white hover:bg-slate-100 text-slate-950 shadow-md'
                                        }`}
                                    >
                                        <Zap size={16} className={tier.popular ? 'fill-white' : 'fill-slate-950'} />
                                        <span>הצטרפות מהירה לחבילה</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Consultative Row */}
                    <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-right">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">מתלבטים איזו חבילה הכי מתאימה לפעילות שלכם?</h4>
                                <p className="text-xs text-slate-400">נציגי AltruBiz ישמחו להכיר את הפעילות ולהתאים את המענה המדויק.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {(onOpenBookingModal || onOpenContactModal) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        if (onOpenBookingModal) {
                                            onOpenBookingModal();
                                        } else if (onOpenContactModal) {
                                            onOpenContactModal();
                                        }
                                    }}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/20 transition-colors"
                                >
                                    <Calendar size={14} />
                                    <span>קביעת שיחת התאמה</span>
                                </button>
                            )}

                            <a
                                href={`https://wa.me/972544350000?text=${encodeURIComponent('שלום צוות AltruBiz, ראיתי את חבילות המחירים באתר ואשמח להתייעץ על החבילה המתאימה ביותר לעסק שלנו.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 text-xs font-extrabold shadow-sm transition-all"
                            >
                                <MessageCircle size={14} />
                                <span>התייעצות בוואטסאפ</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
