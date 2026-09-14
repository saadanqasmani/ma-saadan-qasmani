"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { documents, providerLabel, type Doc } from "@/content/taraki/documents";
import { usePoints, Star } from "@/components/taraki/Points";
import { serverSnapshot, snapshot, subscribe, targetId, write } from "@/lib/taraki/browserStore";

const STORE = "tk-plan";

type Target = { id: string; name: string; country: string; done: string[] };
type PlanState = { targets: Target[] };

/**
 * The application workspace.
 *
 * Everything here lives in the student's own browser. No account, no server,
 * nothing about a sixteen-year-old's grades or plans leaving their machine.
 * That is a deliberate choice and not a placeholder for one: when accounts
 * arrive they will arrive on their own domain behind a real entity, and this
 * shape lifts straight into them.
 *
 * The gamification is not decoration. A university application is forty
 * small tasks owned by five different people, and the thing that makes
 * students give up is not difficulty, it is not being able to see where they
 * are. A ring that fills is an answer to "how much is left".
 */
export function Plan() {
  const raw = useSyncExternalStore(subscribe(STORE), snapshot(STORE), serverSnapshot);

  const state: PlanState = useMemo(() => {
    if (!raw) return { targets: [] };
    try {
      return JSON.parse(raw) as PlanState;
    } catch {
      return { targets: [] };
    }
  }, [raw]);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [stuck, setStuck] = useState<string | null>(null);
  const { award } = usePoints();

  function save(next: PlanState) {
    write(STORE, JSON.stringify(next));
  }

  function addTarget(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = targetId(name.trim(), country.trim());
    if (state.targets.some((t) => t.id === id)) return;
    save({ targets: [...state.targets, { id, name: name.trim(), country: country.trim(), done: [] }] });
    award("plan-first-target", 25);
    setName("");
    setCountry("");
    setOpen(id);
  }

  function toggleDoc(targetId: string, docId: string, el?: DOMRect) {
    const targets = state.targets.map((t) => {
      if (t.id !== targetId) return t;
      const has = t.done.includes(docId);
      return { ...t, done: has ? t.done.filter((d) => d !== docId) : [...t.done, docId] };
    });
    save({ targets });
    const target = targets.find((t) => t.id === targetId);
    if (target?.done.includes(docId)) {
      award(`doc-${targetId}-${docId}`, 5, el);
      if (target.done.length === documents.length) award(`ready-${targetId}`, 50, el);
    }
  }

  function remove(id: string) {
    save({ targets: state.targets.filter((t) => t.id !== id) });
  }

  return (
    <div>
      {/* Add a university */}
      <form onSubmit={addTarget} className="tk-pane" style={{ padding: "1.5rem" }}>
        <label className="tk-label" style={{ color: "var(--text-faint)" }}>
          Add a university to your list
        </label>
        <div style={{ marginTop: "0.9rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="University name"
            style={inputStyle}
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            style={{ ...inputStyle, maxWidth: "12rem" }}
          />
          <button type="submit" className="tk-btn tk-btn--primary">Add</button>
        </div>
        <p className="tk-small" style={{ marginTop: "0.85rem" }}>
          Type any university for now. Once the database is loaded you will pick from a list and
          the requirements will fill themselves in.
        </p>
      </form>

      {state.targets.length === 0 && (
        <div className="tk-pane tk-land" style={{ marginTop: "1rem", padding: "2rem", textAlign: "center" }}>
          <p className="tk-h2" style={{ fontSize: "1.125rem" }}>Nothing on your list yet.</p>
          <p className="tk-body" style={{ marginTop: "0.6rem" }}>
            Add the one you think about at night. You can be realistic later.
          </p>
        </div>
      )}

      {/* One card per university */}
      <div style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
        {state.targets.map((t) => {
          const required = documents.filter((d) => !d.optional);
          const doneRequired = required.filter((d) => t.done.includes(d.id)).length;
          const pct = Math.round((doneRequired / required.length) * 100);
          const ready = doneRequired === required.length;
          const isOpen = open === t.id;

          return (
            <div key={t.id} className="tk-pane" data-open={isOpen} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.1rem", flexWrap: "wrap" }}>
                <Ring pct={pct} />
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : t.id)}
                  style={{ all: "unset", cursor: "pointer", flex: 1, minWidth: "12rem" }}
                >
                  <h3 className="tk-h2" style={{ fontSize: "1.125rem" }}>{t.name}</h3>
                  <p className="tk-small" style={{ marginTop: "0.25rem" }}>
                    {t.country || "Country not set"} · {doneRequired} of {required.length} documents
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="tk-small"
                  style={{ all: "unset", cursor: "pointer", color: "var(--text-faint)" }}
                >
                  Remove
                </button>
              </div>

              <div className="tk-reveal" data-open={isOpen} style={{ marginTop: isOpen ? "1.5rem" : 0 }}>
                <div>
                  <DocList
                    target={t}
                    onToggle={toggleDoc}
                    onStuck={(docId) => setStuck(`${t.id}:${docId}`)}
                  />

                  {ready && (
                    <div className="tk-land" style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--free)" }}>
                      <span className="tk-label" style={{ color: "var(--free)" }}>Everything is in</span>
                      <p className="tk-body" style={{ marginTop: "0.6rem" }}>
                        You can file this yourself right now, and you should not feel you need
                        permission to. If you would rather someone read it first, a review is
                        part of Plus.
                      </p>
                      <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                        <Link href="/taraki/apply" className="tk-btn tk-btn--ghost">Apply myself</Link>
                        <Link href="/taraki/pricing" className="tk-btn tk-btn--primary">Have it reviewed</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stuck && <StuckPanel onClose={() => setStuck(null)} />}
    </div>
  );
}

function DocList({
  target,
  onToggle,
  onStuck,
}: {
  target: Target;
  onToggle: (t: string, d: string, el?: DOMRect) => void;
  onStuck: (docId: string) => void;
}) {
  const byProvider = useMemo(() => {
    const groups = new Map<string, Doc[]>();
    for (const d of documents) {
      const list = groups.get(d.from) ?? [];
      list.push(d);
      groups.set(d.from, list);
    }
    return [...groups.entries()];
  }, []);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {byProvider.map(([provider, docs]) => (
        <div key={provider}>
          <p className="tk-label" style={{ color: provider === "school" ? "var(--paid)" : "var(--text-faint)" }}>
            {providerLabel[provider as keyof typeof providerLabel]}
            {provider === "school" && " · ask early"}
          </p>
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {docs.map((d) => {
              const done = target.done.includes(d.id);
              return (
                <div
                  key={d.id}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "11px",
                    border: `1px solid ${done ? "var(--free)" : "var(--line)"}`,
                    background: done ? "transparent" : "var(--surface)",
                    transition: "border-color 0.35s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={(e) => onToggle(target.id, d.id, e.currentTarget.getBoundingClientRect())}
                      aria-pressed={done}
                      aria-label={`${d.name}: ${done ? "arranged" : "not yet"}`}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        flexShrink: 0,
                        width: "20px",
                        height: "20px",
                        marginTop: "2px",
                        borderRadius: "6px",
                        border: `1.5px solid ${done ? "var(--free)" : "var(--line-strong)"}`,
                        background: done ? "var(--free)" : "transparent",
                        display: "grid",
                        placeItems: "center",
                        transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    >
                      {done && (
                        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
                          <path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="var(--bg)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="tk-body" style={{ color: "var(--text)", textDecoration: done ? "line-through" : "none", opacity: done ? 0.55 : 1 }}>
                        {d.name}
                        {d.optional && <span className="tk-small"> · if asked for</span>}
                      </p>
                      <p className="tk-small" style={{ marginTop: "0.3rem" }}>{d.what}</p>
                      <p className="tk-small" style={{ marginTop: "0.35rem", color: "var(--text-soft)" }}>
                        {d.watch}
                      </p>
                      <div style={{ marginTop: "0.55rem", display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
                        <span className="tk-small">Allow about {d.leadDays} days</span>
                        <button
                          type="button"
                          onClick={() => onStuck(d.id)}
                          className="tk-small"
                          style={{ all: "unset", cursor: "pointer", color: "var(--accent)" }}
                        >
                          I am stuck on this
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The nudge. It offers the free answer first, because there usually is one. */
function StuckPanel({ onClose }: { onClose: () => void }) {
  // Escape closes it. Anything that covers the page and cannot be dismissed
  // from the keyboard is a trap.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label="Stuck"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 95,
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="tk-pane tk-land"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "1.85rem", width: "min(28rem, 100%)" }}
      >
        <span className="tk-label" style={{ color: "var(--accent)" }}>Stuck</span>
        <h3 className="tk-h2" style={{ marginTop: "0.85rem", fontSize: "1.25rem" }}>
          Try the free route first.
        </h3>
        <p className="tk-body" style={{ marginTop: "0.75rem" }}>
          Most of what stops people here is not knowing who to ask. The guide for this document
          says who produces it and how long it takes, and that solves it more often than not.
        </p>
        <p className="tk-body" style={{ marginTop: "0.75rem" }}>
          If it does not, Plus gets a person to look at your actual case: a document review, and
          a call with someone studying where you want to go.
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <button type="button" onClick={onClose} className="tk-btn tk-btn--ghost">
            I will try myself
          </button>
          <Link href="/taraki/pricing" className="tk-btn tk-btn--primary">See Plus</Link>
        </div>
      </div>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--line)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={pct === 100 ? "var(--free)" : "var(--accent)"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease" }}
        />
      </svg>
      <span
        className="tk-label"
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: "0.6875rem",
          color: pct === 100 ? "var(--free)" : "var(--text-soft)",
        }}
      >
        {pct === 100 ? <Star size={15} /> : `${pct}%`}
      </span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "11rem",
  padding: "0.75rem 0.9rem",
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "11px",
  color: "var(--text)",
  fontFamily: "inherit",
  fontSize: "0.95rem",
  outline: "none",
};
