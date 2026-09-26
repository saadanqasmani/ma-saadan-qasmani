"use client";

import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { accountStore, readProfile, type Profile } from "@/lib/edviko/account";

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
 * The prompt that appears when something needs an account.
 *
 * It used to make one here and now, with a name and an email and no
 * password, which was the right call while there was nothing else. Now that
 * there is a real sign-up it points at it instead: two ways to create an
 * account is how a product ends up with two kinds of account, one of which
 * cannot be signed into on the next visit.
 */
export function AuthPanel({
  onClose,
  reason,
}: {
  onClose: () => void;
  reason?: string;
}) {
  return (
    <div className="ev-modal" role="dialog" aria-label="An account is needed" onClick={onClose}>
      <div className="ev-pane ev-land ev-modal__box" onClick={(e) => e.stopPropagation()}>
        <span className="ev-label" style={{ color: "var(--accent)" }}>Free, always</span>
        <h2 className="ev-h2" style={{ marginTop: "0.7rem", fontSize: "1.3rem" }}>
          {reason ?? "This needs an account"}
        </h2>
        <p className="ev-body" style={{ marginTop: "0.7rem" }}>
          An account keeps your wish list and your record, and it is what lets us tell you your
          chances at each university rather than only listing them.
        </p>

        <Link href="/edviko/join" className="ev-btn ev-btn--primary" style={{ marginTop: "1.5rem", width: "100%", justifyContent: "center" }}>
          Create an account
        </Link>

        <p className="ev-small" style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have one? <Link href="/edviko/signin" style={{ color: "var(--accent)" }}>Sign in</Link>.
        </p>

        <button type="button" onClick={onClose} className="ev-small" style={{ all: "unset", cursor: "pointer", display: "block", marginTop: "1rem", textAlign: "center", width: "100%", color: "var(--text-faint)" }}>
          Not now
        </button>

        <p className="ev-small" style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
          Early build: an account is held in this browser only. Nothing is sent anywhere, and it will
          not be there on another device until this has a server behind it.
        </p>
      </div>
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
      <div className="ev-pane" style={{ padding: "1.5rem", textAlign: "center" }}>
        <span className="ev-label" style={{ color: "var(--accent)" }}>Free, takes ten seconds</span>
        <p className="ev-h2" style={{ marginTop: "0.7rem", fontSize: "1.15rem" }}>{title}</p>
        <button type="button" onClick={() => setAsking(true)} className="ev-btn ev-btn--primary" style={{ marginTop: "1.25rem" }}>
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
        <p className="ev-small">
          Saved to your profile. Open any university and you will see how {percentage.toFixed(1)}%
          measures against what they ask for.
        </p>
        <Link href="/edviko/match" className="ev-btn ev-btn--ghost" style={{ marginTop: "0.9rem" }}>
          See where this gets me
        </Link>
      </div>
    );
  }
  return (
    <>
      <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
        <p className="ev-body">
          That is your number. On its own it is trivia. Attach it to an account and every
          university will tell you where you stand against what it actually asks for.
        </p>
        <button type="button" onClick={() => setAsking(true)} className="ev-btn ev-btn--primary" style={{ marginTop: "1rem" }}>
          Show me my chances
        </button>
      </div>
      {asking && <AuthPanel onClose={() => setAsking(false)} reason="See your chances at every university" />}
    </>
  );
}

