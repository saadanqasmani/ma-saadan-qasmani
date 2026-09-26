"use server";

import { cookies } from "next/headers";
import {
  EDVIKO_COOKIE,
  EDVIKO_COOKIE_MAX_AGE,
  edvikoCodeIsCorrect,
  edvikoToken,
} from "@/lib/edviko/gate";

export type UnlockState = { error: "empty" | "wrong" | null; ok?: boolean };

/**
 * Checked on the server, always. A client-side comparison would ship the
 * code to everyone who loads the home page, which is the opposite of the
 * point.
 */
export async function unlockEdviko(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const entered = String(formData.get("code") ?? "");
  if (!entered.trim()) return { error: "empty" };
  if (!edvikoCodeIsCorrect(entered)) return { error: "wrong" };

  const store = await cookies();
  store.set(EDVIKO_COOKIE, await edvikoToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: EDVIKO_COOKIE_MAX_AGE,
  });

  return { error: null, ok: true };
}
