"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FloatCard } from "@/components/ui/FloatCard";
import { unlockIris, type UnlockState } from "@/lib/actions/iris";

const initial: UnlockState = { error: null };

/**
 * What stands in place of the film, the module list and the architecture
 * until a viewer enters the code.
 *
 * The panel is not a curtain over content that is already in the page: the
 * three locked sections are never sent to a browser that has not unlocked,
 * and the film file itself is refused at the edge.
 */
export function IrisLock({ contactHref = "/contact" }: { contactHref?: string }) {
  const [state, formAction, pending] = useActionState(unlockIris, initial);

  return (
    <FloatCard tone="mixed" innerClassName="p-8 sm:p-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.16em] text-ember">Access code required</p>
          <h3 className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-tight text-[var(--iris-navy)]">
            The film, the module list and the architecture are held back.
          </h3>
          <p className="mt-5 text-base leading-relaxed text-[var(--iris-navy-soft)]">
            IRIS is not public yet. Get in touch with Saadan for the access code and
            the three sections open together, on this page, for a month.
          </p>
          <Link
            href={contactHref}
            className="mt-7 inline-flex items-center gap-2 border border-[var(--iris-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--iris-blue)] transition-colors hover:bg-[var(--iris-blue)] hover:text-canvas-light"
          >
            Request the code
          </Link>
        </div>

        <form action={formAction} className="w-full max-w-sm shrink-0">
          <label
            htmlFor="iris-code"
            className="block text-xs uppercase tracking-[0.16em] text-[var(--iris-navy-soft)]"
          >
            Enter code
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
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="group relative mt-5 inline-flex w-full justify-center overflow-hidden border-2 border-[var(--iris-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--iris-blue)] disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-y-full bg-[var(--iris-blue)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
              {pending ? "Checking…" : "Unlock"}
            </span>
          </button>
        </form>
      </div>
    </FloatCard>
  );
}
