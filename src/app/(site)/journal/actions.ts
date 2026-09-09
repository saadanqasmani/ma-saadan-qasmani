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

export type GateState = { error: string | null; subscribed?: boolean };

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
  if (!entered.trim()) return { error: "Enter your access code." };
  if (!codeIsCorrect(entered)) {
    return { error: "That code is not right. Check the email you were sent." };
  }
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
    return { error: "Enter a valid email address." };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { error: "The list isn't connected yet. Use your access code for now." };
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, status: "active" }, { onConflict: "email" });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  await letThemIn();
  return { error: null, subscribed: true };
}
