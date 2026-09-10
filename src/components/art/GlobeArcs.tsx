"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import world from "@/content/worldOutline.json";

/**
 * Orthographic hemisphere with routes springing from Istanbul.
 *
 * The coastlines are real: Natural Earth's 110m country outlines, clipped to
 * the visible hemisphere and simplified, then projected through the same
 * function as the routes. Drawing a map from memory would have put an
 * inaccurate world on a professional site.
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
  { name: "Germany", label: "Germany", lon: 13.4, lat: 52.52, dx: 0, dy: 34, note: "Training delivered" },
  // Qatar and the UAE are 3 degrees apart: one goes above its point, the
  // other below and to the side, or the two labels sit on top of each other.
  { name: "Qatar", label: "Qatar", lon: 51.53, lat: 25.28, dx: -34, dy: -18, note: "Training delivered" },
  { name: "United Arab Emirates", label: "UAE", lon: 54.37, lat: 24.45, dx: 32, dy: 36, note: "Training delivered" },
  { name: "Pakistan", label: "Pakistan", lon: 73.06, lat: 33.69, dx: 0, dy: 36, note: "Training delivered" },
  { name: "Nepal", label: "Nepal", lon: 85.32, lat: 27.7, dx: 6, dy: 36, note: "UNESCO Peace and Diplomacy Programme" },
  { name: "Iraq", label: "Iraq", lon: 44.36, lat: 33.31, dx: -18, dy: 36, note: "UNESCO Peace and Diplomacy Programme" },
];

/** The countries the routes name, so the map can pick them out of the land. */
const NAMED = new Set(["Türkiye", ...["Germany", "Qatar", "United Arab Emirates", "Pakistan", "Nepal", "Iraq"]]);

// The JSON widens tuples to number[]; the projector only ever reads [0] and
// [1], so a narrower local type is the honest description.
type Ring = number[][];

/**
 * A ring becomes a path only where it is on the near side of the globe. An
 * orthographic projection folds the far side back over the near one, so a
 * ring that crosses the limb has to be broken rather than closed.
 */
function ringPath(ring: Ring): string {
  let d = "";
  let drawing = false;
  for (const [lon, lat] of ring) {
    const p = project(lon, lat);
    if (!p.visible) {
      drawing = false;
      continue;
    }
    d += `${drawing ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    drawing = true;
  }
  return d;
}

const LAND_PATHS = (world.land as Ring[]).map(ringPath).filter((d) => d.length > 40);
const NAMED_PATHS = Object.entries(world.highlight as Record<string, Ring[]>)
  .filter(([name]) => NAMED.has(name))
  .map(([name, rings]) => ({
    name,
    d: rings.map(ringPath).join(" ").trim(),
  }))
  .filter((c) => c.d.length > 20);

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

export function GlobeArcs({ label, home: homeLabel }: { label: string; home: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const home = project(HOME.lon, HOME.lat);
  const dests = DESTINATIONS.map((d) => ({ ...d, ...project(d.lon, d.lat) }));

  const activeNote = dests.find((d) => d.name === active)?.note;

  return (
    <div className="relative">
      <svg viewBox="126 148 660 440" fill="none" className="h-auto w-full" role="img"
        aria-label={label}>
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

        {/* Coastlines. Drawn under everything, at a weight that reads as
            ground rather than as content. */}
        <g stroke="var(--ink)" strokeWidth={0.9} strokeLinejoin="round" opacity={0.28}>
          {LAND_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* The countries the routes actually name, filled so they read out of
            the land without needing a label of their own. */}
        <g>
          {NAMED_PATHS.map((c) => (
            <motion.path
              key={c.name}
              d={c.d}
              fill={c.name === "Türkiye" ? "var(--ember)" : "var(--azure)"}
              stroke={c.name === "Türkiye" ? "var(--ember)" : "var(--azure)"}
              strokeWidth={0.8}
              strokeLinejoin="round"
              initial={reduced ? undefined : { opacity: 0 }}
              whileInView={reduced ? undefined : { opacity: active === c.name ? 0.42 : 0.2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          ))}
        </g>

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
            {homeLabel}
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
              x={d.x + d.dx}
              y={d.y + d.dy}
              textAnchor="middle"
              className="fill-ink font-sans"
              fontSize={23}
              fontWeight={500}
            >
              {d.label}
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
