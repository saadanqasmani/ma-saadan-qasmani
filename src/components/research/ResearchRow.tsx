"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { collaborators } from "@/content/site";
import { RequestAccessForm } from "@/components/forms/RequestAccessForm";
import type { Dictionary } from "@/content/i18n/en";
import type { TranslatedResearchItem } from "@/lib/i18n/content";
import { fill } from "@/lib/i18n/dictionary";

export function ResearchRow({
  item,
  index,
  copy,
  forms,
  notice,
  instrument,
}: {
  item: TranslatedResearchItem;
  index: number;
  copy: Dictionary["research"];
  forms: Dictionary["forms"];
  notice: Dictionary["translation"];
  instrument: { label: string; definition: string | null };
}) {
  const [request, setRequest] = useState<null | "paper" | "instrument">(null);

  const subject =
    request === "instrument" && item.instrument
      ? `${item.title} — ${instrument.label}`
      : item.title;
  const [expanded, setExpanded] = useState(false);
  const [reading, setReading] = useState(false);
  const [original, setOriginal] = useState(false);

  const byline = item.coAuthors?.length
    ? fill(copy.withAuthorsInline, { names: item.coAuthors.join(", ") })
    : null;

  // Rows alternate between the two accent colours, so a page of open
  // abstracts reads as one set rather than a row of identical boxes.
  const accent = index % 2 === 0 ? "azure" : "ember";

  useEffect(() => {
    if (!reading) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReading(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reading]);

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
          <span dir="auto" className="block font-serif text-xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-2xl">
            {item.title}
          </span>
          {item.subtitle && (
            <span dir="auto" className="mt-1.5 block max-w-3xl font-serif text-base italic leading-snug text-ink-soft">
              {item.subtitle}
            </span>
          )}
          <span className="mt-2 block text-xs uppercase tracking-[0.12em] text-ink-faint">
            {item.type} · {item.date}
            {byline ? ` · ${byline}` : ""}
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
                <button
                  type="button"
                  onClick={() => setReading(true)}
                  className={`group relative inline-flex overflow-hidden border px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] ${
                    accent === "azure" ? "border-azure text-azure" : "border-ember text-ember"
                  }`}
                >
                  <span
                    className={`absolute inset-0 -translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 ${
                      accent === "azure" ? "bg-azure" : "bg-ember"
                    }`}
                  />
                  <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                    {copy.readAbstract}
                  </span>
                </button>
                {/* The paper's own page: where the abstract is published as
                    text, and the only version a search engine ever sees. */}
                <LocaleLink
                  href={`/research/${item.slug}`}
                  className="ml-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                >
                  {copy.fullEntry}
                  <span aria-hidden>→</span>
                </LocaleLink>

                {item.institution && (
                  <p className="mt-3 text-sm text-ink-faint">{item.institution}</p>
                )}

                {item.coAuthors?.length ? (
                  <p className="mt-4 text-sm text-ink-soft">
                    {copy.withAuthors.split("{names}")[0]}
                    {item.coAuthors.map((name, i) => {
                      const profile = collaborators[name]?.profile;
                      return (
                        <span key={name}>
                          {i > 0 && (i === item.coAuthors!.length - 1 ? ` ${copy.and} ` : ", ")}
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
                    {copy.withAuthors.split("{names}")[1]}
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
                        {copy.viewPaper}
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
                        {copy.requestAccess}
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
                          {fill(copy.requestInstrument, { name: instrument.label })}
                        </span>
                      </button>
                      {instrument.definition && (
                        <span className="group/i relative inline-flex">
                          <button
                            type="button"
                            aria-label={copy.whatAreImgIpi}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-faint text-ink-faint transition-colors hover:border-azure hover:text-azure focus-visible:border-azure focus-visible:text-azure"
                          >
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              aria-hidden
                            >
                              <path d="M8 7.2v4" />
                              <path d="M8 4.6v.5" />
                            </svg>
                          </button>
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-3 w-72 -translate-x-1/2 border border-ink bg-canvas-light p-4 text-xs leading-relaxed text-ink-soft opacity-0 shadow-sm transition-opacity duration-200 group-hover/i:opacity-100 group-focus-within/i:opacity-100"
                          >
                            {instrument.definition}
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

      {/* The abstract, lifted out of the row into a white sheet. */}
      <AnimatePresence>
        {reading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={fill(copy.abstractOf, { title: item.title })}
            onClick={() => setReading(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={`relative flex max-h-[86vh] w-full max-w-2xl flex-col border-2 bg-white shadow-[0_40px_90px_-40px_rgba(21,32,60,0.6)] ${
                accent === "azure" ? "border-azure" : "border-ember"
              }`}
            >
              <button
                type="button"
                onClick={() => setReading(false)}
                aria-label={copy.close}
                className="absolute end-5 top-4 z-10 text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ×
              </button>

              <div className="overflow-y-auto px-8 py-9 sm:px-12 sm:py-11">
                <p
                  className={`text-xs uppercase tracking-[0.16em] ${
                    accent === "azure" ? "text-azure" : "text-ember"
                  }`}
                >
                  {copy.abstract}
                </p>
                <h3 dir="auto" className="mt-4 pe-8 font-serif text-2xl leading-snug text-ink sm:text-3xl">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-2 font-serif text-lg italic leading-snug text-ink-soft">
                    {item.subtitle}
                  </p>
                )}
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-ink-faint">
                  {item.type} · {item.date}
                  {byline ? ` · ${byline}` : ""}
                </p>

                <hr
                  className={`mt-7 border-0 border-t ${
                    accent === "azure" ? "border-azure/30" : "border-ember/30"
                  }`}
                />

                <p dir="auto" className="mt-7 text-base leading-[1.75] text-ink-soft">
                  {item.abstract}
                </p>

                {/* An abstract is a published claim, and this is a
                    translation of one. A reader who wants to check a term
                    against the words the authors approved can open the
                    English without leaving the page. */}
                {item.original && (
                  <div className="mt-7 border-t border-line pt-5">
                    <p className="text-xs italic leading-relaxed text-ink-faint">
                      {notice.abstractNotice}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOriginal((v) => !v)}
                      aria-expanded={original}
                      className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                    >
                      <span aria-hidden>{original ? "−" : "+"}</span>
                      {original ? notice.hideOriginal : notice.showOriginal}
                    </button>
                    {original && (
                      <div lang="en" dir="ltr" className="mt-4 text-start">
                        <p className="font-serif text-lg leading-snug text-ink">
                          {item.original.title}
                        </p>
                        {item.original.subtitle && (
                          <p className="mt-1 font-serif text-base italic leading-snug text-ink-soft">
                            {item.original.subtitle}
                          </p>
                        )}
                        <p className="mt-4 text-sm leading-[1.75] text-ink-soft">
                          {item.original.abstract}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <LocaleLink
                  href={`/research/${item.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                >
                  {copy.openFullEntry}
                  <span aria-hidden>→</span>
                </LocaleLink>
              </div>
            </motion.div>
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
            aria-label={fill(copy.requestAccessTo, { title: subject })}
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
                aria-label={copy.close}
                className="absolute end-6 top-6 text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
              >
                ×
              </button>
              <p className="eyebrow">{copy.restricted}</p>
              <h3 className="mt-3 pe-8 font-display text-3xl">
                {request === "instrument" ? copy.requestTheInstrument : copy.requestAccess}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{subject}</p>
              <div className="mt-7">
                <RequestAccessForm
                  researchSlug={item.slug}
                  researchTitle={subject}
                  onClose={() => setRequest(null)}
                  copy={forms}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
