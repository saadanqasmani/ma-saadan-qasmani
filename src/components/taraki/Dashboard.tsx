"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useAccount } from "@/components/taraki/Account";
import { FitCard } from "@/components/taraki/Career";
import { documents } from "@/content/taraki/documents";
import { completeness, gaps } from "@/lib/taraki/account";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/taraki/browserStore";
import { isAnswered, listOf, recommend } from "@/lib/taraki/careerFit";
import { STAGES, currentStage, doneStages, type StageId } from "@/lib/taraki/journey";
import { tierMeta, type Tier } from "@/lib/taraki/wishlist";

/**
 * The student's own command centre.
 *
 * One question answered at the top of the page: where am I, and what is the
 * single next thing. Everything under it is evidence for that answer rather
 * than a second set of tabs.
 */

const PLAN = "tk-plan";
const CLAIMED = "tk-journey";

type Target = { id: string; name: string; country: string; tier?: Tier; done: string[] };

function usePlan(): Target[] {
  const raw = useSyncExternalStore(subscribe(PLAN), snapshot(PLAN), serverSnapshot);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as { targets?: Target[] }).targets ?? [];
  } catch {
    return [];
  }
}

function useClaimed(): StageId[] {
  const raw = useSyncExternalStore(subscribe(CLAIMED), snapshot(CLAIMED), serverSnapshot);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StageId[];
  } catch {
    return [];
  }
}

export function Dashboard() {
  const account = useAccount();
  const targets = usePlan();
  const claimed = useClaimed();

  const tiers = {
    dream: targets.filter((t) => t.tier === "dream").length,
    likely: targets.filter((t) => t.tier === "likely").length,
    safe: targets.filter((t) => t.tier === "safe").length,
  };
  const anyDocsComplete = targets.some((t) => t.done.length >= documents.length);
  const done = doneStages({ profile: account, tiers, anyDocsComplete, claimed });
  const now = currentStage(done);
  const missing = account ? gaps(account) : [];
  const percent = account ? completeness(account) : 0;

  function claim(id: StageId) {
    const next = claimed.includes(id) ? claimed.filter((c) => c !== id) : [...claimed, id];
    write(CLAIMED, JSON.stringify(next));
  }

  if (!account) {
    return (
      <div className="tk-card" style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <h2 className="tk-h2">Nothing to show yet.</h2>
        <p className="tk-body" style={{ marginTop: "0.8rem", color: "var(--text-soft)", maxWidth: "48ch" }}>
          Make an account and this becomes your own record: where you are, what is missing, and the one thing to do
          next. It stays on this device.
        </p>
        <Link href="/taraki/career" className="tk-btn tk-btn--primary" style={{ marginTop: "1.5rem" }}>
          Start with the career questions
        </Link>
      </div>
    );
  }

  const fits = isAnswered(account.assessment) ? recommend(account.assessment) : null;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <section className="tk-card" style={{ padding: "clamp(1.4rem, 3vw, 2rem)", borderColor: "var(--accent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <span className="tk-label" style={{ color: "var(--accent)" }}>Next</span>
          <span className="tk-small" style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
            {account.id || "No student number yet"}
          </span>
        </div>
        <h2 className="tk-h1" style={{ marginTop: "0.8rem", maxWidth: "18ch" }}>{now.label}</h2>
        <p className="tk-body" style={{ marginTop: "0.7rem", color: "var(--text-soft)", maxWidth: "50ch" }}>{now.means}</p>
        <p className="tk-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
          {done.size} of {STAGES.length} stages behind you · profile {percent}% complete
        </p>
      </section>

      <section className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
        <span className="tk-label" style={{ color: "var(--text-faint)" }}>The whole road</span>
        <ol className="tk-journey" style={{ marginTop: "1.2rem" }}>
          {STAGES.map((s) => {
            const finished = done.has(s.id);
            return (
              <li key={s.id} data-done={finished} data-now={s.id === now.id}>
                <span className="tk-journey__dot" aria-hidden />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", flexWrap: "wrap" }}>
                    <span className="tk-body" style={{ fontWeight: 600 }}>{s.label}</span>
                    {!s.automatic && (
                      <button
                        type="button"
                        className="tk-small"
                        onClick={() => claim(s.id)}
                        style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: finished ? "var(--free)" : "var(--accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                      >
                        {finished ? "Done. Undo?" : "Mark done"}
                      </button>
                    )}
                    {s.automatic && finished && (
                      <span className="tk-small" style={{ color: "var(--free)" }}>Done</span>
                    )}
                  </div>
                  <p className="tk-small" style={{ color: "var(--text-faint)" }}>{s.means}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="tk-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
          The stages without a button are worked out from what you have already done here, so they cannot drift away
          from the truth. The rest happen out in the world, so you tell us.
        </p>
      </section>

      {missing.length > 0 && (
        <section className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          <span className="tk-label" style={{ color: "var(--paid)" }}>What is missing</span>
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
            {missing.map((g) => (
              <div key={g.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                <p className="tk-body" style={{ fontWeight: 600 }}>{g.label}</p>
                <p className="tk-small" style={{ color: "var(--text-soft)" }}>{g.why}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>Your shelves</span>
          <Link href="/taraki/plan" className="tk-small" style={{ color: "var(--accent)" }}>Open the wish list</Link>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {(["dream", "likely", "safe"] as Tier[]).map((t) => (
            <div key={t}>
              <p className="tk-h2" style={{ color: tierMeta[t].tone }}>{tiers[t as "dream" | "likely" | "safe"]}</p>
              <p className="tk-small" style={{ color: "var(--text-faint)" }}>{tierMeta[t].label}</p>
            </div>
          ))}
        </div>
        {tiers.safe === 0 && (
          <p className="tk-small" style={{ marginTop: "1rem", color: "var(--paid)" }}>
            No safe university on the list. That is the one that decides whether you go anywhere at all.
          </p>
        )}
      </section>

      {fits && fits.primary.length > 0 && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <span className="tk-label" style={{ color: "var(--accent)" }}>Where your answers point</span>
            <Link href="/taraki/career" className="tk-small" style={{ color: "var(--accent)" }}>Answer again</Link>
          </div>
          <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
            {fits.primary.slice(0, 2).map((f) => (
              <FitCard key={f.career.id} fit={f} />
            ))}
          </div>
        </section>
      )}

      {fits && fits.shut.length > 0 && (
        <section className="tk-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)", borderColor: "var(--paid)" }}>
          <span className="tk-label" style={{ color: "var(--paid)" }}>Doors your subjects have closed</span>
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.7rem" }}>
            {fits.shut.map((f) => (
              <p key={f.career.id} className="tk-small">
                <strong style={{ color: "var(--text)" }}>{f.career.name}</strong>
                <span style={{ color: "var(--text-soft)" }}> needs {listOf(f.career.required)}, and you have not listed {f.missing.join(" or ")}.</span>
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
