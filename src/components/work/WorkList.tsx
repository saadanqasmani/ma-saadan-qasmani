"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import { getMediaSet } from "@/content/media";

/**
 * Work entries with a page of their own. Each row borrows that page's theme,
 * so the list previews where the link goes rather than looking uniform.
 */
const DETAIL_PAGES: Record<
  string,
  { href: string; label: string; theme: string; ground: string; groundHover: string; line: string; ink: string; inkSoft: string; accent: string }
> = {
  iris: {
    href: "/work/iris",
    label: "IRIS",
    theme: "iris-theme",
    ground: "bg-[var(--iris-ground)]",
    groundHover: "hover:bg-[var(--iris-ground-deep)]",
    line: "border-[var(--iris-blue-pale)]",
    ink: "text-[var(--iris-navy)]",
    inkSoft: "text-[var(--iris-navy-soft)]",
    accent: "text-[var(--iris-blue)]",
  },
  icd: {
    href: "/work/icd",
    label: "ICD",
    theme: "icd-theme",
    ground: "bg-[var(--icd-ground)]",
    groundHover: "hover:bg-[var(--icd-ground-deep)]",
    line: "border-[var(--icd-green-pale)]",
    ink: "text-[var(--icd-ink)]",
    inkSoft: "text-[var(--icd-ink-soft)]",
    accent: "text-[var(--icd-green)]",
  },
};
import type { WorkItem } from "@/content/site";

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

export function WorkList({ items }: { items: WorkItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openSet = openSlug ? getMediaSet(openSlug) : null;

  return (
    <>
      <ul className="border-t border-line">
        {items.map((item, i) => {
          const detail = DETAIL_PAGES[item.slug];
          // An entry with its own page does not also need a photo gallery.
          const set = detail ? null : getMediaSet(item.slug);
          return (
            <Reveal key={item.slug} delay={i * 0.05}>
              <li
                className={`group grid gap-3 border-b py-9 transition-colors sm:grid-cols-[7rem_1fr_auto] sm:gap-8 ${
                  detail
                    ? // An entry with a page of its own carries that page's
                      // colours, so the row reads as a door into it.
                      `${detail.theme} -mx-6 px-6 sm:-mx-8 sm:px-8 ${detail.line} ${detail.ground} ${detail.groundHover}`
                    : "border-line hover:bg-canvas-light"
                }`}
              >
                <span
                  className={`font-sans text-sm tabular-nums ${
                    detail ? detail.accent : "text-ink-faint"
                  }`}
                >
                  {item.date}
                </span>
                <div>
                  {/* Only an entry that actually has a gallery becomes a button:
                      a control that opens nothing is worse than plain text. */}
                  {detail ? (
                    <Link href={detail.href} className="block">
                      <h2 className={`font-serif text-2xl leading-snug ${detail.ink} transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-3xl`}>
                        {item.title}
                      </h2>
                    </Link>
                  ) : set ? (
                    <button
                      type="button"
                      onClick={() => setOpenSlug(item.slug)}
                      className="block text-left"
                      aria-label={`Open the gallery for ${item.title}`}
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
                      detail ? detail.inkSoft : "text-ink-soft"
                    }`}
                  >
                    {item.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {set && (
                      <button
                        type="button"
                        onClick={() => setOpenSlug(item.slug)}
                        className="group/v inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ember"
                      >
                        <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover/v:w-10" />
                        View gallery
                      </button>
                    )}

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
                      <Link
                        href={detail.href}
                        className={`group/e mt-1 inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-60 ${detail.line} ${detail.accent}`}
                      >
                        <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover/e:w-10" />
                        Look into {detail.label}
                      </Link>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs uppercase tracking-[0.12em] sm:text-right ${
                    detail
                      ? detail.accent
                      : (CATEGORY_TONE[item.category] ?? "text-ink-faint")
                  }`}
                >
                  {item.category}
                </span>
              </li>
            </Reveal>
          );
        })}
      </ul>

      {openSet && (
        <FloatingGallery set={openSet} open={Boolean(openSlug)} onClose={() => setOpenSlug(null)} />
      )}
    </>
  );
}
