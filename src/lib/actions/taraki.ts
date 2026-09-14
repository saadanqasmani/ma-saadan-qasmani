"use server";

import { cookies } from "next/headers";
import {
  TARAKI_COOKIE,
  TARAKI_COOKIE_MAX_AGE,
  tarakiCodeIsCorrect,
  tarakiToken,
} from "@/lib/taraki/gate";

export type UnlockState = { error: "empty" | "wrong" | null; ok?: boolean };

/**
 * Checked on the server, always. A client-side comparison would ship the
 * code to everyone who loads the home page, which is the opposite of the
 * point.
 */
export async function unlockTaraki(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const entered = String(formData.get("code") ?? "");
  if (!entered.trim()) return { error: "empty" };
  if (!tarakiCodeIsCorrect(entered)) return { error: "wrong" };

  const store = await cookies();
  store.set(TARAKI_COOKIE, await tarakiToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TARAKI_COOKIE_MAX_AGE,
  });

  return { error: null, ok: true };
}
