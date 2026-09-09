import React from "react";
import { PAPER } from "../paper/palette";
import { Ell, Piece, Poly, Rect } from "../paper/Paper";
import { cutPath, mulberry32 } from "../paper/cut";
import { OttoClipping } from "../paper/Otto";
import { BAND, FOREST_BANDS, TOWER, bandTop } from "./world";

/**
 * The tower, and the nine floors that are the rest of his life.
 *
 * Each floor is a lit room seen through the facade, and each holds one thing
 * that happened. The camera passes them; it never stops on one. That is
 * deliberate: the novel's account of these years is that they went by while
 * he was busy holding on.
 */

const FX = TOWER.x;
const FW = TOWER.w;

/** A lit room cut into the facade. */
const Room: React.FC<{
  top: number;
  glow?: string;
  children?: React.ReactNode;
  seed: number;
}> = ({ top, glow = PAPER.glassWarm, children, seed }) => {
  const x = FX + 110;
  const y = top + 190;
  const w = FW - 220;
  const h = BAND - 420;
  return (
    <g>
      <Rect x={x} y={y} w={w} h={h} seed={seed} fill={glow} lift="deep" />
      <g clipPath={`url(#room-${seed})`}>
        <clipPath id={`room-${seed}`}>
          <path d={cutPath([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed, 1.5)} />
        </clipPath>
        {children}
      </g>
      {/* The glazing bar, so a room reads as seen through something. */}
      <Rect x={x + w / 2 - 5} y={y} w={10} h={h} seed={seed + 1} fill={PAPER.concreteDark} lift="soft" opacity={0.8} />
    </g>
  );
};

/** A person, in the flat way everyone but Sultan is drawn. */
const Figure: React.FC<{
  x: number;
  y: number;
  h?: number;
  fill?: string;
  seed: number;
  hat?: boolean;
}> = ({ x, y, h = 150, fill = PAPER.slate, seed, hat }) => (
  <g>
    <Poly
      points={[
        [x - h * 0.17, y],
        [x + h * 0.17, y],
        [x + h * 0.2, y - h * 0.66],
        [x - h * 0.2, y - h * 0.66],
      ]}
      seed={seed}
      fill={fill}
    />
    <Ell cx={x} cy={y - h * 0.78} rx={h * 0.15} ry={h * 0.17} seed={seed + 1} fill={fill} lift="soft" />
    {hat && <Rect x={x - h * 0.2} y={y - h * 0.95} w={h * 0.4} h={h * 0.09} seed={seed + 2} fill={PAPER.night2} lift="soft" />}
  </g>
);

export const TowerBands: React.FC<{ frame: number; hasOttoPhoto: boolean }> = ({
  frame,
  hasOttoPhoto,
}) => {
  const facadeTop = bandTop(11) - 140;
  /*
   * The tower stops where the forest starts.
   *
   * The first pass ran the facade all the way to the ground, so the prayer in
   * the canopy happened against a concrete wall: the forest was drawn after
   * it, but the wall was still filling the frame behind the family. The tower
   * grows out of the top of the forest, not through it.
   */
  const facadeBottom = bandTop(FOREST_BANDS - 1);

  const windows = React.useMemo(() => {
    const r = mulberry32(404);
    const out: { x: number; y: number; warm: boolean }[] = [];
    for (let y = facadeTop + 60; y < facadeBottom - 90; y += 150) {
      for (let i = 0; i < 6; i += 1) {
        out.push({ x: FX + 40 + i * ((FW - 110) / 5), y, warm: r() > 0.55 });
      }
    }
    return out;
  }, [facadeTop, facadeBottom]);

  return (
    <g>
      {/* Neighbouring stone trees, with the air between them the novel makes
          so much of: unfilled, unclimbable, with nothing in it at all. */}
      {[
        { x: -140, w: 380, top: bandTop(9) },
        { x: 1620, w: 420, top: bandTop(8) + 300 },
        { x: 150, w: 240, top: bandTop(6) },
        { x: 1500, w: 300, top: bandTop(5) + 200 },
      ].map((t, i) => (
        <g key={i} opacity={0.85}>
          <Rect x={t.x} y={t.top} w={t.w} h={facadeBottom - t.top} seed={600 + i} fill={PAPER.concreteDark} lift="deep" />
        </g>
      ))}

      {/* The facade itself. It begins where the canopy stops. */}
      <Rect x={FX} y={facadeTop} w={FW} h={facadeBottom - facadeTop} seed={500} fill={PAPER.concrete} lift="deep" />
      <Rect x={FX + FW * 0.66} y={facadeTop} w={FW * 0.34} h={facadeBottom - facadeTop} seed={501} fill={PAPER.concreteDark} lift="none" opacity={0.5} />
      {windows.map((wd, i) => (
        <Rect
          key={i}
          x={wd.x}
          y={wd.y}
          w={78}
          h={52}
          seed={520 + i}
          fill={wd.warm ? PAPER.glassWarm : PAPER.glassCold}
          lift="none"
          opacity={wd.warm ? 0.9 : 0.55}
        />
      ))}

      {/* ── Floor 3: the stone trees. No room: the arrival is the outside. */}

      {/* ── Floor 4: friends. A table, and people around it who stayed. */}
      <Room top={bandTop(4)} seed={640} glow="#f0cf94">
        <Rect x={FX + 260} y={bandTop(4) + 470} w={FW - 520} h={22} seed={641} fill={PAPER.bark} />
        <Rect x={FX + 300} y={bandTop(4) + 492} w={26} h={110} seed={642} fill={PAPER.barkDark} />
        <Rect x={FX + FW - 330} y={bandTop(4) + 492} w={26} h={110} seed={643} fill={PAPER.barkDark} />
        {[0, 1, 2, 3].map((i) => (
          <Figure key={i} x={FX + 250 + i * 160} y={bandTop(4) + 470} h={190} seed={650 + i * 3} fill={i % 2 ? PAPER.slate : "#6a5a7d"} />
        ))}
      </Room>

      {/* ── Floor 5: getting high. The room tips; the lights come apart. */}
      <Room top={bandTop(5)} seed={660} glow="#3d2c5a">
        {Array.from({ length: 26 }, (_, i) => {
          const r = mulberry32(700 + i);
          const a = frame / 30 + i;
          return (
            <Ell
              key={i}
              cx={FX + 160 + r() * (FW - 320) + Math.sin(a) * 26}
              cy={bandTop(5) + 250 + r() * 340 + Math.cos(a * 0.7) * 20}
              rx={10 + r() * 20}
              ry={10 + r() * 20}
              seed={710 + i}
              fill={i % 3 === 0 ? PAPER.emberLight : "#8f7fd6"}
              lift="soft"
              opacity={0.75}
            />
          );
        })}
      </Room>

      {/* ── Floor 6: the crossing. A window with somewhere else in it. */}
      <Room top={bandTop(6)} seed={670} glow="#9fc0d8">
        <Rect x={FX + 110} y={bandTop(6) + 470} w={FW - 220} h={220} seed={671} fill="#5b7fa6" lift="none" />
        {[0, 1, 2].map((i) => (
          <Poly
            key={i}
            points={[
              [FX + 200 + i * 240, bandTop(6) + 470],
              [FX + 320 + i * 240, bandTop(6) + 300],
              [FX + 440 + i * 240, bandTop(6) + 470],
            ]}
            seed={680 + i}
            fill={i === 1 ? "#e8eef3" : "#7d93ab"}
          />
        ))}
      </Room>

      {/* ── Floor 7: Otto. The one photograph in a film of drawings. */}
      <Room top={bandTop(7)} seed={690} glow="#e7dcc4">
        <OttoClipping x={FX + 180} y={bandTop(7) + 300} w={420} rotate={-3.5} hasPhoto={hasOttoPhoto} />
        <Figure x={FX + 800} y={bandTop(7) + 660} h={280} seed={695} fill={PAPER.slateDark} />
      </Room>

      {/* ── Floor 8: the paper. A desk, a lamp, and pages that keep coming. */}
      <Room top={bandTop(8)} seed={700} glow="#efd9a6">
        <Rect x={FX + 220} y={bandTop(8) + 520} w={FW - 440} h={20} seed={701} fill={PAPER.bark} />
        <Poly
          points={[
            [FX + 300, bandTop(8) + 520],
            [FX + 360, bandTop(8) + 380],
            [FX + 430, bandTop(8) + 380],
            [FX + 380, bandTop(8) + 520],
          ]}
          seed={702}
          fill={PAPER.sun}
          lift="soft"
        />
        {Array.from({ length: 7 }, (_, i) => (
          <Rect
            key={i}
            x={FX + 500 + (i % 3) * 90}
            y={bandTop(8) + 470 - Math.floor(i / 3) * 26}
            w={78}
            h={56}
            seed={710 + i}
            fill={PAPER.paperWhite}
            lift="soft"
          />
        ))}
      </Room>

      {/* ── Floor 9: the police. Headlights, and two of them getting out. */}
      <Room top={bandTop(9)} seed={720} glow="#232c3d">
        <Ell cx={FX + 300} cy={bandTop(9) + 480} rx={190} ry={130} seed={721} fill="#f2e3b8" lift="none" opacity={0.5} />
        <Ell cx={FX + 300} cy={bandTop(9) + 480} rx={80} ry={58} seed={722} fill="#fdf6df" lift="none" opacity={0.85} />
        <Figure x={FX + 620} y={bandTop(9) + 660} h={250} seed={730} fill="#0d121c" hat />
        <Figure x={FX + 760} y={bandTop(9) + 660} h={240} seed={734} fill="#0d121c" hat />
      </Room>

      {/* ── Floor 10: the airport. A room, a chair, and a clock that moves.
              The novel gives this scene in timestamps, so the film does too:
              the hand is the only thing in the room that changes. */}
      <Room top={bandTop(10)} seed={740} glow="#cfd6df">
        <Rect x={FX + 640} y={bandTop(10) + 480} w={120} h={140} seed={741} fill={PAPER.slateDark} />
        <Rect x={FX + 640} y={bandTop(10) + 460} w={120} h={26} seed={742} fill="#2f3646" lift="soft" />
        <Ell cx={FX + 330} cy={bandTop(10) + 400} rx={86} ry={86} seed={743} fill={PAPER.paperWhite} />
        {(() => {
          const a = (frame / 14) % (Math.PI * 2);
          return (
            <line
              x1={FX + 330}
              y1={bandTop(10) + 400}
              x2={FX + 330 + Math.sin(a) * 62}
              y2={bandTop(10) + 400 - Math.cos(a) * 62}
              stroke="#1b2230"
              strokeWidth={7}
              strokeLinecap="round"
            />
          );
        })()}
      </Room>

      {/* ── Floor 11: the shaving. A mirror, and what comes off him falling
              through the room as paper does, which is slowly. */}
      <Room top={bandTop(11)} seed={760} glow="#dfe4ea">
        <Rect x={FX + 250} y={bandTop(11) + 260} w={320} h={400} seed={761} fill="#aeb9c6" lift="deep" />
        <Rect x={FX + 268} y={bandTop(11) + 278} w={284} h={364} seed={762} fill="#e9eef3" lift="none" />
        {Array.from({ length: 22 }, (_, i) => {
          const r = mulberry32(800 + i);
          const drift = ((frame * 0.9 + i * 40) % 460);
          return (
            <Poly
              key={i}
              points={[
                [0, 0],
                [16 + r() * 10, -4],
                [12, 9],
                [-2, 7],
              ]}
              seed={810 + i}
              fill={PAPER.furDark}
              lift="soft"
              opacity={0.9}
            />
          );
        }).map((el, i) => {
          const r = mulberry32(900 + i);
          const drift = (frame * 0.9 + i * 40) % 460;
          return (
            <g
              key={i}
              transform={`translate(${FX + 300 + r() * 520} ${bandTop(11) + 250 + drift}) rotate(${drift * 1.6})`}
            >
              {el}
            </g>
          );
        })}
      </Room>
    </g>
  );
};
