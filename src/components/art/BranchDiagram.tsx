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
type Station = { label: string; sub: string };
type Root = { label: string; sub: string };

/** Bottom of the trunk upward. Order is the point of this diagram. */
const STATIONS: Station[] = [
  { label: "Istanbul Aydın University", sub: "Business Administration" },
  { label: "STARLIGHT", sub: "Türkiye's first international student magazine" },
  { label: "Model United Nations", sub: "Founded and launched four MUNs" },
  { label: "UNESCO", sub: "Peace and Diplomacy Programmes" },
  {
    label: "STAR Scholars Network",
    sub: "Director, Global Engagement & Brand Strategy",
  },
  { label: "International Student Recruitment", sub: "" },
  { label: "Research Assistant", sub: "Protégé to Dr. Osman Gültekin" },
  { label: "IRIS", sub: "Co-founder — internationalization platform" },
  { label: "The Highest Branch", sub: "A novel — forthcoming" },
];

/** Below the ground line, left to right. */
const ROOTS: Root[] = [
  { label: "Takhaiyyul", sub: "NGO" },
  { label: "WWF", sub: "Internship" },
  { label: "Assistant to Career Advisor", sub: "" },
  { label: "Beaconhouse School System", sub: "A and O Levels" },
];

const GROUND_Y = 1000;
/** Where the trunk leaves the ground. Roots start from the same point, which
 *  is the whole reason they read as attached. */
const BASE_X = 500;
const MAX_DEPTH = 6;
const ROOT_DEPTH = 3;

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

type Junction = { x: number; y: number; depth: number };

function build(seed: number) {
  const rand = mulberry32(seed);
  const segments: Segment[] = [];
  const nodes: Node[] = [];
  const junctions: Junction[] = [];
  const rootTips: { x: number; y: number; branch: number; dist: number }[] = [];
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

  const track = (x: number, y: number) => {
    if (x < bounds.minX) bounds.minX = x;
    if (y < bounds.minY) bounds.minY = y;
    if (x > bounds.maxX) bounds.maxX = x;
    if (y > bounds.maxY) bounds.maxY = y;
  };

  /**
   * The original recursive growth, unchanged. Every fork is a real fork and
   * every limb tapers from the one it left, which is what makes it read as a
   * tree rather than a diagram of one.
   */
  function grow(x: number, y: number, angle: number, len: number, width: number, depth: number) {
    const rad = (angle * Math.PI) / 180;
    const x2 = x + Math.cos(rad) * len;
    const y2 = y + Math.sin(rad) * len;

    const bend = (rand() - 0.5) * len * 0.34;
    const mx = (x + x2) / 2 + Math.cos(rad + Math.PI / 2) * bend;
    const my = (y + y2) / 2 + Math.sin(rad + Math.PI / 2) * bend;

    track(x, y);
    track(x2, y2);
    track(mx, my);

    segments.push({
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      width,
      depth,
    });

    junctions.push({ x: x2, y: y2, depth });

    if (depth >= MAX_DEPTH) {
      if (rand() > 0.62) {
        nodes.push({ x: x2, y: y2, r: 3, depth, tone: Math.floor(rand() * 3), ring: false });
      }
      return;
    }

    if (depth >= 2 && depth <= 4 && rand() > 0.66) {
      nodes.push({
        x: x2,
        y: y2,
        r: depth <= 3 ? 5 : 4,
        depth,
        tone: Math.floor(rand() * 3),
        ring: depth <= 3 && rand() > 0.55,
      });
    }

    const children = depth < 2 ? 2 : rand() > 0.78 ? 3 : 2;
    const spread = 17 + rand() * 15;

    for (let i = 0; i < children; i++) {
      const t = i / (children - 1) - 0.5;
      const offset = t * spread * 2 + (rand() - 0.5) * 8;
      grow(x2, y2, angle + offset, len * (0.73 + rand() * 0.08), width * 0.68, depth + 1);
    }
  }

  /** The same growth, mirrored downward and flattened, so roots spread. */
  function growRoot(
    x: number,
    y: number,
    angle: number,
    len: number,
    width: number,
    depth: number,
    branch: number
  ) {
    const rad = (angle * Math.PI) / 180;
    const x2 = x + Math.cos(rad) * len;
    const y2 = y + Math.sin(rad) * len;

    const bend = (rand() - 0.5) * len * 0.3;
    const mx = (x + x2) / 2 + Math.cos(rad + Math.PI / 2) * bend;
    const my = (y + y2) / 2 + Math.sin(rad + Math.PI / 2) * bend;

    track(x, y);
    track(x2, y2);
    track(mx, my);

    segments.push({
      d: `M ${x.toFixed(1)} ${y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      width,
      depth,
      root: true,
    });

    if (depth >= ROOT_DEPTH) {
      rootTips.push({ x: x2, y: y2, branch, dist: Math.hypot(x2 - BASE_X, y2 - GROUND_Y) });
      if (rand() > 0.55) {
        nodes.push({ x: x2, y: y2, r: 2.6, depth, tone: Math.floor(rand() * 3), ring: false });
      }
      return;
    }

    // Roots splay outward rather than upward, so each fork widens the angle.
    const children = rand() > 0.55 ? 3 : 2;
    const spread = 20 + rand() * 14;
    for (let i = 0; i < children; i++) {
      const t = i / (children - 1) - 0.5;
      growRoot(
        x2,
        y2,
        angle + t * spread * 2 + (rand() - 0.5) * 10,
        len * (0.7 + rand() * 0.1),
        width * 0.66,
        depth + 1,
        branch
      );
    }
  }

  grow(BASE_X, GROUND_Y, -90, 268, 4.4, 0);

  // Four main roots leaving the same point the trunk rises from.
  const ROOT_ANGLES = [148, 112, 68, 32];
  ROOT_ANGLES.forEach((a, i) => growRoot(BASE_X, GROUND_Y, a, 132, 3.5, 0, i));

  // ── Placing the labels ────────────────────────────────────────────────
  // The order is the point of the diagram, so the eight lower stations are
  // taken one per height band, favouring thick limbs well clear of the trunk
  // where a card has room. The novel takes the highest point in the drawing.
  //
  // Bands span the junctions, not the drawing: the trunk below the first fork
  // has nothing to label, and measuring from the ground line there wastes a
  // third of the range on bare wood and crowds every station into the canopy.
  const crown = junctions.reduce((a, b) => (b.y < a.y ? b : a));
  const usable = junctions.filter((j) => j.depth >= 1 && j.depth <= 4);
  const yLow = usable.reduce((a, b) => (b.y > a.y ? b : a)).y;
  const span = yLow - crown.y;
  const lower = STATIONS.slice(0, -1);

  const picked: Junction[] = [];
  const taken = new Set<Junction>();

  lower.forEach((_, k) => {
    const targetY = yLow - (span * 0.9 * k) / (lower.length - 1);
    const side = k % 2 === 0 ? -1 : 1;

    const eligible = usable.filter(
      (j) => !taken.has(j) && !picked.some((p) => Math.hypot(p.x - j.x, p.y - j.y) < 120)
    );
    if (!eligible.length) return;

    // Inside the band, prefer the requested side, a limb well out from the
    // trunk, and a thicker branch: all three make the label easier to read.
    // Outside it, fall back to whatever sits nearest the target height, so a
    // sparse band never costs a station.
    const inBand = eligible.filter((j) => Math.abs(j.y - targetY) <= span * 0.075);
    const pool = inBand.length ? inBand : eligible;

    let best = pool[0];
    let bestScore = -Infinity;
    for (const j of pool) {
      const score =
        (Math.sign(j.x - BASE_X) === side ? 300 : 0) +
        Math.abs(j.x - BASE_X) -
        j.depth * 34 -
        Math.abs(j.y - targetY) * (inBand.length ? 0 : 2.5);
      if (score > bestScore) {
        bestScore = score;
        best = j;
      }
    }
    taken.add(best);
    picked.push(best);
  });

  // Bottom of the trunk upward, so the labels land in the order given.
  picked.sort((a, b) => b.y - a.y);

  const stations = picked.map((j, i) => ({ ...STATIONS[i], x: j.x, y: j.y, index: i }));
  stations.push({
    ...STATIONS[STATIONS.length - 1],
    x: crown.x,
    y: crown.y,
    index: stations.length,
  });

  // One label per root, at whichever of its tips reaches furthest from the base.
  const roots = ROOTS.map((rt, i) => {
    const tips = rootTips.filter((t) => t.branch === i);
    const tip = tips.length
      ? tips.reduce((a, b) => (b.dist > a.dist ? b : a))
      : { x: BASE_X, y: GROUND_Y + 120 };
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

export function BranchDiagram({ className = "", label }: { className?: string; label: string }) {
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
        aria-label={label}
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
