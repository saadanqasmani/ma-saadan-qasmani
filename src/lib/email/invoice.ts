/**
 * The invoice, as an email.
 *
 * The printed invoice is laid out with grid and flexbox, which Gmail
 * tolerates and Outlook does not, so this is not that page squeezed into a
 * message: it is the same invoice rebuilt out of nested tables, the only
 * layout every mail client still agrees on. Same words, same order, same
 * figures, same navy and plum; no single rule of the design is load-bearing
 * on a feature from this decade.
 *
 * It carries what the buyer opens it for — what they ordered, what it comes
 * to, where to send the money, and by when — and it ends where the printed
 * one ends, with the thanks.
 */

import { INVOICE_FIXED as F, type Invoice } from "@/lib/book/invoice";
import { siteUrl } from "@/lib/siteUrl";
import { replyAddress, type Mail } from "@/lib/email/send";

const SANS = "Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

const INK = {
  paper: "#FBFAF6",
  card: "#FFFFFF",
  text: "#22223A",
  soft: "#5C5C74",
  faint: "#6A6A80",
  rule: "#D9D5E3",
  accent: "#3B3D7A",
  deep: "#2E2F5E",
  plum: "#6E5577",
  slate: "#4F6670",
  green: "#3E5A2E",
  tint: "#EFEDF5",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A label and a figure, the label left and the figure hard right. */
function row(label: string, value: string, opts: { strong?: boolean; tone?: string } = {}) {
  if (!value.trim()) return "";
  const { strong = false, tone } = opts;
  return `<tr>
<td align="left" style="padding:5px 0;font:400 13px/1.5 ${SANS};color:${INK.soft};">${escapeHtml(label)}</td>
<td align="right" style="padding:5px 0;font:${strong ? "700 17px" : "400 14px"}/1.5 ${SANS};color:${tone ?? INK.text};white-space:nowrap;">${escapeHtml(value)}</td>
</tr>`;
}

/** One of the numbered payment steps: a coloured disc, then the instruction. */
function step(n: number, tone: string, body: string) {
  return `<tr><td style="padding:0 0 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="24" valign="top" style="width:24px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="22" style="width:22px;"><tr>
<td align="center" height="22" style="height:22px;background:${tone};border-radius:11px;font:700 12px/22px ${SANS};color:#FFFFFF;">${n}</td>
</tr></table>
</td>
<td width="12" style="width:12px;">&nbsp;</td>
<td valign="top" style="font:400 14px/1.55 ${SANS};color:${INK.text};">${body}</td>
</tr></table>
</td></tr>`;
}

const heading = (text: string, tone: string) =>
  `<p style="margin:0 0 10px;font:700 11px/1 ${SANS};letter-spacing:.14em;text-transform:uppercase;color:${tone};">${escapeHtml(text)}</p>`;

export function invoiceEmail(inv: Invoice, to: string): Mail {
  const subject = `Invoice ${inv.number} · ${F.title}`;
  const receipts = inv.payEmail.trim() || replyAddress();
  const novel = `${siteUrl}/the-highest-branch`;
  const e = escapeHtml;

  /** The address, as a block, with the blank lines left out. */
  const shipTo = [inv.addressLine1, inv.addressLine2, inv.addressCity]
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<div dir="auto">${e(line)}</div>`)
    .join("");

  const due = inv.due.trim()
    ? `Please send it by <b>${e(inv.due)}</b> so your copy is held and goes out with the first dispatch.`
    : "Please send it at your earliest convenience so your copy is held and goes out with the first dispatch.";

  const html = `<!doctype html>
<html lang="en" dir="ltr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:${INK.tint};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Invoice ${e(inv.number)} for ${e(F.title)} — ${e(inv.total)} due.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK.tint};">
<tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${INK.paper};border:1px solid ${INK.rule};">

<!-- the ribbon -->
<tr><td style="padding:0;font-size:0;line-height:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="20%" height="10" style="background:${INK.accent};font-size:0;line-height:10px;">&nbsp;</td>
<td width="12%" height="10" style="background:${INK.plum};font-size:0;line-height:10px;">&nbsp;</td>
<td width="30%" height="10" style="background:#8E8FB5;font-size:0;line-height:10px;">&nbsp;</td>
<td width="14%" height="10" style="background:${INK.slate};font-size:0;line-height:10px;">&nbsp;</td>
<td width="24%" height="10" style="background:#B9B4CC;font-size:0;line-height:10px;">&nbsp;</td>
</tr></table>
</td></tr>

<!-- masthead -->
<tr><td style="padding:26px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="top" align="left">
<p style="margin:0;font:600 19px/1.2 ${SERIF};letter-spacing:.06em;color:${INK.text};">${e(F.author)}</p>
<p style="margin:4px 0 0;font:400 13px/1.5 ${SANS};color:${INK.soft};">Author of <i style="color:${INK.plum};">${e(F.title)}</i></p>
<p style="margin:2px 0 0;font:400 12px/1.5 ${SANS};color:${INK.soft};">${e(F.site)} · ${e(F.email)}</p>
</td>
<td valign="top" align="right" width="120" style="width:120px;">
<p style="margin:0;font:400 34px/1 ${SERIF};letter-spacing:.04em;color:${INK.accent};">Invoice</p>
</td>
</tr></table>
</td></tr>

<tr><td style="padding:18px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK.tint};">
<tr><td style="padding:12px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row("Invoice no.", inv.number, { strong: false })}
${row("Date issued", inv.issued)}
${row("Payment due", inv.due)}
${row("Status", inv.status, { tone: INK.plum })}
</table>
</td></tr></table>
</td></tr>

<!-- hello -->
<tr><td style="padding:24px 28px 0;">
<p style="margin:0 0 16px;font:400 17px/1.6 ${SERIF};color:${INK.text};">Dear ${e(inv.customerName || "reader")},</p>
<p style="margin:0 0 16px;font:400 16px/1.65 ${SERIF};color:${INK.text};">Thank you for ordering <i>${e(F.title)}</i>. Your invoice is below, and so is the one thing still left to do: the payment.</p>
<p style="margin:0;font:400 16px/1.65 ${SERIF};color:${INK.text};">${due}</p>
</td></tr>

<!-- the book -->
<tr><td style="padding:22px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK.card};border:1px solid ${INK.rule};">
<tr><td style="padding:16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="62" valign="top" style="width:62px;">
<img src="${siteUrl}/invoice/cover.jpg" width="62" alt="" style="display:block;width:62px;height:auto;border:0;outline:none;text-decoration:none;">
</td>
<td width="16" style="width:16px;">&nbsp;</td>
<td valign="top" align="left">
<p style="margin:0;font:700 19px/1.15 ${SERIF};letter-spacing:.02em;color:${INK.text};">${e(F.title)}</p>
<p style="margin:3px 0 0;font:italic 400 14px/1.4 ${SERIF};color:${INK.plum};">${e(F.tagline)}</p>
<p style="margin:5px 0 0;font:400 12px/1.5 ${SANS};color:${INK.soft};">${e(F.edition)}</p>
<p style="margin:0;font:400 12px/1.5 ${SANS};color:${INK.soft};">ISBN ${e(F.isbn)}</p>
</td>
</tr></table>
</td></tr>
<tr><td style="padding:0 16px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td colspan="2" style="padding:0 0 8px;"><div style="height:1px;background:${INK.rule};font-size:0;line-height:0;">&nbsp;</div></td></tr>
${row("Copies", inv.quantity)}
${row("Price per copy", inv.unitPrice)}
${row("Subtotal", inv.subtotal)}
${inv.promoCode.trim() ? row(`Promo code ${inv.promoCode}`, `− ${inv.discount}`, { tone: INK.green }) : ""}
${row(inv.deliveryLabel || "Delivery", inv.delivery)}
<tr><td colspan="2" style="padding:6px 0 0;"><div style="height:1px;background:${INK.rule};font-size:0;line-height:0;">&nbsp;</div></td></tr>
${row("TOTAL DUE", inv.total, { strong: true, tone: INK.accent })}
</table>
</td></tr>
</table>
</td></tr>

<!-- how to pay -->
<tr><td style="padding:20px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK.card};border:1px solid ${INK.rule};">
<tr><td style="padding:16px 18px;">
${heading("How to pay", INK.slate)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${step(1, INK.deep, `${e(inv.payHow)}<br>
<span style="font:700 18px/1.4 ${SANS};letter-spacing:.04em;color:${INK.text};word-break:break-word;">${e(inv.payNumber)}</span>${
  inv.payTitle.trim()
    ? `<br><span style="color:${INK.soft};">Account title: ${e(inv.payTitle)}</span>`
    : ""
}`)}
${step(2, INK.plum, `Write your invoice number <b>${e(inv.number)}</b>, and your name, in the payment note.`)}
${step(3, INK.slate, `Send the receipt to <a href="mailto:${e(receipts)}" style="color:${INK.accent};">${e(receipts)}</a>${
  inv.payWhatsApp.trim() ? `, or on WhatsApp to <b>${e(inv.payWhatsApp)}</b>` : ""
}.`)}
</table>
<p style="margin:4px 0 0;padding-top:10px;border-top:1px dashed ${INK.rule};font:400 13px/1.55 ${SANS};color:${INK.soft};">Your copy is confirmed once the receipt is received${
  inv.dispatch.trim() ? `, and dispatched ${e(inv.dispatch.charAt(0).toLowerCase() + inv.dispatch.slice(1))}` : ""
}.</p>
</td></tr></table>
</td></tr>

<!-- where it is going -->
${shipTo
  ? `<tr><td style="padding:20px 28px 0;">
${heading("Ship to", INK.plum)}
<div style="font:400 14px/1.65 ${SANS};color:${INK.text};">${shipTo}</div>
${inv.customerPhone.trim() ? `<p style="margin:8px 0 0;font:400 13px/1.5 ${SANS};color:${INK.soft};">WhatsApp: <span dir="ltr">${e(inv.customerPhone)}</span></p>` : ""}
${inv.deliveryNote.trim() ? `<p style="margin:4px 0 0;font:italic 400 13px/1.5 ${SANS};color:${INK.faint};">Note: ${e(inv.deliveryNote)}</p>` : ""}
</td></tr>`
  : ""}

<!-- the thanks -->
<tr><td style="padding:22px 28px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK.deep};">
<tr><td style="padding:20px 22px;">
<p style="margin:0 0 8px;font:600 22px/1.15 ${SERIF};color:#FFFFFF;">Thank you for your order</p>
<p style="margin:0;font:400 14px/1.6 ${SANS};color:#E4E1EE;">Thank you for choosing to climb <i>${e(F.title)}</i> with me. Every copy ordered means a great deal, and I truly hope this story stays with you long after the last page.</p>
<p style="margin:14px 0 0;font:400 17px/1.2 ${SERIF};color:#FFFFFF;">Saadan</p>
</td></tr></table>
</td></tr>

<!-- the foot -->
<tr><td style="padding:22px 28px 26px;">
<div style="height:1px;background:${INK.rule};font-size:0;line-height:0;margin:0 0 14px;">&nbsp;</div>
<p style="margin:0;font:600 12px/1.6 ${SANS};color:${INK.text};">${e(F.title)} · M. A. Saadan Qasmani · ISBN ${e(F.isbn)}</p>
<p style="margin:3px 0 0;font:400 12px/1.6 ${SANS};color:${INK.soft};">Questions about your order? WhatsApp ${e(F.whatsapp)} · <a href="${e(novel)}" style="color:${INK.soft};">${e(F.site)}</a></p>
<p style="margin:3px 0 0;font:400 12px/1.6 ${SANS};color:${INK.faint};">© 2026 M. A. Saadan Qasmani. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // A line that has nothing in it is dropped; a blank line put there on
  // purpose is not. So "nothing" is null here and "" is a paragraph break.
  const line = (label: string, value: string) => (value.trim() ? `${label}: ${value}` : null);
  const only = (value: string, text: string) => (value.trim() ? text : null);

  const text = [
    `INVOICE ${inv.number}`,
    F.title + " · M. A. Saadan Qasmani",
    "",
    line("Date issued", inv.issued),
    line("Payment due", inv.due),
    line("Status", inv.status),
    "",
    `Dear ${inv.customerName || "reader"},`,
    "",
    `Thank you for ordering ${F.title}. Your invoice is below, and so is the one thing still left to do: the payment.`,
    "",
    line("Copies", inv.quantity),
    line("Price per copy", inv.unitPrice),
    line("Subtotal", inv.subtotal),
    only(inv.promoCode, `Promo code ${inv.promoCode}: − ${inv.discount}`),
    line(inv.deliveryLabel || "Delivery", inv.delivery),
    line("TOTAL DUE", inv.total),
    "",
    "HOW TO PAY",
    `1. ${inv.payHow}: ${inv.payNumber}${inv.payTitle.trim() ? ` (account title: ${inv.payTitle})` : ""}`,
    `2. Write your invoice number ${inv.number}, and your name, in the payment note.`,
    `3. Send the receipt to ${receipts}${inv.payWhatsApp.trim() ? `, or on WhatsApp to ${inv.payWhatsApp}` : ""}.`,
    "",
    only(inv.due, `Please send it by ${inv.due} so your copy is held and goes out with the first dispatch.`),
    "",
    only(
      [inv.addressLine1, inv.addressLine2, inv.addressCity].filter((v) => v.trim()).join(", "),
      `Shipping to: ${[inv.addressLine1, inv.addressLine2, inv.addressCity].filter((v) => v.trim()).join(", ")}`
    ),
    "",
    `Thank you for choosing to climb ${F.title} with me. Every copy ordered means a great deal, and I truly hope this story stays with you long after the last page.`,
    "",
    "Saadan",
    novel,
  ]
    .filter((v) => v !== null)
    .join("\n");

  return { to, subject, html, text, replyTo: receipts };
}
