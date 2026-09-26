/**
 * Where the book is sold, and on what terms.
 *
 * Three places, three currencies, three ways of settling up, and the rules
 * differ enough that one price and one promo rule could not describe them.
 * This module holds the shape of that and nothing secret: the page imports
 * it to print a price, so the codes themselves live next door in pricing.ts,
 * which never reaches a browser.
 */

export type Region = "pk" | "tr" | "world";

/** What a code is worth, which is not the same thing in both countries. */
export type PromoKind = "percent" | "shipping" | "none";

/** How the money actually arrives. */
export type Settle = "by-hand" | "online" | "amazon";

export type RegionSpec = {
  id: Region;
  currency: "PKR" | "TRY" | "USD";
  /** Cover price of one copy, in that currency. */
  price: number;
  /** Charged once on the order, not per copy. Shown only at the end. */
  shipping: number;
  promo: PromoKind;
  percentOff: number;
  settle: Settle;
};

export const REGIONS: Record<Region, RegionSpec> = {
  pk: {
    id: "pk",
    currency: "PKR",
    price: 3000,
    shipping: 0,
    promo: "percent",
    percentOff: 10,
    settle: "by-hand",
  },
  tr: {
    id: "tr",
    currency: "TRY",
    price: 799,
    // Held back until the order is being placed, because a shipping line
    // beside a cover price reads as part of the price of the book.
    shipping: 180,
    promo: "shipping",
    percentOff: 0,
    settle: "online",
  },
  world: {
    id: "world",
    currency: "USD",
    price: 15.99,
    shipping: 0,
    promo: "none",
    percentOff: 0,
    settle: "amazon",
  },
};

export function isRegion(value: unknown): value is Region {
  return value === "pk" || value === "tr" || value === "world";
}

const SYMBOLS: Record<RegionSpec["currency"], string> = {
  PKR: "PKR ",
  TRY: "₺",
  USD: "$",
};

/**
 * Money as each country writes it: rupees in whole numbers with a thousands
 * separator, lira and dollars to the cent. Grouping is forced to en-US so a
 * German reader and a Turkish one are quoted the same figure rather than a
 * figure that changes shape with the page they happen to be reading.
 */
export function money(currency: RegionSpec["currency"], amount: number): string {
  const n = new Intl.NumberFormat("en-US", {
    // A round figure is written round: 799 lira, not 799.00. Cents appear
    // when there are cents, which is what 15.99 needs and 3,000 does not.
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(amount);
  return `${SYMBOLS[currency]}${n}`;
}

export function priceOf(region: Region): string {
  const spec = REGIONS[region];
  return money(spec.currency, spec.price);
}
