"use client";

import { useActionState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  subscribeAndUnlock,
  unlockWithCode,
  type GateState,
} from "@/lib/actions/journal";
import type { Dictionary } from "@/content/i18n/en";

const initial: GateState = { error: null };

/**
 * What stands in place of the essays until a reader is let in.
 *
 * Two doors, side by side: subscribe here and the page opens on the spot, or
 * enter the code from the email if you have already subscribed. Neither is
 * the "real" one; a reader arriving for the first time should not have to
 * work out which applies to them.
 */
export function JournalGate({ copy }: { copy: Dictionary["journal"]["gate"] }) {
  const [subState, subscribeAction, subscribing] = useActionState(
    subscribeAndUnlock,
    initial
  );
  const [codeState, codeAction, checking] = useActionState(unlockWithCode, initial);
  const locale = useLocale();

  return (
    <div className="max-w-3xl border-t border-line pt-10">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">{copy.heading}</h2>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{copy.body}</p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {/* Subscribe, and go straight in. */}
        <form action={subscribeAction}>
          <input type="hidden" name="locale" value={locale} />
          <label
            htmlFor="gate-email"
            className="block text-xs uppercase tracking-[0.16em] text-ink-faint"
          >
            {copy.subscribe}
          </label>
          <div className="mt-3 flex items-end gap-3 border-b border-ink pb-2 transition-colors focus-within:border-ember">
            <input
              id="gate-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              aria-invalid={subState.error ? true : undefined}
              aria-describedby={subState.error ? "gate-email-error" : undefined}
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint/60"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-ember disabled:opacity-60"
            >
              {subscribing ? "…" : copy.enter}
            </button>
          </div>
          {subState.error && (
            <p id="gate-email-error" role="alert" className="mt-3 text-sm text-ember">
              {copy[subState.error]}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            {copy.unlocksNote}
          </p>
        </form>

        {/* Already subscribed: the code from the email. */}
        <form action={codeAction}>
          <label
            htmlFor="gate-code"
            className="block text-xs uppercase tracking-[0.16em] text-ink-faint"
          >
            {copy.haveCode}
          </label>
          <div className="mt-3 flex items-end gap-3 border-b border-ink pb-2 transition-colors focus-within:border-azure">
            <input
              id="gate-code"
              name="code"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder={copy.codePlaceholder}
              aria-invalid={codeState.error ? true : undefined}
              aria-describedby={codeState.error ? "gate-code-error" : undefined}
              className="w-full bg-transparent font-mono text-base tracking-[0.16em] text-ink outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-ink-faint/60"
            />
            <button
              type="submit"
              disabled={checking}
              className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-azure disabled:opacity-60"
            >
              {checking ? "…" : copy.unlock}
            </button>
          </div>
          {codeState.error && (
            <p id="gate-code-error" role="alert" className="mt-3 text-sm text-ember">
              {copy[codeState.error]}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-ink-faint">
            {copy.codeNote}
          </p>
        </form>
      </div>
    </div>
  );
}
