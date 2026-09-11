"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ResearchItem } from "@/content/site";
import type { Dictionary } from "@/content/i18n/en";

/**
 * The archive as a constellation: a centre, a ring of research areas, and the
 * papers hanging off each area. Hovering a paper lights its path back to the
 * centre and dims the rest — the shape of the work, not a decoration.
 *
 * Layout is deterministic (pure trigonometry from the item order), so server
 * and client agree and the figure is stable between visits.
 */

const CX = 460;
const CY = 300;
const AREA_R = 132;
const PAPER_R = 236;

const TONES = ["var(--azure)", "var(--ember)", "var(--verdant)"];

type Placed = {
  item: ResearchItem;
  x: number;
  y: number;
  areaIndex: number;
};

export function ResearchConstellation({
  items,
  copy,
}: {
  items: ResearchItem[];
  copy: Dictionary["art"];
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [activeArea, setActiveArea] = useState<number | null>(null);
  /**
   * Pointer position within the figure, for the tooltip that follows the
   * cursor. Null when the pointer is not over the figure, which includes
   * keyboard focus: in that case the caption below is the readout, since
   * there is no cursor to sit beside.
   */
  const [cursor, setCursor] = useState<{ x: number; y: number; w: number } | null>(null);
  const figureRef = useRef<HTMLElement>(null);

  const { areas, papers } = useMemo(() => {
    const areaNames = Array.from(new Set(items.map((i) => i.area)));
    const areaNodes = areaNames.map((name, i) => {
      const a = (i / areaNames.length) * Math.PI * 2 - Math.PI / 2;
      return {
        name,
        index: i,
        angle: a,
        x: CX + Math.cos(a) * AREA_R,
        y: CY + Math.sin(a) * AREA_R * 0.82,
      };
    });

    const placed: Placed[] = [];
    areaNames.forEach((name, ai) => {
      const inArea = items.filter((i) => i.area === name);
      const base = areaNodes[ai].angle;
      inArea.forEach((item, pi) => {
        const spread = 0.17;
        const offset = (pi - (inArea.length - 1) / 2) * spread;
        const a = base + offset;
        placed.push({
          item,
          areaIndex: ai,
          x: CX + Math.cos(a) * PAPER_R,
          y: CY + Math.sin(a) * PAPER_R * 0.82,
        });
      });
    });

    return { areas: areaNodes, papers: placed };
  }, [items]);

  const activePaper = papers.find((p) => p.item.slug === active);
  const highlightArea = activePaper?.areaIndex ?? activeArea;
  const anyActive = active !== null || activeArea !== null;

  return (
    <figure
      ref={figureRef}
      className="relative"
      onMouseMove={(e) => {
        // Measured here rather than during render: the width is needed to
        // decide which side of the cursor the card sits on.
        const r = figureRef.current?.getBoundingClientRect();
        if (r) setCursor({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
      }}
      onMouseLeave={() => setCursor(null)}
    >
      <svg
        viewBox="196 76 528 448"
        fill="none"
        className="h-auto w-full"
        role="img"
        aria-label={copy.constellation}
      >
        {/* area spokes */}
        {areas.map((a) => {
          const lit = highlightArea === a.index;
          return (
            <motion.line
              key={`spoke-${a.index}`}
              x1={CX}
              y1={CY}
              x2={a.x}
              y2={a.y}
              stroke={lit ? TONES[a.index % 3] : "var(--line-strong)"}
              strokeWidth={lit ? 1.8 : 1}
              opacity={anyActive && !lit ? 0.25 : 1}
              initial={reduced ? undefined : { pathLength: 0 }}
              whileInView={reduced ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + a.index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {/* paper tethers */}
        {papers.map((p, i) => {
          const lit = active === p.item.slug || highlightArea === p.areaIndex;
          const a = areas[p.areaIndex];
          return (
            <motion.line
              key={`tether-${p.item.slug}`}
              x1={a.x}
              y1={a.y}
              x2={p.x}
              y2={p.y}
              stroke={lit ? TONES[p.areaIndex % 3] : "var(--line-strong)"}
              strokeWidth={lit ? 1.6 : 0.9}
              opacity={anyActive && !lit ? 0.2 : 0.9}
              initial={reduced ? undefined : { pathLength: 0 }}
              whileInView={reduced ? undefined : { pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {/* centre */}
        <motion.g
          initial={reduced ? undefined : { scale: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          <circle cx={CX} cy={CY} r={26} fill="var(--canvas)" stroke="var(--ink)" strokeWidth={1.4} />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            className="fill-ink font-sans"
          >
            {items.length}
          </text>
        </motion.g>

        {/* area nodes */}
        {areas.map((a) => {
          const lit = highlightArea === a.index;
          return (
            <motion.g
              key={a.name}
              onMouseEnter={() => setActiveArea(a.index)}
              onMouseLeave={() => setActiveArea(null)}
              onFocus={() => setActiveArea(a.index)}
              onBlur={() => setActiveArea(null)}
              tabIndex={0}
              role="button"
              aria-label={a.name}
              className="cursor-pointer outline-none"
              initial={reduced ? undefined : { scale: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 + a.index * 0.07 }}
              style={{ transformOrigin: `${a.x}px ${a.y}px` }}
            >
              <circle cx={a.x} cy={a.y} r={20} fill="transparent" />
              <circle
                cx={a.x}
                cy={a.y}
                r={lit ? 8 : 5.5}
                fill={TONES[a.index % 3]}
                opacity={anyActive && !lit ? 0.3 : 1}
                className="transition-all duration-300"
              />
            </motion.g>
          );
        })}

        {/* papers */}
        {papers.map((p, i) => {
          const lit = active === p.item.slug;
          const dim = anyActive && !lit && highlightArea !== p.areaIndex;
          return (
            <motion.g
              key={p.item.slug}
              onMouseEnter={() => setActive(p.item.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.item.slug)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              role="button"
              aria-label={`${p.item.title} — ${p.item.area}`}
              className="cursor-pointer outline-none"
              initial={reduced ? undefined : { scale: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            >
              <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
              {lit && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  stroke={TONES[p.areaIndex % 3]}
                  strokeWidth={1}
                  opacity={0.6}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={lit ? 7 : 4.5}
                fill={lit ? TONES[p.areaIndex % 3] : "var(--ink)"}
                opacity={dim ? 0.22 : 1}
                className="transition-all duration-300"
              />
            </motion.g>
          );
        })}
      </svg>

      {/* The readout follows the cursor: the caption below the figure sits
          past the fold at default zoom, so the label it switched to was
          invisible exactly when someone was reading it. */}
      {cursor && (activePaper || activeArea !== null) && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-20 max-w-xs border border-ink bg-canvas-light px-4 py-3 shadow-[0_10px_30px_-18px_rgba(21,20,15,0.6)]"
          style={{
            left: cursor.x,
            top: cursor.y,
            // Flip to the other side of the cursor near the edges so the card
            // is never clipped by the figure.
            transform: `translate(${
              cursor.x > cursor.w - 300 ? "calc(-100% - 16px)" : "16px"
            }, ${cursor.y < 90 ? "16px" : "calc(-100% - 16px)"})`,
          }}
        >
          {activePaper ? (
            <>
              <span className="block font-serif text-base leading-snug text-ink">
                {activePaper.item.title}
              </span>
              <span className="t-label mt-1 block text-ink-faint">
                {activePaper.item.area} · {activePaper.item.type}
              </span>
            </>
          ) : (
            <span className="block font-serif text-base text-ink">
              {areas[activeArea!].name}
            </span>
          )}
        </div>
      )}

      {/* Readout — one line, so the figure never turns into a label soup */}
      <figcaption className="mt-2 min-h-[3.25rem] border-t border-line pt-3">
        {activePaper ? (
          <>
            <span className="block font-serif text-lg leading-snug text-ink">
              {activePaper.item.title}
            </span>
            <span className="t-label mt-0.5 block text-ink-faint">
              {activePaper.item.area} · {activePaper.item.type}
            </span>
          </>
        ) : activeArea !== null ? (
          <span className="block font-serif text-lg text-ink">{areas[activeArea].name}</span>
        ) : (
          <span className="block text-sm text-ink-faint">
            {copy.constellationHint}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
