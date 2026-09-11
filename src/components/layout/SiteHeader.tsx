"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { navLinks, novelLink } from "@/content/nav";
import { Logo } from "@/components/layout/Logo";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MarginaliaIndicator } from "@/components/collect/MarginaliaIndicator";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { LocaleChoices, LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import type { Dictionary } from "@/content/i18n/en";
import { stripLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function SiteHeader({
  nav,
  chrome,
}: {
  nav: Dictionary["nav"];
  chrome: Dictionary["header"];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Compared without the language prefix, so the current page is marked as
  // current in every language rather than only in English.
  const here = stripLocale(pathname || "/");

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "sticky top-0 transition-all duration-500",
          // Above the phone menu while it is open, or the panel covers the
          // only control that closes it and a reader is stuck inside it.
          open ? "z-[85]" : "z-[65]",
          scrolled && !open
            ? "border-b border-line/70 bg-canvas/60 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <LocaleLink
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
            aria-label={chrome.home}
          >
            <Logo className="h-10 w-auto" />
            <span className="font-display text-lg tracking-tight">Saadan Qasmani</span>
          </LocaleLink>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <LocaleLink
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative t-label text-ink-soft transition-colors hover:text-ink",
                  here === link.href && "text-ink"
                )}
              >
                {nav[link.key]}
                <span
                  className={cn(
                    "absolute -bottom-1 start-0 h-px w-full origin-[left] scale-x-0 bg-ember transition-transform duration-400 ease-out group-hover:scale-x-100",
                    here === link.href && "scale-x-100"
                  )}
                />
              </LocaleLink>
            ))}
            <MarginaliaIndicator />
            <LocaleSwitcher />
            <LocaleLink
              href={novelLink.href}
              className="t-label group relative overflow-hidden border border-ink px-5 py-2.5 font-medium"
            >
              <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                {nav.novel}
              </span>
            </LocaleLink>
          </nav>

          {/* The phone's only way in.
              It used to be two hairlines with no label, on a paper texture,
              which readers did not recognise as a control at all: they saw
              the homepage and had no idea there was anything else. So it
              says what it is, sits inside a border, and is a full 44px
              target. */}
          <div className="flex items-center gap-3 lg:hidden">
            <MarginaliaIndicator />
            <button
              type="button"
              aria-label={open ? chrome.closeMenu : chrome.openMenu}
              aria-expanded={open}
              aria-controls="phone-menu"
              className="t-label relative z-[80] flex h-11 items-center gap-2.5 border border-ink px-4 font-semibold text-ink"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flex h-3.5 w-5 flex-col justify-between">
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-ink transition-transform duration-300",
                    open && "translate-y-[6px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-ink transition-opacity duration-200",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-ink transition-transform duration-300",
                    open && "-translate-y-[6px] -rotate-45"
                  )}
                />
              </span>
              {open ? chrome.closeMenu : chrome.menu}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            id="phone-menu"
            className="fixed inset-0 z-[75] overflow-y-auto bg-canvas lg:hidden"
          >
            <nav className="flex min-h-full flex-col px-6 pb-12 pt-28">
              <p className="eyebrow">{chrome.browse}</p>

              <ul className="mt-4 border-t border-line">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <LocaleLink
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={here === link.href ? "page" : undefined}
                      className="t-h1 flex items-baseline justify-between gap-4 py-5 text-ink"
                    >
                      <span>{nav[link.key]}</span>
                      <span
                        className={cn(
                          "t-label",
                          here === link.href ? "text-ember" : "text-ink-faint"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </LocaleLink>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <LocaleLink
                  href={novelLink.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-4 bg-ember px-5 py-4 text-canvas-light"
                >
                  <span className="font-display text-2xl leading-tight">{nav.novelTitle}</span>
                  <span className="t-label">{nav.novel}</span>
                </LocaleLink>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.45 }}
                className="mt-auto pt-12"
              >
                <p className="eyebrow mb-3">{chrome.language}</p>
                <LocaleChoices onNavigate={() => setOpen(false)} />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
