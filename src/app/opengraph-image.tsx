import { ImageResponse } from "next/og";
import { getPerson } from "@/lib/data";

/**
 * The image that appears when the site is pasted into WhatsApp, LinkedIn, X
 * or Slack. Without one, every share renders as a blank grey rectangle.
 *
 * Drawn with plain layout boxes rather than SVG: this runs inside a
 * constrained renderer, so only simple block layout is dependable.
 *
 * The display face is fetched rather than bundled, and every failure path
 * falls back to the renderer's built-in font. A share image is not worth
 * failing a deployment over.
 */

export const alt = "Saadan Qasmani";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#f2ede3";
const INK = "#15140f";
const INK_SOFT = "#55503f";
const AZURE = "#163fa8";
const EMBER = "#c2430f";
const VERDANT = "#0f6b42";

/**
 * Instrument Serif is the site's display face. The renderer needs real font
 * bytes and cannot read woff2, so this asks Google for the CSS with an
 * ancient user agent, which is the documented way to be served plain TTF.
 * Returns null on any failure, including a build with no network.
 */
async function displayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
      { headers: { "User-Agent": "Mozilla/4.0" } }
    ).then((r) => (r.ok ? r.text() : ""));

    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;

    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [person, font] = await Promise.all([getPerson(), displayFont()]);
  const display = font ? { fontFamily: "Instrument Serif" } : {};

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", height: 6, width: 180, background: EMBER }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              ...display,
              fontSize: font ? 132 : 104,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 38,
              lineHeight: 1.25,
              color: INK_SOFT,
              maxWidth: 880,
            }}
          >
            {person.positioning}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 22, height: 22, background: AZURE }} />
          <div style={{ display: "flex", width: 22, height: 22, background: EMBER }} />
          <div style={{ display: "flex", width: 22, height: 22, background: VERDANT }} />
          <div
            style={{
              marginLeft: 12,
              fontSize: 26,
              letterSpacing: "0.16em",
              color: INK_SOFT,
            }}
          >
            SAADANQASMANI.SPACE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Instrument Serif", data: font, style: "normal" as const, weight: 400 as const }]
        : [],
    }
  );
}
