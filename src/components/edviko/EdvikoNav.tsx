"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EdvikoMark } from "@/components/edviko/Logo";
import { ThemeToggle } from "@/components/edviko/ThemeToggle";
import { useAccount } from "@/components/edviko/Account";
import { useSession } from "@/components/edviko/auth/session";
import { grouped, STUDENT_NAV } from "@/lib/edviko/roles";

/**
 * Four places in the bar, and everything else behind a menu that is sorted.
 *
 * It was eleven tabs in a row, which on a phone meant scrolling sideways
 * through a list with no shape to it. Eleven equal things are not a
 * navigation, they are an inventory, and a reader faced with one does not
 * know where to begin.
 *
 * These four are the questions a student actually arrives with, in the order
 * they arrive: what am I for, what are my grades worth, where could I go,
 * and what am I going for. Everything else is real but secondary, and the
 * menu groups it rather than listing it, so the page somebody wants is a
 * heading away rather than a scan of a dozen lines.
 *
 * The bar also says who is signed in, or offers the two ways not to be.
 * "Am I signed in" is a question no screen should make anybody ask.
 */

const PRIMARY = [
  { href: "/edviko/career", label: "My career", hint: "Four questions. Start here, before universities." },
  { href: "/edviko/equivalence", label: "My grades", hint: "Convert O Level, A Level, Matric, FSc or IB" },
  { href: "/edviko/match", label: "Universities", hint: "141 of them, across twelve countries" },
  { href: "/edviko/plan", label: "Wish list", hint: "The universities you are going for" },
];

const PRIMARY_HREFS = PRIMARY.map((p) => p.href);

export function EdvikoNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const profile = useAccount();
  const { account } = useSession();

  const name = account?.name ?? profile?.name ?? null;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rest = grouped(STUDENT_NAV.filter((i) => !PRIMARY_HREFS.includes(i.href) && i.href !== "/edviko"));

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
            {name ? (
              <Link href="/edviko/account" className="ev-login">{name.split(" ")[0]}</Link>
            ) : (
              <>
                <Link href="/edviko/signin" className="ev-small" style={{ color: "var(--text-soft)" }}>Sign in</Link>
                <Link href="/edviko/join" className="ev-login">Join</Link>
              </>
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
                    data-on={pathname.startsWith(t.href)}
                    style={{ animationDelay: `${i * 0.045}s` }}
                  >
                    <span className="ev-h2" style={{ fontSize: "1.35rem" }}>{t.label}</span>
                    <span className="ev-small" style={{ display: "block", marginTop: "0.25rem" }}>
                      {t.hint}
                    </span>
                  </Link>
                ))}
              </div>

              {rest.map((g) => (
                <div key={g.group}>
                  <p className="ev-label" style={{ marginTop: "2rem", color: "var(--text-faint)" }}>
                    {g.group === "The work" ? "The rest of the plan" : g.group === "Reference" ? "Your record" : g.group}
                  </p>
                  <div className="ev-menu__secondary">
                    {g.items.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        onClick={() => setOpen(false)}
                        className="ev-body ev-menu__link"
                        data-on={pathname === t.href}
                      >
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <p className="ev-label" style={{ marginTop: "2rem", color: "var(--text-faint)" }}>Edviko</p>
              <div className="ev-menu__secondary">
                <Link href="/edviko/pricing" onClick={() => setOpen(false)} className="ev-body ev-menu__link">Pricing</Link>
                <Link href="/edviko/contact" onClick={() => setOpen(false)} className="ev-body ev-menu__link">Contact</Link>
                {name ? (
                  <Link href="/edviko/account" onClick={() => setOpen(false)} className="ev-body ev-menu__link">Your account</Link>
                ) : (
                  <>
                    <Link href="/edviko/signin" onClick={() => setOpen(false)} className="ev-body ev-menu__link">Sign in</Link>
                    <Link href="/edviko/join" onClick={() => setOpen(false)} className="ev-body ev-menu__link">Join Edviko</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
