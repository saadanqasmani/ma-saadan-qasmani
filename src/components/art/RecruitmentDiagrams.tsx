"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { recruitment } from "@/content/recruitment";

/**
 * Two diagrams for the recruitment page.
 *
 * Neither carries a number. The pipeline is a process and the ladder is a
 * policy; putting volumes on either would be inventing a claim about how many
 * students pass through, which is not something this site knows.
 */

const ORANGE = "var(--rec-orange)";
const DEEP = "var(--rec-orange-deep)";

/**
 * The funnel deepens toward the end rather than sitting flat until the last
 * stage: the further a student travels, the more of the institution's colour
 * they carry. It is a tint ramp, not a quantity, so it asserts nothing about
 * how many survive each step.
 */
function stageFill(i: number, count: number) {
  const t = count > 1 ? i / (count - 1) : 1;
  return `color-mix(in oklab, var(--rec-orange) ${Math.round(18 + t * 82)}%, var(--rec-pale))`;
}

/** The stages, narrowing left to right, drawn as they come into view. */
export function Pipeline() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion();
  const stages = recruitment.pipeline;
  const W = 640;
  const H = 190;
  const gap = 10;
  const bw = (W - gap * (stages.length - 1)) / stages.length;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img"
      aria-label={`Recruitment pipeline: ${stages.join(", then ")}`}>
      {stages.map((s, i) => {
        // Each stage is shorter than the last: the shape of a funnel without
        // asserting how much falls away at each step.
        const h = 104 - i * 15;
        const x = i * (bw + gap);
        const y = 34 + (104 - h) / 2;
        return (
          <g key={s}>
            <motion.rect
              x={x}
              y={y}
              width={bw}
              height={h}
              fill={stageFill(i, stages.length)}
              initial={reduced ? undefined : { scaleY: 0, opacity: 0 }}
              animate={reduced || inView ? { scaleY: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${x + bw / 2}px ${y + h / 2}px` }}
            />
            <text
              x={x + bw / 2}
              y={H - 26}
              textAnchor="middle"
              fontSize={15}
              className="fill-[var(--rec-ink-soft)] font-sans"
            >
              {s}
            </text>
            {i < stages.length - 1 && (
              <motion.path
                d={`M ${x + bw + 1.5} ${86} l 5 0 m -2 -3 l 3 3 l -3 3`}
                stroke={ORANGE}
                strokeWidth={1.4}
                fill="none"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced || inView ? { opacity: 0.7 } : undefined}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.11 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * The three tiers as a ladder, with a partner climbing it on a loop.
 *
 * The climb is CSS so it costs nothing per frame, and it stops under reduced
 * motion, where the diagram still reads as three labelled tiers.
 */
export function TierLadder() {
  const tiers = recruitment.tiers;
  const W = 560;
  const rowH = 78;
  const gap = 14;
  const H = tiers.length * (rowH + gap) + 40;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img"
      aria-label="Three partner tiers, with movement upward earned on conversion, responsiveness and referral quality">
      {tiers.map((t, i) => {
        // Drawn bottom to top, so Tier 1 sits at the top of the ladder.
        const row = tiers.length - 1 - i;
        const y = 20 + row * (rowH + gap);
        const width = W - 150 + i * 58;
        return (
          <g key={t.n}>
            <rect x={20} y={y} width={width} height={rowH} fill="#ffffff" stroke="var(--rec-pale)" />
            <rect x={20} y={y} width={5} height={rowH} fill={i === 0 ? ORANGE : "var(--rec-pale)"} />
            <text x={40} y={y + 31} fontSize={13} letterSpacing="2" className="fill-[var(--rec-orange)] font-sans">
              {t.n.toUpperCase()}
            </text>
            <text x={40} y={y + 56} fontSize={19} className="fill-[var(--rec-ink)] font-serif">
              {t.name}
            </text>
          </g>
        );
      })}

      {/* The partner, climbing. */}
      <g
        className="tier-token"
        style={{ "--tier-step": `${rowH + gap}px` } as React.CSSProperties}
      >
        <circle cx={W - 42} cy={20 + 2 * (rowH + gap) + rowH / 2} r={13} fill={DEEP} />
        <circle cx={W - 42} cy={20 + 2 * (rowH + gap) + rowH / 2} r={4.5} fill="#ffffff" />
      </g>
    </svg>
  );
}
