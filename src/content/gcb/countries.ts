/**
 * Destination countries, and what a year in each one costs.
 *
 * THE RULE FOR THIS FILE: no number without a source and a date.
 *
 * A seventeen-year-old in Lahore may pick a country off these figures and
 * ask a parent to commit a decade of savings to it. An invented number here
 * is not a rough guide, it is a family's money. So every figure carries
 * where it came from and when, `verified` says whether it has been checked
 * against the primary source rather than an aggregator, and a country with
 * nothing behind it stays `null` and renders as "being compiled" instead of
 * a guess.
 *
 * Official minimums beat estimates. A government's proof-of-funds figure is
 * a published requirement, not somebody's survey, and it is the number that
 * actually decides whether a visa is granted.
 */

export type Money = {
  amount: number;
  currency: "EUR" | "USD" | "CAD" | "AUD" | "GBP" | "TRY" | "CNY" | "MYR";
};

export type Figure = {
  /** A single number, or the ends of a published range. */
  low: Money;
  high?: Money;
  /** What kind of claim this is. The UI says which, every time. */
  kind: "official-minimum" | "published-range" | "estimate";
  source: string;
  url: string;
  /** ISO date the figure was read. */
  asOf: string;
  /** True only once checked against the issuing body, not an aggregator. */
  verified: boolean;
  note?: string;
};

export type CountryCosts = {
  /** Tuition for a non-EU/international undergraduate, per year. */
  tuition: Figure | null;
  /** What the government requires a student to show, per year. */
  proofOfFunds: Figure | null;
  /** Housing, per month, if a defensible figure exists. */
  accommodation: Figure | null;
  /** Food, per month. */
  food: Figure | null;
};

export type Country = {
  code: string;
  name: string;
  /** Shown on the card. Kept factual, never salesy. */
  summary: string | null;
  costs: CountryCosts;
  /** Filled in a later pass. Empty is honest; invented is not. */
  universities: [];
};

const empty: CountryCosts = {
  tuition: null,
  proofOfFunds: null,
  accommodation: null,
  food: null,
};

export const countries: Country[] = [
  {
    code: "DE",
    name: "Germany",
    summary:
      "Public universities charge no tuition in most states. The cost that decides it is the blocked account the visa requires.",
    costs: {
      tuition: {
        low: { amount: 0, currency: "EUR" },
        high: { amount: 1500, currency: "EUR" },
        kind: "published-range",
        source: "Study.eu, Tuition fees at universities in Europe",
        url: "https://www.study.eu/article/tuition-fees-at-universities-in-europe",
        asOf: "2026-09-14",
        verified: false,
        note: "No tuition at public universities in most states; Baden-Württemberg charges €1,500 a year to non-EU students. Semester contribution of €70–€430 applies either way.",
      },
      proofOfFunds: {
        low: { amount: 11904, currency: "EUR" },
        kind: "official-minimum",
        source: "German blocked account (Sperrkonto) requirement",
        url: "https://www.visaflow.app/blog/proof-of-finances-germany-student-visa-2026",
        asOf: "2026-09-14",
        verified: false,
        note: "€992 a month, released monthly after arrival. Confirm against the Auswärtiges Amt before this is shown to a student.",
      },
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "NL",
    name: "Netherlands",
    summary: "English-taught bachelor's degrees are common. Tuition for non-EU students is not.",
    costs: {
      tuition: {
        low: { amount: 6000, currency: "EUR" },
        high: { amount: 12000, currency: "EUR" },
        kind: "published-range",
        source: "Study.eu, Tuition fees at universities in Europe",
        url: "https://www.study.eu/article/tuition-fees-at-universities-in-europe",
        asOf: "2026-09-14",
        verified: false,
      },
      proofOfFunds: null,
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "FR",
    name: "France",
    summary:
      "Public tuition is set nationally. Non-EU students pay a differentiated rate that many universities waive.",
    costs: {
      tuition: {
        low: { amount: 2902, currency: "EUR" },
        high: { amount: 3950, currency: "EUR" },
        kind: "published-range",
        source: "Study.eu, Tuition fees at universities in Europe",
        url: "https://www.study.eu/article/tuition-fees-at-universities-in-europe",
        asOf: "2026-09-14",
        verified: false,
        note: "€2,902 bachelor, €3,950 master for non-EU students. Many institutions exempt students down to the EU rate of €170–€650; whether yours does is the single biggest variable in this country.",
      },
      proofOfFunds: null,
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "IT",
    name: "Italy",
    summary: "Tuition is means-tested against family income, so the published range is wide for a reason.",
    costs: {
      tuition: {
        low: { amount: 0, currency: "EUR" },
        high: { amount: 5000, currency: "EUR" },
        kind: "published-range",
        source: "Study.eu, Tuition fees at universities in Europe",
        url: "https://www.study.eu/article/tuition-fees-at-universities-in-europe",
        asOf: "2026-09-14",
        verified: false,
        note: "Public universities scale fees to declared family income. A low-income international student can pay nothing.",
      },
      proofOfFunds: null,
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "ES",
    name: "Spain",
    summary: "Among the lowest public tuition in Western Europe.",
    costs: {
      tuition: {
        low: { amount: 750, currency: "EUR" },
        high: { amount: 2100, currency: "EUR" },
        kind: "published-range",
        source: "Study.eu, Tuition fees at universities in Europe",
        url: "https://www.study.eu/article/tuition-fees-at-universities-in-europe",
        asOf: "2026-09-14",
        verified: false,
      },
      proofOfFunds: null,
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "CA",
    name: "Canada",
    summary: "The visa requires a year of tuition plus a set living allowance, proven in advance.",
    costs: {
      tuition: null,
      proofOfFunds: {
        low: { amount: 20635, currency: "CAD" },
        kind: "official-minimum",
        source: "IRCC study permit financial requirement",
        url: "https://prodigyfinance.com/resources/blog/proof-of-funds-for-2026-f-1-us-germany-and-canada/",
        asOf: "2026-09-14",
        verified: false,
        note: "Living costs only, on top of the first year's tuition. Confirm against IRCC directly.",
      },
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  {
    code: "AU",
    name: "Australia",
    summary: "The visa requires twelve months of fees plus a set living allowance.",
    costs: {
      tuition: null,
      proofOfFunds: {
        low: { amount: 29710, currency: "AUD" },
        kind: "official-minimum",
        source: "Department of Home Affairs student visa financial capacity",
        url: "https://prodigyfinance.com/resources/blog/proof-of-funds-for-2026-f-1-us-germany-and-canada/",
        asOf: "2026-09-14",
        verified: false,
        note: "Living costs only, on top of twelve months of fees. Confirm against Home Affairs directly.",
      },
      accommodation: null,
      food: null,
    },
    universities: [],
  },
  // Named in the brief, nothing sourced yet. They render as pending rather
  // than as a plausible number nobody checked.
  { code: "US", name: "United States", summary: null, costs: empty, universities: [] },
  { code: "BE", name: "Belgium", summary: null, costs: empty, universities: [] },
  { code: "TR", name: "Türkiye", summary: null, costs: empty, universities: [] },
  { code: "CN", name: "China", summary: null, costs: empty, universities: [] },
  { code: "MY", name: "Malaysia", summary: null, costs: empty, universities: [] },
];

export function hasAnyCosts(c: Country): boolean {
  return Object.values(c.costs).some(Boolean);
}

export const sourcedCount = countries.filter(hasAnyCosts).length;
