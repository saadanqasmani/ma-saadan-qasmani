"use client";

import { useState } from "react";
import { newId, type Ask, type Persona } from "@/lib/ops/model";
import { removeAsk, upsertAsk, useOps } from "@/lib/ops/store";
import { Avatar, Confirm, Empty, nameOf, useCelebrate, whenLabel } from "./ui";

/**
 * Small questions, answered without a conversation.
 *
 * The thing that actually holds up a day is waiting on a yes. Two buttons
 * answer most of them in three seconds, and the box underneath is there for
 * the ones where two buttons would be a lie.
 *
 * Unanswered questions sit at the top and stay there. That is the point.
 */
export function Asks({ who }: { who: Persona }) {
  const { state } = useOps();
  const other: Persona = who === "saadan" ? "osman" : "saadan";
  const [draft, setDraft] = useState("");
  const { toast, burst } = useCelebrate();

  const open = state.asks.filter((a) => a.answer === null);
  const answered = state.asks.filter((a) => a.answer !== null).slice(0, 8);
  const mine = open.filter((a) => a.by === who);
  const forMe = open.filter((a) => a.by !== who);

  function ask(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    upsertAsk({ id: newId("ask"), by: who, at: new Date().toISOString(), text, answer: null, answeredAt: null, reply: "" });
    setDraft("");
    toast(`Asked ${nameOf(other)}.`, { tone: "blue" });
  }

  return (
    <div className="stack">
      <form onSubmit={ask} className="g g--pop stack stack--tight">
        <label className="label" htmlFor="ask-box">
          Ask {nameOf(other)} something small
        </label>
        <div className="row row--nowrap">
          <input
            id="ask-box"
            className="field grow"
            placeholder="Something answerable with yes or no"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
            Ask
          </button>
        </div>
        <p className="hint">
          Phrase it so yes or no finishes it. {nameOf(other)} can still write a longer answer when that will not do.
        </p>
      </form>

      {forMe.length > 0 && (
        <section className="g g--yellow stack">
          <span className="label" style={{ color: "#7a5c00" }}>
            {forMe.length} waiting on you
          </span>
          <div className="stack stack--tight">
            {forMe.map((a) => (
              <AskRow key={a.id} ask={a} who={who} onAnswered={burst} />
            ))}
          </div>
        </section>
      )}

      {mine.length > 0 && (
        <section className="g stack">
          <span className="label">Waiting on {nameOf(other)}</span>
          <div className="stack stack--tight">
            {mine.map((a) => (
              <AskRow key={a.id} ask={a} who={who} onAnswered={burst} />
            ))}
          </div>
        </section>
      )}

      {open.length === 0 && (
        <Empty title="Nothing outstanding" body="No question is waiting on either of you." />
      )}

      {answered.length > 0 && (
        <section className="g stack stack--tight">
          <span className="label">Answered</span>
          {answered.map((a) => (
            <AskRow key={a.id} ask={a} who={who} onAnswered={burst} />
          ))}
        </section>
      )}
    </div>
  );
}

function AskRow({ ask, who, onAnswered }: { ask: Ask; who: Persona; onAnswered: () => void }) {
  const [writing, setWriting] = useState(false);
  const [reply, setReply] = useState(ask.reply);
  const { toast } = useCelebrate();
  const mine = ask.by === who;
  const answered = ask.answer !== null;

  function answer(value: "yes" | "no") {
    upsertAsk({ ...ask, answer: value, answeredAt: new Date().toISOString(), reply: reply.trim() });
    onAnswered();
    toast(value === "yes" ? "Answered yes." : "Answered no.", { tone: value === "yes" ? "gold" : undefined });
  }

  function sayMore() {
    const text = reply.trim();
    if (!text) return;
    // An answer in words still counts as answered, so it leaves the queue.
    upsertAsk({ ...ask, reply: text, answeredAt: new Date().toISOString(), answer: ask.answer ?? "yes" });
    setWriting(false);
    onAnswered();
    toast("Answered.");
  }

  return (
    <div className="g g--strong stack stack--tight" style={{ padding: 14 }}>
      <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
        <Avatar who={ask.by} />
        <div className="grow" style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600 }}>{ask.text}</p>
          <p className="small muted">
            {nameOf(ask.by)} · {whenLabel(ask.at)}
          </p>
        </div>
        {answered && (
          <span className={`chip ${ask.answer === "yes" ? "chip--ok" : "chip--due"}`}>
            {ask.answer === "yes" ? "Yes" : "No"}
          </span>
        )}
      </div>

      {ask.reply && (
        <p className="small" style={{ paddingLeft: 38, color: "var(--ink-soft)" }}>
          &ldquo;{ask.reply}&rdquo;
        </p>
      )}

      {!answered && !mine && (
        <div className="stack stack--tight" style={{ paddingLeft: 38 }}>
          <div className="row">
            <button type="button" className="btn btn--sm btn--primary" onClick={() => answer("yes")}>
              Yes
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => answer("no")}>
              No
            </button>
            <button type="button" className="btn btn--sm btn--quiet" onClick={() => setWriting(!writing)}>
              {writing ? "Never mind" : "Say more"}
            </button>
          </div>
          {writing && (
            <div className="row row--nowrap">
              <input
                className="field grow"
                autoFocus
                placeholder="Because…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sayMore();
                  }
                }}
              />
              <button type="button" className="btn btn--sm btn--primary" onClick={sayMore} disabled={!reply.trim()}>
                Send
              </button>
            </div>
          )}
        </div>
      )}

      {!answered && mine && (
        <div className="row row--end" style={{ paddingLeft: 38 }}>
          <Confirm label="Withdraw" question="Take it back?" onYes={() => removeAsk(ask.id)} />
        </div>
      )}
    </div>
  );
}

/** How many questions are sitting on this person. For the tab badge. */
export function asksFor(asks: Ask[], who: Persona): number {
  return asks.filter((a) => a.answer === null && a.by !== who).length;
}
