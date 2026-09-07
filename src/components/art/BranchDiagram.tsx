"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform, useMotionValue } from "motion/react";

/**
 * The branching diagram — the site's central mark.
 * Reads at once as botany (the novel), a route map (international work),
 * and a network topology (partnerships). Generated deterministically from a
 * fixed seed so server and client render identically, then fitted to a
 * computed viewBox so no limb is ever clipped.
 *
 * Six junctions are promoted to interactive hotspots carrying real entries
 * from Saadan's record. Nothing here is invented.
 */

type Segment = { d: string; width: number; depth: number };
type Node = { x: number; y: number; r: number; depth: number; tone: number; ring: boolean };

const HOTSPOTS = [
  { label: "The Highest Branch", sub: "A novel — forthcoming" },
  { label: "STAR Scholars Network", sub: "Director, Global Engagement & Brand Strategy" },
  { label: "IRIS", sub: "Co-founder — internationalization platform" },
  { label: "UNESCO", sub: "Peace and Diplomacy Programmes" },
  { label: "Istanbul Aydın University", sub: "MA, Political Science & International Relations" },
  { label: "Presidential Medal", sub: "STAR Scholars, 2024" },
];

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

const MAX_DEPTH = 6;

function buildBranch(seed: number) {
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

  grow(500, 1000, -90, 268, 4.4, 0);

  const candidates = nodes
    .filter((n) => n.depth >= 2 && n.depth <= 4)
    .sort((a, b) => a.y - b.y);

  const picked: Node[] = [];
  for (const c of candidates) {
    if (picked.length >= HOTSPOTS.length) break;
    if (picked.every((p) => Math.hypot(p.x - c.x, p.y - c.y) > 175)) picked.push(c);
  }

  const pad = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.07;
  const vb = {
    x: bounds.minX - pad,
    y: bounds.minY - pad,
    w: bounds.maxX - bounds.minX + pad * 2,
    h: bounds.maxY - bounds.minY + pad * 2,
  };

  return { segments, nodes, hotspots: picked.map((n, i) => ({ ...n, ...HOTSPOTS[i] })), vb };
}

const TONES = ["var(--azure)", "var(--ember)", "var(--verdant)"];

export function BranchDiagram({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { segments, nodes, hotspots, vb } = useMemo(() => buildBranch(20260907), []);

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

  const hotspotIds = new Set(hotspots.map((h) => `${h.x},${h.y}`));

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
        aria-label="An illustrated branch whose junctions mark Saadan Qasmani's work"
      >
        {segments.map((seg, i) => (
          <motion.path
            key={i}
            d={seg.d}
            stroke="var(--ink)"
            strokeWidth={seg.width * s}
            strokeLinecap="round"
            opacity={0.92 - seg.depth * 0.05}
            initial={reduced ? undefined : { pathLength: 0 }}
            animate={reduced ? undefined : { pathLength: 1 }}
            transition={{
              duration: 1.15,
              delay: 0.15 + seg.depth * 0.24 + (i % 7) * 0.015,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

        {nodes
          .filter((n) => !hotspotIds.has(`${n.x},${n.y}`))
          .map((node, i) => (
            <motion.g
              key={`n-${i}`}
              initial={reduced ? undefined : { opacity: 0, scale: 0.2 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + node.depth * 0.24 }}
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

        {/* Interactive hotspots */}
        {hotspots.map((h, i) => {
          const isActive = active === i;
          const flip = h.x > (vb.x + vb.w / 2);
          // Approximate advance width per line (label 20px/600, sub 15px/400)
          const cardW = (Math.max(h.label.length * 11.2, h.sub.length * 7.6) + 40) * s;
          const cardH = 66 * s;
          const gap = 24 * s;
          const cardX = flip ? h.x - cardW - gap : h.x + gap;
          const cardY = Math.max(h.y - cardH / 2, vb.y + 6);

          return (
            <g key={`h-${i}`}>
              <motion.g
                initial={reduced ? undefined : { opacity: 0, scale: 0 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.12 }}
                style={{ transformOrigin: `${h.x}px ${h.y}px` }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="button"
                aria-label={`${h.label} — ${h.sub}`}
                className="cursor-pointer outline-none"
              >
                <circle cx={h.x} cy={h.y} r={44 * s} fill="transparent" />
                {!reduced && (
                  <motion.circle
                    cx={h.x}
                    cy={h.y}
                    r={12 * s}
                    stroke="var(--ember)"
                    strokeWidth={1.4 * s}
                    animate={{ r: [12 * s, 24 * s, 12 * s], opacity: [0.75, 0, 0.75] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={(isActive ? 11 : 8) * s}
                  fill="var(--ember)"
                  className="transition-all duration-300"
                />
                <circle cx={h.x} cy={h.y} r={3.2 * s} fill="var(--canvas)" />
              </motion.g>

              {isActive && (
                <motion.g
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ pointerEvents: "none" }}
                >
                  <line
                    x1={h.x}
                    y1={h.y}
                    x2={flip ? cardX + cardW : cardX}
                    y2={cardY + cardH / 2}
                    stroke="var(--ember)"
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
                    {h.label}
                  </text>
                  <text
                    x={cardX + 18 * s}
                    y={cardY + 49 * s}
                    fontSize={15 * s}
                    className="fill-ink-soft font-sans"
                  >
                    {h.sub}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}
