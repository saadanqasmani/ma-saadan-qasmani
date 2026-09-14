import Link from "next/link";

const tabs = [
  { href: "/gcb", label: "Home" },
  { href: "/gcb/match", label: "Match" },
  { href: "/gcb/costs", label: "Costs" },
  { href: "/gcb/apply", label: "How to apply" },
  { href: "/gcb/scholarships", label: "Scholarships" },
  { href: "/gcb/talk", label: "Talk to someone" },
];

export function GcbNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "rgba(5, 7, 13, 0.72)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="gcb-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          height: "68px",
        }}
      >
        <Link href="/gcb" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Bridge />
          <span
            className="gcb-label"
            style={{ letterSpacing: "0.22em", fontSize: "0.8125rem" }}
          >
            GCB
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", overflowX: "auto" }}>
          {tabs.slice(1).map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="gcb-small"
              style={{
                whiteSpace: "nowrap",
                padding: "0.5rem 0.8rem",
                borderRadius: "8px",
                color: "var(--text-soft)",
              }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

/** Two banks and a span. Drawn, so there is no logo file to commission yet. */
function Bridge() {
  return (
    <svg viewBox="0 0 28 28" width="24" height="24" aria-hidden>
      <path d="M2 19h24" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M4 19c0-7 7-11 10-11s10 4 10 11"
        fill="none"
        stroke="var(--text)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M9 19v-5M14 19v-7M19 19v-5" stroke="var(--text-faint)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
