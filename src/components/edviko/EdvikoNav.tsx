"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EdvikoMark } from "@/components/edviko/Logo";
import { ThemeToggle } from "@/components/edviko/ThemeToggle";
import { AuthPanel, useAccount } from "@/components/edviko/Account";

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
  { href: "/edviko/career", label: "My career", hint: "Four questions. Start here, before universities." },
  { href: "/edviko/equivalence", label: "My grades", hint: "Convert O Level, A Level, Matric, FSc or IB" },
  { href: "/edviko/match", label: "Universities", hint: "141 of them, across twelve countries" },
  { href: "/edviko/plan", label: "Wish list", hint: "The universities you are going for" },
];

const SECONDARY = [
  { href: "/edviko/profile", label: "My record" },
  { href: "/edviko/costs", label: "What it costs" },
  { href: "/edviko/talk", label: "Get help" },
  { href: "/edviko/apply", label: "How to apply" },
  { href: "/edviko/scholarships", label: "Scholarships" },
  { href: "/edviko/pricing", label: "Pricing" },
  { href: "/edviko/contact", label: "Contact" },
];

export function EdvikoNav() {
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
      <header className="ev-header" style={open ? { zIndex: 80 } : undefined}>
        <div className="ev-shell ev-header__row">
          <Link href="/edviko" className="ev-header__brand">
            <EdvikoMark size={26} />
            <span className="ev-header__name">Edviko</span>
          </Link>

          {/* Desktop: the four. */}
          <nav className="ev-header__links">
            {PRIMARY.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="ev-navlink"
                data-on={pathname.startsWith(t.href)}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="ev-header__right">
            <ThemeToggle />
            {account ? (
              <Link href="/edviko/profile" className="ev-login">
                {account.name.split(" ")[0] || "Profile"}
              </Link>
            ) : (
              <button type="button" onClick={() => setLogin(true)} className="ev-login">
                Log in
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ev-burger"
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
        <div className="ev-menu" onClick={() => setOpen(false)}>
          <div className="ev-menu__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ev-shell">
              <p className="ev-label" style={{ color: "var(--text-faint)" }}>Start here</p>
              <div className="ev-menu__primary">
                {PRIMARY.map((t, i) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="ev-menu__item ev-land"
                    style={{ animationDelay: `${i * 0.045}s` }}
                  >
                    <span className="ev-h2" style={{ fontSize: "1.35rem" }}>{t.label}</span>
                    <span className="ev-small" style={{ display: "block", marginTop: "0.25rem" }}>
                      {t.hint}
                    </span>
                  </Link>
                ))}
              </div>

              <p className="ev-label" style={{ marginTop: "2rem", color: "var(--text-faint)" }}>
                Everything else
              </p>
              <div className="ev-menu__secondary">
                {SECONDARY.map((t) => (
                  <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="ev-body ev-menu__link">
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
