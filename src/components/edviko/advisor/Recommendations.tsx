"use client";

import { useState, useSyncExternalStore } from "react";
import { Panel, Tag } from "@/components/edviko/portal/parts";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import {
  fileRecommendation,
  forStudent,
  missingFields,
  readRecommendations,
  RECOMMENDATIONS_KEY,
  REQUIRED,
  SOURCES,
  type Recommendation,
  type Source,
} from "@/lib/edviko/cases";

/**
 * Recording a recommendation, in full or not at all.
 *
 * The form refuses to be short. Six fields are required, and the two people
 * skip — what else was considered, and what would make this wrong — are the
 * two that make the record worth keeping. An advisor who cannot name an
 * alternative has not advised, they have preferred; and a risk written down
 * before the deposit is a professional act, while the same sentence
 * afterwards is an excuse.
 *
 * Saved on the device for now, like everything else here, and it says so.
 * The shape is the shape the table will have.
 */
export function Recommendations({ student, advisor }: { student: string; advisor: string }) {
  const raw = useSyncExternalStore(
    subscribe(RECOMMENDATIONS_KEY),
    snapshot(RECOMMENDATIONS_KEY),
    serverSnapshot
  );
  const all = readRecommendations(raw);
  const mine = forStudent(all, student);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Recommendation>>({ source: "advisor", reviewInDays: 30 });
  const [problem, setProblem] = useState<string[]>([]);

  function file() {
    const missing = missingFields(draft);
    setProblem(missing);
    if (missing.length > 0) return;

    const entry = fileRecommendation(draft, student, advisor);

    write(RECOMMENDATIONS_KEY, JSON.stringify([...all, entry]));
    setDraft({ source: "advisor", reviewInDays: 30 });
    setOpen(false);
  }

  return (
    <Panel
      title="Recommendations on record"
      aside={mine.length === 0 ? "None yet" : `${mine.length} filed`}
    >
      {mine.length === 0 && (
        <p className="ev-small" style={{ color: "var(--text-faint)" }}>
          Nothing has been formally advised yet. A conversation that was not written down did not
          happen, as far as the next advisor is concerned.
        </p>
      )}

      {mine.map((r) => (
        <article key={r.id} style={{ paddingBlock: "0.9rem", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
            <h3 style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{r.what}</h3>
            <Tag>{SOURCES.find((s) => s.id === r.source)?.label}</Tag>
          </div>
          <dl style={{ display: "grid", gap: "0.45rem", marginTop: "0.6rem" }}>
            {[
              ["Why", r.why],
              ["Evidence", r.evidence],
              ["Alternatives", r.alternatives],
              ["Risks", r.risks],
              ["Student and family said", r.response],
              ["Next action", r.nextAction],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} style={{ display: "grid", gridTemplateColumns: "10rem 1fr", gap: "0.6rem" }}>
                  <dt className="ev-small" style={{ color: "var(--text-faint)" }}>{k}</dt>
                  <dd className="ev-small" style={{ color: "var(--text-soft)" }}>{v}</dd>
                </div>
              ))}
          </dl>
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.6rem" }}>
            {r.advisor} · review in {r.reviewInDays} days
          </p>
        </article>
      ))}

      {!open && (
        <button type="button" className="ev-btn ev-btn--ghost" style={{ marginTop: "1rem" }} onClick={() => setOpen(true)}>
          Record a recommendation
        </button>
      )}

      {open && (
        <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.9rem" }}>
          {REQUIRED.map((f) => (
            <label key={f.field} style={{ display: "grid", gap: "0.35rem" }}>
              <span className="ev-label" style={{ color: "var(--text-soft)" }}>{f.label}</span>
              <textarea
                className="ev-field"
                rows={2}
                value={String(draft[f.field] ?? "")}
                onChange={(e) => setDraft((d) => ({ ...d, [f.field]: e.target.value }))}
                style={{ resize: "vertical" }}
              />
              <span className="ev-small" style={{ color: "var(--text-faint)" }}>{f.hint}</span>
            </label>
          ))}

          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span className="ev-label" style={{ color: "var(--text-soft)" }}>What the student and family said</span>
            <textarea
              className="ev-field"
              rows={2}
              value={String(draft.response ?? "")}
              onChange={(e) => setDraft((d) => ({ ...d, response: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </label>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span className="ev-label" style={{ color: "var(--text-soft)" }}>Review in (days)</span>
              <input
                className="ev-field"
                type="number"
                min={1}
                value={Number(draft.reviewInDays ?? 30)}
                onChange={(e) => setDraft((d) => ({ ...d, reviewInDays: Number(e.target.value) }))}
                style={{ width: "7rem" }}
              />
            </label>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span className="ev-label" style={{ color: "var(--text-soft)" }}>Where this came from</span>
              <select
                className="ev-field"
                value={draft.source ?? "advisor"}
                onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value as Source }))}
              >
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {problem.length > 0 && (
            <p className="ev-small" style={{ color: "var(--red)" }}>
              Still missing: {problem.join(", ")}. A recommendation without these cannot be reviewed by
              anyone else, which is the only reason to file one.
            </p>
          )}

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button type="button" className="ev-btn ev-btn--primary" onClick={file}>File it</button>
            <button type="button" className="ev-btn ev-btn--ghost" onClick={() => setOpen(false)}>Cancel</button>
          </div>

          <p className="ev-small" style={{ color: "var(--text-faint)" }}>
            Saved on this device. There is no server yet, so nothing here reaches the campus or the
            student, and nothing leaves this browser.
          </p>
        </div>
      )}
    </Panel>
  );
}
