"use server";

import { cookies } from "next/headers";
import { OPS_COOKIE, OPS_COOKIE_MAX_AGE, opsCodeIsCorrect, opsToken } from "@/lib/ops/gate";

export type OpsUnlockState = { error: "empty" | "wrong" | null; ok?: boolean };

export async function unlockOps(_prev: OpsUnlockState, formData: FormData): Promise<OpsUnlockState> {
  const entered = String(formData.get("code") ?? "");
  if (!entered.trim()) return { error: "empty" };
  if (!opsCodeIsCorrect(entered)) return { error: "wrong" };

  const store = await cookies();
  store.set(OPS_COOKIE, await opsToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OPS_COOKIE_MAX_AGE,
  });
  return { error: null, ok: true };
}
