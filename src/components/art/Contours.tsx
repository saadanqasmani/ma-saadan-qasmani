"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Topographic contours of a pass — the crossing at the centre of the novel.
 * Deterministic: the same rings render on server and client.
 */

const LEVELS = 13;
const POINTS = 72;
const CX = 500;
const CY = 470;

function contour(level: number) {
  const t = level / LEVELS;
  const base = 340 * (1 - t * 0.86);
  const cx = CX + t * 42;
  const cy = CY - t * 118;
  const pts: string[] = [];

  for (let i = 0; i <= POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    const wobble =
      Math.sin(a * 3 + 1.2) * 34 * (1 - t * 0.5) +
      Math.sin(a * 5 + 0.4) * 20 * (1 - t * 0.4) +
      Math.sin(a * 7 + 2.1) * 12 * (1 - t * 0.3);
    const r = base + wobble;
    pts.push(`${(cx + Math.cos(a) * r * 1.28).toFixed(1)} ${(cy + Math.sin(a) * r * 0.72).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

export function Contours({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const paths = useMemo(() => Array.from({ length: LEVELS }, (_, i) => contour(i)), []);

  return (
    <svg viewBox="0 0 1000 760" fill="none" className={className} aria-hidden>
      {paths.map((d, i) => {
        const t = i / LEVELS;
        const isSummit = i >= LEVELS - 3;
        return (
          <motion.path
            key={i}
            d={d}
            stroke={isSummit ? "var(--ember)" : "var(--verdant)"}
            strokeWidth={isSummit ? 1.6 : 1.1}
            opacity={0.22 + t * 0.6}
            initial={reduced ? undefined : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}

      {/* The crossing */}
      <motion.path
        d={`M 96 690 C 300 640, 340 520, 470 430 S 600 360, 556 322`}
        stroke="var(--azure)"
        strokeWidth={2}
        strokeDasharray="7 8"
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 2.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.g
        initial={reduced ? undefined : { opacity: 0, scale: 0.4 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, delay: 2.4 }}
        style={{ transformOrigin: "556px 322px" }}
      >
        <circle cx={556} cy={322} r={16} stroke="var(--ember)" strokeWidth={1.2} opacity={0.6} />
        <circle cx={556} cy={322} r={6.5} fill="var(--ember)" />
      </motion.g>
    </svg>
  );
}
