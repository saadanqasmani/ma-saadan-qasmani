"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { navLinks, novelLink } from "@/content/nav";
import { Logo } from "@/components/layout/Logo";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MarginaliaIndicator } from "@/components/collect/MarginaliaIndicator";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

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
          "sticky top-0 z-[65] transition-all duration-500",
          scrolled ? "border-b border-line bg-canvas/85 backdrop-blur-md" : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
            aria-label="Saadan Qasmani — home"
          >
            <Logo className="h-5 w-5" />
            <span className="font-display text-lg tracking-tight">Saadan Qasmani</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink",
                  pathname === link.href && "text-ink"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-400 ease-out group-hover:scale-x-100",
                    pathname === link.href && "scale-x-100"
                  )}
                />
              </Link>
            ))}
            <MarginaliaIndicator />
            <Link
              href={novelLink.href}
              className="group relative overflow-hidden border border-ink px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em]"
            >
              <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                The Novel
              </span>
            </Link>
          </nav>

          <div className="flex items-center gap-4 lg:hidden">
            <MarginaliaIndicator />
            <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-[80] flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "h-px w-6 bg-ink transition-transform duration-300",
                open && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-6 bg-ink transition-transform duration-300",
                open && "-translate-y-[3px] -rotate-45"
              )}
            />
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
            className="fixed inset-0 z-[75] bg-canvas lg:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-1 px-8">
              {[...navLinks, novelLink].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-4xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
