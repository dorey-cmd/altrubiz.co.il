/**
 * AltruBiz Newsletter Club: double opt-in confirmation email.
 * Branded, table-based layout (email clients ignore most CSS). Copy is gender-neutral on purpose.
 */

const LOGO = 'https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png';
const FONT = 'Rubik,Heebo,Arial,Helvetica,sans-serif';

export const CONFIRM_EMAIL_SUBJECT = 'נשאר רק לאשר את ההרשמה למועדון המהלך הבא';

const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export function confirmEmailHtml(confirmUrl: string): string {
    const url = esc(confirmUrl);
    const p = (html: string, extra = '') =>
        `<p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#1c2a3a;${extra}">${html}</p>`;

    return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F6FB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6FB"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" dir="rtl" style="max-width:600px;font-family:${FONT};text-align:right">
    <tr><td align="center" style="padding:6px 0 18px"><img src="${LOGO}" width="170" alt="AltruBiz - להכניס את השיטה לסיסטם" style="display:block;width:170px;height:auto;border:0"></td></tr>
    <tr><td style="background:#082244;background-image:linear-gradient(135deg,#082244,#0d3a63);border-radius:20px 20px 0 0;padding:30px 32px 26px;text-align:center">
      <div style="height:5px;width:64px;margin:0 auto 16px;border-radius:3px;background:#14C4ED"></div>
      <div style="font-size:28px;font-weight:bold;color:#ffffff;line-height:1.25">נשאר רק לאשר</div>
      <div style="font-size:16px;color:#9eeaff;margin-top:6px">מועדון המהלך הבא</div>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:0 0 20px 20px;padding:30px 32px 24px;border:1px solid #e3e9f2;border-top:0">
      ${p('היי,')}
      ${p('קיבלנו בקשה לצרף את כתובת המייל הזו למועדון המהלך הבא של AltruBiz. כדי לוודא שהבקשה באמת הגיעה מכאן, נשאר לאשר אותה בלחיצה אחת:')}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 22px"><tr>
        <td style="border-radius:12px;background:#F5A623;background-image:linear-gradient(90deg,#F5A623,#FACC15)">
          <a href="${url}" style="display:inline-block;padding:15px 34px;font-family:${FONT};font-size:17px;font-weight:bold;color:#2b1a00;text-decoration:none;border-radius:12px">אישור ההרשמה &larr;</a>
        </td></tr></table>
      ${p('הכפתור לא נפתח? אפשר להעתיק את הקישור הזה לדפדפן:', 'font-size:14px;color:#5b6b7f')}
      <p style="margin:0 0 18px;font-size:13px;line-height:1.6;direction:ltr;text-align:left;word-break:break-all"><a href="${url}" style="color:#2585F8">${url}</a></p>
      ${p('לא ביקשתם להצטרף? אפשר פשוט להתעלם מהמייל הזה. בלי אישור, לא יישלח אליכם שום דבר נוסף.', 'font-size:14px;color:#5b6b7f')}
      <div style="border-top:1px solid #e3e9f2;margin-top:10px;padding-top:18px;font-size:16px;line-height:1.7;color:#1c2a3a">
        <b style="color:#0A2E4D">צוות המהלך הבא</b><br>AltruBiz
      </div>
    </td></tr>
    <tr><td style="padding:18px 10px;text-align:center;font-size:13px;line-height:1.7;color:#8a98aa">
      AltruBiz · להכניס את השיטה לסיסטם
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}
