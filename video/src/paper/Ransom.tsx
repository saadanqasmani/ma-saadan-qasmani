import React from "react";
import { PAPER } from "./palette";
import { cutPath, mulberry32 } from "./cut";

/**
 * Cut lettering.
 *
 * Every letter is its own scrap: its own paper, its own ink, its own
 * typeface, cut out and laid down at whatever angle the hand left it. That is
 * how a word gets made in a cut-out film, and it is the one place the film is
 * allowed to be loud.
 *
 * The scraps are generated rather than lifted from real magazines. A film
 * that will be published cannot carry pieces of someone else's printed page,
 * and it does not need to: what makes the look is the disagreement between
 * the letters, not the provenance of the paper.
 */

/** Stocks a letter might have been cut from. */
const STOCKS = [
  { paper: "#f0e9d8", ink: "#1b1710" }, // newsprint
  { paper: "#e6dcc4", ink: "#241d14" }, // aged newsprint
  { paper: "#1b1710", ink: "#f2ece0" }, // reversed out of a headline
  { paper: "#c2430f", ink: "#fdf3e3" }, // a colour page
  { paper: "#2f4f86", ink: "#f4efe2" },
  { paper: "#e8a552", ink: "#20180f" },
  { paper: "#f7f2e6", ink: "#7a2907" },
] as const;

const FACES = [
  "Georgia, serif",
  "'Times New Roman', serif",
  "Impact, 'Arial Black', sans-serif",
  "'Courier New', monospace",
  "Verdana, sans-serif",
  "'Arial Black', sans-serif",
] as const;

export type RansomProps = {
  text: string;
  /** Centre of the word, in world units. */
  x: number;
  y: number;
  size?: number;
  seed?: number;
  /** 0 to 1. Letters are laid down in order as this rises. */
  reveal?: number;
  rotate?: number;
};

export const Ransom: React.FC<RansomProps> = ({
  text,
  x,
  y,
  size = 120,
  seed = 1,
  reveal = 1,
  rotate = 0,
}) => {
  const chars = text.split("");

  // Widths are guessed rather than measured: measuring text in SVG needs the
  // DOM, and a cut-out word does not want even spacing anyway.
  const letters = React.useMemo(() => {
    const rand = mulberry32(seed);
    let cursor = 0;
    const out = chars.map((ch, i) => {
      const stock = STOCKS[Math.floor(rand() * STOCKS.length)];
      const face = FACES[Math.floor(rand() * FACES.length)];
      const s = size * (0.82 + rand() * 0.36);
      const w = ch === " " ? size * 0.34 : s * (0.62 + rand() * 0.16);
      const item = {
        ch,
        i,
        stock,
        face,
        s,
        w,
        cx: cursor + w / 2,
        tilt: (rand() - 0.5) * 13,
        dy: (rand() - 0.5) * size * 0.16,
        padX: s * (0.1 + rand() * 0.1),
        padY: s * (0.09 + rand() * 0.09),
        seed: seed * 97 + i * 13,
      };
      cursor += w + size * 0.045;
      return item;
    });
    return { out, total: cursor };
  }, [chars, seed, size]);

  return (
    <g transform={`translate(${x - letters.total / 2} ${y}) rotate(${rotate} ${letters.total / 2} 0)`}>
      {letters.out.map((l) => {
        if (l.ch === " ") return null;
        // Each letter lands in turn, dropping the last of the way in.
        const at = (l.i / Math.max(1, chars.length)) * 0.72;
        const p = Math.max(0, Math.min(1, (reveal - at) / 0.26));
        if (p <= 0) return null;

        const hw = l.w / 2 + l.padX;
        const hh = l.s * 0.5 + l.padY;

        return (
          <g
            key={l.i}
            transform={`translate(${l.cx} ${l.dy + (1 - p) * -size * 0.5}) rotate(${l.tilt * (0.4 + (1 - p) * 1.6)})`}
            opacity={p}
          >
            <g filter="url(#lift)">
              <path
                d={cutPath(
                  [
                    [-hw, -hh],
                    [hw, -hh],
                    [hw, hh],
                    [-hw, hh],
                  ],
                  l.seed,
                  2.4
                )}
                fill={l.stock.paper}
                filter="url(#grain)"
              />
            </g>
            <text
              x={0}
              y={l.s * 0.35}
              textAnchor="middle"
              fontFamily={l.face}
              fontSize={l.s}
              fontWeight={700}
              fill={l.stock.ink}
            >
              {l.ch}
            </text>
          </g>
        );
      })}
    </g>
  );
};
