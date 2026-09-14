"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { unlockOps, type OpsUnlockState } from "@/lib/actions/ops";

const initial: OpsUnlockState = { error: null };

export function UnlockForm() {
  const [state, action, pending] = useActionState(unlockOps, initial);
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) return;
    router.replace("/ops");
    router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="stack">
      <label htmlFor="ops-code" className="label">
        Code
      </label>
      <input
        id="ops-code"
        name="code"
        type="password"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        className="field field--mono"
      />
      {state.error && <p className="hint hint--bad">{state.error === "empty" ? "Enter the code." : "Not that one."}</p>}
      <button type="submit" disabled={pending} className="btn btn--primary btn--block">
        {pending ? "Checking" : "Enter"}
      </button>
    </form>
  );
}
