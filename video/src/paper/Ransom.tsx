import React from "react";
import { staticFile } from "remotion";
import { cutPath, mulberry32 } from "./cut";
import INDEX from "../../public/letters/index.json";

/**
 * Cut lettering.
 *
 * The letters are real: Saadan supplied ransom-alphabet sheets, and
 * score/letters.py cuts each glyph off its sheet into its own transparent
 * png, keeping the paper tile it was printed on. So a word here is genuinely
 * assembled out of separate scraps rather than typeset and distressed.
 *
 * Anything the alphabet does not carry — a colon, a digit — falls back to a
 * plain cut scrap with the character set on it, so a label can say 02:11
 * without needing a second sheet.
 */

type Glyph = { file: string; w: number; h: number };
const GLYPHS = INDEX as Record<string, Glyph[]>;

const FALLBACK_STOCK = [
  { paper: "#f0e9d8", ink: "#1b1710" },
  { paper: "#1b1710", ink: "#f2ece0" },
  { paper: "#c2430f", ink: "#fdf3e3" },
] as const;

export type RansomProps = {
  text: string;
  /** Centre of the word, in world units. */
  x: number;
  y: number;
  /** Cap height the letters are scaled to. */
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
  const laid = React.useMemo(() => {
    const rand = mulberry32(seed);
    const chars = text.toUpperCase().split("");
    let cursor = 0;

    const items = chars.map((ch, i) => {
      const variants = GLYPHS[ch];
      // Letters are not all the same size on the sheet, and they should not
      // be: a word cut from a magazine has letters that disagree.
      const s = size * (0.86 + rand() * 0.3);

      if (ch === " ") {
        const w = size * 0.36;
        const item = { kind: "space" as const, i, w, cx: cursor + w / 2 };
        cursor += w;
        return item;
      }

      if (variants && variants.length) {
        const g = variants[Math.floor(rand() * variants.length)];
        const h = s;
        const w = (g.w / g.h) * h;
        const item = {
          kind: "glyph" as const,
          i,
          file: g.file,
          w,
          h,
          cx: cursor + w / 2,
          tilt: (rand() - 0.5) * 12,
          dy: (rand() - 0.5) * size * 0.15,
        };
        cursor += w + size * 0.03;
        return item;
      }

      const stock = FALLBACK_STOCK[Math.floor(rand() * FALLBACK_STOCK.length)];
      const w = s * 0.56;
      const item = {
        kind: "set" as const,
        i,
        ch,
        stock,
        s,
        w,
        cx: cursor + w / 2,
        tilt: (rand() - 0.5) * 12,
        dy: (rand() - 0.5) * size * 0.15,
        seed: seed * 71 + i,
      };
      cursor += w + size * 0.03;
      return item;
    });

    return { items, total: cursor, count: chars.length };
  }, [text, seed, size]);

  return (
    <g
      transform={`translate(${x - laid.total / 2} ${y}) rotate(${rotate} ${laid.total / 2} 0)`}
    >
      {laid.items.map((it) => {
        if (it.kind === "space") return null;

        // Each letter lands in turn, dropping the last of the way in.
        const at = (it.i / Math.max(1, laid.count)) * 0.72;
        const p = Math.max(0, Math.min(1, (reveal - at) / 0.26));
        if (p <= 0) return null;

        const drop = (1 - p) * -size * 0.55;
        const spin = it.tilt * (0.4 + (1 - p) * 1.8);

        if (it.kind === "glyph") {
          return (
            <g
              key={it.i}
              transform={`translate(${it.cx} ${it.dy + drop}) rotate(${spin})`}
              opacity={p}
            >
              <g filter="url(#lift)">
                <image
                  href={staticFile(`letters/${it.file}`)}
                  x={-it.w / 2}
                  y={-it.h / 2}
                  width={it.w}
                  height={it.h}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>
          );
        }

        const hw = it.w / 2 + it.s * 0.12;
        const hh = it.s * 0.5 + it.s * 0.1;
        return (
          <g
            key={it.i}
            transform={`translate(${it.cx} ${it.dy + drop}) rotate(${spin})`}
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
                  it.seed,
                  2.4
                )}
                fill={it.stock.paper}
                filter="url(#grain)"
              />
            </g>
            <text
              x={0}
              y={it.s * 0.34}
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize={it.s}
              fontWeight={700}
              fill={it.stock.ink}
            >
              {it.ch}
            </text>
          </g>
        );
      })}
    </g>
  );
};
