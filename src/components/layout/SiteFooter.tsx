import Link from "next/link";
import { navLinks, novelLink } from "@/content/nav";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas-deep">
      {/* The one solid block of colour on every page. The site is otherwise
          ink on bone, so this is where the palette gets to be loud. */}
      <div className="bg-azure">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-7 sm:px-10">
          <p className="font-display text-2xl leading-tight text-canvas-light sm:text-3xl">
            The Highest Branch <span className="text-ember-light">·</span> 19 October 2026
          </p>
          <Link
            href="/the-highest-branch"
            className="group inline-flex items-center gap-3 border border-canvas-light/50 px-6 py-3 text-xs uppercase tracking-[0.16em] text-canvas-light transition-colors hover:bg-canvas-light hover:text-azure"
          >
            <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
            The novel
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 sm:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="eyebrow">Correspondence</p>
            <p className="mt-4 max-w-md font-display text-3xl leading-tight sm:text-4xl">
              Letters from the archive, sent rarely.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              New research, journal entries, and news of{" "}
              <span className="italic text-ember">The Highest Branch</span> — only when there is
              something worth saying.
            </p>
            <div className="mt-7 max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <p className="eyebrow">Index</p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-ember transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">The Novel</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link
                  href={novelLink.href}
                  className="font-serif text-lg italic text-ember transition-opacity hover:opacity-70"
                >
                  {novelLink.label}
                </Link>
              </li>
              <li>
                <Link
                  href="/the-highest-branch#purchase"
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  Order a copy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line pt-7 text-xs text-ink-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Saadan Qasmani · Istanbul</p>
          <p className="font-serif italic">Writer, researcher, and strategist</p>
        </div>
      </div>
    </footer>
  );
}
