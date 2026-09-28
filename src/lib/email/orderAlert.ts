/**
 * The note that tells Saadan an order has come in.
 *
 * Pakistan and Türkiye are settled by hand: somebody reserves copies and
 * then waits for a message with a bank account or an EasyPaisa number. That
 * message is the product. An order nobody is told about is an order that
 * never gets one, and the reader's own confirmation has already promised
 * that it will — so this letter is not a nicety, it is the other half of
 * the promise.
 *
 * Written to be acted on from a phone, in the order the action needs: what
 * they want, what it comes to, where it goes, and how to reach them. The
 * address is in it so a shipping quote can be worked out without opening
 * anything, and the reader's own email is the reply-to so answering the
 * alert answers the reader.
 */

import { highestBranch } from "@/content/site";
import { moneyIn } from "@/lib/book/regions";
import { siteUrl } from "@/lib/siteUrl";
import { adminEmails } from "@/lib/supabase/env";
import type { Mail } from "@/lib/email/send";
import type { OrderKind, OrderLines } from "@/lib/email/order";

/**
 * Where the alert goes. ORDER_ALERT_EMAIL wins so that orders can be sent
 * somewhere other than the address that signs into the dashboard; otherwise
 * the first admin address, which is already set for the site to work at all.
 */
export function alertAddress(): string | null {
  const explicit = (process.env.ORDER_ALERT_EMAIL ?? "").trim();
  if (explicit) return explicit;
  return adminEmails[0] ?? null;
}

export type Alert = {
  kind: OrderKind;
  id: string | null;
  name: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  address: string;
  quantity: number;
  lines: OrderLines | null;
  message?: string;
  /** The language the reader was reading in, so a reply can match it. */
  locale: string;
  /** True when the order went in without its money columns. */
  degraded?: boolean;
};

const HEADLINE: Record<OrderKind, string> = {
  reserved: "New pre-order",
  paid: "Paid pre-order",
  quote: "Print-to-order request",
};

const WHAT_TO_DO: Record<OrderKind, string> = {
  reserved: "Send payment instructions. They have been told to expect them from you.",
  paid: "Nothing is owed. Ship it on publication.",
  quote: "Work out the postage to this address and write back with a price. No price has been quoted.",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** The summary line a phone shows before the letter is opened. */
export function alertSubject(alert: Alert): string {
  const what = `${alert.quantity} cop${alert.quantity === 1 ? "y" : "ies"}`;
  const where = alert.city ? `${alert.city}, ${alert.country}` : alert.country;
  const total = alert.lines ? ` · ${moneyIn(alert.lines.currency, alert.lines.total)}` : "";
  return `${HEADLINE[alert.kind]}: ${what} to ${where}${total}`;
}

export function orderAlertEmail(alert: Alert): Mail | null {
  const to = alertAddress();
  if (!to) return null;

  const l = alert.lines;
  const rows: [string, string][] = [
    ["Name", alert.name],
    ["Email", alert.email],
    ...(alert.phone ? ([["Phone", alert.phone]] as [string, string][]) : []),
    ["Copies", String(alert.quantity)],
    ...(l
      ? ([
          ["Per copy", moneyIn(l.currency, l.unit)],
          ...(l.discount > 0 ? ([["Discount", `− ${moneyIn(l.currency, l.discount)}`]] as [string, string][]) : []),
          ...(l.shipping > 0 ? ([["Postage", moneyIn(l.currency, l.shipping)]] as [string, string][]) : []),
          ["Total", moneyIn(l.currency, l.total)],
          ["Code used", l.promoApplied ? "yes" : "no"],
        ] as [string, string][])
      : ([["Total", "not priced — this one is quoted by hand"]] as [string, string][])),
    ["Ships to", [alert.address, alert.city, alert.country].filter(Boolean).join(", ")],
    ["Reading in", alert.locale.toUpperCase()],
    ...(alert.id ? ([["Order", alert.id]] as [string, string][]) : []),
  ];

  const sans = "Helvetica, Arial, sans-serif";
  const orders = `${siteUrl}/admin/orders`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f3ee;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;">
<tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fffdf9;border:1px solid #e4ded3;">
<tr><td style="padding:28px 26px 0;">
<p style="margin:0 0 6px;font:400 11px/1 ${sans};letter-spacing:.18em;text-transform:uppercase;color:#9c3b1b;">${escapeHtml(HEADLINE[alert.kind])}</p>
<p style="margin:0 0 18px;font:700 20px/1.3 ${sans};color:#1b1a17;">${escapeHtml(alertSubject(alert).replace(/^[^:]+:\s*/, ""))}</p>
<p style="margin:0 0 20px;font:400 15px/1.6 ${sans};color:#1b1a17;">${escapeHtml(WHAT_TO_DO[alert.kind])}</p>
${alert.degraded ? `<p style="margin:0 0 20px;font:400 14px/1.6 ${sans};color:#9c3b1b;">The money columns are missing from the orders table, so the figures went into the notes rather than their own columns. Run the migrations.</p>` : ""}
</td></tr>
<tr><td style="padding:0 26px;"><div style="height:1px;background:#e4ded3;"></div></td></tr>
<tr><td style="padding:16px 26px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:5px 12px 5px 0;font:400 13px/1.5 ${sans};color:#6b655c;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:5px 0;font:400 14px/1.5 ${sans};color:#1b1a17;">${escapeHtml(v)}</td></tr>`
  )
  .join("\n")}
</table>
${alert.message ? `<p style="margin:16px 0 0;font:400 14px/1.6 ${sans};color:#1b1a17;"><span style="color:#6b655c;">They said:</span> ${escapeHtml(alert.message)}</p>` : ""}
</td></tr>
<tr><td style="padding:22px 26px 28px;">
<a href="${escapeHtml(orders)}" style="display:inline-block;background:#1b1a17;color:#fffdf9;text-decoration:none;font:600 13px/1 ${sans};padding:12px 18px;">Open it in the dashboard</a>
<p style="margin:14px 0 0;font:400 12px/1.6 ${sans};color:#9a9388;">Reply to this message and it goes to ${escapeHtml(alert.email)}.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  const text = [
    `${HEADLINE[alert.kind]} — ${highestBranch.title}`,
    "",
    WHAT_TO_DO[alert.kind],
    ...(alert.degraded ? ["", "The orders table is missing its money columns; the figures are in the notes. Run the migrations."] : []),
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ...(alert.message ? ["", `They said: ${alert.message}`] : []),
    "",
    orders,
  ].join("\n");

  return { to, subject: alertSubject(alert), html, text, replyTo: alert.email };
}
