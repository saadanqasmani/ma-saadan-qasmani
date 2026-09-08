"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ResearchItem } from "@/content/site";
import { collaborators, instruments } from "@/content/site";
import { RequestAccessForm } from "@/components/forms/RequestAccessForm";

export function ResearchRow({ item, index }: { item: ResearchItem; index: number }) {
  const [request, setRequest] = useState<null | "paper" | "instrument">(null);

  const instrument = item.instrument ? instruments[item.instrument] : null;
  const subject =
    request === "instrument" && instrument
      ? `${item.title} — ${instrument.label}`
      : item.title;
  const [expanded, setExpanded] = useState(false);

  return (
    <article id={item.slug} className="scroll-mt-28 border-b border-line">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="group grid w-full items-start gap-3 py-8 text-left sm:grid-cols-[auto_1fr_auto] sm:gap-8"
      >
        <span className="font-sans text-xs tabular-nums text-ink-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>
          <span className="block font-serif text-xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-2xl">
            {item.title}
          </span>
          {item.subtitle && (
            <span className="mt-1.5 block max-w-3xl font-serif text-base italic leading-snug text-ink-soft">
              {item.subtitle}
            </span>
          )}
          <span className="mt-2 block text-xs uppercase tracking-[0.12em] text-ink-faint">
            {item.type} · {item.date}
            {item.coAuthors?.length ? ` · with ${item.coAuthors.join(", ")}` : ""}
          </span>
        </span>
        <span
          className={`mt-1 shrink-0 text-lg leading-none text-ink-faint transition-transform duration-300 ${
            expanded ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 pb-9 sm:grid-cols-[auto_1fr] sm:gap-8">
              <span className="hidden w-[1.5rem] sm:block" />
              <div className="max-w-2xl">
                <p className="text-base leading-relaxed text-ink-soft">{item.abstract}</p>

                {item.institution && (
                  <p className="mt-3 text-sm text-ink-faint">{item.institution}</p>
                )}

                {item.coAuthors?.length ? (
                  <p className="mt-4 text-sm text-ink-soft">
                    With{" "}
                    {item.coAuthors.map((name, i) => {
                      const profile = collaborators[name]?.profile;
                      return (
                        <span key={name}>
                          {i > 0 && (i === item.coAuthors!.length - 1 ? " and " : ", ")}
                          {profile ? (
                            <a
                              href={profile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline decoration-ember decoration-1 underline-offset-4 transition-colors hover:text-ember"
                            >
                              {name}
                            </a>
                          ) : (
                            name
                          )}
                        </span>
                      );
                    })}
                    .
                  </p>
                ) : null}

                {item.keywords.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.keywords.map((k) => (
                      <li
                        key={k}
                        className="border border-line px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-ink-soft"
                      >
                        {k}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {item.access === "open" && item.doiOrLink ? (
                    <a
                      href={item.doiOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
                    >
                      <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                        View paper
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRequest("paper")}
                      className="group relative inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
                    >
                      <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                        Request access
                      </span>
                    </button>
                  )}

                  {item.instrument && (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRequest("instrument")}
                        className="group relative inline-flex overflow-hidden border border-azure px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-azure"
                      >
                        <span className="absolute inset-0 -translate-y-full bg-azure transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                        <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                          Request the {instrument!.label}
                        </span>
                      </button>
                      {instrument!.definition && (
                        <span className="group/i relative inline-flex">
                          <button
                            type="button"
                            aria-label={`What are IMG and IPI?`}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-faint font-serif text-[13px] italic leading-none text-ink-faint transition-colors hover:border-azure hover:text-azure focus-visible:border-azure focus-visible:text-azure"
                          >
                            i
                          </button>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-72 -translate-x-1/2 border border-ink bg-canvas-light p-4 text-xs leading-relaxed text-ink-soft opacity-0 shadow-sm transition-opacity duration-200 group-hover/i:opacity-100 group-focus-within/i:opacity-100"
                          >
                            {instrument!.definition}
                          </span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {request && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Request access to ${subject}`}
            onClick={() => setRequest(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-xl overflow-y-auto border border-ink bg-canvas-light p-8 sm:p-10"
            >
              <button
                type="button"
                onClick={() => setRequest(null)}
                aria-label="Close"
                className="absolute right-6 top-6 text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow">Restricted</p>
              <h3 className="mt-3 pr-8 font-display text-3xl">
                {request === "instrument" ? "Request the instrument" : "Request access"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{subject}</p>
              <div className="mt-7">
                <RequestAccessForm
                  researchSlug={item.slug}
                  researchTitle={subject}
                  onClose={() => setRequest(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
