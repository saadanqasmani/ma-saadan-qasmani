/**
 * Global Career Bridge.
 *
 * A bridge whose span does not come back down. Two piers, an arch, and the
 * deck climbing away to the right and lifting off it — crossing, and going
 * up, which is the whole promise in one shape.
 *
 * Drawn, animated by CSS in gcb.css, and monochrome by default so it sits on
 * any ground. `animate` draws it in; without it the mark is simply there.
 */
export function GcbMark({
  size = 28,
  animate = false,
}: {
  size?: number;
  animate?: boolean;
}) {
  const cls = animate ? "gcb-mark gcb-mark--draw" : "gcb-mark";
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      className={cls}
      aria-hidden
    >
      {/* The arch */}
      <path
        className="gcb-mark__arch"
        d="M4 28C4 16.4 11.2 9 20 9s16 7.4 16 19"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* The piers, shortening as the deck rises */}
      <g className="gcb-mark__piers" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45">
        <path d="M11 28v-6.4" />
        <path d="M20 28v-9" />
        <path d="M29 28v-6.4" />
      </g>
      {/* The deck, and the climb off the end of it */}
      <path
        className="gcb-mark__deck"
        d="M2 28h27l7-7"
        stroke="var(--accent, currentColor)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="gcb-mark__tip"
        d="M30.5 21H36v5.5"
        stroke="var(--accent, currentColor)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The mark and the name, as the product signs itself. */
export function GcbWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
      <GcbMark size={compact ? 24 : 30} />
      {compact ? (
        <span className="gcb-label" style={{ fontSize: "0.8125rem", letterSpacing: "0.2em" }}>
          GCB
        </span>
      ) : (
        <span
          style={{
            fontFamily: "var(--gcb-display), system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "1.0625rem",
            letterSpacing: "-0.02em",
          }}
        >
          Global Career Bridge
        </span>
      )}
    </span>
  );
}
