import { formatDate } from "@/components/admin/ui";
import { moneyIn } from "@/lib/book/regions";

/**
 * How one cell of an order is read out.
 *
 * This exists because of a single quiet lie on the orders screen. The money
 * columns are named `total_usd` and `unit_price_usd` — they were written
 * when there was one price in one currency — and they now hold rupees,
 * lira or dollars depending on where the reader was. A Pakistani order for
 * two copies was showing as "6000" under a heading that said USD, which is
 * a number somebody could act on and be wrong by two orders of magnitude.
 *
 * So money is never printed without the currency that is stored beside it in
 * the same row, and the column that says which of the three shops an order
 * came through is printed in words rather than as `pk`.
 */

export type CellFormat = "plain" | "date" | "money" | "region" | "regionLong" | "status";

export type Column = {
  name: string;
  label: string;
  format?: CellFormat;
  /** For money: the column in the same row holding its currency. */
  currencyFrom?: string;
};

/**
 * How the order is settled, in the list. The country has its own column, so
 * this says the arrangement rather than repeating the place.
 */
export const REGION_LABEL: Record<string, string> = {
  pk: "By hand",
  tr: "Card or by hand",
  world: "Print to order",
};

/** The same thing on the record itself, where there is room to say it. */
export const REGION_MEANS: Record<string, string> = {
  pk: "Pakistan · settled by hand, no card taken",
  tr: "Türkiye · card online, or settled by hand",
  world: "Print to order · Amazon does not reach them, nothing priced yet",
};

/**
 * Money exactly as the shop itself writes it: one formatter behind the
 * purchase page, the admin screens and the confirmation letters, so a price
 * a reader was quoted and a price Saadan reads back are the same string.
 */
export const money = (amount: number, currency: string) => moneyIn(currency, amount);

export function formatCell(row: Record<string, unknown>, column: Column): string {
  const value = row[column.name];

  if (column.format === "region" || column.format === "regionLong") {
    const key = String(value ?? "");
    if (!key) return "";
    const map = column.format === "region" ? REGION_LABEL : REGION_MEANS;
    return map[key] ?? key;
  }

  if (column.format === "money") {
    if (value === null || value === undefined || value === "") return "";
    const amount = Number(value);
    if (!Number.isFinite(amount)) return String(value);
    // No currency on the row means the order predates the three-shop split,
    // when everything was in dollars.
    const currency = String(row[column.currencyFrom ?? "currency"] ?? "USD") || "USD";
    return money(amount, currency);
  }

  if (column.format === "date" || column.name.includes("_at")) {
    return formatDate(value as string);
  }

  return value === null || value === undefined ? "" : String(value);
}
