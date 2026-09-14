/**
 * Adding an address to the list, from wherever it was left.
 *
 * There are two doors into the same room: the pop-up and the footer form post
 * to /api/newsletter, and the journal gate calls a server action. Both end
 * here, so a reader gets the same record and the same letter either way.
 */

import { sendMail, mailIsConfigured } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/welcome";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * What became of the letter. The reader is shown a sentence chosen from
 * this, and the host's log gets the detail.
 */
export type SubscribeOutcome =
  | "welcomed"
  | "already-welcomed"
  | "mail-off"
  | "send-failed";

export type SubscribeResult =
  | { ok: true; welcomed: boolean; outcome: SubscribeOutcome }
  | { ok: false; reason: "not-connected" | "failed"; detail?: string };

/**
 * How soon the same address can be written to again.
 *
 * The letter carries the journal code, so somebody could type a stranger's
 * address into the box over and over and use this site to fill their inbox.
 * Sending only to an address never seen before stopped that, and also
 * stopped the ordinary case: a reader who subscribed months ago, lost the
 * code, and typed their address in again got silence. A short cooling-off
 * period stops the abuse and leaves the ordinary case working.
 */
const RESEND_AFTER_MS = 10 * 60 * 1000;

/** Postgres's code for "that column does not exist". */
const UNDEFINED_COLUMN = "42703";

/**
 * Records the address, then writes to it.
 *
 * A failure to send is never a failure to subscribe: the row is what was
 * promised, and the letter is a courtesy on top of it. But it is never
 * silent either. Every reason a letter did not go is named in the return
 * value and written to the log.
 */
export async function subscribe(
  email: string,
  locale: Locale = defaultLocale
): Promise<SubscribeResult> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    console.error("[newsletter] no database: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.");
    return { ok: false, reason: "not-connected" };
  }

  const address = email.trim().toLowerCase();

  // welcomed_at arrived in a later migration. A deployment whose database
  // has not had it run yet must still be able to take a subscription, so a
  // missing column is a fact to work around rather than an error.
  let existing: { status?: string; welcomed_at?: string | null } | null = null;
  let tracksWelcomes = true;

  const full = await supabase
    .from("subscribers")
    .select("status,welcomed_at")
    .eq("email", address)
    .maybeSingle();

  if (full.error?.code === UNDEFINED_COLUMN) {
    tracksWelcomes = false;
    const plain = await supabase
      .from("subscribers")
      .select("status")
      .eq("email", address)
      .maybeSingle();
    if (plain.error) return readFailed(plain.error);
    existing = plain.data;
  } else if (full.error) {
    return readFailed(full.error);
  } else {
    existing = full.data;
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email: address, status: "active" }, { onConflict: "email" });

  if (error) {
    console.error(`[newsletter] write failed: ${error.code ?? "?"} ${error.message}`);
    return { ok: false, reason: "failed", detail: `${error.code ?? "?"} ${error.message}` };
  }

  // Without the column there is nothing to measure the cooling-off period
  // against, so fall back to the old rule: write to an address that was not
  // already on the list, and no more often than that.
  const lastWelcome = existing?.welcomed_at ? Date.parse(existing.welcomed_at) : null;
  const tooSoon = tracksWelcomes
    ? lastWelcome !== null && Number.isFinite(lastWelcome) && Date.now() - lastWelcome < RESEND_AFTER_MS
    : Boolean(existing) && existing?.status === "active";

  if (tooSoon) return { ok: true, welcomed: false, outcome: "already-welcomed" };

  if (!mailIsConfigured()) {
    console.error("[newsletter] RESEND_API_KEY is not set, so no letter was sent.");
    return { ok: true, welcomed: false, outcome: "mail-off" };
  }

  const letter = await welcomeEmail(locale, address);
  const sent = await sendMail({
    to: address,
    subject: letter.subject,
    html: letter.html,
    text: letter.text,
    unsubscribeUrl: letter.unsubscribeUrl,
  });

  if (!sent.ok) {
    console.error(`[newsletter] welcome mail failed: ${sent.reason}`);
    return { ok: true, welcomed: false, outcome: "send-failed" };
  }

  if (tracksWelcomes) {
    const stamp = await supabase
      .from("subscribers")
      .update({ welcomed_at: new Date().toISOString() })
      .eq("email", address);
    // A letter that went out is the thing that matters; failing to write
    // down that it did only costs the next reader a duplicate.
    if (stamp.error) console.error(`[newsletter] could not record the send: ${stamp.error.message}`);
  }

  return { ok: true, welcomed: true, outcome: "welcomed" };
}

function readFailed(error: { code?: string; message: string }): SubscribeResult {
  // Whatever Postgres said, said out loud. A missing table, a key that is
  // not the service role one, a policy: they all arrive here as the same
  // blank failure otherwise, and the host's log is the only place anyone
  // can find out which.
  console.error(`[newsletter] read failed: ${error.code ?? "?"} ${error.message}`);
  return { ok: false, reason: "failed", detail: `${error.code ?? "?"} ${error.message}` };
}
