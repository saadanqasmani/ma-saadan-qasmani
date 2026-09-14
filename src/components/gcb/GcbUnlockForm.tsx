"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { unlockGcb, type GcbUnlockState } from "@/lib/actions/gcb";

const initial: GcbUnlockState = { error: null };

export function GcbUnlockForm() {
  const [state, action, pending] = useActionState(unlockGcb, initial);
  const router = useRouter();

  useEffect(() => {
    if (!state.ok) return;
    // The cookie is set by the time the action resolves, so the gate lets
    // this through. refresh() so the middleware is consulted again.
    router.replace("/gcb");
    router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action}>
      <label htmlFor="gcb-code" className="gcb-label" style={{ color: "var(--text-faint)" }}>
        Code
      </label>
      <input
        id="gcb-code"
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
        <p className="gcb-small" style={{ marginTop: "0.85rem", color: "var(--paid)" }}>
          {state.error === "empty" ? "Enter the code." : "Not that one."}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="gcb-btn gcb-btn--primary"
        style={{ marginTop: "1.75rem", width: "100%", justifyContent: "center" }}
      >
        {pending ? "Checking" : "Enter"}
      </button>
    </form>
  );
}
