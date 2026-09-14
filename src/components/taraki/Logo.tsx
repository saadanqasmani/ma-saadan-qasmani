/**
 * Taraki.
 *
 * Taraqi is progress. Tara is a star. The mark is both: a star, and the
 * trail of a star going up.
 *
 * Every shooting star anyone has ever drawn is falling. This one is
 * climbing, and the trail is behind and below it rather than above, which
 * is the whole difference and the whole point.
 *
 * Drawn, animated by CSS in taraki.css, and monochrome by default so it
 * sits on any ground. `animate` sends it up; without it the mark is simply
 * there.
 */
export function TarakiMark({
  size = 28,
  animate = false,
}: {
  size?: number;
  animate?: boolean;
}) {
  const cls = animate ? "tk-mark tk-mark--rise" : "tk-mark";
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" className={cls} aria-hidden>
      {/* The trail, shortening and fading toward where it came from. */}
      <g className="tk-mark__trail" stroke="var(--accent, currentColor)" strokeLinecap="round">
        <path d="M14.5 25.5L8 32" strokeWidth="3" opacity="0.9" />
        <path d="M9 24.5L4.5 29" strokeWidth="2.2" opacity="0.5" />
        <path d="M19 30L15.5 33.5" strokeWidth="2" opacity="0.35" />
      </g>

      {/* The star itself. */}
      <path className="tk-mark__star" d="M 26.00 2.50 L 28.70 10.28 L 36.94 10.45 L 30.37 15.42 L 32.76 23.30 L 26.00 18.60 L 19.24 23.30 L 21.63 15.42 L 15.06 10.45 L 23.30 10.28 Z" fill="currentColor" />

      {/* Two more, because one star is a shape and three are a sky. */}
      <path className="tk-mark__spark tk-mark__spark--a" d="M 9.50 4.60 L 10.29 6.91 L 12.73 6.95 L 10.78 8.42 L 11.50 10.75 L 9.50 9.35 L 7.50 10.75 L 8.22 8.42 L 6.27 6.95 L 8.71 6.91 Z" fill="var(--accent, currentColor)" opacity="0.85" />
      <path className="tk-mark__spark tk-mark__spark--b" d="M 14.00 25.10 L 14.56 26.73 L 16.28 26.76 L 14.90 27.79 L 15.41 29.44 L 14.00 28.45 L 12.59 29.44 L 13.10 27.79 L 11.72 26.76 L 13.44 26.73 Z" fill="var(--accent, currentColor)" opacity="0.6" />
    </svg>
  );
}

/** The mark and the name, as the company signs itself. */
export function TarakiWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
      <TarakiMark size={compact ? 24 : 30} />
      <span
        style={{
          fontFamily: "var(--tk-font-display), system-ui, sans-serif",
          fontWeight: 600,
          fontSize: compact ? "0.95rem" : "1.0625rem",
          letterSpacing: "-0.01em",
        }}
      >
        Taraki
      </span>
    </span>
  );
}
