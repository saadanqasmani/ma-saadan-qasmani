"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ResearchItem } from "@/content/site";
import { RequestAccessForm } from "@/components/forms/RequestAccessForm";

export function ResearchRow({ item, index }: { item: ResearchItem; index: number }) {
  const [open, setOpen] = useState(false);
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

                <div className="mt-7">
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
                      onClick={() => setOpen(true)}
                      className="group relative inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
                    >
                      <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                        Request access
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={`Request access to ${item.title}`}
            onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-6 top-6 text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow">Restricted</p>
              <h3 className="mt-3 pr-8 font-display text-3xl">Request access</h3>
              <div className="mt-7">
                <RequestAccessForm
                  researchSlug={item.slug}
                  researchTitle={item.title}
                  onClose={() => setOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
