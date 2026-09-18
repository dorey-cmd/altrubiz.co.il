import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { MOTION_EASINGS } from '../lib/motionTokens';
import { getHowItWorksStepKnowledge } from '../data/knowledgeGraph';

interface StepItemDef {
    num: string;
    title: string;
    desc: string;
    pain: string;
    img: string;
}

const STEP_DEFINITIONS: StepItemDef[] = [
    {
        num: "1",
        title: "לכידה",
        desc: "דפי נחיתה, טפסים, לוחות שנה, סקרים, טלפוניה.",
        pain: "כשאין איסוף מסודר עשרות לידים נעלמים ומתמוססים בלי ששמים לב",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db6346f45dc55634f4.png"
    },
    {
        num: "2",
        title: "טיפוח",
        desc: "מסרים אוטומטיים מותאמים אישית בוואטסאפ, SMS, מייל, רשתות חברתיות ושיחות קוליות.",
        pain: "חוסר עקביות במעקב גורם להפסדים ישירים של לקוחות פוטנציאליים",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db3b96f70dc1c2b0c5.png"
    },
    {
        num: "3",
        title: "סגירה",
        desc: "קביעת פגישות, הצעות מחיר, תיעוד מלא.",
        pain: "פגישות שמתפספסות והצעות שלא נענות שוות כסף אבוד בעסק",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697dbf0447344096548de.png"
    },
    {
        num: "4",
        title: "שימור",
        desc: "אוטומציות שירות ותמיכה, מעקב לקוחות, נאמנות.",
        pain: "לקוחות שנשכחים אחרי העסקה מובילים להפסד מכירות המשך",
        img: "https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/689697db10ecc40bcf69ee3e.png"
    }
];

interface HowItWorksProps {
    onNavigate?: (path: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    const steps = STEP_DEFINITIONS.map(step => {
        const knowledge = getHowItWorksStepKnowledge(step.num);
        return {
            ...step,
            hubUrl: knowledge.url,
            hubLabel: knowledge.label
        };
    });

    return (
        <section id="how-it-works" className="py-24 bg-slate-50 text-right relative overflow-hidden" dir="rtl">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        איך זה עובד בפועל?
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
                        ארבעה שלבים פשוטים שמחברים את הפעילות העסקית למסלול עבודה עקבי.
                    </p>
                </div>

                <div className="space-y-24">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.45, ease: MOTION_EASINGS.enter }}
                            className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Image with subtle hover depth */}
                            <div className="w-full md:w-5/12 max-w-md mx-auto">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none" />
                                    <img
                                        src={step.img}
                                        alt={`שלב ${step.num}: ${step.title} - ${step.desc} במערכת AltruBiz CRM`}
                                        className="relative w-full h-auto rounded-2xl shadow-xl hover:scale-[1.015] transition-transform duration-300 bg-white"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="flex items-center gap-4">
                                    <motion.span
                                        whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
                                        className="flex items-center justify-center w-12 h-12 bg-primary text-white text-xl font-bold rounded-full shadow-lg border-4 border-white ring-2 ring-primary/20"
                                    >
                                        {step.num}
                                    </motion.span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {step.title}
                                    </h3>
                                </div>

                                <p className="text-xl text-gray-600 leading-relaxed pr-16 md:pr-0">
                                    {step.desc}
                                </p>

                                <div className="relative overflow-hidden p-0.5 rounded-xl mr-4 md:mr-0 group hover:shadow-md transition-all duration-300">
                                    {/* Gradient Border */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-primary/40 to-accent/40 opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                                    {/* Content Container */}
                                    <div className="relative bg-white/95 backdrop-blur-sm p-4 rounded-[10px] h-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Icon Box */}
                                            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-50 text-amber-500 rounded-lg shadow-inner shrink-0 ring-1 ring-amber-200/50">
                                                <Lightbulb size={20} strokeWidth={2.5} className="drop-shadow-sm" />
                                            </div>

                                            <p className="text-slate-700 font-medium text-base/relaxed pt-0.5">
                                                {step.pain}
                                            </p>
                                        </div>

                                        <a
                                            href={step.hubUrl}
                                            onClick={(e) => {
                                                if (onNavigate) {
                                                    e.preventDefault();
                                                    onNavigate(step.hubUrl);
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full transition-all group/link shrink-0 cursor-pointer self-end sm:self-center"
                                        >
                                            <span>{step.hubLabel}</span>
                                            <span className="group-hover/link:-translate-x-0.5 transition-transform font-bold">←</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
