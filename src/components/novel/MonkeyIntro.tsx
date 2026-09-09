"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { frameAt, type Frame } from "@/lib/novel/monkeySequence";
import { IntroScene } from "@/components/novel/IntroScene";

/**
 * The title sequence for The Highest Branch.
 *
 * A macaque hangs from the reckoning tree, drops, crosses the ground, meets a
 * crowd, comes out the other side in a suit, climbs a building and leaves the
 * frame, revealing the page underneath.
 *
 * Painted rather than drawn: the figure is built from filled, tapering
 * volumes so it reads as a body, and the whole sequence runs on the light the
 * novel keeps returning to, which goes orange, and then blue, and then gone.
 * That is the book's own refrain, and it happens to be this site's two
 * accents, so the sequence lights itself in the colours the rest of the pages
 * already use.
 *
 * It plays once per visitor and can be skipped at any moment; anyone who
 * prefers reduced motion never sees it at all.
 */

const DURATION = 8200;
const SEEN_KEY = "thb-intro-seen";

/**
 * Whether this visitor has already watched it.
 *
 * Read through an external store rather than an effect: deciding to play is a
 * question about the browser, not a state change to schedule, and setting
 * state from an effect body to answer it causes a cascading render.
 *
 * The server snapshot is `true`, so the sequence never exists in the markup
 * and can only ever begin after hydration.
 */
function subscribeSeen(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readSeen() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Storage blocked: they simply see it again. Not worth failing over.
    return false;
  }
}

export function MonkeyIntro() {
  const reduced = useReducedMotion();
  const seen = useSyncExternalStore(subscribeSeen, readSeen, () => true);
  const [done, setDone] = useState(false);
  const [frame, setFrame] = useState<Frame>(() => frameAt(0));
  const raf = useRef<number | null>(null);
  const started = useRef<number>(0);

  const playing = !reduced && !seen && !done;

  const finish = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // As above: a blocked store just means it plays again next time.
    }
    setDone(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    started.current = performance.now();
    const tick = (now: number) => {
      const t = (now - started.current) / DURATION;
      if (t >= 1) {
        setFrame(frameAt(1));
        finish();
        return;
      }
      setFrame(frameAt(t));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // Deliberately keyed on `playing` alone: restarting the clock whenever a
    // frame lands would freeze the sequence on its first frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // The page behind must not scroll while the sequence owns the screen.
  useEffect(() => {
    if (!playing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [playing, finish]);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-[#0d1424]"
          aria-hidden
        >
          <IntroScene frame={frame} />

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 right-8 border border-white/40 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
