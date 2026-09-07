"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, novelLink } from "@/content/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-text/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-ink-text transition-colors hover:text-gold-bright"
          onClick={() => setOpen(false)}
        >
          Saadan Qasmani
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-sans uppercase tracking-[0.18em] text-ink-text-muted transition-colors hover:text-ink-text",
                pathname === link.href && "text-gold-bright"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={novelLink.href}
            className={cn(
              "border border-gold/50 px-4 py-2 text-xs font-sans uppercase tracking-[0.18em] text-gold-bright transition-colors hover:border-gold-bright hover:bg-gold/10",
              pathname === novelLink.href && "bg-gold/10"
            )}
          >
            {novelLink.label}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-ink-text lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink-text/10 px-6 pb-6 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-sans uppercase tracking-[0.14em] text-ink-text-muted hover:text-ink-text"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={novelLink.href}
            onClick={() => setOpen(false)}
            className="py-3 text-sm font-sans uppercase tracking-[0.14em] text-gold-bright"
          >
            {novelLink.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
