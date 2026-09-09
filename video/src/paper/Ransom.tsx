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

/**
 * One sheet, not all of them.
 *
 * The first sheet's letters are dark and heavily distressed, and against the
 * film's night sky they simply disappear. This one is high contrast on
 * saturated tiles and holds up on any ground in the film.
 */
const SHEET = "b";
const ALL = INDEX as Record<string, Glyph[]>;
const GLYPHS: Record<string, Glyph[]> = Object.fromEntries(
  Object.entries(ALL).map(([ch, list]) => {
    const preferred = list.filter((g) => g.file.startsWith(`${SHEET}-`));
    return [ch, preferred.length ? preferred : list];
  })
);

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
  /**
   * Sets the first letter of every word full size and the rest smaller, so a
   * word reads as Title Case even though the sheet only carries capitals.
   */
  titleCase?: boolean;
};

export const Ransom: React.FC<RansomProps> = ({
  text,
  x,
  y,
  size = 120,
  seed = 1,
  reveal = 1,
  rotate = 0,
  titleCase = false,
}) => {
  const laid = React.useMemo(() => {
    const rand = mulberry32(seed);
    const chars = text.toUpperCase().split("");
    const starts = new Set<number>();
    let atWordStart = true;
    chars.forEach((c, i) => {
      if (c === " ") {
        atWordStart = true;
        return;
      }
      if (atWordStart) starts.add(i);
      atWordStart = false;
    });
    let cursor = 0;

    const items = chars.map((ch, i) => {
      const variants = GLYPHS[ch];
      // Letters are not all the same size on the sheet, and they should not
      // be: a word cut from a magazine has letters that disagree.
      const cap = titleCase && !starts.has(i) ? 0.72 : 1;
      const s = size * cap * (0.9 + rand() * 0.22);

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
  }, [text, seed, size, titleCase]);

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
