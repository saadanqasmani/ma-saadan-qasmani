"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import type { Dictionary } from "@/content/i18n/en";
import { defaultLocale, stripLocale } from "@/lib/i18n/config";

/**
 * Remembered for the length of one visit, not for good.
 *
 * Session storage rather than local: moving between pages inside a visit
 * must not reopen it, but coming back tomorrow should. Which panel opens
 * then depends on whether the address was ever left.
 */
const VISIT = "thb-announcement-visit";

/**
 * The one interruption on the site: the novel is coming, and here is where
 * to leave an address for the day it does.
 *
 * It waits a moment before appearing, so the page a reader came for gets to
 * arrive first. It closes on Escape, on the backdrop, and on its own button,
 * and stays closed for the rest of that visit.
 *
 * It opens once per visit and asks for the order, which since publication
 * day is a thing every reader can act on: direct in Türkiye and Pakistan,
 * and on Amazon everywhere Amazon reaches. Both are offered, the direct
 * one first, because that is the one that does not take a cut and the one
 * that reaches the two countries Amazon will not deliver to.
 *
 * A native <dialog> rather than a div: focus goes in and stays in, Escape
 * works, and the rest of the page is inert for a screen reader without any
 * of that having to be rebuilt by hand.
 */
export function BookAnnouncement({
  copy,
  cover,
  amazonUrl,
}: {
  copy: Dictionary["announcement"];
  cover: string | null;
  /** The paperback listing, when there is one to send a reader to. */
  amazonUrl?: string | null;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Nobody needs to be told about the novel on the novel's own page.
  //
  // English is served unprefixed, so `stripLocale` leaves an explicit
  // `/en/...` alone — and that alias is a real address somebody can land
  // on. Both spellings are checked, or the panel opens over the shop.
  const here = stripLocale(pathname || "/");
  const onNovelPage =
    here.startsWith("/the-highest-branch") ||
    here.startsWith(`/${defaultLocale}/the-highest-branch`);

  const remember = useCallback(() => {
    try {
      window.sessionStorage.setItem(VISIT, "1");
    } catch {
      // Nothing to remember it with. It will open again on the next page,
      // which is worse than it should be but better than never opening.
    }
  }, []);

  useEffect(() => {
    if (onNovelPage) return;

    let shownThisVisit = false;
    try {
      shownThisVisit = window.sessionStorage.getItem(VISIT) === "1";
    } catch {
      // Storage blocked: show it, rather than never showing it.
    }
    if (shownThisVisit) return;

    const timer = window.setTimeout(() => {
      setMounted(true);
      remember();
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [onNovelPage, remember]);

  useEffect(() => {
    if (!mounted) return;
    const node = dialog.current;
    if (!node || node.open) return;
    node.showModal();
  }, [mounted]);

  const close = useCallback(() => {
    remember();
    dialog.current?.close();
    setMounted(false);
  }, [remember]);

  if (!mounted) return null;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="announcement-heading"
      onClose={remember}
      onCancel={remember}
      // Clicks land on the dialog itself only when they miss the panel
      // inside it, which is what a click on the backdrop is.
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
      className="announcement-dialog w-[min(34rem,calc(100vw-2rem))] border border-ink/20 bg-azure p-0 text-canvas-light shadow-[0_40px_100px_-40px_rgba(11,20,50,0.8)] backdrop:bg-ink/60"
    >
      <div className="relative flex flex-col gap-6 p-7 sm:flex-row sm:gap-7 sm:p-9">
        <button
          type="button"
          onClick={close}
          aria-label={copy.dismiss}
          className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center text-canvas-light/70 transition-colors hover:text-canvas-light"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="M2.5 2.5l11 11m0-11l-11 11" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        {cover && (
          <div className="shrink-0 self-start">
            <Image
              src={cover}
              alt=""
              width={132}
              height={200}
              className="h-auto w-24 border border-canvas-light/25 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.7)] sm:w-32"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="t-label font-semibold text-ember-light">
            {copy.eyebrow}
          </p>
          <h2
            id="announcement-heading"
            className="mt-2.5 pe-8 font-display text-3xl leading-[1.05] sm:text-4xl"
          >
            {copy.heading}
          </h2>
          <p className="t-body mt-3.5 text-canvas-light/85">
            {copy.body}
          </p>
          {/* The order, first and as a button: it is the thing being asked
              for, and it is the only door open to Türkiye and Pakistan. */}
          <LocaleLink
            href="/the-highest-branch#purchase"
            onClick={close}
            className="t-label group relative mt-5 inline-flex overflow-hidden bg-canvas-light px-7 py-3.5 text-ink"
          >
            <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative transition-colors group-hover:text-canvas-light">
              {copy.order}
            </span>
          </LocaleLink>

          {/* And under it, everywhere Amazon reaches. Second, and quieter:
              it is the same book through somebody else's shop. */}
          {amazonUrl && (
            <div className="mt-6 border-t border-canvas-light/15 pt-5">
              <p className="text-sm leading-relaxed text-canvas-light/70">{copy.ask}</p>
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="t-label mt-4 inline-flex border border-canvas-light/40 px-6 py-3 text-canvas-light transition-colors hover:border-canvas-light hover:bg-canvas-light hover:text-ink"
              >
                {copy.amazon}
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <LocaleLink
              href="/the-highest-branch"
              onClick={close}
              className="t-label group inline-flex items-center gap-2 text-canvas-light/70 transition-colors hover:text-canvas-light"
            >
              <span className="inline-block h-px w-5 bg-current transition-all duration-300 group-hover:w-8" />
              {copy.readMore}
            </LocaleLink>
            <button
              type="button"
              onClick={close}
              className="t-label text-canvas-light/55 transition-colors hover:text-canvas-light"
            >
              {copy.later}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
