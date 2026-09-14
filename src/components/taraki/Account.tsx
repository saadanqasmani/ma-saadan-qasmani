"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import {
  accountStore,
  createAccount,
  EMPTY,
  readProfile,
  type Profile,
} from "@/lib/taraki/account";

/** The signed-in student, or null. Used everywhere something is gated. */
export function useAccount(): Profile | null {
  const raw = useSyncExternalStore(
    accountStore.subscribe,
    accountStore.snapshot,
    accountStore.serverSnapshot
  );
  return useMemo(() => readProfile(raw), [raw]);
}

/**
 * Sign up, or sign in.
 *
 * Deliberately three fields. Every extra box on a sign-up form loses people,
 * and everything else about a student can be filled in later from their
 * profile, where it is obvious why it is being asked.
 */
export function AuthPanel({
  onClose,
  reason,
}: {
  onClose: () => void;
  reason?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setBusy(true);
    await createAccount({ ...EMPTY, name: name.trim(), email: email.trim() });
    setBusy(false);
    onClose();
  }

  return (
    <div className="tk-modal" role="dialog" aria-label="Create your account" onClick={onClose}>
      <form className="tk-pane tk-land tk-modal__box" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <span className="tk-label" style={{ color: "var(--accent)" }}>Free, always</span>
        <h2 className="tk-h2" style={{ marginTop: "0.7rem", fontSize: "1.3rem" }}>
          {reason ?? "Make an account"}
        </h2>
        <p className="tk-body" style={{ marginTop: "0.7rem" }}>
          It keeps your wish list, and it is what lets us tell you your chances at each
          university instead of just listing them.
        </p>

        <label className="tk-label" htmlFor="a-name" style={{ display: "block", marginTop: "1.4rem", color: "var(--text-faint)" }}>
          Your name
        </label>
        <input id="a-name" value={name} onChange={(e) => setName(e.target.value)} required style={field} />

        <label className="tk-label" htmlFor="a-email" style={{ display: "block", marginTop: "1rem", color: "var(--text-faint)" }}>
          Email
        </label>
        <input id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={field} />

        <button type="submit" disabled={busy} className="tk-btn tk-btn--primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}>
          {busy ? "One moment" : "Create my account"}
        </button>

        <button type="button" onClick={onClose} className="tk-small" style={{ all: "unset", cursor: "pointer", display: "block", marginTop: "1rem", textAlign: "center", width: "100%", color: "var(--text-faint)" }}>
          Not now
        </button>

        <p className="tk-small" style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
          Early build: your account is held on this device only. Nothing is sent anywhere and no
          password is set. It moves to a real account when we launch on our own domain.
        </p>
      </form>
    </div>
  );
}

/**
 * Anything only a signed-in student can do.
 *
 * Shows the locked state rather than nothing, because a student needs to see
 * what is behind the door before being asked to open it.
 */
export function Gated({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const account = useAccount();
  const [asking, setAsking] = useState(false);

  if (account) return <>{children}</>;

  return (
    <>
      <div className="tk-pane" style={{ padding: "1.5rem", textAlign: "center" }}>
        <span className="tk-label" style={{ color: "var(--accent)" }}>Free, takes ten seconds</span>
        <p className="tk-h2" style={{ marginTop: "0.7rem", fontSize: "1.15rem" }}>{title}</p>
        <button type="button" onClick={() => setAsking(true)} className="tk-btn tk-btn--primary" style={{ marginTop: "1.25rem" }}>
          Make an account
        </button>
      </div>
      {asking && <AuthPanel onClose={() => setAsking(false)} reason={title} />}
    </>
  );
}

/** The prompt at the end of the calculator. */
export function SaveResultPrompt({ percentage }: { percentage: number }) {
  const account = useAccount();
  const [asking, setAsking] = useState(false);
  if (account) {
    return (
      <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
        <p className="tk-small">
          Saved to your profile. Open any university and you will see how {percentage.toFixed(1)}%
          measures against what they ask for.
        </p>
        <Link href="/taraki/match" className="tk-btn tk-btn--ghost" style={{ marginTop: "0.9rem" }}>
          See where this gets me
        </Link>
      </div>
    );
  }
  return (
    <>
      <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
        <p className="tk-body">
          That is your number. On its own it is trivia. Attach it to an account and every
          university will tell you where you stand against what it actually asks for.
        </p>
        <button type="button" onClick={() => setAsking(true)} className="tk-btn tk-btn--primary" style={{ marginTop: "1rem" }}>
          Show me my chances
        </button>
      </div>
      {asking && <AuthPanel onClose={() => setAsking(false)} reason="See your chances at every university" />}
    </>
  );
}

const field: React.CSSProperties = {
  width: "100%",
  marginTop: "0.5rem",
  padding: "0.75rem 0.9rem",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "11px",
  color: "var(--text)",
  fontFamily: "inherit",
  fontSize: "1rem",
  outline: "none",
};
