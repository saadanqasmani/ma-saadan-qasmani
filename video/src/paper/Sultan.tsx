import React from "react";
import { PAPER } from "./palette";
import { Piece } from "./Paper";
import { cutEllipse, cutPath } from "./cut";

/**
 * Sultan, as a cut-out puppet.
 *
 * A cut-out figure is not a rig with skin over it: it is a small number of
 * separate pieces of paper, each pinned at a joint and rotated about that
 * pin. So this is built the way it would be built on a table, and the joints
 * are allowed to show, because on a real cut-out puppet they do.
 *
 * Pieces are laid far side first, then the body, then the near side, then the
 * head, which is the order they would be stacked by hand.
 */

export type SultanPose = {
  /** Where the pelvis sits, and how big he is. */
  x: number;
  y: number;
  scale?: number;
  /** Whole-puppet rotation, for the hang. */
  roll?: number;
  /** Degrees, clockwise, measured from straight down the body. */
  torso?: number;
  head?: number;
  armNear?: [number, number];
  armFar?: [number, number];
  legNear?: [number, number];
  legFar?: [number, number];
  tail?: [number, number];
  /** 0 fur, 1 suited. The clothes are separate pieces laid over him. */
  dressed?: number;
  /** 0 covered, 1 shaved to the skin. */
  shaved?: number;
  flip?: boolean;
};

const D = {
  torso: 52,
  head: 30,
  upper: 30,
  fore: 27,
  thigh: 30,
  shin: 27,
  tail: 40,
};

const rad = (d: number) => (d * Math.PI) / 180;

/** A limb segment: a tapering strip of paper, pinned at its top. */
function Segment({
  x,
  y,
  angle,
  len,
  w1,
  w2,
  fill,
  seed,
  lift = "soft",
}: {
  x: number;
  y: number;
  angle: number;
  len: number;
  w1: number;
  w2: number;
  fill: string;
  seed: number;
  lift?: "none" | "soft" | "normal" | "deep";
}) {
  // Built along its own axis, then rotated about the pin, so the pin is a
  // real point the next segment can hang from.
  const d = cutPath(
    [
      [-w1, -w1 * 0.5],
      [w1, -w1 * 0.5],
      [w2, len],
      [-w2, len],
    ],
    seed,
    1.1
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Piece d={d} fill={fill} lift={lift} />
    </g>
  );
}

/** Where a segment ends, so the next one can be pinned there. */
const tip = (x: number, y: number, angle: number, len: number): [number, number] => [
  x + Math.sin(rad(angle)) * len,
  y + Math.cos(rad(angle)) * len,
];

export const Sultan: React.FC<{ pose: SultanPose; seed?: number }> = ({ pose, seed = 41 }) => {
  const {
    x,
    y,
    scale = 1,
    roll = 0,
    torso = 0,
    head = 0,
    armNear = [20, 10],
    armFar = [-14, 8],
    legNear = [10, -6],
    legFar = [-12, 8],
    tail = [150, 30],
    dressed = 0,
    shaved = 0,
    flip = false,
  } = pose;

  // Shaved skin is the same figure with the covering taken off it, which is
  // the whole horror of that chapter, so it is a colour swap and nothing else.
  const coat = shaved > 0.5 ? PAPER.skin : PAPER.fur;
  const coatDark = shaved > 0.5 ? "#b3835c" : PAPER.furDark;
  const suit = PAPER.slate;
  const suitDark = PAPER.slateDark;

  const nearFill = dressed > 0.5 ? suit : coat;
  const farFill = dressed > 0.5 ? suitDark : coatDark;

  // Chest, and the shoulder and hip pins on it.
  const [cx, cy] = tip(0, 0, torso + 180, D.torso);
  const [hx, hy] = tip(cx, cy, torso + 180, D.head * 0.35);

  const seg = (
    px: number,
    py: number,
    a: [number, number],
    l1: number,
    l2: number,
    w: number,
    fill: string,
    s: number
  ) => {
    const [mx, my] = tip(px, py, a[0], l1);
    return (
      <>
        <Segment x={px} y={py} angle={a[0]} len={l1} w1={w} w2={w * 0.82} fill={fill} seed={s} />
        <Segment x={mx} y={my} angle={a[0] + a[1]} len={l2} w1={w * 0.82} w2={w * 0.62} fill={fill} seed={s + 1} />
      </>
    );
  };

  const [tmx, tmy] = tip(0, 0, tail[0], D.tail);

  return (
    <g transform={`translate(${x} ${y}) rotate(${roll}) scale(${(flip ? -scale : scale)} ${scale})`}>
      {/* Far side */}
      <g opacity={0.92}>
        {seg(cx, cy, armFar, D.upper, D.fore, 7, farFill, seed + 10)}
        {seg(0, 0, legFar, D.thigh, D.shin, 8.5, farFill, seed + 20)}
      </g>

      {/* Tail: two pieces, pinned at the base and again halfway. */}
      <Segment x={0} y={0} angle={tail[0]} len={D.tail} w1={5} w2={3.6} fill={coatDark} seed={seed + 30} />
      <Segment x={tmx} y={tmy} angle={tail[0] + tail[1]} len={D.tail * 0.9} w1={3.6} w2={1.8} fill={coatDark} seed={seed + 31} />

      {/* Body */}
      <g transform={`rotate(${torso})`}>
        <Piece
          d={cutPath(
            [
              [-13, 4],
              [13, 4],
              [16, -D.torso * 0.55],
              [13, -D.torso],
              [-13, -D.torso],
              [-16, -D.torso * 0.55],
            ],
            seed,
            1.4
          )}
          fill={dressed > 0.5 ? suit : coat}
        />
        {dressed > 0.5 && (
          <>
            {/* A shirt showing at the opening, and the lapels over it. */}
            <Piece
              d={cutPath([[-4, -D.torso + 2], [4, -D.torso + 2], [3, -14], [-3, -14]], seed + 3, 0.8)}
              fill={PAPER.paperWhite}
              lift="none"
            />
            <Piece
              d={cutPath([[-13, -D.torso], [-2, -D.torso + 3], [-5, -18], [-14, -22]], seed + 4, 0.9)}
              fill={suitDark}
              lift="soft"
            />
            <Piece
              d={cutPath([[13, -D.torso], [2, -D.torso + 3], [5, -18], [14, -22]], seed + 5, 0.9)}
              fill={suitDark}
              lift="soft"
            />
          </>
        )}
      </g>

      {/* Near side */}
      {seg(cx, cy, armNear, D.upper, D.fore, 7.5, nearFill, seed + 40)}
      {seg(0, 0, legNear, D.thigh, D.shin, 9, nearFill, seed + 50)}

      {/* Head, pinned at the neck */}
      <g transform={`translate(${hx} ${hy}) rotate(${head})`}>
        <Piece d={cutEllipse(0, -14, 17, 18, seed + 60, 1.3)} fill={coat} />
        {/* The muzzle carried ahead of the brow: the one shape that makes him
            a macaque rather than any animal. */}
        <Piece d={cutEllipse(11, -8, 12, 9, seed + 61, 1.1)} fill={shaved > 0.5 ? "#c99a72" : PAPER.skin} lift="soft" />
        <Piece d={cutEllipse(-15, -16, 6, 8, seed + 62, 1)} fill={coatDark} lift="soft" />
        <circle cx={6} cy={-18} r={2.6} fill="#221208" />
        <circle cx={6.9} cy={-18.9} r={0.9} fill={PAPER.paperWhite} />
        <Piece
          d={cutPath([[-2, -25], [12, -22], [12, -20], [-2, -23]], seed + 63, 0.7)}
          fill={coatDark}
          lift="none"
        />
      </g>
    </g>
  );
};
