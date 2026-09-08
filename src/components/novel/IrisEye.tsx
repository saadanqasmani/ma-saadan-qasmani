"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The entrance to the IRIS page: an eye opens, then the view travels through
 * the pupil into the page.
 *
 * The pupil is filled with the page's own background rather than with black,
 * so scaling it up does not black the screen out — it opens the page. The
 * lids, iris and radiating fibres are drawn in the same ink as the rest of
 * the site, and the whole thing is skippable and silent for anyone who
 * prefers reduced motion.
 */

const DURATION = 2400;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const CX = 500;
const CY = 300;

/** The aperture between the lids, as a lens shape of a given half-height. */
function lidPath(h: number) {
  const w = 300;
  return `M ${CX - w} ${CY} Q ${CX} ${CY - h} ${CX + w} ${CY} Q ${CX} ${CY + h} ${CX - w} ${CY} Z`;
}

/** Iris fibres: deterministic, so server and client agree. */
const FIBRES = Array.from({ length: 56 }, (_, i) => {
  const a = (i / 56) * Math.PI * 2;
  const jitter = ((i * 37) % 11) / 11;
  return { a, inner: 26 + jitter * 8, outer: 74 + jitter * 18 };
});

export function IrisEye() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const started = useRef(0);

  const playing = !reduced && !done;

  const finish = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setDone(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    started.current = performance.now();
    const tick = (now: number) => {
      const k = (now - started.current) / DURATION;
      if (k >= 1) {
        finish();
        return;
      }
      setT(k);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // Keyed on `playing` alone: re-running on every frame would restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Three movements: the lids part, the iris settles, the view goes through.
  const open = easeOut(clamp01(t / 0.3));
  const settle = clamp01((t - 0.28) / 0.24);
  const travel = easeInOut(clamp01((t - 0.55) / 0.45));

  const lidH = 8 + open * 182;
  const scale = 1 + travel * 46;
  const fade = 1 - clamp01((t - 0.86) / 0.14);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="iris-eye"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          className="fixed inset-0 z-[200] cursor-pointer bg-canvas"
          aria-hidden
          style={{ opacity: fade }}
        >
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
          >
            <defs>
              <clipPath id="iris-aperture">
                <path d={lidPath(lidH)} />
              </clipPath>
            </defs>

            <g
              style={{
                transform: `scale(${scale})`,
                transformOrigin: `${CX}px ${CY}px`,
              }}
            >
              <g clipPath="url(#iris-aperture)">
                {/* Sclera */}
                <rect x={0} y={0} width={1000} height={600} fill="var(--canvas-light)" />

                {/* Iris fibres, drawn as the lids open */}
                <g stroke="var(--azure)" strokeWidth={1.6} opacity={0.5 * settle}>
                  {FIBRES.map((f, i) => (
                    <line
                      key={i}
                      x1={CX + Math.cos(f.a) * f.inner}
                      y1={CY + Math.sin(f.a) * f.inner}
                      x2={CX + Math.cos(f.a) * (f.inner + (f.outer - f.inner) * settle)}
                      y2={CY + Math.sin(f.a) * (f.inner + (f.outer - f.inner) * settle)}
                    />
                  ))}
                </g>

                <circle
                  cx={CX}
                  cy={CY}
                  r={92}
                  stroke="var(--azure)"
                  strokeWidth={2.4}
                  fill="none"
                  opacity={0.75 * settle}
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={54}
                  stroke="var(--ember)"
                  strokeWidth={1.6}
                  fill="none"
                  opacity={0.6 * settle}
                />

                {/* The pupil carries the page's own ground, so travelling into
                    it opens the page rather than blacking the screen out. */}
                <circle cx={CX} cy={CY} r={26} fill="var(--canvas)" />
              </g>

              {/* Lid line */}
              <path
                d={lidPath(lidH)}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={3}
                opacity={0.9}
              />
            </g>
          </svg>

          <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            IRIS
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
