"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { EdvikoMark } from "@/components/edviko/Logo";
import { ThemeToggle } from "@/components/edviko/ThemeToggle";
import { Search } from "@/components/edviko/portal/Search";
import { endSession, useSession } from "@/components/edviko/auth/session";
import { write } from "@/lib/edviko/browserStore";
import { grouped, navFor, ROLES, ROLE_KEY, roleMeta, type Role } from "@/lib/edviko/roles";

/**
 * The frame the advisor, campus and family screens live in.
 *
 * A sidebar, because these lists are a dozen items long and a top bar that
 * long is an inventory rather than a navigation. Grouped under headings, so
 * finding something is three or four quick decisions instead of reading
 * twelve lines. Sections that are not built yet stay in the list, greyed:
 * somebody deciding whether to buy this should see the shape of the whole
 * thing, and somebody using it should never be dropped into a half-working
 * screen.
 *
 * The top bar always says where you are and who you are. Both were missing,
 * and on a system with four kinds of user and a role switch, "which of these
 * am I looking at" is a question the screen should never make anybody ask.
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
  const { account } = useSession();
  const items = navFor(role);
  const groups = grouped(items);
  const meta = roleMeta(role);

  // A real account, when one is signed in on this device and it is the same
  // kind of person as the screen being looked at. Otherwise the demo's own.
  const mine = account && roleMatches(account.role, role);
  const person = mine ? { name: account.name, line: who.line, code: account.code } : who;

  const here = [...items].sort((a, b) => b.href.length - a.href.length).find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  const deeper = here ? pathname !== here.href : false;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The points counter belongs to the student's side of the product. An
  // advisor triaging two hundred cases should not have a score in the corner
  // of the screen, and on a laptop it was landing on top of the panels.
  useEffect(() => {
    document.body.dataset.portal = "true";
    return () => {
      delete document.body.dataset.portal;
    };
  }, []);

  return (
    <div className="ev-portal">
      {open && <div className="ev-scrim" onClick={() => setOpen(false)} aria-hidden />}

      <aside className="ev-side" data-open={open}>
        <Link href="/edviko" className="ev-side__brand">
          <EdvikoMark size={24} />
          <span className="ev-font-display" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Edviko</span>
        </Link>

        <Link href="/edviko/account" className="ev-side__who">
          <p className="ev-label" style={{ color: "var(--accent)" }}>{meta.label}</p>
          <p style={{ fontWeight: 600, marginTop: "0.35rem" }}>{person.name}</p>
          <p className="ev-small" style={{ color: "var(--text-faint)" }}>{person.line}</p>
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.35rem", fontVariantNumeric: "tabular-nums" }}>
            {person.code}
          </p>
          {!mine && (
            <p className="ev-small" style={{ color: "var(--paid)", marginTop: "0.5rem" }}>
              Demo account. Sign in to see your own.
            </p>
          )}
        </Link>

        <nav style={{ display: "grid", gap: "1rem" }}>
          {groups.map((g) => (
            <div key={g.group}>
              <p className="ev-label" style={{ color: "var(--text-faint)", padding: "0 0.75rem 0.4rem" }}>{g.group}</p>
              <div style={{ display: "grid", gap: "0.15rem" }}>
                {g.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ev-side__link"
                    data-on={item.href === pathname || (here?.href === item.href && deeper)}
                    data-soon={!item.built}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                    {!item.built && <span className="ev-small" style={{ opacity: 0.7 }}>soon</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
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

          {account ? (
            <button
              type="button"
              onClick={() => endSession()}
              className="ev-side__link"
              style={{ width: "100%", marginTop: "0.6rem", fontSize: "0.875rem", background: "none", border: 0, cursor: "pointer", textAlign: "start" }}
            >
              Sign out
            </button>
          ) : (
            <div style={{ display: "grid", gap: "0.2rem", marginTop: "0.6rem" }}>
              <Link href="/edviko/signin" className="ev-side__link" style={{ fontSize: "0.875rem" }}>Sign in</Link>
              <Link href="/edviko/join" className="ev-side__link" style={{ fontSize: "0.875rem" }}>Join Edviko</Link>
            </div>
          )}

          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.75rem" }}>
            Switching role is a view, not a permission. When there are accounts, each of these shows
            only what that person is allowed to see.
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

          <nav aria-label="Where you are" style={{ flex: 1, minWidth: 0 }}>
            <p className="ev-small" style={{ color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <Link href={meta.home} style={{ color: "var(--text-soft)" }}>{meta.label}</Link>
              {here && here.href !== meta.home && (
                <>
                  {" / "}
                  <Link href={here.href} style={{ color: deeper ? "var(--text-soft)" : "var(--text)" }}>{here.label}</Link>
                </>
              )}
              {deeper && <> / <span style={{ color: "var(--text)" }}>case file</span></>}
            </p>
          </nav>

          {role !== "family" && <Search />}

          <Link href="/edviko/account" className="ev-small" style={{ color: "var(--text-soft)", whiteSpace: "nowrap" }}>
            {account ? account.name.split(" ")[0] : "Sign in"}
          </Link>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}

/** A family account belongs on the family screens, and so on. */
function roleMatches(accountRole: string, role: Role): boolean {
  return accountRole === role;
}
