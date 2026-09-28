import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Writing an order down, whatever state the database is in.
 *
 * The order table grew columns for money and for regions in two later
 * migrations. If those have not been run on the deployment the reader is
 * standing on, the insert fails on a column that does not exist and the
 * reader is told something went wrong — and a real pre-order is lost over a
 * pending migration, which is the worst possible trade.
 *
 * So the money is tried first, and if the table has nowhere to put it the
 * row goes in without it and the figures are written into the notes
 * instead. Saadan ends up with the order and every number in it either way;
 * one version is a column he can sort by and the other is a sentence.
 */

/** Postgres for "I have no such column". */
const NO_SUCH_COLUMN = "42703";
/** Postgres for "that violates a CHECK", which here means the country list. */
const CHECK_FAILED = "23514";
/** Postgres for "no such table", which means the migrations were never run. */
const NO_SUCH_TABLE = "42P01";

/** The columns the table has had since the beginning. */
type BaseOrder = {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  shipping_address: string;
  quantity: number;
  message?: string;
};

export type OrderExtras = Record<string, string | number | null>;

export type Recorded =
  | { ok: true; id: string | null; degraded: boolean }
  | { ok: false; reason: Refusal; detail: string };

export type Refusal = "no-such-table" | "bad-country" | "other";

/** What the reason means, for a log line and for the alert that follows it. */
export const REFUSAL_MEANS: Record<Refusal, string> = {
  "no-such-table":
    "the book_orders table does not exist on this database. Run supabase/migrations/0001_init.sql and the rest in order.",
  "bad-country":
    "the orders table still refuses any country but Pakistan and Türkiye. Run supabase/migrations/0008_regions.sql.",
  other: "the database refused the row.",
};

function refusalOf(code: string | undefined): Refusal {
  if (code === NO_SUCH_TABLE) return "no-such-table";
  if (code === CHECK_FAILED) return "bad-country";
  return "other";
}

function asNote(extras: OrderExtras): string {
  return Object.entries(extras)
    .filter(([, v]) => v !== null && v !== "")
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");
}

export async function recordOrder(
  db: SupabaseClient,
  base: BaseOrder,
  extras: OrderExtras
): Promise<Recorded> {
  const full = await db
    .from("book_orders")
    .insert({ ...base, ...extras })
    .select("id")
    .maybeSingle();

  if (!full.error) {
    return { ok: true, id: (full.data?.id as string) ?? null, degraded: false };
  }

  if (full.error.code !== NO_SUCH_COLUMN) {
    const reason = refusalOf(full.error.code);
    console.error(
      `[order] insert refused (${full.error.code}): ${full.error.message} — ${REFUSAL_MEANS[reason]}`
    );
    return { ok: false, reason, detail: full.error.message };
  }

  console.error(
    `[order] the order table is missing a column (${full.error.message}). ` +
      "Run the migrations in supabase/migrations. Filing this one without the money columns."
  );

  const notes = [base.message, asNote(extras)].filter(Boolean).join("\n\n");
  const plain = await db
    .from("book_orders")
    .insert({ ...base, internal_notes: notes })
    .select("id")
    .maybeSingle();

  if (plain.error) {
    const reason = refusalOf(plain.error.code);
    console.error(
      `[order] and the plain insert failed too (${plain.error.code}): ${plain.error.message} — ${REFUSAL_MEANS[reason]}`
    );
    return { ok: false, reason, detail: plain.error.message };
  }

  return { ok: true, id: (plain.data?.id as string) ?? null, degraded: true };
}

/**
 * The last resort for a reader outside the two countries the order table
 * will accept: their request arrives as a message rather than not at all.
 */
export async function recordAsMessage(
  db: SupabaseClient,
  who: { name: string; email: string; subject: string; body: string }
): Promise<boolean> {
  const { error } = await db.from("contact_messages").insert({
    name: who.name,
    email: who.email,
    subject: who.subject,
    message: who.body,
  });
  if (error) console.error(`[order] could not file it as a message either: ${error.message}`);
  return !error;
}
