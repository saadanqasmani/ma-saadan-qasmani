"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ResearchRow } from "@/components/research/ResearchRow";
import type { Dictionary } from "@/content/i18n/en";
import type { TranslatedResearchItem } from "@/lib/i18n/content";
import { fill } from "@/lib/i18n/dictionary";

export function ResearchArchive({
  items,
  copy,
  notice,
  instrument,
}: {
  items: TranslatedResearchItem[];
  copy: Dictionary["research"];
  notice: Dictionary["translation"];
  instrument: { label: string; definition: string | null };
}) {
  // Null rather than the word "All": the filter is a state, and comparing it
  // to a translated label would break the moment the label was translated.
  const [area, setArea] = useState<string | null>(null);

  const areas = useMemo(() => Array.from(new Set(items.map((i) => i.area))), [items]);

  const filtered = area === null ? items : items.filter((i) => i.area === area);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[null, ...areas].map((a) => {
          const active = a === area;
          return (
            <button
              key={a ?? "__all"}
              type="button"
              onClick={() => setArea(a)}
              aria-pressed={active}
              className={`relative overflow-hidden border px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "border-ink bg-ink text-canvas-light"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {a ?? copy.all}
              {active && (
                <motion.span
                  layoutId="area-pill"
                  className="absolute inset-0 -z-10 bg-ink"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.14em] text-ink-faint">
        {fill(filtered.length === 1 ? copy.entryCount : copy.entryCountPlural, {
          count: filtered.length,
        })}
      </p>

      <div className="mt-8 border-t border-line">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResearchRow
                item={item}
                index={i}
                copy={copy}
                notice={notice}
                instrument={instrument}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
