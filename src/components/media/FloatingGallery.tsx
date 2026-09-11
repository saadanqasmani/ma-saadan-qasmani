"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MediaItem, MediaSet } from "@/content/media";
import type { Dictionary } from "@/content/i18n/en";

/**
 * The pop-up gallery used everywhere media is attached to a section: the work
 * entries, the medal, the MUN programmes, STARLIGHT.
 *
 * Cards enter with a spring and then keep drifting, each on its own slightly
 * different cycle, so the stack reads as floating rather than parked. The
 * panel scrolls vertically, because a set can hold anything from one frame to
 * a dozen.
 *
 * A slot with no file renders as a designed placeholder naming what belongs
 * there. That is deliberate: the feature ships working, and every photograph
 * that arrives simply fills a slot that already exists.
 */

function Placeholder({ item }: { item: MediaItem }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-dashed border-line bg-canvas">
      {/* The same engraved hatch used by the rest of the site's empty states. */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="hatch-fg" width="9" height="9" patternUnits="userSpaceOnUse">
            <path d="M0 9L9 0" stroke="var(--ink)" strokeWidth="0.5" opacity="0.16" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch-fg)" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="t-label text-ink-faint">
          {item.kind === "video" ? "Video" : "Image"} to come
        </span>
        <span className="font-serif text-lg italic leading-snug text-ink-soft">
          {item.awaiting ?? item.caption}
        </span>
      </div>

      {/* Corner brackets, so an empty slot still reads as a considered frame. */}
      {[
        "left-2 top-2 border-l border-t",
        "right-2 top-2 border-r border-t",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((c) => (
        <span key={c} className={`absolute h-4 w-4 border-ink-faint ${c}`} />
      ))}
    </div>
  );
}

function Frame({ item, index, reduced }: { item: MediaItem; index: number; reduced: boolean }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1.4 : 1.4 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.8 : 0.8 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 20,
        delay: 0.06 + index * 0.09,
      }}
      className="mb-8 last:mb-0"
    >
      <motion.div
        // The drift: small, slow, and out of phase per card.
        animate={reduced ? undefined : { y: [0, -9, 0] }}
        transition={{
          duration: 5.2 + index * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        className="shadow-[0_18px_40px_-24px_rgba(21,20,15,0.5)]"
      >
        {item.src ? (
          item.kind === "video" ? (
            <video
              src={item.src}
              controls
              playsInline
              className="block w-full border border-line bg-ink"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.caption}
              className="block w-full border border-line"
              loading="lazy"
            />
          )
        ) : (
          <Placeholder item={item} />
        )}
      </motion.div>
      <figcaption dir="auto" className="t-label mt-3 text-ink-faint">
        {item.caption}
      </figcaption>
    </motion.figure>
  );
}

export function FloatingGallery({
  set,
  open,
  onClose,
  copy,
}: {
  set: MediaSet;
  open: boolean;
  onClose: () => void;
  copy: Dictionary["gallery"];
}) {
  const reduced = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape closes, and the body must not scroll behind an open overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={set.title}
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-hidden bg-ink/45 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ y: 46, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-2xl overflow-y-auto border border-ink bg-canvas-light p-6 outline-none sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="absolute end-5 top-5 z-10 text-2xl leading-none text-ink-faint transition-colors hover:text-ink"
            >
              ×
            </button>

            <p className="eyebrow">{copy.eyebrow}</p>
            <h3 className="mt-2 max-w-[85%] font-display text-3xl leading-tight">{set.title}</h3>

            <div className="mt-8">
              {set.items.map((item, i) => (
                <Frame key={`${item.caption}-${i}`} item={item} index={i} reduced={reduced} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
