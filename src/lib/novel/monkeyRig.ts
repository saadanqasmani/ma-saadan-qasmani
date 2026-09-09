/**
 * The figure for the title sequence on The Highest Branch.
 *
 * Forward kinematics over a small skeleton: every joint is an angle in
 * degrees measured from the +x axis with +y pointing down, so 0 is right and
 * 90 is straight down. Poses are plain numbers, which means two poses can be
 * blended with a lerp and a gait can be added on top as an offset.
 *
 * The first version drew the skeleton directly, as tapered strokes. It was
 * legible and it was a stick figure. This one resolves the same skeleton into
 * filled, tapering volumes: every limb is a ribbon whose half-width falls
 * from shoulder to wrist, the torso is a closed body rather than a line, and
 * the hands, feet and face are their own shapes. The skeleton is unchanged,
 * so every pose and every beat of the sequence still holds.
 *
 * The anatomy follows the novel: four grasping hands rather than two hands
 * and two feet, long feet that fold over a branch, and a tail that carries
 * its own weight.
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

/**
 * Macaque proportions, not human ones.
 *
 * The first pass carried a long spine over long thin limbs and the result
 * read as an anteater. A macaque is compact: the trunk is barely longer than
 * the thigh, the head is large against the body, and the forearm is shorter
 * than the upper arm rather than equal to it.
 */
const L = {
  spine: 46,
  neck: 13,
  skull: 24,
  upperArm: 34,
  foreArm: 29,
  hand: 12,
  thigh: 35,
  shin: 30,
  foot: 17,
  tail: 74,
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

// ── Geometry helpers ───────────────────────────────────────────────────────

const f1 = (n: number) => n.toFixed(1);

/** A smooth polyline: quadratics through the midpoints of each segment. */
function smooth(pts: P[]): string {
  if (pts.length < 2) return "";
  let d = `M ${f1(pts[0].x)} ${f1(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${f1(pts[i].x)} ${f1(pts[i].y)} ${f1(mx)} ${f1(my)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${f1(last.x)} ${f1(last.y)}`;
}

/**
 * A limb, as a closed shape rather than a stroke.
 *
 * The spine of the limb is offset either side by a half-width that tapers
 * along its length, and the two edges are joined by a round cap at each end.
 * A stroke of varying width would need one path per segment and would show
 * every joint as a step; this is one path and reads as one arm.
 */
function ribbon(pts: P[], widths: number[]): string {
  const n = pts.length;
  const left: P[] = [];
  const right: P[] = [];

  for (let i = 0; i < n; i += 1) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = widths[i];
    left.push({ x: pts[i].x + nx * w, y: pts[i].y + ny * w });
    right.push({ x: pts[i].x - nx * w, y: pts[i].y - ny * w });
  }

  const capEnd = `A ${f1(widths[n - 1])} ${f1(widths[n - 1])} 0 0 1 ${f1(right[n - 1].x)} ${f1(right[n - 1].y)}`;
  const capStart = `A ${f1(widths[0])} ${f1(widths[0])} 0 0 1 ${f1(left[0].x)} ${f1(left[0].y)}`;

  return `${smooth(left)} ${capEnd} ${smooth(right.slice().reverse()).replace(/^M/, "L")} ${capStart} Z`;
}

/** A closed blob: an ellipse through four points, for hands, feet and ears. */
function blob(c: P, rx: number, ry: number, deg: number): string {
  const r = rad(deg);
  const cs = Math.cos(r);
  const sn = Math.sin(r);
  const at = (u: number, v: number): P => ({
    x: c.x + u * rx * cs - v * ry * sn,
    y: c.y + u * rx * sn + v * ry * cs,
  });
  const k = 0.5523;
  const p0 = at(-1, 0);
  const p1 = at(0, -1);
  const p2 = at(1, 0);
  const p3 = at(0, 1);
  const h = (a: P, b: P, ux: number, uy: number, vx: number, vy: number) =>
    `C ${f1(a.x + ux)} ${f1(a.y + uy)} ${f1(b.x + vx)} ${f1(b.y + vy)} ${f1(b.x)} ${f1(b.y)}`;
  const ex = rx * k * cs;
  const ey = rx * k * sn;
  const fx = -ry * k * sn;
  const fy = ry * k * cs;
  return [
    `M ${f1(p0.x)} ${f1(p0.y)}`,
    h(p0, p1, -fx, -fy, -ex, -ey),
    h(p1, p2, ex, ey, -fx, -fy),
    h(p2, p3, fx, fy, ex, ey),
    h(p3, p0, -ex, -ey, fx, fy),
    "Z",
  ].join(" ");
}

// ── The figure ─────────────────────────────────────────────────────────────

export type Figure = {
  /** Drawn behind the body, dimmed, so the figure reads with depth. */
  tail: string;
  armFar: string;
  legFar: string;
  handFar: string;
  footFar: string;
  /** The body itself. */
  torso: string;
  chestLight: string;
  /** Drawn in front. */
  armNear: string;
  legNear: string;
  handNear: string;
  footNear: string;
  head: {
    skull: string;
    face: string;
    ear: string;
    earInner: string;
    brow: string;
    eye: P;
    eyeR: number;
    glint: P;
    nostril: string;
    mouth: string;
  };
  /** Clothing. Painted at `dressed` opacity over the same limbs. */
  suit: {
    jacket: string;
    lapel: string;
    collar: string;
    sleeveNear: string;
    sleeveFar: string;
    trouserNear: string;
    trouserFar: string;
    shoeNear: string;
    shoeFar: string;
  };
  dressed: number;
  scale: number;
  /** Where the figure actually occupies space, for occlusion tests. */
  bounds: { x: number; y: number };
};

/** Resolves a pose into the shapes that draw it. */
export function buildFigure(p: Pose): Figure {
  const s = p.scale;
  const R = rad(p.roll);
  const cos = Math.cos(R);
  const sin = Math.sin(R);

  // Everything is built in body space, then rolled and placed, so the widths
  // below are body units and scale with the figure rather than with the view.
  const place = (q: P): P => ({
    x: p.x + (q.x * cos - q.y * sin) * s,
    y: p.y + (q.x * sin + q.y * cos) * s,
  });

  const pelvis: P = { x: 0, y: 0 };
  const chest = step(pelvis, p.spine, L.spine);
  const neck = step(chest, p.neck, L.neck);
  const skull = step(neck, p.head, L.skull);

  const armChain = (a: [number, number]) => {
    const shoulder = step(chest, p.spine + 180, 4);
    const elbow = step(shoulder, a[0], L.upperArm);
    const wrist = step(elbow, a[1], L.foreArm);
    return { pts: [shoulder, elbow, wrist], hand: step(wrist, a[1] + 18, L.hand * 0.6), dir: a[1] };
  };
  const legChain = (a: [number, number, number]) => {
    const hip = step(pelvis, p.spine + 180, 3);
    const knee = step(hip, a[0], L.thigh);
    const ankle = step(knee, a[1], L.shin);
    return { pts: [hip, knee, ankle], foot: step(ankle, a[2], L.foot * 0.55), dir: a[2] };
  };

  const aN = armChain(p.armN);
  const aF = armChain(p.armF);
  const lN = legChain(p.legN);
  const lF = legChain(p.legF);

  // Half-widths, shoulder to wrist and hip to ankle. A limb that keeps one
  // width is a tube; the taper is most of what makes it read as an arm.
  const armW = [10, 7.6, 5.4].map((w) => w * s);
  const armWFar = [9, 6.8, 4.9].map((w) => w * s);
  const legW = [12.6, 9, 6].map((w) => w * s);
  const legWFar = [11.4, 8.1, 5.4].map((w) => w * s);

  const armNearPts = aN.pts.map(place);
  const armFarPts = aF.pts.map(place);
  const legNearPts = lN.pts.map(place);
  const legFarPts = lF.pts.map(place);

  // The torso is a body, not a line: narrow at the waist, wide at the chest,
  // with the shoulders carried above the ribs.
  const waist = step(pelvis, p.spine, L.spine * 0.34);
  const ribs = step(pelvis, p.spine, L.spine * 0.74);
  // The last point is inside the skull, not at the neck: a torso that stops
  // at the neck leaves a gap the head appears to float above.
  const collar = step(neck, p.head, L.skull * 0.55);
  const torsoPts = [pelvis, waist, ribs, chest, neck, collar].map(place);
  const torsoW = [15.5, 13.6, 16.4, 16.2, 10.4, 9].map((w) => w * s);

  const tailMid = step(pelvis, p.tail[0], L.tail * 0.6);
  const tailEnd = step(tailMid, p.tail[0] + p.tail[1], L.tail * 0.7);
  const tailPts = [pelvis, tailMid, tailEnd].map(place);
  const tailW = [6.4, 4, 1.8].map((w) => w * s);

  // The head is built as a ring of points around the skull so it stays
  // attached at every angle; an earlier version anchored it to the neck and
  // the head floated free at the extremes of the flip.
  const around = (deg: number, len: number) => place(step(skull, p.head + deg, len * s));
  // A macaque skull is not an egg. The brow steps out over the eye, the
  // muzzle is short and low, and the cranium is round behind it. Those three
  // are what stop the head reading as a generic animal.
  const skullRing = [
    around(178, 18),
    around(-146, 19),
    around(-104, 19.5),
    around(-72, 19),
    around(-54, 20.5), // brow shelf
    around(-34, 19),
    around(-12, 22),
    around(4, 24), // muzzle tip
    around(28, 19),
    around(58, 16),
    around(102, 16),
    around(146, 17),
  ];
  const faceRing = [
    around(-36, 13),
    around(-12, 19),
    around(4, 21),
    around(28, 16.5),
    around(52, 12),
    around(14, 11),
  ];

  const eye = around(-46, 12.5);
  const glint = around(-52, 14);
  const earC = around(160, 16.5);
  const brow = smooth([around(-82, 16), around(-56, 19.5), around(-30, 20)]);
  const nostril = blob(around(0, 20), 2 * s, 1.4 * s, p.head + 90);
  const mouth = smooth([around(20, 18), around(30, 16), around(42, 12.5)]);

  // Clothing rides the same chains, a little thicker, and stops short of the
  // hands and feet so the skin still shows at the cuff.
  // Cloth sits just off the body rather than ballooning: a jacket that is a
  // third wider than the arm inside it reads as a sack.
  const sleeve = (pts: P[], w: number[]) => ribbon(pts, w.map((v) => v * 1.16));
  const shoe = (ankle: P, foot: P) => ribbon([ankle, foot], [5.6 * s, 7.2 * s]);
  // The jacket carries a shoulder line the torso does not have.
  const shoulderL = step(chest, p.spine + 90, 15);
  const shoulderR = step(chest, p.spine - 90, 15);

  return {
    tail: ribbon(tailPts, tailW),
    armFar: ribbon(armFarPts, armWFar),
    legFar: ribbon(legFarPts, legWFar),
    handFar: blob(place(aF.hand), 8 * s, 6 * s, aF.dir + p.roll),
    footFar: blob(place(lF.foot), 10.5 * s, 5.8 * s, lF.dir + p.roll),

    torso: ribbon(torsoPts, torsoW),
    chestLight: ribbon(
      [place(waist), place(ribs), place(chest)],
      [7.5 * s, 9.4 * s, 8.6 * s]
    ),

    armNear: ribbon(armNearPts, armW),
    legNear: ribbon(legNearPts, legW),
    handNear: blob(place(aN.hand), 8.6 * s, 6.4 * s, aN.dir + p.roll),
    footNear: blob(place(lN.foot), 11.2 * s, 6.2 * s, lN.dir + p.roll),

    head: {
      skull: `${smooth(skullRing)} Z`,
      face: `${smooth(faceRing)} Z`,
      ear: blob(earC, 6.6 * s, 8 * s, p.head),
      earInner: blob(earC, 3.5 * s, 4.4 * s, p.head),
      brow,
      eye,
      eyeR: 3.4 * s,
      glint,
      nostril,
      mouth,
    },

    suit: {
      jacket: `${ribbon(torsoPts.slice(0, 5), [17.5, 16, 19.5, 20.5, 12].map((w) => w * s))} ${ribbon([place(shoulderL), place(chest), place(shoulderR)], [7 * s, 12 * s, 7 * s])}`,
      // The shirt: a narrow wedge from the collar down to the button line, so
      // the jacket has something to be open over.
      lapel: `${smooth([place(step(neck, p.neck + 180, 6)), place(step(chest, p.spine, 4)), place(step(ribs, p.spine + 180, 3))])}`,
      collar: ribbon(
        [place(neck), place(step(neck, p.neck + 180, 9))],
        [8.4 * s, 6 * s]
      ),
      sleeveNear: sleeve(armNearPts.slice(0, 2), armW.slice(0, 2)),
      sleeveFar: sleeve(armFarPts.slice(0, 2), armWFar.slice(0, 2)),
      trouserNear: sleeve(legNearPts, legW),
      trouserFar: sleeve(legFarPts, legWFar),
      shoeNear: shoe(legNearPts[2], place(lN.foot)),
      shoeFar: shoe(legFarPts[2], place(lF.foot)),
    },

    dressed: p.dressed,
    scale: s,
    bounds: { x: p.x, y: p.y },
  };
}
