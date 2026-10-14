import { moneyIn } from "@/lib/book/regions";

/**
 * An invoice, as the printed one is laid out.
 *
 * Every line on the page is a field here, and every field is editable in the
 * admin before it is sent. The order fills them in; nothing is computed at
 * the moment of sending, because an invoice that quietly recalculates itself
 * is an invoice that can disagree with the one already in somebody's inbox.
 */
export type Invoice = {
  number: string;
  issued: string;
  due: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string;

  addressLine1: string;
  addressLine2: string;
  addressCity: string;
  deliveryNote: string;

  placed: string;
  status: string;
  dispatch: string;

  quantity: string;
  unitPrice: string;
  amount: string;
  subtotal: string;
  promoCode: string;
  discount: string;
  /** "Delivery within Pakistan", or wherever this one is going. */
  deliveryLabel: string;
  delivery: string;
  total: string;

  /** The sentence above the account number: Easypaisa here, a transfer there. */
  payHow: string;
  payNumber: string;
  payTitle: string;
  payEmail: string;
  payWhatsApp: string;
};

/** Every field on the invoice, which is also every field the client may send. */
export const INVOICE_FIELDS = [
  "number", "issued", "due",
  "customerName", "customerPhone", "customerEmail",
  "addressLine1", "addressLine2", "addressCity", "deliveryNote",
  "placed", "status", "dispatch",
  "quantity", "unitPrice", "amount", "subtotal", "promoCode", "discount",
  "deliveryLabel", "delivery", "total",
  "payHow", "payNumber", "payTitle", "payEmail", "payWhatsApp",
] as const satisfies readonly (keyof Invoice)[];

/** The parts that are the same on every invoice, so they are written once. */
export const INVOICE_FIXED = {
  author: "M. A. SAADAN QASMANI",
  title: "The Highest Branch",
  tagline: "Because up is where things fall from.",
  edition: "A novel by M. A. Saadan Qasmani · Paperback, first edition",
  isbn: "9798172595363",
  site: "saadanqasmani.com",
  email: "qasmanisaadan@gmail.com",
  whatsapp: "+92 305 2497757",
} as const;

/** The palette the printed invoice is set in. */
export const INK = {
  paper: "#FBFAF6",
  text: "#22223A",
  soft: "#5C5C74",
  faint: "#6A6A80",
  rule: "#D9D5E3",
  accent: "#3B3D7A",
  deep: "#2E2F5E",
  plum: "#6E5577",
  slate: "#4F6670",
  green: "#3E5A2E",
  tint: "#EFEDF5",
} as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "14 October 2026", which is how the printed invoice writes a date. */
export function invoiceDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Payment is asked for a week after the invoice is issued. */
function plusDays(value: Date | string | null | undefined, days: number): string {
  if (!value) return "";
  const d = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + days);
  return invoiceDate(d);
}

/**
 * The invoice number.
 *
 * Taken from the order's own id rather than a counter, so two invoices can
 * never collide and the number can be traced back to a row without a lookup
 * table. Editable afterwards, for anyone who would rather number by hand.
 */
export function invoiceNumber(id: string | null | undefined): string {
  const stem = (id ?? "").replace(/-/g, "").slice(0, 6).toUpperCase();
  return stem ? `THB-${stem}` : "THB-000";
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Where the money is to be sent, as the invoice prints it. */
export type InvoicePayee = {
  /** The sentence above the number. */
  how: string;
  /** The account itself: an Easypaisa number, an IBAN. */
  value: string;
  holder: string;
};

/**
 * An order, as an invoice.
 *
 * Everything here is a starting point. The admin sees it filled in and can
 * change any of it before anything is downloaded or sent. The payee is
 * passed in rather than read from here, because account numbers live in one
 * server-only module and this one is imported by the browser.
 */
export function invoiceFromOrder(
  row: Record<string, unknown>,
  payee?: InvoicePayee | null
): Invoice {
  const currency = String(row.currency ?? "PKR") || "PKR";
  const qty = num(row.quantity_priced) || num(row.quantity) || 1;
  const unit = num(row.unit_price_usd);
  const discount = num(row.discount_usd);
  const shipping = num(row.shipping_amount);
  const total = num(row.total_usd);
  const subtotal = unit * qty;

  const address = String(row.shipping_address ?? "").split("\n");
  const paid = String(row.payment_status ?? "") === "paid";
  const country = String(row.country ?? "").trim();

  return {
    number: invoiceNumber(String(row.id ?? "")),
    issued: invoiceDate(new Date()),
    due: plusDays(new Date(), 7),

    customerName: String(row.full_name ?? ""),
    customerPhone: String(row.phone ?? ""),
    customerEmail: String(row.email ?? ""),

    addressLine1: address[0] ?? "",
    addressLine2: address.slice(1).join(", "),
    addressCity: [String(row.city ?? ""), country].filter(Boolean).join(", "),
    deliveryNote: String(row.message ?? ""),

    placed: invoiceDate(row.created_at as string),
    status: paid ? "Paid" : "Awaiting payment",
    dispatch: "After launch, 19 October 2026",

    quantity: String(qty),
    unitPrice: unit ? moneyIn(currency, unit) : "",
    amount: subtotal ? moneyIn(currency, subtotal) : "",
    subtotal: subtotal ? moneyIn(currency, subtotal) : "",
    promoCode: String(row.promo_code ?? ""),
    discount: discount ? moneyIn(currency, discount) : moneyIn(currency, 0),
    // Postage that was not charged is not a blank line: it is a line saying
    // it was not charged, which is the thing a buyer checks for.
    deliveryLabel: country ? `Delivery to ${country}` : "Delivery",
    delivery: shipping > 0 ? moneyIn(currency, shipping) : "Included",
    total: total ? moneyIn(currency, total) : "",

    payHow: payee?.how ?? "Send the total to the account below",
    payNumber: payee?.value ?? "",
    payTitle: payee?.holder ?? "",
    payEmail: INVOICE_FIXED.email,
    payWhatsApp: INVOICE_FIXED.whatsapp,
  };
}

/**
 * The invoice as it arrives from the browser, made safe.
 *
 * The admin types into a page and the page posts an object. Every key is
 * taken from the list above and nothing else, every value is a string, and
 * every string has a ceiling: a line of an invoice is a line, and a
 * megabyte pasted into one should not become a megabyte of email.
 */
export function cleanInvoice(input: unknown): Invoice {
  const source = (input ?? {}) as Record<string, unknown>;
  const out = {} as Record<string, string>;
  for (const key of INVOICE_FIELDS) {
    const raw = source[key];
    out[key] = typeof raw === "string" ? raw.replace(/\s+/g, " ").trim().slice(0, 300) : "";
  }
  return out as Invoice;
}
