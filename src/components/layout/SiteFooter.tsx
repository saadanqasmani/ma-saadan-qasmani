import Link from "next/link";
import { navLinks, novelLink } from "@/content/nav";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-text/10 bg-ink-deep">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl text-ink-text">Enter the correspondence.</p>
            <p className="mt-3 max-w-sm text-sm text-ink-text-muted">
              New publications, research, journal entries, and news of{" "}
              <em className="text-gold-bright not-italic">The Highest Branch</em> — sent
              rarely, and only when there is something worth saying.
            </p>
            <div className="mt-6">
              <NewsletterForm compact />
            </div>
          </div>

          <div>
            <p className="text-xs font-sans uppercase tracking-[0.18em] text-ink-text-muted">
              Index
            </p>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-text-muted transition-colors hover:text-ink-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-sans uppercase tracking-[0.18em] text-ink-text-muted">
              The Novel
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href={novelLink.href}
                  className="text-sm text-gold-bright transition-colors hover:text-gold"
                >
                  {novelLink.label}
                </Link>
              </li>
              <li>
                <Link
                  href="/the-highest-branch#purchase"
                  className="text-sm text-ink-text-muted transition-colors hover:text-ink-text"
                >
                  Purchase
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink-text/10 pt-8 text-xs text-ink-text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Saadan Qasmani. Istanbul.</p>
          <p className="font-serif italic text-ink-text-muted/80">
            The Highest Branch
          </p>
        </div>
      </div>
    </footer>
  );
}
