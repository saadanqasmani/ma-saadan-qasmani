"use client";

import { useState, useTransition } from "react";
import { checkTheList, type Check } from "@/app/admin/actions";
import { ghostButtonClass } from "@/components/admin/ui";

/**
 * The subscribe form, run from in here.
 *
 * A visitor who cannot subscribe is told only that something went wrong,
 * which is right for them and useless for fixing it. This does the same
 * read and the same write against a reserved address, cleans up after
 * itself, and says exactly what the database answered.
 */
export function ListCheck() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [running, start] = useTransition();

  return (
    <section className="mt-10 border border-line p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">If subscribing is failing</p>
          <p className="mt-1 text-sm text-ink-soft">
            Runs the same write the form does, then removes it again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => start(async () => setChecks(await checkTheList()))}
          disabled={running}
          className={ghostButtonClass}
        >
          {running ? "Checking" : "Check the list"}
        </button>
      </div>

      {checks && (
        <ul className="mt-5 border-t border-line">
          {checks.map((c) => (
            <li key={c.label} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[1.5rem_1fr]">
              <span
                className={
                  c.state === "ok" ? "text-verdant" : c.state === "bad" ? "text-ember" : "text-azure"
                }
                aria-label={c.state === "ok" ? "Working" : c.state === "bad" ? "Broken" : "Cannot tell"}
              >
                {c.state === "ok" ? "✓" : c.state === "bad" ? "×" : "?"}
              </span>
              <div>
                <p className="text-sm text-ink">{c.label}</p>
                <p className="mt-0.5 break-words font-mono text-xs text-ink-soft">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
