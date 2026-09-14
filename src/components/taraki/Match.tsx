"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { countries, hasAnyCosts } from "@/content/taraki/countries";
import { countryNotes, universities, SELECTION_SOURCE } from "@/content/taraki/universities";
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
  const { award } = usePoints();

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
    const where = meta?.name ?? country;
    const next = [...targets, { id: targetId(name, where), name, country: where, done: [] }];
    write(PLAN, JSON.stringify({ targets: next }));
    award(`match-${name}`, 10, el);
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

              <p className="tk-small" style={{ marginTop: "0.8rem", color: "var(--text-faint)" }}>
                Entry requirements and fees not loaded yet
              </p>

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
                {added ? "On your list" : "Add to my list"}
              </button>
            </div>
          );
        })}
      </div>

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
