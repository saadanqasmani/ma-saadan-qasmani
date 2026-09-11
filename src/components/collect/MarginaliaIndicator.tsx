"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCollection } from "@/components/collect/CollectionProvider";
import { fill } from "@/lib/i18n/dictionary";

/** The header counter. Appears only once the reader has found something. */
export function MarginaliaIndicator() {
  const { found, total, setPanelOpen, copy } = useCollection();

  return (
    <AnimatePresence>
      {found.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setPanelOpen(true)}
          aria-label={fill(copy.indicator, { found: found.length, total })}
          className="t-label flex items-center gap-2 border border-line px-3 py-1.5 text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          <span className="text-ember">✳</span>
          <span className="tabular-nums">
            {found.length}/{total}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
