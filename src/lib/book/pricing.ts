import "server-only";

/**
 * What a copy costs, and what a code takes off it.
 *
 * All of this stays on the server. A promo code checked in the browser is a
 * promo code printed in the page source, so the client never learns the code
 * or the rule: it sends what the reader typed and is told the price back.
 */

/** Cover price of one copy, in US dollars. */
export const BOOK_PRICE_USD = 15;

/** What the code is worth, as a percentage of the subtotal. */
export const PROMO_PERCENT = 10;

export const MAX_COPIES = 50;

/**
 * The code, overridable without a deploy. It is meant to be passed around
 * rather than kept, so the fallback is the one in use; setting
 * BOOK_PROMO_CODE in the host's environment retires it for a new one.
 */
function promoCode(): string {
  return (process.env.BOOK_PROMO_CODE || "SADDYDADDY19").trim().toUpperCase();
}

export type Quote = {
  quantity: number;
  /** Cover price of one copy. */
  unit: number;
  subtotal: number;
  discount: number;
  total: number;
  /** True when the code the reader typed is the code. */
  promoApplied: boolean;
  /** Set only when a code was typed and it was not the code. */
  promoRejected: boolean;
  percentOff: number;
};

/** Money to the cent, so a tenth of fifteen dollars does not arrive as 1.5000000000000002. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

export function quoteFor(quantityInput: unknown, codeInput?: string | null): Quote {
  const quantity = Math.min(MAX_COPIES, Math.max(1, Math.trunc(Number(quantityInput) || 1)));
  const typed = (codeInput ?? "").trim();
  const promoApplied = typed.length > 0 && typed.toUpperCase() === promoCode();
  const subtotal = round(BOOK_PRICE_USD * quantity);
  const discount = promoApplied ? round((subtotal * PROMO_PERCENT) / 100) : 0;

  return {
    quantity,
    unit: BOOK_PRICE_USD,
    subtotal,
    discount,
    total: round(subtotal - discount),
    promoApplied,
    promoRejected: typed.length > 0 && !promoApplied,
    percentOff: PROMO_PERCENT,
  };
}

/** The code as it should be stored against an order: the real one, or nothing. */
export function storedCode(quote: Quote): string | null {
  return quote.promoApplied ? promoCode() : null;
}
