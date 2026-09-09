/**
 * Hand-cut edges.
 *
 * A shape cut from paper with scissors is never straight and never smooth:
 * the line wanders by a fraction of a millimetre and changes its mind at the
 * corners. Everything in this film goes through here, so nothing in it has a
 * machine edge.
 *
 * The jitter is deterministic, seeded per shape, so a given shape is cut the
 * same way on every frame. A random cut per frame would boil.
 */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pt = [number, number];

/**
 * Walks a polygon and returns a path with the edge broken up: extra points
 * along every run, each nudged off the true line.
 */
export function cutPath(points: Pt[], seed: number, wobble = 1.6, per = 26): string {
  const rand = mulberry32(seed);
  const out: Pt[] = [];

  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.round(len / per));
    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      const nx = -(y2 - y1) / (len || 1);
      const ny = (x2 - x1) / (len || 1);
      // Corners stay put; the wander is greatest mid-run, the way a hand
      // steadies at a turn and drifts along a straight.
      const bias = Math.sin(t * Math.PI);
      const w = (rand() - 0.5) * 2 * wobble * (0.35 + bias);
      out.push([x1 + (x2 - x1) * t + nx * w, y1 + (y2 - y1) * t + ny * w]);
    }
  }

  const d = out
    .map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  return `${d} Z`;
}

/** A rectangle, cut by hand. */
export function cutRect(x: number, y: number, w: number, h: number, seed: number, wobble = 1.6) {
  return cutPath(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    seed,
    wobble
  );
}

/** An ellipse, cut by hand: a ring of points, then the same wander. */
export function cutEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  wobble = 1.4,
  sides = 22
) {
  const pts: Pt[] = [];
  for (let i = 0; i < sides; i += 1) {
    const a = (i / sides) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return cutPath(pts, seed, wobble, 999);
}
