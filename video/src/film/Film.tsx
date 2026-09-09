import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { PaperDefs, Rect } from "../paper/Paper";
import { OttoClipDef } from "../paper/Otto";
import { PAPER } from "../paper/palette";
import { Sultan } from "../paper/Sultan";
import { ForestBands } from "./Forest";
import { TowerBands } from "./Tower";
import { DURATION, FOREST_BANDS, FPS, GROUND, ROOF, TOWER, W, WORLD_H, bandTop, camera } from "./world";

/**
 * The Highest Branch, in cut paper.
 *
 * One shot, bottom to top. Everything is a piece of paper laid on the piece
 * under it, and the camera rises past his whole life without stopping on any
 * of it, because that is how he lived it.
 *
 * Floor seven carries the one photograph in a film of drawings.
 */
const HAS_OTTO_PHOTO = true;

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camera(frame);

  // The visible window, in world units. Held tight for the climb, opened all
  // the way out at the end.
  const vh = 1080 * cam.zoom * 0.62;
  const vw = vh * (16 / 9);
  const vx = TOWER.x + TOWER.w / 2 - vw / 2;
  const vy = cam.y - vh * 0.5;

  // Hand over hand, four points of contact, the way he does it at ten years
  // old in the crown of his father's tree and again at the end.
  const reach = frame * 0.42;
  /*
   * He only exists on the facade once there is a facade.
   *
   * The first pass drew the climber wherever the camera was, so during the
   * prayer a suited adult was climbing the trunk beside his own family while
   * they hung from the branch above him. He belongs to the tower; the forest
   * bands have their own Sultan in them.
   */
  const onTower = cam.climbY < bandTop(FOREST_BANDS - 1) + 120;
  const climbing = cam.out < 0.6 && onTower;

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER.night3 }}>
      {/*
        An original score, synthesised in score/compose.py rather than
        licensed, so nothing in the film is anyone else's to clear. Four
        sections that follow the climb: the forest has no pulse in it at all,
        the pulse arrives with the tower and leaves with it.
      */}
      <Audio src={staticFile("score.wav")} volume={0.85} />

      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} width="100%" height="100%">
        <PaperDefs />
        <defs>
          <OttoClipDef w={420} />
          <linearGradient id="air" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PAPER.night2} />
            <stop offset="42%" stopColor={PAPER.blue} />
            <stop offset="78%" stopColor={PAPER.sky2} />
            <stop offset="100%" stopColor={PAPER.sky1} />
          </linearGradient>
        </defs>

        {/* The air. One sheet, running the whole height, so the light changes
            as he climbs rather than cutting between day and night. */}
        <rect x={-2000} y={-2000} width={W + 4000} height={WORLD_H + 4000} fill="url(#air)" />

        {/* The gap: the one place the roof failed, and the only light in the
            film that falls rather than glows. */}
        <path
          d={`M ${TOWER.x + 260} ${GROUND - 2400} L ${TOWER.x + 700} ${GROUND - 2400}
              L ${TOWER.x + 900} ${GROUND} L ${TOWER.x + 60} ${GROUND} Z`}
          fill={PAPER.sun}
          opacity={0.28}
        />

        <TowerBands frame={frame} hasOttoPhoto={HAS_OTTO_PHOTO} />
        <ForestBands frame={frame} />

        {/* Him, on the outside of all of it. */}
        {climbing && (
          <Sultan
            seed={9}
            pose={{
              x: TOWER.x + TOWER.w * 0.42,
              y: cam.climbY + 120,
              scale: 1.5,
              torso: 2,
              head: -14,
              armNear: [172 + Math.sin(reach) * 16, 10],
              armFar: [188 + Math.sin(reach + Math.PI) * 16, 8],
              legNear: [14 + Math.sin(reach + Math.PI) * 12, -10],
              legFar: [-16 + Math.sin(reach) * 12, 12],
              tail: [150, 40],
              dressed: cam.t > 0.34 ? 1 : 0,
              shaved: cam.t > 0.8 ? 1 : 0,
            }}
          />
        )}

        {/* The top. He arrives, and stops, and the camera keeps going. */}
        {cam.out > 0.02 && (
          <Sultan
            seed={9}
            pose={{
              x: TOWER.x + TOWER.w * 0.5,
              y: ROOF - 10,
              scale: 1.5,
              torso: 0,
              head: -8,
              armNear: [150, -20],
              armFar: [-150, 20],
              legNear: [10, -6],
              legFar: [-10, 6],
              tail: [150, 30],
              dressed: 1,
              shaved: 1,
            }}
          />
        )}
      </svg>

      {/* The sheet the whole film is on. A cut-out film is photographed, and
          what it is photographed through is another piece of paper: grain
          across everything, and the corners falling off a touch. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.34) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: 0.06,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>\")",
        }}
      />

      <Title frame={frame} />
    </AbsoluteFill>
  );
};

/**
 * The title, cut out and laid down a letter at a time.
 *
 * Cut letters do not fade in. They are placed, and each one lands slightly
 * off true, because a hand does not set type.
 */
const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const start = DURATION - 3.6 * FPS;
  const k = (frame - start) / (2.2 * FPS);
  if (k < 0) return null;

  const words = ["THE", "HIGHEST", "BRANCH"];
  const letters = words.join(" ").split("");

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div style={{ display: "flex", gap: 1, marginBottom: 340 }}>
        {letters.map((ch, i) => {
          const at = (i / letters.length) * 0.7;
          const p = Math.max(0, Math.min(1, (k - at) / 0.3));
          const tilt = ((i * 37) % 7) - 3;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: ch === " " ? 26 : undefined,
                fontSize: 92,
                letterSpacing: 2,
                color: PAPER.paperWhite,
                transform: `translateY(${(1 - p) * 70}px) rotate(${tilt * (1 - p * 0.6)}deg)`,
                opacity: p,
                filter: "drop-shadow(3px 6px 5px rgba(0,0,0,0.5))",
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
