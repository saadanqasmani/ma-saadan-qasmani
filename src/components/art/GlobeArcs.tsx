"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Orthographic hemisphere with arcs springing from Istanbul.
 * Only the three UNESCO Peace and Diplomacy Programme cities are labelled —
 * every other point is deliberately unlabelled, standing for reach without
 * claiming a specific city.
 */

// Centred and zoomed on the three programme cities so the routes read large.
// The globe deliberately overflows the frame — a cropped earth, not a marble.
const R = 520;
const CX = 400;
const CY = 400;
const LON0 = (52 * Math.PI) / 180;
const LAT0 = (33 * Math.PI) / 180;

function project(lonDeg: number, latDeg: number) {
  const lon = (lonDeg * Math.PI) / 180;
  const lat = (latDeg * Math.PI) / 180;
  const cosC = Math.sin(LAT0) * Math.sin(lat) + Math.cos(LAT0) * Math.cos(lat) * Math.cos(lon - LON0);
  const x = CX + R * Math.cos(lat) * Math.sin(lon - LON0);
  const y = CY - R * (Math.cos(LAT0) * Math.sin(lat) - Math.sin(LAT0) * Math.cos(lat) * Math.cos(lon - LON0));
  return { x, y, visible: cosC > 0 };
}

// Istanbul is the base the work runs from; Türkiye is also one of the four
// countries the training was delivered in, so the home point carries both.
const HOME = { name: "Türkiye", lon: 28.98, lat: 41.01 };

// Countries, plotted at their capitals. The label names the country, because
// that is the claim being made: training was delivered there.
const DESTINATIONS = [
  { name: "Pakistan", lon: 73.06, lat: 33.69, note: "Training delivered" },
  { name: "Nepal", lon: 85.32, lat: 27.7, note: "UNESCO Peace and Diplomacy Programme" },
  { name: "Iraq", lon: 44.36, lat: 33.31, note: "UNESCO Peace and Diplomacy Programme" },
];

// Unlabelled reach — decorative, no claim about specific cities.
const REACH = [
  [12, 48], [2, 52], [-3, 40], [10, 30], [24, -5], [37, -1],
  [55, 25], [67, 24], [77, 13], [100, 14], [4, 62], [-9, 52],
  [31, 30], [35, 50], [49, 41], [72, 40],
];

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  // push the control point away from the globe centre for a lifted arc
  const nx = mx - CX;
  const ny = my - CY;
  const nlen = Math.hypot(nx, ny) || 1;
  const lift = dist * 0.26;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx + (nx / nlen) * lift).toFixed(1)} ${(my + (ny / nlen) * lift).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function GlobeArcs() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const home = project(HOME.lon, HOME.lat);
  const dests = DESTINATIONS.map((d) => ({ ...d, ...project(d.lon, d.lat) }));
  const reach = REACH.map(([lon, lat]) => project(lon, lat)).filter((p) => p.visible);

  const activeNote = dests.find((d) => d.name === active)?.note;

  return (
    <div className="relative">
      <svg viewBox="150 175 620 400" fill="none" className="h-auto w-full" role="img"
        aria-label="A hemisphere with routes from Türkiye to Pakistan, Nepal and Iraq">
        {/* Globe body */}
        <circle cx={CX} cy={CY} r={R} fill="var(--canvas-light)" opacity={0.7} />
        <circle cx={CX} cy={CY} r={R} stroke="var(--line-strong)" strokeWidth={1.2} />

        {/* Latitude lines */}
        {[-50, -25, 0, 25, 50, 70].map((lat) => {
          const p = project(0 + 46, lat);
          const ry = Math.abs(R * Math.cos((lat * Math.PI) / 180) * Math.sin(LAT0)) + 0.001;
          return (
            <ellipse
              key={lat}
              cx={CX}
              cy={p.y}
              rx={R * Math.cos((lat * Math.PI) / 180)}
              ry={ry}
              stroke="var(--line)"
              strokeWidth={1}
              strokeDasharray="2 6"
            />
          );
        })}
        {/* Meridians */}
        {[0, 30, 60, 90].map((deg) => (
          <ellipse
            key={deg}
            cx={CX}
            cy={CY}
            rx={R * Math.abs(Math.cos((deg * Math.PI) / 180))}
            ry={R}
            stroke="var(--line)"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        ))}

        {/* Unlabelled reach */}
        {reach.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.6}
            fill="var(--ink-faint)"
            initial={reduced ? undefined : { opacity: 0 }}
            whileInView={reduced ? undefined : { opacity: 0.55 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.04 }}
          />
        ))}

        {/* Arcs */}
        {dests.map((d, i) => (
          <motion.path
            key={d.name}
            d={arcPath(home, d)}
            stroke={active === d.name ? "var(--ember)" : "var(--azure)"}
            strokeWidth={active === d.name ? 3.6 : 2.2}
            strokeLinecap="round"
            initial={reduced ? undefined : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Home */}
        <g>
          <circle cx={home.x} cy={home.y} r={16} fill="var(--ember)" opacity={0.14} />
          <circle cx={home.x} cy={home.y} r={7} fill="var(--ember)" />
          <text
            x={home.x}
            y={home.y - 26}
            textAnchor="middle"
            className="fill-ink font-sans"
            fontSize={25}
            fontWeight={600}
          >
            Istanbul
          </text>
        </g>

        {/* Destinations — interactive */}
        {dests.map((d) => (
          <g
            key={d.name}
            onMouseEnter={() => setActive(d.name)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(d.name)}
            onBlur={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label={`${d.name} — ${d.note}`}
            className="cursor-pointer outline-none"
          >
            <circle cx={d.x} cy={d.y} r={22} fill="transparent" />
            <circle
              cx={d.x}
              cy={d.y}
              r={active === d.name ? 9 : 6}
              fill={active === d.name ? "var(--ember)" : "var(--azure)"}
              className="transition-all duration-300"
            />
            <text
              x={d.x}
              y={d.y + 34}
              textAnchor="middle"
              className="fill-ink font-sans"
              fontSize={23}
              fontWeight={500}
            >
              {d.name}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 min-h-6 text-center text-sm text-ember">
        {activeNote ?? ""}
      </div>
    </div>
  );
}
