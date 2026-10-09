/**
 * The letter that goes out the moment somebody orders the book.
 *
 * Three versions of the same thing, because there are three ways to buy it
 * and they end differently. A reservation in Pakistan or Türkiye is a
 * promise to send payment instructions. A card payment that has gone
 * through is a receipt. A print-to-order request from a country Amazon does
 * not reach is an acknowledgement with no price in it at all, because
 * quoting postage before it has been worked out and correcting it later is
 * worse than saying nothing.
 *
 * What all three share is the part a reader actually needs at eleven at
 * night three weeks later: what they ordered, what it came to, where it is
 * going, and what happens next. The numbers are the ones the server
 * calculated and stored, never the ones a browser sent, and every one of
 * them is printed with its own currency — this shop prices in rupees, lira
 * and dollars, and a bare "6,000" is a number somebody can be wrong about
 * by two orders of magnitude.
 *
 * Nothing here can fail an order. The caller sends it and logs what
 * happened; a reader who ordered has ordered whether or not the letter got
 * out, which is the same rule the welcome note follows.
 */

import { highestBranch } from "@/content/site";
import { moneyIn } from "@/lib/book/regions";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/i18n/metadata";
import { siteUrl } from "@/lib/siteUrl";
import { replyAddress, type Mail } from "@/lib/email/send";

export type OrderKind = "reserved" | "paid" | "quote";

/** Which country's terms the order was placed under. */
export type OrderRegion = "pk" | "tr" | "world";

/**
 * Where the money actually goes.
 *
 * It lives here, in a module nothing on the client imports, rather than in
 * the content tree: an account number belongs in the one letter that needs
 * it and nowhere a crawler can reach. Nothing on the site displays it. The
 * reader is told it has been emailed, and it has.
 */
const SETTLEMENT: Record<"pk" | "tr", { method: string; label: string; value: string; holder?: string }> = {
  tr: {
    method: "bank",
    label: "IBAN",
    value: "TR56 0001 0090 1010 3999 9050 01",
    holder: "Muhammad Ahmed Saadan Qasmani",
  },
  pk: {
    method: "easypaisa",
    label: "Easypaisa",
    value: "0333 3012347",
    holder: "Muhammad Ahmed Saadan Qasmani",
  },
};

export type OrderLines = {
  currency: string;
  quantity: number;
  unit: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoApplied: boolean;
};

export type OrderMail = {
  kind: OrderKind;
  locale: Locale;
  /**
   * Decides which payment instructions the letter carries. Absent on a
   * print-to-order request, which has no price agreed and so nothing to
   * pay yet.
   */
  region?: OrderRegion | null;
  name: string;
  email: string;
  country: string;
  city?: string;
  address: string;
  quantity: number;
  /** Null for a print-to-order request, which has no price yet. */
  lines: OrderLines | null;
  /** The order's own id, so a reply can be matched to a row. */
  reference?: string | null;
};

type Copy = {
  subjectReserved: string;
  subjectPaid: string;
  subjectQuote: string;
  preheader: string;
  hello: string;
  thanksReserved: string;
  thanksPaid: string;
  thanksQuote: string;
  nextReserved: string;
  payHeading: string;
  payBank: string;
  payEasypaisa: string;
  payHolder: string;
  payReference: string;
  payReceipt: string;
  nextPaid: string;
  nextQuote: string;
  orderHeading: string;
  copies: string;
  perCopy: string;
  postage: string;
  discount: string;
  total: string;
  promoNote: string;
  shipTo: string;
  released: string;
  reference: string;
  question: string;
  signOff: string;
  noReplyNeeded: string;
};

/**
 * Written out per language rather than machine-translated at send time. An
 * order confirmation is the one letter a reader keeps, and a mistranslated
 * total is worse than an English one.
 */
const copy: Record<Locale, Copy> = {
  en: {
    subjectReserved: "Your copy of The Highest Branch is reserved",
    subjectPaid: "Your order for The Highest Branch is paid",
    subjectQuote: "We have your request for The Highest Branch",
    preheader: "What you ordered, what it comes to, and what happens next.",
    hello: "Hello",
    thanksReserved: "Thank you for pre-ordering The Highest Branch. Your copies are set aside.",
    thanksPaid: "Thank you. Your payment has gone through and your order is confirmed.",
    thanksQuote: "Thank you for asking. Amazon does not reach your country, so this one is arranged by hand.",
    nextReserved: "Nothing has been charged. The details for paying are below, and your copy goes out the week the book comes off the press.",
    payHeading: "How to pay",
    payBank: "Send the total to this account by bank transfer.",
    payEasypaisa: "Send the total to this Easypaisa number.",
    payHolder: "Account name",
    payReference: "Put your own name in the transfer note, so I can match the payment to your order.",
    payReceipt: "Then email the receipt to {email} and I will confirm it the same day.",
    nextPaid: "Nothing more is needed from you. You will hear from me again when the book ships.",
    nextQuote: "I will work out what postage to your address costs and write back with a price before anything is owed.",
    orderHeading: "Your order",
    copies: "Copies",
    perCopy: "Per copy",
    postage: "Postage",
    discount: "Discount",
    total: "Total",
    promoNote: "Your code was applied.",
    shipTo: "Going to",
    released: "The book is published on 19 October 2026 and ships after that date.",
    reference: "Order reference",
    question: "If anything here is wrong, reply to this message and it will reach me.",
    signOff: "Saadan Qasmani",
    noReplyNeeded: "You are receiving this because you placed an order on saadanqasmani.com.",
  },
  tr: {
    subjectReserved: "En Yüksek Dal kitabınız ayrıldı",
    subjectPaid: "En Yüksek Dal siparişinizin ödemesi alındı",
    subjectQuote: "En Yüksek Dal talebiniz elimize ulaştı",
    preheader: "Ne sipariş ettiniz, tutarı ne kadar ve bundan sonra ne olacak.",
    hello: "Merhaba",
    thanksReserved: "En Yüksek Dal için ön sipariş verdiğiniz için teşekkür ederim. Kitaplarınız ayrıldı.",
    thanksPaid: "Teşekkür ederim. Ödemeniz alındı ve siparişiniz onaylandı.",
    thanksQuote: "Sorduğunuz için teşekkür ederim. Amazon ülkenize göndermiyor, bu yüzden bu sipariş elden düzenlenecek.",
    nextReserved: "Hiçbir tahsilat yapılmadı. Ödeme bilgileri aşağıda; kitap baskıdan çıktığı hafta kopyanız yola çıkar.",
    payHeading: "Nasıl ödenir",
    payBank: "Toplam tutarı havale veya EFT ile bu hesaba gönderin.",
    payEasypaisa: "Toplam tutarı bu Easypaisa numarasına gönderin.",
    payHolder: "Hesap adı",
    payReference: "Havale açıklamasına kendi adınızı yazın ki ödemeyi siparişinizle eşleştirebileyim.",
    payReceipt: "Sonra dekontu {email} adresine gönderin; aynı gün onaylayayım.",
    nextPaid: "Sizden başka bir şey gerekmiyor. Kitap kargoya verildiğinde tekrar yazacağım.",
    nextQuote: "Adresinize kargonun ne tuttuğunu hesaplayıp, herhangi bir ödeme söz konusu olmadan önce fiyatı size yazacağım.",
    orderHeading: "Siparişiniz",
    copies: "Adet",
    perCopy: "Adet başına",
    postage: "Kargo",
    discount: "İndirim",
    total: "Toplam",
    promoNote: "Kodunuz uygulandı.",
    shipTo: "Gönderilecek adres",
    released: "Kitap 19 Ekim 2026'da yayımlanıyor ve o tarihten sonra kargoya veriliyor.",
    reference: "Sipariş numarası",
    question: "Burada bir şey yanlışsa bu mesajı yanıtlayın, bana ulaşır.",
    signOff: "Saadan Qasmani",
    noReplyNeeded: "Bu mesajı saadanqasmani.com üzerinden sipariş verdiğiniz için alıyorsunuz.",
  },
  de: {
    subjectReserved: "Ihr Exemplar von The Highest Branch ist reserviert",
    subjectPaid: "Ihre Bestellung von The Highest Branch ist bezahlt",
    subjectQuote: "Ihre Anfrage zu The Highest Branch ist angekommen",
    preheader: "Was Sie bestellt haben, was es kostet und wie es weitergeht.",
    hello: "Hallo",
    thanksReserved: "Vielen Dank für Ihre Vorbestellung von The Highest Branch. Ihre Exemplare sind zurückgelegt.",
    thanksPaid: "Vielen Dank. Ihre Zahlung ist eingegangen und Ihre Bestellung ist bestätigt.",
    thanksQuote: "Danke für Ihre Anfrage. Amazon liefert nicht in Ihr Land, deshalb wird diese Bestellung von Hand abgewickelt.",
    nextReserved: "Es wurde nichts abgebucht. Die Zahlungsangaben stehen unten, und Ihr Exemplar geht in der Woche raus, in der das Buch aus der Presse kommt.",
    payHeading: "So zahlen Sie",
    payBank: "Überweisen Sie den Gesamtbetrag auf dieses Konto.",
    payEasypaisa: "Senden Sie den Gesamtbetrag an diese Easypaisa-Nummer.",
    payHolder: "Kontoinhaber",
    payReference: "Schreiben Sie Ihren Namen in den Verwendungszweck, damit ich die Zahlung Ihrer Bestellung zuordnen kann.",
    payReceipt: "Schicken Sie mir dann den Beleg an {email}, und ich bestätige ihn noch am selben Tag.",
    nextPaid: "Von Ihnen wird nichts weiter gebraucht. Sie hören wieder von mir, wenn das Buch verschickt wird.",
    nextQuote: "Ich rechne das Porto zu Ihrer Adresse aus und melde mich mit einem Preis, bevor irgendetwas fällig wird.",
    orderHeading: "Ihre Bestellung",
    copies: "Exemplare",
    perCopy: "Pro Exemplar",
    postage: "Porto",
    discount: "Rabatt",
    total: "Gesamt",
    promoNote: "Ihr Code wurde angewendet.",
    shipTo: "Versand an",
    released: "Das Buch erscheint am 19. Oktober 2026 und wird danach verschickt.",
    reference: "Bestellnummer",
    question: "Wenn hier etwas nicht stimmt, antworten Sie einfach auf diese Nachricht.",
    signOff: "Saadan Qasmani",
    noReplyNeeded: "Sie erhalten diese Nachricht, weil Sie auf saadanqasmani.com bestellt haben.",
  },
  ru: {
    subjectReserved: "Ваш экземпляр «The Highest Branch» отложен",
    subjectPaid: "Ваш заказ «The Highest Branch» оплачен",
    subjectQuote: "Мы получили вашу заявку на «The Highest Branch»",
    preheader: "Что вы заказали, сколько это стоит и что будет дальше.",
    hello: "Здравствуйте",
    thanksReserved: "Спасибо за предзаказ «The Highest Branch». Ваши экземпляры отложены.",
    thanksPaid: "Спасибо. Оплата прошла, заказ подтверждён.",
    thanksQuote: "Спасибо за обращение. Amazon не доставляет в вашу страну, поэтому этот заказ оформляется вручную.",
    nextReserved: "Ничего не списано. Реквизиты для оплаты ниже, а книга уедет к вам на той неделе, когда сойдёт с печатного станка.",
    payHeading: "Как оплатить",
    payBank: "Переведите всю сумму на этот счёт банковским переводом.",
    payEasypaisa: "Отправьте всю сумму на этот номер Easypaisa.",
    payHolder: "Имя владельца счёта",
    payReference: "Укажите своё имя в назначении платежа, чтобы я мог сопоставить его с вашим заказом.",
    payReceipt: "Затем пришлите квитанцию на {email}, и я подтвержу её в тот же день.",
    nextPaid: "От вас больше ничего не требуется. Я напишу снова, когда книга будет отправлена.",
    nextQuote: "Я рассчитаю стоимость доставки по вашему адресу и напишу с ценой, прежде чем что-либо нужно будет платить.",
    orderHeading: "Ваш заказ",
    copies: "Экземпляров",
    perCopy: "За экземпляр",
    postage: "Доставка",
    discount: "Скидка",
    total: "Итого",
    promoNote: "Ваш код применён.",
    shipTo: "Адрес доставки",
    released: "Книга выходит 19 октября 2026 года и отправляется после этой даты.",
    reference: "Номер заказа",
    question: "Если здесь что-то неверно, просто ответьте на это письмо.",
    signOff: "Саадан Касмани",
    noReplyNeeded: "Вы получили это письмо, потому что оформили заказ на saadanqasmani.com.",
  },
  ar: {
    subjectReserved: "تم حجز نسختك من The Highest Branch",
    subjectPaid: "تم دفع طلبك لكتاب The Highest Branch",
    subjectQuote: "وصلنا طلبك بخصوص The Highest Branch",
    preheader: "ما طلبته، وكم بلغ، وما الذي سيحدث بعد ذلك.",
    hello: "مرحبًا",
    thanksReserved: "شكرًا لطلبك المسبق لكتاب The Highest Branch. نسخك محجوزة.",
    thanksPaid: "شكرًا لك. تم استلام الدفع وتأكيد طلبك.",
    thanksQuote: "شكرًا لسؤالك. أمازون لا تصل إلى بلدك، لذلك سيُرتَّب هذا الطلب يدويًا.",
    nextReserved: "لم يُخصم شيء. تفاصيل الدفع في الأسفل، ونسختك تخرج إليك في الأسبوع الذي يُطبع فيه الكتاب.",
    payHeading: "كيفية الدفع",
    payBank: "حوّل المبلغ الإجمالي إلى هذا الحساب.",
    payEasypaisa: "أرسل المبلغ الإجمالي إلى رقم Easypaisa هذا.",
    payHolder: "اسم صاحب الحساب",
    payReference: "اكتب اسمك في ملاحظة التحويل حتى أتمكن من مطابقة الدفعة بطلبك.",
    payReceipt: "ثم أرسل الإيصال إلى {email} وسأؤكّده في اليوم نفسه.",
    nextPaid: "لا حاجة لشيء آخر منك. سأكتب إليك مرة أخرى عند شحن الكتاب.",
    nextQuote: "سأحسب تكلفة الشحن إلى عنوانك وأكتب إليك بالسعر قبل أن يُستحق أي مبلغ.",
    orderHeading: "طلبك",
    copies: "النسخ",
    perCopy: "سعر النسخة",
    postage: "الشحن",
    discount: "الخصم",
    total: "الإجمالي",
    promoNote: "تم تطبيق الرمز الخاص بك.",
    shipTo: "الإرسال إلى",
    released: "يصدر الكتاب في 19 أكتوبر 2026 ويُشحن بعد ذلك التاريخ.",
    reference: "رقم الطلب",
    question: "إن كان هناك خطأ هنا، فقط ردَّ على هذه الرسالة وستصلني.",
    signOff: "سعدان قاسماني",
    noReplyNeeded: "تصلك هذه الرسالة لأنك قدمت طلبًا عبر saadanqasmani.com.",
  },
  ur: {
    subjectReserved: "The Highest Branch کی آپ کی کاپی محفوظ کر لی گئی ہے",
    subjectPaid: "The Highest Branch کے آپ کے آرڈر کی ادائیگی ہو گئی ہے",
    subjectQuote: "The Highest Branch کے لیے آپ کی درخواست موصول ہو گئی ہے",
    preheader: "آپ نے کیا منگوایا، کتنے کا ہے، اور آگے کیا ہوگا۔",
    hello: "السلام علیکم",
    thanksReserved: "The Highest Branch کا پیشگی آرڈر دینے کا شکریہ۔ آپ کی کاپیاں الگ رکھ دی گئی ہیں۔",
    thanksPaid: "شکریہ۔ آپ کی ادائیگی موصول ہو گئی ہے اور آرڈر تصدیق شدہ ہے۔",
    thanksQuote: "پوچھنے کا شکریہ۔ ایمازون آپ کے ملک میں نہیں بھیجتا، اس لیے یہ آرڈر ہاتھ سے ترتیب دیا جائے گا۔",
    nextReserved: "کچھ وصول نہیں کیا گیا۔ ادائیگی کی تفصیل نیچے ہے، اور جس ہفتے کتاب چھپ کر آئے گی اُسی ہفتے آپ کی کاپی روانہ ہو جائے گی۔",
    payHeading: "ادائیگی کیسے کریں",
    payBank: "کل رقم بینک ٹرانسفر کے ذریعے اِس اکاؤنٹ میں بھیجیے۔",
    payEasypaisa: "کل رقم اِس ایزی پیسہ نمبر پر بھیجیے۔",
    payHolder: "اکاؤنٹ کا نام",
    payReference: "ٹرانسفر کے نوٹ میں اپنا نام ضرور لکھیے تاکہ میں ادائیگی کو آپ کے آرڈر سے ملا سکوں۔",
    payReceipt: "پھر رسید {email} پر بھیج دیجیے، میں اُسی دن تصدیق کر دوں گا۔",
    nextPaid: "اب آپ سے مزید کچھ درکار نہیں۔ کتاب روانہ ہوتے وقت میں دوبارہ لکھوں گا۔",
    nextQuote: "میں آپ کے پتے تک ڈاک خرچ نکال کر، کسی رقم کے واجب ہونے سے پہلے قیمت لکھ بھیجوں گا۔",
    orderHeading: "آپ کا آرڈر",
    copies: "کاپیاں",
    perCopy: "فی کاپی",
    postage: "ڈاک خرچ",
    discount: "رعایت",
    total: "کل",
    promoNote: "آپ کا کوڈ لگا دیا گیا ہے۔",
    shipTo: "بھیجا جائے گا",
    released: "کتاب 19 اکتوبر 2026 کو شائع ہو رہی ہے اور اس کے بعد بھیجی جائے گی۔",
    reference: "آرڈر نمبر",
    question: "اگر یہاں کچھ غلط ہے تو اسی پیغام کا جواب دیں، مجھ تک پہنچ جائے گا۔",
    signOff: "سعدان قاسمانی",
    noReplyNeeded: "یہ پیغام آپ کو اس لیے موصول ہوا کہ آپ نے saadanqasmani.com پر آرڈر دیا۔",
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Money exactly as the shop writes it, so the letter and the page agree. */
export const money = (amount: number, currency: string) => moneyIn(currency, amount);

/** The first eight characters of the id: enough to match a row, short enough to read out. */
function shortRef(reference: string | null | undefined): string | null {
  return reference ? reference.split("-")[0].toUpperCase() : null;
}

export function orderEmail(order: OrderMail): Mail {
  const t = copy[order.locale] ?? copy.en;
  const meta = localeMeta[order.locale] ?? localeMeta.en;
  const rtl = meta.dir === "rtl";
  const align = rtl ? "right" : "left";
  const opposite = rtl ? "left" : "right";

  const subject =
    order.kind === "paid" ? t.subjectPaid : order.kind === "quote" ? t.subjectQuote : t.subjectReserved;
  const thanks =
    order.kind === "paid" ? t.thanksPaid : order.kind === "quote" ? t.thanksQuote : t.thanksReserved;
  const next =
    order.kind === "paid" ? t.nextPaid : order.kind === "quote" ? t.nextQuote : t.nextReserved;

  const serif = rtl
    ? "'Amiri', 'Noto Naskh Arabic', Georgia, serif"
    : "Georgia, 'Times New Roman', serif";
  const sans = "Helvetica, Arial, sans-serif";

  const p = (text: string, margin = "0 0 18px") =>
    `<p style="margin:${margin};font:400 17px/1.65 ${serif};color:#1b1a17;">${escapeHtml(text)}</p>`;

  const rule = `<div style="height:1px;background:#e4ded3;margin:28px 0;"></div>`;

  const row = (label: string, value: string, strong = false) =>
    `<tr>
<td dir="${meta.dir}" align="${align}" style="padding:6px 0;font:400 14px/1.5 ${sans};color:#6b655c;text-align:${align};">${escapeHtml(label)}</td>
<td dir="ltr" align="${opposite}" style="padding:6px 0;font:${strong ? "700" : "400"} ${strong ? "17px" : "15px"}/1.5 ${sans};color:#1b1a17;text-align:${opposite};white-space:nowrap;">${escapeHtml(value)}</td>
</tr>`;

  const l = order.lines;
  const summary = l
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 4px;">
${row(t.copies, String(l.quantity))}
${row(t.perCopy, money(l.unit, l.currency))}
${l.discount > 0 ? row(t.discount, `− ${money(l.discount, l.currency)}`) : ""}
${l.shipping > 0 ? row(t.postage, money(l.shipping, l.currency)) : ""}
<tr><td colspan="2" style="padding:6px 0 0;"><div style="height:1px;background:#e4ded3;"></div></td></tr>
${row(t.total, money(l.total, l.currency), true)}
</table>
${l.promoApplied ? `<p style="margin:10px 0 0;font:400 14px/1.5 ${sans};color:#6b655c;">${escapeHtml(t.promoNote)}</p>` : ""}`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row(t.copies, String(order.quantity))}</table>`;

  /**
   * The part a reader in Türkiye or Pakistan opens this letter for.
   *
   * Only on a reservation: a card that already went through has nothing to
   * pay, and a print-to-order request has no agreed price to pay yet. The
   * account itself is set left to right and kept off one line, because an
   * IBAN read back wrong is a payment that lands somewhere else.
   */
  const settle =
    order.kind === "reserved" && (order.region === "tr" || order.region === "pk")
      ? SETTLEMENT[order.region]
      : null;
  const settleHow = settle ? (settle.method === "bank" ? t.payBank : t.payEasypaisa) : "";
  const receiptTo = replyAddress();
  const settleReceipt = settle ? t.payReceipt.replace("{email}", receiptTo) : "";

  const where = [order.address, order.city, order.country].filter(Boolean).join(", ");
  const ref = shortRef(order.reference);
  const novel = absoluteUrl("/the-highest-branch", order.locale);

  const html = `<!doctype html>
<html lang="${meta.tag}" dir="${meta.dir}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border:1px solid #e4ded3;">

<tr><td dir="${meta.dir}" align="${align}" style="padding:36px 32px 0;text-align:${align};">
<p style="margin:0 0 20px;font:400 11px/1 ${sans};letter-spacing:.18em;text-transform:uppercase;color:#9c3b1b;">${escapeHtml(highestBranch.title)}</p>
${p(`${t.hello} ${order.name},`)}
${p(thanks)}
${p(next, "0")}
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px;text-align:${align};">
<p style="margin:0 0 14px;font:400 11px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#6b655c;">${escapeHtml(t.orderHeading)}</p>
${summary}
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

${settle ? `<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px;text-align:${align};">
<p style="margin:0 0 14px;font:400 11px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#9c3b1b;">${escapeHtml(t.payHeading)}</p>
${p(settleHow, "0 0 14px")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;border:1px solid #e4ded3;">
<tr><td dir="ltr" align="left" style="padding:16px 18px;text-align:left;">
<p style="margin:0 0 4px;font:400 11px/1 ${sans};letter-spacing:.14em;text-transform:uppercase;color:#6b655c;">${escapeHtml(settle.label)}</p>
<p style="margin:0;font:700 18px/1.45 ${sans};color:#1b1a17;word-break:break-word;">${escapeHtml(settle.value)}</p>
${settle.holder ? `<p style="margin:12px 0 4px;font:400 11px/1 ${sans};letter-spacing:.14em;text-transform:uppercase;color:#6b655c;">${escapeHtml(t.payHolder)}</p>
<p style="margin:0;font:400 16px/1.45 ${sans};color:#1b1a17;">${escapeHtml(settle.holder)}</p>` : ""}
</td></tr>
</table>
${p(t.payReference, "16px 0 10px")}
${p(settleReceipt, "0")}
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>` : ""}

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px;text-align:${align};">
<p style="margin:0 0 6px;font:400 11px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#6b655c;">${escapeHtml(t.shipTo)}</p>
<p dir="auto" style="margin:0 0 18px;font:400 15px/1.6 ${sans};color:#1b1a17;white-space:pre-wrap;">${escapeHtml(where)}</p>
${p(t.released, "0 0 8px")}
${ref ? `<p style="margin:0;font:400 14px/1.6 ${sans};color:#6b655c;">${escapeHtml(t.reference)}: <span dir="ltr">${escapeHtml(ref)}</span></p>` : ""}
</td></tr>

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td dir="${meta.dir}" align="${align}" style="padding:0 32px 34px;text-align:${align};">
${p(t.question, "0 0 16px")}
<p style="margin:0;font:400 15px/1.6 ${sans};color:#1b1a17;">${escapeHtml(t.signOff)}</p>
<p style="margin:6px 0 0;font:400 13px/1.6 ${sans};color:#6b655c;"><a href="${escapeHtml(novel)}" style="color:#6b655c;text-decoration:none;border-bottom:1px solid #d8d1c5;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a></p>
</td></tr>

</table>
<p style="margin:18px 0 0;font:400 12px/1.6 ${sans};color:#9a9388;max-width:560px;">${escapeHtml(t.noReplyNeeded)}</p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    highestBranch.title,
    "",
    `${t.hello} ${order.name},`,
    "",
    thanks,
    "",
    next,
    "",
    "---",
    t.orderHeading,
    l
      ? [
          `${t.copies}: ${l.quantity}`,
          `${t.perCopy}: ${money(l.unit, l.currency)}`,
          l.discount > 0 ? `${t.discount}: -${money(l.discount, l.currency)}` : "",
          l.shipping > 0 ? `${t.postage}: ${money(l.shipping, l.currency)}` : "",
          `${t.total}: ${money(l.total, l.currency)}`,
          l.promoApplied ? t.promoNote : "",
        ]
          .filter(Boolean)
          .join("\n")
      : `${t.copies}: ${order.quantity}`,
    ...(settle
      ? [
          "---",
          t.payHeading,
          settleHow,
          `${settle.label}: ${settle.value}`,
          ...(settle.holder ? [`${t.payHolder}: ${settle.holder}`] : []),
          t.payReference,
          settleReceipt,
          "",
        ]
      : []),
    `${t.shipTo}: ${where}`,
    t.released,
    ...(ref ? [`${t.reference}: ${ref}`] : []),
    "",
    "---",
    t.question,
    t.signOff,
    siteUrl,
    "",
    t.noReplyNeeded,
  ].join("\n");

  return { to: order.email, subject, html, text };
}
