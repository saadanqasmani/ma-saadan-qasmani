"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Mark } from "@/components/collect/Mark";
import type { Dictionary } from "@/content/i18n/en";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import { FORMS, GROUND, leaves, morphPath, windows } from "@/lib/art/skyline";

/**
 * One form, holding its shape from forest to city.
 *
 * Each converts a little later than the one to its left, so the change sweeps
 * across the row rather than happening to everything at once.
 */
function Form({
  progress,
  index,
  reduced,
}: {
  progress: MotionValue<number>;
  index: number;
  reduced: boolean | null;
}) {
  const from = 0.24 + index * 0.052;
  const to = from + 0.2;
  const tallest = index === FORMS.length - 1;

  const d = useTransform(progress, (v) => {
    const k = reduced ? 1 : Math.min(1, Math.max(0, (v - from) / (to - from)));
    return morphPath(index, k * k * (3 - 2 * k));
  });
  const cityOpacity = useTransform(progress, [from + 0.04, to], [0, 1]);
  const forestOpacity = useTransform(progress, [from, to - 0.04], [1, 0]);
  const fillOpacity = useTransform(progress, [from + 0.08, to], [0, tallest ? 0.9 : 0.12]);

  return (
    <g>
      {/* One outline, drawn twice: the colour changes by crossfading two
          strokes over the same path, so the shape stays single-sourced. */}
      <motion.path
        d={d}
        fill={tallest ? "var(--ember)" : "var(--azure)"}
        style={reduced ? { fillOpacity: tallest ? 0.9 : 0.12 } : { fillOpacity }}
        stroke="none"
      />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--verdant)"
        strokeWidth={1.8}
        strokeLinejoin="round"
        style={reduced ? { opacity: 0 } : { opacity: forestOpacity }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={tallest ? "var(--ember)" : "var(--ink)"}
        strokeWidth={1.8}
        strokeLinejoin="round"
        style={reduced ? { opacity: 1 } : { opacity: cityOpacity }}
      />

      <motion.g
        fill="var(--verdant)"
        style={reduced ? { opacity: 0 } : { opacity: forestOpacity }}
      >
        {leaves(index).map((l, i) => (
          <circle key={i} cx={l.x} cy={l.y} r={2.2} opacity={0.6} />
        ))}
      </motion.g>

      <motion.g
        fill={tallest ? "var(--canvas)" : "var(--ink)"}
        style={reduced ? { opacity: 0.45 } : { opacity: cityOpacity }}
      >
        {windows(index).map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} opacity={0.45} />
        ))}
      </motion.g>
    </g>
  );
}

/**
 * The forest becoming a city, driven two different ways.
 *
 * On a wide screen the section pins and the morph is tied to the scrollbar,
 * which is the whole idea: you turn the forest into the city yourself, at
 * your own speed.
 *
 * On a phone that reads as the page having ended. The frame stops moving,
 * the art is small enough that the change in it is easy to miss, and a
 * thumb-flick gives none of the fine control the effect was built for — so
 * people stop scrolling and leave, believing they have reached the bottom.
 * There the section scrolls past like any other, and the morph is tied to
 * the section's own travel through the viewport instead of to a pin.
 *
 * Tied to scroll on both, and so reversible on both: scroll back up and the
 * city returns to forest. It played once on a timer before, which left a
 * reader who scrolled back up looking at a city that would not undo itself.
 */
export function SeasonsSemesters({ copy }: { copy: Dictionary["seasons"] }) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  // Two readings of the same section. Pinned, the section is taller than the
  // screen and its own top-to-bottom travel is the range. Unpinned, it is
  // shorter than the screen, so the range has to be its passage across the
  // viewport instead, or the morph would have almost no room to run in.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: passing } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // That unpinned range covers the whole approach and departure, so taken raw
  // the last tower would convert with the art already sliding off the top.
  // Squeezing it into the middle keeps the change where it can be watched.
  const centred = useTransform(passing, [0.15, 0.72], [0, 1], { clamp: true });

  const progress = isDesktop ? scrollYProgress : centred;

  // Both statements stay readable throughout; emphasis moves between them
  // rather than crossfading two different texts over each other. Only where
  // the reader controls the progress — dimming a paragraph on a phone just
  // makes it harder to read, with nothing gained.
  const seasonsTextOpacity = useTransform(scrollYProgress, [0, 0.34, 0.52], [1, 1, 0.28]);
  const semestersTextOpacity = useTransform(scrollYProgress, [0.3, 0.52], [0.28, 1]);
  const dim = isDesktop && !reduced;

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:h-[220vh] lg:py-0">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-2">
          {/* Text side */}
          <div className="relative order-2 lg:order-1">
            <p className="eyebrow flex items-center gap-1">
              {copy.eyebrow}
              <Mark id="seasons" className="-my-2" />
            </p>
            <h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
              {copy.heading}
            </h2>

            <div className="mt-8 max-w-md space-y-5">
              <motion.p
                style={dim ? { opacity: seasonsTextOpacity } : undefined}
                className="font-serif text-lg leading-relaxed text-ink-soft sm:text-xl"
              >
                <span className="text-verdant">{copy.forestLead}</span> {copy.forestRest}
              </motion.p>
              <motion.p
                style={dim ? { opacity: semestersTextOpacity } : undefined}
                className="font-serif text-lg leading-relaxed text-ink-soft sm:text-xl"
              >
                <span className="text-azure">{copy.semestersLead}</span> {copy.semestersRest}
              </motion.p>
            </div>

            <p className="mt-6 max-w-md text-sm text-ink-faint">
              {copy.note}
            </p>
          </div>

          {/* Artwork side */}
          <div className="order-1 lg:order-2">
            <svg
              viewBox="0 0 600 600"
              fill="none"
              className="mx-auto h-[42vh] w-full max-w-xl lg:h-[70vh]"
              aria-hidden
            >
              {/* A forest that becomes a city — the arc of the novel,
                  and the distance between the two clocks beside it. */}
              {FORMS.map((_, i) => (
                <Form key={i} progress={progress} index={i} reduced={reduced} />
              ))}

              <motion.line
                x1={40}
                y1={GROUND}
                x2={568}
                y2={GROUND}
                stroke="var(--ink)"
                strokeWidth={1.5}
                opacity={0.45}
              />
            </svg>
          </div>
        </div>

        {/* Proof that the page is still moving.
            While the section is pinned the scrollbar is the only thing that
            changes, and on a tall screen it is easy to miss. This fills as
            the morph runs, so a reader can see that scrolling is doing
            something and that there is more underneath. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center lg:flex">
          <div className="flex items-center gap-3">
            <span className="t-label text-ink-faint">
              {copy.forest}
            </span>
            <span className="relative block h-px w-40 bg-[var(--line-strong)]">
              <motion.span
                className="absolute inset-y-0 start-0 block w-full bg-ember"
                style={{ scaleX: progress, transformOrigin: "left" }}
              />
            </span>
            <span className="t-label text-ink-faint">{copy.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
