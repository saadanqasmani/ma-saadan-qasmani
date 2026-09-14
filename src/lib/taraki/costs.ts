/**
 * The total cost of a degree, added up honestly.
 *
 * THE PROBLEM THIS SOLVES. Families are quoted tuition and decide on it.
 * Tuition is routinely less than half of what the years actually cost, and
 * the parts nobody quotes are the parts that end a degree halfway through:
 * rent over the summer, a visa renewal, a flight home when someone dies,
 * the year the currency moves.
 *
 * THE RULE, unchanged from the rest of the data. A figure we hold with a
 * source is shown with that source and marked for what it is: an official
 * minimum a government has published, a range somebody surveyed, or an
 * estimate. Everything else is asked of the student and labelled as their
 * own number, never filled in with a plausible average. An invented default
 * here would be indistinguishable, to a reader, from a researched one.
 *
 * The one number that is not an estimate at all is proof of funds: a
 * government's published requirement, which decides whether a visa is
 * granted regardless of what anything actually costs. It is kept separate
 * for that reason.
 */

import type { Country, Figure, Money } from "@/content/taraki/countries";

/** Every line the brief asks for, in the order a family meets them. */
export type LineId =
  | "tuition"
  | "accommodation"
  | "food"
  | "transport"
  | "insurance"
  | "visa"
  | "books"
  | "internet"
  | "personal"
  | "travel"
  | "documentation";

export type Line = {
  id: LineId;
  label: string;
  /** What it covers, in words a seventeen year old has not heard before. */
  note: string;
  /** True where the figure is per month in the source and must be annualised. */
  monthly?: boolean;
};

export const LINES: Line[] = [
  { id: "tuition", label: "Tuition", note: "The fee the university charges for the year." },
  { id: "accommodation", label: "Housing", note: "Rent for twelve months, not nine. Most contracts do not pause for the summer.", monthly: true },
  { id: "food", label: "Food", note: "Eating, at home and not at home.", monthly: true },
  { id: "transport", label: "Transport", note: "Getting to class and around the city. Many countries have a student rate." },
  { id: "insurance", label: "Health insurance", note: "Compulsory in most of these countries, and checked at the visa stage." },
  { id: "visa", label: "Visa and residence", note: "The permit, and renewing it, which is usually every year." },
  { id: "books", label: "Books and equipment", note: "Higher for architecture, design, medicine and anything with a studio or a lab coat." },
  { id: "internet", label: "Phone and internet", note: "A local number is usually needed before a bank account is." },
  { id: "personal", label: "Personal", note: "Clothes, a haircut, a coffee, a life. Leaving this at zero is how budgets fail." },
  { id: "travel", label: "Flights home", note: "Per year. Be honest about how often you will want to come back." },
  { id: "documentation", label: "Documents", note: "Attestation, translation, couriering and the equivalence paperwork." },
];

export type Entry = {
  /** What the student or the source says this costs, per year, in `currency`. */
  amount: number;
  /** Where the number came from. The interface never blurs these two. */
  from: "sourced" | "yours";
  figure?: Figure;
};

export type Plan = {
  countryCode: string;
  /** The currency everything below is counted in. */
  currency: string;
  years: number;
  /** Per year, in `currency`. */
  scholarship: number;
  /** What the family can put in per year, in `currency`. */
  budget: number | null;
  /** The student's own assumption, as a percentage. Not a forecast. */
  inflation: number;
  lines: Record<LineId, number>;
};

export function emptyLines(): Record<LineId, number> {
  return LINES.reduce(
    (acc, l) => ({ ...acc, [l.id]: 0 }),
    {} as Record<LineId, number>,
  );
}

/** The midpoint of a range, or the single figure. */
function amountOf(f: Figure): number {
  if (!f.high) return f.low.amount;
  return Math.round((f.low.amount + f.high.amount) / 2);
}

/**
 * What we can fill in for a country, and what we cannot.
 *
 * Returns only the lines we actually hold a source for. Everything else is
 * left at zero for the student to fill, because a blank the reader has to
 * complete is honest and a guess dressed as data is not.
 */
export function prefill(country: Country): { lines: Partial<Record<LineId, Entry>>; currency: string | null } {
  const out: Partial<Record<LineId, Entry>> = {};
  let currency: string | null = null;

  const put = (id: LineId, f: Figure | null, monthly: boolean) => {
    if (!f) return;
    currency ??= f.low.currency;
    // Mixing currencies in one total would be worse than leaving the line
    // blank, so a figure quoted in another currency is skipped rather than
    // converted at a rate nobody can defend.
    if (f.low.currency !== currency) return;
    out[id] = { amount: amountOf(f) * (monthly ? 12 : 1), from: "sourced", figure: f };
  };

  put("tuition", country.costs.tuition, false);
  put("accommodation", country.costs.accommodation, true);
  put("food", country.costs.food, true);

  return { lines: out, currency };
}

export type Totals = {
  /** Every line added up, for one year, before any scholarship. */
  perYear: number;
  /** All years, with the student's own inflation assumption applied. */
  whole: number;
  /** After the scholarship, across all years. */
  afterScholarship: number;
  /** What the family said they can put in, across all years. */
  budgetTotal: number | null;
  /** The hole. Positive means short by this much. */
  gap: number | null;
  /** Which lines are still zero, so the total can say it is incomplete. */
  blank: LineId[];
};

export function totalsFor(plan: Plan): Totals {
  const perYear = LINES.reduce((n, l) => n + (plan.lines[l.id] || 0), 0);

  // Inflation compounds year on year. It is the student's own assumption and
  // the interface says so; the point is to show that the last year of a five
  // year degree does not cost what the first one did.
  const rate = plan.inflation / 100;
  let whole = 0;
  for (let y = 0; y < plan.years; y += 1) whole += perYear * (1 + rate) ** y;
  whole = Math.round(whole);

  const afterScholarship = Math.max(0, whole - plan.scholarship * plan.years);
  const budgetTotal = plan.budget === null ? null : plan.budget * plan.years;
  const gap = budgetTotal === null ? null : Math.round(afterScholarship - budgetTotal);
  const blank = LINES.filter((l) => !plan.lines[l.id]).map((l) => l.id);

  return { perYear: Math.round(perYear), whole, afterScholarship: Math.round(afterScholarship), budgetTotal, gap, blank };
}

export function money(amount: number, currency: string): string {
  return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
}

export function moneyOf(m: Money): string {
  return money(m.amount, m.currency);
}

export const KIND_LABEL: Record<Figure["kind"], string> = {
  "official-minimum": "Official minimum",
  "published-range": "Published range",
  estimate: "Estimate",
};
