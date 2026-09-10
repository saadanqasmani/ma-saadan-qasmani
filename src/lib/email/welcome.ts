/**
 * The letter a new subscriber gets, in their own language.
 *
 * It is a short introduction rather than a receipt: who is writing, why the
 * site exists, what the novel is, and the code that opens the journal. The
 * code is the part that makes leaving an address worth something today
 * rather than in a year, so it is set apart rather than buried.
 *
 * The copy lives here rather than in the site dictionary. The dictionary is
 * for words a page renders; these are words an inbox renders, in a medium
 * with different rules, and mixing the two makes both harder to read.
 */

import { highestBranch, social } from "@/content/site";
import { getPerson } from "@/lib/data";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { getContent } from "@/lib/i18n/content";
import { absoluteUrl } from "@/lib/i18n/metadata";
import { journalCode } from "@/lib/journalGate";
import { siteUrl } from "@/lib/siteUrl";

type WelcomeCopy = {
  subject: string;
  /** The grey line a mail client shows beside the subject. */
  preheader: string;
  thanks: string;
  work: string;
  why: string;
  book: string;
  released: string;
  codeIntro: string;
  codeLabel: string;
  cta: string;
  ctaNote: string;
  coverAlt: string;
  footer: string;
};

const copy: Record<Locale, WelcomeCopy> = {
  en: {
    subject: "Thank you for visiting, and here is your code",
    preheader: "A little about the work, the novel, and the key to the journal.",
    thanks: "Thank you for visiting the site, and for leaving an address.",
    work: "I work on the internationalization of higher education: recruitment, partnerships, and intercultural competence training, delivered in twelve countries to people from more than seventy. Alongside it I research the political economy of that same field, in Istanbul.",
    why: "I built this site because the research, the practice, and the fiction had been living in three separate places. Here they sit in one, and anyone who finds one of them can find the rest.",
    book: "A boy crosses the pass at seventeen, leaving a forest he knows by its seasons for a country that measures time in semesters. It is a fable about arrival, and about what belonging costs.",
    released: "Out 19 October 2026. You will hear from me on the day.",
    codeIntro:
      "One more thing comes with your address. The essays and notes on the site are kept behind a code, and this one is yours.",
    codeLabel: "Your code",
    cta: "Open the journal",
    ctaNote: "Enter it once and the page stays open on that browser for a year.",
    coverAlt: "Cover of The Highest Branch",
    footer:
      "You are getting this because you left your address at saadanqasmani.com. Reply to this note and I will take you off the list.",
  },
  tr: {
    subject: "Ziyaretiniz için teşekkürler, ve işte kodunuz",
    preheader: "Çalışmalarım, roman ve günlüğün anahtarı üzerine kısa bir not.",
    thanks: "Siteyi ziyaret ettiğiniz ve bir adres bıraktığınız için teşekkür ederim.",
    work: "Yükseköğretimin uluslararasılaşması üzerine çalışıyorum: öğrenci temini, kurumsal ortaklıklar ve kültürlerarası yetkinlik eğitimleri. Bunları on iki ülkede, yetmişten fazla ülkeden gelen katılımcılara verdim. Bunun yanında, aynı alanın ekonomi politiği üzerine İstanbul'da araştırma yapıyorum.",
    why: "Bu siteyi kurdum, çünkü araştırma, saha çalışması ve edebiyat üç ayrı yerde duruyordu. Burada bir aradalar; birine ulaşan diğerlerini de bulabiliyor.",
    book: "Bir çocuk on yedi yaşında geçidi aşıyor; mevsimlerinden tanıdığı bir ormanı geride bırakıp zamanı dönemlerle ölçen bir ülkeye gidiyor. Varış üzerine ve aidiyetin bedeli üzerine bir fabl.",
    released: "19 Ekim 2026'da çıkıyor. O gün benden haber alacaksınız.",
    codeIntro:
      "Adresinizle birlikte bir şey daha geliyor. Sitedeki denemeler ve notlar bir kodun ardında duruyor; bu kod sizin.",
    codeLabel: "Kodunuz",
    cta: "Günlüğü açın",
    ctaNote: "Bir kez girmeniz yeterli; sayfa o tarayıcıda bir yıl boyunca açık kalır.",
    coverAlt: "The Highest Branch'in kapağı",
    footer:
      "Bu notu, saadanqasmani.com adresinde bir adres bıraktığınız için alıyorsunuz. Yanıtlarsanız sizi listeden çıkarırım.",
  },
  de: {
    subject: "Danke für Ihren Besuch, und hier ist Ihr Code",
    preheader: "Kurz zu meiner Arbeit, zum Roman und zum Schlüssel für das Journal.",
    thanks: "Danke, dass Sie die Seite besucht und eine Adresse hinterlassen haben.",
    work: "Ich arbeite an der Internationalisierung der Hochschulbildung: Rekrutierung, Partnerschaften und Trainings zu interkultureller Kompetenz, gehalten in zwölf Ländern für Menschen aus über siebzig. Daneben forsche ich in Istanbul zur politischen Ökonomie desselben Feldes.",
    why: "Ich habe diese Seite gebaut, weil die Forschung, die Praxis und die Literatur an drei getrennten Orten lagen. Hier stehen sie beieinander, und wer eines davon findet, findet auch den Rest.",
    book: "Ein Junge überquert mit siebzehn den Pass und lässt einen Wald zurück, den er an seinen Jahreszeiten kennt, für ein Land, das die Zeit in Semestern misst. Eine Fabel über das Ankommen und darüber, was Zugehörigkeit kostet.",
    released: "Erscheint am 19. Oktober 2026. An diesem Tag hören Sie von mir.",
    codeIntro:
      "Mit Ihrer Adresse kommt noch etwas. Die Essays und Notizen auf der Seite liegen hinter einem Code, und dieser gehört Ihnen.",
    codeLabel: "Ihr Code",
    cta: "Zum Journal",
    ctaNote:
      "Einmal eingeben genügt: Die Seite bleibt in diesem Browser ein Jahr lang offen.",
    coverAlt: "Cover von The Highest Branch",
    footer:
      "Sie erhalten diese Nachricht, weil Sie auf saadanqasmani.com eine Adresse hinterlassen haben. Antworten Sie darauf, und ich nehme Sie von der Liste.",
  },
  ru: {
    subject: "Спасибо, что заглянули, и вот ваш код",
    preheader: "Коротко о работе, о романе и о ключе к журналу.",
    thanks: "Спасибо, что зашли на сайт и оставили адрес.",
    work: "Я занимаюсь интернационализацией высшего образования: набором студентов, партнёрствами и тренингами по межкультурной компетентности, которые провёл в двенадцати странах для людей более чем из семидесяти. Параллельно, в Стамбуле, я исследую политическую экономию этой же области.",
    why: "Я сделал этот сайт потому, что исследования, практика и проза жили в трёх разных местах. Здесь они собраны вместе, и тот, кто нашёл одно, найдёт и остальное.",
    book: "В семнадцать лет мальчик переходит перевал, оставляя лес, который знает по временам года, ради страны, где время измеряют семестрами. Это притча о прибытии и о том, чего стоит принадлежность.",
    released: "Выходит 19 октября 2026 года. В этот день вы получите от меня письмо.",
    codeIntro:
      "Вместе с вашим адресом приходит ещё одно. Эссе и заметки на сайте закрыты кодом, и этот код — ваш.",
    codeLabel: "Ваш код",
    cta: "Открыть журнал",
    ctaNote: "Ввести его нужно один раз: страница останется открытой в этом браузере на год.",
    coverAlt: "Обложка романа The Highest Branch",
    footer:
      "Вы получили это письмо, потому что оставили адрес на saadanqasmani.com. Ответьте на него, и я уберу вас из списка.",
  },
  ar: {
    subject: "شكرًا لزيارتك، وهذا رمزك",
    preheader: "نبذة قصيرة عن العمل، وعن الرواية، وعن مفتاح المقالات.",
    thanks: "شكرًا لك على زيارة الموقع وعلى ترك عنوانك.",
    work: "أعمل في تدويل التعليم العالي: استقطاب الطلبة، وإدارة الشراكات، والتدريب على الكفاءة بين الثقافات، وقد قدّمته في اثنتي عشرة دولة لمشاركين من أكثر من سبعين جنسية. وإلى جانب ذلك أبحث في إسطنبول في الاقتصاد السياسي للمجال نفسه.",
    why: "بنيت هذا الموقع لأن البحث والممارسة والأدب كانت تعيش في ثلاثة أماكن منفصلة. هنا تجتمع في مكان واحد، فمن وجد أحدها وجد بقيتها.",
    book: "يعبر فتى في السابعة عشرة الممر، تاركًا غابة يعرفها بفصولها إلى بلد يقيس الزمن بالفصول الدراسية. إنها حكاية عن الوصول، وعن الثمن الذي يدفعه المرء كي ينتمي.",
    released: "تصدر في ١٩ أكتوبر ٢٠٢٦، وستصلك رسالة مني في ذلك اليوم.",
    codeIntro:
      "ويأتي مع عنوانك شيء آخر. المقالات والملاحظات على الموقع محفوظة خلف رمز، وهذا الرمز لك.",
    codeLabel: "رمزك",
    cta: "افتح المقالات",
    ctaNote: "يكفي إدخاله مرة واحدة، وتبقى الصفحة مفتوحة في ذلك المتصفح لمدة عام.",
    coverAlt: "غلاف رواية The Highest Branch",
    footer:
      "تصلك هذه الرسالة لأنك تركت عنوانك في saadanqasmani.com. رُدّ عليها وسأرفع اسمك من القائمة.",
  },
  ur: {
    subject: "تشریف آوری کا شکریہ، اور یہ آپ کا کوڈ ہے",
    preheader: "میرے کام، ناول، اور مضامین کی کنجی کے بارے میں مختصر بات۔",
    thanks: "سائٹ دیکھنے اور اپنا پتہ چھوڑنے کے لیے شکریہ۔",
    work: "میں اعلیٰ تعلیم کی بین الاقوامیت پر کام کرتا ہوں: طلبہ کی رہنمائی اور داخلہ، اداروں کی شراکت داری، اور بین الثقافتی اہلیت کی تربیت، جو میں نے بارہ ملکوں میں ستر سے زائد قومیتوں کے شرکا کو دی ہے۔ اِس کے ساتھ ساتھ استنبول میں اِسی شعبے کی سیاسی معیشت پر تحقیق کرتا ہوں۔",
    why: "یہ سائٹ میں نے اِس لیے بنائی کہ تحقیق، عملی کام اور ادب تینوں الگ الگ جگہوں پر بکھرے ہوئے تھے۔ یہاں وہ ایک جگہ جمع ہیں، اور جسے اِن میں سے ایک ملے وہ باقی بھی پا لے۔",
    book: "ایک لڑکا سترہ برس کی عمر میں درّہ عبور کرتا ہے، اُس جنگل کو چھوڑ کر جسے وہ اُس کے موسموں سے پہچانتا ہے، ایک ایسے ملک کی طرف جو وقت کو تعلیمی سمسٹروں میں ناپتا ہے۔ یہ پہنچنے کی کہانی ہے، اور اِس کی کہ اپنائیت کی قیمت کیا ہوتی ہے۔",
    released: "۱۹ اکتوبر ۲۰۲۶ کو اشاعت۔ اُسی دن آپ کو مجھ سے خبر ملے گی۔",
    codeIntro:
      "آپ کے پتے کے ساتھ ایک چیز اور آتی ہے۔ سائٹ پر مضامین اور یادداشتیں ایک کوڈ کے پیچھے ہیں، اور یہ کوڈ آپ کا ہے۔",
    codeLabel: "آپ کا کوڈ",
    cta: "مضامین کھولیے",
    ctaNote: "ایک بار درج کر دیجیے، صفحہ اُس براؤزر میں ایک سال تک کھلا رہے گا۔",
    coverAlt: "The Highest Branch کا سرورق",
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

/** A named profile, or null when it is not among the site's links. */
function profile(label: string): string | null {
  return social.find((s) => s.label === label)?.url ?? null;
}

/**
 * Built as a table with inline styles, because that is what mail clients
 * render. Nothing here relies on a stylesheet, on flexbox, or on a webfont,
 * and the letter reads in full with every image blocked.
 */
export async function welcomeEmail(
  locale: Locale
): Promise<{ subject: string; html: string; text: string }> {
  const t = copy[locale];
  // The signature line is the site's own, translated with everything else.
  const who = (await getContent(locale)).person(await getPerson());
  const meta = localeMeta[locale];
  const rtl = meta.dir === "rtl";
  const align = rtl ? "right" : "left";
  const code = journalCode();
  const journal = absoluteUrl("/journal", locale);
  const novel = absoluteUrl("/the-highest-branch", locale);
  const cover = highestBranch.coverImage ? `${siteUrl}${highestBranch.coverImage}` : null;

  const linkedin = profile("LinkedIn");
  const instagram = profile("Instagram");

  const serif = rtl
    ? "'Amiri', 'Noto Naskh Arabic', Georgia, serif"
    : "Georgia, 'Times New Roman', serif";
  const sans = "Helvetica, Arial, sans-serif";

  const p = (text: string, margin = "0 0 18px") =>
    `<p style="margin:${margin};font:400 17px/1.65 ${serif};color:#1b1a17;">${escapeHtml(text)}</p>`;

  const rule = `<div style="height:1px;background:#e4ded3;margin:30px 0;"></div>`;

  const coverBlock = cover
    ? `<a href="${escapeHtml(novel)}" style="text-decoration:none;"><img src="${escapeHtml(cover)}" alt="${escapeHtml(t.coverAlt)}" width="140" style="display:block;width:140px;max-width:40%;height:auto;border:1px solid #e4ded3;"></a>
<p style="margin:12px 0 20px;font:italic 400 15px/1.5 ${serif};color:#6b655c;">&ldquo;${escapeHtml(highestBranch.tagline)}&rdquo;</p>`
    : "";

  const socialLinks = [
    instagram ? `<a href="${escapeHtml(instagram)}" style="color:#6b655c;text-decoration:none;border-bottom:1px solid #d8d1c5;">Instagram</a>` : null,
    linkedin ? `<a href="${escapeHtml(linkedin)}" style="color:#6b655c;text-decoration:none;border-bottom:1px solid #d8d1c5;">LinkedIn</a>` : null,
  ]
    .filter(Boolean)
    .join(`<span style="color:#c9c2b6;padding:0 10px;">&middot;</span>`);

  const html = `<!doctype html>
<html lang="${meta.tag}" dir="${meta.dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(t.subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border:1px solid #e4ded3;">

<tr><td dir="${meta.dir}" align="${align}" style="padding:36px 32px 0;text-align:${align};">
${p(t.thanks)}
${p(t.work)}
${p(t.why, "0")}
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px;text-align:${align};">
<p style="margin:0 0 18px;font:400 11px/1 ${sans};letter-spacing:.18em;text-transform:uppercase;color:#9c3b1b;">${escapeHtml(highestBranch.title)}</p>
${coverBlock}
${p(t.book)}
<p style="margin:0 0 6px;font:400 15px/1.6 ${sans};color:#1b1a17;">${escapeHtml(t.released)}</p>
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px;text-align:${align};">
${p(t.codeIntro)}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="border:1px solid #1b1a17;padding:14px 22px;">
<div style="font:400 11px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#6b655c;">${escapeHtml(t.codeLabel)}</div>
<div dir="ltr" style="margin-top:8px;font:700 22px/1 ${sans};letter-spacing:.1em;color:#1b1a17;">${escapeHtml(code)}</div>
</td></tr></table>
${p(t.ctaNote)}
<p style="margin:0;"><a href="${escapeHtml(journal)}" style="font:400 12px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#9c3b1b;text-decoration:none;border-bottom:1px solid #9c3b1b;padding-bottom:3px;">${escapeHtml(t.cta)}</a></p>
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px 32px;text-align:${align};">
<a href="${escapeHtml(siteUrl)}" style="text-decoration:none;"><img src="${escapeHtml(siteUrl)}/logo.png" alt="Saadan Qasmani" width="38" style="display:inline-block;width:38px;height:auto;border:0;"></a>
<p style="margin:10px 0 0;font:400 17px/1.4 ${serif};color:#1b1a17;">${escapeHtml(highestBranch.coverByline)}</p>
<p style="margin:4px 0 14px;font:400 13px/1.5 ${sans};color:#8a8378;">${escapeHtml(`${who.positioning} · ${who.location}`)}</p>
<p style="margin:0;font:400 13px/1.5 ${sans};" dir="ltr">${socialLinks}</p>
</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px 28px;text-align:${align};">
<p style="margin:0;padding-top:18px;border-top:1px solid #e4ded3;font:400 12px/1.6 ${sans};color:#a09889;">${escapeHtml(t.footer)}</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    t.thanks,
    "",
    t.work,
    "",
    t.why,
    "",
    "---",
    highestBranch.title,
    `"${highestBranch.tagline}"`,
    "",
    t.book,
    t.released,
    novel,
    "",
    "---",
    t.codeIntro,
    "",
    `${t.codeLabel}: ${code}`,
    t.ctaNote,
    journal,
    "",
    "---",
    highestBranch.coverByline,
    `${who.positioning} · ${who.location}`,
    siteUrl,
    ...(instagram ? [`Instagram: ${instagram}`] : []),
    ...(linkedin ? [`LinkedIn: ${linkedin}`] : []),
    "",
    t.footer,
  ].join("\n");

  return { subject: t.subject, html, text };
}
