# ניהול מרכזי של קישורי GPT Playbook וה-CTA Registry (SiteOS Tier 4)

מסמך זה מגדיר את אופן הניהול והשליטה המרכזית בכל הקישורים והקריאות לפעולה (CTAs) המובילים אל:
`https://handbook.altrubiz.co.il/join`

---

## 1. עקרון יסוד: מקור אמת יחיד (Single Source of Truth)
- **איסור קישורים מפוזרים (No Scattered Links):** חל איסור מוחלט על הטמעת הכתובת `https://handbook.altrubiz.co.il/join` כ-Hardcoded מחרוזת בתוך מאמרים, עמודים או רכיבי React.
- **ניהול מרכזי:** כל הפניות וההצגות נגזרות אך ורק מתוך [src/data/ctaRegistry.ts](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/data/ctaRegistry.ts).
- **שינוי יעד במקום אחד:** עדכון השדה `destination` ברישום ה-CTA מעדכן אוטומטית ובאופן גורף את כל הקישורים באתר.

---

## 2. מבנה הרישום וההפרדה האדריכלית
המערכת מפרידה באופן מוחלט בין:
1. **הגדרת ה-CTA (`CTA_DEFINITIONS`):** הגדרת היעד, המיתוג, ניסוחי ברירת מחדל, וריאציות זמינות ומזהה מעקב.
2. **רישום מיקומים (`CTA_PLACEMENTS`):** הגדרה מפורשת של עמודי יעד, הקשר עריכתי, רמת רלוונטיות, סגנון תצוגה, וריאציית ניסוח ומצב פעיל/כבוי.
3. **חוקים אוטומטיים (`CTA_AUTO_RULES`):** כללי שיבוץ מבוססי תגיות, קטגוריות או דפוסי כתובות עבור תכנים עתידיים.

---

## 3. מדריך הפעלה ותחזוקה

### א. שינוי כתובת היעד באופן גלובלי (Destination)
בקובץ [src/data/ctaRegistry.ts](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/data/ctaRegistry.ts):
```ts
export const CTA_DEFINITIONS: Record<string, CtaDefinition> = {
    'gpt-playbook': {
        id: 'gpt-playbook',
        destination: 'https://handbook.altrubiz.co.il/join', // <-- שנה כאן בלבד
        ...
```

### ב. כיבוי או הפעלה גלובלית (Global Kill-Switch)
כדי להסתיר את ה-CTA בכל האתר מבלי למחוק הגדרות:
```ts
CTA_DEFINITIONS['gpt-playbook'].enabled = false;
```

### ג. הוספת Placement חדש למאמר או עמוד
הוסף רשומה חדשה למערך `CTA_PLACEMENTS` ב-[src/data/ctaRegistry.ts](file:///c:/Users/Dorey/Documents/Vibe/altrubiz.co.il/src/data/ctaRegistry.ts):
```ts
{
    id: 'gpt-playbook-new-article-end',
    ctaId: 'gpt-playbook',
    target: {
        page: '/new-article-slug',
        contentId: 'new-article-slug'
    },
    context: 'הסבר עריכתי מדוע ה-CTA מתאים כאן',
    relevance: 'high', // 'high' | 'medium' | 'low'
    placementType: 'box', // 'box' | 'banner' | 'strip' | 'text-link'
    position: 'end',
    copyVariant: 'practical-next-step', // בחירה מתוך availableVariants
    source: 'manual',
    enabled: true
}
```

### ד. ביטול או השבתת Placement מסוים (Granular Suppression)
כדי להשבית CTA בעמוד מסוים, שנה ברשומה שלו:
```ts
enabled: false
```
*Manual Override: השבתה ידנית מונעת גם מחוקים אוטומטיים להציג את ה-CTA בעמוד זה.*

### ה. שינוי או הוספת וריאציית ניסוח (Copy Variant)
בווריאציות הזמינות בתוך `CTA_DEFINITIONS['gpt-playbook'].availableVariants`:
- ניתן להוסיף וריאציה חדשה עם כותרת, תיאור, טקסט כפתור ותגית (`badge`).
- כל הניסוחים חייבים לעמוד בתקן השפה הנטולת מגדר (Unisex Copy Standard).

---

## 4. מניעת כפילויות וסדר עדיפויות (Deduplication Law)
כאשר עמוד זכאי ל-CTA ביותר מדרך אחת:
$$\text{Manual Placement} > \text{Content Recommendation (recommendedCtas)} > \text{Auto Rule}$$
לעולם לא יוצגו שני CTAs של GPT Playbook באותו עמוד.

---

## 5. ביצוע ביקורת ואיתור קישורים (Audit Tool)
להרצת דוח ביקורת מלא וסריקת הקוד:
```bash
npm run audit:handbook-links
```
הכלי בודק:
1. תקינות הגדרת היעד והשליטה הגלובלית.
2. רשימת כל המיקומים הפעילים והכבויים (סוג, רלוונטיות, וריאציה).
3. סריקה מלאה של המאגר לוודא **0 קישורים מפוזרים ולא מנוהלים**.
