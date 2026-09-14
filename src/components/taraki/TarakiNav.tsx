import Link from "next/link";
import { TarakiMark } from "@/components/taraki/Logo";
import { ThemeToggle } from "@/components/taraki/ThemeToggle";

const tabs = [
  { href: "/taraki", label: "Home" },
  { href: "/taraki/equivalence", label: "Equivalence" },
  { href: "/taraki/plan", label: "My plan" },
  { href: "/taraki/match", label: "Match" },
  { href: "/taraki/costs", label: "Costs" },
  { href: "/taraki/apply", label: "How to apply" },
  { href: "/taraki/scholarships", label: "Scholarships" },
  { href: "/taraki/talk", label: "Talk" },
  { href: "/taraki/school", label: "Your school" },
  { href: "/taraki/pricing", label: "Pricing" },
  { href: "/taraki/contact", label: "Contact" },
];

export function TarakiNav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="tk-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          height: "68px",
        }}
      >
        <Link href="/taraki" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <TarakiMark size={26} />
          <span
            style={{
              fontFamily: "var(--tk-font-display), system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            Taraki
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", overflowX: "auto" }}>
          <ThemeToggle />
          {tabs.slice(1).map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="tk-small"
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
