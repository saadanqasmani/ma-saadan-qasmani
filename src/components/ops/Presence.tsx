"use client";

import { useState } from "react";
import { PRESENCE, hoursBetween, presenceMeta, type Persona, type Presence } from "@/lib/ops/model";
import { setPresence, useOps } from "@/lib/ops/store";
import { Avatar, Sheet, nameOf } from "./ui";

/**
 * Where each of them is, right now.
 *
 * Not attendance, which is the record of a day and is counted. This is the
 * ten minute question: is he at his desk, or has he gone for a smoke, and
 * is it worth walking over. One tap to set, and it says how long it has
 * been, because "on a break" set at nine in the morning is not information.
 */

function sinceLabel(since: string): string {
  if (!since) return "";
  const mins = Math.round((Date.now() - new Date(since).getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 1) return "just now";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m`;
  return "a while";
}

/** The chip in the top bar: mine, and tappable. */
export function PresenceChip({ who }: { who: Persona }) {
  const { state } = useOps();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const mine: Presence | undefined = state.presence[who];
  const meta = presenceMeta(mine?.state ?? "out");

  function pick(id: Presence["state"]) {
    setPresence(who, id, note.trim());
    setNote("");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="presence"
        data-here={meta.here}
        onClick={() => setOpen(true)}
        title="Say where you are"
      >
        <span className="presence__dot" aria-hidden>
          {meta.glyph}
        </span>
        <span className="presence__label">{meta.label}</span>
        <span className="presence__short">{meta.short}</span>
        {mine?.since && <span className="presence__since">{sinceLabel(mine.since)}</span>}
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} label="Where are you">
        <h2 className="h2">Where are you?</h2>
        <p className="hint" style={{ marginTop: 6 }}>
          {nameOf(who === "saadan" ? "osman" : "saadan")} sees this, and how long it has been.
        </p>
        <div className="stack stack--tight" style={{ marginTop: 16 }}>
          {PRESENCE.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn ${p.id === mine?.state ? "btn--primary" : "btn--ghost"}`}
              style={{ justifyContent: "flex-start" }}
              onClick={() => pick(p.id)}
            >
              <span aria-hidden>{p.glyph}</span> {p.label}
            </button>
          ))}
        </div>
        <label className="fieldset" style={{ marginTop: 16 }}>
          <span className="label">Add a word (optional)</span>
          <input
            className="field"
            placeholder="Back by three"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
      </Sheet>
    </>
  );
}

/** The other person's state, read only. */
export function PresenceOf({ who }: { who: Persona }) {
  const { state } = useOps();
  const p = state.presence[who];
  const meta = presenceMeta(p?.state ?? "out");

  return (
    <div className="g stack stack--tight">
      <div className="row" style={{ gap: 10 }}>
        <Avatar who={who} />
        <div className="grow" style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600 }}>
            {nameOf(who)} is {meta.label.toLowerCase()}
          </p>
          <p className="small muted">
            {p?.since ? `for ${sinceLabel(p.since)}` : "no status set today"}
            {p?.note ? ` · ${p.note}` : ""}
          </p>
        </div>
        <span className="dot" data-busy={false} style={{ background: meta.here ? "#28c76f" : "var(--ink-faint)" }} />
      </div>
    </div>
  );
}

/** Hours logged this week, for the overview. Reuses the attendance record. */
export function hoursThisWeek(attendance: Record<string, { hours: number }>, from: string, to: string): number {
  return hoursBetween(attendance as never, from, to);
}
