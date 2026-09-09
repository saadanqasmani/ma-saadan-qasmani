import React from "react";
import { cutEllipse, cutPath, cutRect, type Pt } from "./cut";

/**
 * The material.
 *
 * Everything in the film is a shape cut from paper and laid on top of what
 * came before, so three things have to be true of every element: the edge is
 * cut by hand, the surface has fibre in it, and it floats a little above the
 * layer beneath. The filters here do the second and third; cut.ts does the
 * first.
 */

export const PaperDefs: React.FC = () => (
  <defs>
    {/* Fibre. Paper is not flat colour: it is a mat of fibres that catches
        light unevenly, and a very low-frequency turbulence over the fill is
        enough to stop a shape reading as vector. */}
    <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} result="n" />
      <feColorMatrix in="n" type="saturate" values="0" result="ng" />
      <feComponentTransfer in="ng" result="nc">
        <feFuncA type="linear" slope="0.13" intercept="0" />
      </feComponentTransfer>
      <feComposite in="nc" in2="SourceGraphic" operator="in" result="grainOnly" />
      <feBlend in="SourceGraphic" in2="grainOnly" mode="multiply" />
    </filter>

    {/* The lift. A cut shape is never flush: it stands off the sheet under it
        by the thickness of the paper, and that shadow is most of what tells
        an eye it is looking at a cut-out. */}
    <filter id="lift" x="-25%" y="-25%" width="160%" height="160%">
      <feDropShadow dx="2.5" dy="4" stdDeviation="3.2" floodColor="#000" floodOpacity="0.34" />
    </filter>
    <filter id="liftSoft" x="-25%" y="-25%" width="160%" height="160%">
      <feDropShadow dx="1.4" dy="2.2" stdDeviation="2" floodColor="#000" floodOpacity="0.22" />
    </filter>
    <filter id="liftDeep" x="-30%" y="-30%" width="180%" height="180%">
      <feDropShadow dx="5" dy="9" stdDeviation="7" floodColor="#000" floodOpacity="0.4" />
    </filter>

    {/* Newsprint. A photograph in a cut-out film is a clipping: screened into
        dots, greyed, and slightly yellowed by age. */}
    <filter id="newsprint" x="0%" y="0%" width="100%" height="100%">
      <feColorMatrix type="saturate" values="0" result="g" />
      <feComponentTransfer in="g" result="c">
        <feFuncR type="linear" slope="1.15" intercept="-0.06" />
        <feFuncG type="linear" slope="1.12" intercept="-0.05" />
        <feFuncB type="linear" slope="0.98" intercept="-0.02" />
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={3} result="dots" />
      <feColorMatrix in="dots" type="saturate" values="0" result="dg" />
      <feComponentTransfer in="dg" result="dc">
        <feFuncA type="linear" slope="0.3" />
      </feComponentTransfer>
      <feComposite in="dc" in2="c" operator="in" result="screen" />
      <feBlend in="c" in2="screen" mode="multiply" />
    </filter>
  </defs>
);

type ShapeProps = {
  d: string;
  fill: string;
  lift?: "none" | "soft" | "normal" | "deep";
  opacity?: number;
  grain?: boolean;
};

const LIFT = { none: undefined, soft: "url(#liftSoft)", normal: "url(#lift)", deep: "url(#liftDeep)" };

/** One piece of paper. */
export const Piece: React.FC<ShapeProps> = ({ d, fill, lift = "normal", opacity, grain = true }) => (
  <g filter={LIFT[lift]}>
    <path d={d} fill={fill} opacity={opacity} filter={grain ? "url(#grain)" : undefined} />
  </g>
);

/** A piece cut as a polygon. */
export const Poly: React.FC<Omit<ShapeProps, "d"> & { points: Pt[]; seed: number; wobble?: number }> = ({
  points,
  seed,
  wobble,
  ...rest
}) => <Piece d={cutPath(points, seed, wobble)} {...rest} />;

/** A piece cut as a rectangle. */
export const Rect: React.FC<
  Omit<ShapeProps, "d"> & { x: number; y: number; w: number; h: number; seed: number; wobble?: number }
> = ({ x, y, w, h, seed, wobble, ...rest }) => <Piece d={cutRect(x, y, w, h, seed, wobble)} {...rest} />;

/** A piece cut as an ellipse. */
export const Ell: React.FC<
  Omit<ShapeProps, "d"> & {
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    seed: number;
    wobble?: number;
    sides?: number;
  }
> = ({ cx, cy, rx, ry, seed, wobble, sides, ...rest }) => (
  <Piece d={cutEllipse(cx, cy, rx, ry, seed, wobble, sides)} {...rest} />
);
