"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { EdvikoMark } from "@/components/edviko/Logo";
import { ThemeToggle } from "@/components/edviko/ThemeToggle";
import { write } from "@/lib/edviko/browserStore";
import { navFor, ROLES, ROLE_KEY, roleMeta, type Role } from "@/lib/edviko/roles";

/**
 * The frame the advisor and campus screens live in.
 *
 * A sidebar, because these lists are twelve and fourteen items long and a
 * top bar that long is an inventory rather than a navigation. It is fixed
 * on a phone and sticky on a laptop, and the sections that are not built yet
 * are in the list, greyed, rather than hidden: a person deciding whether to
 * buy this should be able to see the shape of the whole thing, and a person
 * using it should never click into a half-working screen.
 *
 * The role switch at the bottom is not a login. There are no accounts yet,
 * and the panel says so rather than implying a security boundary that does
 * not exist.
 */
export function Portal({
  role,
  who,
  children,
}: {
  role: Role;
  who: { name: string; line: string; code: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = navFor(role);
  const meta = roleMeta(role);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="ev-portal">
      {open && <div className="ev-scrim" onClick={() => setOpen(false)} aria-hidden />}

      <aside className="ev-side" data-open={open}>
        <Link href="/edviko" className="ev-side__brand">
          <EdvikoMark size={24} />
          <span className="ev-font-display" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Edviko</span>
        </Link>

        <div className="ev-side__who">
          <p className="ev-label" style={{ color: "var(--accent)" }}>{meta.label}</p>
          <p style={{ fontWeight: 600, marginTop: "0.35rem" }}>{who.name}</p>
          <p className="ev-small" style={{ color: "var(--text-faint)" }}>{who.line}</p>
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.35rem", fontVariantNumeric: "tabular-nums" }}>
            {who.code}
          </p>
        </div>

        <nav style={{ display: "grid", gap: "0.15rem" }}>
          {items.map((item) => {
            const on = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="ev-side__link"
                data-on={on}
                data-soon={!item.built}
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                {!item.built && <span className="ev-small" style={{ opacity: 0.7 }}>soon</span>}
              </Link>
            );
          })}
        </nav>

        <div className="ev-side__foot">
          <p className="ev-label" style={{ color: "var(--text-faint)" }}>Looking as</p>
          <div style={{ display: "grid", gap: "0.2rem", marginTop: "0.5rem" }}>
            {ROLES.map((r) => (
              <Link
                key={r.id}
                href={r.home}
                onClick={() => write(ROLE_KEY, r.id)}
                className="ev-side__link"
                data-on={r.id === role}
                style={{ fontSize: "0.875rem" }}
              >
                {r.label}
              </Link>
            ))}
          </div>
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.75rem" }}>
            A view, not an account. Nobody has signed in yet, and nothing here is private until they can.
          </p>
        </div>
      </aside>

      <main className="ev-portal__main">
        <div className="ev-top">
          <button
            type="button"
            className="ev-top__burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close the menu" : "Open the menu"}
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
          <p className="ev-small" style={{ color: "var(--text-faint)", flex: 1 }}>{meta.question}</p>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
