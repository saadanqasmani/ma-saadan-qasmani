import "server-only";
import { orderEmail, type OrderKind, type OrderLines } from "@/lib/email/order";
import { alertAddress, orderAlertEmail } from "@/lib/email/orderAlert";
import { mailIsConfigured, sendMail } from "@/lib/email/send";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Send the reader their confirmation, and never let it break the order.
 *
 * One function so that all three ways of buying the book say the same thing
 * in the same voice, and so there is one place to look when somebody says
 * they did not get a letter.
 *
 * Every failure is swallowed and logged. A reader who ordered has ordered
 * whether or not the mail got out, and an order lost because Resend was
 * having an afternoon would be the worst trade on this whole site. The
 * order id goes into every log line, so an order that did not get its
 * letter can be found and the letter sent by hand.
 */

export type Confirmation = {
  kind: OrderKind;
  locale: Locale;
  id: string | null;
  name: string;
  email: string;
  country: string;
  city?: string;
  address: string;
  quantity: number;
  lines: OrderLines | null;
  phone?: string;
  message?: string;
  /** True when the order went in without its money columns. */
  degraded?: boolean;
  /**
   * False when the database refused the row entirely. The letters still go
   * out — an order that exists only in two inboxes is an order — and the
   * alert says so in its first line, because it is then the only copy.
   */
  recorded?: boolean;
  /** Why the database refused it, for the alert. */
  refusal?: string;
};

/** What got out. The caller decides what to tell the reader from this. */
export type Sent = { confirmed: boolean; alerted: boolean };

export async function confirmOrder(order: Confirmation): Promise<Sent> {
  if (!mailIsConfigured()) {
    console.warn(
      `[order] no mail is configured, so ${order.email} was not sent a confirmation for ${order.id ?? "an order"}.`
    );
    return { confirmed: false, alerted: false };
  }

  try {
    const mail = orderEmail({
      kind: order.kind,
      locale: order.locale,
      name: order.name,
      email: order.email,
      country: order.country,
      city: order.city,
      address: order.address,
      quantity: order.quantity,
      lines: order.lines,
      reference: order.id,
    });
    const sent = await sendMail(mail);
    if (sent.ok) {
      console.log(`[order] confirmation sent for ${order.id ?? "an order"} (${order.kind}).`);
    } else {
      console.error(
        `[order] confirmation NOT sent for ${order.id ?? "an order"} to ${order.email}: ${sent.reason}`
      );
    }

    // And the other half of the promise. Pakistan and Türkiye are settled by
    // hand, so an order nobody is told about is an order that never gets its
    // payment instructions — which the reader has just been promised.
    const alert = orderAlertEmail({
      kind: order.kind,
      id: order.id,
      name: order.name,
      email: order.email,
      phone: order.phone,
      country: order.country,
      city: order.city,
      address: order.address,
      quantity: order.quantity,
      lines: order.lines,
      message: order.message,
      locale: order.locale,
      degraded: order.degraded,
      recorded: order.recorded !== false,
      refusal: order.refusal,
    });

    if (!alert) {
      console.warn(
        `[order] nobody to alert about ${order.id ?? "an order"}: set ORDER_ALERT_EMAIL or ADMIN_EMAILS.`
      );
      return { confirmed: sent.ok, alerted: false };
    }

    const told = await sendMail(alert);
    if (told.ok) console.log(`[order] alert sent to ${alertAddress()} for ${order.id ?? "an order"}.`);
    else console.error(`[order] alert NOT sent for ${order.id ?? "an order"}: ${told.reason}`);

    return { confirmed: sent.ok, alerted: told.ok };
  } catch (error) {
    console.error(
      `[order] confirmation threw for ${order.id ?? "an order"}: ${error instanceof Error ? error.message : String(error)}`
    );
    return { confirmed: false, alerted: false };
  }
}

/** The language the reader was reading in, or English. */
export function localeOf(value: unknown): Locale {
  return typeof value === "string" && isLocale(value) ? value : defaultLocale;
}

/** The priced part of a quote, in the shape the letter wants. */
export function linesOf(quote: {
  currency: string;
  quantity: number;
  unit: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoApplied: boolean;
}): OrderLines {
  return {
    currency: quote.currency,
    quantity: quote.quantity,
    unit: quote.unit,
    subtotal: quote.subtotal,
    shipping: quote.shipping,
    discount: quote.discount,
    total: quote.total,
    promoApplied: quote.promoApplied,
  };
}

/**
 * The money as it was written down, for a letter sent later than the order.
 *
 * Returns null when the row has no money on it, which happens when the
 * order was filed before the pricing columns existed or when it degraded
 * into the notes. The letter reads perfectly well without a total; an
 * invented one would not.
 */
export function linesFromRow(row: Record<string, unknown>): OrderLines | null {
  const total = Number(row.total_usd);
  const unit = Number(row.unit_price_usd);
  if (!Number.isFinite(total) || !Number.isFinite(unit)) return null;

  const quantity = Number(row.quantity_priced ?? row.quantity) || 1;
  const shipping = Number(row.shipping_amount) || 0;
  const discount = Number(row.discount_usd) || 0;

  return {
    currency: String(row.currency ?? "USD") || "USD",
    quantity,
    unit,
    subtotal: unit * quantity,
    shipping,
    discount,
    total,
    promoApplied: Boolean(row.promo_code),
  };
}
