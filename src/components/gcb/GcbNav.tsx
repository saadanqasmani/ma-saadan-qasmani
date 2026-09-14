import Link from "next/link";
import { GcbMark } from "@/components/gcb/Logo";

const tabs = [
  { href: "/gcb", label: "Home" },
  { href: "/gcb/equivalence", label: "Equivalence" },
  { href: "/gcb/match", label: "Match" },
  { href: "/gcb/costs", label: "Costs" },
  { href: "/gcb/apply", label: "How to apply" },
  { href: "/gcb/scholarships", label: "Scholarships" },
  { href: "/gcb/talk", label: "Talk" },
  { href: "/gcb/pricing", label: "Pricing" },
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
          <GcbMark size={26} />
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
