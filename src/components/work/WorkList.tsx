"use client";

import { useState } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import { PolaroidStrip } from "@/components/media/PolaroidStrip";
import type { MediaSet } from "@/content/media";
import type { WorkItem } from "@/content/site";
import type { Dictionary } from "@/content/i18n/en";
import { fill } from "@/lib/i18n/dictionary";

/**
 * A row's colours, and a row's destination, are two different things.
 *
 * They used to be one map, which meant a row could only be coloured if it
 * linked to a page of its own. UNESCO links outward rather than inward, so
 * under that rule it could never carry a theme.
 */
type RowTheme = {
  theme: string;
  ground: string;
  groundHover: string;
  line: string;
  ink: string;
  inkSoft: string;
  accent: string;
};

const ROW_THEMES: Record<string, RowTheme> = {
  iris: {
    theme: "iris-theme",
    ground: "bg-[var(--iris-ground)]",
    groundHover: "hover:bg-[var(--iris-ground-deep)]",
    line: "border-[var(--iris-blue-pale)]",
    ink: "text-[var(--iris-navy)]",
    inkSoft: "text-[var(--iris-navy-soft)]",
    accent: "text-[var(--iris-blue)]",
  },
  icd: {
    theme: "icd-theme",
    ground: "bg-[var(--icd-ground)]",
    groundHover: "hover:bg-[var(--icd-ground-deep)]",
    line: "border-[var(--icd-green-pale)]",
    ink: "text-[var(--icd-ink)]",
    inkSoft: "text-[var(--icd-ink-soft)]",
    accent: "text-[var(--icd-green)]",
  },
  "international-student-recruitment": {
    theme: "rec-theme",
    ground: "bg-[var(--rec-ground)]",
    groundHover: "hover:bg-[var(--rec-ground-deep)]",
    line: "border-[var(--rec-pale)]",
    ink: "text-[var(--rec-ink)]",
    inkSoft: "text-[var(--rec-ink-soft)]",
    accent: "text-[var(--rec-orange)]",
  },
  "unesco-peace-diplomacy": {
    theme: "unesco-theme",
    ground: "bg-[var(--un-ground)]",
    groundHover: "hover:bg-[var(--un-ground-deep)]",
    line: "border-[var(--un-pale)]",
    ink: "text-[var(--un-ink)]",
    inkSoft: "text-[var(--un-ink-soft)]",
    accent: "text-[var(--un-blue)]",
  },
};

/**
 * Entries with a page of their own on this site.
 *
 * The label is a key rather than a word: "Look into recruitment" reads as
 * one sentence, and a language needs to be able to move its parts.
 */
const DETAIL_PAGES: Record<string, { href: string; label: keyof Dictionary["work"]["detailLabels"] }> = {
  iris: { href: "/work/iris", label: "iris" },
  icd: { href: "/work/icd", label: "icd" },
  "international-student-recruitment": {
    href: "/work/recruitment",
    label: "recruitment",
  },
};

/** Tone for the rows that carry no theme of their own. */
const CATEGORY_TONE: Record<string, string> = {
  Academic: "text-azure",
  Research: "text-azure",
  Publications: "text-ember",
  "International Education": "text-verdant",
  "Global Engagement": "text-verdant",
  Strategy: "text-ember",
  Writing: "text-ember",
  "Creative Work": "text-ember",
  Projects: "text-azure",
};

export function WorkList({
  items,
  copy,
  gallery,
  sets,
}: {
  items: WorkItem[];
  copy: Dictionary["work"];
  gallery: Dictionary["gallery"];
  /** Resolved on the server, so the captions arrive already translated. */
  sets: Record<string, MediaSet | null>;
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openSet = openSlug ? (sets[openSlug] ?? null) : null;

  return (
    <>
      <ul className="border-t border-line">
        {items.map((item, i) => {
          const detail = DETAIL_PAGES[item.slug];
          const skin = ROW_THEMES[item.slug];
          /*
           * A gallery wherever there are photographs to show.
           *
           * This used to be suppressed for any entry with its own page, on the
           * grounds that the page could carry them. But an entry can want both,
           * and an empty set is the thing worth hiding, not a set that happens
           * to sit beside a link.
           */
          const candidate = sets[item.slug] ?? null;
          const set = candidate?.items.some((m) => m.src) ? candidate : null;
          return (
            <Reveal key={item.slug} delay={i * 0.05}>
              <li
                className={`group grid gap-3 border-b py-9 transition-colors sm:grid-cols-[1fr_auto] sm:gap-8 ${
                  skin
                    ? // A themed row reads as a door into wherever it goes,
                      // whether that is a page here or a site elsewhere.
                      `${skin.theme} -mx-6 px-6 sm:-mx-8 sm:px-8 ${skin.line} ${skin.ground} ${skin.groundHover}`
                    : "border-line hover:bg-canvas-light"
                }`}
              >
                <div>
                  {/* Only an entry that actually has a gallery becomes a button:
                      a control that opens nothing is worse than plain text. */}
                  {detail ? (
                    <LocaleLink href={detail.href} className="block">
                      <h2 className={`font-serif text-2xl leading-snug ${skin ? skin.ink : "text-ink"} transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-3xl`}>
                        {item.title}
                      </h2>
                    </LocaleLink>
                  ) : set ? (
                    <button
                      type="button"
                      onClick={() => setOpenSlug(item.slug)}
                      className="block text-start"
                      aria-label={fill(copy.openGallery, { name: item.title })}
                    >
                      <h2 className="font-serif text-2xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-3xl">
                        {item.title}
                      </h2>
                    </button>
                  ) : (
                    <h2 className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
                      {item.title}
                    </h2>
                  )}

                  <p
                    className={`mt-2 max-w-2xl text-sm leading-relaxed ${
                      skin ? skin.inkSoft : "text-ink-soft"
                    }`}
                  >
                    {item.summary}
                  </p>

                  {/* The photographs, as photographs.
                      A row that said "View gallery" in small caps was not
                      being found: readers did not know a set of prints was
                      behind it. A stack of prints is recognisable, and it is
                      the whole control. */}
                  {set && (
                    <button
                      type="button"
                      onClick={() => setOpenSlug(item.slug)}
                      aria-label={fill(copy.openGallery, { name: item.title })}
                      className="group/gallery mt-5 block text-start"
                    >
                      <PolaroidStrip
                        set={set}
                        count={
                          set.items.filter((m) => m.src).length === 1
                            ? gallery.photographCountOne
                            : fill(gallery.photographCount, {
                                count: set.items.filter((m) => m.src).length,
                              })
                        }
                      />
                    </button>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {item.link && (
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/l inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-azure transition-opacity hover:opacity-70"
                      >
                        <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover/l:w-10" />
                        {item.link.label}
                      </a>
                    )}

                    {detail && (
                      <LocaleLink
                        href={detail.href}
                        className={`group/e mt-1 inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-60 ${skin ? `${skin.line} ${skin.accent}` : "border-ink text-ink"}`}
                      >
                        <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover/e:w-10" />
                        {fill(copy.lookInto, { name: copy.detailLabels[detail.label] })}
                      </LocaleLink>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs uppercase tracking-[0.12em] sm:text-right ${
                    skin
                      ? skin.accent
                      : (CATEGORY_TONE[item.category] ?? "text-ink-faint")
                  }`}
                >
                  {copy.categories[item.category] ?? item.category}
                </span>
              </li>
            </Reveal>
          );
        })}
      </ul>

      {openSet && (
        <FloatingGallery
          set={openSet}
          open={Boolean(openSlug)}
          onClose={() => setOpenSlug(null)}
          copy={gallery}
        />
      )}
    </>
  );
}
