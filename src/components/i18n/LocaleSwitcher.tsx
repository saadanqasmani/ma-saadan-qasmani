"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeMeta, localePath, stripLocale } from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

/**
 * The choice of language, offered on every page.
 *
 * Each option links to the same page in that language rather than to its
 * front door, so a reader three levels into the research archive who
 * switches to Russian stays where they were. Real links, not a form: they
 * can be opened in a new tab, copied, and followed by a search engine, which
 * is how the translations get found in the first place.
 *
 * Every language is written in its own script. A reader looking for Arabic
 * is looking for العربية, not for the English word "Arabic".
 */
export function LocaleSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const current = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const here = stripLocale(pathname || "/");

  useEffect(() => {
    if (!open) return;

    function onPointer(event: MouseEvent) {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = tone === "light" ? "text-canvas-light/80 hover:text-canvas-light" : "text-ink-soft hover:text-ink";

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${localeMeta[current].english} — change language`}
        className={cn(
          "flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
          label
        )}
      >
        <GlobeMark />
        <span className="normal-case tracking-normal">{localeMeta[current].label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute end-0 top-full z-[90] mt-3 min-w-[11rem] border border-line bg-canvas-light py-1.5 shadow-[0_18px_40px_-24px_rgba(21,20,15,0.55)]"
        >
          {locales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === current}>
              <Link
                href={localePath(here, locale)}
                hrefLang={localeMeta[locale].tag}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between gap-4 px-4 py-2 text-sm transition-colors hover:bg-canvas-deep",
                  locale === current ? "text-ink" : "text-ink-soft"
                )}
              >
                <span className="flex items-center gap-2.5">
                  {/* Decorative. A screen reader should say the language,
                      not the name of a country it is only shorthand for. */}
                  <span aria-hidden className="text-base leading-none">
                    {localeMeta[locale].flag}
                  </span>
                  {/* Only the name changes direction. Flipping the whole row
                      sends the flag to the far side and the list goes
                      ragged, since the list itself is in the page's
                      language, not in the one it is offering. */}
                  <span lang={localeMeta[locale].tag} dir={localeMeta[locale].dir}>
                    {localeMeta[locale].label}
                  </span>
                </span>
                {locale === current && <Tick />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A globe reduced to the two lines that read as one at eleven pixels. */
function GlobeMark() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="8" cy="8" rx="2.6" ry="6.25" stroke="currentColor" strokeWidth="1" />
      <path d="M1.9 8h12.2" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 text-ember" aria-hidden="true" fill="none">
      <path d="M1.5 6.4 4.4 9.2 10.5 2.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * The same choice, laid out flat.
 *
 * Inside the phone menu there is room to show every language at once, and a
 * dropdown inside a panel that is itself a dropdown is one layer too many.
 */
export function LocaleChoices({ onNavigate }: { onNavigate?: () => void }) {
  const current = useLocale();
  const pathname = usePathname();
  const here = stripLocale(pathname || "/");

  return (
    <ul className="flex flex-wrap gap-2">
      {locales.map((locale) => (
        <li key={locale}>
          <Link
            href={localePath(here, locale)}
            hrefLang={localeMeta[locale].tag}
            onClick={onNavigate}
            aria-current={locale === current ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 border px-3.5 py-2 text-sm transition-colors",
              locale === current
                ? "border-ink bg-ink text-canvas-light"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            <span aria-hidden className="text-base leading-none">
              {localeMeta[locale].flag}
            </span>
            <span lang={localeMeta[locale].tag} dir={localeMeta[locale].dir}>
              {localeMeta[locale].label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
