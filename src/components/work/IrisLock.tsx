"use client";

import { useActionState } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { FloatCard } from "@/components/ui/FloatCard";
import { unlockIris, type UnlockState } from "@/lib/actions/iris";
import type { Dictionary } from "@/content/i18n/en";

const initial: UnlockState = { error: null };

/**
 * What stands in place of the film, the module list and the architecture
 * until a viewer enters the code.
 *
 * The panel is not a curtain over content that is already in the page: the
 * three locked sections are never sent to a browser that has not unlocked,
 * and the film file itself is refused at the edge.
 */
export function IrisLock({
  contactHref = "/contact",
  copy,
}: {
  contactHref?: string;
  copy: Dictionary["detail"]["iris"]["lock"];
}) {
  const [state, formAction, pending] = useActionState(unlockIris, initial);

  return (
    <FloatCard tone="mixed" innerClassName="p-8 sm:p-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="t-label text-ember">{copy.eyebrow}</p>
          <h3 className="t-h2 mt-5 text-[var(--iris-navy)]">
            {copy.heading}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-[var(--iris-navy-soft)]">
            {copy.body}
          </p>
          <LocaleLink
            href={contactHref}
            className="t-label mt-7 inline-flex items-center gap-2 border border-[var(--iris-blue)] px-6 py-3 font-semibold text-[var(--iris-blue)] transition-colors hover:bg-[var(--iris-blue)] hover:text-canvas-light"
          >
            {copy.requestTheCode}
          </LocaleLink>
        </div>

        <form action={formAction} className="w-full max-w-sm shrink-0">
          <label
            htmlFor="iris-code"
            className="t-label block text-[var(--iris-navy-soft)]"
          >
            {copy.enterCode}
          </label>
          <input
            id="iris-code"
            name="code"
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="••••••••"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "iris-code-error" : undefined}
            className="mt-3 w-full border border-[var(--iris-blue-pale)] bg-[var(--iris-ground)] px-4 py-3 font-mono text-base tracking-[0.2em] text-[var(--iris-navy)] outline-none transition-colors focus:border-[var(--iris-blue)]"
          />
          {state.error && (
            <p id="iris-code-error" role="alert" className="mt-3 text-sm text-ember">
              {copy[state.error]}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="t-label group relative mt-5 inline-flex w-full justify-center overflow-hidden border-2 border-[var(--iris-blue)] px-6 py-3 font-semibold text-[var(--iris-blue)] disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-y-full bg-[var(--iris-blue)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
              {pending ? copy.checking : copy.unlock}
            </span>
          </button>
        </form>
      </div>
    </FloatCard>
  );
}
