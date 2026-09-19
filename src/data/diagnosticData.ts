/**
 * AltruBiz Diagnostic Engine & Data Definitions
 * 
 * Sourced directly into altrubiz.co.il so the diagnostic questionnaire
 * and the Article Template result page are fully native, non-indexed,
 * zero-friction, and instantly deployed on push.
 */

export type PainId = 1 | 2 | 3 | 4 | 5;
export type Answer = 'yes' | 'no';
export type Weight = 1 | 2 | 3;

export interface PainWeight {
    pain: PainId;
    weight: Weight;
    example?: string;
}

export interface Question {
    id: string;
    text: string;
    painfulAnswer: Answer;
    pains: PainWeight[];
    example: string;
}

export const QUESTIONS: readonly Question[] = [
    {
        id: 'q1',
        text: 'אם ליד חדש נכנס דווקא בזמן עומס - יש סיכוי שיחכה יותר מדי לפני שמישהו יחזור אליו?',
        painfulAnswer: 'yes',
        pains: [
            { pain: 1, weight: 2 },
            {
                pain: 5,
                weight: 1,
                example: 'כבר היום, בזמן עומס, ליד חדש עלול לחכות יותר מדי - ועם עוד פניות זה רק יחמיר.',
            },
        ],
        example: 'ליד חדש שנכנס בזמן עומס עלול לחכות יותר מדי לפני שחוזרים אליו.',
    },
    {
        id: 'q2',
        text: 'אם לקוח מתקשר עכשיו ושואל "איפה הדברים עומדים?" - כל מה שצריך לדעת עליו נמצא במקום אחד וברור מיד?',
        painfulAnswer: 'no',
        pains: [{ pain: 3, weight: 2 }],
        example: 'כשלקוח מתקשר ושואל איפה הדברים עומדים, כל מה שצריך לדעת עליו לא נמצא במקום אחד וברור מיד.',
    },
    {
        id: 'q3',
        text: 'האם יש פעולה שנעשית שוב ושוב בעסק, למרות שבכל פעם היא מתבצעת כמעט בדיוק אותו הדבר?',
        painfulAnswer: 'yes',
        pains: [{ pain: 4, weight: 2 }],
        example: 'יש בעסק פעולה שחוזרת שוב ושוב, ובכל פעם היא מתבצעת כמעט בדיוק אותו הדבר.',
    },
    {
        id: 'q4',
        text: 'אם נבקש עכשיו לדעת כמה לידים נכנסו השבוע, כמה עדיין בטיפול וכמה הפכו ללקוחות - אפשר לתת תשובה מדויקת בלי להתחיל לאסוף נתונים?',
        painfulAnswer: 'no',
        pains: [{ pain: 3, weight: 2 }],
        example: 'אי אפשר לדעת במדויק כמה לידים נכנסו השבוע, כמה בטיפול וכמה הפכו ללקוחות בלי להתחיל לאסוף נתונים.',
    },
    {
        id: 'q5',
        text: 'האם יש עסקאות שנעלמו בדרך ועדיין לא באמת ברור אם הן אבדו בגלל מחיר, תזמון, חוסר מעקב - או שפשוט הפסיקו לדבר?',
        painfulAnswer: 'yes',
        pains: [{ pain: 1, weight: 3 }],
        example: 'יש עסקאות שנעלמו בדרך, ולא ברור אם זה קרה בגלל מחיר, תזמון, חוסר מעקב או שפשוט הפסיקו לדבר.',
    },
    {
        id: 'q6',
        text: 'כשלקוח אומר "דברו איתי בעוד שבועיים" - יש מנגנון שיוודא שזה באמת יקרה גם אם אף אחד לא יזכור?',
        painfulAnswer: 'no',
        pains: [
            { pain: 1, weight: 3 },
            {
                pain: 3,
                weight: 1,
                example: 'ההבטחה לחזור ללקוח בעוד שבועיים נשארת תלויה בזיכרון ולא בתוך העסק.',
            },
        ],
        example: 'כשלקוח מבקש שיחזרו אליו בעוד שבועיים, אין מנגנון שיוודא שזה יקרה אם אף אחד לא יזכור.',
    },
    {
        id: 'q7',
        text: 'אם במשך שלושה ימים אין זמינות בכלל - האם לידים יחכו, עסקאות ייתקעו או כסף יישאר על השולחן רק בגלל זה?',
        painfulAnswer: 'yes',
        pains: [
            { pain: 2, weight: 3 },
            { pain: 1, weight: 1 },
        ],
        example: 'כשאין זמינות במשך כמה ימים, לידים מחכים, עסקאות נתקעות וכסף נשאר על השולחן.',
    },
    {
        id: 'q8',
        text: 'אם נבקש עכשיו לראות את כל מי שהתעניין בעסק בחודש האחרון ועדיין לא קנה - אפשר להוציא את הרשימה מיד?',
        painfulAnswer: 'no',
        pains: [
            {
                pain: 1,
                weight: 2,
                example: 'אין רשימה זמינה מיד של כל מי שהתעניינו בחודש האחרון ועדיין לא קנו, ולכן קל לפספס אותם.',
            },
            { pain: 3, weight: 2 },
        ],
        example: 'אי אפשר להוציא מיד רשימה של כל מי שהתעניינו בעסק בחודש האחרון ועדיין לא קנו.',
    },
    {
        id: 'q9',
        text: 'אם מישהו שוכח מעקב, תזכורת או פעולה חשובה - האם הטעות הזאת יכולה לעלות בכסף או להפוך אחר כך לבלגן שצריך לכבות?',
        painfulAnswer: 'yes',
        pains: [
            { pain: 1, weight: 2 },
            {
                pain: 4,
                weight: 1,
                example: 'שכחת מעקב, תזכורת או פעולה חשובה הופכת לעוד בלגן שצריך לכבות.',
            },
        ],
        example: 'כשנשכח מעקב, תזכורת או פעולה חשובה, זה עלול לעלות בכסף או להפוך לבלגן שצריך לכבות.',
    },
    {
        id: 'q10',
        text: 'האם ה-AI בעסק קצת דומה לעובד מוכשר שכבר גויס - אבל רוב היום יושב ומחכה שמישהו ייזכר לתת לו עבודה?',
        painfulAnswer: 'yes',
        pains: [{ pain: 4, weight: 2 }],
        example: 'ה-AI בעסק דומה לעובד מוכשר שכבר גויס, אבל רוב היום ממתין שייזכרו לתת לו עבודה.',
    },
    {
        id: 'q11',
        text: 'יש בעסק לפחות תהליך אחד שבו AI עובד כחלק קבוע מהעבודה, בלי שמישהו יצטרך לפתוח אותו ולבקש ממנו להתחיל לעבוד?',
        painfulAnswer: 'no',
        pains: [{ pain: 4, weight: 2 }],
        example: 'אין בעסק אף תהליך שבו AI עובד כחלק קבוע מהעבודה, בלי לפתוח אותו ולבקש ממנו להתחיל.',
    },
    {
        id: 'q12',
        text: 'אם מחר ייכנסו פי שניים לידים - יש ביטחון שהם יקבלו את אותה מהירות ואותה רמת טיפול כמו היום?',
        painfulAnswer: 'no',
        pains: [
            { pain: 5, weight: 3 },
            {
                pain: 1,
                weight: 1,
                example: 'אין ביטחון שאם ייכנסו פי שניים לידים, כל ליד עדיין יקבל טיפול בזמן.',
            },
        ],
        example: 'אין ביטחון שאם מחר ייכנסו פי שניים לידים, הם יקבלו את אותה מהירות ואותה רמת טיפול כמו היום.',
    },
    {
        id: 'q13',
        text: 'האם יש דברים שחוזרים שוב ושוב אליך לא מפני שרק אצלך אפשר לעשות אותם - אלא מפני שככה העסק התרגל לעבוד?',
        painfulAnswer: 'yes',
        pains: [
            { pain: 2, weight: 3 },
            {
                pain: 3,
                weight: 1,
                example: 'העסק התרגל לעבוד כך שדברים חוזרים אל אדם אחד, במקום להיות מובנים בתוך תהליך.',
            },
        ],
        example: 'יש דברים שחוזרים שוב ושוב אל הנהלת העסק, לא מפני שרק שם אפשר לעשות אותם אלא מפני שככה העסק התרגל לעבוד.',
    },
    {
        id: 'q14',
        text: 'כשאין זמינות - מי שמטפל בליד או בעסקה יכול לראות מה קרה עד עכשיו ולהמשיך לקדם אותה בלי לחכות?',
        painfulAnswer: 'no',
        pains: [
            { pain: 2, weight: 2 },
            {
                pain: 3,
                weight: 2,
                example: 'מה שקרה עד עכשיו בליד או בעסקה לא זמין להמשך הטיפול בהם.',
            },
        ],
        example: 'כשאין זמינות, אי אפשר לראות מה קרה עד עכשיו בליד או בעסקה ולהמשיך לקדם אותם בלי לחכות.',
    },
    {
        id: 'q15',
        text: 'אם המכירות יוכפלו בחודש הבא - האם גם כמות העבודה הידנית, המעקב ו"כיבוי השריפות" כמעט תוכפל יחד איתן?',
        painfulAnswer: 'yes',
        pains: [
            { pain: 5, weight: 3 },
            {
                pain: 4,
                weight: 1,
                example: 'עם יותר מכירות, גם העבודה הידנית והמעקב כמעט יוכפלו.',
            },
        ],
        example: 'אם המכירות יוכפלו, גם כמות העבודה הידנית, המעקב וכיבוי השריפות כמעט תוכפל יחד איתן.',
    },
    {
        id: 'q16',
        text: 'אם אדם מרכזי בצוות לא מגיע מחר לעבודה - התהליכים שבאחריותו ממשיכים לעבוד בלי שמישהו יצטרך לשחזר מה היה אמור לקרות?',
        painfulAnswer: 'no',
        pains: [
            { pain: 3, weight: 3 },
            {
                pain: 2,
                weight: 2,
                example: 'כשאדם מרכזי בצוות חסר ליום אחד, התהליכים שבאחריותו לא ממשיכים בלעדיו.',
            },
        ],
        example: 'כשאדם מרכזי בצוות לא מגיע לעבודה, התהליכים שבאחריותו לא ממשיכים לעבוד בלי לשחזר מה היה אמור לקרות.',
    },
    {
        id: 'q17',
        text: 'האם עדיין מעתיקים בעסק מידע ממקום למקום, מעדכנים סטטוסים ביד, שולחים שוב את אותן הודעות או עושים פעולות שמחשב יכול לבצע לבד?',
        painfulAnswer: 'yes',
        pains: [{ pain: 4, weight: 3 }],
        example: 'עדיין מעתיקים מידע ממקום למקום, מעדכנים סטטוסים ביד, שולחים שוב את אותן הודעות או עושים פעולות שמחשב יכול לבצע לבד.',
    },
    {
        id: 'q18',
        text: 'כשנכנס לקוח חדש - יש תהליך ברור שמוביל אותו קדימה בלי שמישהו יצטרך לזכור בכל שלב מה הדבר הבא שצריך לקרות?',
        painfulAnswer: 'no',
        pains: [
            { pain: 3, weight: 3 },
            {
                pain: 5,
                weight: 1,
                example: 'עם כל לקוח חדש צריך לזכור מה הצעד הבא, וזה הופך לעומס כשהלקוחות רבים.',
            },
            {
                pain: 2,
                weight: 1,
                example: 'בכל שלב אצל לקוח חדש צריך לזכור מה הצעד הבא - ובלי זה דברים מאטים.',
            },
        ],
        example: 'כשנכנס לקוח חדש, אין תהליך ברור שמוביל אותו קדימה בלי שיהיה צורך לזכור בכל שלב מה הדבר הבא.',
    },
];

export const OPEN_QUESTION = {
    text: 'אם ב-90 הימים הקרובים היה אפשר להפסיק דבר אחד שמבזבז זמן, עולה כסף או ממשיך להסתובב בראש גם אחרי שסוגרים את המחשב - מה היה הדבר הזה?',
    hint: 'לא צריך לנסח יפה. מספיק לכתוב את הדבר שהכי רוצים שיפסיק להטריד.',
    maxLength: 600,
} as const;

export const QUESTION_COUNT = QUESTIONS.length;

export interface PainDef {
    id: PainId;
    theme: string;
    title: string;
    lead: string;
    body: string[];
    threshold: number;
}

export const PAINS: readonly PainDef[] = [
    {
        id: 1,
        theme: 'מעקב אחרי פניות והצעות',
        title: 'העבודה מגיעה, אבל חלק מהכסף פשוט נופל בדרך.',
        lead: 'כל פנייה שלא חזרו אליה בזמן היא כסף שכבר הושקע ועדיין לא הגיע לקופה.',
        body: [
            'יש פניות. יש התעניינות. לפעמים אפילו יש שיחות טובות והצעות שנשלחו.',
            'אבל לא תמיד חוזרים בזמן, לא תמיד ממשיכים לעקוב, ולא תמיד ברור איפה בדיוק העסקה נעלמה.',
            'חלק מהכסף שכבר הושקע כדי להביא לעסק פשוט לא מגיע לקופה.',
        ],
        threshold: 4,
    },
    {
        id: 2,
        theme: 'תלות בנוכחות ובזיכרון',
        title: 'כשלא נמצאים על זה - דברים פשוט לא קורים.',
        lead: 'העסק זז רק כל עוד יש מי שמזכיר, בודק ודוחף.',
        body: [
            'צריך להזכיר, לבדוק, לשאול, לדחוף ולוודא.',
            'וברגע שהראש נמצא במקום אחר, דברים מתחילים להאט.',
            'העסק עדיין נשען יותר מדי על הזיכרון, הזמינות והמעורבות האישית.',
        ],
        threshold: 3,
    },
    {
        id: 3,
        theme: 'ידע שיושב בראש של אנשים',
        title: 'יותר מדי דברים פה עובדים לפי מה שיש לאנשים בראש.',
        lead: 'כשהתהליך לא כתוב ולא מסודר, כל מעבר בין אנשים הוא הזדמנות לפספוס.',
        body: [
            'כל אחד מכיר חלק אחר מהדרך, ולפעמים דברים נעשים אחרת לפי מי שמטפל בהם.',
            'התהליך לא באמת יושב בתוך העסק.\nהוא יושב בתוך הראש של האנשים שעובדים בו.',
        ],
        threshold: 4,
    },
    {
        id: 4,
        theme: 'עבודה שחוזרת על עצמה',
        title: 'עובדים קשה מדי על דברים שלא אמורים לקחת כל כך הרבה זמן.',
        lead: 'פעולות קטנות וחוזרות אוכלות שעות עבודה שאפשר להעביר למערכת.',
        body: [
            'עוד הודעה.\nעוד תזכורת.\nעוד עדכון.\nעוד העתקה.\nעוד פעולה שחוזרת שוב מחר.',
            'זמן עבודה יקר ממשיך להישרף על דברים שמחשב, אוטומציה או AI יכולים לבצע.',
        ],
        threshold: 4,
    },
    {
        id: 5,
        theme: 'צמיחה והעומס שמגיע איתה',
        title: 'רוצים עוד לקוחות - אבל לא בטוח שרוצים את כל הבלגן שיבוא איתם.',
        lead: 'כשכל לקוח חדש מוסיף עוד עבודה ידנית, הצמיחה הופכת לעומס.',
        body: [
            'עוד מכירות אמורות להיות חדשות טובות.',
            'אבל אם כל לקוח חדש מביא איתו עוד טלפונים, עוד מעקבים, עוד משימות ועוד דברים שעלולים ליפול בין הכיסאות - הצמיחה מתחילה להרגיש גם כמו איום.',
        ],
        threshold: 3,
    },
];

export const MAX_PAINS_SHOWN = 3;
export const MAX_EXAMPLES_PER_PAIN = 3;

export type Answers = Readonly<Record<string, Answer | undefined>>;

export interface Evidence {
    questionId: string;
    questionText: string;
    weight: number;
    example: string;
}

export interface ScoreResult {
    scores: Record<PainId, number>;
    activePains: PainId[];
    allActivePains: PainId[];
    evidence: Record<PainId, Evidence[]>;
}

export function isPainful(question: Question, answer: Answer | undefined): boolean {
    return answer !== undefined && answer === question.painfulAnswer;
}

export function scoreAnswers(answers: Answers): ScoreResult {
    const scores: Record<PainId, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const evidence: Record<PainId, Evidence[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    QUESTIONS.forEach((question) => {
        if (!isPainful(question, answers[question.id])) return;
        question.pains.forEach(({ pain, weight, example }) => {
            scores[pain] += weight;
            evidence[pain].push({
                questionId: question.id,
                questionText: question.text,
                weight,
                example: example ?? question.example,
            });
        });
    });

    (Object.keys(evidence) as unknown as PainId[]).forEach((pain) => {
        evidence[pain] = evidence[pain]
            .map((entry, index) => ({ entry, index }))
            .sort((a, b) => b.entry.weight - a.entry.weight || a.index - b.index)
            .map(({ entry }) => entry);
    });

    const allActivePains = [...PAINS]
        .sort((a, b) => a.id - b.id)
        .filter((pain) => scores[pain.id] >= pain.threshold)
        .map((pain) => pain.id);

    return {
        scores,
        allActivePains,
        activePains: allActivePains.slice(0, MAX_PAINS_SHOWN),
        evidence,
    };
}

export function examplesFor(result: ScoreResult, pain: PainId): string[] {
    return result.evidence[pain].slice(0, MAX_EXAMPLES_PER_PAIN).map((e) => e.example);
}

export const DIAGNOSTIC_STORAGE_KEY = 'altru_diagnostic_state_v1';

export interface StoredDiagnosticState {
    answers: Record<string, Answer>;
    openAnswer: string;
    completedAt: string;
}

export function saveDiagnosticState(answers: Record<string, Answer>, openAnswer: string): void {
    try {
        const payload: StoredDiagnosticState = {
            answers,
            openAnswer,
            completedAt: new Date().toISOString()
        };
        sessionStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // storage disabled fallback
    }
}

export function loadDiagnosticState(): StoredDiagnosticState | null {
    try {
        const raw = sessionStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredDiagnosticState;
    } catch {
        return null;
    }
}

export function clearDiagnosticState(): void {
    try {
        sessionStorage.removeItem(DIAGNOSTIC_STORAGE_KEY);
    } catch {
        // storage disabled fallback
    }
}
