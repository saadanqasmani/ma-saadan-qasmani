"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount, AuthPanel } from "@/components/taraki/Account";
import { completeness, gaps, saveProfile, signOut, type Profile } from "@/lib/taraki/account";

const YEARS: { id: Profile["year"]; label: string }[] = [
  { id: "year-11", label: "Year 11 / O Level" },
  { id: "year-12", label: "Year 12 / AS" },
  { id: "year-13", label: "Year 13 / A2" },
  { id: "finished", label: "Finished school" },
];

const ENGLISH: { id: Profile["englishTest"]; label: string }[] = [
  { id: "ielts", label: "IELTS" },
  { id: "toefl", label: "TOEFL" },
  { id: "duolingo", label: "Duolingo" },
  { id: "none", label: "None yet" },
];

/**
 * The profile, and what to do about it.
 *
 * The ring is not the point. The list underneath it is: "60% complete" tells
 * a student nothing, and "you have no English test, and four universities on
 * your list ask for one" tells them what to do this week.
 */
export function ProfileEditor() {
  const profile = useAccount();
  const [asking, setAsking] = useState(false);

  if (!profile) {
    return (
      <>
        <div className="tk-pane" style={{ padding: "2rem", textAlign: "center" }}>
          <p className="tk-h2" style={{ fontSize: "1.25rem" }}>No profile yet.</p>
          <p className="tk-body" style={{ marginTop: "0.6rem", maxWidth: "36ch", marginInline: "auto" }}>
            Make an account and we can tell you where you stand at every university instead of
            just listing them.
          </p>
          <button type="button" onClick={() => setAsking(true)} className="tk-btn tk-btn--primary" style={{ marginTop: "1.5rem" }}>
            Make an account
          </button>
        </div>
        {asking && <AuthPanel onClose={() => setAsking(false)} />}
      </>
    );
  }

  const missing = gaps(profile);
  const pct = completeness(profile);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    saveProfile({ ...profile!, [key]: value });
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Where they stand */}
      <div className="tk-pane" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "12rem" }}>
            <p className="tk-h2" style={{ fontSize: "1.2rem" }}>{profile.name}</p>
            <p className="tk-small" style={{ marginTop: "0.2rem" }}>{profile.email}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="tk-h2" style={{ fontSize: "1.6rem", color: pct === 100 ? "var(--free)" : "var(--accent)" }}>
              {pct}%
            </p>
            <p className="tk-small">profile complete</p>
          </div>
        </div>
        <div className="tk-xp" style={{ marginTop: "1rem" }}>
          <div className="tk-xp__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* What to do about it */}
      {missing.length > 0 && (
        <div className="tk-pane" style={{ padding: "1.5rem" }}>
          <span className="tk-label" style={{ color: "var(--accent)" }}>
            {missing.length} thing{missing.length > 1 ? "s" : ""} would change your chances
          </span>
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.8rem" }}>
            {missing.map((g) => (
              <div key={g.id} style={{ paddingBottom: "0.8rem", borderBottom: "1px solid var(--line)" }}>
                <p className="tk-body" style={{ color: "var(--text)" }}>{g.label}</p>
                <p className="tk-small" style={{ marginTop: "0.25rem" }}>{g.why}</p>
                {g.id === "grades" && (
                  <Link href="/taraki/equivalence" className="tk-small" style={{ color: "var(--accent)", display: "inline-block", marginTop: "0.4rem" }}>
                    Convert them now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* The form */}
      <div className="tk-pane" style={{ padding: "1.5rem", display: "grid", gap: "1.5rem" }}>
        <div>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>What year are you in</span>
          <div style={{ marginTop: "0.7rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {YEARS.map((y) => (
              <button key={y.id} type="button" className="tk-chip" data-on={profile.year === y.id}
                onClick={() => set("year", y.id)} style={{ minWidth: "auto", padding: "0.45rem 0.8rem" }}>
                {y.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>Your grades</span>
          <p className="tk-body" style={{ marginTop: "0.5rem" }}>
            {profile.percentage === null ? (
              <>Not converted yet. <Link href="/taraki/equivalence" style={{ color: "var(--accent)" }}>Do it here.</Link></>
            ) : (
              <>{profile.percentage.toFixed(1)}%{profile.system ? ` · ${profile.system}` : ""}</>
            )}
          </p>
        </div>

        <div>
          <label className="tk-label" htmlFor="p-sat" style={{ color: "var(--text-faint)" }}>SAT total, if you have one</label>
          <input id="p-sat" type="number" inputMode="numeric" placeholder="e.g. 1320"
            value={profile.satTotal ?? ""} style={field}
            onChange={(e) => set("satTotal", e.target.value ? Number(e.target.value) : null)} />
        </div>

        <div>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>English test</span>
          <div style={{ marginTop: "0.7rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {ENGLISH.map((t) => (
              <button key={t.id} type="button" className="tk-chip" data-on={profile.englishTest === t.id}
                onClick={() => set("englishTest", t.id)} style={{ minWidth: "auto", padding: "0.45rem 0.8rem" }}>
                {t.label}
              </button>
            ))}
          </div>
          {profile.englishTest && profile.englishTest !== "none" && (
            <input placeholder="Your score" value={profile.englishScore} style={field}
              onChange={(e) => set("englishScore", e.target.value)} />
          )}
        </div>

        <div>
          <label className="tk-label" htmlFor="p-act" style={{ color: "var(--text-faint)" }}>
            What you do outside class, one per line
          </label>
          <textarea id="p-act" rows={4} value={profile.activities.join("\n")} style={{ ...field, resize: "vertical" }}
            onChange={(e) => set("activities", e.target.value.split("\n").filter(Boolean))} />
        </div>
      </div>

      <button type="button" onClick={signOut} className="tk-small"
        style={{ all: "unset", cursor: "pointer", color: "var(--text-faint)", padding: "0.5rem 0" }}>
        Sign out
      </button>
    </div>
  );
}

const field: React.CSSProperties = {
  width: "100%",
  marginTop: "0.6rem",
  padding: "0.75rem 0.9rem",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "11px",
  color: "var(--text)",
  fontFamily: "inherit",
  fontSize: "1rem",
  outline: "none",
};
