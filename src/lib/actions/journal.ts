"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import {
  JOURNAL_COOKIE,
  JOURNAL_COOKIE_MAX_AGE,
  codeIsCorrect,
  journalToken,
} from "@/lib/journalGate";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * What went wrong, as a name rather than a sentence.
 *
 * The server does not know which language the reader is in, and it does not
 * need to: the page that called it does, and it holds the words.
 */
export type GateError = "enterCode" | "wrongCode" | "badEmail" | "notConnected" | "failed";

export type GateState = { error: GateError | null; subscribed?: boolean };

async function letThemIn() {
  const store = await cookies();
  store.set(JOURNAL_COOKIE, await journalToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: JOURNAL_COOKIE_MAX_AGE,
  });
}

/** For a reader who already has the code from their subscription email. */
export async function unlockWithCode(
  _prev: GateState,
  formData: FormData
): Promise<GateState> {
  const entered = String(formData.get("code") ?? "");
  if (!entered.trim()) return { error: "enterCode" };
  if (!codeIsCorrect(entered)) return { error: "wrongCode" };
  await letThemIn();
  return { error: null };
}

const emailSchema = z.string().email();

/**
 * For a reader subscribing here and now. The page opens immediately.
 *
 * The unlock is deliberately tied to the subscription actually recording. The
 * offer is access in exchange for an address to write to, so letting someone
 * in on an address that was never stored would make the second half of that
 * a lie.
 */
export async function subscribeAndUnlock(
  _prev: GateState,
  formData: FormData
): Promise<GateState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!emailSchema.safeParse(email).success) {
    return { error: "badEmail" };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { error: "notConnected" };
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" });

  if (error) {
    return { error: "failed" };
  }

  await letThemIn();
  return { error: null, subscribed: true };
}
