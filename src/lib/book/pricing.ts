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
 * What a code is worth.
 *
 * Two things, independently: money off the book, and the postage. Most
 * codes do one of them. One does both, which is the whole reason this is a
 * pair of fields rather than a kind.
 */
export type Offer = {
  code: string;
  /** Money off the book, as a percentage. Zero for a postage-only code. */
  percentOff: number;
  /** Whether it also takes the postage away. */
  freeShipping: boolean;
};

/**
 * The standing code: a tenth off in Pakistan, where postage is not charged,
 * and the postage in Türkiye, where it is. Either can be retired without a
 * deploy by setting its own variable, and setting BOOK_PROMO_CODE alone
 * changes both at once.
 */
function houseCode(region: Region): string {
  const perRegion = region === "pk" ? process.env.BOOK_PROMO_CODE_PK : process.env.BOOK_PROMO_CODE_TR;
  return (perRegion || process.env.BOOK_PROMO_CODE || "SADDYDADDY19").trim().toUpperCase();
}

/**
 * Every code a region will take, in the order they are tried.
 *
 * A region can have more than one, worth different things. FARUKHOCA is
 * Faruk Hoca's, for Türkiye: a fifth off the book and the postage as well.
 * It is written here rather than in an environment variable because it is
 * one person's code and retiring it is a change worth seeing in the diff.
 */
function offersFor(region: Region): Offer[] {
  const spec = REGIONS[region];
  const house: Offer[] =
    spec.promo === "none"
      ? []
      : [
          {
            code: houseCode(region),
            percentOff: spec.promo === "percent" ? spec.percentOff : 0,
            freeShipping: spec.promo === "shipping",
          },
        ];

  if (region === "tr") {
    return [...house, { code: "FARUKHOCA", percentOff: 20, freeShipping: true }];
  }
  return house;
}

/** The code a reader typed, if the region takes it. */
function offerFor(region: Region, typed: string): Offer | null {
  const want = typed.trim().toUpperCase();
  if (!want) return null;
  return offersFor(region).find((o) => o.code === want) ?? null;
}

/** Every code live right now, for the readiness screen. */
export function liveCodes(region: Region): Offer[] {
  return offersFor(region);
}

/** The region's standing code, for anything that wants just the one. */
export function liveCode(region: Region): string {
  return houseCode(region);
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
  /** "percent", "shipping", "both", or the region's own when nothing applied. */
  promoKind: string;
  percentOff: number;
  /** The code that was accepted, so the order is filed under the right one. */
  promoCode: string | null;
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
  const offer = offerFor(region, typed);
  const promoApplied = offer !== null;

  const subtotal = round(spec.price * quantity, spec.currency);
  const discount = offer && offer.percentOff > 0
    ? round((subtotal * offer.percentOff) / 100, spec.currency)
    : 0;
  const shippingWaived = Boolean(offer?.freeShipping) && spec.shipping > 0;
  const shipping = shippingWaived ? 0 : spec.shipping;

  // What the reader is told their code did. A code that does both gets its
  // own word, because being told only half of what you were given reads as
  // the other half having failed.
  const kind = !offer
    ? spec.promo
    : offer.percentOff > 0 && offer.freeShipping
      ? "both"
      : offer.percentOff > 0
        ? "percent"
        : "shipping";

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
    promoRejected: offersFor(region).length > 0 && typed.length > 0 && !promoApplied,
    promoKind: kind,
    percentOff: offer ? offer.percentOff : spec.percentOff,
    promoCode: offer ? offer.code : null,
  };
}

/** The code as it should be stored against an order: the real one, or nothing. */
export function storedCode(quote: Quote): string | null {
  return quote.promoCode;
}
