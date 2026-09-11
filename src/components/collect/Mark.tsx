"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Mark as MarkType } from "@/content/marginalia";
import { useCollection } from "@/components/collect/CollectionProvider";
import { fill } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

const GLYPHS: Record<MarkType["glyph"], React.ReactNode> = {
  asterisk: (
    <>
      <path d="M12 4v16M5 7.5l14 9M19 7.5l-14 9" />
    </>
  ),
  manicule: (
    <>
      <path d="M5 12h9" />
      <path d="M11 8.5 14.5 12 11 15.5" />
      <path d="M17.5 7.5v9" />
    </>
  ),
  leaf: (
    <>
      <path d="M19 5c0 7-4.5 12-11 12-1 0-2-.2-2-.2S6.5 5 19 5Z" />
      <path d="M6 18.5C9 14 13 10.5 17 8.5" />
    </>
  ),
  star: (
    <>
      <path d="M12 3.5c.6 4.7 3.8 7.9 8.5 8.5-4.7.6-7.9 3.8-8.5 8.5-.6-4.7-3.8-7.9-8.5-8.5 4.7-.6 7.9-3.8 8.5-8.5Z" />
    </>
  ),
  paragraph: (
    <>
      <path d="M15 4v16M11 4v16" />
      <path d="M15 4h-3.5a3.75 3.75 0 0 0 0 7.5H15" />
      <path d="M18.5 4H15" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 15 2.2-4.8L16 8l-2.2 4.8L9 15Z" />
    </>
  ),
  seal: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 17v-5M12 13.5 9 10.5M12 12.5 15 9" />
    </>
  ),
};

/**
 * A mark in the margin. Quiet until noticed, then it gives up a real fact.
 * Rendered inline wherever it belongs — it should read as an annotation,
 * never as a game button.
 */
export function Mark({ id, className }: { id: string; className?: string }) {
  const reduced = useReducedMotion();
  const { has, collect, marks, copy } = useCollection();
  const [hovered, setHovered] = useState(false);
  const mark = marks.find((m) => m.id === id);
  if (!mark) return null;

  const found = has(id);

  return (
    <span className={cn("relative inline-flex align-middle", className)}>
      <button
        type="button"
        onClick={() => collect(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-pressed={found}
        aria-label={
          found
            ? fill(copy.markFound, { title: mark.title, line: mark.line })
            : fill(copy.markUnfound, { hint: mark.hint })
        }
        className={cn(
          "group relative grid h-9 w-9 place-items-center rounded-full transition-colors",
          found ? "text-ember" : "text-ink-faint hover:text-ember"
        )}
      >
        {!reduced && !found && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-ember/40"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <motion.svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={reduced ? undefined : found ? { rotate: 0, scale: 1 } : { scale: 1 }}
          whileHover={reduced ? undefined : { scale: 1.15, rotate: 6 }}
          whileTap={reduced ? undefined : { scale: 0.9 }}
          className={cn(found && "fill-ember/15")}
        >
          {GLYPHS[mark.glyph]}
        </motion.svg>
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="t-label pointer-events-none absolute left-1/2 top-full z-50 mt-1 w-52 -translate-x-1/2 border border-ink bg-canvas-light px-3 py-2 text-left leading-snug text-ink-soft shadow-sm"
          >
            {found ? (
              <>
                <span className="t-label block text-ember">
                  {mark.title}
                </span>
                <span className="mt-1 block">{mark.line}</span>
              </>
            ) : (
              <>
                <span className="t-label block text-ink-faint">
                  {copy.name}
                </span>
                <span className="mt-1 block italic">{mark.hint}</span>
              </>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
