"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { countries, hasAnyCosts } from "@/content/taraki/countries";
import { countryNotes, universities, SELECTION_SOURCE } from "@/content/taraki/universities";
import { placeTier } from "@/lib/taraki/wishlist";
import { AuthPanel, useAccount } from "@/components/taraki/Account";
import { assess } from "@/lib/taraki/chances";
import { usePoints } from "@/components/taraki/Points";
import { serverSnapshot, snapshot, subscribe, targetId, write } from "@/lib/taraki/browserStore";

const PLAN = "tk-plan";

type Target = { id: string; name: string; country: string; done: string[] };

/**
 * Browse the twelve, and put one on your list.
 *
 * This is not the matcher yet: matching needs entry requirements, and those
 * are not in the data. What it is, is the honest half that exists — every
 * destination, every university, and a plain statement of what is known
 * about each and what is not. A student can still do the useful thing,
 * which is start a list.
 */
export function Match() {
  const [country, setCountry] = useState<string>("DE");
  const raw = useSyncExternalStore(subscribe(PLAN), snapshot(PLAN), serverSnapshot);
  const resultRaw = useSyncExternalStore(subscribe("tk-result"), snapshot("tk-result"), serverSnapshot);
  const { award } = usePoints();
  const [nudged, setNudged] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [openUni, setOpenUni] = useState<string | null>(null);
  const account = useAccount();

  // What the student's own grades came to, if they have run the calculator.
  const studentPercent: number | null = useMemo(() => {
    if (account?.percentage != null) return account.percentage;
    if (!resultRaw) return null;
    try {
      return (JSON.parse(resultRaw) as { percentage: number }).percentage;
    } catch {
      return null;
    }
  }, [resultRaw, account]);

  const targets: Target[] = useMemo(() => {
    if (!raw) return [];
    try {
      return (JSON.parse(raw) as { targets: Target[] }).targets ?? [];
    } catch {
      return [];
    }
  }, [raw]);

  const list = universities[country] ?? [];
  const meta = countries.find((c) => c.code === country);
  const onList = (name: string) => targets.some((t) => t.name === name);

  function add(name: string, el?: DOMRect) {
    if (onList(name)) return;
    // The wish list is the signed-in half of the product.
    if (!account) {
      setAsking(true);
      return;
    }
    const where = meta?.name ?? country;
    const uni = list.find((x) => x.name === name);
    const tier = placeTier(studentPercent, uni?.minimumPercent?.value ?? null);
    const next = [
      ...targets,
      { id: targetId(name, where), name, country: where, tier, done: [] },
    ];
    write(PLAN, JSON.stringify({ targets: next }));
    award(`match-${name}`, 10, el);
    setNudged(name);
  }

  return (
    <div>
      {/* Countries */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {countries.map((c) => (
          <button
            key={c.code}
            type="button"
            className="tk-chip"
            data-on={country === c.code}
            onClick={() => setCountry(c.code)}
            style={{ minWidth: "auto", padding: "0.5rem 0.85rem" }}
          >
            {c.name}
            <span style={{ opacity: 0.55, marginLeft: "0.4rem" }}>
              {(universities[c.code] ?? []).length}
            </span>
          </button>
        ))}
      </div>

      {/* What is known about this country */}
      <div className="tk-pane" style={{ marginTop: "1.5rem", padding: "1.4rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" }}>
          <span className="tk-h2" style={{ fontSize: "1.25rem" }}>{meta?.name ?? country}</span>
          <span
            className="tk-label"
            style={{ color: meta && hasAnyCosts(meta) ? "var(--free)" : "var(--text-faint)" }}
          >
            {meta && hasAnyCosts(meta) ? "Costs sourced" : "Costs pending"}
          </span>
        </div>
        {meta?.summary && (
          <p className="tk-body" style={{ marginTop: "0.7rem", maxWidth: "58ch" }}>{meta.summary}</p>
        )}
        {countryNotes[country] && (
          <p className="tk-small" style={{ marginTop: "0.7rem", color: "var(--paid)" }}>
            {countryNotes[country]}
          </p>
        )}
      </div>

      {/* Universities */}
      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gap: "0.7rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {list.map((uni) => {
          const added = onList(uni.name);
          return (
            <div key={uni.id} className="tk-pane" style={{ padding: "1.15rem 1.25rem" }}>
              <h3 className="tk-h2" style={{ fontSize: "1rem" }}>{uni.name}</h3>
              <p className="tk-small" style={{ marginTop: "0.3rem" }}>{uni.city}</p>

              {uni.tuition ? (
                <Detail uni={uni} />
              ) : (
                <p className="tk-small" style={{ marginTop: "0.8rem", color: "var(--text-faint)" }}>
                  Fees, deadlines and requirements still being compiled
                </p>
              )}

              <button
                type="button"
                onClick={() => setOpenUni(openUni === uni.id ? null : uni.id)}
                className="tk-small"
                style={{ all: "unset", cursor: "pointer", marginTop: "0.9rem", display: "block", color: "var(--accent)" }}
              >
                {openUni === uni.id ? "Hide my chances" : "My chances here"}
              </button>

              <div className="tk-reveal" data-open={openUni === uni.id} style={{ marginTop: openUni === uni.id ? "0.9rem" : 0 }}>
                <div>
                  <Chances uni={uni} profile={account} onJoin={() => setAsking(true)} />
                </div>
              </div>

              <button
                type="button"
                disabled={added}
                onClick={(e) => add(uni.name, e.currentTarget.getBoundingClientRect())}
                className={`tk-btn ${added ? "tk-btn--ghost" : "tk-btn--primary"}`}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.6rem 1rem",
                  fontSize: "0.875rem",
                  opacity: added ? 0.6 : 1,
                  cursor: added ? "default" : "pointer",
                }}
              >
                {added ? "On your wish list" : "Add to my wish list"}
              </button>
            </div>
          );
        })}
      </div>

      {nudged && <SavedNudge name={nudged} onClose={() => setNudged(null)} />}
      {asking && (
        <AuthPanel
          onClose={() => setAsking(false)}
          reason="Make an account to build your wish list"
        />
      )}

      <p className="tk-small" style={{ marginTop: "2rem", maxWidth: "62ch" }}>
        Which institutions are listed is drawn from the{" "}
        <a href={SELECTION_SOURCE.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
          {SELECTION_SOURCE.label}
        </a>
        , read {SELECTION_SOURCE.asOf}. No individual ranking is claimed, because a rank quoted
        without the row in front of you is the kind of small invention that costs trust.
      </p>
    </div>
  );
}


/** What we actually hold for a university, with its source beside it. */
function Detail({ uni }: { uni: (typeof universities)[string][number] }) {
  const fmt = (n: number, c: string) => `${c === "USD" ? "$" : c === "EUR" ? "\u20ac" : c + " "}${n.toLocaleString()}`;
  return (
    <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.45rem" }}>
      {uni.tuition && (
        <p className="tk-small">
          <strong style={{ color: "var(--text)" }}>
            {fmt(uni.tuition.value.low, uni.tuition.value.currency)}
          </strong>{" "}
          a year
        </p>
      )}
      {uni.applicationFee && (
        <p className="tk-small">
          {fmt(uni.applicationFee.value.amount, uni.applicationFee.value.currency)} to apply
        </p>
      )}
      {uni.deadlines && (
        <p className="tk-small">
          Closes {uni.deadlines.value[uni.deadlines.value.length - 1].closes}
        </p>
      )}
      {uni.tuition?.verified && (
        <a
          href={uni.tuition.url}
          target="_blank"
          rel="noreferrer"
          className="tk-small"
          style={{ color: "var(--accent)" }}
        >
          From the university, read {uni.tuition.asOf}
        </a>
      )}
    </div>
  );
}

/**
 * Said at the moment it matters: this is saved, but only here.
 *
 * Not "log in or lose it", because that would be a threat and it would also
 * be untrue. It is saved. What an account adds is the same list on another
 * device, and that is worth saying plainly enough to be believed.
 */
function SavedNudge({ name, onClose }: { name: string; onClose: () => void }) {
  // Escape closes it, like every other panel here. Anything that covers the
  // page and ignores the keyboard is a trap.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="tk-modal" role="dialog" aria-label="Saved" onClick={onClose}>
      <div className="tk-pane tk-land tk-modal__box" onClick={(e) => e.stopPropagation()}>
        <span className="tk-label" style={{ color: "var(--free)" }}>Saved</span>
        <h3 className="tk-h2" style={{ marginTop: "0.8rem", fontSize: "1.2rem" }}>
          {name} is on your wish list.
        </h3>
        <p className="tk-body" style={{ marginTop: "0.75rem" }}>
          It is saved on this phone. Open Taraki Company on a laptop and it will not be there,
          and clearing your browser will clear it.
        </p>
        <p className="tk-body" style={{ marginTop: "0.75rem" }}>
          An account fixes both, and keeps your grades with your list so we can sort your
          universities into dream, likely and safe for you. Accounts open with our own domain.
          Everything you have used so far stays free either way.
        </p>
        <div style={{ marginTop: "1.6rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <button type="button" onClick={onClose} className="tk-btn tk-btn--ghost">
            Keep going
          </button>
          <Link href="/taraki/plan" className="tk-btn tk-btn--primary">See my wish list</Link>
        </div>
      </div>
    </div>
  );
}


/**
 * What this university asks for, beside what you have.
 *
 * Line by line, each one sourced. No percentage, because nobody can compute
 * the odds that a particular student gets into a particular university, and
 * a number like that would be believed and planned around.
 */
function Chances({
  uni,
  profile,
  onJoin,
}: {
  uni: (typeof universities)[string][number];
  profile: ReturnType<typeof useAccount>;
  onJoin: () => void;
}) {
  if (!profile) {
    return (
      <div style={{ padding: "0.9rem 1rem", borderRadius: "11px", border: "1px solid var(--line)" }}>
        <p className="tk-small">
          Make an account and this shows what they ask for beside what you have, line by line.
        </p>
        <button type="button" onClick={onJoin} className="tk-small" style={{ all: "unset", cursor: "pointer", marginTop: "0.5rem", color: "var(--accent)" }}>
          Make one, it is free
        </button>
      </div>
    );
  }

  const a = assess(uni, profile);

  return (
    <div style={{ padding: "0.9rem 1rem", borderRadius: "11px", border: "1px solid var(--line)" }}>
      <p className="tk-small" style={{ color: "var(--text)" }}>{a.headline}</p>

      {a.checks.length > 0 && (
        <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.55rem" }}>
          {a.checks.map((c) => (
            <div key={c.label}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                <span className="tk-small" style={{ color: "var(--text)" }}>{c.label}</span>
                <span
                  className="tk-small"
                  style={{
                    color:
                      c.status === "over" || c.status === "meets"
                        ? "var(--free)"
                        : c.status === "under"
                          ? "var(--paid)"
                          : "var(--text-faint)",
                  }}
                >
                  {c.yours} · they ask {c.asked}
                </span>
              </div>
              {c.todo && (
                <p className="tk-small" style={{ marginTop: "0.2rem", color: "var(--text-soft)" }}>
                  {c.todo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {a.nothingToCompare && (
        <p className="tk-small" style={{ marginTop: "0.6rem" }}>
          We will not guess. Once this one&apos;s requirements are compiled it will appear here.
        </p>
      )}
    </div>
  );
}
