"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TarakiMark } from "@/components/taraki/Logo";
import { ThemeToggle } from "@/components/taraki/ThemeToggle";
import { AuthPanel, useAccount } from "@/components/taraki/Account";

/**
 * Four places, and everything else behind a menu.
 *
 * It was eleven tabs in a row, which on a phone meant scrolling sideways
 * through a list with no shape to it. Eleven equal things are not a
 * navigation, they are an inventory, and a reader faced with one does not
 * know where to begin.
 *
 * These four are the questions a student actually arrives with, in the order
 * they arrive: what are my grades worth, where could I go, what do I do now,
 * and can someone help me. Everything else is real but secondary, and lives
 * in the menu where it can be found rather than in the way.
 */

const PRIMARY = [
  { href: "/taraki/career", label: "My career", hint: "Four questions. Start here, before universities." },
  { href: "/taraki/equivalence", label: "My grades", hint: "Convert O Level, A Level, Matric, FSc or IB" },
  { href: "/taraki/match", label: "Universities", hint: "141 of them, across twelve countries" },
  { href: "/taraki/plan", label: "Wish list", hint: "The universities you are going for" },
];

const SECONDARY = [
  { href: "/taraki/profile", label: "My record" },
  { href: "/taraki/costs", label: "What it costs" },
  { href: "/taraki/talk", label: "Get help" },
  { href: "/taraki/apply", label: "How to apply" },
  { href: "/taraki/scholarships", label: "Scholarships" },
  { href: "/taraki/pricing", label: "Pricing" },
  { href: "/taraki/contact", label: "Contact" },
];

export function TarakiNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const account = useAccount();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setLogin(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Above the menu while it is open, or the button that closes it is
          underneath the thing it closes. */}
      <header className="tk-header" style={open ? { zIndex: 80 } : undefined}>
        <div className="tk-shell tk-header__row">
          <Link href="/taraki" className="tk-header__brand">
            <TarakiMark size={26} />
            <span className="tk-header__name">Taraki Company</span>
          </Link>

          {/* Desktop: the four. */}
          <nav className="tk-header__links">
            {PRIMARY.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="tk-navlink"
                data-on={pathname.startsWith(t.href)}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="tk-header__right">
            <ThemeToggle />
            {account ? (
              <Link href="/taraki/profile" className="tk-login">
                {account.name.split(" ")[0] || "Profile"}
              </Link>
            ) : (
              <button type="button" onClick={() => setLogin(true)} className="tk-login">
                Log in
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="tk-burger"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span data-on={open} />
              <span data-on={open} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="tk-menu" onClick={() => setOpen(false)}>
          <div className="tk-menu__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="tk-shell">
              <p className="tk-label" style={{ color: "var(--text-faint)" }}>Start here</p>
              <div className="tk-menu__primary">
                {PRIMARY.map((t, i) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="tk-menu__item tk-land"
                    style={{ animationDelay: `${i * 0.045}s` }}
                  >
                    <span className="tk-h2" style={{ fontSize: "1.35rem" }}>{t.label}</span>
                    <span className="tk-small" style={{ display: "block", marginTop: "0.25rem" }}>
                      {t.hint}
                    </span>
                  </Link>
                ))}
              </div>

              <p className="tk-label" style={{ marginTop: "2rem", color: "var(--text-faint)" }}>
                Everything else
              </p>
              <div className="tk-menu__secondary">
                {SECONDARY.map((t) => (
                  <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="tk-body tk-menu__link">
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {login && <AuthPanel onClose={() => setLogin(false)} />}
    </>
  );
}
