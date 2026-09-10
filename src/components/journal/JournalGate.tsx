"use client";

import { useActionState } from "react";
import {
  subscribeAndUnlock,
  unlockWithCode,
  type GateState,
} from "@/lib/actions/journal";

const initial: GateState = { error: null };

/**
 * What stands in place of the essays until a reader is let in.
 *
 * Two doors, side by side: subscribe here and the page opens on the spot, or
 * enter the code from the email if you have already subscribed. Neither is
 * the "real" one; a reader arriving for the first time should not have to
 * work out which applies to them.
 */
export function JournalGate() {
  const [subState, subscribeAction, subscribing] = useActionState(
    subscribeAndUnlock,
    initial
  );
  const [codeState, codeAction, checking] = useActionState(unlockWithCode, initial);

  return (
    <div className="max-w-3xl border-t border-line pt-10">
      <p className="eyebrow">For subscribers</p>
      <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
        The essays and notes are for subscribers.
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Notes from the archive, arguments still forming, and the occasional piece that
        belongs to neither the research nor the fiction. Subscribe and this page opens
        straight away; you are emailed an access code for next time, and a note whenever
        something new goes up.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {/* Subscribe, and go straight in. */}
        <form action={subscribeAction}>
          <label
            htmlFor="gate-email"
            className="block text-xs uppercase tracking-[0.16em] text-ink-faint"
          >
            Subscribe
          </label>
          <div className="mt-3 flex items-end gap-3 border-b border-ink pb-2 transition-colors focus-within:border-ember">
            <input
              id="gate-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={subState.error ? true : undefined}
              aria-describedby={subState.error ? "gate-email-error" : undefined}
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint/60"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-ember disabled:opacity-60"
            >
              {subscribing ? "…" : "Enter"}
            </button>
          </div>
          {subState.error && (
            <p id="gate-email-error" role="alert" className="mt-3 text-sm text-ember">
              {subState.error}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            The page unlocks the moment you subscribe.
          </p>
        </form>

        {/* Already subscribed: the code from the email. */}
        <form action={codeAction}>
          <label
            htmlFor="gate-code"
            className="block text-xs uppercase tracking-[0.16em] text-ink-faint"
          >
            Already have a code
          </label>
          <div className="mt-3 flex items-end gap-3 border-b border-ink pb-2 transition-colors focus-within:border-azure">
            <input
              id="gate-code"
              name="code"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="Access code"
              aria-invalid={codeState.error ? true : undefined}
              aria-describedby={codeState.error ? "gate-code-error" : undefined}
              className="w-full bg-transparent font-mono text-base tracking-[0.16em] text-ink outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-faint/60"
            />
            <button
              type="submit"
              disabled={checking}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-azure disabled:opacity-60"
            >
              {checking ? "…" : "Unlock"}
            </button>
          </div>
          {codeState.error && (
            <p id="gate-code-error" role="alert" className="mt-3 text-sm text-ember">
              {codeState.error}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            It was in the email you were sent when you subscribed.
          </p>
        </form>
      </div>
    </div>
  );
}
