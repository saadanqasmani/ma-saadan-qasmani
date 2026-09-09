import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { PaperDefs, Rect } from "../paper/Paper";
import { PAPER } from "../paper/palette";
import { Sultan } from "../paper/Sultan";
import { Ransom } from "../paper/Ransom";
import { ForestBands } from "./Forest";
import { TowerBands } from "./Tower";
import {
  DURATION,
  FOREST_BANDS,
  FPS,
  GROUND,
  ROOF,
  TOWER,
  W,
  WORLD_H,
  bandTop,
  boil,
  camera,
  held,
} from "./world";

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
  const live = useCurrentFrame();
  // Everything below, the camera included, runs on twos.
  const frame = held(live);
  const cam = camera(frame);
  // How far the back sheets fall behind the front ones.
  const lag = (cam.y - GROUND) * 0.085;

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

        {/*
          Multiplane.
          Reiniger's rig held the background sheets further from the lens than
          the puppets, so they crossed the frame more slowly. Here the far
          layers are pushed back by moving them with a fraction of the camera,
          which is the same effect and the reason a flat film gets depth.
        */}

        {/* The gap: the one place the roof failed, and the only light in the
            film that falls rather than glows. */}
        <path
          d={`M ${TOWER.x + 260} ${GROUND - 2400} L ${TOWER.x + 700} ${GROUND - 2400}
              L ${TOWER.x + 900} ${GROUND} L ${TOWER.x + 60} ${GROUND} Z`}
          fill={PAPER.sun}
          opacity={0.28}
        />

        {/* The lag is the distance: a background sheet crosses the frame more
            slowly than the puppets in front of it. Each scene applies it to
            its own far layers, which is cheaper and more truthful than
            drawing the whole set twice. */}
        <TowerBands frame={frame} hasOttoPhoto={HAS_OTTO_PHOTO} lag={lag} />
        <ForestBands frame={frame} lag={lag} />
        <Labels camY={cam.y} vh={vh} frameForBoil={frame} />

        {/* Him, on the outside of all of it. */}
        {climbing && (
          <Boil seed={3} frame={frame}>
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
          </Boil>
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

/** Wraps a group in the shift a piece of paper makes between exposures. */
const Boil: React.FC<{ seed: number; frame: number; children: React.ReactNode }> = ({
  seed,
  frame,
  children,
}) => {
  const b = boil(seed, frame);
  return <g transform={`translate(${b.dx} ${b.dy}) rotate(${b.rot})`}>{children}</g>;
};

/**
 * The only words in the film.
 *
 * An earlier pass captioned every floor, which turned the film into an
 * illustrated contents page. Saadan wants six words in the whole thing and
 * nothing else named: him, Otto, the two worlds, what happens between them,
 * and the title at the end. Everything else has to be carried by the picture,
 * which is the right way round.
 */
const LABELS: { band: number; text: string; size: number; side: -1 | 1 }[] = [
  // Named on the branch he leaves from, where he is the only one in frame.
  // Naming him during the prayer put his name over three identical figures
  // and read as a label for all of them.
  { band: 0, text: "Forest", size: 118, side: 1 },
  { band: 2, text: "Sultan", size: 124, side: -1 },
  { band: 3, text: "Concrete Jungle", size: 70, side: -1 },
  { band: 6, text: "Learning", size: 104, side: 1 },
  { band: 7, text: "Otto", size: 128, side: 1 },
];

const Labels: React.FC<{ camY: number; vh: number; frameForBoil: number }> = ({
  camY,
  vh,
  frameForBoil,
}) => (
  <>
    {LABELS.map((l) => {
      // The middle of the band, not its top edge. The camera crosses a band
      // from its bottom to its top, so a label pinned at the top is above the
      // frame for almost the whole crossing and clips through the ceiling on
      // its way out.
      const y = bandTop(l.band) + 480;
      // Only the labels near the camera are drawn at all, and each lays
      // itself down as the camera comes level with it.
      const d = (camY - y) / vh;
      if (d < -0.85 || d > 0.95) return null;
      const reveal = Math.max(0, Math.min(1, (d + 0.8) / 0.5));
      return (
        <Boil key={l.band} seed={l.band * 7 + 1} frame={frameForBoil}>
        <Ransom
          text={l.text}
          /*
           * Inside the frame, not beside the tower. The view is only about
           * 860 world units wide at climb zoom while the facade is 980, so a
           * label parked at the tower's edge was off-screen entirely; the one
           * that showed was clipped in half.
           */
          x={TOWER.x + TOWER.w / 2 + l.side * 190}
          y={y}
          size={l.size}
          seed={l.band * 31 + 3}
          reveal={reveal}
          rotate={l.side * -2.5}
          titleCase
        />
        </Boil>
      );
    })}
  </>
);

/**
 * The title, cut out and laid down a letter at a time.
 *
 * Its own svg over the scene, in screen coordinates, because the scene's
 * viewBox is out in the world and moving. Each letter is its own scrap of its
 * own paper in its own typeface, which is what a cut-out film does with a
 * word.
 */
const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const start = DURATION - 4.2 * FPS;
  const k = (frame - start) / (2.6 * FPS);
  if (k < 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <PaperDefs />
        <Ransom text="The Highest" x={960} y={300} size={150} seed={5} reveal={k} rotate={-1.4} titleCase />
        <Ransom text="Branch" x={960} y={480} size={168} seed={19} reveal={k - 0.22} rotate={1.1} titleCase />
      </svg>
    </AbsoluteFill>
  );
};
