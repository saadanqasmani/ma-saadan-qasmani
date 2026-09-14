"use server";

import { cookies } from "next/headers";
import {
  GCB_COOKIE,
  GCB_COOKIE_MAX_AGE,
  gcbCodeIsCorrect,
  gcbToken,
} from "@/lib/gcb/gate";

export type GcbUnlockState = { error: "empty" | "wrong" | null; ok?: boolean };

/**
 * Checked on the server, always. A client-side comparison would ship the
 * code to everyone who loads the home page, which is the opposite of the
 * point.
 */
export async function unlockGcb(
  _prev: GcbUnlockState,
  formData: FormData
): Promise<GcbUnlockState> {
  const entered = String(formData.get("code") ?? "");
  if (!entered.trim()) return { error: "empty" };
  if (!gcbCodeIsCorrect(entered)) return { error: "wrong" };

  const store = await cookies();
  store.set(GCB_COOKIE, await gcbToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GCB_COOKIE_MAX_AGE,
  });

  return { error: null, ok: true };
}
