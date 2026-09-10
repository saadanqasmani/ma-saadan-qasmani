"use server";

import { cookies } from "next/headers";
import { IRIS_COOKIE, IRIS_COOKIE_MAX_AGE, codeIsCorrect, irisToken } from "@/lib/irisGate";

export type UnlockState = { error: string | null };

/**
 * Checks an entered code and, if it is right, records the unlock in an
 * httpOnly cookie. The film file and the two protected sections both read
 * that cookie on the server, so nothing here can be talked out of by the
 * browser.
 */
export async function unlockIris(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const entered = String(formData.get("code") ?? "");

  if (!entered.trim()) return { error: "Enter the access code." };
  if (!codeIsCorrect(entered)) return { error: "That code is not right. Ask Saadan for the current one." };

  const store = await cookies();
  store.set(IRIS_COOKIE, await irisToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: IRIS_COOKIE_MAX_AGE,
  });

  return { error: null };
}
