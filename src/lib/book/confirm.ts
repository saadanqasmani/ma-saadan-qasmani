import "server-only";
import { orderEmail, type OrderKind, type OrderLines } from "@/lib/email/order";
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
};

export async function confirmOrder(order: Confirmation): Promise<void> {
  if (!mailIsConfigured()) {
    console.warn(
      `[order] no mail is configured, so ${order.email} was not sent a confirmation for ${order.id ?? "an order"}.`
    );
    return;
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
  } catch (error) {
    console.error(
      `[order] confirmation threw for ${order.id ?? "an order"}: ${error instanceof Error ? error.message : String(error)}`
    );
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
