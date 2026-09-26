"use client";

import { useState, useSyncExternalStore } from "react";
import { Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import {
  DEADLINE_LABEL,
  TEST_POLICY_LABEL,
  importCommonAppCsv,
  requirementsOf,
  upcoming,
  type ImportResult,
  type Upcoming,
  type UsProgramme,
} from "@/lib/edviko/usAdmissions";

const GRID_KEY = "ev-us-grid";

type Stored = {
  rows: UsProgramme[];
  loadedAt: string;
  source: { name: string; url: string; asOf: string; verified: boolean };
};

/**
 * The American grid, loaded from the file that publishes it.
 *
 * Deliberately an import rather than a dataset shipped in the source. Nine
 * hundred institutions' deadlines change every year, and a copy inside this
 * repository would be wrong by the following autumn with nothing to say so.
 * What is shipped is the reader: it maps by column name rather than by
 * position, refuses any date it cannot parse instead of guessing, and hands
 * back every cell it could not read with the row and column it came from.
 *
 * American dates are the trap. 11/1/2026 is the first of November; reading
 * it as the eleventh of January moves a deadline by ten months, and nobody
 * notices until the student has missed it.
 */
export function Deadlines() {
  const raw = useSyncExternalStore(subscribe(GRID_KEY), snapshot(GRID_KEY), serverSnapshot);
  const stored: Stored | null = (() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Stored;
    } catch {
      return null;
    }
  })();

  const [text, setText] = useState("");
  const [name, setName] = useState("Common App first-year deadlines, fees and requirements");
  const [url, setUrl] = useState("https://www.commonapp.org");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [ahead, setAhead] = useState<Upcoming[]>([]);

  function load() {
    const now = new Date();
    const asOf = now.toISOString().slice(0, 10);
    const parsed = importCommonAppCsv(text, { name, url, asOf, verified: false });
    setResult(parsed);
    setAhead(upcoming(parsed.rows, now, 400));
    if (parsed.rows.length > 0) {
      const next: Stored = {
        rows: parsed.rows,
        loadedAt: now.toISOString(),
        source: { name, url, asOf, verified: false },
      };
      write(GRID_KEY, JSON.stringify(next));
    }
  }

  function clear() {
    write(GRID_KEY, "");
    setResult(null);
    setAhead([]);
  }

  const rows = stored?.rows ?? [];

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>United States deadlines</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          One published file decides most of what an American application demands and by when. Load it
          here and every requirement, fee, test policy and date becomes something the system can plan
          against. Nothing is typed in from memory, and every row keeps the date it was read.
        </p>
      </header>

      {rows.length > 0 && (
        <div className="ev-tiles">
          <Tile n={rows.length} label="Institutions loaded" />
          <Tile n={ahead.length || "—"} label="Deadlines ahead" note="within a year of loading" />
          <Tile n={rows.filter((r) => r.personalEssay).length} label="Want the personal essay" />
          <Tile n={rows.filter((r) => r.testPolicy === "required").length} label="Require SAT or ACT" tone="amber" />
          <Tile n={rows.filter((r) => r.feeWaiver === "accepted").length} label="Take a fee waiver" tone="green" />
        </div>
      )}

      <Panel title="Load the published file" aside={stored ? `Last loaded ${stored.source.asOf}` : "Nothing loaded yet"}>
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span className="ev-label" style={{ color: "var(--text-soft)" }}>Where this came from</span>
            <input className="ev-field" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span className="ev-label" style={{ color: "var(--text-soft)" }}>Link to it</span>
            <input className="ev-field" value={url} onChange={(e) => setUrl(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: "0.35rem" }}>
            <span className="ev-label" style={{ color: "var(--text-soft)" }}>The file, as CSV</span>
            <textarea
              className="ev-field"
              rows={6}
              value={text}
              placeholder="Common App member,School type,ED,EA,RD/Rolling,US,Intl,Common App fee waiver,Personal essay,Test policy,TS,CR,MR"
              onChange={(e) => setText(e.target.value)}
              style={{ resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: "0.8125rem" }}
            />
            <span className="ev-small" style={{ color: "var(--text-faint)" }}>
              Export the published grid to CSV and paste it whole, header row included. Columns are
              matched by name, not by position, because position changes between years and a column
              out by one moves every deadline in the country into the wrong category.
            </span>
          </label>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button type="button" className="ev-btn ev-btn--primary" onClick={load} disabled={!text.trim()}>
              Read it
            </button>
            {stored && (
              <button type="button" className="ev-btn ev-btn--ghost" onClick={clear}>
                Clear what is loaded
              </button>
            )}
          </div>
        </div>
      </Panel>

      {result && (
        <Panel
          title="What the file said"
          aside={`${result.rows.length} institutions · ${result.problems.length} cells refused`}
        >
          {result.ignored.length > 0 && (
            <p className="ev-small" style={{ color: "var(--text-faint)" }}>
              Columns this reader does not know, left alone: {result.ignored.join(", ")}.
            </p>
          )}
          {result.problems.length === 0 ? (
            <p className="ev-small" style={{ color: "var(--free)", marginTop: "0.6rem" }}>
              Every cell read cleanly.
            </p>
          ) : (
            <div style={{ marginTop: "0.6rem", display: "grid", gap: "0.4rem" }}>
              {result.problems.slice(0, 25).map((p, i) => (
                <p key={`${p.row}-${p.field}-${i}`} className="ev-small" style={{ color: "var(--paid)" }}>
                  Row {p.row}, {p.field}: &ldquo;{p.value}&rdquo; — {p.why}
                </p>
              ))}
              {result.problems.length > 25 && (
                <p className="ev-small" style={{ color: "var(--text-faint)" }}>
                  and {result.problems.length - 25} more. Fix the file rather than the reader.
                </p>
              )}
            </div>
          )}
        </Panel>
      )}

      {ahead.length > 0 && (
        <Panel title="Next deadlines" aside="Soonest first" flush>
          {ahead.slice(0, 30).map((u) => (
            <Row
              key={`${u.programme.name}-${u.kind}`}
              title={u.programme.name}
              sub={`${DEADLINE_LABEL[u.kind]} · ${u.date}${u.binding ? " · binding, one institution only" : ""}`}
              end={
                <Tag tone={u.inDays <= 14 ? "red" : u.inDays <= 45 ? "amber" : undefined}>
                  {u.inDays === 0 ? "today" : `${u.inDays}d`}
                </Tag>
              }
            />
          ))}
        </Panel>
      )}

      {rows.length > 0 && (
        <Panel title="What each one asks for" aside="First twenty" flush>
          {rows.slice(0, 20).map((p) => (
            <Row
              key={p.name}
              title={p.name}
              sub={
                <>
                  {TEST_POLICY_LABEL[p.testPolicy]}
                  {requirementsOf(p).length > 0 && ` · ${requirementsOf(p).length} requirements`}
                  {p.feeInternationalUsd ? ` · $${p.feeInternationalUsd} international fee` : ""}
                </>
              }
              end={
                <span className="ev-small" style={{ color: "var(--text-faint)" }}>
                  {Object.keys(p.deadlines).length} deadline{Object.keys(p.deadlines).length === 1 ? "" : "s"}
                </span>
              }
            />
          ))}
        </Panel>
      )}

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        This is a reference, not a pipe. There is no public interface for filing an American
        application from another system, and operating on a student&rsquo;s own login is against the
        terms they agreed to. What this does is know every requirement and every date, prepare the
        student against them, and hand them a finished file to submit themselves. Loaded data stays
        on this device.
      </p>
    </div>
  );
}
