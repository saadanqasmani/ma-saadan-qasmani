"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, Field } from "@/components/edviko/auth/AuthShell";
import { saveAccounts, startSession, useSession } from "@/components/edviko/auth/session";
import { createAccount, EMPTY } from "@/lib/edviko/account";
import { homeFor, join, ROLE_LABEL, type AccountRole, type JoinInput } from "@/lib/edviko/auth";
import { RELATIONSHIPS } from "@/lib/edviko/id";

/**
 * Joining, in the order the questions actually matter.
 *
 * Who you are first, because every field after it depends on the answer: a
 * student is issued a code, a parent arrives with their child's, an advisor
 * arrives with one their campus gave them. Asking for a code before knowing
 * which of those somebody is, is how sign-up forms end up with six boxes
 * that are each irrelevant to three quarters of the people reading them.
 *
 * One error at a time, under the field it belongs to, and the form never
 * clears what was typed. A form that empties itself on a failed submit is
 * the single most common reason people give up on one.
 */

const ROLES: { id: AccountRole; label: string; says: string }[] = [
  { id: "student", label: "I am a student", says: "Work out the career first, then the degree, the country and the money." },
  { id: "family", label: "I am a parent or guardian", says: "See where they are, what it will cost, and what is being asked of you." },
  { id: "advisor", label: "I am a career advisor", says: "Carry a caseload without losing anybody in a spreadsheet." },
  { id: "campus", label: "I run a campus", says: "See the whole campus: workload, progress, risk and outcomes." },
];

export function Join() {
  const router = useRouter();
  const { accounts } = useSession();

  const [role, setRole] = useState<AccountRole | null>(null);
  const [form, setForm] = useState<JoinInput>({
    role: "student",
    name: "",
    email: "",
    password: "",
    confirm: "",
    country: "PK",
    under18: false,
    guardianEmail: "",
    consent: false,
    code: "",
    relationship: 1,
  });
  const [problem, setProblem] = useState<{ field: string; error: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof JoinInput>(key: K, value: JoinInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setProblem((p) => (p?.field === key ? null : p));
  }

  const err = (field: string) => (problem?.field === field ? problem.error : null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setBusy(true);
    const result = await join({ ...form, role }, accounts);
    setBusy(false);

    if (!result.ok) {
      setProblem({ field: result.field, error: result.error });
      return;
    }

    saveAccounts([...accounts, result.account]);
    startSession(result.account);

    // A student also gets the record everything else on their side reads.
    if (role === "student") {
      await createAccount({ ...EMPTY, id: result.account.code, name: result.account.name, email: result.account.email });
    }

    router.push(homeFor(role));
  }

  if (!role) {
    return (
      <AuthShell
        eyebrow="Join Edviko"
        title="Which of these are you?"
        lede="It decides what you are asked for next, and what you see afterwards. Nothing here is fixed; an account can be changed later."
        footer={
          <p className="ev-small">
            Already have an account? <Link href="/edviko/signin" style={{ color: "var(--accent)" }}>Sign in</Link>.
          </p>
        }
      >
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRole(r.id);
                set("role", r.id);
              }}
              className="ev-card"
              style={{ textAlign: "start", padding: "1.1rem 1.25rem", cursor: "pointer", color: "inherit", background: "transparent" }}
            >
              <span className="ev-body" style={{ fontWeight: 600, display: "block" }}>{r.label}</span>
              <span className="ev-small" style={{ color: "var(--text-soft)" }}>{r.says}</span>
            </button>
          ))}
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow={ROLE_LABEL[role]}
      title="Make your account"
      lede="Five fields, and the two that look like paperwork are the ones that let your record follow you between schools."
      footer={
        <p className="ev-small">
          Wrong one? <button type="button" onClick={() => setRole(null)} style={{ all: "unset", cursor: "pointer", color: "var(--accent)" }}>Choose again</button>
          {" · "}
          Already have an account? <Link href="/edviko/signin" style={{ color: "var(--accent)" }}>Sign in</Link>.
        </p>
      }
    >
      <form onSubmit={submit} style={{ display: "grid", gap: "1.1rem" }}>
        <Field id="j-name" label="Your name" error={err("name")} hint="As it appears on your documents, so nothing has to be corrected later.">
          <input id="j-name" className="ev-field" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </Field>

        <Field id="j-email" label={role === "student" || role === "family" ? "Email" : "Work email"} error={err("email")}>
          <input id="j-email" className="ev-field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </Field>

        <Field
          id="j-password"
          label="Password"
          error={err("password")}
          hint="Ten characters at least. Length is what makes one hard to guess; a symbol on the end of a short one is not."
        >
          <input id="j-password" className="ev-field" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" />
        </Field>

        <Field id="j-confirm" label="Password again" error={err("confirm")}>
          <input id="j-confirm" className="ev-field" type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} autoComplete="new-password" />
        </Field>

        {role === "student" && (
          <>
            <Field id="j-country" label="Where you are studying now" hint="The first part of your Edviko code. It can change; your number cannot.">
              <select id="j-country" className="ev-field" value={form.country} onChange={(e) => set("country", e.target.value)}>
                <option value="PK">Pakistan</option>
                <option value="TR">Türkiye</option>
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
              </select>
            </Field>

            <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
              <input type="checkbox" checked={form.under18} onChange={(e) => set("under18", e.target.checked)} style={{ marginTop: "0.25rem", accentColor: "var(--accent)" }} />
              <span>
                <span className="ev-body" style={{ fontWeight: 600, display: "block" }}>I am under eighteen</span>
                <span className="ev-small" style={{ color: "var(--text-faint)" }}>
                  Then a parent or guardian consents rather than you, and we record who did and when.
                </span>
              </span>
            </label>

            {form.under18 && (
              <>
                <Field id="j-guardian" label="Your parent or guardian's email" error={err("guardianEmail")}>
                  <input id="j-guardian" className="ev-field" type="email" value={form.guardianEmail} onChange={(e) => set("guardianEmail", e.target.value)} />
                </Field>
                <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} style={{ marginTop: "0.25rem", accentColor: "var(--accent)" }} />
                  <span>
                    <span className="ev-body" style={{ display: "block" }}>
                      They have agreed to this account holding my academic record.
                    </span>
                    {err("consent") && <span className="ev-small" style={{ color: "var(--red)" }}>{err("consent")}</span>}
                  </span>
                </label>
              </>
            )}
          </>
        )}

        {role === "family" && (
          <>
            <Field
              id="j-code"
              label="Your child's Edviko code"
              error={err("code")}
              hint="Six parts, like PK-001-02-03-000125-0. It is on their record and their advisor can read it out."
            >
              <input id="j-code" className="ev-field" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="PK-001-02-03-000125-0" style={{ fontVariantNumeric: "tabular-nums" }} />
            </Field>
            <Field id="j-rel" label="You are their" hint="Your own code is theirs with this digit on the end, which is what that digit is for.">
              <select id="j-rel" className="ev-field" value={form.relationship} onChange={(e) => set("relationship", Number(e.target.value))}>
                {RELATIONSHIPS.filter((r) => r.code > 0).map((r) => (
                  <option key={r.code} value={r.code}>{r.label}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        {(role === "advisor" || role === "campus") && (
          <Field
            id="j-code"
            label="Your Edviko code"
            error={err("code")}
            hint={
              role === "advisor"
                ? "Issued by your campus, and it is what attaches your students to you."
                : "Your campus code with a supervisor number on the end."
            }
          >
            <input id="j-code" className="ev-field" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="PK-001-02-03-000000-0" style={{ fontVariantNumeric: "tabular-nums" }} />
          </Field>
        )}

        <button type="submit" className="ev-btn ev-btn--primary" disabled={busy} style={{ justifyContent: "center", marginTop: "0.4rem" }}>
          {busy ? "One moment" : "Create my account"}
        </button>
      </form>
    </AuthShell>
  );
}
