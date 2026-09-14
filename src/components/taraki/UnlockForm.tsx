"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { unlockTaraki, type UnlockState } from "@/lib/actions/taraki";

const initial: UnlockState = { error: null };

export function UnlockForm() {
  const [state, action, pending] = useActionState(unlockTaraki, initial);
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) return;
    // The cookie is set by the time the action resolves, so the gate lets
    // this through. refresh() so the middleware is consulted again.
    router.replace("/taraki");
    router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action}>
      <label htmlFor="tk-code" className="tk-label" style={{ color: "var(--text-faint)" }}>
        Code
      </label>
      <input
        id="tk-code"
        name="code"
        type="password"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        style={{
          marginTop: "0.85rem",
          width: "100%",
          padding: "0.7rem 0",
          background: "transparent",
          border: "none",
          borderBottom: "1px solid var(--line-strong)",
          color: "var(--text)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "1rem",
          letterSpacing: "0.16em",
          outline: "none",
        }}
      />
      {state.error && (
        <p className="tk-small" style={{ marginTop: "0.85rem", color: "var(--paid)" }}>
          {state.error === "empty" ? "Enter the code." : "Not that one."}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="tk-btn tk-btn--primary"
        style={{ marginTop: "1.75rem", width: "100%", justifyContent: "center" }}
      >
        {pending ? "Checking" : "Enter"}
      </button>
    </form>
  );
}
