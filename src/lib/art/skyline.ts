/**
 * A forest that becomes a city.
 *
 * Both silhouettes are built as polygons with the same number of points, in
 * the same order — up the left side, across the top, down the right side — so
 * one can be interpolated into the other point by point. A crossfade would
 * have been easier and would have read as two pictures; this reads as one
 * shape changing its mind.
 */

const GROUND = 520;
const UP = 7;
const TOP = 30;
const DOWN = 7;
export const POINTS = UP + TOP + DOWN;

export type Form = {
  cx: number;
  /** Tree: trunk half-width, trunk height, canopy radius. */
  trunk: number;
  trunkH: number;
  canopy: number;
  /** Building: half-width, height, and how deep the roof step cuts. */
  half: number;
  height: number;
  step: number;
};

/** Seven forms, low and broad on the left, tall and narrow on the right. */
export const FORMS: Form[] = [
  { cx: 92, trunk: 8, trunkH: 96, canopy: 62, half: 24, height: 118, step: 0.18 },
  { cx: 168, trunk: 9, trunkH: 128, canopy: 74, half: 26, height: 166, step: 0.3 },
  { cx: 248, trunk: 10, trunkH: 112, canopy: 84, half: 30, height: 214, step: 0.12 },
  { cx: 328, trunk: 9, trunkH: 148, canopy: 70, half: 26, height: 258, step: 0.36 },
  { cx: 402, trunk: 11, trunkH: 120, canopy: 88, half: 32, height: 226, step: 0.2 },
  { cx: 478, trunk: 9, trunkH: 158, canopy: 68, half: 25, height: 286, step: 0.42 },
  { cx: 544, trunk: 10, trunkH: 106, canopy: 76, half: 28, height: 344, step: 0.26 },
];

type P = [number, number];

/** A tree: straight trunk, lobed canopy that meets the trunk at its top. */
function treePoints(f: Form, seed: number): P[] {
  const pts: P[] = [];
  const topY = GROUND - f.trunkH;

  // The trunk tapers, and leans very slightly, so it is not a stick.
  const lean = Math.sin(seed) * 5;
  const halfAt = (u: number) => f.trunk * (1.55 - 0.7 * u);
  for (let i = 0; i < UP; i++) {
    const u = i / (UP - 1);
    pts.push([f.cx - halfAt(u) + lean * u, GROUND - f.trunkH * u]);
  }

  // The canopy sweeps from one trunk shoulder to the other. Its radius eases
  // out from the trunk width at the ends, and two frequencies of lobe keep it
  // from reading as a dome on a stick.
  const cy = topY - f.canopy * 0.42;
  for (let i = 0; i < TOP; i++) {
    const t = i / (TOP - 1);
    const a = Math.PI - t * Math.PI;
    const shoulder = Math.sin(t * Math.PI) ** 0.5;
    const lobe =
      1 + Math.sin(t * Math.PI * 3 + seed) * 0.14 + Math.sin(t * Math.PI * 7 + seed * 2) * 0.06;
    const r = halfAt(1) + (f.canopy * lobe - halfAt(1)) * shoulder;
    pts.push([f.cx + lean + Math.cos(a) * r, cy - Math.sin(a) * r * 1.02]);
  }

  for (let i = 0; i < DOWN; i++) {
    const u = 1 - i / (DOWN - 1);
    pts.push([f.cx + halfAt(u) + lean * u, GROUND - f.trunkH * u]);
  }
  return pts;
}

/** A building: flat walls, a stepped roof, a mast on the tallest. */
function buildingPoints(f: Form, isTallest: boolean): P[] {
  const pts: P[] = [];
  const topY = GROUND - f.height;

  for (let i = 0; i < UP; i++) {
    pts.push([f.cx - f.half, GROUND - (f.height * i) / (UP - 1)]);
  }

  // The roof is walked in the same direction as the canopy, so points that
  // were canopy become roof rather than crossing over each other.
  const stepX = f.half * (1 - f.step);
  const stepY = topY + f.height * 0.07;
  for (let i = 0; i < TOP; i++) {
    const t = i / (TOP - 1);
    let x: number;
    let y: number;
    if (t < 0.16) {
      x = -f.half + (f.half - stepX) * (t / 0.16);
      y = stepY;
    } else if (t > 0.84) {
      x = stepX + (f.half - stepX) * ((t - 0.84) / 0.16);
      y = stepY;
    } else {
      const u = (t - 0.16) / 0.68;
      x = -stepX + stepX * 2 * u;
      // A mast at the centre of the tallest tower.
      y = isTallest && u > 0.46 && u < 0.54 ? topY - f.height * 0.14 : topY;
    }
    pts.push([f.cx + x, y]);
  }

  for (let i = 0; i < DOWN; i++) {
    pts.push([f.cx + f.half, topY + (f.height * i) / (DOWN - 1)]);
  }
  return pts;
}

const TREES = FORMS.map((f, i) => treePoints(f, i * 1.7));
const BUILDINGS = FORMS.map((f, i) => buildingPoints(f, i === FORMS.length - 1));

/** The outline of form `index` at `k`, 0 forest and 1 city. */
export function morphPath(index: number, k: number): string {
  const a = TREES[index];
  const b = BUILDINGS[index];
  let d = "";
  for (let i = 0; i < a.length; i++) {
    const x = a[i][0] + (b[i][0] - a[i][0]) * k;
    const y = a[i][1] + (b[i][1] - a[i][1]) * k;
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

/** Window grid for one building, in final (city) coordinates. */
export function windows(index: number) {
  const f = FORMS[index];
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const cols = Math.max(2, Math.round((f.half * 2) / 13));
  const rows = Math.max(3, Math.round(f.height / 26));
  const w = 5.5;
  const h = 8;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Skip a few, so the facade is not a perfect grid.
      if ((r * 7 + c * 3 + index) % 9 === 0) continue;
      out.push({
        x: f.cx - f.half + 9 + (c * (f.half * 2 - 18)) / Math.max(1, cols - 1) - w / 2,
        y: GROUND - f.height + 26 + r * 26,
        w,
        h,
      });
    }
  }
  return out.filter((r) => r.y + r.h < GROUND - 10);
}

/** Leaf specks in the canopy, which fade as the forest goes. */
export function leaves(index: number) {
  const f = FORMS[index];
  const cy = GROUND - f.trunkH - f.canopy * 0.42;
  return Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI - ((i + 0.5) / 9) * Math.PI;
    const r = f.canopy * (0.42 + ((i * 5) % 7) / 16);
    return { x: f.cx + Math.cos(a) * r, y: cy - Math.sin(a) * r * 0.9 };
  });
}

export { GROUND };
