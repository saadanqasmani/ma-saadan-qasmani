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
 * Both figures are a single still render, cut into three layers along the
 * garment's own armhole seam. The arm is two bones hung off the body, so a
 * gesture is a pair of rotations rather than a frame sequence, which keeps
 * the whole act under 400KB and lets it run on the compositor.
 *
 * Osman gives the thumbs up, smiles, winks and dissolves. Saadan lights one,
 * draws on it, blows the smoke straight through the fourth wall and is gone
 * before it clears.
 */

/** Long enough for the whole act, short enough that nobody waits for it. */
const RUN = 3400;

function layersOf(who: Persona): string[] {
  return [
    `/ops/${who}-body.png`,
    `/ops/${who}-upper.png`,
    `/ops/${who}-fore.png`,
    `/ops/${who}-${who === "osman" ? "fore-thumb" : "fore-cig"}.png`,
    ...(who === "osman" ? ["/ops/osman-wink.png"] : []),
  ];
}

/**
 * Fetch the other one's layers while the desk is idle.
 *
 * The act opens on a blur, which hides a little loading, but not a cold
 * fetch of a third of a megabyte. Only the persona you are not is worth
 * pulling: the one you are has nothing to enter for.
 */
export function usePreloadEntrance(other: Persona | null) {
  useEffect(() => {
    if (!other) return;
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1200));
    const id = idle(() => {
      for (const src of layersOf(other)) {
        const img = new Image();
        img.src = src;
      }
    });
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, [other]);
}

export function Entrance({ who, onDone }: { who: Persona | null; onDone: () => void }) {
  useEffect(() => {
    if (!who) return;
    const t = window.setTimeout(onDone, RUN);
    return () => window.clearTimeout(t);
  }, [who, onDone]);

  if (!who) return null;

  return (
    <div className="ent" data-who={who} onClick={onDone} aria-hidden>
      <div className="ent__scrim" />
      <div className="ent__stage">
        <div className="ent__fig">
          {/* eslint-disable @next/next/no-img-element */}
          <img className="ent__body" src={`/ops/${who}-body.png`} alt="" draggable={false} />
          {who === "osman" && <img className="ent__wink" src="/ops/osman-wink.png" alt="" draggable={false} />}
          <div className="ent__arm">
            <img src={`/ops/${who}-upper.png`} alt="" draggable={false} />
            <div className="ent__fa">
              <img className="ent__fore" src={`/ops/${who}-fore.png`} alt="" draggable={false} />
              <img
                className="ent__fore ent__fore--act"
                src={`/ops/${who}-${who === "osman" ? "fore-thumb" : "fore-cig"}.png`}
                alt=""
                draggable={false}
              />
              {who === "saadan" && (
                <>
                  <span className="ent__flame" />
                  <span className="ent__ember" />
                  <span className="ent__wisp" />
                </>
              )}
            </div>
          </div>
          {/* eslint-enable @next/next/no-img-element */}
        </div>

        {who === "saadan" && (
          <>
            <span className="ent__puff" style={{ animationDelay: "1720ms" }} />
            <span className="ent__puff" style={{ animationDelay: "1840ms", opacity: 0.7 }} />
            <span className="ent__puff" style={{ animationDelay: "1980ms", opacity: 0.55 }} />
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
