import "server-only";
import { REGIONS, type Region } from "@/lib/book/regions";

/**
 * What an order comes to, and what a code takes off it.
 *
 * All of this stays on the server. A code checked in the browser is a code
 * printed in the page source and a discount anyone can award themselves, so
 * the client never learns the code or the rule: it sends what the reader
 * typed and is told the price back.
 */

export const MAX_COPIES = 50;

/**
 * One code, doing the locally useful thing: a tenth off in Pakistan, where
 * shipping is not charged, and the shipping in Türkiye, where it is. Either
 * can be retired without a deploy by setting its own variable, and setting
 * BOOK_PROMO_CODE alone changes both at once.
 */
function codeFor(region: Region): string {
  const perRegion = region === "pk" ? process.env.BOOK_PROMO_CODE_PK : process.env.BOOK_PROMO_CODE_TR;
  return (perRegion || process.env.BOOK_PROMO_CODE || "SADDYDADDY19").trim().toUpperCase();
}

/** What the code is right now, for the readiness screen. */
export function liveCode(region: Region): string {
  return codeFor(region);
}

export type Quote = {
  region: Region;
  currency: string;
  quantity: number;
  unit: number;
  subtotal: number;
  /** What postage costs before any code is applied. */
  shipping: number;
  /** True when a code took the postage away rather than money off the book. */
  shippingWaived: boolean;
  discount: number;
  total: number;
  promoApplied: boolean;
  promoRejected: boolean;
  promoKind: string;
  percentOff: number;
};

/**
 * Money, rounded the way the currency is actually quoted.
 *
 * Dollars go to the cent, so a tenth of a price does not arrive as
 * 299.99999. Rupees and lira are quoted whole in this shop and printed
 * whole on the page, so they are rounded whole here too: ten per cent off
 * 2,999 is 300, not 299.90, and the total is 2,699 rather than a figure
 * with a tenth of a rupee in it that no one can hand over.
 */
function round(n: number, currency: Quote["currency"]): number {
  if (currency === "USD") return Math.round(n * 100) / 100;
  return Math.round(n);
}

export function quoteFor(region: Region, quantityInput: unknown, codeInput?: string | null): Quote {
  const spec = REGIONS[region];
  const quantity = Math.min(MAX_COPIES, Math.max(1, Math.trunc(Number(quantityInput) || 1)));
  const typed = (codeInput ?? "").trim();
  const promoApplied = spec.promo !== "none" && typed.length > 0 && typed.toUpperCase() === codeFor(region);

  const subtotal = round(spec.price * quantity, spec.currency);
  const discount =
    promoApplied && spec.promo === "percent"
      ? round((subtotal * spec.percentOff) / 100, spec.currency)
      : 0;
  const shippingWaived = promoApplied && spec.promo === "shipping";
  const shipping = shippingWaived ? 0 : spec.shipping;

  return {
    region,
    currency: spec.currency,
    quantity,
    unit: spec.price,
    subtotal,
    shipping,
    shippingWaived,
    discount,
    total: round(subtotal - discount + shipping, spec.currency),
    promoApplied,
    promoRejected: spec.promo !== "none" && typed.length > 0 && !promoApplied,
    promoKind: spec.promo,
    percentOff: spec.percentOff,
  };
}

/** The code as it should be stored against an order: the real one, or nothing. */
export function storedCode(quote: Quote): string | null {
  return quote.promoApplied ? codeFor(quote.region) : null;
}
