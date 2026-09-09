import React from "react";
import { PAPER } from "../paper/palette";
import { Ell, Piece, Poly, Rect } from "../paper/Paper";
import { cutPath, mulberry32 } from "../paper/cut";
import { Sultan } from "../paper/Sultan";
import { GROUND, TOWER, W, bandTop } from "./world";

/**
 * The lowest three bands: the forest, and the three things that happen in it.
 *
 * The reckoning tree grows out of the same ground the tower stands on, and
 * the film never cuts between them, so the join has to hold: the trunk runs
 * up into the facade and the facade takes over from it.
 */

const rand = mulberry32(2211);

/** Canopy: overlapping cut discs, laid darkest first. */
function Canopy({ y, spread = 1 }: { y: number; spread?: number }) {
  const blobs = React.useMemo(() => {
    const r = mulberry32(88);
    return Array.from({ length: 34 }, () => ({
      x: 120 + r() * (W - 240),
      y: y + (r() - 0.5) * 320 * spread,
      rx: 110 + r() * 130,
      tone: r(),
    })).sort((a, b) => a.tone - b.tone);
  }, [y, spread]);

  return (
    <g>
      {blobs.map((b, i) => (
        <Ell
          key={i}
          cx={b.x}
          cy={b.y}
          rx={b.rx}
          ry={b.rx * 0.66}
          seed={300 + i}
          fill={b.tone > 0.7 ? PAPER.canopy3 : b.tone > 0.36 ? PAPER.canopy1 : PAPER.canopy2}
          lift={b.tone > 0.7 ? "normal" : "soft"}
        />
      ))}
    </g>
  );
}

/** The reckoning tree: a trunk that runs the height of the forest bands. */
function ReckoningTree() {
  const top = bandTop(2);
  const x = TOWER.x + TOWER.w * 0.5;
  return (
    <g>
      <Poly
        points={[
          [x - 74, GROUND + 40],
          [x - 40, top - 200],
          [x + 40, top - 200],
          [x + 80, GROUND + 40],
        ]}
        seed={11}
        fill={PAPER.bark}
        lift="deep"
      />
      {/* Limbs, in the bands that need them. The family hangs from the one
          in the prayer band; the rest carry the canopy. */}
      {[
        { b: 0, y: 560, dir: -1, len: 620 },
        { b: 0, y: 470, dir: 1, len: 540 },
        { b: 1, y: 380, dir: -1, len: 500 },
        { b: 2, y: 300, dir: 1, len: 470 },
        { b: 2, y: 430, dir: -1, len: 430 },
      ].map((l, i) => (
        <Poly
          key={i}
          points={[
            [x + l.dir * 46, bandTop(l.b) + l.y],
            [x + l.dir * l.len, bandTop(l.b) + l.y - 60],
            [x + l.dir * l.len, bandTop(l.b) + l.y - 18],
            [x + l.dir * 46, bandTop(l.b) + l.y + 54],
          ]}
          seed={12 + i}
          fill={PAPER.barkDark}
          lift="normal"
        />
      ))}
    </g>
  );
}

/**
 * Yayamul.
 *
 * The mother-root is not drawn as a figure, because the novel is careful that
 * she is not one: she is below, in the dark under the floor, and every root
 * anyone has ever seen is her holding on. So she is roots, lit from beneath,
 * and the light is the only thing in the film that comes from below.
 */
function Roots() {
  const x = TOWER.x + TOWER.w * 0.5;
  const arms = React.useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: 11 }, (_, i) => {
      const a = (i / 10) * Math.PI - Math.PI * 0.02;
      const len = 300 + r() * 420;
      return { a, len, w: 26 - i * 1.2 };
    });
  }, []);
  return (
    <g>
      {arms.map((r, i) => {
        const ex = x + Math.cos(r.a) * -r.len;
        const ey = GROUND + 80 + Math.sin(r.a) * r.len * 0.42 + r.len * 0.3;
        return (
          <Piece
            key={i}
            d={cutPath(
              [
                [x - 40, GROUND + 30],
                [x + 40, GROUND + 30],
                [ex + r.w, ey],
                [ex - r.w, ey],
              ],
              700 + i,
              1.4
            )}
            fill={PAPER.root}
            lift="soft"
            opacity={0.9}
          />
        );
      })}
    </g>
  );
}

export const ForestBands: React.FC<{ frame: number }> = ({ frame }) => {
  const x = TOWER.x + TOWER.w * 0.5;
  const b0 = bandTop(0);
  const b1 = bandTop(1);
  const b2 = bandTop(2);

  // The family sways on the branch. Paper does not deform, so the sway is the
  // whole puppet turning about its grip, which is what a real one would do.
  const sway = Math.sin(frame / 26) * 4;

  return (
    <g>
      {/* Soil under everything, and the light that comes up out of it. */}
      <Rect x={-40} y={GROUND} w={W + 80} h={1400} seed={2} fill={PAPER.soil} lift="none" />
      <Ell cx={x} cy={GROUND + 260} rx={620} ry={300} seed={3} fill="#a5713f" lift="none" opacity={0.5} />
      <Roots />

      <ReckoningTree />

      {/* Band 0 — the prayer. They hang from the limb, heads down, turned
          toward the dark under the floor. */}
      <g>
        {[-1, 0, 1].map((k) => (
          <Sultan
            key={k}
            seed={41 + k * 7}
            pose={{
              x: x - 300 + k * 150,
              y: b0 + 560 + 34,
              scale: 1.15,
              roll: 180 + sway + k * 2,
              torso: 4 + k * 3,
              head: -12,
              armNear: [26, 18],
              armFar: [-18, 14],
              legNear: [6, -4],
              legFar: [-8, 6],
              tail: [162, 34],
            }}
          />
        ))}
      </g>
      <Canopy y={b0 + 130} />
      <Canopy y={b0 + 900} spread={0.4} />

      {/* Band 1 — the Upright cross the clearing. Three of them, on two legs
          the whole way, and the small one carries the ledger. */}
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${340 + i * 250} ${b1 + 720}) scale(1.9)`}>
            <Poly
              points={[
                [-26, 0],
                [26, 0],
                [30, -150],
                [-30, -150],
              ]}
              seed={410 + i}
              fill={i === 1 ? PAPER.slate : PAPER.slateDark}
              lift="normal"
            />
            <Ell cx={0} cy={-176} rx={26} ry={30} seed={420 + i} fill="#c9b299" lift="soft" />
            {/* Blunt shod feet: the detail the forest cannot stop looking at. */}
            <Rect x={-30} y={0} w={26} h={16} seed={430 + i} fill="#1a1f2b" lift="soft" />
            <Rect x={6} y={0} w={26} h={16} seed={431 + i} fill="#1a1f2b" lift="soft" />
            {i === 1 && (
              <Rect x={26} y={-96} w={44} h={56} seed={440} fill={PAPER.ledger} lift="soft" />
            )}
          </g>
        ))}
        <Canopy y={b1 + 20} spread={0.7} />
      </g>

      {/* Band 2 — the leaving. He is on the last limb, facing out, and the
          canopy stops here. */}
      <Sultan
        seed={77}
        pose={{
          x: x - 300,
          y: b2 + 300,
          scale: 1.25,
          torso: -6,
          head: 16,
          armNear: [56, 24],
          armFar: [-30, 18],
          legNear: [16, -10],
          legFar: [-14, 12],
          tail: [148, 40],
        }}
      />
      <Canopy y={b2 - 60} spread={0.5} />
    </g>
  );
};
