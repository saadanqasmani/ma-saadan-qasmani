import React from "react";
import { staticFile } from "remotion";
import { PAPER } from "./palette";
import { Piece } from "./Paper";
import { cutPath, mulberry32 } from "./cut";

/**
 * Otto, as a clipping.
 *
 * Everyone else in this film is drawn. Otto is a photograph, screened into
 * newsprint and torn out of a page, because that is what he is to Sultan by
 * the time they meet: a name that arrived in print before the man did.
 *
 * The photograph is Dr. Osman Gültekin, at Saadan's request. It goes in
 * public/otto.jpg. Until that file exists the clipping renders as an empty
 * torn frame rather than a stand-in face, so nothing is invented here.
 */

/** A torn edge, which is not a cut edge: it is rougher and it has fibre. */
function tornRect(w: number, h: number, seed: number) {
  const rand = mulberry32(seed);
  const pts: [number, number][] = [];
  const step = 14;
  const jag = () => (rand() - 0.5) * 9;
  for (let x = 0; x <= w; x += step) pts.push([x, jag()]);
  for (let y = 0; y <= h; y += step) pts.push([w + jag(), y]);
  for (let x = w; x >= 0; x -= step) pts.push([x, h + jag()]);
  for (let y = h; y >= 0; y -= step) pts.push([jag(), y]);
  return cutPath(pts, seed + 1, 1.1, 999);
}

export const OttoClipping: React.FC<{
  x: number;
  y: number;
  w?: number;
  scale?: number;
  rotate?: number;
  hasPhoto?: boolean;
}> = ({ x, y, w = 260, scale = 1, rotate = -3, hasPhoto = true }) => {
  const h = w * 1.24;
  const photoH = h * 0.66;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {/* The paper of the page */}
      <g filter="url(#liftDeep)">
        <path d={tornRect(w, h, 909)} fill={PAPER.ledger} filter="url(#grain)" />
      </g>

      {hasPhoto ? (
        <g clipPath="url(#otto-clip)">
          {/* An SVG image element rather than Remotion's Img: this lives
              inside the scene's svg, where an HTML img cannot be placed. */}
          <image
            href={staticFile("otto.jpg")}
            x={12}
            y={14}
            width={w - 24}
            height={photoH}
            preserveAspectRatio="xMidYMin slice"
            filter="url(#newsprint)"
          />
        </g>
      ) : (
        <rect x={12} y={14} width={w - 24} height={photoH} fill="#cfc6b0" />
      )}

      {/* Column rules under the photograph. A clipping is mostly type, and at
          this size type is texture, so it is drawn as rules rather than set. */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={14}
          y={photoH + 30 + i * 11}
          width={(w - 30) * (i === 8 ? 0.52 : 0.94 - (i % 3) * 0.04)}
          height={3.4}
          fill="#8d8574"
          opacity={0.75}
        />
      ))}
    </g>
  );
};

/** The clip path the photograph is trimmed to. Declared once, near the defs. */
export const OttoClipDef: React.FC<{ w?: number }> = ({ w = 260 }) => (
  <clipPath id="otto-clip">
    <path d={cutPath(
      [
        [12, 14],
        [w - 12, 14],
        [w - 12, 14 + w * 1.24 * 0.66],
        [12, 14 + w * 1.24 * 0.66],
      ],
      77,
      2.2
    )} />
  </clipPath>
);
