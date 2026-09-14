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

export type SubscribeResult =
  | { ok: true; welcomed: boolean }
  | { ok: false; reason: "not-connected" | "failed"; detail?: string };

/**
 * Records the address, then writes to it if this is the first time.
 *
 * The letter carries the journal code, so it is sent only to an address that
 * was not already on the list. Otherwise anyone could type a stranger's
 * address into the box over and over and use this site to fill their inbox.
 * A reader who lost the code has the gate itself, which lets them straight
 * back in without needing another copy.
 *
 * A failure to send is never a failure to subscribe. The row is what was
 * promised; the letter is a courtesy on top of it.
 */
export async function subscribe(
  email: string,
  locale: Locale = defaultLocale
): Promise<SubscribeResult> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { ok: false, reason: "not-connected" };

  const address = email.trim().toLowerCase();

  const { data: existing, error: readError } = await supabase
    .from("subscribers")
    .select("status")
    .eq("email", address)
    .maybeSingle();

  if (readError) {
    // Whatever Postgres said, said out loud. A missing table, a key that is
    // not the service role one, a policy: they all arrive here as the same
    // blank failure otherwise, and the host's log is the only place anyone
    // can find out which.
    console.error(`[newsletter] read failed: ${readError.code ?? "?"} ${readError.message}`);
    return { ok: false, reason: "failed", detail: `${readError.code ?? "?"} ${readError.message}` };
  }

  const firstTime = !existing || existing.status !== "active";

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email: address, status: "active" }, { onConflict: "email" });

  if (error) {
    console.error(`[newsletter] write failed: ${error.code ?? "?"} ${error.message}`);
    return { ok: false, reason: "failed", detail: `${error.code ?? "?"} ${error.message}` };
  }

  if (!firstTime || !mailIsConfigured()) return { ok: true, welcomed: false };

  const letter = await welcomeEmail(locale, address);
  const sent = await sendMail({
    to: address,
    subject: letter.subject,
    html: letter.html,
    text: letter.text,
    unsubscribeUrl: letter.unsubscribeUrl,
  });

  if (!sent.ok) {
    // Worth knowing about in the host's logs, not worth telling the reader:
    // from where they stand, subscribing worked, because it did.
    console.error("[newsletter] welcome mail failed:", sent.reason);
  }

  return { ok: true, welcomed: sent.ok };
}
