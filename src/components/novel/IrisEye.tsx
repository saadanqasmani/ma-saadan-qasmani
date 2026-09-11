"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The entrance to the IRIS page: an eye opens, settles, then the view travels
 * through the pupil into the page.
 *
 * Built from the parts a real iris has rather than a ring of spokes — a limbal
 * ring, stromal fibres in two layers, a collarette, crypts, a highlight — so
 * it holds up as it fills the screen. The pupil carries the page's own ground,
 * so travelling into it opens the page instead of blacking the screen out.
 *
 * Colours are the explainer film's, not the site's, because this is the door
 * into that film's subject.
 */

const DURATION = 3400;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInCubic = (t: number) => t * t * t;
const easeOutBack = (t: number) => {
  const c = 1.35;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};

const CX = 500;
const CY = 300;
const IRIS_R = 118;

const BLUE = "#1d4ed8";
const BLUE_BRIGHT = "#3b82f6";
const NAVY = "#15203c";
const PALE = "#c8d4ea";

/** A lid aperture: two arcs meeting at the corners, given a half-height. */
function lidPath(h: number) {
  const w = 330;
  const lower = h * 0.78;
  return `M ${CX - w} ${CY} C ${CX - w * 0.5} ${CY - h * 1.25} ${CX + w * 0.5} ${CY - h * 1.25} ${CX + w} ${CY} C ${CX + w * 0.5} ${CY + lower * 1.25} ${CX - w * 0.5} ${CY + lower * 1.25} ${CX - w} ${CY} Z`;
}

/**
 * Stroma fibres. Deterministic so server and client agree, and curved rather
 * than radial: straight spokes read as a bicycle wheel at any size.
 */
function makeFibres(count: number, seed: number, rIn: number, rOut: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const n = Math.sin(i * 12.9898 + seed) * 43758.5453;
    const jitter = n - Math.floor(n);
    const sweep = (jitter - 0.5) * 0.34;
    const inner = rIn * (0.92 + jitter * 0.16);
    const outer = rOut * (0.86 + jitter * 0.2);
    const mid = (inner + outer) / 2;
    return {
      x1: CX + Math.cos(a) * inner,
      y1: CY + Math.sin(a) * inner,
      cx: CX + Math.cos(a + sweep) * mid,
      cy: CY + Math.sin(a + sweep) * mid,
      x2: CX + Math.cos(a + sweep * 1.7) * outer,
      y2: CY + Math.sin(a + sweep * 1.7) * outer,
      w: 0.7 + jitter * 1.5,
      o: 0.25 + jitter * 0.5,
    };
  });
}

const OUTER_FIBRES = makeFibres(96, 1.7, 52, IRIS_R);
const INNER_FIBRES = makeFibres(52, 9.1, 30, 58);

/** Crypts: the darker pits around the collarette. */
const CRYPTS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 + 0.3;
  const n = Math.sin(i * 7.13) * 1000;
  const j = n - Math.floor(n);
  return {
    x: CX + Math.cos(a) * (60 + j * 12),
    y: CY + Math.sin(a) * (60 + j * 12),
    rx: 5 + j * 5,
    ry: 2.5 + j * 3,
    rot: (a * 180) / Math.PI,
  };
});

export function IrisEye() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);
  const started = useRef(0);

  const playing = !reduced && !done;

  const finish = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setDone(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    started.current = performance.now();
    const tick = (now: number) => {
      const k = (now - started.current) / DURATION;
      if (k >= 1) {
        finish();
        return;
      }
      setT(k);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // Keyed on `playing` alone: re-running each frame would restart the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Four movements rather than three, so nothing snaps: the lids part with a
  // slight overshoot, the stroma draws, the pupil constricts as if to light,
  // then the view falls in.
  const open = easeOutBack(clamp01(t / 0.26));
  const draw = easeOutCubic(clamp01((t - 0.18) / 0.3));
  const constrict = easeOutCubic(clamp01((t - 0.4) / 0.22));
  const travel = easeInCubic(clamp01((t - 0.6) / 0.4));

  const lidH = 6 + open * 214;
  const pupilR = 46 - constrict * 18 + travel * 4;
  const scale = 1 + travel * 62;
  const fade = 1 - clamp01((t - 0.9) / 0.1);
  // A breath of drift, so the eye is never perfectly still.
  // Detail that reads at rest becomes a barcode magnified sixty times.
  // Falls away early rather than linearly: the fibres are already six
  // times their drawn size a third of the way into the travel.
  const detail = 1 - clamp01(travel ** 0.55 * 1.25);
  const driftX = Math.sin(t * 7.5) * 3 * (1 - travel);
  const driftY = Math.cos(t * 5.5) * 2 * (1 - travel);

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          key="iris-eye"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          className="fixed inset-0 z-[200] cursor-pointer"
          aria-hidden
          style={{ opacity: fade, background: "#f4f7fc" }}
        >
          <svg
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
          >
            <defs>
              <clipPath id="iris-aperture">
                <path d={lidPath(lidH)} />
              </clipPath>
              <radialGradient id="iris-body" cx="0.42" cy="0.38" r="0.72">
                <stop offset="0%" stopColor={BLUE_BRIGHT} stopOpacity="0.55" />
                <stop offset="58%" stopColor={BLUE} stopOpacity="0.5" />
                <stop offset="100%" stopColor={NAVY} stopOpacity="0.72" />
              </radialGradient>
              <radialGradient id="iris-shadow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="72%" stopColor={NAVY} stopOpacity="0" />
                <stop offset="100%" stopColor={NAVY} stopOpacity="0.42" />
              </radialGradient>
            </defs>

            <g
              style={{
                transform: `translate(${driftX}px, ${driftY}px) scale(${scale})`,
                transformOrigin: `${CX}px ${CY}px`,
              }}
            >
              <g clipPath="url(#iris-aperture)">
                <rect x={-200} y={-200} width={1400} height={1000} fill="#ffffff" />

                {/* Sclera shading, so the white is not flat */}
                <ellipse cx={CX} cy={CY} rx={340} ry={200} fill="url(#iris-shadow)" opacity={0.5 * draw} />

                {/* Iris body */}
                <circle cx={CX} cy={CY} r={IRIS_R} fill="url(#iris-body)" opacity={draw} />

                {/* Stroma, outer then inner */}
                <g opacity={0.9 * draw * detail}>
                  {OUTER_FIBRES.map((f, i) => (
                    <path
                      key={`o-${i}`}
                      d={`M ${f.x1.toFixed(1)} ${f.y1.toFixed(1)} Q ${f.cx.toFixed(1)} ${f.cy.toFixed(1)} ${f.x2.toFixed(1)} ${f.y2.toFixed(1)}`}
                      stroke={BLUE}
                      strokeWidth={f.w}
                      strokeLinecap="round"
                      fill="none"
                      opacity={f.o}
                    />
                  ))}
                </g>
                <g opacity={0.85 * draw * detail}>
                  {INNER_FIBRES.map((f, i) => (
                    <path
                      key={`i-${i}`}
                      d={`M ${f.x1.toFixed(1)} ${f.y1.toFixed(1)} Q ${f.cx.toFixed(1)} ${f.cy.toFixed(1)} ${f.x2.toFixed(1)} ${f.y2.toFixed(1)}`}
                      stroke={NAVY}
                      strokeWidth={f.w * 0.8}
                      strokeLinecap="round"
                      fill="none"
                      opacity={f.o * 0.7}
                    />
                  ))}
                </g>

                {/* Crypts around the collarette */}
                <g opacity={0.5 * draw * detail} fill={NAVY}>
                  {CRYPTS.map((c, i) => (
                    <ellipse
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      rx={c.rx}
                      ry={c.ry}
                      transform={`rotate(${c.rot} ${c.x} ${c.y})`}
                      opacity={0.55}
                    />
                  ))}
                </g>

                {/* Collarette, the ruff where the pupil's muscle meets the stroma */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={60}
                  fill="none"
                  stroke="#e8a15a"
                  strokeWidth={3}
                  opacity={0.55 * draw * detail}
                  strokeDasharray="7 5"
                />

                {/* Limbal ring */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={IRIS_R}
                  fill="none"
                  stroke={NAVY}
                  strokeWidth={7 * (0.35 + detail * 0.65)}
                  opacity={0.5 * draw}
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={IRIS_R - 5}
                  fill="none"
                  stroke={BLUE_BRIGHT}
                  strokeWidth={1.6}
                  opacity={0.6 * draw * detail}
                />

                {/* The pupil carries the page's ground, so falling into it
                    opens the page rather than blacking the screen out. */}
                <circle cx={CX} cy={CY} r={pupilR} fill="#f4f7fc" />
                <circle
                  cx={CX}
                  cy={CY}
                  r={pupilR}
                  fill="none"
                  stroke={NAVY}
                  strokeWidth={2.5 * (0.3 + detail * 0.7)}
                  opacity={0.7 * draw}
                />

                {/* Catchlight, fading as the view goes in */}
                <ellipse
                  cx={CX - 44}
                  cy={CY - 46}
                  rx={26}
                  ry={18}
                  fill="#ffffff"
                  opacity={0.85 * draw * detail}
                  transform={`rotate(-24 ${CX - 44} ${CY - 46})`}
                />
                <circle
                  cx={CX + 34}
                  cy={CY + 40}
                  r={7}
                  fill="#ffffff"
                  opacity={0.4 * draw * detail}
                />
              </g>

              {/* Lid line and lashes */}
              <path d={lidPath(lidH)} fill="none" stroke={NAVY} strokeWidth={3.4} opacity={0.85} />
              <g stroke={NAVY} strokeLinecap="round" fill="none" opacity={0.5 * open * detail}>
                {[-0.86, -0.68, -0.46, -0.2, 0.08, 0.36, 0.62, 0.84].map((u, i) => {
                  const x = CX + u * 322;
                  const y = CY - Math.cos(u * 1.45) * lidH * 0.84;
                  // Longer towards the outer corner, and curved away from it,
                  // which is how lashes actually sit.
                  const len = 13 + (0.5 + u * 0.5) * 17;
                  const sweep = 7 + u * 12;
                  return (
                    <path
                      key={i}
                      d={`M ${x} ${y} Q ${x + sweep * 0.35} ${y - len * 0.62} ${x + sweep} ${y - len}`}
                      strokeWidth={2.6 - Math.abs(u) * 0.9}
                    />
                  );
                })}
              </g>
            </g>
          </svg>

          <p
            className="t-label pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{ color: PALE, opacity: 1 - travel }}
          >
            IRIS
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
