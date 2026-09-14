"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  JOURNAL_COOKIE,
  JOURNAL_COOKIE_MAX_AGE,
  codeIsCorrect,
  journalToken,
} from "@/lib/journalGate";
import { subscribe, type SubscribeOutcome } from "@/lib/subscribe";

/**
 * What went wrong, as a name rather than a sentence.
 *
 * The server does not know which language the reader is in, and it does not
 * need to: the page that called it does, and it holds the words.
 */
export type GateError = "enterCode" | "wrongCode" | "badEmail" | "notConnected" | "failed";

export type GateState = {
  error: GateError | null;
  subscribed?: boolean;
  /** What became of the letter carrying the code. */
  outcome?: SubscribeOutcome;
};

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

/** The way in: the code from the letter. */
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
 * Subscribing here asks for the code. It does not open the page.
 *
 * Opening it the moment an address was typed made the code decorative:
 * nobody ever needed it, and an address that could not receive anything was
 * worth as much as one that could. The letter is the way in now, so the
 * address has to be real, and what a reader gets for leaving it arrives in
 * their inbox rather than on the screen.
 */
export async function subscribeForCode(
  _prev: GateState,
  formData: FormData
): Promise<GateState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!emailSchema.safeParse(email).success) {
    return { error: "badEmail" };
  }

  // The form carries it, so the letter goes out in the language the reader
  // was reading rather than in mine.
  const sent = String(formData.get("locale") ?? "");
  const locale = isLocale(sent) ? sent : defaultLocale;

  const result = await subscribe(email, locale);
  if (!result.ok) {
    return { error: result.reason === "not-connected" ? "notConnected" : "failed" };
  }

  return { error: null, subscribed: true, outcome: result.outcome };
}
