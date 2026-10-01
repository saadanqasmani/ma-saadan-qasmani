import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { checkoutIsConfigured } from "@/lib/book/checkout";
import { liveCodes } from "@/lib/book/pricing";
import { REGIONS } from "@/lib/book/regions";
import { alertAddress } from "@/lib/email/orderAlert";
import { fromAddress, mailIsConfigured } from "@/lib/email/send";

/**
 * Is the shop actually open?
 *
 * Everything the pre-order path needs is somewhere this code cannot see from
 * a laptop: a migration that may or may not have been run, an API key that
 * may or may not be set, a promo code that lives in an environment variable
 * and was once forgotten. Guessing at any of it is how a launch goes out
 * with a table that silently drops the money columns.
 *
 * So this asks the running deployment, from inside it, and answers in the
 * order that matters: what would lose an order, what would embarrass us, and
 * what is merely worth knowing.
 */

export type Level = "ready" | "degraded" | "blocked" | "off";

export type Check = {
  id: string;
  label: string;
  level: Level;
  /** What is true right now. */
  says: string;
  /** What to do about it, when there is something. */
  fix?: string;
};

/** Every column the order path writes, and the migration that adds it. */
const COLUMNS: { name: string; since: string }[] = [
  { name: "full_name", since: "0001_init" },
  { name: "email", since: "0001_init" },
  { name: "quantity", since: "0001_init" },
  { name: "status", since: "0001_init" },
  { name: "internal_notes", since: "0001_init" },
  { name: "unit_price_usd", since: "0007_preorders" },
  { name: "quantity_priced", since: "0007_preorders" },
  { name: "promo_code", since: "0007_preorders" },
  { name: "discount_usd", since: "0007_preorders" },
  { name: "total_usd", since: "0007_preorders" },
  { name: "payment_status", since: "0007_preorders" },
  { name: "stripe_session_id", since: "0007_preorders" },
  { name: "paid_at", since: "0007_preorders" },
  { name: "region", since: "0008_regions" },
  { name: "currency", since: "0008_regions" },
  { name: "shipping_amount", since: "0008_regions" },
];

export type Readiness = {
  checks: Check[];
  /** The worst level among them, which is the state of the shop. */
  overall: Level;
  counts: { total: number; byPayment: Record<string, number>; latest: string | null } | null;
};

export async function checkPreorders(): Promise<Readiness> {
  const checks: Check[] = [];
  const db = getAdminClient();

  if (!db) {
    checks.push({
      id: "database",
      label: "The database",
      level: "blocked",
      says: "Not connected. Nothing can be ordered at all: the form answers that pre-ordering is not switched on yet.",
      fix: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the hosting dashboard, then redeploy.",
    });
    return { checks: [...checks, ...environmentChecks()], overall: "blocked", counts: null };
  }

  // Can the table be read at all?
  const table = await db.from("book_orders").select("id", { count: "exact", head: true });
  if (table.error) {
    checks.push({
      id: "table",
      label: "The orders table",
      level: "blocked",
      says: `book_orders could not be read: ${table.error.message}`,
      fix: "Run supabase/migrations/0001_init.sql, then the rest in order.",
    });
    return { checks: [...checks, ...environmentChecks()], overall: "blocked", counts: null };
  }

  checks.push({
    id: "database",
    label: "The database",
    level: "ready",
    says: `Connected, and book_orders holds ${table.count ?? 0} order${table.count === 1 ? "" : "s"}.`,
  });

  // Every column the order path writes, asked for one at a time so the
  // missing ones can be named rather than only the first.
  const missing: { name: string; since: string }[] = [];
  for (const column of COLUMNS) {
    const probe = await db.from("book_orders").select(column.name).limit(1);
    if (probe.error?.code === "42703") missing.push(column);
  }

  if (missing.length === 0) {
    checks.push({
      id: "columns",
      label: "The money columns",
      level: "ready",
      says: "Every column the order path writes is there: region, currency, postage, the price, the discount and the total.",
    });
  } else {
    const migrations = [...new Set(missing.map((m) => m.since))].join(" and ");
    checks.push({
      id: "columns",
      label: "The money columns",
      level: "degraded",
      says: `${missing.length} missing: ${missing.map((m) => m.name).join(", ")}. Orders are still taken and nothing is lost, but the figures go into the notes instead of their own columns, and the dashboard cannot sort or total them.`,
      fix: `Run supabase/migrations/${migrations}.sql.`,
    });
  }

  // Prices are quoted in three currencies, and the country column was
  // written when there was one shop in two countries.
  const region = await db.from("book_orders").select("region").limit(1);
  if (!region.error) {
    checks.push({
      id: "countries",
      label: "Countries the table accepts",
      level: "ready",
      says: "Region is recorded, so an order from outside Pakistan and Türkiye can be filed as a print-to-order request rather than refused.",
      fix: "If a print-to-order request ever lands in Messages instead of Orders, the old country rule is still on the table: run 0008_regions.sql.",
    });
  }

  return {
    checks: [...checks, ...environmentChecks()],
    overall: worst(checks.map((c) => c.level)),
    counts: await countOrders(),
  };
}

function environmentChecks(): Check[] {
  const checks: Check[] = [];

  const to = alertAddress();
  if (!mailIsConfigured()) {
    checks.push({
      id: "mail",
      label: "Email",
      level: "blocked",
      says: "No mail is configured, so nobody who orders is sent a confirmation and nobody tells you an order arrived. Orders are still recorded.",
      fix: "Set RESEND_API_KEY, and MAIL_FROM to an address on a domain verified with Resend.",
    });
  } else if (!to) {
    checks.push({
      id: "mail",
      label: "Email",
      level: "degraded",
      says: `Confirmations go out from ${fromAddress()}, but there is nobody to alert when an order arrives.`,
      fix: "Set ORDER_ALERT_EMAIL, or ADMIN_EMAILS, to the address you want orders sent to.",
    });
  } else {
    checks.push({
      id: "mail",
      label: "Email",
      level: "ready",
      says: `Confirmations go out from ${fromAddress()}, and every order is copied to ${to}.`,
    });
  }

  for (const id of ["pk", "tr"] as const) {
    const where = id === "pk" ? "Pakistan" : "Türkiye";
    // A region can take more than one code, worth different things, so each
    // is spelled out with what it actually does.
    const worth = (o: { percentOff: number; freeShipping: boolean }) =>
      o.percentOff > 0 && o.freeShipping
        ? `${o.percentOff}% off and free postage`
        : o.percentOff > 0
          ? `${o.percentOff}% off`
          : "free postage";
    const live = liveCodes(id);
    checks.push({
      id: `code-${id}`,
      label: live.length > 1 ? `${where}: the promo codes` : `${where}: the promo code`,
      level: "ready",
      says: `${live.map((o) => `${o.code} (${worth(o)})`).join(", ")}. Typed in any case; anything else is refused with a message.`,
      fix: "The standing code changes with BOOK_PROMO_CODE_PK or BOOK_PROMO_CODE_TR without a deploy. A named code is in the source.",
    });
  }

  checks.push(
    checkoutIsConfigured()
      ? {
          id: "card",
          label: "Card payment, Türkiye",
          level: "ready",
          says: "Stripe is configured, so Türkiye can pay online and the rest is settled by hand.",
        }
      : {
          id: "card",
          label: "Card payment, Türkiye",
          level: "off",
          says: "No card payment. Both countries reserve and settle by hand, which is what the form says and what the confirmation promises. Nothing is broken by this.",
          fix: "Set STRIPE_SECRET_KEY when a provider is chosen. Stripe does not take businesses registered in Türkiye, so this may be iyzico or PayTR instead, which is one function in lib/book/checkout.ts.",
        }
  );

  return checks;
}

async function countOrders(): Promise<Readiness["counts"]> {
  const db = getAdminClient();
  if (!db) return null;

  const { data, error } = await db
    .from("book_orders")
    .select("payment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error || !data) return null;

  const byPayment: Record<string, number> = {};
  for (const row of data) {
    const key = String((row as { payment_status?: string }).payment_status ?? "not recorded");
    byPayment[key] = (byPayment[key] ?? 0) + 1;
  }

  return {
    total: data.length,
    byPayment,
    latest: (data[0] as { created_at?: string } | undefined)?.created_at ?? null,
  };
}

const ORDER: Level[] = ["blocked", "degraded", "off", "ready"];

function worst(levels: Level[]): Level {
  for (const level of ORDER) if (levels.includes(level)) return level === "off" ? "ready" : level;
  return "ready";
}
