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

export function SeasonsSemesters() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });


  // Both statements stay readable throughout; emphasis moves between them
  // rather than crossfading two different texts over each other.
  const seasonsTextOpacity = useTransform(scrollYProgress, [0, 0.34, 0.52], [1, 1, 0.28]);
  const semestersTextOpacity = useTransform(scrollYProgress, [0.3, 0.52], [0.28, 1]);

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-2">
          {/* Text side */}
          <div className="relative order-2 lg:order-1">
            <p className="eyebrow flex items-center gap-1">
              The Novel · The Thesis
              <Mark id="seasons" className="-my-2" />
            </p>
            <h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.05] text-ink sm:text-6xl">
              Two ways of measuring a life.
            </h2>

            <div className="mt-8 max-w-md space-y-5">
              <motion.p
                style={reduced ? undefined : { opacity: seasonsTextOpacity }}
                className="font-serif text-lg leading-relaxed text-ink-soft sm:text-xl"
              >
                <span className="text-verdant">A forest he knows by its seasons</span> — time
                that returns, circles, and forgives. Growth measured in rings, not results.
              </motion.p>
              <motion.p
                style={reduced ? undefined : { opacity: semestersTextOpacity }}
                className="font-serif text-lg leading-relaxed text-ink-soft sm:text-xl"
              >
                <span className="text-azure">A country that measures time in semesters</span> —
                time that advances, bills, and expires. Growth measured against a deadline.
              </motion.p>
            </div>

            <p className="mt-6 max-w-md text-sm text-ink-faint">
              The distance between those two clocks is the subject of both the research and
              the novel.
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
                <Form key={i} progress={scrollYProgress} index={i} reduced={reduced} />
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
      </div>
    </section>
  );
}
