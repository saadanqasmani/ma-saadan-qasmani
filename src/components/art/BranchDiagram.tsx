"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform, useMotionValue } from "motion/react";

/**
 * The branching diagram — the site's central mark.
 * Reads at once as botany (the novel), a route map (international work),
 * and a network topology (partnerships).
 *
 * The skeleton is deliberate rather than random: a trunk carries nine
 * stations in strict chronological order from the first degree at the
 * bottom to the novel at the crown, and four roots run below the ground
 * line for what came before any of it. Everything else — the twigs, the
 * bends, the scatter of small nodes — is still generated from a fixed seed,
 * so the drawing keeps its hand-made texture while the biography stays
 * exactly where it belongs.
 *
 * Nothing here is invented. Every label is Saadan's own wording.
 */

type Segment = { d: string; width: number; depth: number; root?: boolean };
type Node = { x: number; y: number; r: number; depth: number; tone: number; ring: boolean };
type Station = {
  label: string;
  sub: string;
  /** Position along the trunk, 0 at the ground line and 1 at the crown. */
  t: number;
  /** Which way the limb leaves the trunk. */
  side: -1 | 1;
};
type Root = { label: string; sub: string; angle: number; len: number };

/** Bottom of the trunk upward. Order is the point of this diagram. */
const STATIONS: Station[] = [
  { label: "Istanbul Aydın University", sub: "Business Administration", t: 0.08, side: -1 },
  { label: "STARLIGHT", sub: "Türkiye's first international student magazine", t: 0.2, side: 1 },
  { label: "Model United Nations", sub: "Founded and launched four MUNs", t: 0.31, side: -1 },
  { label: "UNESCO", sub: "Peace and Diplomacy Programmes", t: 0.42, side: 1 },
  {
    label: "STAR Scholars Network",
    sub: "Director, Global Engagement & Brand Strategy",
    t: 0.53,
    side: -1,
  },
  { label: "International Student Recruitment", sub: "", t: 0.64, side: 1 },
  { label: "Research Assistant", sub: "Protégé to Dr. Osman Gultekin", t: 0.75, side: -1 },
  { label: "IRIS", sub: "Co-founder — internationalization platform", t: 0.86, side: 1 },
  { label: "The Highest Branch", sub: "A novel — forthcoming", t: 1, side: 1 },
];

/** Below the ground line. 90deg is straight down. */
const ROOTS: Root[] = [
  { label: "Takhaiyyul", sub: "NGO", angle: 161, len: 268 },
  { label: "WWF", sub: "Internship", angle: 127, len: 196 },
  { label: "Assistant to Career Advisor", sub: "", angle: 57, len: 214 },
  { label: "Beaconhouse School System", sub: "A and O Levels", angle: 21, len: 252 },
];

const GROUND_Y = 1000;
const CROWN_Y = 118;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The trunk's centre line. A slow sway that straightens as it rises, so the
 * base reads as grown and the crown as reaching.
 */
function trunkAt(t: number) {
  return {
    x: 500 + Math.sin(t * 2.9 + 0.35) * 58 * (1 - t * 0.4) + t * 26,
    y: GROUND_Y - t * (GROUND_Y - CROWN_Y),
  };
}

function build(seed: number) {
  const rand = mulberry32(seed);
  const segments: Segment[] = [];
  const nodes: Node[] = [];
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

  const track = (x: number, y: number) => {
    if (x < bounds.minX) bounds.minX = x;
    if (y < bounds.minY) bounds.minY = y;
    if (x > bounds.maxX) bounds.maxX = x;
    if (y > bounds.maxY) bounds.maxY = y;
  };

  const line = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    bend: number,
    width: number,
    depth: number,
    root = false
  ) => {
    const nx = -(y2 - y);
    const ny = x2 - x;
    const l = Math.hypot(nx, ny) || 1;
    const mx = (x + x2) / 2 + (nx / l) * bend;
    const my = (y + y2) / 2 + (ny / l) * bend;
    track(x, y);
    track(x2, y2);
    track(mx, my);
    segments.push({
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      width,
      depth,
      root,
    });
  };

  /** Free-growing twig, kept for the texture of the original drawing. */
  function twig(
    x: number,
    y: number,
    angle: number,
    len: number,
    width: number,
    depth: number,
    maxDepth: number,
    root = false
  ) {
    const rad = (angle * Math.PI) / 180;
    const x2 = x + Math.cos(rad) * len;
    const y2 = y + Math.sin(rad) * len;
    line(x, y, x2, y2, (rand() - 0.5) * len * 0.3, width, depth, root);

    if (depth >= maxDepth) {
      if (rand() > 0.5) {
        nodes.push({ x: x2, y: y2, r: 2.6, depth, tone: Math.floor(rand() * 3), ring: false });
      }
      return;
    }
    if (rand() > 0.72) {
      nodes.push({ x: x2, y: y2, r: 3.6, depth, tone: Math.floor(rand() * 3), ring: rand() > 0.7 });
    }

    const children = rand() > 0.72 ? 3 : 2;
    const spread = 16 + rand() * 16;
    for (let i = 0; i < children; i++) {
      const t = i / (children - 1) - 0.5;
      twig(
        x2,
        y2,
        angle + t * spread * 2 + (rand() - 0.5) * 9,
        len * (0.72 + rand() * 0.1),
        width * 0.68,
        depth + 1,
        maxDepth,
        root
      );
    }
  }

  // ── Trunk ──────────────────────────────────────────────────────────────
  const TRUNK_STEPS = 18;
  for (let i = 0; i < TRUNK_STEPS; i++) {
    const a = trunkAt(i / TRUNK_STEPS);
    const b = trunkAt((i + 1) / TRUNK_STEPS);
    line(a.x, a.y, b.x, b.y, 0, 5.4 - (i / TRUNK_STEPS) * 3.4, 0);
  }

  // ── Stations ───────────────────────────────────────────────────────────
  const stations = STATIONS.map((st, i) => {
    const base = trunkAt(st.t);

    // The crown is the trunk's own tip: the highest branch is the trunk.
    if (st.t >= 1) {
      const tip = { x: base.x + 18, y: base.y - 62 };
      line(base.x, base.y, tip.x, tip.y, 8, 2.1, 1);
      for (let k = 0; k < 3; k++) {
        twig(tip.x, tip.y, -118 + k * 34 + rand() * 8, 62 + rand() * 22, 1.5, 2, 4);
      }
      track(tip.x, tip.y - 40);
      return { ...st, x: tip.x, y: tip.y, index: i };
    }

    // Long and near-level low down, short and steep near the crown.
    const rise = 0.1 + st.t * 0.72 + (rand() - 0.5) * 0.2;
    const len = 232 - st.t * 88 + rand() * 54;
    const tip = { x: base.x + st.side * len, y: base.y - len * rise };

    // An elbow at roughly half way: the limb drops away from the trunk before
    // it lifts, which is what makes a branch look grown rather than drawn.
    const jx = base.x + st.side * len * (0.44 + rand() * 0.12);
    const jy = base.y - len * rise * (0.2 + rand() * 0.2);
    line(base.x, base.y, jx, jy, st.side * (10 + rand() * 12), 3, 1);
    line(jx, jy, tip.x, tip.y, st.side * (14 + rand() * 16), 2.2, 1);

    // Two to four twigs off each limb, so a station reads as a real fork.
    const outward = st.side === 1 ? -32 : -148;
    const fan = 2 + Math.floor(rand() * 3);
    for (let k = 0; k < fan; k++) {
      twig(
        tip.x,
        tip.y,
        outward + (k - (fan - 1) / 2) * (24 + rand() * 18) + (rand() - 0.5) * 16,
        62 + rand() * 46,
        1.6,
        2,
        4
      );
    }

    return { ...st, x: tip.x, y: tip.y, index: i };
  });

  // ── Roots ──────────────────────────────────────────────────────────────
  const roots = ROOTS.map((rt, i) => {
    const rad = (rt.angle * Math.PI) / 180;
    const tip = {
      x: 500 + Math.cos(rad) * rt.len,
      y: GROUND_Y + Math.sin(rad) * rt.len,
    };
    line(500, GROUND_Y, tip.x, tip.y, (i % 2 === 0 ? 1 : -1) * 30, 2.9, 1, true);

    // A root that does not fray does not read as a root.
    for (let k = 0; k < 2; k++) {
      twig(tip.x, tip.y, rt.angle + (k === 0 ? -26 : 24) + rand() * 8, 54 + rand() * 26, 1.5, 2, 3, true);
    }

    return { ...rt, x: tip.x, y: tip.y, index: STATIONS.length + i };
  });

  const pad = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.06;
  const vb = {
    x: bounds.minX - pad,
    y: bounds.minY - pad,
    w: bounds.maxX - bounds.minX + pad * 2,
    h: bounds.maxY - bounds.minY + pad * 2,
  };

  return { segments, nodes, stations, roots, vb };
}

const TONES = ["var(--azure)", "var(--ember)", "var(--verdant)"];

export function BranchDiagram({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { segments, nodes, stations, roots, vb } = useMemo(() => build(20260907), []);

  // Keep annotation type legible whatever the fitted viewBox works out to be
  const s = vb.w / 1000;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const tx = useTransform(sx, [-1, 1], [-14, 14]);
  const ty = useTransform(sy, [-1, 1], [-10, 10]);

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }

  const marks = [
    ...stations.map((st) => ({ ...st, isRoot: false })),
    ...roots.map((rt) => ({ ...rt, isRoot: true })),
  ];

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className={className}
    >
      <motion.svg
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        fill="none"
        className="h-full w-full"
        style={reduced ? undefined : { x: tx, y: ty }}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="A tree whose branches and roots mark the stages of Saadan Qasmani's work, from A and O Levels at the roots to the novel The Highest Branch at the crown"
      >
        {/* The ground line: everything below it came before everything above it. */}
        <motion.line
          x1={vb.x + 10 * s}
          y1={GROUND_Y}
          x2={vb.x + vb.w - 10 * s}
          y2={GROUND_Y}
          stroke="var(--ink)"
          strokeWidth={1 * s}
          strokeDasharray={`${5 * s} ${9 * s}`}
          opacity={0.28}
          initial={reduced ? undefined : { pathLength: 0 }}
          animate={reduced ? undefined : { pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />

        {segments.map((seg, i) => (
          <motion.path
            key={i}
            d={seg.d}
            stroke="var(--ink)"
            strokeWidth={seg.width * s}
            strokeLinecap="round"
            opacity={(seg.root ? 0.5 : 0.92) - seg.depth * 0.05}
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={reduced ? undefined : { pathLength: 1 }}
            transition={{
              duration: 1.1,
              // Roots draw downward from the base while the trunk climbs, so
              // the whole thing appears to take hold and reach at once.
              delay: 0.15 + seg.depth * 0.2 + (i % 9) * 0.012,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {nodes.map((node, i) => (
          <motion.g
            key={`n-${i}`}
            initial={reduced ? undefined : { opacity: 0, scale: 0.2 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + node.depth * 0.2 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {node.ring && (
              <circle
                cx={node.x}
                cy={node.y}
                r={(node.r + 5) * s}
                stroke={TONES[node.tone]}
                strokeWidth={1 * s}
                opacity={0.5}
              />
            )}
            <circle cx={node.x} cy={node.y} r={node.r * s} fill={TONES[node.tone]} />
          </motion.g>
        ))}

        {/* Stations and roots: the labelled, interactive marks */}
        {marks.map((m) => {
          const i = m.index;
          const isActive = active === i;
          const flip = m.x > vb.x + vb.w / 2;
          // Approximate advance width per line (label 20px/600, sub 15px/400)
          const cardW = (Math.max(m.label.length * 11.4, m.sub.length * 7.6) + 40) * s;
          const cardH = (m.sub ? 66 : 44) * s;
          const gap = 24 * s;
          const rawX = flip ? m.x - cardW - gap : m.x + gap;
          const cardX = Math.min(
            Math.max(rawX, vb.x + 6 * s),
            vb.x + vb.w - cardW - 6 * s
          );
          const cardY = Math.min(
            Math.max(m.y - cardH / 2, vb.y + 6 * s),
            vb.y + vb.h - cardH - 6 * s
          );

          return (
            <g key={`m-${i}`}>
              <motion.g
                initial={reduced ? undefined : { opacity: 0, scale: 0 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 1.4 + i * 0.09 }}
                style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="button"
                aria-label={m.sub ? `${m.label} — ${m.sub}` : m.label}
                className="cursor-pointer outline-none"
              >
                <circle cx={m.x} cy={m.y} r={40 * s} fill="transparent" />
                {!reduced && (
                  <motion.circle
                    cx={m.x}
                    cy={m.y}
                    r={11 * s}
                    stroke={m.isRoot ? "var(--verdant)" : "var(--ember)"}
                    strokeWidth={1.3 * s}
                    animate={{ r: [11 * s, 22 * s, 11 * s], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={(isActive ? 10.5 : 7.5) * s}
                  fill={m.isRoot ? "var(--verdant)" : "var(--ember)"}
                  className="transition-all duration-300"
                />
                <circle cx={m.x} cy={m.y} r={3 * s} fill="var(--canvas)" />
              </motion.g>

              {isActive && (
                <motion.g
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ pointerEvents: "none" }}
                >
                  <line
                    x1={m.x}
                    y1={m.y}
                    x2={flip ? cardX + cardW : cardX}
                    y2={cardY + cardH / 2}
                    stroke={m.isRoot ? "var(--verdant)" : "var(--ember)"}
                    strokeWidth={1.2 * s}
                  />
                  <rect
                    x={cardX}
                    y={cardY}
                    width={cardW}
                    height={cardH}
                    fill="var(--canvas-light)"
                    stroke="var(--ink)"
                    strokeWidth={1.4 * s}
                  />
                  <text
                    x={cardX + 18 * s}
                    y={cardY + 27 * s}
                    fontSize={20 * s}
                    fontWeight={600}
                    className="fill-ink font-sans"
                  >
                    {m.label}
                  </text>
                  {m.sub && (
                    <text
                      x={cardX + 18 * s}
                      y={cardY + 49 * s}
                      fontSize={15 * s}
                      className="fill-ink-soft font-sans"
                    >
                      {m.sub}
                    </text>
                  )}
                </motion.g>
              )}
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}
