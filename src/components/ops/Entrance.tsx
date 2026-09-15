"use client";

import { useEffect } from "react";
import type { Persona } from "@/lib/ops/model";

/**
 * The turn each of them does on the way in.
 *
 * Switching persona used to be a radio button. It is the one moment in the
 * day when the desk changes hands, so it gets a curtain: the man walks out
 * of thin air, does his one thing, and goes.
 *
 * Each act is a short sequence of full renders, played pose to pose. An
 * earlier version rigged one still into moving limbs and it looked like
 * what it was, so the poses are now drawn rather than derived: every frame
 * is the same man photographed from the same place, cut off the wall and
 * cropped to one shared box, which is what lets them stack and dissolve
 * without anything sliding.
 *
 * Osman brings up a thumbs up, smiles, winks and goes. Saadan takes one
 * out, lights it, draws on it and blows the smoke through the fourth wall.
 * The smoke is the render's own; only the last bloom towards the viewer is
 * the page's.
 */

const ACTS: Record<Persona, { frames: number; run: number }> = {
  // five poses need the extra half second; three do not
  saadan: { frames: 5, run: 3800 },
  osman: { frames: 3, run: 3400 },
};

export function Entrance({ who, onDone }: { who: Persona | null; onDone: () => void }) {
  useEffect(() => {
    if (!who) return;
    const t = window.setTimeout(onDone, ACTS[who].run);
    return () => window.clearTimeout(t);
  }, [who, onDone]);

  if (!who) return null;
  const act = ACTS[who];

  return (
    <div
      className="ent"
      data-who={who}
      style={{ "--run": `${act.run}ms` } as React.CSSProperties}
      onClick={onDone}
      aria-hidden
    >
      <div className="ent__scrim" />
      <div className="ent__stage">
        <div className="ent__fig">
          {Array.from({ length: act.frames }, (_, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              className="ent__f"
              data-n={i + 1}
              src={`/ops/${who}-${i + 1}.webp`}
              alt=""
              draggable={false}
            />
          ))}
        </div>

        {who === "saadan" && (
          <>
            <span className="ent__puff" />
            <span className="ent__puff ent__puff--late" />
          </>
        )}

        <div className="ent__sparks">
          {SPARKS.map((s, i) => (
            <i key={i} style={{ "--a": `${s.a}deg`, "--d": `${s.d}ms`, "--r": `${s.r}px` } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The glitter he arrives in and leaves by. Fixed rather than random so the
 * two runs look like the same trick performed twice, not a particle system.
 */
const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  a: Math.round((i * 360) / 18 + (i % 3) * 7),
  d: (i % 6) * 55,
  r: 110 + (i % 4) * 46,
}));

function framesOf(who: Persona): string[] {
  return Array.from({ length: ACTS[who].frames }, (_, i) => `/ops/${who}-${i + 1}.webp`);
}

/**
 * Fetch the other one's frames while the desk is idle.
 *
 * The act opens on a blur, which hides a little loading, but not a cold
 * fetch of five renders. Only the persona you are not is worth pulling: the
 * one you are has nothing to enter for.
 */
export function usePreloadEntrance(other: Persona | null) {
  useEffect(() => {
    if (!other) return;
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1200));
    const id = idle(() => {
      for (const src of framesOf(other)) {
        const img = new Image();
        img.src = src;
      }
    });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, [other]);
}
