/**
 * A rhesus macaque, rigged for the intro sequence on The Highest Branch.
 *
 * Forward kinematics over a small skeleton: every joint is an angle in
 * degrees measured from the +x axis with +y pointing down, so 0 is right and
 * 90 is straight down. Poses are plain numbers, which means two poses can be
 * blended with a lerp and a gait can be added on top as an offset.
 *
 * Drawn as tapered strokes rather than filled outlines: the sequence is meant
 * to read as an illustration in the same ink as the rest of the site, and a
 * line keeps its character at every size the viewport might be.
 */

export type Pose = {
  /** Root, at the pelvis, in world units. */
  x: number;
  y: number;
  /** Whole-body rotation, for the hang and the flip. */
  roll: number;
  scale: number;
  spine: number;
  neck: number;
  head: number;
  /** Near and far limbs, so the figure reads with depth. */
  armN: [number, number];
  armF: [number, number];
  legN: [number, number, number];
  legF: [number, number, number];
  tail: [number, number];
  /** 0 bare, 1 fully suited. Crossfades the clothes on. */
  dressed: number;
};

const L = {
  spine: 58,
  neck: 20,
  skull: 26,
  upperArm: 40,
  foreArm: 38,
  hand: 12,
  thigh: 40,
  shin: 36,
  foot: 16,
  tail: 76,
};

const rad = (d: number) => (d * Math.PI) / 180;

type P = { x: number; y: number };
const step = (p: P, deg: number, len: number): P => ({
  x: p.x + Math.cos(rad(deg)) * len,
  y: p.y + Math.sin(rad(deg)) * len,
});

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const n = (x: number, y: number) => x + (y - x) * t;
  const p2 = (x: [number, number], y: [number, number]): [number, number] => [
    n(x[0], y[0]),
    n(x[1], y[1]),
  ];
  const p3 = (
    x: [number, number, number],
    y: [number, number, number]
  ): [number, number, number] => [n(x[0], y[0]), n(x[1], y[1]), n(x[2], y[2])];

  return {
    x: n(a.x, b.x),
    y: n(a.y, b.y),
    roll: n(a.roll, b.roll),
    scale: n(a.scale, b.scale),
    spine: n(a.spine, b.spine),
    neck: n(a.neck, b.neck),
    head: n(a.head, b.head),
    armN: p2(a.armN, b.armN),
    armF: p2(a.armF, b.armF),
    legN: p3(a.legN, b.legN),
    legF: p3(a.legF, b.legF),
    tail: p2(a.tail, b.tail),
    dressed: n(a.dressed, b.dressed),
  };
}

export type Limb = { d: string; w: number; far: boolean };
export type Figure = {
  limbs: Limb[];
  torso: string;
  neck: string;
  head: { d: string; muzzle: string; eye: P; ear: P; brow: string };
  tail: string;
  /** Clothing, drawn only when `dressed` is above zero. */
  suit: { jacket: string; lapel: string; trouserN: string; trouserF: string; shoes: string[] };
  dressed: number;
  /** Where the figure actually occupies space, for occlusion tests. */
  bounds: { x: number; y: number };
};

/** Resolves a pose into the paths that draw it. */
export function buildFigure(p: Pose): Figure {
  const s = p.scale;
  const R = rad(p.roll);
  const cos = Math.cos(R);
  const sin = Math.sin(R);

  // Everything is built in body space, then rolled and placed. Doing the roll
  // here rather than with an SVG transform keeps the stroke widths honest.
  const place = (q: P): P => ({
    x: p.x + (q.x * cos - q.y * sin) * s,
    y: p.y + (q.x * sin + q.y * cos) * s,
  });
  const path = (pts: P[]) =>
    pts.map((q, i) => `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const curve = (a: P, b: P, c: P) =>
    `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${b.x.toFixed(1)} ${b.y.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;

  const pelvis: P = { x: 0, y: 0 };
  const chest = step(pelvis, p.spine, L.spine);
  const neck = step(chest, p.neck, L.neck);
  const skull = step(neck, p.head, L.skull);

  const arm = (a: [number, number]) => {
    const elbow = step(chest, a[0], L.upperArm);
    const wrist = step(elbow, a[1], L.foreArm);
    const hand = step(wrist, a[1] + 18, L.hand);
    return [chest, elbow, wrist, hand].map(place);
  };
  const leg = (a: [number, number, number]) => {
    const knee = step(pelvis, a[0], L.thigh);
    const ankle = step(knee, a[1], L.shin);
    const toe = step(ankle, a[2], L.foot);
    return [pelvis, knee, ankle, toe].map(place);
  };

  const armNear = arm(p.armN);
  const armFar = arm(p.armF);
  const legNear = leg(p.legN);
  const legFar = leg(p.legF);

  const tailMid = step(pelvis, p.tail[0], L.tail * 0.6);
  const tailEnd = step(tailMid, p.tail[0] + p.tail[1], L.tail * 0.7);

  const cP = place(chest);
  const pP = place(pelvis);

  // The muzzle is what makes it a macaque rather than a generic ape: a long
  // low snout carried ahead of a flat brow. The outline is built as a ring of
  // points around the skull so it stays attached at every head angle; an
  // earlier version anchored it to the neck and the head floated free.
  const around = (deg: number, len: number) => place(step(skull, p.head + deg, len));
  const ring = [
    around(180, 13), // back of skull
    around(-118, 13), // crown
    around(-52, 15), // brow
    around(-16, 24), // bridge
    around(2, 27), // muzzle tip
    around(30, 18), // lip
    around(64, 13), // chin
    around(132, 12), // throat
  ];

  const eye = around(-34, 9);
  const ear = around(158, 11);
  const browA = around(-74, 13);
  const browB = around(-26, 17);
  const napeP = around(150, 9);

  const hipN = legNear[0];
  const kneeN = legNear[1];
  const kneeF = legFar[1];

  return {
    limbs: [
      { d: path(armFar), w: 4.6 * s, far: true },
      { d: path(legFar), w: 5.2 * s, far: true },
      { d: path(armNear), w: 5.4 * s, far: false },
      { d: path(legNear), w: 6 * s, far: false },
    ],
    torso: path([pP, cP]),
    // Drawn under the head so the join is never a visible seam.
    neck: path([cP, napeP]),
    head: {
      d: `${path(ring)} Z`,
      muzzle: curve(around(-30, 10), around(-6, 20), around(24, 12)),
      eye,
      ear,
      brow: path([browA, browB]),
    },
    tail: curve(pP, place(tailMid), place(tailEnd)),
    suit: {
      // A jacket is a torso shape; trousers are the legs thickened; shoes are
      // a wedge on the toe. Nothing here needs its own rig.
      jacket: `${path([cP, pP])}`,
      lapel: `${path([cP, place(step(chest, p.spine + 150, 22))])}`,
      trouserN: path([hipN, kneeN]),
      trouserF: path([legFar[0], kneeF]),
      shoes: [path([legNear[2], legNear[3]]), path([legFar[2], legFar[3]])],
    },
    dressed: p.dressed,
    bounds: { x: p.x, y: p.y },
  };
}
