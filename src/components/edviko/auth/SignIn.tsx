"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, Field } from "@/components/edviko/auth/AuthShell";
import { startSession, useSession } from "@/components/edviko/auth/session";
import { createAccount, EMPTY } from "@/lib/edviko/account";
import { homeFor, signIn } from "@/lib/edviko/auth";
import { useAccount } from "@/components/edviko/Account";

/**
 * Coming back.
 *
 * Two fields and one error message. A wrong address and a wrong password
 * read the same, deliberately: telling somebody "no account with that
 * address" tells anybody who asks which addresses have accounts here, and on
 * a product holding students' records that is a list worth having.
 */
export function SignIn() {
  const router = useRouter();
  const { accounts } = useSession();
  const profile = useAccount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await signIn(email, password, accounts);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startSession(result.account);

    // A student signing in on a device that has never held their record gets
    // an empty one, so every screen on their side has something to read
    // rather than offering to create a second account.
    if (result.account.role === "student" && !profile) {
      await createAccount({
        ...EMPTY,
        id: result.account.code,
        name: result.account.name,
        email: result.account.email,
      });
    }

    router.push(homeFor(result.account.role));
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      lede="The same account whichever side of Edviko you use: student, parent, advisor or campus."
      footer={
        <p className="ev-small">
          No account yet? <Link href="/edviko/join" style={{ color: "var(--accent)" }}>Join Edviko</Link>.
          {accounts.length === 0 && " Nothing has been created in this browser yet."}
        </p>
      }
    >
      <form onSubmit={submit} style={{ display: "grid", gap: "1.1rem" }}>
        <Field id="s-email" label="Email">
          <input id="s-email" className="ev-field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} autoComplete="email" />
        </Field>

        <Field id="s-password" label="Password" error={error}>
          <input id="s-password" className="ev-field" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} autoComplete="current-password" />
        </Field>

        <button type="submit" className="ev-btn ev-btn--primary" disabled={busy} style={{ justifyContent: "center" }}>
          {busy ? "Checking" : "Sign in"}
        </button>

        <p className="ev-small" style={{ color: "var(--text-faint)" }}>
          Forgotten it? There is nowhere to send a reset to yet, so an account whose password is lost
          has to be made again. That changes the day this has a server behind it.
        </p>
      </form>
    </AuthShell>
  );
}
