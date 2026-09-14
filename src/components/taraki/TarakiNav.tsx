"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TarakiMark } from "@/components/taraki/Logo";
import { ThemeToggle } from "@/components/taraki/ThemeToggle";

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
  { href: "/taraki/equivalence", label: "My grades", hint: "Convert O Level, A Level, Matric, FSc or IB" },
  { href: "/taraki/match", label: "Universities", hint: "141 of them, across twelve countries" },
  { href: "/taraki/plan", label: "Wish list", hint: "The universities you are going for" },
  { href: "/taraki/talk", label: "Get help", hint: "Talk to a counsellor or a student out there" },
];

const SECONDARY = [
  { href: "/taraki/apply", label: "How to apply" },
  { href: "/taraki/costs", label: "What it costs" },
  { href: "/taraki/scholarships", label: "Scholarships" },
  { href: "/taraki/pricing", label: "Pricing" },
  { href: "/taraki/contact", label: "Contact" },
];

export function TarakiNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [login, setLogin] = useState(false);

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
            <button type="button" onClick={() => setLogin(true)} className="tk-login">
              Log in
            </button>
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

      {login && <LoginPanel onClose={() => setLogin(false)} />}
    </>
  );
}

/**
 * There are no accounts yet, and saying so beats a button that does nothing.
 *
 * It is not an apology either: nothing on the site needs an account, and a
 * student can use all of it right now. What an account will add is the same
 * list on a second device.
 */
function LoginPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="tk-modal" onClick={onClose} role="dialog" aria-label="Log in">
      <div className="tk-pane tk-land tk-modal__box" onClick={(e) => e.stopPropagation()}>
        <span className="tk-label" style={{ color: "var(--accent)" }}>Accounts</span>
        <h2 className="tk-h2" style={{ marginTop: "0.8rem", fontSize: "1.3rem" }}>
          You do not need one yet.
        </h2>
        <p className="tk-body" style={{ marginTop: "0.8rem" }}>
          Everything here already works without signing in. Your grades, your university list and
          your documents are saved on this device as you go.
        </p>
        <p className="tk-body" style={{ marginTop: "0.8rem" }}>
          Accounts arrive with our own domain, so that a student&apos;s exam results are held
          somewhere built for them rather than borrowed. Until then, one caution: clearing your
          browser data clears your list.
        </p>
        <div style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <button type="button" onClick={onClose} className="tk-btn tk-btn--ghost">
            Carry on without one
          </button>
          <Link href="/taraki/contact" className="tk-btn tk-btn--primary">
            Tell me when they open
          </Link>
        </div>
      </div>
    </div>
  );
}
