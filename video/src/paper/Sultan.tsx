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
  torso: 54,
  head: 30,
  upper: 34,
  fore: 31,
  thigh: 33,
  shin: 29,
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

/** A hand or a foot: one more piece, pinned at the end of the limb. */
function Extremity({
  x,
  y,
  angle,
  rx,
  ry,
  fill,
  seed,
}: {
  x: number;
  y: number;
  angle: number;
  rx: number;
  ry: number;
  fill: string;
  seed: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <Piece d={cutEllipse(0, ry * 0.55, rx, ry, seed, 1)} fill={fill} lift="soft" />
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
    s: number,
    end?: { fill: string; rx: number; ry: number }
  ) => {
    const [mx, my] = tip(px, py, a[0], l1);
    const [ex, ey] = tip(mx, my, a[0] + a[1], l2);
    return (
      <>
        <Segment x={px} y={py} angle={a[0]} len={l1} w1={w} w2={w * 0.84} fill={fill} seed={s} />
        <Segment x={mx} y={my} angle={a[0] + a[1]} len={l2} w1={w * 0.84} w2={w * 0.66} fill={fill} seed={s + 1} />
        {end && (
          <Extremity
            x={ex}
            y={ey}
            angle={a[0] + a[1]}
            rx={end.rx}
            ry={end.ry}
            fill={end.fill}
            seed={s + 2}
          />
        )}
      </>
    );
  };

  // Four grasping hands, which is what the novel gives him, and long feet
  // that fold over a branch. The shoe only ever covers the near foot,
  // because a cut-out puppet is only ever dressed on the side you can see.
  const handSkin = shaved > 0.5 ? "#c99a72" : PAPER.skin;
  const shoeFill = "#221a17";
  const nearHand = { fill: handSkin, rx: 7.5, ry: 6 };
  const farHand = { fill: shaved > 0.5 ? "#a8724c" : "#b8825a", rx: 6.8, ry: 5.4 };
  const nearFoot = dressed > 0.5 ? { fill: shoeFill, rx: 11, ry: 6.4 } : { fill: handSkin, rx: 10, ry: 6 };
  const farFoot = dressed > 0.5 ? { fill: "#181211", rx: 10, ry: 5.8 } : { fill: farHand.fill, rx: 9, ry: 5.4 };

  const [tmx, tmy] = tip(0, 0, tail[0], D.tail);

  return (
    <g transform={`translate(${x} ${y}) rotate(${roll}) scale(${(flip ? -scale : scale)} ${scale})`}>
      {/* Far side */}
      <g opacity={0.92}>
        {seg(cx, cy, armFar, D.upper, D.fore, 7.6, farFill, seed + 10, farHand)}
        {seg(0, 0, legFar, D.thigh, D.shin, 9.2, farFill, seed + 20, farFoot)}
      </g>

      {/* Tail: two pieces, pinned at the base and again halfway. */}
      <Segment x={0} y={0} angle={tail[0]} len={D.tail} w1={5} w2={3.6} fill={coatDark} seed={seed + 30} />
      <Segment x={tmx} y={tmy} angle={tail[0] + tail[1]} len={D.tail * 0.9} w1={3.6} w2={1.8} fill={coatDark} seed={seed + 31} />

      {/* Body */}
      <g transform={`rotate(${torso})`}>
        <Piece
          d={cutPath(
            [
              [-12, 6],
              [12, 6],
              [17, -D.torso * 0.5],
              [19, -D.torso + 6],
              [11, -D.torso],
              [-11, -D.torso],
              [-19, -D.torso + 6],
              [-17, -D.torso * 0.5],
            ],
            seed,
            1.4
          )}
          fill={dressed > 0.5 ? suit : coat}
        />
        <Piece
          d={cutPath(
            [
              [6, 4],
              [12, 6],
              [17, -D.torso * 0.5],
              [11, -D.torso],
              [4, -D.torso],
            ],
            seed + 90,
            1.1
          )}
          fill={dressed > 0.5 ? suitDark : coatDark}
          lift="none"
          opacity={0.55}
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
      {seg(cx, cy, armNear, D.upper, D.fore, 8.2, nearFill, seed + 40, nearHand)}
      {seg(0, 0, legNear, D.thigh, D.shin, 9.8, nearFill, seed + 50, nearFoot)}

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
