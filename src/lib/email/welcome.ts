/**
 * The letter a new subscriber gets, in their own language.
 *
 * It carries two things: the release date, which is what they asked for, and
 * the journal code, which is what makes leaving an address worth something
 * today rather than in a year.
 *
 * The copy lives here rather than in the site dictionary. The dictionary is
 * for words a page renders; these are words an inbox renders, in a different
 * medium with different rules, and mixing the two makes both harder to read.
 */

import { localeMeta, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/i18n/metadata";
import { journalCode } from "@/lib/journalGate";

type WelcomeCopy = {
  subject: string;
  /** The grey line a mail client shows beside the subject. */
  preheader: string;
  thanks: string;
  dateLine: string;
  codeIntro: string;
  codeLabel: string;
  cta: string;
  ctaNote: string;
  signoff: string;
  footer: string;
};

const copy: Record<Locale, WelcomeCopy> = {
  en: {
    subject: "You are on the list, and here is your code",
    preheader: "The Highest Branch is out on 19 October 2026.",
    thanks: "Thank you for leaving an address. Two things come with it.",
    dateLine:
      "The first is a date. The Highest Branch is out on 19 October 2026, and you will hear from me on the day.",
    codeIntro:
      "The second is a code. The essays and notes on the site are kept behind it.",
    codeLabel: "Your code",
    cta: "Open the journal",
    ctaNote: "Enter it once and the page stays open on that browser for a year.",
    signoff: "Saadan",
    footer:
      "You are getting this because you left your address at saadanqasmani.com. Reply to this note and I will take you off the list.",
  },
  tr: {
    subject: "Listedesiniz. İşte kodunuz.",
    preheader: "The Highest Branch 19 Ekim 2026'da çıkıyor.",
    thanks: "Bir adres bıraktığınız için teşekkür ederim. Yanında iki şey geliyor.",
    dateLine:
      "İlki bir tarih. The Highest Branch 19 Ekim 2026'da çıkıyor ve o gün benden haber alacaksınız.",
    codeIntro:
      "İkincisi bir kod. Sitedeki denemeler ve notlar onun ardında duruyor.",
    codeLabel: "Kodunuz",
    cta: "Günlüğü açın",
    ctaNote: "Bir kez girmeniz yeterli; sayfa o tarayıcıda bir yıl boyunca açık kalır.",
    signoff: "Saadan",
    footer:
      "Bu notu, saadanqasmani.com adresinde bir adres bıraktığınız için alıyorsunuz. Yanıtlarsanız sizi listeden çıkarırım.",
  },
  de: {
    subject: "Sie stehen auf der Liste. Hier ist Ihr Code.",
    preheader: "The Highest Branch erscheint am 19. Oktober 2026.",
    thanks: "Danke, dass Sie eine Adresse hinterlassen haben. Zwei Dinge kommen damit.",
    dateLine:
      "Das erste ist ein Datum. The Highest Branch erscheint am 19. Oktober 2026, und an diesem Tag hören Sie von mir.",
    codeIntro:
      "Das zweite ist ein Code. Die Essays und Notizen auf der Seite liegen dahinter.",
    codeLabel: "Ihr Code",
    cta: "Zum Journal",
    ctaNote:
      "Einmal eingeben genügt: Die Seite bleibt in diesem Browser ein Jahr lang offen.",
    signoff: "Saadan",
    footer:
      "Sie erhalten diese Nachricht, weil Sie auf saadanqasmani.com eine Adresse hinterlassen haben. Antworten Sie darauf, und ich nehme Sie von der Liste.",
  },
  ru: {
    subject: "Вы в списке. Вот ваш код.",
    preheader: "«The Highest Branch» выходит 19 октября 2026 года.",
    thanks: "Спасибо, что оставили адрес. Вместе с ним приходят две вещи.",
    dateLine:
      "Первая — дата. «The Highest Branch» выходит 19 октября 2026 года, и в этот день вы получите от меня письмо.",
    codeIntro:
      "Вторая — код. За ним на сайте лежат эссе и заметки.",
    codeLabel: "Ваш код",
    cta: "Открыть журнал",
    ctaNote: "Ввести его нужно один раз: страница останется открытой в этом браузере на год.",
    signoff: "Саадан",
    footer:
      "Вы получили это письмо, потому что оставили адрес на saadanqasmani.com. Ответьте на него, и я уберу вас из списка.",
  },
  ar: {
    subject: "أنت على القائمة، وهذا رمزك",
    preheader: "تصدر رواية The Highest Branch في ١٩ أكتوبر ٢٠٢٦.",
    thanks: "شكرًا لك على ترك عنوانك. يأتي معه شيئان.",
    dateLine:
      "الأول تاريخ. تصدر رواية The Highest Branch في ١٩ أكتوبر ٢٠٢٦، وستصلك رسالة مني في ذلك اليوم.",
    codeIntro: "والثاني رمز. خلفه تقع المقالات والملاحظات على الموقع.",
    codeLabel: "رمزك",
    cta: "افتح المقالات",
    ctaNote: "يكفي إدخاله مرة واحدة، وتبقى الصفحة مفتوحة في ذلك المتصفح لمدة عام.",
    signoff: "سعدان",
    footer:
      "تصلك هذه الرسالة لأنك تركت عنوانك في saadanqasmani.com. رُدّ عليها وسأرفع اسمك من القائمة.",
  },
  ur: {
    subject: "آپ فہرست میں شامل ہیں، اور یہ آپ کا کوڈ ہے",
    preheader: "میرا ناول The Highest Branch ۱۹ اکتوبر ۲۰۲۶ کو شائع ہو رہا ہے۔",
    thanks: "اپنا پتہ چھوڑنے کے لیے شکریہ۔ اِس کے ساتھ دو چیزیں آتی ہیں۔",
    dateLine:
      "پہلی ایک تاریخ ہے۔ میرا ناول The Highest Branch ۱۹ اکتوبر ۲۰۲۶ کو شائع ہو رہا ہے، اور اُسی دن آپ کو مجھ سے خبر ملے گی۔",
    codeIntro: "دوسری ایک کوڈ ہے۔ سائٹ پر مضامین اور یادداشتیں اِس کے پیچھے ہیں۔",
    codeLabel: "آپ کا کوڈ",
    cta: "مضامین کھولیے",
    ctaNote: "ایک بار درج کر دیجیے، صفحہ اُس براؤزر میں ایک سال تک کھلا رہے گا۔",
    signoff: "سعدان",
    footer:
      "یہ پیغام آپ کو اِس لیے مل رہا ہے کہ آپ نے saadanqasmani.com پر اپنا پتہ چھوڑا تھا۔ جواب دیجیے، میں آپ کو فہرست سے نکال دوں گا۔",
  },
};

/** Keeps a stray angle bracket in a code or an address out of the markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Built as a table with inline styles, because that is what mail clients
 * render. Nothing here relies on a stylesheet, on flexbox, or on a webfont.
 */
export function welcomeEmail(locale: Locale): { subject: string; html: string; text: string } {
  const t = copy[locale];
  const meta = localeMeta[locale];
  const code = journalCode();
  const link = absoluteUrl("/journal", locale);
  const align = meta.dir === "rtl" ? "right" : "left";

  const serif =
    meta.dir === "rtl"
      ? "'Amiri', 'Noto Naskh Arabic', Georgia, serif"
      : "Georgia, 'Times New Roman', serif";

  const p = (text: string) =>
    `<p style="margin:0 0 18px;font:400 17px/1.65 ${serif};color:#1b1a17;">${escapeHtml(text)}</p>`;

  const html = `<!doctype html>
<html lang="${meta.tag}" dir="${meta.dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(t.subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border:1px solid #e4ded3;">
<tr><td dir="${meta.dir}" align="${align}" style="padding:36px 32px;text-align:${align};">
${p(t.thanks)}
${p(t.dateLine)}
${p(t.codeIntro)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="border:1px solid #1b1a17;padding:14px 22px;">
<div style="font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6b655c;">${escapeHtml(t.codeLabel)}</div>
<div dir="ltr" style="margin-top:8px;font:700 22px/1 Helvetica,Arial,sans-serif;letter-spacing:.1em;color:#1b1a17;">${escapeHtml(code)}</div>
</td></tr></table>
${p(t.ctaNote)}
<p style="margin:0 0 28px;"><a href="${escapeHtml(link)}" style="font:400 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9c3b1b;text-decoration:none;border-bottom:1px solid #9c3b1b;padding-bottom:3px;">${escapeHtml(t.cta)}</a></p>
<p style="margin:0;font:400 17px/1.65 ${serif};color:#1b1a17;">${escapeHtml(t.signoff)}</p>
</td></tr>
<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px 28px;text-align:${align};">
<p style="margin:0;padding-top:20px;border-top:1px solid #e4ded3;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:#8a8378;">${escapeHtml(t.footer)}</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    t.thanks,
    "",
    t.dateLine,
    "",
    t.codeIntro,
    "",
    `${t.codeLabel}: ${code}`,
    "",
    t.ctaNote,
    link,
    "",
    t.signoff,
    "",
    "---",
    t.footer,
  ].join("\n");

  return { subject: t.subject, html, text };
}
