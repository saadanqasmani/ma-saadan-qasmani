/**
 * The nine beats of the intro, as poses on a timeline.
 *
 * Beat poses set the body's attitude; gait is added on top as a sine offset,
 * so a crawl or a run is one pose plus a cycle rather than a dozen hand-drawn
 * frames. Positions are world units in a scene 3400 wide, with the ground at
 * y = 780.
 */

import { buildFigure, lerpPose, type Figure, type Pose } from "./monkeyRig";

export const WORLD = { w: 3400, h: 1100, ground: 780 };
export const TREE_X = 320;
export const BRANCH_Y = 210;
export const CROWD = { from: 1810, to: 2380 };
export const BUILDING = { x: 2560, w: 620, top: -520 };

/** The visible window on the world, in world units. 16:9. */
export const VIEW = { w: 760, h: 428 };

/** The limb he hangs from, drawn explicitly so the grip always lands. */
export const HANG_BRANCH = { x1: TREE_X - 10, x2: TREE_X + 150, y: BRANCH_Y };

const base: Pose = {
  x: 0,
  y: 0,
  roll: 0,
  scale: 1,
  spine: -90,
  neck: -90,
  head: -78,
  armN: [70, 80],
  armF: [70, 80],
  legN: [90, 90, 40],
  legF: [90, 90, 40],
  tail: [150, 30],
  dressed: 0,
};

const pose = (o: Partial<Pose>): Pose => ({ ...base, ...o });

/** Hanging by both feet, head down, arms loose. */
const HANG = pose({
  x: TREE_X + 40,
  y: BRANCH_Y + 96,
  roll: 180,
  spine: -90,
  neck: -92,
  head: -70,
  armN: [96, 104],
  armF: [88, 98],
  legN: [-92, -90, -60],
  legF: [-84, -88, -60],
  tail: [140, 46],
});

/** Mid-flip, tucked. */
const FLIP = pose({
  x: TREE_X + 96,
  y: BRANCH_Y + 300,
  roll: 34,
  spine: -60,
  neck: -70,
  head: -50,
  armN: [40, 96],
  armF: [46, 100],
  legN: [110, 30, 20],
  legF: [116, 36, 24],
  tail: [126, 70],
});

/** Landed on all fours. */
const LAND = pose({
  x: TREE_X + 200,
  y: WORLD.ground - 78,
  spine: -18,
  neck: -34,
  head: -12,
  armN: [78, 96],
  armF: [70, 92],
  legN: [104, 74, 6],
  legF: [98, 80, 6],
  tail: [168, -34],
});

/** Knuckle-walking away from the tree. */
const CRAWL = pose({
  ...LAND,
  spine: -14,
  neck: -30,
  head: -8,
  tail: [172, -46],
});

/** Upright, the moment the posture changes. */
const STAND = pose({
  x: 0,
  y: WORLD.ground - 118,
  spine: -92,
  neck: -88,
  head: -74,
  armN: [96, 96],
  armF: [92, 92],
  legN: [92, 90, 20],
  legF: [88, 90, 20],
  tail: [150, 34],
});

/** The recoil off the crowd. */
const BUMP = pose({
  ...STAND,
  spine: -104,
  neck: -78,
  head: -58,
  armN: [30, -10],
  armF: [40, 0],
  legN: [72, 96, 24],
  legF: [110, 86, 18],
  tail: [128, 60],
});

/** Running, upright, leaning into it. */
const RUN = pose({
  ...STAND,
  spine: -80,
  neck: -84,
  head: -66,
  armN: [40, 110],
  armF: [140, 60],
  legN: [60, 110, 20],
  legF: [120, 80, 30],
  tail: [140, 60],
});

/** Climbing: reaching up a facade. */
const CLIMB = pose({
  spine: -96,
  neck: -92,
  head: -80,
  armN: [-84, -88],
  armF: [-100, -92],
  legN: [78, 92, 40],
  legF: [104, 88, 40],
  tail: [130, 56],
  x: 0,
  y: 0,
  roll: 0,
  scale: 1,
  dressed: 1,
});

/** The nine beats, as fractions of the whole. */
export const BEATS = {
  hang: [0.0, 0.11],
  drop: [0.11, 0.2],
  crawl: [0.2, 0.36],
  rise: [0.36, 0.44],
  approach: [0.44, 0.5],
  bump: [0.5, 0.55],
  through: [0.55, 0.68],
  emerge: [0.68, 0.76],
  climb: [0.76, 0.94],
  exit: [0.94, 1.0],
} as const;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Alternating swing added over a base pose. */
function gait(p: Pose, phase: number, amount: number, quad: boolean): Pose {
  const a = Math.sin(phase) * amount;
  const b = Math.sin(phase + Math.PI) * amount;
  const out: Pose = {
    ...p,
    armN: [p.armN[0] + (quad ? a : b) * 1.1, p.armN[1] + (quad ? a : b) * 0.5],
    armF: [p.armF[0] + (quad ? b : a) * 1.1, p.armF[1] + (quad ? b : a) * 0.5],
    legN: [p.legN[0] + a, p.legN[1] - Math.max(0, a) * 0.8, p.legN[2]],
    legF: [p.legF[0] + b, p.legF[1] - Math.max(0, b) * 0.8, p.legF[2]],
    tail: [p.tail[0] + Math.sin(phase * 0.5) * 8, p.tail[1]],
  };
  // A body rises and falls as it moves. Without this it skates.
  out.y = p.y - Math.abs(Math.sin(phase)) * (quad ? 4 : 9);
  return out;
}

export type Frame = {
  figure: Figure;
  /** Camera in world units. */
  cam: { x: number; y: number; z: number };
  /** Drawn in front of the figure while it is inside the crowd. */
  inCrowd: boolean;
  /** 0 to 1, fades the whole scene out at the end. */
  fade: number;
};

export function frameAt(t: number): Frame {
  let p: Pose;

  if (t < BEATS.drop[0]) {
    // Hanging, with a slow sway.
    const s = Math.sin(t * 46) * 5;
    p = { ...HANG, roll: HANG.roll + s, armN: [HANG.armN[0] + s, HANG.armN[1]] };
  } else if (t < BEATS.crawl[0]) {
    const k = span(t, BEATS.drop);
    p = k < 0.5 ? lerpPose(HANG, FLIP, easeInOut(k * 2)) : lerpPose(FLIP, LAND, easeOut((k - 0.5) * 2));
  } else if (t < BEATS.rise[0]) {
    const k = span(t, BEATS.crawl);
    const walk = { ...CRAWL, x: LAND.x + k * 620 };
    p = gait(walk, k * 26, 26, true);
  } else if (t < BEATS.approach[0]) {
    const k = span(t, BEATS.rise);
    const from = { ...CRAWL, x: LAND.x + 620 };
    const to = { ...STAND, x: LAND.x + 700 };
    p = lerpPose(from, to, easeInOut(k));
  } else if (t < BEATS.bump[0]) {
    const k = span(t, BEATS.approach);
    p = gait({ ...STAND, x: LAND.x + 700 + k * 560 }, k * 12, 20, false);
  } else if (t < BEATS.through[0]) {
    const k = span(t, BEATS.bump);
    const hit = { ...BUMP, x: LAND.x + 1260 };
    p = k < 0.45 ? lerpPose({ ...STAND, x: LAND.x + 1260 }, hit, easeOut(k / 0.45)) : lerpPose(hit, { ...RUN, x: LAND.x + 1270 }, easeInOut((k - 0.45) / 0.55));
  } else if (t < BEATS.emerge[0]) {
    // Through the crowd: the suit crossfades on while he is hidden.
    const k = span(t, BEATS.through);
    const run = { ...RUN, x: LAND.x + 1270 + k * 620, dressed: clamp01((k - 0.35) / 0.4) };
    p = gait(run, k * 30, 34, false);
  } else if (t < BEATS.climb[0]) {
    const k = span(t, BEATS.emerge);
    // Ends exactly where the climb picks him up, so he does not jump.
    const run = { ...RUN, x: LAND.x + 1890 + k * 300, dressed: 1 };
    p = gait(run, 30 * 0.13 + k * 22, 34, false);
  } else {
    const k = span(t, [BEATS.climb[0], 1] as const);
    const climbY = WORLD.ground - 118 - k * (WORLD.ground - BUILDING.top - 40);
    const c = { ...CLIMB, x: BUILDING.x + 150, y: climbY };
    // Reaching hand over hand rather than sliding up.
    const ph = k * 34;
    p = {
      ...c,
      armN: [c.armN[0] + Math.sin(ph) * 30, c.armN[1] + Math.sin(ph) * 12],
      armF: [c.armF[0] + Math.sin(ph + Math.PI) * 30, c.armF[1] + Math.sin(ph + Math.PI) * 12],
      legN: [c.legN[0] + Math.sin(ph + Math.PI) * 22, c.legN[1], c.legN[2]],
      legF: [c.legF[0] + Math.sin(ph) * 22, c.legF[1], c.legF[2]],
      x: c.x + Math.sin(ph) * 6,
    };
  }

  // Framing. The first attempt used a 1600-wide view and the figure was a
  // speck in an empty field: at roughly 130 units tall he has to own about a
  // third of the frame, which means the view is 760 wide, not 1600.
  //
  // The camera follows in y as well as x, so the hang reads from up in the
  // tree, and is stopped from dropping below the ground line.
  const camX = Math.max(0, p.x - VIEW.w * 0.42);
  const camY = Math.min(p.y - VIEW.h * 0.55, WORLD.ground + 60 - VIEW.h);
  const z = 1 + clamp01(span(t, BEATS.exit)) * 0.35;

  return {
    figure: buildFigure(p),
    cam: { x: camX, y: camY, z },
    inCrowd: p.x > CROWD.from - 40 && p.x < CROWD.to + 40,
    fade: 1 - clamp01(span(t, BEATS.exit)),
  };
}
