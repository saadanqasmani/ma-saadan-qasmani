import React from "react";
import { staticFile } from "remotion";
import { PAPER } from "./palette";
import { Piece } from "./Paper";
import { cutEllipse, cutPath } from "./cut";

/**
 * Otto.
 *
 * Everyone else in the film is drawn. Otto is a collage: a tall man cut from
 * paper, with a photographed face scissored out of a page and pasted onto the
 * head. That is the right way round for him — the body belongs to the film's
 * material, and the face is the one thing in it that is real.
 *
 * The face is public/otto-face.png, built by score/ottoface.py: a screened
 * head with a hand-cut alpha edge, so it arrives already scissored and needs
 * no clip path here.
 *
 * The photograph is Dr. Osman Gültekin, used with his consent.
 */

export const Otto: React.FC<{
  x: number;
  y: number;
  /** Height from the sole to the crown, in world units. */
  h?: number;
  rotate?: number;
  hasFace?: boolean;
  /** A slow shift of weight, so he is standing rather than pinned. */
  phase?: number;
}> = ({ x, y, h = 520, rotate = 0, hasFace = true, phase = 0 }) => {
  // He is the tall one. Proportions are stretched a little past a real man's,
  // which is what a cut-out does with a person everyone describes as tall.
  const headR = h * 0.135;
  const shoulder = h * 0.27;
  const hip = h * 0.55;
  const halfW = h * 0.115;

  const lean = Math.sin(phase) * 1.1;

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate + lean})`}>
      {/* Legs, cut as one piece each so the trouser reads as cloth */}
      <Piece
        d={cutPath(
          [
            [-halfW * 0.82, -hip],
            [-halfW * 0.12, -hip],
            [-halfW * 0.2, 0],
            [-halfW * 0.9, 0],
          ],
          931,
          1.3
        )}
        fill={PAPER.slateDark}
      />
      <Piece
        d={cutPath(
          [
            [halfW * 0.12, -hip],
            [halfW * 0.82, -hip],
            [halfW * 0.9, 0],
            [halfW * 0.2, 0],
          ],
          932,
          1.3
        )}
        fill={PAPER.slate}
      />
      {/* Shoes: blunt, and shod, which is the first thing the forest notices */}
      <Piece d={cutEllipse(-halfW * 0.5, 2, halfW * 0.62, h * 0.022, 933, 1)} fill="#15110f" lift="soft" />
      <Piece d={cutEllipse(halfW * 0.5, 2, halfW * 0.62, h * 0.022, 934, 1)} fill="#15110f" lift="soft" />

      {/* The coat: shoulders wider than the hips, and long */}
      <Piece
        d={cutPath(
          [
            [-halfW * 1.16, -shoulder],
            [halfW * 1.16, -shoulder],
            [halfW * 0.98, -hip * 0.42],
            [halfW * 0.86, -hip * 0.05],
            [-halfW * 0.86, -hip * 0.05],
            [-halfW * 0.98, -hip * 0.42],
          ],
          935,
          1.5
        )}
        fill={PAPER.slateDark}
        lift="normal"
      />
      {/* A shirt showing in the opening */}
      <Piece
        d={cutPath(
          [
            [-halfW * 0.2, -shoulder + 4],
            [halfW * 0.2, -shoulder + 4],
            [halfW * 0.13, -hip * 0.5],
            [-halfW * 0.13, -hip * 0.5],
          ],
          936,
          0.9
        )}
        fill={PAPER.paperWhite}
        lift="none"
      />
      {/* Lapels */}
      <Piece
        d={cutPath(
          [
            [-halfW * 1.1, -shoulder],
            [-halfW * 0.1, -shoulder + 8],
            [-halfW * 0.3, -hip * 0.46],
            [-halfW * 0.98, -hip * 0.52],
          ],
          937,
          1
        )}
        fill={PAPER.slate}
        lift="soft"
      />
      <Piece
        d={cutPath(
          [
            [halfW * 1.1, -shoulder],
            [halfW * 0.1, -shoulder + 8],
            [halfW * 0.3, -hip * 0.46],
            [halfW * 0.98, -hip * 0.52],
          ],
          938,
          1
        )}
        fill={PAPER.slate}
        lift="soft"
      />

      {/* Arms, hanging */}
      <Piece
        d={cutPath(
          [
            [-halfW * 1.14, -shoulder + 4],
            [-halfW * 0.74, -shoulder + 4],
            [-halfW * 0.86, -hip * 0.24],
            [-halfW * 1.22, -hip * 0.26],
          ],
          939,
          1.2
        )}
        fill={PAPER.slateDark}
      />
      <Piece
        d={cutPath(
          [
            [halfW * 0.74, -shoulder + 4],
            [halfW * 1.14, -shoulder + 4],
            [halfW * 1.22, -hip * 0.26],
            [halfW * 0.86, -hip * 0.24],
          ],
          940,
          1.2
        )}
        fill={PAPER.slateDark}
      />

      {/* Neck, then the pasted face over it */}
      <Piece
        d={cutPath(
          [
            [-headR * 0.34, -shoulder - 2],
            [headR * 0.34, -shoulder - 2],
            [headR * 0.3, -shoulder - headR * 0.7],
            [-headR * 0.3, -shoulder - headR * 0.7],
          ],
          941,
          0.8
        )}
        fill="#c9a887"
        lift="none"
      />
      {hasFace ? (
        <g filter="url(#lift)" transform={`rotate(-2.5 0 ${-shoulder - headR})`}>
          {/* Already scissored in the asset: no clip path, and no filter, so
              the screen stays the size it was printed at. */}
          <image
            href={staticFile("otto-face.png")}
            x={-headR * 1.02}
            y={-shoulder - headR * 2.24}
            width={headR * 2.04}
            height={headR * 2.2}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      ) : (
        <Piece d={cutEllipse(0, -shoulder - headR, headR, headR * 1.08, 942, 1.4)} fill="#c9b299" />
      )}
    </g>
  );
};
