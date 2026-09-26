"use client";

import { useState, useSyncExternalStore } from "react";
import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import {
  analyse,
  emptyDraft,
  ESSAY_KEY,
  MAX_WORDS,
  MIN_WORDS,
  PROMPTS,
  PROMPT_SOURCE,
  readDraft,
  sentences,
  stamp,
  words,
  type Comment,
  type Draft,
} from "@/lib/edviko/essays";

/**
 * Where the essay is written, read back, and argued over.
 *
 * Three things on one screen, in the order they matter. The prompt, because
 * half of all weak essays answer a different one. The draft, with the word
 * count visible at all times, because 650 is a hard wall and discovering it
 * at the end costs a rewrite. And the reading: what is measurable about the
 * piece, handed over as evidence rather than as a score.
 *
 * The advisor's comments attach to a sentence rather than floating at the
 * bottom. "Paragraph three is vague" is an opinion; the same note pinned to
 * the sentence it is about is something a seventeen year old can act on at
 * eleven at night without waiting for a meeting.
 */
export function Essay() {
  const raw = useSyncExternalStore(subscribe(ESSAY_KEY), snapshot(ESSAY_KEY), serverSnapshot);
  const saved = readDraft(raw) ?? emptyDraft();

  const [text, setText] = useState<string | null>(null);
  const [promptId, setPromptId] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const [note, setNote] = useState("");

  const current = text ?? saved.text;
  const prompt = promptId ?? saved.promptId;
  const findings = analyse(current);
  const count = words(current).length;
  const lines = sentences(current);

  function persist(next: Partial<Draft>) {
    const merged: Draft = { ...saved, ...next };
    write(ESSAY_KEY, JSON.stringify(merged));
  }

  function save() {
    persist({
      text: current,
      promptId: prompt,
      versions: [...saved.versions, { at: stamp(), text: current }].slice(-20),
    });
  }

  function comment() {
    if (!note.trim()) return;
    const entry: Comment = { id: `c${saved.comments.length + 1}-${stamp()}`, by: "Advisor", at: stamp(), quote, text: note };
    persist({ text: current, promptId: prompt, comments: [...saved.comments, entry] });
    setNote("");
    setQuote("");
  }

  const over = count > MAX_WORDS;
  const under = count > 0 && count < MIN_WORDS;

  return (
    <>
      <EdvikoNav />
      <main className="ev-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", display: "grid", gap: "1.5rem" }}>
        <header>
          <p className="ev-label" style={{ color: "var(--accent)" }}>The personal essay</p>
          <h1 className="ev-h1" style={{ marginTop: "0.8rem", maxWidth: "24ch" }}>
            One essay. Every university you apply to reads the same one.
          </h1>
          <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.9rem", maxWidth: "62ch" }}>
            Between {MIN_WORDS} and {MAX_WORDS} words, and the only part of the application where you
            speak rather than your grades. Nothing here is scored. What can be measured is measured
            and handed to you; what it means is yours and your advisor&rsquo;s to decide.
          </p>
        </header>

        <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>Choose the question</span>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.9rem" }}>
            {PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPromptId(p.id)}
                className="ev-card"
                style={{
                  textAlign: "start",
                  padding: "0.8rem 1rem",
                  cursor: "pointer",
                  background: p.id === prompt ? "var(--surface-2)" : "transparent",
                  borderColor: p.id === prompt ? "var(--accent)" : "var(--line)",
                  color: "inherit",
                }}
              >
                <span className="ev-small" style={{ color: p.id === prompt ? "var(--accent)" : "var(--text-faint)" }}>
                  Prompt {p.id}
                </span>
                <span className="ev-body" style={{ display: "block", marginTop: "0.3rem" }}>{p.text}</span>
              </button>
            ))}
          </div>
          <p className="ev-small" style={{ marginTop: "1rem", color: "var(--text-faint)" }}>
            <a href={PROMPT_SOURCE.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
              {PROMPT_SOURCE.name}
            </a>
            <span> · read {PROMPT_SOURCE.asOf}{PROMPT_SOURCE.verified ? "" : " · check against the live page for this cycle before relying on it"}</span>
          </p>
        </section>

        <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <span className="ev-label" style={{ color: "var(--text-faint)" }}>Your draft</span>
            <span
              className="ev-small"
              style={{ color: over ? "var(--red)" : under ? "var(--paid)" : "var(--free)", fontVariantNumeric: "tabular-nums" }}
            >
              {count} / {MAX_WORDS} words
            </span>
          </div>
          <textarea
            className="ev-field"
            rows={16}
            value={current}
            placeholder="Start in the scene. Not with what the essay is about."
            onChange={(e) => setText(e.target.value)}
            style={{ marginTop: "0.9rem", resize: "vertical", lineHeight: 1.7 }}
          />
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button type="button" className="ev-btn ev-btn--primary" onClick={save}>
              Save this version
            </button>
            {saved.versions.length > 0 && (
              <span className="ev-small" style={{ alignSelf: "center", color: "var(--text-faint)" }}>
                {saved.versions.length} version{saved.versions.length === 1 ? "" : "s"} kept
              </span>
            )}
          </div>
        </section>

        {findings.length > 0 && (
          <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
            <span className="ev-label" style={{ color: "var(--text-faint)" }}>What can be measured</span>
            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              {findings.map((f) => (
                <div key={f.id} style={{ display: "grid", gap: "0.3rem" }}>
                  <span
                    className="ev-body"
                    style={{
                      fontWeight: 600,
                      color: f.tone === "problem" ? "var(--red)" : f.tone === "watch" ? "var(--paid)" : "var(--free)",
                    }}
                  >
                    {f.title}
                  </span>
                  <span className="ev-small" style={{ color: "var(--text-soft)" }}>{f.detail}</span>
                </div>
              ))}
            </div>
            <p className="ev-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
              None of this is a judgment of whether the essay is good. A model reading it properly,
              with your advisor seeing what it said, arrives when there is a server to run it on.
            </p>
          </section>
        )}

        <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>Advisor&rsquo;s notes</span>

          {saved.comments.length === 0 && (
            <p className="ev-small" style={{ marginTop: "0.8rem", color: "var(--text-faint)" }}>
              Nothing yet. A note pinned to a sentence is worth ten at the bottom of the page.
            </p>
          )}

          <div style={{ display: "grid", gap: "0.9rem", marginTop: "0.9rem" }}>
            {saved.comments.map((c) => (
              <div key={c.id} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "0.9rem" }}>
                {c.quote && (
                  <p className="ev-small" style={{ color: "var(--text-faint)", fontStyle: "italic" }}>&ldquo;{c.quote}&rdquo;</p>
                )}
                <p className="ev-body" style={{ marginTop: "0.2rem" }}>{c.text}</p>
                <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.2rem" }}>{c.by}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "0.7rem", marginTop: "1.3rem", paddingTop: "1.2rem", borderTop: "1px solid var(--line)" }}>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span className="ev-small" style={{ color: "var(--text-soft)" }}>Pin it to a sentence</span>
              <select className="ev-field" value={quote} onChange={(e) => setQuote(e.target.value)}>
                <option value="">The essay as a whole</option>
                {lines.map((l, i) => (
                  <option key={`${i}-${l.slice(0, 12)}`} value={l}>
                    {l.length > 70 ? `${l.slice(0, 70)}…` : l}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              className="ev-field"
              rows={2}
              value={note}
              placeholder="What would make this stronger, and why."
              onChange={(e) => setNote(e.target.value)}
              style={{ resize: "vertical" }}
            />
            <div>
              <button type="button" className="ev-btn ev-btn--ghost" onClick={comment} disabled={!note.trim()}>
                Add the note
              </button>
            </div>
          </div>
        </section>

        <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
          Everything on this page stays in this browser. Your advisor cannot see it from theirs, and
          nothing is sent anywhere, until there is a server that holds it properly.
        </p>
      </main>
    </>
  );
}
