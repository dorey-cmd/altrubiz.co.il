import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { MOTION_EASINGS } from '../lib/motionTokens';
import { ParallaxLayer } from './motion';
import { getHowItWorksStepKnowledge } from '../data/knowledgeGraph';
import { handleClientNavClick } from './common/InternalLink';

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
                    {steps.map((step, idx) => {
                        const isEven = idx % 2 === 0;
                        // RTL Outside-in Entrance: Right side slides from right (+x), Left side slides from left (-x)
                        const imgSlide = isEven ? 75 : -75;
                        const textSlide = isEven ? -75 : 75;
                        const parallaxSpeed = isEven ? 50 : -45;

                        return (
                            <div
                                key={idx}
                                className={`flex flex-col md:flex-row items-center gap-12 ${!isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Image with True Scroll Parallax, Lateral Entrance & Ambient Breathing */}
                                <motion.div
                                    initial={prefersReducedMotion ? false : { opacity: 0, x: imgSlide }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.55, ease: MOTION_EASINGS.enter }}
                                    className="w-full md:w-5/12 max-w-md mx-auto"
                                >
                                    <ParallaxLayer speed={parallaxSpeed}>
                                        <div className="relative group animate-ambient-breath">
                                            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500 pointer-events-none" />
                                            <img
                                                src={step.img}
                                                alt={`שלב ${step.num}: ${step.title} - ${step.desc} במערכת AltruBiz CRM`}
                                                className="relative w-full h-auto rounded-2xl shadow-xl group-hover:scale-[1.03] group-hover:-translate-y-1.5 transition-all duration-300 bg-white"
                                                loading="lazy"
                                            />
                                        </div>
                                    </ParallaxLayer>
                                </motion.div>

                                {/* Content with Opposing Lateral Slide-in */}
                                <motion.div
                                    initial={prefersReducedMotion ? false : { opacity: 0, x: textSlide }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.55, ease: MOTION_EASINGS.enter }}
                                    className="w-full md:w-1/2 space-y-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.span
                                            whileHover={prefersReducedMotion ? {} : { scale: 1.12, rotate: 5 }}
                                            className="flex items-center justify-center w-12 h-12 bg-primary text-white text-xl font-bold rounded-full shadow-lg border-4 border-white ring-2 ring-primary/20 cursor-default"
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

                                    <div className="relative overflow-hidden p-0.5 rounded-xl mr-4 md:mr-0 group hover:shadow-lg transition-all duration-300">
                                        {/* Gradient Border */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-primary/40 to-accent/40 opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                                        {/* Content Container with Subtle Hover Reaction */}
                                        <div className="relative bg-white/95 backdrop-blur-sm p-4 rounded-[10px] h-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group-hover:-translate-y-0.5 transition-transform duration-200">
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
                                                onClick={(e) => handleClientNavClick(e, step.hubUrl, onNavigate)}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-blue-700 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full transition-all group/link shrink-0 cursor-pointer self-end sm:self-center hover:scale-105"
                                            >
                                                <span>{step.hubLabel}</span>
                                                <span className="group-hover/link:-translate-x-0.5 transition-transform font-bold">←</span>
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
        </div>
    </section>
);
};
