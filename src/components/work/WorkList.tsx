"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGallery } from "@/components/media/FloatingGallery";
import { getMediaSet } from "@/content/media";
import { irisDemo } from "@/content/site";
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
          const set = getMediaSet(item.slug);
          return (
            <Reveal key={item.slug} delay={i * 0.05}>
              <li className="group grid gap-3 border-b border-line py-9 transition-colors hover:bg-canvas-light sm:grid-cols-[7rem_1fr_auto] sm:gap-8">
                <span className="font-sans text-sm tabular-nums text-ink-faint">{item.date}</span>
                <div>
                  {/* Only an entry that actually has a gallery becomes a button:
                      a control that opens nothing is worse than plain text. */}
                  {set ? (
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

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
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

                    {item.slug === "iris" &&
                      (irisDemo.url ? (
                        <a
                          href={irisDemo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-azure transition-opacity hover:opacity-70"
                        >
                          <span className="inline-block h-px w-6 bg-current" />
                          Request a demo
                        </a>
                      ) : (
                        // Until a booking link exists, the request still reaches
                        // him: through the same reviewed-by-hand contact inbox.
                        <Link
                          href="/contact?subject=IRIS%20demo%20request"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-azure transition-opacity hover:opacity-70"
                        >
                          <span className="inline-block h-px w-6 bg-current" />
                          Request a demo
                        </Link>
                      ))}
                  </div>
                </div>

                <span
                  className={`text-xs uppercase tracking-[0.12em] sm:text-right ${
                    CATEGORY_TONE[item.category] ?? "text-ink-faint"
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
