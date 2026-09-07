"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

const BAR_COUNT = 8;
const BAR_HEIGHTS = [120, 168, 210, 236, 252, 236, 268, 300];

function Bar({
  progress,
  index,
  reduced,
}: {
  progress: MotionValue<number>;
  index: number;
  reduced: boolean | null;
}) {
  const start = 0.42 + index * 0.045;
  const scaleY = useTransform(progress, [start, start + 0.12], [0, 1]);
  const height = BAR_HEIGHTS[index];
  const x = 92 + index * 52;

  return (
    <motion.rect
      x={x}
      y={520 - height}
      width={30}
      height={height}
      fill={index === BAR_COUNT - 1 ? "var(--ember)" : "var(--azure)"}
      opacity={index === BAR_COUNT - 1 ? 1 : 0.32 + index * 0.08}
      style={
        reduced
          ? undefined
          : { scaleY, transformOrigin: `${x + 15}px 520px` }
      }
    />
  );
}

export function SeasonsSemesters() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const ringsOpacity = useTransform(scrollYProgress, [0.1, 0.45], [1, 0]);
  const ringsScale = useTransform(scrollYProgress, [0.1, 0.5], [1, 0.72]);
  const ringsRotate = useTransform(scrollYProgress, [0, 0.5], [0, 26]);

  // Both statements stay readable throughout; emphasis moves between them
  // rather than crossfading two different texts over each other.
  const seasonsTextOpacity = useTransform(scrollYProgress, [0, 0.34, 0.52], [1, 1, 0.28]);
  const semestersTextOpacity = useTransform(scrollYProgress, [0.3, 0.52], [0.28, 1]);
  const axisOpacity = useTransform(scrollYProgress, [0.36, 0.5], [0, 1]);

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:px-10 lg:grid-cols-2">
          {/* Text side */}
          <div className="relative order-2 lg:order-1">
            <p className="eyebrow">The Novel · The Thesis</p>
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
              {/* Seasons — concentric rings */}
              <motion.g
                style={
                  reduced
                    ? undefined
                    : {
                        opacity: ringsOpacity,
                        scale: ringsScale,
                        rotate: ringsRotate,
                        transformOrigin: "300px 300px",
                      }
                }
              >
                {[210, 168, 126, 84, 44].map((r, i) => (
                  <circle
                    key={r}
                    cx={300}
                    cy={300}
                    r={r}
                    stroke={i % 2 === 0 ? "var(--verdant)" : "var(--ember)"}
                    strokeWidth={i === 0 ? 2 : 1.4}
                    opacity={0.85 - i * 0.08}
                    strokeDasharray={i === 1 || i === 3 ? "3 9" : undefined}
                  />
                ))}
                {[0, 90, 180, 270].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <circle
                      key={deg}
                      cx={300 + Math.cos(rad) * 210}
                      cy={300 + Math.sin(rad) * 210}
                      r={6}
                      fill="var(--verdant)"
                    />
                  );
                })}
                <circle cx={300} cy={300} r={10} fill="var(--ember)" />
              </motion.g>

              {/* Semesters — rigid bars */}
              <g>
                {Array.from({ length: BAR_COUNT }).map((_, i) => (
                  <Bar key={i} progress={scrollYProgress} index={i} reduced={reduced} />
                ))}
              </g>
              <motion.line
                x1={70}
                y1={520}
                x2={540}
                y2={520}
                stroke="var(--ink)"
                strokeWidth={1.5}
                style={reduced ? undefined : { opacity: axisOpacity }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
